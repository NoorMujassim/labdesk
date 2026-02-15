/**
 * LabDesk - Dashboard Page (Firebase/Async)
 */

async function renderDashboard() {
    const container = document.getElementById('pageContainer');
    container.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p class="text-sm text-gray-400" style="margin-top:12px;">Loading dashboard...</p></div>`;

    try {
        const stats = await DB.getDashboardStats();
        const { patients, reports, todayReports, pendingReports, completedReports } = stats;

        container.innerHTML = `
            <div class="space-y-6 fade-in">
                <!-- Stats Grid -->
                <div class="grid sm-grid-2 grid-4 gap-4">
                    <div class="card card-hover stat-card stat-card-1" style="padding:20px;">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="stat-label">Total Patients</p>
                                <p class="stat-value">${patients.length}</p>
                                <p class="stat-sub">Registered patients</p>
                            </div>
                            <div class="stat-icon stat-icon-1">${ICONS.patients}</div>
                        </div>
                    </div>
                    <div class="card card-hover stat-card stat-card-2" style="padding:20px;">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="stat-label">Total Reports</p>
                                <p class="stat-value">${reports.length}</p>
                                <p class="stat-sub stat-sub-success">${completedReports.length} completed</p>
                            </div>
                            <div class="stat-icon stat-icon-2">${ICONS.reports}</div>
                        </div>
                    </div>
                    <div class="card card-hover stat-card stat-card-3" style="padding:20px;">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="stat-label">Today's Reports</p>
                                <p class="stat-value">${todayReports.length}</p>
                                <p class="stat-sub">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                            </div>
                            <div class="stat-icon stat-icon-3">${ICONS.calendar}</div>
                        </div>
                    </div>
                    <div class="card card-hover stat-card stat-card-4" style="padding:20px;">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="stat-label">Pending</p>
                                <p class="stat-value" style="${pendingReports.length > 0 ? 'color:#d97706' : ''}">${pendingReports.length}</p>
                                <p class="stat-sub">Awaiting results</p>
                            </div>
                            <div class="stat-icon stat-icon-4">${ICONS.clock}</div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions + Recent Reports -->
                <div class="dashboard-grid">
                    <div class="card" style="padding:24px;">
                        <h3 class="card-title" style="margin-bottom:16px;">Quick Actions</h3>
                        <div class="space-y-2">
                            <button onclick="showPage('newReport')" class="btn btn-primary btn-block">
                                ${ICONS.newReport} Create New Report
                            </button>
                            <button onclick="showAddPatientModal()" class="btn btn-success btn-block">
                                ${ICONS.userPlus} Register Patient
                            </button>
                            <button onclick="showPage('settings')" class="btn btn-ghost btn-block">
                                ${ICONS.settings} Lab Settings
                            </button>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Recent Reports</h3>
                            ${reports.length > 0 ? '<button onclick="showPage(\'reports\')" class="text-xs font-semibold text-primary" style="cursor:pointer;border:none;background:none;">View All →</button>' : ''}
                        </div>
                        <div style="overflow-x:auto;">
                            ${reports.length === 0 ? `
                                <div class="empty-state">
                                    <div class="empty-icon">${ICONS.emptyReport}</div>
                                    <p class="text-sm text-gray-400">No reports yet. Create your first report!</p>
                                </div>
                            ` : `
                                <table class="data-table">
                                    <thead><tr>
                                        <th>Patient</th>
                                        <th>Tests</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr></thead>
                                    <tbody>
                                        ${reports.slice(0, 8).map(r => {
                                            const patient = patients.find(p => p.id === r.patientId);
                                            const pName = patient ? patient.name : 'Unknown';
                                            return `<tr>
                                                <td><span class="font-semibold text-gray-800">${pName}</span></td>
                                                <td><span class="text-xs text-gray-500 truncate" style="max-width:200px;display:inline-block;">${r.selectedTemplates.join(', ')}</span></td>
                                                <td><span class="text-xs text-gray-400">${r.date}</span></td>
                                                <td><span class="badge ${r.status === 'completed' ? 'badge-completed' : 'badge-pending'}">${r.status}</span></td>
                                                <td>
                                                    <div class="flex" style="gap:4px;">
                                                        <button onclick="viewReport('${r.id}')" class="btn-icon icon-primary" title="View">${ICONS.view}</button>
                                                        <button onclick="handlePrintReport('${r.id}')" class="btn-icon icon-success" title="Print">${ICONS.print}</button>
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
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><p class="text-danger">Error loading dashboard: ${e.message}</p></div>`;
    }
}
