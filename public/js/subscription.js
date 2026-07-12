
function generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}-${random}`;
}

function handleRetryPayment(planId) {
    showToast('Retrying payment checkout...', 'info');
    handlePayment(planId);
}

async function renderInvoiceModal(paymentId) {
    const history = await DB.getPaymentHistory();
    const payment = history.find(p => p.paymentId === paymentId || p.id === paymentId) || {
        invoiceNumber: 'INV-' + Date.now().toString().slice(-6),
        amount: 399,
        planName: 'Standard Plan',
        createdAt: new Date().toLocaleDateString(),
        paymentId: paymentId
    };

    const modalHtml = `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
        <div class="modal-content" style="max-width:560px;padding:32px;background:#ffffff;border-radius:16px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #f1f5f9;">
                <div>
                    <img src="black.png" alt="CureBIT Logo" style="height:32px;width:auto;">
                    <div style="font-size:11px;color:#64748b;margin-top:4px;">GST INVOICE & RECEIPT</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:15px;font-weight:900;color:#0f172a;">${payment.invoiceNumber || 'INV-2026-8812'}</div>
                    <div style="font-size:11px;color:#94a3b8;">${payment.date || new Date().toLocaleDateString()}</div>
                </div>
            </div>

            <div style="background:#f8fafc;padding:16px;border-radius:12px;margin-bottom:20px;font-size:12.5px;color:#334155;line-height:1.8;">
                <div style="display:flex;justify-content:space-between;"><span>Plan Description:</span><strong style="color:#0f172a;">${payment.planName || 'Subscription'}</strong></div>
                <div style="display:flex;justify-content:space-between;"><span>Payment ID:</span><strong style="font-family:monospace;color:#4f46e5;">${payment.paymentId || 'pay_live_xxx'}</strong></div>
                <div style="display:flex;justify-content:space-between;"><span>Payment Status:</span><strong style="color:#16a34a;">PAID ✓</strong></div>
                <div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px dashed #cbd5e1;"><span>Total Amount Paid:</span><strong style="font-size:16px;color:#0f172a;">₹${payment.amount} INR</strong></div>
            </div>

            <div style="display:flex;gap:12px;">
                <button onclick="window.print()" class="btn btn-outline" style="flex:1;">Print Receipt 🖨️</button>
                <button onclick="closeModal()" class="btn btn-primary" style="flex:1;">Close</button>
            </div>
        </div>
    </div>`;
    showModal(modalHtml);
}

/**
 * CUREBIT - Subscription & Payment Handler (Razorpay)
 * Commercial Pricing Model
 */

const RAZORPAY_KEY_ID = 'rzp_live_TAKHMgKXQEzXKh'; // LIVE PRODUCTION KEY
const TEST_MODE = typeof window.TEST_MODE !== 'undefined' ? window.TEST_MODE : false;

const SUBSCRIPTION_PLANS = {
    test: {
        id: 'test',
        name: 'Testing Plan',
        price: 1,
        durationDays: 1,
        tier: 'test',
        isTest: true,
        features: ['₹1 Testing Mode', '1-Day Access', 'Instant Validation']
    },
    weekly: {
        id: 'weekly',
        name: 'Weekly Pass',
        price: 79,
        durationDays: 7,
        tier: 'weekly',
        features: ['7 Days Full Access', 'All Test Templates', 'Standard PDF Printing', 'WhatsApp Sharing']
    },
    starter: {
        id: 'starter',
        name: 'Starter',
        price: 199,
        durationDays: 30,
        tier: 'starter',
        features: ['100 Patients / mo', 'Core Test Templates', 'Standard Support', 'PDF Reports']
    },
    standard: {
        id: 'standard',
        name: 'Standard',
        price: 399,
        durationDays: 30,
        tier: 'standard',
        badge: 'Most Popular',
        features: ['300 Patients / mo', 'All Test Templates', 'WhatsApp Integration', 'Priority Support']
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: 699,
        durationDays: 30,
        tier: 'pro',
        features: ['700 Patients / mo', 'Advanced Panels', 'Custom Letterhead Logo', 'WhatsApp & Email Share']
    },
    premium: {
        id: 'premium',
        name: 'Premium',
        price: 999,
        durationDays: 30,
        tier: 'premium',
        badge: 'Best Value',
        features: ['Unlimited Patients', 'All Advanced Templates', 'Multi-User Access', '24/7 Dedicated Support']
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        price: null,
        durationDays: 365,
        tier: 'enterprise',
        isContact: true,
        features: ['Custom Lab Workflows', 'Dedicated Account Manager', 'Multi-Branch Support', 'SLA & Custom Integration']
    }
};

let isYearly = false;

async function renderSubscription() {
    const container = document.getElementById('pageContainer');
    if (!container) return;

    container.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p class="text-sm text-gray-400" style="margin-top:12px;">Loading subscription details...</p></div>`;

    try {
        const sub = await DB.getSubscription();
        const isActive = sub && sub.status === 'active' && sub.validUntil && new Date(sub.validUntil.toDate()) > new Date();

        // Check if user is Admin
        const isAdminUser = await DB.checkIfAdmin();

        // Filter plans: show test plan ONLY to admin users
        const visiblePlans = Object.values(SUBSCRIPTION_PLANS).filter(plan => {
            if (plan.isTest) return isAdminUser;
            return true;
        });

        // Calculate Prices
        const getPrice = (plan) => {
            if (plan.price === null) return null;
            if (plan.id === 'weekly' || plan.id === 'test') return plan.price;
            return isYearly ? Math.round(plan.price * 12 * 0.70) : plan.price; // 30% discount
        };

        const getDurationLabel = (plan) => {
            if (plan.price === null) return '';
            if (plan.id === 'weekly') return '/ 7 days';
            if (plan.id === 'test') return '/ 1 day';
            return isYearly ? '/ year' : '/ month';
        };

        const plansHtml = visiblePlans.map(plan => {
            const price = getPrice(plan);
            const badgeText = plan.badge || (plan.isTest ? 'TEST ONLY' : null);
            const isHighlighted = plan.badge === 'Most Popular' || plan.badge === 'Best Value';
            const label = getDurationLabel(plan);

            return `
            <div class="card relative flex flex-col ${isHighlighted ? 'border-primary shadow-lg ring-2 ring-indigo-500' : 'border-gray-200'}" 
                style="padding:22px;border-radius:16px;background:${plan.isTest ? '#fef2f2' : 'white'};transition:all 0.2s ease;">
                
                ${badgeText ? `
                    <div style="position:absolute;top:-12px;right:16px;background:${plan.badge === 'Most Popular' ? '#2563eb' : plan.badge === 'Best Value' ? '#059669' : '#dc2626'};color:white;font-size:10px;font-weight:900;padding:3px 12px;border-radius:12px;letter-spacing:0.04em;text-transform:uppercase;box-shadow:0 2px 6px rgba(0,0,0,0.15);">
                        ${badgeText}
                    </div>
                ` : ''}

                <h3 class="text-lg font-bold ${isHighlighted ? 'text-indigo-600' : 'text-gray-800'}">${plan.name}</h3>
                
                <div class="my-3" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                    ${price !== null ? `
                        <span class="text-3xl font-extrabold text-gray-900">₹${price}</span>
                        <span class="text-xs font-semibold text-gray-500">${label}</span>
                        ${plan.isTest ? `
                            <span style="font-size:11px;font-weight:800;background:#fee2e2;color:#ef4444;padding:2px 8px;border-radius:6px;display:inline-flex;align-items:center;gap:3px;border:1px solid #fca5a5;white-space:nowrap;margin-left:4px;">
                                🧪 Testing
                            </span>
                        ` : ''}
                    ` : `
                        <span class="text-2xl font-extrabold text-gray-900">Custom</span>
                        <span class="text-xs font-semibold text-gray-500">Contact Us</span>
                    `}
                </div>
                
                <ul class="space-y-2 mb-6 flex-1" style="padding-top:8px;">
                    ${plan.features.map(f => `
                        <li class="flex items-start gap-2 text-xs font-medium text-gray-600">
                            <span style="color:#059669;font-weight:bold;">✓</span> <span style="flex:1">${f}</span>
                        </li>
                    `).join('')}
                </ul>
                
                <button onclick="handlePayment('${plan.id}')" 
                    class="btn ${isHighlighted ? 'btn-primary' : 'btn-outline'} w-full text-xs font-bold py-2.5" 
                    style="border-radius:10px;">
                    ${plan.isContact ? 'Contact Sales' : (isActive && sub.plan === plan.id ? 'Current Plan' : 'Select Plan')}
                </button>
            </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="space-y-8 fade-in" style="max-width:1600px;width:100%;margin:0 auto;padding-bottom:100px;">
                
                <!-- ░░ ABOVE PRICING HEADER BADGES ░░ -->
                <div class="text-center" style="margin-bottom:28px;">
                    <div style="display:inline-flex;align-items:center;gap:12px;background:#e0f2fe;padding:6px 20px;border-radius:30px;margin-bottom:14px;border:1px solid #bae6fd;">
                        <span style="font-size:12px;font-weight:800;color:#0369a1;">🎁 7-Day Free Trial</span>
                        <span style="color:#7dd3fc;">•</span>
                        <span style="font-size:12px;font-weight:800;color:#0369a1;">💳 No Credit Card Required</span>
                        <span style="color:#7dd3fc;">•</span>
                        <span style="font-size:12px;font-weight:800;color:#0369a1;">🔒 Secure Razorpay Payments</span>
                    </div>

                    <h2 class="text-3xl font-extrabold text-gray-900" style="letter-spacing:-0.02em;">Commercial Pricing & Plans</h2>
                    <p class="text-gray-500 text-sm" style="margin-top:6px;">Choose the right plan to scale your pathology laboratory operations.</p>
                    
                    <!-- Billing Toggle -->
                    <div class="flex justify-center items-center gap-4 mt-6">
                        <span class="text-sm font-semibold ${!isYearly ? 'text-gray-900' : 'text-gray-500'}">Monthly Billing</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" onchange="toggleBilling(this)" ${isYearly ? 'checked' : ''}>
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                        <span class="text-sm font-semibold ${isYearly ? 'text-gray-900' : 'text-gray-500'}">Yearly Billing <span class="text-xs text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full ml-1">SAVE 30%</span></span>
                    </div>
                </div>

                <!-- Current Active Status -->
                ${isActive ? `
                <div class="card bg-emerald-50 border-emerald-200" style="padding:16px 24px;display:flex;align-items:center;gap:16px;margin-bottom:24px;max-width:540px;margin-left:auto;margin-right:auto;border-radius:14px;border:1px solid #a7f3d0;">
                    <div style="width:40px;height:40px;background:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">
                        ✓
                    </div>
                    <div>
                        <h3 class="font-bold text-emerald-900" style="font-size:15px;">Active Plan: ${sub.planName || 'Plan'}</h3>
                        <p class="text-xs text-emerald-700 font-medium">Valid until: ${new Date(sub.validUntil.toDate()).toLocaleDateString()}</p>
                    </div>
                </div>
                ` : ''}
                
                <div style="margin-bottom:32px;text-align:center;">
                    ${isAdminUser ? `
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);color:white;padding:16px;border-radius:12px;display:inline-block;margin-bottom:20px;box-shadow:0 10px 25px rgba(16, 185, 129, 0.2);">
                        <div style="font-size:18px;font-weight:800;display:flex;align-items:center;gap:8px;justify-content:center;">
                            <span>👑</span> Superadmin Lifetime Access Active
                        </div>
                        <div style="font-size:13px;opacity:0.9;margin-top:4px;">You have unrestricted access. Pricing plans below are shown for your reference.</div>
                    </div>` : `
                    <div style="background:#f1f5f9;display:inline-flex;padding:6px;border-radius:12px;gap:8px;box-shadow:inset 0 2px 4px rgba(0,0,0,0.02);">
                        <button class="billing-toggle ${!isYearly ? 'active' : ''}" onclick="toggleBilling(this.querySelector('input'))" style="border:none;background:transparent;padding:0;">
                            <input type="radio" name="billingCycle" value="monthly" ${!isYearly ? 'checked' : ''} style="display:none;">
                            <div style="padding:8px 24px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;${!isYearly ? 'background:white;color:#0f172a;box-shadow:0 1px 3px rgba(0,0,0,0.1);' : 'color:#64748b;'}">
                                Monthly
                            </div>
                        </button>
                        <button class="billing-toggle ${isYearly ? 'active' : ''}" onclick="toggleBilling(this.querySelector('input'))" style="border:none;background:transparent;padding:0;">
                            <input type="radio" name="billingCycle" value="yearly" ${isYearly ? 'checked' : ''} style="display:none;">
                            <div style="padding:8px 24px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;${isYearly ? 'background:white;color:#0f172a;box-shadow:0 1px 3px rgba(0,0,0,0.1);' : 'color:#64748b;'}">
                                Yearly <span style="color:#10b981;font-size:11px;margin-left:4px;">(Save 30%)</span>
                            </div>
                        </button>
                    </div>`}
                </div>

                <!-- Pricing Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    ${plansHtml}
                </div>
                
                <!-- ░░ BELOW PRICING FOOTER TRUST BADGES ░░ -->
                <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:24px;">
                    <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:#475569;">
                        <span>🧾</span> GST Invoice Included
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:#475569;">
                        <span>⚡</span> Instant Activation
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:#475569;">
                        <span>🔄</span> Cancel Anytime
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:#475569;">
                        <span>🛡️</span> Secure Razorpay Payments
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:#475569;">
                        <span>☁️</span> Automated Cloud Sync
                    </div>
                </div>

            </div>
        `;
    } catch (e) {
        console.error('Render Subscription Error:', e);
        container.innerHTML = `<div class="empty-state"><p class="text-danger">Error loading subscription info: ${e.message}</p></div>`;
    }
}

function toggleBilling(checkbox) {
    isYearly = checkbox.checked;
    renderSubscription();
}

async function handlePayment(planId) {
    const user = auth.currentUser;
    if (!user) return;

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) return;

    // Security Gate: Only Admin users can select/purchase the test plan
    if (plan.isTest) {
        const isAdmin = await DB.checkIfAdmin();
        if (!isAdmin) {
            showToast('Security Error: Only administrators can purchase this plan.', 'error');
            return;
        }
    }

    // Contact Sales override for Enterprise
    if (plan.isContact) {
        window.open('https://wa.me/917617739344?text=Hello%20CureBIT%20Team,%20I%20am%20interested%20in%20the%20Enterprise%20Plan', '_blank');
        return;
    }

    const billingCycle = (plan.id === 'weekly' || plan.id === 'test')
        ? 'one_time'
        : (isYearly ? 'yearly' : 'monthly');

    // Calculate final price based on toggle
    let finalPrice = billingCycle === 'one_time'
        ? plan.price
        : (isYearly ? Math.round(plan.price * 12 * 0.70) : plan.price);

    // Amount in paise
    const amountPaise = finalPrice * 100;

    try {
        showToast('Initializing payment order...', 'info');
        
        // 1. Create Razorpay Order via Cloudflare Worker backend
        const orderData = await WorkerClient.createOrder(plan.id, amountPaise, billingCycle);
        const resolvedOrderId = orderData && (orderData.orderId || orderData.id);
        if (!resolvedOrderId) {
            throw new Error('Order creation failed: Backend did not return a valid order ID');
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: amountPaise,
            currency: "INR",
            name: "CUREBIT",
            description: `${plan.name} (${billingCycle === 'one_time' ? 'One Time' : (billingCycle === 'yearly' ? 'Yearly' : 'Monthly')})`,
            image: "https://CUREBIT.pages.dev/apple-touch-icon.png",
            order_id: resolvedOrderId,
            handler: async function (response) {
                console.log('Razorpay Response:', response);
                showToast('Verifying payment signature...', 'info');

                try {
                    // 2. Perform Secure Cryptographic Signature Verification on Cloudflare Worker
                    const verifyResult = await WorkerClient.verifyPaymentSignature(
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        response.razorpay_signature,
                        plan.id,
                        amountPaise,
                        billingCycle
                    );

                    if (!verifyResult || (!verifyResult.success && verifyResult.status !== 'verified')) {
                        throw new Error('Payment signature verification failed');
                    }

                    // Determine Validity
                    const now = new Date();
                    let validUntil = new Date();

                    if (plan.id === 'weekly') {
                        validUntil.setDate(now.getDate() + 7);
                    } else if (plan.id === 'test') {
                        validUntil.setDate(now.getDate() + 1);
                    } else {
                        if (isYearly) validUntil.setFullYear(now.getFullYear() + 1);
                        else validUntil.setDate(now.getDate() + 30);
                    }

                    // The backend Worker has already saved the payment, subscription, and transaction history
                    // as part of the secure verification process.
                    
                    sessionStorage.setItem('paymentSuccess', 'true');
                    setTimeout(() => location.reload(), 1500);
                } catch (e) {
                    console.error('Signature Verification / Activation Error:', e);
                    showToast('Security Error: Payment verification failed: ' + e.message, 'error');
                }
            },
            prefill: {
                name: user.displayName || "",
                email: user.email || "",
                contact: ""
            },
            theme: { color: "#4f46e5" }
        };

        const rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            console.error('Razorpay Live Payment Failure:', response.error);
            const modalHtml = `
            <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
                <div class="modal-content" style="max-width:420px;padding:28px;text-align:center;">
                    <div style="width:52px;height:52px;border-radius:50%;background:#fee2e2;color:#ef4444;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px;">✕</div>
                    <h3 style="font-size:18px;font-weight:900;color:#0f172a;margin-bottom:8px;">Payment Cancelled or Failed</h3>
                    <p style="font-size:13px;color:#64748b;line-height:1.5;margin-bottom:20px;">
                        ${response.error?.description || 'The payment could not be processed.'}
                    </p>
                    <div style="display:flex;gap:10px;">
                        <button onclick="closeModal()" class="btn btn-outline" style="flex:1;">Cancel</button>
                        <button onclick="closeModal();handleRetryPayment('${planId}')" class="btn btn-primary" style="flex:1;">Retry Payment 🔄</button>
                    </div>
                </div>
            </div>`;
            showModal(modalHtml);
        });
        rzp1.open();
    } catch (e) {
        console.error('Checkout Initialization Failed:', e);
        showToast('Initialization Error: ' + e.message, 'error');
    }
}

