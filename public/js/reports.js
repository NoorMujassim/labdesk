/**
 * CUREBIT - Reports List & View Page (Pure Vanilla CSS)
 */

async function renderReports() {
    const container = document.getElementById('pageContainer');
    container.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p style="margin-top:16px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Loading reports...</p></div>`;

    try {
        const reports  = await DB.getReports();
        const patients = await DB.getPatients();

        const searchSvg = `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`;
        const plusSvg   = `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>`;

        const reportRows = reports.map(r => {
            const patient = patients.find(p => p.id === r.patientId);
            const pName   = patient ? patient.name : 'Unknown';
            const initials = pName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            const hue = (pName.charCodeAt(0) * 37) % 360;
            const panels = r.selectedTemplates ? r.selectedTemplates.join(', ') : '—';
            const panelsShort = panels.length > 40 ? panels.slice(0, 40) + '…' : panels;
            const isCompleted = r.status === 'completed';

            return `
            <tr class="report-row" style="border-bottom:1px solid #f8fafc;transition:background 0.15s;"
                data-search="${pName.toLowerCase()}" data-status="${r.status}"
                onmouseover="this.style.background='#f8fafc';" onmouseout="this.style.background='transparent';">
                <td style="padding:12px 20px;font-size:11px;font-family:monospace;color:#94a3b8;font-weight:600;">${r.id.slice(0, 10)}</td>
                <td style="padding:12px 20px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:32px;height:32px;border-radius:50%;background:hsl(${hue},60%,90%);color:hsl(${hue},50%,30%);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;">
                            ${initials}
                        </div>
                        <span style="font-size:13px;font-weight:700;color:#0f172a;">${pName}</span>
                    </div>
                </td>
                <td style="padding:12px 20px;">
                    <span style="font-size:12px;color:#475569;font-weight:500;" title="${panels}">${panelsShort}</span>
                </td>
                <td style="padding:12px 20px;font-size:12px;color:#64748b;font-weight:500;">${r.date || ''}</td>
                <td style="padding:12px 20px;">
                    <span class="badge ${r.isLocked ? 'badge-completed' : (isCompleted ? 'badge-completed' : 'badge-pending')}" style="${r.isLocked ? 'background:#dcfce7;color:#15803d;border:1px solid #bbf7d0;' : ''}">
                        ${r.isLocked ? '🔒 Finalized' : (isCompleted ? 'Completed' : 'Draft')}
                    </span>
                </td>
                <td style="padding:12px 20px;text-align:right;">
                    <div style="display:flex;align-items:center;justify-content:flex-end;gap:5px;">
                        <button onclick="viewReport('${r.id}')" title="View Report"
                            style="width:30px;height:30px;border-radius:7px;border:1.5px solid #e2e8f0;background:white;color:#64748b;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.borderColor='#334155';this.style.color='#0f172a';" onmouseout="this.style.borderColor='#e2e8f0';this.style.color='#64748b';">
                            ${ICONS.view}
                        </button>
                        <button onclick="shareOnWhatsApp('${r.id}')" title="WhatsApp"
                            style="width:30px;height:30px;border-radius:7px;border:1.5px solid #bbf7d0;background:#f0fdf4;color:#16a34a;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.background='#dcfce7';" onmouseout="this.style.background='#f0fdf4';">
                            ${ICONS.whatsapp}
                        </button>
                        <button onclick="handlePrintReport('${r.id}')" title="Print PDF"
                            style="width:30px;height:30px;border-radius:7px;border:1.5px solid #e2e8f0;background:white;color:#64748b;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.borderColor='#334155';this.style.color='#0f172a';" onmouseout="this.style.borderColor='#e2e8f0';this.style.color='#64748b';">
                            ${ICONS.print}
                        </button>
                        <button onclick="editReport('${r.id}')" title="Edit"
                            style="width:30px;height:30px;border-radius:7px;border:1.5px solid #e2e8f0;background:white;color:#64748b;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.borderColor='#334155';this.style.color='#0f172a';" onmouseout="this.style.borderColor='#e2e8f0';this.style.color='#64748b';">
                            ${ICONS.edit}
                        </button>
                        <button onclick="deleteReport('${r.id}')" title="Delete"
                            style="width:30px;height:30px;border-radius:7px;border:1.5px solid #fecaca;background:#fff5f5;color:#ef4444;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.background='#fee2e2';" onmouseout="this.style.background='#fff5f5';">
                            ${ICONS.delete}
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');

        const emptyState = `
            <div style="padding:64px 24px;text-align:center;">
                <div style="width:52px;height:52px;border-radius:14px;background:#f1f5f9;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;color:#94a3b8;">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <p style="font-size:14px;font-weight:700;color:#334155;">No reports found</p>
                <p style="font-size:12px;color:#94a3b8;margin:6px 0 18px;">Create your first diagnostic report.</p>
                <button onclick="showPage('newReport')" class="btn btn-primary" style="padding:10px 20px;font-size:13px;border-radius:10px;">
                    ${plusSvg} Create Report
                </button>
            </div>`;

        container.innerHTML = `
        <div class="fade-in" style="max-width:1600px;width:100%;margin:0 auto;">

            <!-- Header -->
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;
                        background:white;border-radius:14px;padding:18px 24px;margin-bottom:20px;
                        border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                <div>
                    <h2 style="margin:0;font-size:17px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;">Diagnostic Reports</h2>
                    <p style="margin:3px 0 0;font-size:12px;color:#64748b;font-weight:500;">
                        ${reports.length} total report${reports.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                    <div class="search-wrapper" style="position:relative;">
                        <span class="search-icon">${searchSvg}</span>
                        <input type="text" id="reportSearch" oninput="filterReports()"
                            placeholder="Search patient name…"
                            class="input-field search-input"
                            style="height:38px;font-size:13px;width:220px;background:#f8fafc;">
                    </div>
                    <select id="reportStatusFilter" onchange="filterReports()"
                        class="input-field" style="height:38px;font-size:13px;width:auto;padding:0 12px;">
                        <option value="">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            <!-- Table card -->
            <div class="card" style="overflow:hidden;">
                <div style="overflow-x:auto;">
                    ${reports.length === 0 ? emptyState : `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Patient</th>
                                <th>Tests</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th style="text-align:right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>${reportRows}</tbody>
                    </table>`}
                </div>
            </div>

        </div>`;

    } catch (e) {
        container.innerHTML = `<div class="empty-state" style="padding:32px;text-align:center;"><p style="color:#ef4444;font-size:14px;font-weight:600;">Error: ${e.message}</p></div>`;
    }
}

function filterReports() {
    const q      = document.getElementById('reportSearch').value.toLowerCase();
    const status = document.getElementById('reportStatusFilter').value;
    document.querySelectorAll('.report-row').forEach(r => {
        const matchSearch = r.dataset.search.includes(q);
        const matchStatus = !status || r.dataset.status === status;
        r.style.display = (matchSearch && matchStatus) ? '' : 'none';
    });
}


async function editReport(id) {
    const report = await DB.getReportById(id);
    if (!report) return;

    if (report.isLocked || report.status === 'final') {
        showModal(`
            <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
                <div class="modal-content" style="max-width:440px;padding:30px;text-align:center;">
                    <div style="width:48px;height:48px;border-radius:50%;background:#fef3c7;color:#d97706;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px;">🔒</div>
                    <h3 style="font-size:18px;font-weight:900;color:#0f172a;margin-bottom:8px;">Report is Finalized & Locked</h3>
                    <p style="font-size:13px;color:#64748b;line-height:1.6;margin-bottom:20px;">
                        Medical integrity rules prevent direct editing of finalized records. To make changes, create an official new revision.
                    </p>
                    <div style="display:flex;gap:10px;">
                        <button onclick="closeModal()" class="btn btn-outline" style="flex:1;">Cancel</button>
                        <button onclick="closeModal();handleCreateRevision('${id}')" class="btn btn-primary" style="flex:1;">Create Revision 2.0</button>
                    </div>
                </div>
            </div>
        `);
        return;
    }

    currentPage = 'newReport';
    document.getElementById('pageTitle').textContent = 'Edit Report';
    document.getElementById('pageSubtitle').textContent = 'Modify test results';
    renderNewReport(report);
}

async function handleLockReport(id) {
    showConfirmModal({
        title: 'Verify & Finalize Report',
        message: 'Are you sure you want to permanently verify and finalize this report? Once finalized, results cannot be directly edited and will be cryptographically locked.',
        confirmText: 'Verify & Finalize',
        cancelText: 'Cancel',
        type: 'success',
        onConfirm: async () => {
            try {
                await DB.lockReport(id);
                showToast('Report verified and permanently locked 🔒', 'success');
                closeModal();
                renderReports();
            } catch (e) {
                showToast('Lock Error: ' + e.message, 'error');
            }
        }
    });
}

async function handleCreateRevision(id) {
    const reason = prompt('Enter clinical reason for this correction / revision:', 'Re-run sample verification');
    if (!reason) return;

    try {
        const newRev = await DB.createReportRevision(id, reason);
        showToast(`Revision ${newRev.revisionNumber || 2}.0 Created (Draft)`, 'success');
        renderReports();
        editReport(newRev.id);
    } catch (e) {
        showToast('Revision Error: ' + e.message, 'error');
    }
}

/* Original edit */
async function _old_editReport(id) {
    const report = await DB.getReportById(id);
    if (report) {
        currentPage = 'newReport';
        document.getElementById('pageTitle').textContent = 'Edit Report';
        document.getElementById('pageSubtitle').textContent = 'Modify test results';
        renderNewReport(report);
    }
}

async function deleteReport(id) {
    showConfirmModal({
        title: 'Delete Report',
        message: 'Are you sure you want to delete this report? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger',
        onConfirm: async () => {
            try {
                await DB.deleteReport(id);
                showToast('Report deleted');
                renderReports();
            } catch (e) {
                showToast('Error: ' + e.message, 'error');
            }
        }
    });
}

async function viewReport(id) {
    const report = await DB.getReportById(id);
    if (!report) return;
    const patient = await DB.getPatientById(report.patientId);
    const lab = await DB.getLabProfile();

    let testsHtml = '';
    report.selectedTemplates.forEach(tName => {
        const results = report.results[tName];
        if (!results) return;
        testsHtml += `
            <div style="margin-bottom:24px;">
                <div style="background:var(--primary-light);color:var(--primary-dark);padding:10px 16px;border-radius:var(--radius-md);font-weight:700;font-size:14px;margin-bottom:12px;">${tName}</div>
                <table class="data-table">
                    <thead><tr>
                        <th>Test Parameter</th>
                        <th>Result</th>
                        <th>Unit</th>
                        <th>Ref. Range</th>
                    </tr></thead>
                    <tbody>
                        ${results.map(r => {
                            const isAb = checkAbnormal(r, patient);
                            return `<tr>
                                <td class="font-medium">${r.name}</td>
                                <td class="font-bold ${isAb ? 'text-danger' : 'text-gray-800'}">${r.value || '—'}</td>
                                <td class="text-gray-400 text-xs">${r.unit}</td>
                                <td class="text-gray-400 text-xs">${getPatientRefRange(r, patient)}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    });

    const modalHtml = `
            <div class="modal-content modal-xl fade-in" style="max-height: 95vh; display: flex; flex-direction: column; padding: 0; overflow: hidden; border: none; box-shadow: var(--shadow-xl);">
                <!-- MODAL HEADER: STICKY -->
                <div style="padding:12px 20px;border-bottom:1px solid #f1f5f9;background:white;display:flex;justify-content:space-between;align-items:center;z-index:10;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:32px;height:32px;background:#eef2ff;color:#4f46e5;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            ${ICONS.reports}
                        </div>
                        <div>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <div style="font-size:14px;font-weight:800;color:#0f172a;line-height:1.2;">${patient?.name || 'Unknown Patient'}</div>
                                ${report.isLocked ? `
                                    <span style="font-size:10px;font-weight:800;background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:10px;border:1px solid #bbf7d0;">🔒 FINALIZED</span>
                                ` : `
                                    <span style="font-size:10px;font-weight:800;background:#fef3c7;color:#d97706;padding:2px 8px;border-radius:10px;border:1px solid #fde68a;">🟡 DRAFT</span>
                                `}
                            </div>
                            <div style="font-size:10.5px;color:#94a3b8;font-weight:500;margin-top:1px;">Date: ${report.date} ${report.revisionNumber ? `• Rev ${report.revisionNumber}.0` : ''}</div>
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;">
                        ${!report.isLocked ? `
                            <button onclick="handleLockReport('${report.id}')" title="Verify & Finalize Report"
                                style="padding:0 12px;height:32px;border-radius:8px;border:none;background:#0F766E;color:white;font-size:12px;font-weight:800;display:inline-flex;align-items:center;gap:4px;cursor:pointer;box-shadow:0 2px 6px rgba(15,118,110,0.3);">
                                🔒 Verify & Finalize
                            </button>
                        ` : `
                            <button onclick="handleCreateRevision('${report.id}')" title="Create Revision 2.0"
                                style="padding:0 12px;height:32px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;color:#334155;font-size:11.5px;font-weight:700;display:inline-flex;align-items:center;gap:4px;cursor:pointer;">
                                🔄 Create Revision
                            </button>
                        `}
                        <button onclick="closeModal();handlePrintReport('${report.id}')" title="Print Report"
                            style="width:32px;height:32px;border-radius:8px;border:none;background:#0f172a;color:white;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.background='#1e293b';" onmouseout="this.style.background='#0f172a';">
                            ${ICONS.print}
                        </button>
                        
                        <button onclick="handlePrintReceipt('${report.id}')" title="Print Receipt"
                            style="width:32px;height:32px;border-radius:8px;border:1.5px solid #e2e8f0;background:white;color:#334155;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.borderColor='#cbd5e1';this.style.background='#f8fafc';" onmouseout="this.style.borderColor='#e2e8f0';this.style.background='white';">
                            ${ICONS.history}
                        </button>
                        
                        ${(() => {
                            const isPhoneValid = isValidPhone(patient?.phone);
                            return `
                            <button onclick="${isPhoneValid ? `shareOnWhatsApp('${report.id}')` : `showToast('Patient phone number is missing or invalid','error')`}" 
                                title="Share on WhatsApp"
                                style="width:32px;height:32px;border-radius:8px;border:none;background:${isPhoneValid ? '#25D366' : '#cbd5e1'};color:white;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;opacity:${isPhoneValid ? '1' : '0.6'};transition:transform 0.15s;"
                                onmouseover="if(${isPhoneValid})this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';">
                                ${ICONS.whatsapp}
                            </button>`;
                        })()}

                        <button onclick="copyReportLink('${report.id}')" title="Copy Report Link"
                            style="width:32px;height:32px;border-radius:8px;border:1.5px solid #e2e8f0;background:white;color:#64748b;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.borderColor='#cbd5e1';this.style.background='#f8fafc';" onmouseout="this.style.borderColor='#e2e8f0';this.style.background='white';">
                            ${ICONS.copy}
                        </button>

                        <div style="width:1px;height:20px;background:#e2e8f0;margin:0 2px;"></div>
                        
                        <button onclick="closeModal()" title="Close"
                            style="width:32px;height:32px;border-radius:50%;border:1.5px solid #e2e8f0;background:#f8fafc;color:#64748b;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.background='#fee2e2';this.style.color='#ef4444';this.style.borderColor='#fca5a5';" onmouseout="this.style.background='#f8fafc';this.style.color='#64748b';this.style.borderColor='#e2e8f0';">
                            ${ICONS.close}
                        </button>
                    </div>
                </div>

                <!-- MODAL BODY: SCROLLABLE -->
                <div style="overflow-y:auto;flex:1;background:#f8fafc;padding:28px;">
                    <div style="max-width:860px;margin:0 auto;">
                        <!-- REPORT PREVIEW -->
                        <div style="border-radius:12px;overflow:hidden;background:white;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                            ${getReportHTML(report, patient, lab)}
                        </div>
                    </div>
                </div>

                <!-- MODAL FOOTER -->
                <div class="p-4 bg-white border-top text-center">
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">CUREBIT Terminal • Secure Patient Report Access</p>
                </div>
            </div>
    `;
    showModal(`<div class="modal-overlay" onclick="if(event.target===this)closeModal()">${modalHtml}</div>`);
}

