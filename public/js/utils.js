/**
 * LabDesk - Utility Functions (Firebase/Async)
 * Toast notifications, print, helpers
 */

// ==================== ICONS ====================
const ICONS = {
    dashboard: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',
    patients: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    newReport: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    reports: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    templates: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>',
    settings: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    plus: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>',
    search: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>',
    view: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
    edit: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
    print: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>',
    delete: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
    close: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
    check: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
    clock: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    save: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    download: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    upload: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>',
    userPlus: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>',
    calendar: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
    flask: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>',
    image: '<svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
    emptyReport: '<svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    emptyPatient: '<svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    admin: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    profile: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
    subscription: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
    camera: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    shield: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    key: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>',
    mail: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
    phone: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
    history: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
};

// ==================== INPUT VALIDATION ====================
function validatePatientInput(name, age, phone, email) {
    // Name validation
    if (!name || name.trim().length < 2 || name.trim().length > 100) {
        return { valid: false, message: 'Name must be 2-100 characters' };
    }

    // Check for potentially malicious content
    if (/<script|javascript:|onerror=/i.test(name)) {
        return { valid: false, message: 'Invalid characters in name' };
    }

    // Age validation
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        return { valid: false, message: 'Age must be between 0-150 years' };
    }

    // Phone validation (if provided)
    if (phone && phone.trim()) {
        const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
        if (!/^[0-9]{10,15}$/.test(cleanPhone)) {
            return { valid: false, message: 'Phone must be 10-15 digits' };
        }
    }

    // Email validation (if provided)
    if (email && email.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return { valid: false, message: 'Invalid email format' };
        }
    }

    return { valid: true };
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==================== TOAST ====================
function showToast(msg, type = 'success') {
    const iconPaths = {
        success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
        info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPaths[type] || iconPaths.info}"/></svg><span>${msg}</span>`;

    document.getElementById('toastContainer').appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ==================== MODAL ====================
function showModal(html) {
    const container = document.getElementById('modalContainer');
    container.innerHTML = html;
    container.classList.remove('hidden');
}

function closeModal() {
    const container = document.getElementById('modalContainer');
    container.classList.add('hidden');
    container.innerHTML = '';
}

// ==================== REFERENCE RANGE HELPERS ====================
function getRefRange(test) {
    if (test.type === 'select' || test.type === 'text') {
        return test.options ? test.options.join(' / ') : '-';
    }
    let parts = [];
    if (test.maleMin !== null) parts.push('M: ' + test.maleMin + '-' + test.maleMax);
    if (test.femaleMin !== null) parts.push('F: ' + test.femaleMin + '-' + test.femaleMax);
    return parts.join(' | ') || '-';
}

function getPatientRefRange(test, patient) {
    if (test.type === 'select' || test.type === 'text') return '-';
    const g = patient?.gender || 'Male';
    const isChild = g.startsWith('Child');
    let min, max;
    if (isChild) { min = test.childMin; max = test.childMax; }
    else if (g === 'Female') { min = test.femaleMin; max = test.femaleMax; }
    else { min = test.maleMin; max = test.maleMax; }
    if (min === null || max === null) return '-';
    return min + ' - ' + max;
}

// Returns: 'low' | 'high' | 'normal' | false (if not applicable)
function checkAbnormalDetailed(testResult, patient) {
    if (!testResult.value || testResult.type === 'select' || testResult.type === 'text') return false;
    const v = parseFloat(testResult.value);
    if (isNaN(v)) return false;
    const g = patient?.gender || 'Male';
    const isChild = g.startsWith('Child');
    let min, max;
    if (isChild) { min = testResult.childMin; max = testResult.childMax; }
    else if (g === 'Female') { min = testResult.femaleMin; max = testResult.femaleMax; }
    else { min = testResult.maleMin; max = testResult.maleMax; }

    if (min === null || max === null) return 'normal';
    if (v < min) return 'low';
    if (v > max) return 'high';
    return 'normal';
}

function getRefRangeDetailed(test, patient) {
    if (test.type === 'select' || test.type === 'text') return '-';
    const g = patient?.gender || 'Male';
    const isChild = g.startsWith('Child');
    let min, max;
    if (isChild) { min = test.childMin; max = test.childMax; }
    else if (g === 'Female') { min = test.femaleMin; max = test.femaleMax; }
    else { min = test.maleMin; max = test.maleMax; }
    if (min === null || max === null) return '-';
    return `${min} - ${max}`;
}

function checkAbnormal(testResult, patient) {
    const status = checkAbnormalDetailed(testResult, patient);
    return status === 'low' || status === 'high';
}

// ==================== PRINT REPORT (Drlogy Style Professional Layout) ====================
async function handlePrintReport(id) {
    const report = await DB.getReportById(id);
    if (!report) return;
    const patient = await DB.getPatientById(report.patientId);
    const lab = await DB.getLabProfile();
    const hc = lab.headerColor || '#1e40af'; // Primary blue color from image
    const refBy = report.referredBy || patient?.referredBy || '';

    // Timestamps
    const reportDate = new Date(report.date);
    const registered = new Date(reportDate.getTime() - 2 * 60 * 60 * 1000); // Mock registered 2 hours before
    const collected = new Date(reportDate.getTime() - 1.5 * 60 * 60 * 1000); // Mock collected

    const formatDate = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const formatTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const regStr = `${formatTime(registered)} ${formatDate(registered)}`;
    const colStr = `${formatTime(collected)} ${formatDate(registered)}`;
    const repStr = `${formatTime(reportDate)} ${formatDate(reportDate)}`;

    // Build test tables
    let testsHtml = '';
    report.selectedTemplates.forEach(tName => {
        const results = report.results[tName];
        if (!results) return;

        let rowsHtml = '';

        // Add Primary Sample Type row
        rowsHtml += `
            <tr style="border-bottom:1px solid #e5e7eb;">
                <td style="padding:8px 0;font-size:11px;color:#374151;">Primary Sample Type :</td>
                <td style="padding:8px 0;font-size:11px;color:#111827;font-weight:500;">${report.sampleType || 'Blood'}</td>
                <td style="padding:8px 0;"></td>
                <td style="padding:8px 0;"></td>
            </tr>
        `;

        results.forEach((r, i) => {
            const status = checkAbnormalDetailed(r, patient);
            const refRangeText = getRefRangeDetailed(r, patient);

            let valColor = '#111827'; // Default black
            let statusLabel = '';
            let statusColor = '';

            if (status === 'low') {
                valColor = '#2563eb'; // Blue
                statusLabel = 'Low';
                statusColor = '#2563eb';
            } else if (status === 'high') {
                valColor = '#dc2626'; // Red
                statusLabel = 'High';
                statusColor = '#dc2626';
            }

            rowsHtml += `
                <tr style="border-bottom:1px solid #f3f4f6;">
                    <td style="padding:6px 0;vertical-align:top;">
                        <div style="font-size:11px;font-weight:800;color:#111827;text-transform:uppercase;">${r.name}</div>
                        ${r.remarks ? `<div style="font-size:9px;color:#6b7280;margin-top:2px;">${r.remarks}</div>` : ''}
                    </td>
                    <td style="padding:6px 0;vertical-align:top;font-size:11.5px;font-weight:700;color:${valColor};">
                        ${r.value || '-'}
                    </td>
                    <td style="padding:6px 0;vertical-align:top;font-size:11px;color:#374151;">
                        ${statusLabel ? `<span style="color:${statusColor};font-weight:700;margin-right:4px;">${statusLabel}</span>` : ''}
                        ${refRangeText}
                    </td>
                    <td style="padding:6px 0;vertical-align:top;font-size:11px;color:#374151;">
                        ${r.unit}
                    </td>
                </tr>`;
        });

        testsHtml += `
        <div style="margin-top:15px;margin-bottom:20px;">
            <div style="text-align:center;font-size:13px;font-weight:700;color:#111827;text-transform:uppercase;margin-bottom:10px;letter-spacing:0.5px;">${tName}</div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:10px;">
                <thead>
                    <tr style="border-bottom:1px solid #d1d5db;border-top:1px solid #e5e7eb;">
                        <th style="padding:8px 0;text-align:left;font-size:11px;font-weight:700;color:#111827;width:40%;">Investigation</th>
                        <th style="padding:8px 0;text-align:left;font-size:11px;font-weight:700;color:#111827;width:20%;">Result</th>
                        <th style="padding:8px 0;text-align:left;font-size:11px;font-weight:700;color:#111827;width:25%;">Reference Value</th>
                        <th style="padding:8px 0;text-align:left;font-size:11px;font-weight:700;color:#111827;width:15%;">Unit</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>`;
    });

    const printHtml = `
    <div style="font-family:'Roboto','Inter',sans-serif;max-width:800px;margin:0 auto;background:white;padding:20px 30px;font-size:11px;line-height:1.4;color:#1f2937;">
        
        <!-- ===== HEADER ===== -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:15px;">
            <tr>
                <td style="width:70px;vertical-align:top;">
                    <div style="width:60px;height:60px;background:${hc};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:bold;">
                        ${(lab.labName || 'L').charAt(0)}
                    </div>
                </td>
                <td style="vertical-align:top;">
                    <div style="font-size:22px;font-weight:800;color:${hc};text-transform:uppercase;letter-spacing:0.5px;">${lab.labName || 'PATHOLOGY LAB'}</div>
                    <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
                        <svg width="14" height="14" fill="none" stroke="${hc}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                        <span style="font-size:12px;font-weight:600;color:#374151;">Accurate | Caring | Instant</span>
                    </div>
                    <div style="font-size:10px;color:#4b5563;margin-top:4px;max-width:400px;line-height:1.3;">
                        ${lab.address || 'Address Line 1, City, State - Zip Code'}
                    </div>
                </td>
                <td style="vertical-align:top;text-align:right;">
                    <div style="margin-bottom:4px;font-size:11px;color:#374151;">
                        <span style="color:#10b981;margin-right:4px;">📞</span> ${lab.phone || '9876543210'}
                    </div>
                    <div style="font-size:11px;color:#374151;">
                        <span style="color:#f59e0b;margin-right:4px;">✉</span> ${lab.email || 'info@lab.com'}
                    </div>
                </td>
            </tr>
        </table>
        
        <!-- Blue Strip -->
        <div style="height:24px;background:linear-gradient(90deg, ${hc}, #3b82f6);margin-bottom:15px;display:flex;align-items:center;justify-content:flex-end;padding:0 10px;">
            <span style="color:white;font-size:10px;letter-spacing:1px;font-weight:500;text-transform:lowercase;">www.labdesk.in</span>
        </div>

        <!-- ===== PATIENT INFO GRID ===== -->
        <div style="border-bottom:1px solid #d1d5db;padding-bottom:15px;margin-bottom:15px;">
            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <!-- Left Column: Patient Details -->
                    <td style="width:30%;vertical-align:top;border-right:1px solid #e5e7eb;padding-right:15px;">
                        <div style="font-size:16px;font-weight:700;color:#111827;margin-bottom:4px;">${patient ? patient.name : 'Unknown User'}</div>
                        <div style="margin-bottom:3px;"><span style="color:#6b7280;width:40px;display:inline-block;">Age :</span> <span style="font-weight:500;">${patient ? patient.age + ' Years' : '-'}</span></div>
                        <div style="margin-bottom:3px;"><span style="color:#6b7280;width:40px;display:inline-block;">Sex :</span> <span style="font-weight:500;">${patient ? patient.gender : '-'}</span></div>
                        <div style="margin-bottom:3px;"><span style="color:#6b7280;width:40px;display:inline-block;">PID :</span> <span style="font-weight:500;">555</span></div>
                    </td>
                    
                    <!-- Middle Column: QR & Ref -->
                    <td style="width:35%;vertical-align:top;border-right:1px solid #e5e7eb;padding-left:15px;padding-right:15px;">
                        <div style="margin-bottom:4px;">
                            <span style="font-weight:700;color:#111827;">Sample Collected At:</span>
                            <div style="color:#4b5563;margin-top:2px;line-height:1.3;">
                                ${lab.address ? lab.address.split(',')[0] : 'Lab Centre, Main Road'}
                            </div>
                        </div>
                        <div style="margin-top:8px;">
                            <span style="font-weight:700;color:#111827;">Ref. By:</span>
                            <span style="font-weight:600;color:#111827;">Dr. ${refBy || 'Self'}</span>
                        </div>
                    </td>

                    <!-- Right Column: Barcode & Times -->
                    <td style="width:35%;vertical-align:top;padding-left:15px;text-align:right;">
                        <!-- Mock Barcode -->
                        <div style="display:inline-block;margin-bottom:6px;">
                            <div style="height:25px;background:repeating-linear-gradient(90deg,#000,#000 1px,#fff 1px,#fff 2px);width:120px;"></div>
                            <div style="text-align:center;font-size:9px;letter-spacing:2px;margin-top:2px;">${report.id.slice(0, 8)}</div>
                        </div>
                        <div style="font-size:9px;color:#4b5563;line-height:1.4;">
                            <div><strong style="color:#111827;">Registered on:</strong> ${regStr}</div>
                            <div><strong style="color:#111827;">Collected on:</strong> ${colStr}</div>
                            <div><strong style="color:#111827;">Reported on:</strong> ${repStr}</div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- ===== TEST RESULTS ===== -->
        <div style="min-height:400px;">
            ${testsHtml}
        </div>

        <!-- ===== FOOTER (Instruments & Interpretation) ===== -->
        <div style="margin-top:20px;border-top:1px solid #e5e7eb;padding-top:10px;">
            <div style="font-size:10px;color:#111827;margin-bottom:4px;">
                <strong>Instruments:</strong> Fully automated cell counter - Mindray 300
            </div>
            ${report.notes ? `
            <div style="font-size:10px;color:#111827;margin-bottom:4px;">
                <strong>Interpretation:</strong> ${report.notes}
            </div>` : ''}
        </div>

        <div style="text-align:center;font-size:10px;color:#6b7280;margin:20px 0;">
            ****End of Report****
        </div>

        <!-- ===== SIGNATURES ===== -->
        <div style="margin-top:40px;display:flex;justify-content:space-between;align-items:flex-end;">
            <div style="text-align:left;width:30%;">
                <!-- Mock Signature Image or Text -->
                <div style="font-family:'Brush Script MT', cursive;font-size:18px;color:#1f2937;margin-bottom:4px;">Technician</div>
                <div style="font-weight:700;color:#111827;font-size:12px;">Medical Lab Technician</div>
                <div style="font-size:10px;color:#4b5563;">(DMLT, BMLT)</div>
            </div>
            
            <div style="text-align:center;width:30%;">
                <div style="font-family:'Brush Script MT', cursive;font-size:18px;color:#1f2937;margin-bottom:4px;">Dr. Payal</div>
                <div style="font-weight:700;color:#111827;font-size:12px;">Dr. Payal Shah</div>
                <div style="font-size:10px;color:#4b5563;">(MD, Pathologist)</div>
            </div>

            <div style="text-align:right;width:30%;">
                <div style="font-family:'Brush Script MT', cursive;font-size:18px;color:#1f2937;margin-bottom:4px;">Dr. Vimal</div>
                <div style="font-weight:700;color:#111827;font-size:12px;">Dr. Vimal Shah</div>
                <div style="font-size:10px;color:#4b5563;">(MD, Pathologist)</div>
            </div>
        </div>

        <!-- ===== BOTTOM BAR ===== -->
        <div style="margin-top:20px;border-top:1px solid #e5e7eb;padding-top:6px;display:flex;justify-content:space-between;font-size:9px;color:#4b5563;">
            <div></div> <!-- Left empty or QR -->
            <div>Generated on : ${formatDate(new Date())} ${formatTime(new Date())}</div>
            <div>Page 1 of 1</div>
        </div>

    </div>`;

    const pa = document.getElementById('printArea');
    pa.innerHTML = printHtml;
    pa.classList.remove('hidden');
    setTimeout(() => {
        window.print();
        setTimeout(() => pa.classList.add('hidden'), 500);
    }, 400);
}

// ==================== DATA EXPORT / IMPORT (Async) ====================
async function exportData() {
    try {
        showToast('Preparing export...', 'info');
        const data = await DB.exportAll();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'labdesk_backup_' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        showToast('Data exported successfully');
    } catch (e) {
        showToast('Export failed: ' + e.message, 'error');
    }
}

function importDataClick() {
    document.getElementById('importFile').click();
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function (ev) {
        try {
            const data = JSON.parse(ev.target.result);
            if (!confirm('Import ' + (data.patients?.length || 0) + ' patients and ' + (data.reports?.length || 0) + ' reports? This will ADD to your current data.')) return;
            showToast('Importing data...', 'info');
            await DB.importAll(data);
            showToast('Data imported successfully');
            showPage('dashboard');
        } catch (err) {
            showToast('Import failed: ' + (err.message || 'Invalid file'), 'error');
        }
    };
    reader.readAsText(file);
}
