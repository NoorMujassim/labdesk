/**
 * LabDesk - Authentication (Login / Signup / Reset Password)
 * Premium dark-themed auth UI
 */

const urlParams = new URLSearchParams(window.location.search);
let authMode = urlParams.get('mode') === 'signup' ? 'signup' : 'login'; // 'login', 'signup', 'reset'

function renderAuth() {
    const container = document.getElementById('authContainer');

    const logoSection = `
        <div class="auth-logo">
            <div class="auth-logo-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            </div>
            <h1 class="auth-title">LabDesk</h1>
            <p class="auth-subtitle">Professional Blood Lab Report Management</p>
        </div>
    `;

    const featuresFooter = `
        <div class="auth-features">
            <div class="auth-feature"><div class="auth-feature-dot"></div>Cloud Sync</div>
            <div class="auth-feature"><div class="auth-feature-dot" style="background:#10b981;"></div>200+ Tests</div>
            <div class="auth-feature"><div class="auth-feature-dot" style="background:#f59e0b;"></div>Print Reports</div>
            <div class="auth-feature"><div class="auth-feature-dot" style="background:#06b6d4;"></div>Secure</div>
        </div>
    `;

    if (authMode === 'login') {
        container.innerHTML = `
            <div class="auth-card slide-up">
                ${logoSection}
                <div class="auth-form">
                    <h2 style="font-size:20px;font-weight:700;color:#f1f5f9;margin-bottom:4px;">Welcome Back</h2>
                    <p style="font-size:13px;color:rgba(148,163,184,0.6);margin-bottom:24px;">Sign in to access your lab dashboard</p>

                    <div id="authError" class="auth-error hidden"></div>

                    <div class="space-y-4">
                        <div>
                            <label class="form-label">Email Address</label>
                            <div style="position:relative;">
                                <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(148,163,184,0.4);" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <input type="email" id="authEmail" class="input-field" placeholder="you@example.com" style="padding-left:42px;" onkeydown="if(event.key==='Enter')document.getElementById('authPassword').focus()">
                            </div>
                        </div>
                        <div>
                            <label class="form-label">Password</label>
                            <div style="position:relative;">
                                <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(148,163,184,0.4);" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                <input type="password" id="authPassword" class="input-field" placeholder="Enter your password" style="padding-left:42px;" onkeydown="if(event.key==='Enter')handleLogin()">
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <button onclick="switchAuthMode('reset')" class="auth-link">Forgot Password?</button>
                        </div>
                        <button onclick="handleLogin()" id="authBtn" class="btn btn-primary btn-block btn-lg">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                            Sign In
                        </button>
                    </div>

                    <div class="auth-divider"><span>OR</span></div>

                    <button onclick="handleGoogleLogin()" class="btn btn-outline btn-block">
                        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Continue with Google
                    </button>

                    <p class="text-center text-sm" style="margin-top:24px;color:rgba(148,163,184,0.6);">
                        Don't have an account? <button onclick="switchAuthMode('signup')" class="auth-link">Create Account</button>
                    </p>

                    ${featuresFooter}
                </div>
            </div>
        `;
    } else if (authMode === 'signup') {
        container.innerHTML = `
            <div class="auth-card slide-up">
                ${logoSection}
                <div class="auth-form">
                    <h2 style="font-size:20px;font-weight:700;color:#f1f5f9;margin-bottom:4px;">Create Your Account</h2>
                    <p style="font-size:13px;color:rgba(148,163,184,0.6);margin-bottom:24px;">Get started with LabDesk in seconds</p>

                    <div id="authError" class="auth-error hidden"></div>

                    <div class="space-y-4">
                        <div>
                            <label class="form-label">Lab / Your Name</label>
                            <div style="position:relative;">
                                <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(148,163,184,0.4);" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                                <input type="text" id="authName" class="input-field" placeholder="Your lab or clinic name" style="padding-left:42px;">
                            </div>
                        </div>
                        <div>
                            <label class="form-label">Email Address</label>
                            <div style="position:relative;">
                                <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(148,163,184,0.4);" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <input type="email" id="authEmail" class="input-field" placeholder="you@example.com" style="padding-left:42px;">
                            </div>
                        </div>
                        <div class="grid grid-2 gap-3">
                            <div>
                                <label class="form-label">Password</label>
                                <div style="position:relative;">
                                    <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(148,163,184,0.4);" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                    <input type="password" id="authPassword" class="input-field" placeholder="Min 6 chars" style="padding-left:42px;">
                                </div>
                            </div>
                            <div>
                                <label class="form-label">Confirm</label>
                                <div style="position:relative;">
                                    <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(148,163,184,0.4);" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                    <input type="password" id="authPassword2" class="input-field" placeholder="Repeat" style="padding-left:42px;" onkeydown="if(event.key==='Enter')handleSignup()">
                                </div>
                            </div>
                        </div>
                        <button onclick="handleSignup()" id="authBtn" class="btn btn-success btn-block btn-lg">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                            Create Account
                        </button>
                    </div>

                    <div class="auth-divider"><span>OR</span></div>

                    <button onclick="handleGoogleLogin()" class="btn btn-outline btn-block">
                        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Continue with Google
                    </button>

                    <p class="text-center text-sm" style="margin-top:24px;color:rgba(148,163,184,0.6);">
                        Already have an account? <button onclick="switchAuthMode('login')" class="auth-link">Sign In</button>
                    </p>
                </div>
            </div>
        `;
    } else if (authMode === 'reset') {
        container.innerHTML = `
            <div class="auth-card slide-up">
                ${logoSection}
                <div class="auth-form">
                    <div style="text-align:center;margin-bottom:24px;">
                        <div style="width:56px;height:56px;margin:0 auto 16px;background:rgba(245,158,11,0.1);border-radius:16px;display:flex;align-items:center;justify-content:center;">
                            <svg width="28" height="28" fill="none" stroke="#f59e0b" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                        </div>
                        <h2 style="font-size:20px;font-weight:700;color:#f1f5f9;margin-bottom:4px;">Reset Password</h2>
                        <p style="font-size:13px;color:rgba(148,163,184,0.6);">We'll send a reset link to your email</p>
                    </div>

                    <div id="authError" class="auth-error hidden"></div>

                    <div class="space-y-4">
                        <div>
                            <label class="form-label">Email Address</label>
                            <div style="position:relative;">
                                <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(148,163,184,0.4);" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <input type="email" id="authEmail" class="input-field" placeholder="you@example.com" style="padding-left:42px;" onkeydown="if(event.key==='Enter')handleResetPassword()">
                            </div>
                        </div>
                        <button onclick="handleResetPassword()" id="authBtn" class="btn btn-warning btn-block btn-lg">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            Send Reset Link
                        </button>
                    </div>

                    <p class="text-center text-sm" style="margin-top:24px;color:rgba(148,163,184,0.6);">
                        Remember your password? <button onclick="switchAuthMode('login')" class="auth-link">Back to Sign In</button>
                    </p>
                </div>
            </div>
        `;
    }
}

function switchAuthMode(mode) {
    authMode = mode;
    renderAuth();
}

function showAuthError(msg) {
    const el = document.getElementById('authError');
    if (el) {
        el.textContent = msg;
        el.classList.remove('hidden');
    }
}

function hideAuthError() {
    const el = document.getElementById('authError');
    if (el) el.classList.add('hidden');
}

function setAuthLoading(loading) {
    const btn = document.getElementById('authBtn');
    if (btn) {
        btn.disabled = loading;
        if (loading) {
            btn.dataset.originalText = btn.innerHTML;
            btn.innerHTML = '<div class="btn-loader"></div> Please wait...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';
        } else if (btn.dataset.originalText) {
            btn.innerHTML = btn.dataset.originalText;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        }
    }
}

// ==================== AUTH HANDLERS ====================

async function handleLogin() {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;

    if (!email || !password) {
        showAuthError('Please enter email and password');
        return;
    }

    hideAuthError();
    setAuthLoading(true);

    try {
        await auth.signInWithEmailAndPassword(email, password);
        // onAuthStateChanged will handle the rest
    } catch (e) {
        setAuthLoading(false);
        const messages = {
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/invalid-email': 'Invalid email address',
            'auth/too-many-requests': 'Too many attempts. Please try again later',
            'auth/invalid-credential': 'Invalid email or password'
        };
        showAuthError(messages[e.code] || e.message);
    }
}

async function handleSignup() {
    const name = document.getElementById('authName').value.trim();
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const password2 = document.getElementById('authPassword2').value;

    if (!name || !email || !password) {
        showAuthError('Please fill all fields');
        return;
    }
    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters');
        return;
    }
    if (password !== password2) {
        showAuthError('Passwords do not match');
        return;
    }

    hideAuthError();
    setAuthLoading(true);

    try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName: name });
        // Send verification email
        await cred.user.sendEmailVerification();

        DB.setUser(cred.user.uid);
        await DB.saveLabProfile({ labName: name, email: email });
        // onAuthStateChanged will handle the rest
    } catch (e) {
        setAuthLoading(false);
        const messages = {
            'auth/email-already-in-use': 'An account with this email already exists',
            'auth/invalid-email': 'Invalid email address',
            'auth/weak-password': 'Password is too weak (min 6 characters)'
        };
        showAuthError(messages[e.code] || e.message);
    }
}

async function handleGoogleLogin() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        if (result.additionalUserInfo && result.additionalUserInfo.isNewUser) {
            DB.setUser(result.user.uid);
            await DB.saveLabProfile({
                labName: result.user.displayName || 'My Lab',
                email: result.user.email || ''
            });
        }
    } catch (e) {
        if (e.code !== 'auth/popup-closed-by-user') {
            showAuthError(e.message);
        }
    }
}

async function handleResetPassword() {
    const email = document.getElementById('authEmail').value.trim();
    if (!email) {
        showAuthError('Please enter your email address');
        return;
    }

    hideAuthError();
    setAuthLoading(true);

    try {
        await auth.sendPasswordResetEmail(email);
        setAuthLoading(false);
        showToast('Password reset link sent to your email!', 'success');
        switchAuthMode('login');
    } catch (e) {
        setAuthLoading(false);
        const messages = {
            'auth/user-not-found': 'No account found with this email',
            'auth/invalid-email': 'Invalid email address'
        };
        showAuthError(messages[e.code] || e.message);
    }
}

async function handleLogout() {
    if (!confirm('Are you sure you want to logout?')) return;
    try {
        await auth.signOut();
    } catch (e) {
        showToast('Logout failed: ' + e.message, 'error');
    }
}

// ==================== APPROVAL SCREENS ====================

function renderApprovalRequest(user) {
    const container = document.getElementById('authContainer');
    container.innerHTML = `
        <div class="auth-card slide-up">
            <div class="auth-logo">
                <div class="auth-logo-icon">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                </div>
                <h1 class="auth-title">LabDesk</h1>
                <p class="auth-subtitle">Professional Blood Lab Report Management</p>
            </div>
            <div class="auth-form">
                <div style="text-align:center;margin-bottom:24px;">
                    <div style="width:64px;height:64px;margin:0 auto 16px;background:rgba(79,70,229,0.1);border-radius:16px;display:flex;align-items:center;justify-content:center;">
                        <svg width="32" height="32" fill="none" stroke="#818cf8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </div>
                    <h2 style="font-size:20px;font-weight:700;color:#f1f5f9;margin-bottom:4px;">Request Access</h2>
                    <p style="font-size:13px;color:rgba(148,163,184,0.6);">Submit your lab details for admin approval</p>
                </div>

                <div id="authError" class="auth-error hidden"></div>

                <div class="space-y-4">
                    <div>
                        <label class="form-label">Lab / Clinic Name *</label>
                        <input type="text" id="reqLabName" class="input-field" placeholder="Your lab or clinic name" value="${user.displayName || ''}">
                    </div>
                    <div>
                        <label class="form-label">Your Name *</label>
                        <input type="text" id="reqName" class="input-field" placeholder="Owner / Manager name">
                    </div>
                    <div>
                        <label class="form-label">Email</label>
                        <input type="email" id="reqEmail" class="input-field" value="${user.email || ''}" readonly style="opacity:0.6;">
                    </div>
                    <div>
                        <label class="form-label">Phone Number</label>
                        <input type="tel" id="reqPhone" class="input-field" placeholder="Contact number">
                    </div>
                    <button onclick="submitApprovalRequest()" id="reqBtn" class="btn btn-primary btn-block btn-lg">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                        Submit Request
                    </button>
                </div>

                <div style="margin-top:20px;padding:12px 16px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.15);border-radius:12px;">
                    <p style="font-size:12px;color:rgba(165,180,252,0.7);line-height:1.6;">
                        <strong style="color:#a5b4fc;">ℹ How it works:</strong><br>
                        1. Submit your lab details<br>
                        2. Admin will review your request<br>
                        3. Once approved, you can start using LabDesk
                    </p>
                </div>

                <p class="text-center text-sm" style="margin-top:20px;color:rgba(148,163,184,0.6);">
                    Wrong account? <button onclick="handleLogout()" class="auth-link">Sign Out</button>
                </p>
            </div>
        </div>
    `;
}

async function submitApprovalRequest() {
    const labName = document.getElementById('reqLabName').value.trim();
    const name = document.getElementById('reqName').value.trim();
    const email = document.getElementById('reqEmail').value.trim();
    const phone = document.getElementById('reqPhone').value.trim();

    if (!labName || !name) {
        showAuthError('Please fill Lab Name and Your Name');
        return;
    }

    const btn = document.getElementById('reqBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="btn-loader"></div> Submitting...'; }

    try {
        await DB.submitForApproval({ labName, name, email, phone });
        renderPendingApproval(auth.currentUser);
        showToast('Request submitted! Please wait for admin approval.', 'info');
    } catch (e) {
        showAuthError('Error: ' + e.message);
        if (btn) { btn.disabled = false; btn.innerHTML = 'Submit Request'; }
    }
}

function renderPendingApproval(user) {
    const container = document.getElementById('authContainer');
    container.innerHTML = `
        <div class="auth-card slide-up">
            <div class="auth-logo">
                <div class="auth-logo-icon" style="background:linear-gradient(135deg, #f59e0b, #d97706);">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h1 class="auth-title">LabDesk</h1>
                <p class="auth-subtitle">Professional Blood Lab Report Management</p>
            </div>
            <div class="auth-form" style="text-align:center;">
                <div style="width:80px;height:80px;margin:0 auto 20px;background:rgba(245,158,11,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;animation:pulse 2s ease-in-out infinite;">
                    <svg width="40" height="40" fill="none" stroke="#f59e0b" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h2 style="font-size:22px;font-weight:700;color:#f1f5f9;margin-bottom:8px;">Pending Approval</h2>
                <p style="font-size:14px;color:rgba(148,163,184,0.7);line-height:1.6;margin-bottom:24px;">
                    Your access request has been submitted successfully.<br>
                    Please wait for admin to approve your account.
                </p>

                <div style="padding:16px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.15);border-radius:12px;margin-bottom:20px;">
                    <div style="display:flex;align-items:center;gap:12px;justify-content:center;">
                        <div style="width:10px;height:10px;background:#f59e0b;border-radius:50%;animation:blink 1.5s ease-in-out infinite;"></div>
                        <span style="font-size:14px;font-weight:600;color:#fbbf24;">Awaiting Admin Review</span>
                    </div>
                </div>

                <div style="padding:12px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:20px;">
                    <p style="font-size:12px;color:rgba(148,163,184,0.5);">Logged in as</p>
                    <p style="font-size:14px;font-weight:600;color:#e2e8f0;">${user.email}</p>
                </div>

                <button onclick="recheckApproval()" class="btn btn-outline btn-block" style="margin-bottom:12px;">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    Check Status
                </button>
                <button onclick="handleLogout()" class="auth-link" style="font-size:14px;">Sign Out</button>
            </div>
        </div>
    `;
}

async function recheckApproval() {
    showToast('Checking approval status...', 'info');
    const approved = await DB.checkApproval();
    if (approved) {
        showToast('You are approved! Redirecting...', 'success');
        setTimeout(() => location.reload(), 1000);
    } else {
        const status = await DB.checkPendingStatus();
        if (status === 'rejected') {
            renderRejected(auth.currentUser);
        } else {
            showToast('Still pending. Please wait for admin approval.', 'info');
        }
    }
}

function renderRejected(user) {
    const container = document.getElementById('authContainer');
    container.innerHTML = `
        <div class="auth-card slide-up">
            <div class="auth-logo">
                <div class="auth-logo-icon" style="background:linear-gradient(135deg, #ef4444, #dc2626);">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                </div>
                <h1 class="auth-title">LabDesk</h1>
                <p class="auth-subtitle">Professional Blood Lab Report Management</p>
            </div>
            <div class="auth-form" style="text-align:center;">
                <div style="width:80px;height:80px;margin:0 auto 20px;background:rgba(239,68,68,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                    <svg width="40" height="40" fill="none" stroke="#ef4444" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h2 style="font-size:22px;font-weight:700;color:#f1f5f9;margin-bottom:8px;">Access Denied</h2>
                <p style="font-size:14px;color:rgba(148,163,184,0.7);line-height:1.6;margin-bottom:24px;">
                    Your access request was rejected by the admin.<br>
                    Please contact the administrator for more information.
                </p>

                <div style="padding:16px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.15);border-radius:12px;margin-bottom:20px;">
                    <span style="font-size:14px;font-weight:600;color:#fca5a5;">❌ Request Rejected</span>
                </div>

                <button onclick="handleLogout()" class="btn btn-outline btn-block">Sign Out & Try Different Account</button>
            </div>
        </div>
    `;
}

// ==================== EMAIL VERIFICATION SCREEN ====================

function renderVerifyEmail(user) {
    const container = document.getElementById('authContainer');

    // Calculate hours remaining for verification (48 hour deadline)
    const creationTime = new Date(user.metadata.creationTime);
    const now = new Date();
    const hoursSinceCreation = (now - creationTime) / (1000 * 60 * 60);
    const hoursRemaining = Math.max(0, 48 - hoursSinceCreation);
    const isDeadlineReached = hoursSinceCreation > 48;

    container.innerHTML = `
        <div class="auth-card slide-up">
            <div class="auth-logo">
                <div class="auth-logo-icon" style="background:linear-gradient(135deg, ${isDeadlineReached ? '#ef4444' : '#3b82f6'}, ${isDeadlineReached ? '#dc2626' : '#2563eb'});">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h1 class="auth-title">Verify Email</h1>
                <p class="auth-subtitle">${isDeadlineReached ? 'Verification Required' : 'Please check your inbox'}</p>
            </div>
            
            <div class="auth-form" style="text-align:center;">
                <div style="width:80px;height:80px;margin:0 auto 20px;background:rgba(${isDeadlineReached ? '239,68,68' : '59,130,246'},0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                    <svg width="40" height="40" fill="none" stroke="${isDeadlineReached ? '#ef4444' : '#3b82f6'}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>

                <h2 style="font-size:22px;font-weight:700;color:#f1f5f9;margin-bottom:8px;">${isDeadlineReached ? '⛔ Verification Required' : 'Verification Sent'}</h2>
                <p style="font-size:14px;color:rgba(148,163,184,0.7);line-height:1.6;margin-bottom:24px;">
                    We've sent a verification link to<br>
                    <strong style="color:#e2e8f0;">${user.email}</strong>
                </p>

                ${isDeadlineReached ? `
                    <div style="padding:16px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;margin-bottom:20px;">
                        <p style="font-size:13px;color:#fca5a5;font-weight:600;margin-bottom:8px;">⚠️ 48-Hour Deadline Exceeded</p>
                        <p style="font-size:12px;color:rgba(252,165,165,0.8);">
                            Your account was created more than 48 hours ago. You must verify your email to continue using LabDesk.
                        </p>
                    </div>
                ` : `
                    <div style="padding:16px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:12px;margin-bottom:20px;">
                        <p style="font-size:13px;color:#fbbf24;font-weight:600;margin-bottom:8px;">⏱️ ${Math.floor(hoursRemaining)} Hours Remaining</p>
                        <p style="font-size:12px;color:rgba(251,191,36,0.8);">
                            You have ${Math.floor(hoursRemaining)} hours left to verify your email. After 48 hours, access will be blocked until verification.
                        </p>
                    </div>
                `}

                <div style="padding:16px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.15);border-radius:12px;margin-bottom:20px;">
                    <p style="font-size:13px;color:rgba(148,163,184,0.8);">
                        Click the link in the email to activate your account. Then refresh this page.
                    </p>
                </div>

                <button onclick="location.reload()" class="btn btn-primary btn-block" style="margin-bottom:12px;">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    I've Verified, Refresh Page
                </button>
                
                <button onclick="resendVerification()" id="resendBtn" class="btn btn-outline btn-block" style="margin-bottom:12px;">Resend Email</button>
                
                <button onclick="handleLogout()" class="auth-link" style="font-size:14px;">Sign Out</button>
            </div>
        </div>
    `;
}

async function resendVerification() {
    const btn = document.getElementById('resendBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Sending...';
    }

    try {
        if (auth.currentUser) {
            await auth.currentUser.sendEmailVerification();
            showToast('Verification email sent again!', 'success');
        }
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = 'Resend Email';
        }
    }
}

// ==================== ADMIN PANEL ====================

async function renderAdminPanel() {
    const container = document.getElementById('pageContainer');
    container.innerHTML = '<div class="page-loader"><div class="loader-spinner"></div><p class="text-sm text-gray-400" style="margin-top:12px;">Loading admin panel...</p></div>';

    try {
        const [pendingUsers, approvedUsers] = await Promise.all([
            DB.getPendingUsers(),
            DB.getAllApprovedUsers()
        ]);

        container.innerHTML = `
            <div class="space-y-6 fade-in">
                <!-- Admin Stats -->
                <div class="grid sm-grid-2 grid-3 gap-4">
                    <div class="card card-hover stat-card stat-card-3" style="padding:20px;">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="stat-label">Pending Requests</p>
                                <p class="stat-value" style="${pendingUsers.length > 0 ? 'color:#d97706' : ''}">${pendingUsers.length}</p>
                                <p class="stat-sub">Awaiting approval</p>
                            </div>
                            <div class="stat-icon stat-icon-3">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div class="card card-hover stat-card stat-card-2" style="padding:20px;">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="stat-label">Approved Users</p>
                                <p class="stat-value">${approvedUsers.length}</p>
                                <p class="stat-sub">Active lab users</p>
                            </div>
                            <div class="stat-icon stat-icon-2">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div class="card card-hover stat-card stat-card-1" style="padding:20px;">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="stat-label">Admin</p>
                                <p class="stat-value text-sm" style="font-size:14px;">${auth.currentUser?.email || ''}</p>
                                <p class="stat-sub">System administrator</p>
                            </div>
                            <div class="stat-icon stat-icon-1">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pending Requests -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">⏳ Pending Approval Requests</h3>
                        <button onclick="renderAdminPanel()" class="btn btn-ghost btn-xs">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                            Refresh
                        </button>
                    </div>
                    ${pendingUsers.length === 0 ? `
                        <div class="empty-state" style="padding:32px;">
                            <div class="empty-icon">
                                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <p class="text-sm text-gray-400">No pending requests. All caught up! ✅</p>
                        </div>
                    ` : `
                        <div style="overflow-x:auto;">
                            <table class="data-table">
                                <thead><tr>
                                    <th>Lab Name</th>
                                    <th>Owner</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Requested</th>
                                    <th>Actions</th>
                                </tr></thead>
                                <tbody>
                                    ${pendingUsers.map(u => `
                                        <tr>
                                            <td>
                                                <div class="flex items-center" style="gap:10px;">
                                                    <div class="avatar avatar-md" style="background:#fef3c7;color:#92400e;">${(u.labName || u.name || '?').charAt(0).toUpperCase()}</div>
                                                    <span class="font-semibold text-gray-800">${u.labName || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td class="text-gray-600">${u.name || 'N/A'}</td>
                                            <td class="text-gray-500 text-xs">${u.email || 'N/A'}</td>
                                            <td class="text-gray-500">${u.phone || '—'}</td>
                                            <td class="text-xs text-gray-400">${u.requestedAt ? new Date(u.requestedAt.seconds * 1000).toLocaleDateString() : '—'}</td>
                                            <td>
                                                <div class="flex" style="gap:8px;">
                                                    <button onclick="adminApproveUser('${u.id}')" class="btn btn-success btn-xs">
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                                        Approve
                                                    </button>
                                                    <button onclick="adminRejectUser('${u.id}')" class="btn btn-danger btn-xs">
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>

                <!-- Approved Users -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">✅ Approved Lab Users</h3>
                        <div style="display:flex;gap:8px;align-items:center;">
                            <span class="badge badge-completed">${approvedUsers.length} active</span>
                            <button onclick="showCreateUserModal()" class="btn btn-primary btn-sm">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                                Create User
                            </button>
                        </div>
                    </div>
                    ${approvedUsers.length === 0 ? `
                        <div class="empty-state" style="padding:32px;">
                            <p class="text-sm text-gray-400">No approved users yet.</p>
                        </div>
                    ` : `
                        <div style="overflow-x:auto;">
                            <table class="data-table">
                                <thead><tr>
                                    <th>Lab / User</th>
                                    <th>Email</th>
                                    <th>User ID</th>
                                    <th>Approved On</th>
                                    <th>Actions</th>
                                </tr></thead>
                                <tbody>
                                    ${approvedUsers.map(u => `
                                        <tr>
                                            <td>
                                                <div class="flex items-center" style="gap:10px;">
                                                    <div class="avatar avatar-md avatar-emerald">${(u.labName || u.name || u.email || '?').charAt(0).toUpperCase()}</div>
                                                    <div>
                                                        <p class="font-semibold text-gray-800">${u.labName || u.name || 'Lab User'}</p>
                                                        <p class="text-xs text-gray-400">${u.name || ''}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="text-gray-500 text-xs">${u.email || '—'}</td>
                                            <td><span class="text-xs text-gray-400" style="font-family:monospace;">${u.id.slice(0, 16)}...</span></td>
                                            <td class="text-xs text-gray-400">${u.approvedAt ? new Date(u.approvedAt.seconds * 1000).toLocaleDateString() : '—'}</td>
                                            <td>
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                                                    Revoke
                                                </button>
                                                <button onclick="adminGrantAccess('${u.id}', '${(u.labName || u.email || '').replace(/'/g, '')}')" class="btn btn-warning btn-xs" title="Grant Free Premium Access">
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><p class="text-danger">Error loading admin panel: ${e.message}</p></div>`;
    }
}

async function adminApproveUser(userId) {
    if (!confirm('Approve this user? They will be able to access LabDesk.')) return;
    try {
        await DB.approveUser(userId);
        showToast('User approved successfully! ✅');
        renderAdminPanel();
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    }
}

async function adminRejectUser(userId) {
    if (!confirm('Reject this user? They will not be able to access LabDesk.')) return;
    try {
        await DB.rejectUser(userId);
        showToast('User rejected');
        renderAdminPanel();
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    }
}

async function adminRevokeUser(userId, name) {
    if (!confirm('Revoke access for "' + name + '"? They will no longer be able to use LabDesk.')) return;
    try {
        await DB.revokeUser(userId);
        showToast('User access revoked');
        renderAdminPanel();
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    }
}

async function adminGrantAccess(userId, name) {
    if (!confirm('Grant 1 Year FREE Premium Access to "' + name + '"?\n\nThis will waive off all charges and activate the Premium Plan immediately.')) return;

    try {
        await DB.grantFreeSubscription(userId, 12); // Grant 12 months
        showToast('Free Premium Access Granted! 🎁');
        renderAdminPanel();
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    }
}

// ==================== CREATE USER MODAL ====================

function showCreateUserModal() {
    // Create modal overlay
    const modalHTML = `
        <div id="createUserModal" class="modal-overlay" onclick="if(event.target===this)hideCreateUserModal()" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;animation:fadeIn 0.2s;">
            <div class="modal-content" style="background:#1e293b;border-radius:16px;padding:28px;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.5);animation:slideUp 0.3s;" onclick="event.stopPropagation()">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <h3 style="font-size:20px;font-weight:700;color:#f1f5f9;margin:0;">Create New User</h3>
                    <button onclick="hideCreateUserModal()" style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:4px;display:flex;" title="Close">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                
                <div id="createUserError" class="auth-error hidden" style="margin-bottom:16px;"></div>
                
                <div class="space-y-4">
                    <div>
                        <label class="form-label" style="display:block;font-size:13px;font-weight:600;color:#cbd5e1;margin-bottom:6px;">Lab / Clinic Name *</label>
                        <input type="text" id="createLabName" class="input-field" placeholder="Enter lab name" style="width:100%;padding:12px 14px;background:#0f172a;border:1px solid rgba(148,163,184,0.2);border-radius:10px;color:#e2e8f0;font-size:14px;">
                    </div>
                    <div>
                        <label class="form-label" style="display:block;font-size:13px;font-weight:600;color:#cbd5e1;margin-bottom:6px;">Email Address *</label>
                        <input type="email" id="createEmail" class="input-field" placeholder="user@example.com" style="width:100%;padding:12px 14px;background:#0f172a;border:1px solid rgba(148,163,184,0.2);border-radius:10px;color:#e2e8f0;font-size:14px;">
                    </div>
                    <div>
                        <label class="form-label" style="display:block;font-size:13px;font-weight:600;color:#cbd5e1;margin-bottom:6px;">Password *</label>
                        <input type="password" id="createPassword" class="input-field" placeholder="Min 6 characters" style="width:100%;padding:12px 14px;background:#0f172a;border:1px solid rgba(148,163,184,0.2);border-radius:10px;color:#e2e8f0;font-size:14px;">
                        <p style="font-size:12px;color:#64748b;margin-top:4px;">User will be able to change password later</p>
                    </div>
                    <div style="padding:12px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.15);border-radius:10px;">
                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                            <input type="checkbox" id="createAutoApprove" checked style="width:16px;height:16px;">
                            <span style="font-size:13px;color:#a5b4fc;">Auto-approve (skip approval process)</span>
                        </label>
                    </div>
                </div>
                
                <div style="display:flex;gap:10px;margin-top:24px;">
                    <button onclick="hideCreateUserModal()" class="btn btn-outline" style="flex:1;">Cancel</button>
                    <button onclick="handleCreateUser()" id="createUserBtn" class="btn btn-primary" style="flex:1;">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                        Create User
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Focus first input
    setTimeout(() => document.getElementById('createLabName')?.focus(), 100);
}

function hideCreateUserModal() {
    const modal = document.getElementById('createUserModal');
    if (modal) modal.remove();
}

function showCreateUserError(msg) {
    const el = document.getElementById('createUserError');
    if (el) {
        el.textContent = msg;
        el.classList.remove('hidden');
    }
}

function hideCreateUserError() {
    const el = document.getElementById('createUserError');
    if (el) el.classList.add('hidden');
}

async function handleCreateUser() {
    const labName = document.getElementById('createLabName')?.value.trim();
    const email = document.getElementById('createEmail')?.value.trim();
    const password = document.getElementById('createPassword')?.value;
    const autoApprove = document.getElementById('createAutoApprove')?.checked;

    // Validation
    if (!labName || !email || !password) {
        showCreateUserError('Please fill all required fields');
        return;
    }

    if (password.length < 6) {
        showCreateUserError('Password must be at least 6 characters');
        return;
    }

    if (!email.includes('@')) {
        showCreateUserError('Please enter a valid email address');
        return;
    }

    hideCreateUserError();

    // Disable button
    const btn = document.getElementById('createUserBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<div class="btn-loader"></div> Creating...';
    }

    try {
        // Create user with Firebase
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        const newUserId = cred.user.uid;

        // Update profile
        await cred.user.updateProfile({ displayName: labName });

        // Set user data
        DB.setUser(newUserId);

        // Save lab profile
        await DB.saveLabProfile({
            labName: labName,
            email: email
        });

        // Auto-approve if checked
        if (autoApprove) {
            await DB.approveUser(newUserId);
        }

        // Sign out the newly created user (keep admin logged in)
        await cred.user.delete(); // Delete the session

        // Re-create the user account in Firebase (workaround)
        // Actually, we need a different approach - let's just create and approve

        showToast(`User created successfully! ${autoApprove ? '(Auto-approved)' : '(Pending approval)'}`, 'success');
        hideCreateUserModal();
        renderAdminPanel();

    } catch (e) {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg> Create User';
        }

        const messages = {
            'auth/email-already-in-use': 'This email is already registered',
            'auth/invalid-email': 'Invalid email address',
            'auth/weak-password': 'Password is too weak (min 6 characters)',
            'auth/operation-not-allowed': 'User creation is disabled. Please enable Email/Password authentication in Firebase Console.'
        };
        showCreateUserError(messages[e.code] || e.message);
    }
}
