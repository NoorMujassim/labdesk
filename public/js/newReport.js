/**
 * LabDesk - New Report / Edit Report Page (Firebase/Async)
 */

let editingReportId = null;

async function renderNewReport(reportData = null) {
    const container = document.getElementById('pageContainer');
    container.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p class="text-sm text-gray-400" style="margin-top:12px;">Loading...</p></div>`;

    const patients = await DB.getPatients();
    const categories = getTemplateCategories();
    const isEdit = !!reportData;

    if (isEdit) {
        document.getElementById('pageTitle').textContent = 'Edit Report';
        document.getElementById('pageSubtitle').textContent = 'Modify test results';
    }

    container.innerHTML = `
        <div class="space-y-5 fade-in">
            <!-- Patient Details -->
            <div class="card" style="padding:20px;">
                <h3 class="card-title" style="margin-bottom:16px;">Patient Details</h3>
                <div class="grid grid-3 gap-4">
                    <div style="grid-column:span 2;">
                        <label class="form-label">Select Patient *</label>
                        <div class="flex" style="gap:8px;">
                            <select id="reportPatient" class="input-field" style="flex:1;">
                                <option value="">-- Select Patient --</option>
                                ${patients.map(p => `<option value="${p.id}" ${isEdit && reportData.patientId === p.id ? 'selected' : ''}>${p.name} (${p.age}/${p.gender}) ${p.phone ? '- ' + p.phone : ''}</option>`).join('')}
                            </select>
                            <button onclick="showAddPatientModal()" class="btn btn-ghost btn-sm" style="white-space:nowrap;">+ New</button>
                        </div>
                    </div>
                    <div>
                        <label class="form-label">Report Date</label>
                        <input type="date" id="reportDate" value="${isEdit ? reportData.date : new Date().toISOString().split('T')[0]}" class="input-field">
                    </div>
                    <div>
                        <label class="form-label">Sample Collection Time</label>
                        <input type="time" id="reportTime" value="${isEdit ? (reportData.time || '') : new Date().toTimeString().slice(0, 5)}" class="input-field">
                    </div>
                    <div>
                        <label class="form-label">Sample Type</label>
                        <select id="sampleType" class="input-field">
                            ${['Blood', 'Serum', 'Plasma', 'Urine', 'Stool', 'Semen', 'Other'].map(t => `<option value="${t}" ${isEdit && reportData.sampleType === t ? 'selected' : ''}>${t}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="form-label">Referred By</label>
                        <input type="text" id="reportRefBy" value="${isEdit ? (reportData.referredBy || '') : ''}" placeholder="Dr. Name" class="input-field">
                    </div>
                </div>
            </div>

            <!-- Test Selection -->
            <div class="card" style="padding:20px;">
                <h3 class="card-title" style="margin-bottom:16px;">Select Tests</h3>
                <div class="flex flex-wrap" style="gap:8px;margin-bottom:16px;">
                    <button onclick="filterTestCat('all')" class="test-cat-btn active" data-cat="all">All</button>
                    ${Object.keys(categories).map(cat => `<button onclick="filterTestCat('${cat}')" class="test-cat-btn" data-cat="${cat}">${cat}</button>`).join('')}
                </div>
                <div class="grid grid-3 lg-grid-3 gap-3" id="testCheckboxes">
                    ${Object.entries(TEST_TEMPLATES).map(([name, t]) => `
                        <label class="test-item test-select-card ${isEdit && reportData.selectedTemplates.includes(name) ? 'checked' : ''}" data-cat="${t.category}">
                            <input type="checkbox" class="test-checkbox" value="${name}" ${isEdit && reportData.selectedTemplates.includes(name) ? 'checked' : ''} onchange="onTestCheckChange(this)">
                            <div style="min-width:0;">
                                <div class="text-sm font-medium text-gray-700 truncate">${name}</div>
                                <div class="text-xs text-gray-400">${t.category} · ${t.tests.length} params</div>
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>

            <!-- Test Fields -->
            <div id="testFieldsContainer" class="space-y-4"></div>

            <!-- Actions -->
            <div class="flex flex-wrap" style="gap:12px;padding-bottom:24px;">
                <button onclick="saveReport('completed')" class="btn btn-primary" id="btnSaveComplete">
                    ${ICONS.save} Save & Complete
                </button>
                <button onclick="saveReport('pending')" class="btn btn-warning" id="btnSavePending">
                    ${ICONS.clock} Save as Pending
                </button>
                <button onclick="saveAndPrint()" class="btn btn-success" id="btnSavePrint">
                    ${ICONS.print} Save & Print
                </button>
            </div>
        </div>
    `;

    if (isEdit) {
        editingReportId = reportData.id;
        const patient = patients.find(p => p.id === reportData.patientId);
        if (patient && patient.referredBy && !reportData.referredBy) {
            document.getElementById('reportRefBy').value = patient.referredBy;
        }
        updateTestFields(reportData.results);
    } else {
        updateTestFields();
    }
}

function onTestCheckChange(checkbox) {
    const card = checkbox.closest('.test-select-card');
    if (checkbox.checked) card.classList.add('checked');
    else card.classList.remove('checked');
    updateTestFields();
}

function filterTestCat(cat) {
    document.querySelectorAll('.test-cat-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.test-cat-btn[data-cat="' + cat + '"]').classList.add('active');
    document.querySelectorAll('.test-item').forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
    });
}

function updateTestFields(existingResults = null) {
    const selected = Array.from(document.querySelectorAll('.test-checkbox:checked')).map(cb => cb.value);
    const container = document.getElementById('testFieldsContainer');

    if (selected.length === 0) {
        container.innerHTML = `<div class="dashed-empty">${ICONS.flask}<p class="text-gray-400 text-sm font-medium" style="margin-top:12px;">Select tests above to enter results</p></div>`;
        return;
    }

    let html = '';
    selected.forEach(templateName => {
        const template = TEST_TEMPLATES[templateName];
        if (!template) return;

        html += `<div class="card slide-up" style="overflow:hidden;">
            <div class="test-panel-header">
                <div>
                    <div class="test-panel-title">${templateName}</div>
                    <div class="test-panel-cat">${template.category}</div>
                </div>
                <span class="test-panel-badge">${template.tests.length} tests</span>
            </div>
            <div style="overflow-x:auto;">
                <table class="data-table">
                    <thead><tr>
                        <th style="width:30%;">Test Name</th>
                        <th style="width:25%;">Result</th>
                        <th style="width:15%;">Unit</th>
                        <th style="width:30%;">Reference Range</th>
                    </tr></thead>
                    <tbody>
                        ${template.tests.map((test, idx) => {
                            const fieldId = 'result_' + templateName.replace(/[^a-zA-Z0-9]/g, '_') + '_' + idx;
                            const existingValue = existingResults?.[templateName]?.[idx]?.value || '';
                            const ref = getRefRange(test);
                            let inputHtml;

                            if (test.type === 'select') {
                                inputHtml = `<select id="${fieldId}" class="input-field" style="padding:8px 10px;">
                                    <option value="">Select</option>
                                    ${test.options.map(o => `<option value="${o}" ${existingValue === o ? 'selected' : ''}>${o}</option>`).join('')}
                                </select>`;
                            } else if (test.type === 'text') {
                                inputHtml = `<input type="text" id="${fieldId}" value="${existingValue}" class="input-field" style="padding:8px 10px;" placeholder="Enter result">`;
                            } else {
                                inputHtml = `<input type="number" step="any" id="${fieldId}" value="${existingValue}" class="input-field" style="padding:8px 10px;" placeholder="Value">`;
                            }

                            return `<tr>
                                <td class="font-medium text-gray-700">${test.name}</td>
                                <td>${inputHtml}</td>
                                <td class="text-xs text-gray-400">${test.unit}</td>
                                <td class="text-xs text-gray-400">${ref}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    });

    container.innerHTML = html;
}

function collectResults() {
    const selected = Array.from(document.querySelectorAll('.test-checkbox:checked')).map(cb => cb.value);
    const results = {};

    selected.forEach(name => {
        const template = TEST_TEMPLATES[name];
        if (!template) return;
        results[name] = template.tests.map((test, idx) => {
            const fieldId = 'result_' + name.replace(/[^a-zA-Z0-9]/g, '_') + '_' + idx;
            const el = document.getElementById(fieldId);
            return { ...test, value: el ? el.value : '' };
        });
    });

    return { selectedTests: selected, results };
}

function setReportBtnLoading(loading) {
    ['btnSaveComplete', 'btnSavePending', 'btnSavePrint'].forEach(id => {
        const b = document.getElementById(id);
        if (b) b.disabled = loading;
    });
}

async function saveReport(status) {
    const patientId = document.getElementById('reportPatient').value;
    if (!patientId) { showToast('Please select a patient', 'error'); return; }

    const { selectedTests, results } = collectResults();
    if (selectedTests.length === 0) { showToast('Please select at least one test', 'error'); return; }

    setReportBtnLoading(true);

    const reportData = {
        patientId,
        date: document.getElementById('reportDate').value,
        time: document.getElementById('reportTime').value,
        sampleType: document.getElementById('sampleType').value,
        referredBy: document.getElementById('reportRefBy').value.trim(),
        selectedTemplates: selectedTests,
        results,
        status
    };

    try {
        if (editingReportId) {
            await DB.updateReport(editingReportId, reportData);
        } else {
            await DB.addReport(reportData);
        }
        editingReportId = null;
        showToast('Report saved successfully');
        showPage('reports');
    } catch (e) {
        showToast('Error saving report: ' + e.message, 'error');
        setReportBtnLoading(false);
    }
}

async function saveAndPrint() {
    const patientId = document.getElementById('reportPatient').value;
    if (!patientId) { showToast('Please select a patient', 'error'); return; }

    const { selectedTests, results } = collectResults();
    if (selectedTests.length === 0) { showToast('Please select at least one test', 'error'); return; }

    setReportBtnLoading(true);

    const reportData = {
        patientId,
        date: document.getElementById('reportDate').value,
        time: document.getElementById('reportTime').value,
        sampleType: document.getElementById('sampleType').value,
        referredBy: document.getElementById('reportRefBy').value.trim(),
        selectedTemplates: selectedTests,
        results,
        status: 'completed'
    };

    try {
        let reportId;
        if (editingReportId) {
            await DB.updateReport(editingReportId, reportData);
            reportId = editingReportId;
        } else {
            const saved = await DB.addReport(reportData);
            reportId = saved.id;
        }
        editingReportId = null;
        await handlePrintReport(reportId);
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
        setReportBtnLoading(false);
    }
}
