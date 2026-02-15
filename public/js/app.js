/**
 * LabDesk - Main Application Router & Init (Firebase Auth)
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

// ==================== AUTH STATE LISTENER ====================
auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log('User signed in:', user.email, 'UID:', user.uid);
        await DB.setUser(user.uid);

        // Check admin status first
        isAdmin = await DB.checkIfAdmin();
        console.log('Is Admin:', isAdmin);

        // Auto-register verified users
        if (user.emailVerified) {
            DB.registerVerifiedUser(user).catch(console.error);
        }

        // CRITICAL: 48-hour email verification check (except for admin)
        if (!isAdmin && !user.emailVerified) {
            // Get user's creation time from Firebase Auth
            const creationTime = new Date(user.metadata.creationTime);
            const now = new Date();
            const hoursSinceCreation = (now - creationTime) / (1000 * 60 * 60);

            console.log('Account age (hours):', hoursSinceCreation.toFixed(2));

            // If account is older than 48 hours and email not verified, BLOCK ACCESS
            if (hoursSinceCreation > 48) {
                console.log('⛔ Email verification required - 48 hours exceeded');
                document.getElementById('authScreen').classList.remove('hidden');
                document.getElementById('app').classList.add('hidden');
                renderVerifyEmail(user);
                return; // BLOCK access until verification
            }
        }

        if (isAdmin) {
            document.getElementById('authScreen').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
            renderSidebar();
            renderUserInfo(user);
            await updateLabNameHeader();
            showPage('dashboard');
        } else {
            // Check Trial / Subscription Status
            const isApprovedOrTrial = await DB.checkApproval();
            console.log('Access Granted:', isApprovedOrTrial);

            if (isApprovedOrTrial) {
                document.getElementById('authScreen').classList.add('hidden');
                document.getElementById('app').classList.remove('hidden');
                renderSidebar();
                renderUserInfo(user);
                await updateLabNameHeader();
                showPage('dashboard');

                // Show email verification reminder if not verified (within 48 hours)
                if (!user.emailVerified) {
                    const creationTime = new Date(user.metadata.creationTime);
                    const now = new Date();
                    const hoursRemaining = 48 - ((now - creationTime) / (1000 * 60 * 60));

                    setTimeout(() => {
                        if (hoursRemaining > 0) {
                            showToast(`📧 Please verify your email within ${Math.floor(hoursRemaining)} hours or access will be blocked!`, 'warning');
                        }
                    }, 2000);
                }
            } else {
                // Trial Expired & No Subscription -> Force Subscription Page
                document.getElementById('authScreen').classList.add('hidden');
                document.getElementById('app').classList.remove('hidden');

                // Render limited sidebar (only Logout) or just hide interactions
                renderSidebar();
                renderUserInfo(user);
                await updateLabNameHeader();

                showPage('subscription');
                showToast('Your free trial has expired. Please upgrade to continue.', 'error');

                // Disable navigation to other pages
                document.querySelectorAll('.nav-btn').forEach(btn => {
                    if (btn.dataset.page !== 'subscription') {
                        btn.disabled = true;
                        btn.style.opacity = '0.5';
                        btn.style.cursor = 'not-allowed';
                    }
                });
            }
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
    currentPage = page;
    editingReportId = null;

    // Update nav active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active-nav');
        if (btn.dataset.page === page) btn.classList.add('active-nav');
    });

    // Update header
    const titles = PAGE_TITLES[page] || [page, ''];
    document.getElementById('pageTitle').textContent = titles[0];
    document.getElementById('pageSubtitle').textContent = titles[1];

    // Animate container
    const container = document.getElementById('pageContainer');
    container.classList.remove('fade-in');
    void container.offsetWidth;
    container.classList.add('fade-in');

    // Render page (async pages)
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

    // Close mobile menu
    document.getElementById('sidebar').classList.remove('mobile-open');
    document.getElementById('mobileOverlay').classList.add('hidden');
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
        if (lab && lab.labName && lab.labName !== 'My Lab') {
            el.textContent = lab.labName;
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    } catch (e) {
        console.error('updateLabNameHeader error:', e);
    }
}
