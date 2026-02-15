/**
 * LabDesk - User Profile Page (Firebase/Async)
 * Identity, Contact, Account Security, Login History
 */

// ==================== PROFILE DATA HELPERS ====================
async function getProfileData() {
    try {
        const userDoc = await DB.userDoc().get();
        const data = userDoc.exists ? userDoc.data() : {};
        const user = auth.currentUser;
        return {
            // Identity
            fullName: data.profileName || data.ownerName || user?.displayName || '',
            displayName: user?.displayName || '',
            gender: data.profileGender || '',
            dob: data.profileDOB || '',
            profilePhoto: data.profilePhoto || user?.photoURL || '',
            bio: data.profileBio || '',
            role: data.profileRole || 'Lab Owner',

            // Contact
            mobile: data.phone || data.profileMobile || '',
            email: user?.email || data.email || '',
            alternatePhone: data.alternatePhone || '',
            alternateEmail: data.alternateEmail || '',
            address: data.address || data.profileAddress || '',
            city: data.profileCity || '',
            state: data.profileState || '',
            pincode: data.profilePincode || '',

            // Account
            uid: user?.uid || '',
            createdAt: data.createdAt || user?.metadata?.creationTime || '',
            lastLogin: user?.metadata?.lastSignInTime || '',
            provider: user?.providerData?.[0]?.providerId || 'email',
            emailVerified: user?.emailVerified || false,
            labName: data.labName || '',

            // Lab Staff
            techName: data.techName || data.drName || '',
            techDegree: data.techDegree || '',
            techRegNo: data.techRegNo || '',
            pathologistName: data.pathologistName || '',
            pathologistDegree: data.pathologistDegree || '',
            pathologistRegNo: data.pathologistRegNo || '',
            pathologists: data.pathologists || null,

            // Login history
            loginHistory: data.loginHistory || []
        };
    } catch (e) {
        console.error('getProfileData error:', e);
        return {};
    }
}

async function saveProfileData(profileData) {
    try {
        await DB.userDoc().set(profileData, { merge: true });
        return true;
    } catch (e) {
        console.error('saveProfileData error:', e);
        throw e;
    }
}

// ==================== PATHOLOGIST ROWS ====================
function renderPathologistRows(pathologists) {
    if (!pathologists || pathologists.length === 0) {
        pathologists = [{ name: '', degree: '', regNo: '', isDefault: true }];
    }
    return pathologists.map((p, i) => `
        <div class="staff-entry-row" data-path-index="${i}">
            ${pathologists.length > 1 ? `<button onclick="removePathologistRow(${i})" class="staff-remove-btn" title="Remove">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>` : ''}
            <div class="space-y-3">
                <div class="flex justify-between items-center" style="margin-bottom:4px;">
                    <span style="font-size:11px;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:0.05em;">Pathologist ${i + 1}</span>
                    <label class="staff-default-toggle ${p.isDefault ? 'active' : ''}" onclick="setDefaultPathologist(${i})">
                        <input type="radio" name="defaultPath" ${p.isDefault ? 'checked' : ''}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                        ${p.isDefault ? 'Default Signatory' : 'Set as Default'}
                    </label>
                </div>
                <div class="grid grid-2 gap-3">
                    <div>
                        <label class="form-label">Name</label>
                        <input type="text" class="input-field path-name" value="${p.name || ''}" placeholder="Dr. Full Name">
                    </div>
                    <div>
                        <label class="form-label">Qualification</label>
                        <input type="text" class="input-field path-degree" value="${p.degree || ''}" placeholder="MD Pathology, etc.">
                    </div>
                </div>
                <div>
                    <label class="form-label">Medical Registration Number</label>
                    <input type="text" class="input-field path-reg" value="${p.regNo || ''}" placeholder="Medical council reg. no.">
                </div>
            </div>
        </div>
    `).join('');
}

function addPathologistRow() {
    const container = document.getElementById('pathologistContainer');
    const rows = container.querySelectorAll('.staff-entry-row');
    if (rows.length >= 3) {
        showToast('Maximum 3 pathologists allowed', 'error');
        return;
    }
    const currentData = collectPathologistData();
    currentData.push({ name: '', degree: '', regNo: '', isDefault: false });
    container.innerHTML = renderPathologistRows(currentData);
    updateAddPathBtn();
}

function removePathologistRow(index) {
    const currentData = collectPathologistData();
    if (currentData.length <= 1) {
        showToast('At least one pathologist is required', 'error');
        return;
    }
    const wasDefault = currentData[index].isDefault;
    currentData.splice(index, 1);
    if (wasDefault && currentData.length > 0) {
        currentData[0].isDefault = true;
    }
    document.getElementById('pathologistContainer').innerHTML = renderPathologistRows(currentData);
    updateAddPathBtn();
}

function setDefaultPathologist(index) {
    const currentData = collectPathologistData();
    currentData.forEach((p, i) => p.isDefault = (i === index));
    document.getElementById('pathologistContainer').innerHTML = renderPathologistRows(currentData);
}

function collectPathologistData() {
    const rows = document.querySelectorAll('#pathologistContainer .staff-entry-row');
    return Array.from(rows).map(row => ({
        name: row.querySelector('.path-name')?.value?.trim() || '',
        degree: row.querySelector('.path-degree')?.value?.trim() || '',
        regNo: row.querySelector('.path-reg')?.value?.trim() || '',
        isDefault: row.querySelector('input[name="defaultPath"]')?.checked || false
    }));
}

function updateAddPathBtn() {
    const btn = document.getElementById('addPathBtn');
    const rows = document.querySelectorAll('#pathologistContainer .staff-entry-row');
    if (btn) {
        btn.style.display = rows.length >= 3 ? 'none' : '';
    }
}

// ==================== RENDER PROFILE PAGE ====================
async function renderProfile() {
    const container = document.getElementById('pageContainer');
    container.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p class="text-sm text-gray-400" style="margin-top:12px;">Loading profile...</p></div>`;

    try {
        const p = await getProfileData();
        const user = auth.currentUser;
        const initial = (p.fullName || p.email || 'U').charAt(0).toUpperCase();
        const providerLabel = p.provider === 'google.com' ? 'Google' : p.provider === 'password' ? 'Email/Password' : p.provider;
        const memberSince = p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
        const lastLoginDate = p.lastLogin ? new Date(p.lastLogin).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

        container.innerHTML = `
            <div style="max-width:900px;" class="space-y-5 fade-in">

                <!-- Profile Header Card -->
                <div class="card profile-header-card">
                    <div class="profile-header-gradient"></div>
                    <div class="profile-header-body">
                        <div class="flex items-end flex-wrap" style="gap:20px;">
                            <!-- Avatar -->
                            <div class="profile-avatar-wrapper">
                                <div id="profileAvatar" class="profile-avatar-main">
                                    ${p.profilePhoto ? `<img src="${p.profilePhoto}" style="width:100%;height:100%;object-fit:cover;" alt="Profile">` : initial}
                                </div>
                                <button onclick="uploadProfilePhoto()" class="profile-avatar-btn" title="Change Photo">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                </button>
                                <input type="file" id="profilePhotoInput" accept="image/*" onchange="handleProfilePhoto(event)" class="hidden">
                            </div>
                            <!-- Name & Role -->
                            <div style="flex:1;min-width:0;padding-bottom:4px;">
                                <h2 class="profile-name">${p.fullName || 'Lab User'}</h2>
                                <p class="profile-role-text" style="color:#475569;font-size:15px;font-weight:600;margin-top:6px;display:block;visibility:visible;opacity:1;">${p.role || 'Lab Owner'}${p.labName ? ' • ' + p.labName : ''}</p>
                                <div class="flex flex-wrap items-center" style="gap:8px;margin-top:10px;">
                                    <span class="badge ${p.emailVerified ? 'badge-completed' : 'badge-pending'}" style="font-size:10px;">
                                        ${p.emailVerified ? '✓ Email Verified' : '✗ Email Not Verified'}
                                    </span>
                                    <span class="badge badge-info" style="font-size:10px;">${providerLabel}</span>
                                    ${isAdmin ? '<span class="badge" style="background:#fef3c7;color:#92400e;font-size:10px;">★ Admin</span>' : ''}
                                </div>
                            </div>
                        </div>
                        <!-- Quick Stats - Separated Panel -->
                        <div class="profile-stats-box" style="margin-top:16px;">
                            <div class="profile-stat-item">
                                <p class="profile-stat-value" style="color:var(--primary);" id="profilePatientCount">—</p>
                                <p class="profile-stat-label">Patients</p>
                            </div>
                            <div style="width:1px;height:32px;background:rgba(30,60,114,0.1);"></div>
                            <div class="profile-stat-item">
                                <p class="profile-stat-value" style="color:var(--success);" id="profileReportCount">—</p>
                                <p class="profile-stat-label">Reports</p>
                            </div>
                            <div style="width:1px;height:32px;background:rgba(30,60,114,0.1);"></div>
                            <div class="profile-stat-item">
                                <p style="font-size:12px;font-weight:700;color:var(--gray-700);">${memberSince}</p>
                                <p class="profile-stat-label">Member Since</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Two Column Layout -->
                <div class="grid grid-2 gap-5" style="align-items:start;">

                    <!-- LEFT COLUMN -->
                    <div class="space-y-5">

                        <!-- Identity Section -->
                        <div class="card" style="padding:24px;">
                            <div class="flex items-center" style="gap:10px;margin-bottom:20px;">
                                <div style="width:36px;height:36px;border-radius:10px;background:#eef2ff;display:flex;align-items:center;justify-content:center;color:var(--primary);">
                                    ${ICONS.profile}
                                </div>
                                <div>
                                    <h3 class="card-title" style="margin:0;">Personal Identity</h3>
                                    <p class="text-xs text-gray-400">Your personal information</p>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <div>
                                    <label class="form-label">Full Name</label>
                                    <input type="text" id="profFullName" value="${p.fullName}" class="input-field" placeholder="Enter your full name">
                                </div>
                                <div class="grid grid-2 gap-3">
                                    <div>
                                        <label class="form-label">Gender</label>
                                        <select id="profGender" class="input-field">
                                            <option value="">Select Gender</option>
                                            <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
                                            <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
                                            <option value="Other" ${p.gender === 'Other' ? 'selected' : ''}>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="form-label">Date of Birth</label>
                                        <input type="date" id="profDOB" value="${p.dob}" class="input-field">
                                    </div>
                                </div>
                                <div>
                                    <label class="form-label">Role / Designation</label>
                                    <select id="profRole" class="input-field">
                                        <option value="Lab Owner" ${p.role === 'Lab Owner' ? 'selected' : ''}>Lab Owner</option>
                                        <option value="Lab Technician" ${p.role === 'Lab Technician' ? 'selected' : ''}>Lab Technician</option>
                                        <option value="Pathologist" ${p.role === 'Pathologist' ? 'selected' : ''}>Pathologist</option>
                                        <option value="Doctor" ${p.role === 'Doctor' ? 'selected' : ''}>Doctor</option>
                                        <option value="Receptionist" ${p.role === 'Receptionist' ? 'selected' : ''}>Receptionist</option>
                                        <option value="Manager" ${p.role === 'Manager' ? 'selected' : ''}>Manager</option>
                                        <option value="Other" ${p.role === 'Other' ? 'selected' : ''}>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">Bio / About</label>
                                    <textarea id="profBio" class="input-field" rows="3" placeholder="Brief description about yourself..." style="resize:vertical;">${p.bio}</textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Information -->
                        <div class="card" style="padding:24px;">
                            <div class="flex items-center" style="gap:10px;margin-bottom:20px;">
                                <div style="width:36px;height:36px;border-radius:10px;background:#ecfdf5;display:flex;align-items:center;justify-content:center;color:var(--success);">
                                    ${ICONS.phone}
                                </div>
                                <div>
                                    <h3 class="card-title" style="margin:0;">Contact Information</h3>
                                    <p class="text-xs text-gray-400">How to reach you</p>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <div class="grid grid-2 gap-3">
                                    <div>
                                        <label class="form-label">Mobile Number (Primary)</label>
                                        <input type="tel" id="profMobile" value="${p.mobile}" class="input-field" placeholder="+91 XXXXX XXXXX">
                                    </div>
                                    <div>
                                        <label class="form-label">Alternate Phone</label>
                                        <input type="tel" id="profAltPhone" value="${p.alternatePhone}" class="input-field" placeholder="Alternate number">
                                    </div>
                                </div>
                                <div class="grid grid-2 gap-3">
                                    <div>
                                        <label class="form-label">Email (Primary)</label>
                                        <input type="email" id="profEmail" value="${p.email}" class="input-field" readonly style="opacity:0.6;cursor:not-allowed;" title="Email cannot be changed">
                                    </div>
                                    <div>
                                        <label class="form-label">Alternate Email</label>
                                        <input type="email" id="profAltEmail" value="${p.alternateEmail}" class="input-field" placeholder="Alternate email">
                                    </div>
                                </div>
                                <div>
                                    <label class="form-label">Address</label>
                                    <input type="text" id="profAddress" value="${p.address}" class="input-field" placeholder="Full address">
                                </div>
                                <div class="grid grid-3 gap-3">
                                    <div>
                                        <label class="form-label">City</label>
                                        <input type="text" id="profCity" value="${p.city}" class="input-field" placeholder="City">
                                    </div>
                                    <div>
                                        <label class="form-label">State</label>
                                        <input type="text" id="profState" value="${p.state}" class="input-field" placeholder="State">
                                    </div>
                                    <div>
                                        <label class="form-label">Pincode</label>
                                        <input type="text" id="profPincode" value="${p.pincode}" class="input-field" placeholder="Pincode">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Lab Staff: Technician -->
                        <div class="card" style="padding:24px;">
                            <div class="flex items-center" style="gap:10px;margin-bottom:20px;">
                                <div style="width:36px;height:36px;border-radius:10px;background:#eff6ff;display:flex;align-items:center;justify-content:center;color:#3b82f6;">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                                </div>
                                <div>
                                    <h3 class="card-title" style="margin:0;">Lab Technician</h3>
                                    <p class="text-xs text-gray-400">Technician who processes samples</p>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <div class="grid grid-2 gap-3">
                                    <div>
                                        <label class="form-label">Technician Name</label>
                                        <input type="text" id="profTechName" value="${p.techName || ''}" class="input-field" placeholder="Full name">
                                    </div>
                                    <div>
                                        <label class="form-label">Qualification</label>
                                        <input type="text" id="profTechQual" value="${p.techDegree || ''}" class="input-field" placeholder="DMLT, B.Sc MLT, etc.">
                                    </div>
                                </div>
                                <div>
                                    <label class="form-label">Registration Number (Optional)</label>
                                    <input type="text" id="profTechRegNo" value="${p.techRegNo || ''}" class="input-field" placeholder="Council registration number">
                                </div>
                            </div>
                        </div>

                        <!-- Lab Staff: Pathologists (Multiple) -->
                        <div class="card" style="padding:24px;">
                            <div class="flex justify-between items-start" style="margin-bottom:20px;">
                                <div class="flex items-center" style="gap:10px;">
                                    <div style="width:36px;height:36px;border-radius:10px;background:#fdf4ff;display:flex;align-items:center;justify-content:center;color:#a855f7;">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                                    </div>
                                    <div>
                                        <h3 class="card-title" style="margin:0;">Pathologists</h3>
                                        <p class="text-xs text-gray-400">Report signatories (min 1, max 3)</p>
                                    </div>
                                </div>
                                <button onclick="addPathologistRow()" class="btn btn-ghost btn-xs" id="addPathBtn">
                                    ${ICONS.plus} Add
                                </button>
                            </div>
                            <div id="pathologistContainer" class="space-y-4">
                                ${renderPathologistRows(p.pathologists || [{name: p.pathologistName || '', degree: p.pathologistDegree || '', regNo: p.pathologistRegNo || '', isDefault: true}])}
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN -->
                    <div class="space-y-5">

                        <!-- Account Security -->
                        <div class="card" style="padding:24px;">
                            <div class="flex items-center" style="gap:10px;margin-bottom:20px;">
                                <div style="width:36px;height:36px;border-radius:10px;background:#fef2f2;display:flex;align-items:center;justify-content:center;color:var(--danger);">
                                    ${ICONS.shield}
                                </div>
                                <div>
                                    <h3 class="card-title" style="margin:0;">Account & Security</h3>
                                    <p class="text-xs text-gray-400">Manage your account security</p>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <!-- User ID -->
                                <div style="padding:14px 16px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--gray-200);">
                                    <p class="text-xs text-gray-400 font-semibold" style="text-transform:uppercase;letter-spacing:0.04em;">User ID</p>
                                    <p style="font-family:'Courier New',monospace;font-size:12px;color:var(--gray-600);margin-top:4px;word-break:break-all;">${p.uid}</p>
                                </div>

                                <!-- Login Provider -->
                                <div style="padding:14px 16px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--gray-200);">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <p class="text-xs text-gray-400 font-semibold" style="text-transform:uppercase;letter-spacing:0.04em;">Login Method</p>
                                            <p style="font-size:14px;font-weight:600;color:var(--gray-700);margin-top:4px;">${providerLabel}</p>
                                        </div>
                                        ${p.provider === 'google.com' ? `
                                            <div style="width:32px;height:32px;border-radius:8px;background:white;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-sm);">
                                                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                            </div>
                                        ` : `
                                            <div style="width:32px;height:32px;border-radius:8px;background:var(--primary-light);display:flex;align-items:center;justify-content:center;color:var(--primary);">
                                                ${ICONS.mail}
                                            </div>
                                        `}
                                    </div>
                                </div>

                                <!-- Email Verification -->
                                <div style="padding:14px 16px;background:${p.emailVerified ? '#ecfdf5' : '#fffbeb'};border-radius:var(--radius-md);border:1px solid ${p.emailVerified ? '#a7f3d0' : '#fde68a'};">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <p style="font-size:13px;font-weight:600;color:${p.emailVerified ? '#065f46' : '#92400e'};">
                                                ${p.emailVerified ? '✓ Email Verified' : '✗ Email Not Verified'}
                                            </p>
                                            <p style="font-size:11px;color:${p.emailVerified ? '#047857' : '#a16207'};margin-top:2px;">${p.email}</p>
                                        </div>
                                        ${!p.emailVerified ? `<button onclick="sendVerificationEmail()" class="btn btn-warning btn-xs">Verify Now</button>` : ''}
                                    </div>
                                </div>

                                <!-- Change Password -->
                                ${p.provider === 'password' ? `
                                <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--gray-200);">
                                    <p class="text-xs text-gray-400 font-semibold" style="text-transform:uppercase;letter-spacing:0.04em;margin-bottom:12px;">Change Password</p>
                                    <div class="space-y-3">
                                        <div>
                                            <label class="form-label">Current Password</label>
                                            <input type="password" id="profCurrentPass" class="input-field" placeholder="Enter current password">
                                        </div>
                                        <div>
                                            <label class="form-label">New Password</label>
                                            <input type="password" id="profNewPass" class="input-field" placeholder="Min 6 characters">
                                        </div>
                                        <div>
                                            <label class="form-label">Confirm New Password</label>
                                            <input type="password" id="profConfirmPass" class="input-field" placeholder="Repeat new password">
                                        </div>
                                        <button onclick="changePassword()" id="changePassBtn" class="btn btn-danger btn-sm" style="width:100%;">
                                            ${ICONS.key} Change Password
                                        </button>
                                    </div>
                                </div>
                                ` : `
                                <div style="padding:14px 16px;background:#eef2ff;border-radius:var(--radius-md);border:1px solid #c7d2fe;">
                                    <p style="font-size:12px;color:#4338ca;font-weight:500;">
                                        Password is managed by Google. Use your Google account settings to change it.
                                    </p>
                                </div>
                                `}
                            </div>
                        </div>

                        <!-- Login Activity -->
                        <div class="card" style="padding:24px;">
                            <div class="flex items-center" style="gap:10px;margin-bottom:20px;">
                                <div style="width:36px;height:36px;border-radius:10px;background:#fffbeb;display:flex;align-items:center;justify-content:center;color:var(--warning);">
                                    ${ICONS.history}
                                </div>
                                <div>
                                    <h3 class="card-title" style="margin:0;">Login Activity</h3>
                                    <p class="text-xs text-gray-400">Your recent login information</p>
                                </div>
                            </div>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center" style="padding:12px 16px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--gray-200);">
                                    <div>
                                        <p style="font-size:12px;font-weight:600;color:var(--gray-700);">Last Login</p>
                                        <p style="font-size:11px;color:var(--gray-400);margin-top:2px;">${lastLoginDate}</p>
                                    </div>
                                    <div style="width:8px;height:8px;border-radius:50%;background:var(--success);"></div>
                                </div>
                                <div class="flex justify-between items-center" style="padding:12px 16px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--gray-200);">
                                    <div>
                                        <p style="font-size:12px;font-weight:600;color:var(--gray-700);">Account Created</p>
                                        <p style="font-size:11px;color:var(--gray-400);margin-top:2px;">${memberSince}</p>
                                    </div>
                                    <span class="badge badge-info" style="font-size:10px;">Active</span>
                                </div>
                                <div style="padding:12px 16px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--gray-200);">
                                    <p style="font-size:12px;font-weight:600;color:var(--gray-700);">Current Session</p>
                                    <div class="flex flex-wrap" style="gap:8px;margin-top:8px;">
                                        <span style="font-size:10px;padding:3px 10px;background:white;border:1px solid var(--gray-200);border-radius:20px;color:var(--gray-500);">
                                            ${navigator.userAgent.includes('Chrome') ? '🌐 Chrome' : navigator.userAgent.includes('Firefox') ? '🦊 Firefox' : navigator.userAgent.includes('Safari') ? '🧭 Safari' : '🌐 Browser'}
                                        </span>
                                        <span style="font-size:10px;padding:3px 10px;background:white;border:1px solid var(--gray-200);border-radius:20px;color:var(--gray-500);">
                                            ${navigator.userAgent.includes('Windows') ? '💻 Windows' : navigator.userAgent.includes('Mac') ? '🍎 macOS' : navigator.userAgent.includes('Android') ? '📱 Android' : navigator.userAgent.includes('iPhone') ? '📱 iOS' : '💻 Device'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Danger Zone -->
                        <div class="card" style="padding:24px;border-color:#fecaca;">
                            <div class="flex items-center" style="gap:10px;margin-bottom:16px;">
                                <div style="width:36px;height:36px;border-radius:10px;background:#fef2f2;display:flex;align-items:center;justify-content:center;color:var(--danger);">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-1.964-.834-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                                </div>
                                <div>
                                    <h3 class="card-title" style="margin:0;color:var(--danger);">Danger Zone</h3>
                                    <p class="text-xs text-gray-400">Irreversible actions</p>
                                </div>
                            </div>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center" style="padding:12px 16px;border:1px solid #fecaca;border-radius:var(--radius-md);">
                                    <div>
                                        <p style="font-size:13px;font-weight:600;color:var(--gray-700);">Sign Out</p>
                                        <p style="font-size:11px;color:var(--gray-400);">Log out from this device</p>
                                    </div>
                                    <button onclick="handleLogout()" class="btn btn-outline btn-xs">Sign Out</button>
                                </div>
                                <div class="flex justify-between items-center" style="padding:12px 16px;border:1px solid #fecaca;border-radius:var(--radius-md);">
                                    <div>
                                        <p style="font-size:13px;font-weight:600;color:var(--danger);">Delete Account</p>
                                        <p style="font-size:11px;color:var(--gray-400);">Permanently delete your account & data</p>
                                    </div>
                                    <button onclick="deleteAccount()" class="btn btn-danger btn-xs">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <div style="padding-bottom:24px;">
                    <button onclick="saveProfile()" id="saveProfileBtn" class="btn btn-primary btn-lg" style="min-width:220px;">
                        ${ICONS.check} Save Profile
                    </button>
                </div>
            </div>
        `;

        // Load patient & report counts
        loadProfileStats();

    } catch (e) {
        container.innerHTML = `<div class="empty-state"><p class="text-danger">Error loading profile: ${e.message}</p></div>`;
    }
}

// ==================== LOAD PROFILE STATS ====================
async function loadProfileStats() {
    try {
        const [patients, reports] = await Promise.all([
            DB.getPatients(),
            DB.getReports()
        ]);
        const pc = document.getElementById('profilePatientCount');
        const rc = document.getElementById('profileReportCount');
        if (pc) pc.textContent = patients.length;
        if (rc) rc.textContent = reports.length;
    } catch (e) {
        console.error('loadProfileStats error:', e);
    }
}

// ==================== SAVE PROFILE ====================
async function saveProfile() {
    const btn = document.getElementById('saveProfileBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="btn-loader"></div> Saving...'; }

    try {
        // Collect pathologist data
        const pathologists = collectPathologistData();
        const defaultPath = pathologists.find(p => p.isDefault) || pathologists[0] || {};

        const profileData = {
            profileName: document.getElementById('profFullName').value.trim(),
            ownerName: document.getElementById('profFullName').value.trim(),
            profileGender: document.getElementById('profGender').value,
            profileDOB: document.getElementById('profDOB').value,
            profileRole: document.getElementById('profRole').value,
            profileBio: document.getElementById('profBio').value.trim(),
            phone: document.getElementById('profMobile').value.trim(),
            profileMobile: document.getElementById('profMobile').value.trim(),
            alternatePhone: document.getElementById('profAltPhone').value.trim(),
            alternateEmail: document.getElementById('profAltEmail').value.trim(),
            address: document.getElementById('profAddress').value.trim(),
            profileAddress: document.getElementById('profAddress').value.trim(),
            profileCity: document.getElementById('profCity').value.trim(),
            profileState: document.getElementById('profState').value.trim(),
            profilePincode: document.getElementById('profPincode').value.trim(),
            // Lab Technician
            techName: document.getElementById('profTechName').value.trim(),
            techDegree: document.getElementById('profTechQual').value.trim(),
            techRegNo: document.getElementById('profTechRegNo').value.trim(),
            // Pathologists (array + default for backward compat)
            pathologists: pathologists,
            pathologistName: defaultPath.name || '',
            pathologistDegree: defaultPath.degree || '',
            pathologistRegNo: defaultPath.regNo || ''
        };

        await saveProfileData(profileData);

        // Update Firebase Auth display name
        const user = auth.currentUser;
        if (user && profileData.profileName) {
            await user.updateProfile({ displayName: profileData.profileName });
            renderUserInfo(user);
        }

        showToast('Profile saved successfully');
    } catch (e) {
        showToast('Error saving profile: ' + e.message, 'error');
    }

    if (btn) { btn.disabled = false; btn.innerHTML = ICONS.check + ' Save Profile'; }
}

// ==================== PROFILE PHOTO ====================
function uploadProfilePhoto() {
    document.getElementById('profilePhotoInput').click();
}

async function handleProfilePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        showToast('Photo must be under 2MB', 'error');
        return;
    }

    showToast('Uploading photo...', 'info');

    try {
        const ref = storage.ref(`profiles/${DB.userId}/photo`);
        await ref.put(file);
        const url = await ref.getDownloadURL();

        await saveProfileData({ profilePhoto: url });
        await auth.currentUser.updateProfile({ photoURL: url });

        const avatar = document.getElementById('profileAvatar');
        if (avatar) {
            avatar.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;" alt="Profile">`;
        }

        renderUserInfo(auth.currentUser);
        showToast('Profile photo updated');
    } catch (e) {
        showToast('Upload failed: ' + e.message, 'error');
    }
}

// ==================== CHANGE PASSWORD ====================
async function changePassword() {
    const currentPass = document.getElementById('profCurrentPass').value;
    const newPass = document.getElementById('profNewPass').value;
    const confirmPass = document.getElementById('profConfirmPass').value;

    if (!currentPass || !newPass || !confirmPass) {
        showToast('Please fill all password fields', 'error');
        return;
    }
    if (newPass.length < 6) {
        showToast('New password must be at least 6 characters', 'error');
        return;
    }
    if (newPass !== confirmPass) {
        showToast('New passwords do not match', 'error');
        return;
    }

    const btn = document.getElementById('changePassBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="btn-loader"></div> Changing...'; }

    try {
        const user = auth.currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPass);
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPass);

        document.getElementById('profCurrentPass').value = '';
        document.getElementById('profNewPass').value = '';
        document.getElementById('profConfirmPass').value = '';

        showToast('Password changed successfully');
    } catch (e) {
        const messages = {
            'auth/wrong-password': 'Current password is incorrect',
            'auth/weak-password': 'New password is too weak',
            'auth/requires-recent-login': 'Please sign out and sign in again before changing password'
        };
        showToast(messages[e.code] || 'Error: ' + e.message, 'error');
    }

    if (btn) { btn.disabled = false; btn.innerHTML = ICONS.key + ' Change Password'; }
}

// ==================== EMAIL VERIFICATION ====================
async function sendVerificationEmail() {
    try {
        await auth.currentUser.sendEmailVerification();
        showToast('Verification email sent! Check your inbox.', 'success');
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    }
}

// ==================== DELETE ACCOUNT ====================
async function deleteAccount() {
    if (!confirm('⚠️ WARNING: This will permanently delete your account, all patients, reports, and lab data. This cannot be undone!')) return;
    if (!confirm('Are you absolutely sure? Type "DELETE" in your mind and click OK.')) return;

    try {
        showToast('Deleting account...', 'info');
        await DB.clearAll();
        await auth.currentUser.delete();
        showToast('Account deleted', 'info');
    } catch (e) {
        if (e.code === 'auth/requires-recent-login') {
            showToast('Please sign out, sign in again, then try deleting.', 'error');
        } else {
            showToast('Error: ' + e.message, 'error');
        }
    }
}
