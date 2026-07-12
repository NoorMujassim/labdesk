/**
 * CUREBIT - Main Application Router & Init (Firebase Auth)
 */

let currentPage = 'dashboard';

// ==================== NAV CONFIG ====================
const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'patients', label: 'Patients', icon: 'patients' },
    { id: 'newReport', label: 'New Report', icon: 'newReport' },
    { id: 'reports', label: 'All Reports', icon: 'reports' },
    { id: 'templates', label: 'Test Templates', icon: 'templates' },
    { id: 'settings', label: 'Lab Settings', icon: 'settings' },
    { id: 'subscription', label: 'Subscription', icon: 'subscription' },
    { id: 'profile', label: 'My Profile', icon: 'profile' },
];

const PAGE_TITLES = {
    dashboard: ['Dashboard', 'Overview of your lab activity'],
    patients: ['Patients', 'Manage patient records'],
    newReport: ['New Report', 'Create a new test report'],
    reports: ['All Reports', 'View and manage all reports'],
    templates: ['Test Templates', 'Browse available test templates'],
    settings: ['Lab Settings', 'Configure your lab profile'],
    subscription: ['Subscription', 'Manage your plan & billing'],
    profile: ['My Profile', 'Manage your account & identity'],
    admin: ['Admin Panel', 'Manage lab users & approvals'],
};

// ==================== GLOBAL STATE ====================
let isAdmin = false;
let isApproved = false;
let isEmailBypassed = false;

// ==================== AUTH STATE LISTENER ====================
auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log('User signed in:', user.email, 'UID:', user.uid);
        await DB.setUser(user.uid);

        // Check admin status first
        isAdmin = await DB.checkIfAdmin();
        console.log('Is Admin:', isAdmin);


        // Check if user has an email verification bypass from Super Admin
        isEmailBypassed = false;
        try {
            const userDoc = await DB.userDoc().get();
            if (userDoc.exists && userDoc.data().emailVerifiedBypass === true) {
                isEmailBypassed = true;
            }
        } catch (e) { /* ignore */ }

        // CRITICAL: Strict email verification check (except for admin or bypassed)
        if (!isAdmin && !user.emailVerified && !isEmailBypassed) {
            console.log('⛔ Email verification required');
            document.getElementById('authScreen').classList.remove('hidden');
            document.getElementById('app').classList.add('hidden');
            renderVerifyEmail(user);
            return; // BLOCK access until verification
        }

        // Initialize SubscriptionGuard so dashboard components know the status
        await SubscriptionGuard.init();

        // Check Subscription Status
        const hasActiveSubscription = isAdmin ? true : await DB.checkApproval();
        console.log('Subscription Active:', hasActiveSubscription);

        if (hasActiveSubscription || isEmailBypassed) {
            document.getElementById('authScreen').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
            renderSidebar();
            renderUserInfo(user);
            await updateLabNameHeader();
            showPage('dashboard');

            if (sessionStorage.getItem('paymentSuccess') === 'true') {
                sessionStorage.removeItem('paymentSuccess');
                showToast('Payment Captured! Plan Activated 🚀', 'success');
            }
        } else {
            // No active subscription -> Force Subscription Page
            document.getElementById('authScreen').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');

            // Render limited sidebar (only Logout) or just hide interactions
            renderSidebar();
            renderUserInfo(user);
            await updateLabNameHeader();

            showPage('subscription');
            showToast('Active subscription required. Please upgrade to continue.', 'error');

            // Disable navigation to other pages
            document.querySelectorAll('.nav-btn').forEach(btn => {
                if (btn.dataset.page !== 'subscription') {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                }
            });
        }

        analytics.logEvent('login', { method: user.providerData[0]?.providerId || 'email' });
    } else {
        console.log('User signed out');
        DB.setUser(null);
        isAdmin = false;
        isApproved = false;

        document.getElementById('authScreen').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');

        renderAuth();
    }
});

// ==================== SIDEBAR RENDERING ====================
function renderSidebar() {
    const nav = document.getElementById('sidebarNav');
    let items = [...NAV_ITEMS];

    // Add admin panel if user is admin
    if (isAdmin) {
        items.push({ id: 'admin', label: 'Admin Panel', icon: 'admin' });
    }

    nav.innerHTML = items.map(item => `
        <button onclick="showPage('${item.id}')" class="nav-btn" data-page="${item.id}">
            <span class="nav-icon">${ICONS[item.icon]}</span>
            <span class="nav-text">${item.label}</span>
        </button>
    `).join('');
}

function renderUserInfo(user) {
    const el = document.getElementById('userInfo');
    if (el) {
        const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
        const photoUrl = user.photoURL || '';
        el.innerHTML = `
            <div class="flex items-center" style="gap:10px;padding:8px 12px;border-radius:10px;background:rgba(255,255,255,0.06);margin-bottom:8px;cursor:pointer;transition:background 0.2s;" onclick="showPage('profile')" title="View Profile">
                <div class="avatar avatar-sm" style="background:#4f46e5;color:white;font-size:11px;overflow:hidden;flex-shrink:0;">
                    ${photoUrl ? `<img src="${photoUrl}" style="width:100%;height:100%;object-fit:cover;" alt="">` : initial}
                </div>
                <div class="logo-text" style="min-width:0;">
                    <p style="font-size:12px;font-weight:600;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${user.displayName || 'Lab User'}</p>
                    <p style="font-size:10px;color:rgba(165,180,252,0.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${user.email}</p>
                </div>
            </div>
        `;
    }
}

// ==================== NAVIGATION ====================
function showPage(page) {
    // 1. Critical Cleanup: Close any open modals to prevent UI overlap
    if (typeof closeModal === 'function') closeModal();
    
    // 2. Global State Reset
    currentPage = page;
    editingReportId = null;

    // STRICT PAYMENT ENFORCEMENT
    if (!isAdmin && !isEmailBypassed && window.SubscriptionGuard && !SubscriptionGuard.isActive()) {
        const allowedPages = ['subscription', 'profile'];
        if (!allowedPages.includes(page)) {
            page = 'subscription';
            currentPage = page;
            showToast('You must activate a subscription plan to access the dashboard.', 'warning');
        }
    }

    // 3. Update nav active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active-nav');
        if (btn.dataset.page === page) btn.classList.add('active-nav');
    });

    // 4. Update header titles & context-aware header actions
    const titles = PAGE_TITLES[page] || [page, ''];
    document.getElementById('pageTitle').textContent = titles[0];
    document.getElementById('pageSubtitle').textContent = titles[1];

    const headerNewReportBtn = document.getElementById('headerNewReportBtn');
    if (headerNewReportBtn) {
        if (page === 'patients') {
            headerNewReportBtn.classList.add('hidden');
        } else {
            headerNewReportBtn.classList.remove('hidden');
        }
    }

    // 5. Animate & Clear Container
    const container = document.getElementById('pageContainer');
    container.classList.remove('fade-in');
    
    // Force DOM clear to prevent overlaps
    container.innerHTML = ''; 
    
    void container.offsetWidth;
    container.classList.add('fade-in');

    // 6. Route to Page Renderer
    switch (page) {
        case 'dashboard': renderDashboard(); break;
        case 'patients': renderPatients(); break;
        case 'newReport': renderNewReport(); break;
        case 'reports': renderReports(); break;
        case 'templates': renderTemplates(); break;
        case 'settings': renderSettings(); break;
        case 'subscription': renderSubscription(); break;
        case 'profile': renderProfile(); break;
        case 'admin': if (isAdmin) renderAdminPanel(); else showPage('dashboard'); break;
    }

    // 7. Mobile UI Cleanup
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
    const overlay = document.getElementById('mobileOverlay');
    if (overlay) overlay.classList.add('hidden');
}


// ==================== SIDEBAR TOGGLE ====================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    document.getElementById('mainContent').classList.toggle('expanded');
    const icon = document.getElementById('collapseIcon');
    icon.style.transform = sidebar.classList.contains('collapsed') ? 'rotate(180deg)' : '';
}

function toggleMobile() {
    document.getElementById('sidebar').classList.toggle('mobile-open');
    document.getElementById('mobileOverlay').classList.toggle('hidden');
}

// ==================== HEADER ====================
async function updateLabNameHeader() {
    try {
        const lab = await DB.getLabProfile();
        const el = document.getElementById('labNameHeader');
        let nameDisplay = lab?.labName || '';
        if (!nameDisplay || nameDisplay.toUpperCase() === 'MY LAB' || nameDisplay.toUpperCase() === 'LABDESK') {
            el.classList.add('hidden');
        } else {
            el.textContent = nameDisplay;
            el.classList.remove('hidden');
        }
    } catch (e) {
        console.error('updateLabNameHeader error:', e);
    }
}

