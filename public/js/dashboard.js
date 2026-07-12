/**
 * CUREBIT — Premium Dashboard
 * Pure vanilla CSS + inline styles. Zero Tailwind dependencies.
 */

async function renderDashboard() {
    const container = document.getElementById('pageContainer');
    container.innerHTML = `
        <div class="page-loader">
            <div class="loader-spinner"></div>
            <p style="margin-top:16px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.12em;">
                Loading Dashboard...
            </p>
        </div>`;

    try {
        const stats = await DB.getDashboardStats();
        const { labProfile, patients, reports, todayReports, todayRevenue, todayOutstanding, todayUniquePatients } = stats;

        const dateStr = new Date().toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });

        /* ── KPI helpers ──────────────────────────────────────────── */
        function kpiCard({ label, value, sub, subValue, iconHtml, iconBg, iconColor, accentColor }) {
            return `
            <div class="card stat-card card-hover" style="padding:20px;display:flex;flex-direction:column;justify-content:space-between;min-height:130px;position:relative;overflow:hidden;cursor:default;">
                <!-- Subtle glow blob -->
                <div style="position:absolute;top:-30px;right:-30px;width:90px;height:90px;border-radius:50%;background:${accentColor};opacity:0.07;pointer-events:none;"></div>
                
                <div style="display:flex;align-items:flex-start;justify-content:space-between;">
                    <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.10em;">${label}</span>
                    <div style="width:36px;height:36px;border-radius:10px;background:${iconBg};color:${iconColor};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        ${iconHtml}
                    </div>
                </div>

                <div style="margin-top:12px;">
                    <div style="font-size:32px;font-weight:800;color:#0f172a;line-height:1;letter-spacing:-0.03em;">${value}</div>
                    <div style="margin-top:12px;padding-top:12px;border-top:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;">
                        <span style="font-size:11px;color:#64748b;font-weight:500;">${sub}</span>
                        <span style="font-size:11px;font-weight:700;color:#334155;">${subValue}</span>
                    </div>
                </div>
            </div>`;
        }

        /* ── Subscription KPI ─────────────────────────────────────── */
        const isSuperAdmin = await DB.checkIfAdmin();
        let subscriptionWidget = '';
        
        if (isSuperAdmin) {
            const subIcon = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`;
            subscriptionWidget = kpiCard({
                label: 'Active Subscription',
                value: 'Lifetime',
                sub: 'Superadmin Access',
                subValue: 'Unlimited',
                iconHtml: subIcon,
                iconBg: '#f0fdf4',
                iconColor: '#16a34a',
                accentColor: '#22c55e'
            });
        } else if (labProfile && labProfile.planStatus === 'active' && labProfile.planValidUntil) {
            const validUntilDate = labProfile.planValidUntil.toDate ? labProfile.planValidUntil.toDate() : new Date(labProfile.planValidUntil);
            const remainingDays = Math.max(0, Math.ceil((validUntilDate - new Date()) / (1000 * 60 * 60 * 24)));
            
            const subIcon = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`;
            
            subscriptionWidget = kpiCard({
                label: 'Active Subscription',
                value: remainingDays + ' Days',
                sub: 'Valid Until',
                subValue: validUntilDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                iconHtml: subIcon,
                iconBg: '#f0fdf4',
                iconColor: '#16a34a',
                accentColor: '#22c55e'
            });
        } else {
            const subIcon = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
            subscriptionWidget = kpiCard({
                label: 'Subscription Status',
                value: 'Expired',
                sub: 'Action Required',
                subValue: '<span style="color:#dc2626;font-weight:700;cursor:pointer;position:relative;z-index:2;" onclick="showPage(&quot;subscription&quot;)">Renew Now</span>',
                iconHtml: subIcon,
                iconBg: '#fef2f2',
                iconColor: '#dc2626',
                accentColor: '#ef4444'
            });
        }

        /* ── Quick launcher helper ─────────────────────────────────── */
        function launchBtn({ label, desc, iconHtml, iconBg, iconColor, borderHover, onClick }) {
            return `
            <button onclick="${onClick}"
                style="width:100%;display:flex;align-items:center;gap:14px;padding:14px 16px;
                       border-radius:12px;border:1.5px solid #e2e8f0;background:white;
                       text-align:left;cursor:pointer;transition:all 0.2s;
                       box-shadow:0 1px 2px rgba(0,0,0,0.04);"
                onmouseover="this.style.borderColor='${borderHover}';this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)';"
                onmouseout="this.style.borderColor='#e2e8f0';this.style.transform='none';this.style.boxShadow='0 1px 2px rgba(0,0,0,0.04)';">
                <div style="width:40px;height:40px;border-radius:10px;background:${iconBg};color:${iconColor};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    ${iconHtml}
                </div>
                <div style="min-width:0;">
                    <div style="font-size:13px;font-weight:700;color:#0f172a;line-height:1.3;">${label}</div>
                    <div style="font-size:11px;color:#64748b;margin-top:2px;">${desc}</div>
                </div>
                <div style="margin-left:auto;color:#cbd5e1;flex-shrink:0;">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
            </button>`;
        }

        /* ── Recent reports table rows ─────────────────────────────── */
        const recentRows = reports.slice(0, 6).map(r => {
            const patient = patients.find(p => p.id === r.patientId);
            const name = patient?.name || 'Unknown';
            const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            const hue = (name.charCodeAt(0) * 37) % 360;
            const panels = r.selectedTemplates ? r.selectedTemplates.join(', ') : '—';
            const panelsShort = panels.length > 35 ? panels.slice(0, 35) + '…' : panels;
            const isCompleted = r.status === 'completed';

            return `
            <tr style="border-bottom:1px solid #f8fafc;transition:background 0.15s;"
                onmouseover="this.style.background='#f8fafc';"
                onmouseout="this.style.background='transparent';">
                <td style="padding:12px 20px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:34px;height:34px;border-radius:50%;background:hsl(${hue},65%,90%);color:hsl(${hue},50%,30%);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;">
                            ${initials}
                        </div>
                        <div>
                            <div style="font-size:13px;font-weight:700;color:#0f172a;line-height:1.2;">${name}</div>
                            <div style="font-size:10px;color:#94a3b8;font-weight:600;margin-top:1px;">${r.time || ''}</div>
                        </div>
                    </div>
                </td>
                <td style="padding:12px 20px;">
                    <span style="font-size:12px;color:#475569;font-weight:500;" title="${panels}">${panelsShort}</span>
                </td>
                <td style="padding:12px 20px;">
                    <span style="font-size:13px;font-weight:700;color:#0f172a;">₹${(r.billing?.total || 0).toLocaleString('en-IN')}</span>
                </td>
                <td style="padding:12px 20px;">
                    <span class="badge ${isCompleted ? 'badge-completed' : 'badge-pending'}">
                        ${isCompleted ? 'Completed' : 'Pending'}
                    </span>
                </td>
                <td style="padding:12px 20px;text-align:right;">
                    <button onclick="viewReport('${r.id}')"
                        style="width:32px;height:32px;border-radius:8px;border:1.5px solid #e2e8f0;background:white;color:#64748b;
                               display:inline-flex;align-items:center;justify-content:center;cursor:pointer;
                               transition:all 0.15s;"
                        onmouseover="this.style.borderColor='#0f172a';this.style.color='#0f172a';this.style.background='#f8fafc';"
                        onmouseout="this.style.borderColor='#e2e8f0';this.style.color='#64748b';this.style.background='white';"
                        title="View Report">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                    </button>
                </td>
            </tr>`;
        }).join('');

        const emptyTableState = `
            <tr>
                <td colspan="5">
                    <div style="padding:48px 24px;text-align:center;">
                        <div style="width:48px;height:48px;border-radius:12px;background:#f1f5f9;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;color:#94a3b8;">
                            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <p style="font-size:13px;font-weight:600;color:#475569;">No reports today</p>
                        <p style="font-size:11px;color:#94a3b8;margin-top:4px;">New reports will appear here automatically.</p>
                    </div>
                </td>
            </tr>`;

        /* ── ICONS (inline SVG) ────────────────────────────────────── */
        const patientIcon = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`;
        const reportIcon  = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`;
        const revenueIcon = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
        const dueIcon     = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
        const addUserIcon = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>`;
        const listIcon    = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>`;
        const gearIcon    = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`;
        const plusIcon    = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>`;

        /* ── Render ────────────────────────────────────────────────── */
        container.innerHTML = `
        <div class="fade-in" style="max-width:1600px;width:100%;margin:0 auto;">

            ${!SubscriptionGuard.isActive() ? `
            <!-- ░░ EXPIRATION BANNER ░░ -->
            <div style="background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);color:white;border-radius:12px;padding:16px 24px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 10px 15px -3px rgba(220,38,38,0.3);">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="background:rgba(255,255,255,0.2);padding:8px;border-radius:50%;display:flex;">
                        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                    <div>
                        <h4 style="margin:0;font-size:16px;font-weight:700;">Subscription Expired</h4>
                        <p style="margin:4px 0 0 0;font-size:13px;opacity:0.9;">You currently have view-only access. Renew your plan to unlock all features.</p>
                    </div>
                </div>
                <button class="btn" style="background:white;color:#dc2626;border:none;font-weight:700;padding:8px 20px;border-radius:8px;" onclick="showPage('subscription')">Renew Now</button>
            </div>
            ` : ''}

            <!-- ░░ HEADER BANNER ░░ -->
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;
                        background:white;border-radius:14px;padding:18px 24px;margin-bottom:24px;
                        border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                <div style="display:flex;align-items:center;gap:14px;">
                    <div style="width:44px;height:44px;border-radius:12px;
                                background:linear-gradient(135deg,#0f172a,#1e293b);
                                display:flex;align-items:center;justify-content:center;flex-shrink:0;
                                box-shadow:0 4px 12px rgba(15,23,42,0.25);">
                        <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                        </svg>
                    </div>
                    <div>
                        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                            <h2 style="margin:0;font-size:17px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;">
                                Laboratory Command Center
                            </h2>
                            <span style="display:inline-flex;align-items:center;gap:5px;
                                         padding:3px 10px;border-radius:20px;
                                         background:#ecfdf5;color:#047857;
                                         border:1px solid #a7f3d0;
                                         font-size:10px;font-weight:700;letter-spacing:0.06em;">
                                <span style="width:6px;height:6px;border-radius:50%;background:#10b981;
                                             animation:pulse 2s infinite;display:inline-block;"></span>
                                LIVE
                            </span>
                        </div>
                        <p style="margin:3px 0 0;font-size:12px;color:#64748b;font-weight:500;">
                            ${dateStr}
                        </p>
                    </div>
                </div>
            </div>

            <!-- ░░ KPI GRID ░░ -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;margin-bottom:24px;">
                ${subscriptionWidget}
                ${kpiCard({
                    label: 'Patients Today',
                    value: todayUniquePatients,
                    sub: 'Total Registered',
                    subValue: patients.length,
                    iconHtml: patientIcon,
                    iconBg: '#eef2ff',
                    iconColor: '#4f46e5',
                    accentColor: '#4f46e5'
                })}

                ${kpiCard({
                    label: 'Reports Today',
                    value: todayReports.length,
                    sub: 'All-time Reports',
                    subValue: reports.length,
                    iconHtml: reportIcon,
                    iconBg: '#ecfdf5',
                    iconColor: '#059669',
                    accentColor: '#10b981'
                })}

                ${kpiCard({
                    label: 'Revenue Today',
                    value: '₹' + todayRevenue.toLocaleString('en-IN'),
                    sub: 'Payment Status',
                    subValue: '<span style="color:#059669;font-weight:700;">Settled</span>',
                    iconHtml: revenueIcon,
                    iconBg: '#f0f9ff',
                    iconColor: '#0284c7',
                    accentColor: '#0ea5e9'
                })}

                ${kpiCard({
                    label: 'Outstanding Dues',
                    value: '₹' + (todayOutstanding || 0).toLocaleString('en-IN'),
                    sub: 'Collection Status',
                    subValue: (todayOutstanding > 0)
                        ? '<span style="color:#b45309;font-weight:700;">Pending</span>'
                        : '<span style="color:#059669;font-weight:700;">Clear</span>',
                    iconHtml: dueIcon,
                    iconBg: '#fffbeb',
                    iconColor: '#d97706',
                    accentColor: '#f59e0b'
                })}

            </div>

            <!-- ░░ MAIN BODY: TABLE + SIDEBAR ░░ -->
            <div style="display:grid;grid-template-columns:1fr 300px;gap:20px;align-items:start;">

                <!-- RECENT REPORTS -->
                <div class="card" style="overflow:hidden;">
                    <div style="padding:16px 20px;border-bottom:1px solid #f1f5f9;
                                display:flex;align-items:center;justify-content:space-between;">
                        <div>
                            <h3 style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">Recent Reports</h3>
                            <p style="margin:3px 0 0;font-size:11px;color:#64748b;">Latest diagnostic entries</p>
                        </div>
                        <button onclick="showPage('reports')"
                            class="btn btn-outline"
                            style="padding:6px 14px;font-size:12px;border-radius:8px;font-weight:600;">
                            View All
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-left:2px;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                    <div style="overflow-x:auto;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Tests</th>
                                    <th>Billed</th>
                                    <th>Status</th>
                                    <th style="text-align:right;">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${reports.length === 0 ? emptyTableState : recentRows}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- RIGHT SIDEBAR -->
                <div style="display:flex;flex-direction:column;gap:16px;">

                    <!-- Quick Launch -->
                    <div class="card" style="padding:16px;">
                        <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#0f172a;">Quick Launch</h3>
                        <div style="display:flex;flex-direction:column;gap:8px;">
                            ${launchBtn({
                                label: 'Register Patient',
                                desc: 'Create new patient record',
                                iconHtml: addUserIcon,
                                iconBg: '#eef2ff',
                                iconColor: '#4f46e5',
                                borderHover: '#818cf8',
                                onClick: "showAddPatientModal()"
                            })}
                            ${launchBtn({
                                label: 'Patient Directory',
                                desc: 'Search patient history',
                                iconHtml: listIcon,
                                iconBg: '#ecfdf5',
                                iconColor: '#059669',
                                borderHover: '#34d399',
                                onClick: "showPage('patients')"
                            })}
                            ${launchBtn({
                                label: 'LIS Settings',
                                desc: 'Lab profile & price list',
                                iconHtml: gearIcon,
                                iconBg: '#fffbeb',
                                iconColor: '#d97706',
                                borderHover: '#fbbf24',
                                onClick: "showPage('settings')"
                            })}
                        </div>
                    </div>

                    <!-- System Status -->
                    <div style="border-radius:14px;padding:20px;
                                background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);
                                color:white;position:relative;overflow:hidden;
                                box-shadow:0 8px 24px rgba(15,23,42,0.30);">
                        <!-- decorative circle -->
                        <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;
                                    border-radius:50%;background:rgba(99,102,241,0.15);pointer-events:none;"></div>
                        <div style="position:absolute;bottom:-40px;left:-20px;width:100px;height:100px;
                                    border-radius:50%;background:rgba(16,185,129,0.08);pointer-events:none;"></div>

                        <div style="position:relative;z-index:1;">
                            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                                <span style="font-size:14px;font-weight:800;color:white;letter-spacing:-0.01em;">CUREBIT LIS</span>
                                <span style="padding:2px 8px;border-radius:6px;font-size:9px;font-weight:700;
                                             background:rgba(99,102,241,0.25);color:#a5b4fc;border:1px solid rgba(99,102,241,0.3);
                                             letter-spacing:0.06em;">PRO</span>
                            </div>
                            <p style="margin:0 0 16px;font-size:11px;color:rgba(148,163,184,0.9);">
                                Clinical data pipeline active
                            </p>
                            <div style="padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);
                                        display:flex;align-items:center;justify-content:space-between;">
                                <div style="display:flex;align-items:center;gap:7px;">
                                    <span style="width:8px;height:8px;border-radius:50%;background:#10b981;
                                                 box-shadow:0 0 8px #10b981;display:inline-block;"></span>
                                    <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">
                                        All Systems Normal
                                    </span>
                                </div>
                                <span style="font-size:10px;color:#475569;font-family:monospace;">100% UP</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>`;

    } catch (e) {
        console.error('Dashboard Error:', e);
        document.getElementById('pageContainer').innerHTML = `
            <div style="padding:48px;text-align:center;">
                <p style="color:#ef4444;font-size:14px;font-weight:600;">Error loading dashboard: ${e.message}</p>
            </div>`;
    }
}

