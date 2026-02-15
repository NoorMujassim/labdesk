/**
 * LabDesk - Reports List & View Page (Firebase/Async)
 */

async function renderReports() {
    const container = document.getElementById('pageContainer');
    container.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p class="text-sm text-gray-400" style="margin-top:12px;">Loading reports...</p></div>`;

    try {
        const reports = await DB.getReports();
        const patients = await DB.getPatients();

        container.innerHTML = `
            <div class="space-y-4 fade-in">
                <div class="flex justify-between items-center flex-wrap" style="gap:12px;">
                    <div class="flex flex-wrap" style="gap:8px;">
                        <div class="search-wrapper">
                            <span class="search-icon">${ICONS.search}</span>
                            <input type="text" id="reportSearch" oninput="filterReports()" placeholder="Search by patient name..." class="input-field search-input" style="width:250px;">
                        </div>
                        <select id="reportStatusFilter" onchange="filterReports()" class="input-field" style="width:auto;">
                            <option value="">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <p class="text-sm text-gray-500 font-medium">${reports.length} report(s)</p>
                </div>

                <div class="card">
                    ${reports.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-icon">${ICONS.emptyReport}</div>
                            <p class="text-sm text-gray-400" style="margin-bottom:12px;">No reports yet.</p>
                            <button onclick="showPage('newReport')" class="btn btn-primary btn-sm">${ICONS.plus} Create Report</button>
                        </div>
                    ` : `
                        <div style="overflow-x:auto;">
                            <table class="data-table">
                                <thead><tr>
                                    <th>Report ID</th>
                                    <th>Patient</th>
                                    <th>Tests</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr></thead>
                                <tbody>
                                    ${reports.map(r => {
                                        const patient = patients.find(p => p.id === r.patientId);
                                        const pName = patient ? patient.name : 'Unknown';
                                        return `<tr class="report-row" data-search="${pName.toLowerCase()}" data-status="${r.status}">
                                            <td><span style="font-family:monospace;" class="text-xs text-gray-500">${r.id.slice(0, 12)}</span></td>
                                            <td>
                                                <div class="flex items-center" style="gap:8px;">
                                                    <div class="avatar avatar-sm avatar-indigo">${pName.charAt(0)}</div>
                                                    <span class="font-medium text-gray-800">${pName}</span>
                                                </div>
                                            </td>
                                            <td><span class="text-xs text-gray-500 truncate" style="max-width:200px;display:inline-block;">${r.selectedTemplates.join(', ')}</span></td>
                                            <td class="text-xs text-gray-400">${r.date}</td>
                                            <td><span class="badge ${r.status === 'completed' ? 'badge-completed' : 'badge-pending'}">${r.status}</span></td>
                                            <td>
                                                <div class="flex" style="gap:4px;">
                                                    <button onclick="viewReport('${r.id}')" class="btn-icon icon-primary" title="View">${ICONS.view}</button>
                                                    <button onclick="editReport('${r.id}')" class="btn-icon icon-gray" title="Edit">${ICONS.edit}</button>
                                                    <button onclick="handlePrintReport('${r.id}')" class="btn-icon icon-success" title="Print">${ICONS.print}</button>
                                                    <button onclick="deleteReport('${r.id}')" class="btn-icon icon-danger" title="Delete">${ICONS.delete}</button>
                                                </div>
                                            </td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><p class="text-danger">Error: ${e.message}</p></div>`;
    }
}

function filterReports() {
    const q = document.getElementById('reportSearch').value.toLowerCase();
    const status = document.getElementById('reportStatusFilter').value;
    document.querySelectorAll('.report-row').forEach(r => {
        const matchSearch = r.dataset.search.includes(q);
        const matchStatus = !status || r.dataset.status === status;
        r.style.display = (matchSearch && matchStatus) ? '' : 'none';
    });
}

async function editReport(id) {
    const report = await DB.getReportById(id);
    if (report) {
        currentPage = 'newReport';
        document.getElementById('pageTitle').textContent = 'Edit Report';
        document.getElementById('pageSubtitle').textContent = 'Modify test results';
        renderNewReport(report);
    }
}

async function deleteReport(id) {
    if (!confirm('Delete this report?')) return;
    try {
        await DB.deleteReport(id);
        showToast('Report deleted');
        renderReports();
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    }
}

async function viewReport(id) {
    const report = await DB.getReportById(id);
    if (!report) return;
    const patient = await DB.getPatientById(report.patientId);

    let testsHtml = '';
    report.selectedTemplates.forEach(tName => {
        const results = report.results[tName];
        if (!results) return;
        testsHtml += `
            <div style="margin-bottom:16px;">
                <div style="background:#eef2ff;color:#4338ca;padding:8px 16px;border-radius:12px;font-weight:700;font-size:14px;margin-bottom:8px;">${tName}</div>
                <table class="data-table">
                    <thead><tr>
                        <th>Test</th>
                        <th>Result</th>
                        <th>Unit</th>
                        <th>Reference</th>
                    </tr></thead>
                    <tbody>
                        ${results.map(r => {
                            const isAb = checkAbnormal(r, patient);
                            return `<tr>
                                <td class="font-medium">${r.name}</td>
                                <td class="font-semibold ${isAb ? 'text-danger' : ''}">${r.value || '—'}</td>
                                <td class="text-gray-400 text-xs">${r.unit}</td>
                                <td class="text-gray-400 text-xs">${getPatientRefRange(r, patient)}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    });

    showModal(`
        <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
            <div class="modal-content modal-lg modal-scrollable slide-up">
                <div class="modal-header">
                    <div>
                        <h3 class="modal-title">Report Preview</h3>
                        <p class="text-xs text-gray-400" style="margin-top:4px;">ID: ${report.id.slice(0, 12)} | ${report.date}</p>
                    </div>
                    <div class="flex" style="gap:8px;">
                        <button onclick="closeModal();handlePrintReport('${report.id}')" class="btn btn-success btn-xs">${ICONS.print} Print</button>
                        <button onclick="closeModal()" class="btn-icon icon-gray">${ICONS.close}</button>
                    </div>
                </div>
                <div class="info-grid" style="margin-bottom:20px;">
                    <div><span class="info-label">Patient:</span><p class="info-value">${patient ? patient.name : 'N/A'}</p></div>
                    <div><span class="info-label">Age/Sex:</span><p class="info-value">${patient ? patient.age + ' / ' + patient.gender : 'N/A'}</p></div>
                    <div><span class="info-label">Sample:</span><p class="info-value">${report.sampleType}</p></div>
                    <div><span class="info-label">Referred By:</span><p class="info-value">${report.referredBy || (patient?.referredBy) || '—'}</p></div>
                </div>
                ${testsHtml}
            </div>
        </div>
    `);
}
