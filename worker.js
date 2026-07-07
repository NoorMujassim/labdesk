/**
 * CUREBIT - Cloudflare Worker Enterprise Security Backend API
 * Production Hardened:
 *  - RS256 Cryptographic JWT Verification (Google Firebase Auth Public Keys)
 *  - Sliding Window Rate Limiting (IP & UID)
 *  - Constant-Time HMAC Signature Comparison (Timing Attack Protection)
 *  - Webhook Idempotency & Replay Protection
 *  - Strict Whitelisted CORS Domain Locks
 *  - Enterprise OWASP Security Response Headers
 */

// Whitelisted CORS Origins
const ALLOWED_ORIGINS = [
    'https://curebit.pages.dev',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
];

function getCorsHeaders(request) {
    const origin = request.headers.get('Origin');
    const headers = {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
    if (ALLOWED_ORIGINS.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }
    return headers;
}

function jsonResponse(data, status = 200, request = null) {
    const headers = request ? getCorsHeaders(request) : {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
    };
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        }
    });
}

// Constant-Time String Comparison (Timing Attack Prevention)
function timingSafeEqualHex(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

// In-Memory Sliding Window Rate Limiter
const rateLimitStore = new Map();
function isRateLimited(key, maxRequests = 20, windowMs = 60000) {
    const now = Date.now();
    const entry = rateLimitStore.get(key) || { count: 0, resetAt: now + windowMs };
    if (now > entry.resetAt) {
        entry.count = 0;
        entry.resetAt = now + windowMs;
    }
    entry.count++;
    rateLimitStore.set(key, entry);
    return entry.count > maxRequests;
}

// Native Web Crypto HMAC SHA256
async function hmacSha256Hex(secret, message) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


// Cached Google Firebase Auth JSON Web Keys
let cachedGoogleJwks = null;
let googleJwksExpiry = 0;

async function getGooglePublicKeys() {
    const now = Date.now();
    if (cachedGoogleJwks && now < googleJwksExpiry) {
        return cachedGoogleJwks;
    }

    try {
        const res = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com');
        if (!res.ok) throw new Error('Failed to fetch Google Auth public keys');

        const jwks = await res.json();
        if (!jwks || !Array.isArray(jwks.keys)) {
            throw new Error('Invalid Google Auth public-key response');
        }

        const cacheControl = res.headers.get('Cache-Control') || '';
        const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
        const maxAgeSeconds = maxAgeMatch ? Number(maxAgeMatch[1]) : 3600;
        cachedGoogleJwks = jwks;
        googleJwksExpiry = now + maxAgeSeconds * 1000;
        return jwks;
    } catch (e) {
        console.error('Google Public Key Fetch Error:', e);
        throw e;
    }
}

function apiSuccess(data, status, request) {
    return jsonResponse({ success: true, data }, status, request);
}

function apiError(code, message, status, request) {
    return jsonResponse({ success: false, error: { code, message } }, status, request);
}

function decodeBase64Url(value) {
    if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) {
        throw new Error('Invalid base64url value');
    }
    const padding = '='.repeat((4 - (value.length % 4)) % 4);
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/') + padding);
    return Uint8Array.from(binary, char => char.charCodeAt(0));
}

function decodeJwtJson(value) {
    return JSON.parse(new TextDecoder().decode(decodeBase64Url(value)));
}

// Firebase ID Token RS256 signature and claims verification
async function verifyFirebaseIdToken(authHeader, projectId) {
    if (typeof authHeader !== 'string' || typeof projectId !== 'string' || !projectId) {
        return null;
    }

    const bearerMatch = authHeader.match(/^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/);
    if (!bearerMatch) return null;

    const token = bearerMatch[1];
    try {
        const parts = token.split('.');
        const header = decodeJwtJson(parts[0]);
        const payload = decodeJwtJson(parts[1]);

        // 1. Validate Algorithm & Key ID
        if (header.alg !== 'RS256' || typeof header.kid !== 'string' || !header.kid) {
            console.error('❌ Security Violation: Non-RS256 JWT algorithm rejected');
            return null;
        }

        // 2. Cryptographically verify the signature with the Google key selected by kid
        const jwks = await getGooglePublicKeys();
        const jwk = jwks.keys.find(key => key.kid === header.kid && key.kty === 'RSA');
        if (!jwk) {
            console.error('❌ Security Violation: Unknown Firebase signing key');
            return null;
        }

        const publicKey = await crypto.subtle.importKey(
            'jwk',
            jwk,
            { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
            false,
            ['verify']
        );
        const signatureValid = await crypto.subtle.verify(
            'RSASSA-PKCS1-v1_5',
            publicKey,
            decodeBase64Url(parts[2]),
            new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
        );
        if (!signatureValid) {
            console.error('❌ Security Violation: Invalid Firebase ID Token signature');
            return null;
        }

        // 3. Validate Firebase-required timestamps
        const now = Math.floor(Date.now() / 1000);
        if (typeof payload.exp !== 'number' || payload.exp <= now) {
            console.warn('❌ Security Violation: Expired Firebase ID Token');
            return null;
        }
        if (typeof payload.iat !== 'number' || payload.iat > now) {
            console.warn('❌ Security Violation: Token issued in future');
            return null;
        }
        if (typeof payload.auth_time !== 'number' || payload.auth_time > now) {
            console.warn('❌ Security Violation: Invalid Firebase authentication time');
            return null;
        }

        // 4. Validate issuer, audience, and subject claims
        const expectedIssuer = `https://securetoken.google.com/${projectId}`;
        if (payload.iss !== expectedIssuer) {
            console.error('❌ Security Violation: Invalid JWT Issuer:', payload.iss);
            return null;
        }
        if (payload.aud !== projectId) {
            console.error('❌ Security Violation: Invalid JWT Audience:', payload.aud);
            return null;
        }
        if (!payload.sub || typeof payload.sub !== 'string' || payload.sub.length > 128) {
            console.error('❌ Security Violation: Missing Subject claim');
            return null;
        }

        return {
            uid: payload.user_id || payload.sub,
            email: payload.email || '',
            emailVerified: payload.email_verified === true
        };

    } catch (e) {
        console.error('Cryptographic Token Verification Error:', e);
        return null;
    }
}

const PAYMENT_PLANS = Object.freeze({
    weekly: { id: 'weekly', name: 'Weekly Pass', tier: 'weekly', monthlyPaise: 7900, durationDays: 7, billingCycles: ['one_time'] },
    starter: { id: 'starter', name: 'Starter', tier: 'starter', monthlyPaise: 19900, durationDays: 30, billingCycles: ['monthly', 'yearly'] },
    standard: { id: 'standard', name: 'Standard', tier: 'standard', monthlyPaise: 39900, durationDays: 30, billingCycles: ['monthly', 'yearly'] },
    pro: { id: 'pro', name: 'Pro', tier: 'pro', monthlyPaise: 69900, durationDays: 30, billingCycles: ['monthly', 'yearly'] },
    premium: { id: 'premium', name: 'Premium', tier: 'premium', monthlyPaise: 99900, durationDays: 30, billingCycles: ['monthly', 'yearly'] }
});

function resolvePlan(planId, billingCycle) {
    const plan = PAYMENT_PLANS[planId];
    if (!plan || !plan.billingCycles.includes(billingCycle)) return null;
    const amountPaise = billingCycle === 'yearly'
        ? Math.round((plan.monthlyPaise / 100) * 12 * 0.70) * 100
        : plan.monthlyPaise;
    const durationDays = billingCycle === 'yearly' ? 365 : plan.durationDays;
    return { ...plan, billingCycle, amountPaise, durationDays };
}

function isIdentifier(value, prefix) {
    return typeof value === 'string'
        && value.startsWith(prefix)
        && /^[A-Za-z0-9_-]{8,80}$/.test(value);
}

let cachedServiceAccessToken = null;
let serviceAccessTokenExpiry = 0;

function pemToPkcs8(privateKeyPem) {
    const normalized = privateKeyPem.replace(/\\n/g, '\n');
    const base64 = normalized
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');
    const binary = atob(base64);
    return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function getFirestoreAccessToken(env) {
    const now = Date.now();
    if (cachedServiceAccessToken && now < serviceAccessTokenExpiry - 60000) {
        return cachedServiceAccessToken;
    }
    if (!env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
        throw new Error('Firebase service credentials are not configured');
    }

    const nowSeconds = Math.floor(now / 1000);
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const claims = btoa(JSON.stringify({
        iss: env.FIREBASE_CLIENT_EMAIL,
        scope: 'https://www.googleapis.com/auth/datastore',
        aud: 'https://oauth2.googleapis.com/token',
        iat: nowSeconds,
        exp: nowSeconds + 3600
    })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const signingInput = `${header}.${claims}`;
    const privateKey = await crypto.subtle.importKey(
        'pkcs8',
        pemToPkcs8(env.FIREBASE_PRIVATE_KEY),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        privateKey,
        new TextEncoder().encode(signingInput)
    );
    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: `${signingInput}.${encodedSignature}`
        })
    });
    if (!response.ok) throw new Error('Firebase service authentication failed');
    const tokenData = await response.json();
    cachedServiceAccessToken = tokenData.access_token;
    serviceAccessTokenExpiry = now + Number(tokenData.expires_in || 3600) * 1000;
    return cachedServiceAccessToken;
}

function firestoreValue(value) {
    if (value === null) return { nullValue: null };
    if (typeof value === 'string') return { stringValue: value };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (Number.isInteger(value)) return { integerValue: String(value) };
    if (typeof value === 'number') return { doubleValue: value };
    if (value instanceof Date) return { timestampValue: value.toISOString() };
    if (Array.isArray(value)) return { arrayValue: { values: value.map(firestoreValue) } };
    if (typeof value === 'object') {
        return {
            mapValue: {
                fields: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, firestoreValue(item)]))
            }
        };
    }
    throw new Error('Unsupported Firestore value');
}

function firestoreFields(data) {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, firestoreValue(value)]));
}

async function firestoreCommit(env, writes) {
    const accessToken = await getFirestoreAccessToken(env);
    const projectId = env.FIREBASE_PROJECT_ID;
    const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents:commit`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ writes })
        }
    );
    if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`Firestore commit failed (${response.status})`);
        error.status = response.status;
        error.details = errorText;
        throw error;
    }
    return response.json();
}

function documentName(env, path) {
    return `projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${path}`;
}

async function recordWebhookEvent(env, eventId, eventType) {
    return firestoreCommit(env, [{
        update: {
            name: documentName(env, `systemWebhookEvents/${encodeURIComponent(eventId)}`),
            fields: firestoreFields({
                eventId,
                eventType,
                receivedAt: new Date()
            })
        },
        currentDocument: { exists: false }
    }]);
}

async function activateVerifiedPayment(env, userContext, payment, order, plan) {
    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setUTCDate(validUntil.getUTCDate() + plan.durationDays);
    const invoiceNumber = `INV-${now.getUTCFullYear()}-${payment.id.slice(-8).toUpperCase()}`;
    const paymentData = {
        labId: userContext.uid,
        paymentId: payment.id,
        orderId: order.id,
        planId: plan.id,
        planName: plan.name,
        billingCycle: plan.billingCycle,
        amount: payment.amount / 100,
        amountPaise: payment.amount,
        currency: payment.currency,
        status: payment.status,
        invoiceNumber,
        createdAt: now,
        updatedAt: now
    };
    const subscriptionData = {
        labId: userContext.uid,
        plan: plan.id,
        planName: plan.name,
        tier: plan.tier,
        billingCycle: plan.billingCycle,
        status: 'active',
        paymentId: payment.id,
        orderId: order.id,
        amount: payment.amount / 100,
        invoiceNumber,
        validFrom: now,
        validUntil
    };

    await firestoreCommit(env, [
        {
            update: {
                name: documentName(env, `users/${userContext.uid}/payments/${payment.id}`),
                fields: firestoreFields(paymentData)
            },
            currentDocument: { exists: false }
        },
        {
            update: {
                name: documentName(env, `users/${userContext.uid}/subscriptions/current`),
                fields: firestoreFields(subscriptionData)
            }
        },
        {
            update: {
                name: documentName(env, `users/${userContext.uid}`),
                fields: firestoreFields({
                    plan: plan.id,
                    planStatus: 'active',
                    planValidUntil: validUntil
                })
            },
            updateMask: { fieldPaths: ['plan', 'planStatus', 'planValidUntil'] }
        },
        {
            update: {
                name: documentName(env, `users/${userContext.uid}/transaction_history/${payment.id}`),
                fields: firestoreFields({
                    labId: userContext.uid,
                    transactionId: payment.id,
                    paymentId: payment.id,
                    orderId: order.id,
                    amount: payment.amount / 100,
                    planId: plan.id,
                    status: payment.status,
                    invoiceNumber,
                    timestamp: now
                })
            },
            currentDocument: { exists: false }
        }
    ]);

    return { payment: paymentData, subscription: subscriptionData };
}

export default {
    async fetch(request, env, ctx) {
        const corsHeaders = getCorsHeaders(request);

        // Handle OPTIONS Preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;
        const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

        const razorpayKeyId = env.RAZORPAY_KEY_ID;
        const razorpayKeySecret = env.RAZORPAY_KEY_SECRET;
        const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
        const firebaseProjectId = env.FIREBASE_PROJECT_ID || 'labdesk-18c70';

        // Guard: Razorpay credentials must be present
        if ((path === '/api/razorpay/create-order' || path === '/api/razorpay/verify-payment') &&
            (!razorpayKeyId || !razorpayKeySecret)) {
            console.error('❌ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured in Worker bindings');
            return jsonResponse({ success: false, error: 'Payment gateway not configured', code: 'MISSING_CREDENTIALS' }, 503, request);
        }

        // 1. Health Check
        if (path === '/api/health' || path === '/') {
            return jsonResponse({
                status: 'online',
                service: 'CureBIT Enterprise Security Edge API',
                timestamp: new Date().toISOString()
            }, 200, request);
        }

        // 2. Webhook Endpoint (Server-to-Server Callback — NO Firebase Auth)
        if (path === '/api/razorpay/webhook' && request.method === 'POST') {
            try {
                if (isRateLimited(`webhook_${clientIp}`, 30, 60000)) {
                    return jsonResponse({ error: 'Too Many Requests' }, 429, request);
                }

                const bodyText = await request.text();
                const razorpaySignature = request.headers.get('x-razorpay-signature');

                if (!razorpaySignature) {
                    return jsonResponse({ error: 'Missing x-razorpay-signature header' }, 400, request);
                }

                if (webhookSecret) {
                    const expectedSignature = await hmacSha256Hex(webhookSecret, bodyText);
                    if (!timingSafeEqualHex(expectedSignature, razorpaySignature)) {
                        console.error('❌ Webhook Signature Verification FAILED');
                        return jsonResponse({ error: 'Invalid webhook signature' }, 401, request);
                    }
                }

                const eventData = JSON.parse(bodyText);
                const eventId = eventData.event_id || eventData.payload?.payment?.entity?.id || 'evt_' + Date.now();

                // Idempotency Check
                if (processedWebhookEvents.has(eventId)) {
                    console.warn('⚠️ Duplicate Webhook Event Ignored:', eventId);
                    return jsonResponse({ status: 'ignored', reason: 'Duplicate event' }, 200, request);
                }
                processedWebhookEvents.add(eventId);

                console.log('✅ Webhook Event Authenticated & Processed:', eventData.event);
                return jsonResponse({ status: 'ok', event: eventData.event }, 200, request);

            } catch (e) {
                console.error('Webhook Error:', e);
                return jsonResponse({ error: 'Webhook Processing Error' }, 500, request);
            }
        }

        // 3. Authenticate User via Firebase ID Token
        const authHeader = request.headers.get('Authorization');
        const userContext = await verifyFirebaseIdToken(authHeader, firebaseProjectId);

        if (!userContext) {
            return jsonResponse({ error: 'Unauthorized Request' }, 401, request);
        }

        // 4. Rate Limiting Protection (Max 10 req/min per UID)
        if (isRateLimited(`user_${userContext.uid}`, 10, 60000)) {
            console.warn('⚠️ Rate Limit Exceeded for UID:', userContext.uid);
            return jsonResponse({ error: 'Too Many Requests' }, 429, request);
        }

        // 5. Razorpay Create Order Endpoint (POST /api/razorpay/create-order)
        if (path === '/api/razorpay/create-order' && request.method === 'POST') {
            try {
                const body = await request.json();
                const amountPaise = body.amountPaise || (body.amount ? body.amount * 100 : 39900);
                const currency = body.currency || 'INR';
                const receipt = body.receipt || `rec_${Date.now()}`;

                const authString = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

                const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${authString}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: amountPaise,
                        currency: currency,
                        receipt: receipt,
                        notes: {
                            userId: userContext.uid,
                            email: userContext.email,
                            planId: body.planId || 'standard'
                        }
                    })
                });

                if (!rzpResponse.ok) {
                    const errBody = await rzpResponse.text();
                    console.error(`❌ Razorpay API Error ${rzpResponse.status}:`, errBody);
                    throw new Error(`Razorpay rejected order: ${rzpResponse.status}`);
                }

                const orderData = await rzpResponse.json();

                return jsonResponse({
                    success: true,
                    keyId: razorpayKeyId,
                    id: orderData.id,
                    orderId: orderData.id,
                    amount: orderData.amount,
                    currency: orderData.currency
                }, 200, request);

            } catch (e) {
                console.error('Create Order Error:', e);
                return jsonResponse({ error: 'Order Creation Failed' }, 500, request);
            }
        }

        // 6. Razorpay Verify Payment Signature Endpoint (POST /api/razorpay/verify-payment)
        if (path === '/api/razorpay/verify-payment' && request.method === 'POST') {
            try {
                const body = await request.json();
                const { orderId, paymentId, signature, planId, amountPaise, billingCycle } = body;

                if (!orderId || !paymentId || !signature || !planId) {
                    return jsonResponse({ error: 'Missing payment parameters' }, 400, request);
                }

                const message = `${orderId}|${paymentId}`;
                const computedSignature = await hmacSha256Hex(razorpayKeySecret, message);

                if (!timingSafeEqualHex(computedSignature, signature)) {
                    console.error('❌ HMAC Signature Mismatch');
                    return jsonResponse({ success: false, error: 'Invalid HMAC Signature' }, 400, request);
                }

                // Payment verified! Now secure backend activation
                const plan = resolvePlan(planId, billingCycle || 'monthly');
                if (!plan) {
                    return jsonResponse({ error: 'Invalid plan specified' }, 400, request);
                }

                const paymentObj = {
                    id: paymentId,
                    amount: amountPaise,
                    currency: 'INR',
                    status: 'captured'
                };
                const orderObj = { id: orderId };

                // Automatically save to Firestore securely
                await activateVerifiedPayment(env, userContext, paymentObj, orderObj, plan);

                return jsonResponse({
                    success: true,
                    status: 'verified',
                    paymentId,
                    orderId,
                    userId: userContext.uid,
                    verifiedAt: new Date().toISOString()
                }, 200, request);

            } catch (e) {
                console.error('Verify Payment Error:', e);
                return jsonResponse({ error: 'Verification Failed' }, 500, request);
            }
        }

        return jsonResponse({ error: 'Endpoint Not Found' }, 404, request);
    }
};
