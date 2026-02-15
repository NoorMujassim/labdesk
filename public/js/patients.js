/**
 * LabDesk - Patients Page (Firebase/Async)
 */

async function renderPatients() {
    const container = document.getElementById('pageContainer');
    container.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p class="text-sm text-gray-400" style="margin-top:12px;">Loading patients...</p></div>`;

    try {
        const patients = await DB.getPatients();
        const reports = await DB.getReports();

        container.innerHTML = `
            <div class="space-y-5 fade-in">
                <div class="flex justify-between items-center flex-wrap" style="gap:12px;">
                    <p class="text-sm text-gray-500 font-medium">${patients.length} patient(s) registered</p>
                    <button onclick="showAddPatientModal()" class="btn btn-primary btn-sm">
                        ${ICONS.plus} Add Patient
                    </button>
                </div>

                <div class="card">
                    <div style="padding:16px;border-bottom:1px solid var(--gray-100);">
                        <div class="search-wrapper">
                            <span class="search-icon">${ICONS.search}</span>
                            <input type="text" id="patientSearch" oninput="filterPatients()" placeholder="Search patients by name, phone or ID..." class="input-field search-input">
                        </div>
                    </div>
                    <div style="overflow-x:auto;">
                        ${patients.length === 0 ? `
                            <div class="empty-state">
                                <div class="empty-icon">${ICONS.emptyPatient}</div>
                                <p class="text-sm text-gray-400" style="margin-bottom:12px;">No patients yet. Add your first patient!</p>
                                <button onclick="showAddPatientModal()" class="btn btn-primary btn-sm">${ICONS.plus} Add Patient</button>
                            </div>
                        ` : `
                            <table class="data-table">
                                <thead><tr>
                                    <th>Name</th>
                                    <th>Age / Gender</th>
                                    <th>Phone</th>
                                    <th>Reports</th>
                                    <th>Actions</th>
                                </tr></thead>
                                <tbody>
                                    ${patients.map(p => {
            const pReports = reports.filter(r => r.patientId === p.id);
            return `<tr class="patient-row" data-search="${(p.name + (p.phone || '') + p.id).toLowerCase()}">
                                            <td>
                                                <div class="flex items-center" style="gap:12px;">
                                                    <div class="avatar avatar-md avatar-indigo">${p.name.charAt(0).toUpperCase()}</div>
                                                    <div>
                                                        <p class="font-semibold text-gray-800">${p.name}</p>
                                                        <p class="text-xs text-gray-400" style="font-family:monospace;">${p.id.slice(0, 10)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="text-gray-500">${p.age} yrs / ${p.gender}</td>
                                            <td class="text-gray-500">${p.phone || '—'}</td>
                                            <td><span class="badge badge-info">${pReports.length}</span></td>
                                            <td>
                                                <div class="flex" style="gap:4px;">
                                                    <button onclick="createReportForPatient('${p.id}')" class="btn-icon icon-primary" title="New Report">${ICONS.plus}</button>
                                                    <button onclick="editPatient('${p.id}')" class="btn-icon icon-gray" title="Edit">${ICONS.edit}</button>
                                                    <button onclick="deletePatient('${p.id}')" class="btn-icon icon-danger" title="Delete">${ICONS.delete}</button>
                                                </div>
                                            </td>
                                        </tr>`;
        }).join('')}
                                </tbody>
                            </table>
                        `}
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><p class="text-danger">Error: ${e.message}</p></div>`;
    }
}

function filterPatients() {
    const q = document.getElementById('patientSearch').value.toLowerCase();
    document.querySelectorAll('.patient-row').forEach(r => {
        r.style.display = r.dataset.search.includes(q) ? '' : 'none';
    });
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

    // Validate input before processing
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
    if (!confirm('Delete this patient and all associated reports?')) return;
    try {
        await DB.deletePatient(id);
        showToast('Patient deleted');
        renderPatients();
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    }
}

function createReportForPatient(pid) {
    showPage('newReport');
    setTimeout(() => {
        const s = document.getElementById('reportPatient');
        if (s) s.value = pid;
    }, 500);
}
