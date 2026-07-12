/**
 * CUREBIT - Lab Settings Page (Firebase/Async)
 */

async function renderSettings() {
    const container = document.getElementById('pageContainer');
    container.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p class="text-sm text-gray-400" style="margin-top:12px;">Loading settings...</p></div>`;

    try {
        const lab = await DB.getLabProfile();

        container.innerHTML = `
            <div style="max-width:1200px;width:100%;" class="space-y-5 fade-in">
                <!-- Lab Profile -->
                <div class="card" style="padding:24px;">
                    <h3 class="card-title" style="margin-bottom:16px;">Lab Profile</h3>
                    <div class="grid grid-2 gap-4">
                        <div style="grid-column:span 2;">
                            <label class="form-label">Lab / Clinic Name *</label>
                            <input type="text" id="sLabName" value="${lab.labName || ''}" class="input-field">
                        </div>
                        <div style="grid-column:span 2;">
                            <label class="form-label">Address</label>
                            <input type="text" id="sLabAddress" value="${lab.address || ''}" class="input-field">
                        </div>
                        <div>
                            <label class="form-label">Phone</label>
                            <input type="text" id="sLabPhone" value="${lab.phone || ''}" class="input-field">
                        </div>
                        <div>
                            <label class="form-label">Email</label>
                            <input type="email" id="sLabEmail" value="${lab.email || ''}" class="input-field">
                        </div>
                        <div>
                            <label class="form-label">Registration No.</label>
                            <input type="text" id="sLabRegNo" value="${lab.regNo || ''}" class="input-field">
                        </div>
                        <div>
                            <label class="form-label">Report Header Color</label>
                            <div class="flex items-center" style="gap:8px;">
                                <input type="color" id="sHeaderColor" value="${lab.headerColor || '#1e40af'}" style="width:48px;height:40px;border:1px solid var(--gray-200);border-radius:8px;cursor:pointer;padding:2px;">
                                <span class="text-xs text-gray-400">Used in printed reports</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Logo -->
                <div class="card" style="padding:24px;">
                    <h3 class="card-title" style="margin-bottom:16px;">Logo</h3>
                    <div class="flex items-center" style="gap:20px;">
                        <div id="logoPreview" style="width:80px;height:80px;border:2px dashed var(--gray-200);border-radius:16px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--gray-50);color:var(--gray-300);flex-shrink:0;">
                            ${lab.logo ? `<img src="${lab.logo}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="Logo">` : ICONS.image}
                        </div>
                        <div>
                            <input type="file" id="logoInput" accept="image/*" onchange="handleLogo(event)" style="font-size:13px;color:var(--gray-500);">
                            <p class="text-xs text-gray-400" style="margin-top:4px;">PNG, JPG. Uploaded to Cloudinary ☁️</p>
                            <p id="logoUploadStatus" class="text-xs text-primary hidden" style="margin-top:4px;">Uploading...</p>
                            ${lab.logo ? '<button onclick="removeLogo()" class="text-xs text-danger font-medium" style="margin-top:4px;border:none;background:none;cursor:pointer;">Remove Logo</button>' : ''}
                        </div>
                    </div>
                </div>

                <!-- Consultant / Doctor -->
                <div class="card" style="padding:24px;">
                    <h3 class="card-title" style="margin-bottom:16px;">Consultant / Doctor</h3>
                    <div class="grid grid-2 gap-4">
                        <div>
                            <label class="form-label">Consultant / Doctor Name</label>
                            <input type="text" id="sDocName" value="${lab.doctorName || ''}" class="input-field" placeholder="Dr. Name">
                        </div>
                        <div>
                            <label class="form-label">Consultant Qualification</label>
                            <input type="text" id="sDocQual" value="${lab.doctorQualification || ''}" class="input-field" placeholder="MBBS, MD, etc.">
                        </div>
                    </div>
                </div>

                <!-- Pathologist -->
                <div class="card" style="padding:24px;">
                    <h3 class="card-title" style="margin-bottom:16px;">Pathologist</h3>
                    <div class="grid grid-2 gap-4">
                        <div>
                            <label class="form-label">Pathologist Name</label>
                            <input type="text" id="sPathName" value="${lab.pathologistName || ''}" class="input-field" placeholder="Pathologist Name">
                        </div>
                        <div>
                            <label class="form-label">Pathologist Qualification</label>
                            <input type="text" id="sPathQual" value="${lab.pathologistDegree || ''}" class="input-field" placeholder="MD Pathology, etc.">
                        </div>
                    </div>
                </div>

                <!-- Lab Technician -->
                <div class="card" style="padding:24px;">
                    <h3 class="card-title" style="margin-bottom:16px;">Lab Technician</h3>
                    <div class="grid grid-2 gap-4">
                        <div>
                            <label class="form-label">Technician Name</label>
                            <input type="text" id="sTechName" value="${lab.techName || ''}" class="input-field" placeholder="Technician Name">
                        </div>
                        <div>
                            <label class="form-label">Technician Qualification</label>
                            <input type="text" id="sTechQual" value="${lab.techDegree || ''}" class="input-field" placeholder="B.Sc, DMLT, etc.">
                        </div>
                        <div style="grid-column:span 2;">
                            <label class="form-label">Signature Text (printed on report)</label>
                            <input type="text" id="sSignText" value="${lab.signatureText || ''}" class="input-field" placeholder="e.g., Verified & Approved">
                        </div>
                    </div>
                </div>

                <!-- Account Info -->
                <div class="card" style="padding:24px;">
                    <h3 class="card-title" style="margin-bottom:16px;">Account</h3>
                    <div class="space-y-3">
                        <div class="flex items-center" style="gap:12px;">
                            <div class="avatar avatar-md avatar-indigo">${(auth.currentUser?.displayName || auth.currentUser?.email || 'U').charAt(0).toUpperCase()}</div>
                            <div>
                                <p class="font-semibold text-gray-800">${auth.currentUser?.displayName || 'Lab User'}</p>
                                <p class="text-xs text-gray-400">${auth.currentUser?.email || ''}</p>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400">User ID: <span style="font-family:monospace;">${auth.currentUser?.uid || ''}</span></p>
                        <p class="text-xs text-gray-400">Data stored securely in Firebase Cloud ☁️</p>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-wrap" style="gap:12px;padding-bottom:24px;">
                    <button onclick="SubscriptionGuard.run(() => saveSettings())" id="saveSettingsBtn" class="btn btn-primary">
                        ${ICONS.check} Save Settings
                    </button>
                    <button onclick="exportData()" class="btn btn-ghost">
                        ${ICONS.download} Export Data
                    </button>
                    <button onclick="importDataClick()" class="btn btn-ghost">
                        ${ICONS.upload} Import Data
                    </button>
                    <input type="file" id="importFile" accept=".json" onchange="importData(event)" class="hidden">
                    <button onclick="handleResetAll()" class="btn btn-danger">
                        ${ICONS.delete} Reset All Data
                    </button>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><p class="text-danger">Error: ${e.message}</p></div>`;
    }
}

async function saveSettings() {
    const btn = document.getElementById('saveSettingsBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="btn-loader"></div> Saving...'; }

    try {
        const profile = {
            labName: document.getElementById('sLabName').value.trim(),
            address: document.getElementById('sLabAddress').value.trim(),
            phone: document.getElementById('sLabPhone').value.trim(),
            email: document.getElementById('sLabEmail').value.trim(),
            regNo: document.getElementById('sLabRegNo').value.trim(),
            regNumber: document.getElementById('sLabRegNo').value.trim(),
            headerColor: document.getElementById('sHeaderColor').value,
            doctorName: document.getElementById('sDocName').value.trim(),
            consultantName: document.getElementById('sDocName').value.trim(),
            doctorQualification: document.getElementById('sDocQual').value.trim(),
            consultantDegree: document.getElementById('sDocQual').value.trim(),
            pathologistName: document.getElementById('sPathName').value.trim(),
            pathologistDegree: document.getElementById('sPathQual').value.trim(),
            techName: document.getElementById('sTechName').value.trim(),
            techDegree: document.getElementById('sTechQual').value.trim(),
            signatureText: document.getElementById('sSignText').value.trim()
        };

        await DB.saveLabProfile(profile);
        updateLabNameHeader();
        showToast('Settings saved to cloud ☁️');
    } catch (e) {
        showToast('Error saving: ' + e.message, 'error');
    }

    if (btn) { btn.disabled = false; btn.innerHTML = ICONS.check + ' Save Settings'; }
}

async function handleLogo(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        showToast('Logo must be under 2MB', 'error');
        return;
    }

    const status = document.getElementById('logoUploadStatus');
    if (status) { status.classList.remove('hidden'); status.textContent = 'Uploading to Cloudinary...'; }

    try {
        const url = await DB.uploadLogo(file);
        document.getElementById('logoPreview').innerHTML = `<img src="${url}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="Logo">`;
        if (status) { status.textContent = 'Uploaded ✓'; setTimeout(() => status.classList.add('hidden'), 2000); }
        showToast('Logo uploaded');
    } catch (e) {
        showToast('Logo upload failed: ' + e.message, 'error');
        if (status) status.classList.add('hidden');
    }
}

async function removeLogo() {
    try {
        await DB.removeLogo();
        document.getElementById('logoPreview').innerHTML = ICONS.image;
        showToast('Logo removed');
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    }
}

async function handleResetAll() {
    if (!confirm('This will delete ALL your patients, reports, and settings from the cloud. Are you sure?')) return;
    if (!confirm('This action cannot be undone! Type "yes" in the next prompt to confirm.')) return;

    try {
        await DB.clearAll();
        showToast('All data cleared');
        showPage('dashboard');
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    }
}

// ==================== TEMPLATES PAGE ====================
function renderTemplates() {
    const stats = getTemplateStats();
    const categories = stats.categories;

    let html = '<div class="space-y-6 fade-in">';

    html += `<div class="card" style="padding:24px;">
        <div class="flex flex-wrap items-center" style="gap:32px;">
            <div class="text-center">
                <p class="text-3xl font-extrabold text-primary">${stats.totalPanels}</p>
                <p class="text-xs text-gray-500 font-medium" style="margin-top:4px;">Test Panels</p>
            </div>
            <div style="width:1px;height:40px;background:var(--gray-200);"></div>
            <div class="text-center">
                <p class="text-3xl font-extrabold text-success">${stats.totalParams}</p>
                <p class="text-xs text-gray-500 font-medium" style="margin-top:4px;">Total Parameters</p>
            </div>
            <div style="width:1px;height:40px;background:var(--gray-200);"></div>
            <div class="text-center">
                <p class="text-3xl font-extrabold" style="color:#7c3aed;">${stats.totalCategories}</p>
                <p class="text-xs text-gray-500 font-medium" style="margin-top:4px;">Categories</p>
            </div>
        </div>
    </div>`;

    Object.entries(categories).forEach(([cat, templateNames]) => {
        html += `<div>
            <h3 class="section-title" style="margin-bottom:12px;">
                <span class="section-dot"></span>
                ${cat}
                <span class="text-xs text-gray-400 font-medium" style="font-weight:400;letter-spacing:normal;text-transform:none;">(${templateNames.length} panels)</span>
            </h3>
            <div class="grid grid-3 lg-grid-3 gap-3">
                ${templateNames.map(name => {
                    const t = TEST_TEMPLATES[name];
                    return `<div class="card card-hover" style="padding:16px;cursor:pointer;" onclick="toggleTemplateDetail(this)">
                        <div class="flex justify-between items-start">
                            <div style="min-width:0;">
                                <h4 class="font-semibold text-sm text-gray-800">${name}</h4>
                                <p class="text-xs text-gray-400" style="margin-top:4px;">${t.tests.length} parameters</p>
                            </div>
                            <div class="stat-icon" style="width:32px;height:32px;background:#eef2ff;border-radius:8px;">
                                <svg width="16" height="16" fill="none" stroke="#4f46e5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                            </div>
                        </div>
                        <div class="template-detail" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--gray-100);">
                            <div class="space-y-1">
                                ${t.tests.map(test => `<div class="text-xs flex justify-between" style="color:var(--gray-600);"><span>${test.name}</span><span class="text-gray-400">${test.unit}</span></div>`).join('')}
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    });

    html += '</div>';
    document.getElementById('pageContainer').innerHTML = html;
}

function toggleTemplateDetail(card) {
    const detail = card.querySelector('.template-detail');
    if (detail) detail.classList.toggle('show');
}

