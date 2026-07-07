/**
 * CUREBIT - Patients Page (Pure Vanilla CSS — No Tailwind)
 */

async function renderPatients() {
    const container = document.getElementById('pageContainer');
    container.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p style="margin-top:12px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Loading patients directory...</p></div>`;

    try {
        const patients = await DB.getPatients();
        const reports  = await DB.getReports();

        const maleCount   = patients.filter(p => (p.gender || '').toLowerCase().includes('male') && !(p.gender || '').toLowerCase().includes('female')).length;
        const femaleCount = patients.filter(p => (p.gender || '').toLowerCase().includes('female')).length;

        const plusSvg = `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>`;
        const searchSvg = `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`;

        const patientRows = patients.map(p => {
            const pReports = reports.filter(r => r.patientId === p.id);
            const initials = p.name ? p.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'PT';
            const hue = (p.name ? p.name.charCodeAt(0) * 47 : 200) % 360;
            const genderStr = (p.gender || 'Other').toLowerCase();
            const isFemale = genderStr.includes('female');
            const isMale = genderStr.includes('male') && !isFemale;
            
            const genderBadge = isFemale 
                ? `<span style="padding:3px 9px;border-radius:20px;background:#fce7f3;color:#be185d;font-size:10.5px;font-weight:700;display:inline-flex;align-items:center;gap:3px;">♀ Female</span>`
                : (isMale 
                    ? `<span style="padding:3px 9px;border-radius:20px;background:#e0f2fe;color:#0369a1;font-size:10.5px;font-weight:700;display:inline-flex;align-items:center;gap:3px;">♂ Male</span>`
                    : `<span style="padding:3px 9px;border-radius:20px;background:#f1f5f9;color:#475569;font-size:10.5px;font-weight:700;">${p.gender}</span>`);

            return `
            <tr class="patient-row" style="border-bottom:1px solid #f1f5f9;transition:all 0.15s ease;"
                data-search="${(p.name + (p.phone || '') + (p.referredBy || '') + p.id).toLowerCase()}"
                data-gender="${isFemale ? 'female' : (isMale ? 'male' : 'other')}"
                onmouseover="this.style.background='#faf8ff';" onmouseout="this.style.background='transparent';">
                
                <!-- Patient Name & ID -->
                <td style="padding:14px 20px;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="width:38px;height:38px;border-radius:11px;background:hsl(${hue},65%,92%);color:hsl(${hue},70%,32%);border:1.5px solid hsl(${hue},60%,82%);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
                            ${initials}
                        </div>
                        <div>
                            <div style="font-size:13.5px;font-weight:800;color:#0f172a;line-height:1.2;letter-spacing:-0.01em;">${p.name}</div>
                            <div style="display:flex;align-items:center;gap:6px;margin-top:3px;">
                                <span style="font-size:10px;color:#64748b;font-family:monospace;background:#f1f5f9;padding:1px 6px;border-radius:4px;font-weight:600;">#${p.id.slice(0, 8)}</span>
                                ${p.referredBy ? `<span style="font-size:10px;color:#6366f1;font-weight:600;">Ref: Dr. ${p.referredBy}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </td>

                <!-- Age / Gender -->
                <td style="padding:14px 20px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:13px;font-weight:700;color:#1e293b;">${p.age} <span style="font-size:11px;color:#64748b;font-weight:500;">Yrs</span></span>
                        ${genderBadge}
                    </div>
                </td>

                <!-- Phone -->
                <td style="padding:14px 20px;">
                    ${p.phone ? `
                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="font-size:13px;font-weight:600;color:#334155;font-family:monospace;">${p.phone}</span>
                        <button onclick="shareOnWhatsAppDirect('${p.phone}')" title="Chat on WhatsApp"
                            style="width:24px;height:24px;border-radius:6px;border:none;background:#25d36615;color:#16a34a;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;">
                            ${ICONS.whatsapp}
                        </button>
                    </div>` : '<span style="color:#cbd5e1;font-size:12px;">Not provided</span>'}
                </td>

                <!-- Linked Reports -->
                <td style="padding:14px 20px;">
                    <button onclick="showPage('reports')" title="View patient reports"
                        style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:11.5px;font-weight:700;background:${pReports.length > 0 ? '#e0e7ff' : '#f1f5f9'};color:${pReports.length > 0 ? '#4338ca' : '#64748b'};border:none;cursor:pointer;">
                        ${ICONS.reports} ${pReports.length} Report${pReports.length !== 1 ? 's' : ''}
                    </button>
                </td>

                <!-- Actions -->
                <td style="padding:14px 20px;text-align:right;">
                    <div style="display:flex;align-items:center;justify-content:flex-end;gap:6px;">
                        <button onclick="createReportForPatient('${p.id}')" title="Create New Report"
                            style="padding:6px 12px;border-radius:8px;border:none;background:#4f46e5;color:white;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:5px;cursor:pointer;box-shadow:0 1px 3px rgba(79,70,229,0.25);transition:all 0.15s;"
                            onmouseover="this.style.background='#4338ca';" onmouseout="this.style.background='#4f46e5';">
                            ${plusSvg} Report
                        </button>
                        <button onclick="editPatient('${p.id}')" title="Edit Patient Details"
                            style="width:32px;height:32px;border-radius:8px;border:1.5px solid #e2e8f0;background:white;color:#475569;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.borderColor='#94a3b8';this.style.color='#0f172a';this.style.background='#f8fafc';" onmouseout="this.style.borderColor='#e2e8f0';this.style.color='#475569';this.style.background='white';">
                            ${ICONS.edit}
                        </button>
                        <button onclick="deletePatient('${p.id}')" title="Delete Patient Record"
                            style="width:32px;height:32px;border-radius:8px;border:1.5px solid #e2e8f0;background:white;color:#94a3b8;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.borderColor='#fca5a5';this.style.color='#ef4444';this.style.background='#fee2e2';" onmouseout="this.style.borderColor='#e2e8f0';this.style.color='#94a3b8';this.style.background='white';">
                            ${ICONS.delete}
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');

        const emptyState = `
            <div style="padding:64px 24px;text-align:center;">
                <div style="width:56px;height:56px;border-radius:16px;background:#eef2ff;color:#4f46e5;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
                    ${ICONS.patients}
                </div>
                <h3 style="font-size:16px;font-weight:800;color:#0f172a;margin:0 0 6px;">No patients registered yet</h3>
                <p style="font-size:13px;color:#64748b;margin:0 0 20px;max-width:320px;margin-left:auto;margin-right:auto;">Register your first patient to manage diagnostic history and test reports.</p>
                <button onclick="showAddPatientModal()" class="btn btn-primary" style="padding:10px 22px;font-size:13px;border-radius:10px;gap:6px;">
                    ${plusSvg} Register Patient
                </button>
            </div>`;

        container.innerHTML = `
        <div class="fade-in" style="max-width:1600px;width:100%;margin:0 auto;">

            <!-- ░░ HERO COMMAND BAR ░░ -->
            <div style="background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);border-radius:16px;padding:22px 28px;margin-bottom:24px;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
                <div style="display:flex;align-items:center;gap:16px;">
                    <div style="width:48px;height:48px;border-radius:14px;background:#4f46e5;color:white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(79,70,229,0.3);flex-shrink:0;">
                        ${ICONS.patients}
                    </div>
                    <div>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <h2 style="margin:0;font-size:20px;font-weight:900;color:#0f172a;letter-spacing:-0.02em;">Patient Directory</h2>
                            <span style="padding:2px 10px;border-radius:20px;background:#e0e7ff;color:#4338ca;font-size:11px;font-weight:800;">${patients.length} Registered</span>
                        </div>
                        <p style="margin:4px 0 0;font-size:12px;color:#64748b;font-weight:500;">
                            Manage patient records, demographics, and clinical diagnostic reports
                        </p>
                    </div>
                </div>

                <div style="display:flex;align-items:center;gap:12px;">
                    <button onclick="showAddPatientModal()" class="btn btn-primary" style="padding:10px 22px;font-size:13px;border-radius:10px;gap:8px;box-shadow:0 4px 12px rgba(79,70,229,0.25);">
                        ${plusSvg} Add New Patient
                    </button>
                </div>
            </div>

            <!-- ░░ STATS STRIP ░░ -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:20px;">
                <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;">
                    <div>
                        <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Total Patients</div>
                        <div style="font-size:20px;font-weight:900;color:#0f172a;margin-top:2px;">${patients.length}</div>
                    </div>
                    <div style="width:36px;height:36px;border-radius:9px;background:#eef2ff;color:#4f46e5;display:flex;align-items:center;justify-content:center;">
                        ${ICONS.patients}
                    </div>
                </div>

                <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;">
                    <div>
                        <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Male Patients</div>
                        <div style="font-size:20px;font-weight:900;color:#0369a1;margin-top:2px;">${maleCount}</div>
                    </div>
                    <div style="width:36px;height:36px;border-radius:9px;background:#e0f2fe;color:#0284c7;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;">
                        ♂
                    </div>
                </div>

                <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;">
                    <div>
                        <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Female Patients</div>
                        <div style="font-size:20px;font-weight:900;color:#be185d;margin-top:2px;">${femaleCount}</div>
                    </div>
                    <div style="width:36px;height:36px;border-radius:9px;background:#fce7f3;color:#db2777;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;">
                        ♀
                    </div>
                </div>

                <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;">
                    <div>
                        <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Linked Reports</div>
                        <div style="font-size:20px;font-weight:900;color:#4338ca;margin-top:2px;">${reports.length}</div>
                    </div>
                    <div style="width:36px;height:36px;border-radius:9px;background:#f3e8ff;color:#9333ea;display:flex;align-items:center;justify-content:center;">
                        ${ICONS.reports}
                    </div>
                </div>
            </div>

            <!-- ░░ TABLE CONTAINER ░░ -->
            <div class="card" style="border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.03);">
                
                <!-- Search & Filters Toolbar -->
                <div style="padding:14px 20px;background:#ffffff;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                    <div style="display:flex;align-items:center;gap:12px;flex:1;max-width:420px;">
                        <div style="position:relative;width:100%;">
                            <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;display:flex;">${searchSvg}</span>
                            <input type="text" id="patientSearch" oninput="filterPatients()"
                                placeholder="Search by patient name, phone, doctor or ID…"
                                style="width:100%;height:38px;padding-left:36px;padding-right:12px;border-radius:9px;border:1.5px solid #e2e8f0;background:#f8fafc;font-size:12.5px;outline:none;transition:all 0.15s;"
                                onfocus="this.style.borderColor='#6366f1';this.style.background='white';" onblur="this.style.borderColor='#e2e8f0';this.style.background='#f8fafc';">
                        </div>
                    </div>

                    <div style="display:flex;align-items:center;gap:10px;">
                        <!-- Gender Filter -->
                        <select id="genderFilter" onchange="filterPatients()"
                            style="height:38px;padding:0 12px;border-radius:9px;border:1.5px solid #e2e8f0;background:#f8fafc;font-size:12px;font-weight:600;color:#475569;outline:none;cursor:pointer;">
                            <option value="all">All Genders</option>
                            <option value="male">♂ Male Only</option>
                            <option value="female">♀ Female Only</option>
                            <option value="other">Other / Child</option>
                        </select>
                    </div>
                </div>

                <!-- Data Table -->
                <div style="overflow-x:auto;">
                    ${patients.length === 0 ? emptyState : `
                    <table style="width:100%;border-collapse:collapse;text-align:left;">
                        <thead>
                            <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                                <th style="padding:10px 20px;font-size:10.5px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">PATIENT INFO</th>
                                <th style="padding:10px 20px;font-size:10.5px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">DEMOGRAPHICS</th>
                                <th style="padding:10px 20px;font-size:10.5px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">PHONE / CONTACT</th>
                                <th style="padding:10px 20px;font-size:10.5px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">LINKED REPORTS</th>
                                <th style="padding:10px 20px;font-size:10.5px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;text-align:right;">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>${patientRows}</tbody>
                    </table>`}
                </div>
            </div>

        </div>`;

    } catch (e) {
        container.innerHTML = `<div class="empty-state" style="padding:32px;text-align:center;"><p style="color:#ef4444;font-size:14px;font-weight:600;">Error: ${e.message}</p></div>`;
    }
}

function filterPatients() {
    const q = (document.getElementById('patientSearch')?.value || '').toLowerCase();
    const g = document.getElementById('genderFilter')?.value || 'all';

    document.querySelectorAll('.patient-row').forEach(r => {
        const matchesSearch = r.dataset.search.includes(q);
        const matchesGender = g === 'all' || r.dataset.gender === g;
        r.style.display = (matchesSearch && matchesGender) ? '' : 'none';
    });
}

function shareOnWhatsAppDirect(phone) {
    if (!phone) return;
    const clean = phone.replace(/\D/g, "");
    if (clean.length === 10) {
        window.open(`https://wa.me/91${clean}`, '_blank');
    } else {
        showToast('Invalid phone number', 'error');
    }
}

function showAddPatientModal(patientData = null) {
    const isEdit = !!patientData;
    showModal(`
        <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
            <div class="modal-content modal-md slide-up">
                <div class="modal-header">
                    <h3 class="modal-title">${isEdit ? 'Edit' : 'Add New'} Patient</h3>
                    <button onclick="closeModal()" class="btn-icon icon-gray">${ICONS.close}</button>
                </div>
                <div class="space-y-4">
                    <div class="grid grid-2 gap-3">
                        <div style="grid-column:span 2;">
                            <label class="form-label">Full Name *</label>
                            <input type="text" id="pName" value="${isEdit ? patientData.name : ''}" class="input-field" placeholder="Patient full name">
                        </div>
                        <div>
                            <label class="form-label">Age *</label>
                            <input type="number" id="pAge" value="${isEdit ? patientData.age : ''}" class="input-field" placeholder="Age">
                        </div>
                        <div>
                            <label class="form-label">Gender *</label>
                            <select id="pGender" class="input-field">
                                <option value="">Select</option>
                                <option value="Male" ${isEdit && patientData.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${isEdit && patientData.gender === 'Female' ? 'selected' : ''}>Female</option>
                                <option value="Child (Male)" ${isEdit && patientData.gender === 'Child (Male)' ? 'selected' : ''}>Child (Male)</option>
                                <option value="Child (Female)" ${isEdit && patientData.gender === 'Child (Female)' ? 'selected' : ''}>Child (Female)</option>
                                <option value="Other" ${isEdit && patientData.gender === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label">Phone</label>
                            <input type="tel" id="pPhone" value="${isEdit ? (patientData.phone || '') : ''}" class="input-field" placeholder="Phone number">
                        </div>
                        <div>
                            <label class="form-label">Email</label>
                            <input type="email" id="pEmail" value="${isEdit ? (patientData.email || '') : ''}" class="input-field" placeholder="Email">
                        </div>
                        <div style="grid-column:span 2;">
                            <label class="form-label">Address</label>
                            <input type="text" id="pAddress" value="${isEdit ? (patientData.address || '') : ''}" class="input-field" placeholder="Address">
                        </div>
                        <div style="grid-column:span 2;">
                            <label class="form-label">Referred By (Doctor)</label>
                            <input type="text" id="pRefBy" value="${isEdit ? (patientData.referredBy || '') : ''}" class="input-field" placeholder="Dr. Name">
                        </div>
                    </div>
                    <div class="flex" style="padding-top:8px;gap:12px;justify-content:flex-end;">
                        <button onclick="closeModal()" class="btn btn-outline btn-sm">Cancel</button>
                        <button onclick="savePatient(${isEdit ? "'" + patientData.id + "'" : 'null'})" id="savePatientBtn" class="btn btn-primary btn-sm">${isEdit ? 'Update' : 'Add'} Patient</button>
                    </div>
                </div>
            </div>
        </div>
    `);
}

async function savePatient(existingId) {
    const name = document.getElementById('pName').value.trim();
    const age = document.getElementById('pAge').value.trim();
    const gender = document.getElementById('pGender').value;

    if (!name || !age || !gender) {
        showToast('Please fill Name, Age and Gender', 'error');
        return;
    }

    const phone = document.getElementById('pPhone').value.trim();
    const email = document.getElementById('pEmail').value.trim();

    const validation = validatePatientInput(name, age, phone, email);
    if (!validation.valid) {
        showToast(validation.message, 'error');
        return;
    }

    const btn = document.getElementById('savePatientBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="btn-loader"></div> Saving...'; }

    const data = {
        name,
        age: parseInt(age),
        gender,
        phone,
        email,
        address: document.getElementById('pAddress').value.trim(),
        referredBy: document.getElementById('pRefBy').value.trim()
    };

    try {
        if (existingId) {
            await DB.updatePatient(existingId, data);
            showToast('Patient updated');
        } else {
            await DB.addPatient(data);
            showToast('Patient added');
        }

        closeModal();
        if (currentPage === 'patients') renderPatients();
        else if (currentPage === 'newReport') renderNewReport();
        else if (currentPage === 'dashboard') renderDashboard();
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = existingId ? 'Update Patient' : 'Add Patient'; }
    }
}

async function editPatient(id) {
    const p = await DB.getPatientById(id);
    if (p) showAddPatientModal(p);
}

async function deletePatient(id) {
    showConfirmModal({
        title: 'Delete Patient',
        message: 'Are you sure you want to permanently delete this patient and all of their associated reports? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger',
        onConfirm: async () => {
            try {
                await DB.deletePatient(id);
                showToast('Patient deleted');
                renderPatients();
            } catch (e) {
                showToast('Error: ' + e.message, 'error');
            }
        }
    });
}

function createReportForPatient(pid) {
    showPage('newReport');
    setTimeout(() => {
        const s = document.getElementById('reportPatient');
        if (s) s.value = pid;
    }, 500);
}

