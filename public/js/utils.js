/**
 * CUREBIT - Utility Functions (Firebase/Async)
 * Toast notifications, print, helpers
 */

/// ==================== ICONS ====================
const ICONS = {
    dashboard: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',
    patients: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    newReport: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    reports: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    templates: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>',
    settings: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    plus: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>',
    search: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>',
    view: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
    edit: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
    print: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>',
    delete: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
    close: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
    check: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
    clock: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    save: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    download: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    upload: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>',
    userPlus: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>',
    calendar: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
    flask: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>',
    image: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
    emptyReport: '<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    emptyPatient: '<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    admin: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    profile: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
    subscription: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
    camera: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    shield: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    key: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>',
    mail: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
    phone: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
    history: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    whatsapp: '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    link: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>',
    copy: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2zM8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>'
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

function showConfirmModal(options) {
    const title = options.title || 'Confirm Action';
    const message = options.message || 'Are you sure you want to proceed?';
    const confirmText = options.confirmText || 'Confirm';
    const cancelText = options.cancelText || 'Cancel';
    const type = options.type || 'info'; // 'info', 'danger', 'success'
    
    let icon = 'ℹ️';
    let iconBg = '#eef2ff';
    let iconColor = '#4f46e5';
    let confirmBtnBg = '#4f46e5';
    
    if (type === 'danger') {
        icon = '⚠️';
        iconBg = '#fee2e2';
        iconColor = '#ef4444';
        confirmBtnBg = '#ef4444';
    } else if (type === 'success') {
        icon = '✓';
        iconBg = '#d1fae5';
        iconColor = '#10b981';
        confirmBtnBg = '#10b981';
    }
    
    const modalHtml = `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
        <div class="modal-content" style="max-width:440px;padding:32px;background:#ffffff;border-radius:16px;box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);">
            <div style="display:flex;align-items:flex-start;gap:16px;">
                <div style="width:40px;height:40px;border-radius:50%;background:${iconBg};color:${iconColor};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;flex-shrink:0;margin-top:2px;">
                    ${icon}
                </div>
                <div style="flex:1;">
                    <h3 style="font-size:17px;font-weight:700;color:#0f172a;margin:0 0 6px 0;text-align:left;">${title}</h3>
                    <p style="font-size:13.5px;color:#64748b;margin:0;line-height:1.5;font-weight:400;text-align:left;">${message}</p>
                </div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:24px;">
                <button onclick="closeModal()" class="btn btn-outline" style="padding:10px 18px;border-radius:8px;font-weight:600;font-size:13.5px;cursor:pointer;border:1px solid #e2e8f0;background:white;color:#334155;">
                    ${cancelText}
                </button>
                <button id="confirmModalBtn" style="padding:10px 18px;border-radius:8px;font-weight:600;font-size:13.5px;cursor:pointer;background:${confirmBtnBg};border:1px solid ${confirmBtnBg};color:white;box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                    ${confirmText}
                </button>
            </div>
        </div>
    </div>`;
    showModal(modalHtml);
    document.getElementById('confirmModalBtn').onclick = () => {
        closeModal();
        if (options.onConfirm) options.onConfirm();
    };
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

// ==================== LABORATORY REPORT STATUS DOT INDICATOR ====================
function getReportStatusDot(test, patient) {
    const valStr = (test.value !== undefined && test.value !== null) ? String(test.value).trim() : '';
    if (!valStr || valStr === '—' || valStr === '-' || valStr === '') {
        // Gray = Pending / Not Entered
        return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#94a3b8;margin-left:6px;vertical-align:middle;"></span>`;
    }

    if (test.type === 'select' || test.type === 'text') {
        // Green = Normal
        return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#22c55e;margin-left:6px;vertical-align:middle;"></span>`;
    }

    const v = parseFloat(valStr);
    if (isNaN(v)) {
        return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#22c55e;margin-left:6px;vertical-align:middle;"></span>`;
    }

    const g = patient?.gender || 'Male';
    const isChild = g.startsWith('Child');
    let min, max;
    if (isChild) { min = test.childMin; max = test.childMax; }
    else if (g === 'Female') { min = test.femaleMin; max = test.femaleMax; }
    else { min = test.maleMin; max = test.maleMax; }

    if (min === null || max === null) {
        return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#22c55e;margin-left:6px;vertical-align:middle;"></span>`;
    }

    // Critical check: > 1.5x max or < 0.5x min
    if ((max > 0 && v > max * 1.5) || (min > 0 && v < min * 0.5)) {
        // Red = Critical
        return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#ef4444;margin-left:6px;vertical-align:middle;"></span>`;
    }

    if (v > max) {
        // Orange = High
        return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#f97316;margin-left:6px;vertical-align:middle;"></span>`;
    }

    if (v < min) {
        // Blue = Low
        return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#2563eb;margin-left:6px;vertical-align:middle;"></span>`;
    }

    // Green = Normal
    return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#22c55e;margin-left:6px;vertical-align:middle;"></span>`;
}

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

/// ==================== REPORT HTML GENERATOR — DRLOGY PREMIUM STYLE ====================
function getReportHTML(report, patient, lab) {
    const hc      = lab.headerColor || '#1a3a8a';   // primary brand blue
    const hcDark  = lab.headerColor || '#0f2460';
    const refBy   = report.referredBy || patient?.referredBy || 'Self';
    const reportDate  = new Date(report.date);
    const registered  = new Date(reportDate.getTime() - 2 * 60 * 60 * 1000);
    const collected   = new Date(reportDate.getTime() - 1 * 60 * 60 * 1000);

    const fmtDate = d => d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    const fmtTime = d => d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });
    const fmtDT   = d => `${fmtTime(d)} ${fmtDate(d)}`;

    /* ── per-test section HTML ──────────────────────────────────── */
    let testsHtml = '';
    report.selectedTemplates.forEach(tName => {
        const results = report.results[tName];
        if (!results) return;

        let rowsHtml = `
        <tr style="background:#f9fafb;">
            <td style="padding:7px 12px;font-size:11px;color:#374151;font-weight:600;">Sample Type</td>
            <td style="padding:7px 12px;font-size:11px;color:#111827;" colspan="3">${report.sampleType || 'Blood'}</td>
        </tr>`;

        results.forEach((r, i) => {
            const refText    = getRefRangeDetailed(r, patient);
            const rowBg      = i % 2 === 0 ? '#ffffff' : '#f9fafb';
            const dotHtml    = getReportStatusDot(r, patient);
            const valDisplay = (r.value !== undefined && r.value !== null && r.value !== '' && r.value !== '-') ? r.value : '—';

            rowsHtml += `
            <tr style="background:${rowBg};border-bottom:1px solid #f3f4f6;">
                <td style="padding:8px 12px;font-size:11px;font-weight:600;color:#1e293b;text-transform:uppercase;letter-spacing:0.02em;width:38%;">${r.name}</td>
                <td style="padding:8px 12px;font-size:12px;font-weight:700;color:#0f172a;width:20%;">
                    ${valDisplay}${dotHtml}
                </td>
                <td style="padding:8px 12px;font-size:11px;color:#4b5563;width:27%;">${refText}</td>
                <td style="padding:8px 12px;font-size:11px;color:#6b7280;width:15%;">${r.unit || ''}</td>
            </tr>`;
        });

        /* Centered test title with decorative lines */
        testsHtml += `
        <div style="margin-bottom:20px;">
            <!-- Section title -->
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:0;">
                <div style="flex:1;height:1px;background:#c7d2fe;"></div>
                <div style="font-size:13px;font-weight:800;color:#1e293b;text-transform:uppercase;letter-spacing:0.06em;padding:0 4px;text-align:center;">${tName}</div>
                <div style="flex:1;height:1px;background:#c7d2fe;"></div>
            </div>
            <!-- Column header -->
            <table style="width:100%;border-collapse:collapse;margin-top:0;">
                <thead>
                    <tr style="border-bottom:2px solid #1e293b;border-top:1px solid #e5e7eb;">
                        <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#1e293b;width:38%;">Investigation</th>
                        <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#1e293b;width:20%;">Result</th>
                        <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#1e293b;width:27%;">Reference Value</th>
                        <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#1e293b;width:15%;">Unit</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>`;
    });

    /* ── signatories ────────────────────────────────────────────── */
    const sigs = lab.signatories && lab.signatories.length
        ? lab.signatories
        : [
            lab.techName ? { name: lab.techName, qual: lab.techDegree || '' } : null,
            lab.pathologistName ? { name: lab.pathologistName, qual: lab.pathologistDegree || '' } : null,
            lab.doctorName ? { name: lab.doctorName, qual: lab.doctorQualification || '' } : null
          ].filter(Boolean);

    const sigsHtml = sigs.map(s => `
        <td style="text-align:center;vertical-align:bottom;padding:0 10px;width:${Math.floor(100/sigs.length)}%;">
            <div style="font-size:11px;font-weight:700;color:#0f172a;border-top:1px solid #64748b;padding-top:8px;margin-top:40px;">${s.name}</div>
            <div style="font-size:10px;color:#475569;margin-top:2px;">${s.qual}</div>
        </td>`).join('');

    const rawLabName = DB.normalizeLabName ? DB.normalizeLabName(lab.labName) : (lab.labName || auth.currentUser?.displayName || 'Registered Lab');

    /* ── FULL REPORT ────────────────────────────────────────────── */
    return `
    <div style="font-family:'Inter','Arial',sans-serif;max-width:800px;margin:0 auto;background:#fff;color:#1e293b;font-size:11px;line-height:1.5;border:1px solid #e2e8f0;">

        <!-- ░░ HEADER ░░ -->
        <div style="padding:16px 20px 0;background:#fff;border-bottom:3px solid ${hc};">
            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <!-- Logo + Name -->
                    <td style="vertical-align:top;width:55%;">
                        <div style="display:flex;align-items:center;gap:12px;">
                            <!-- Logo box -->
                            ${(lab.logo || lab.logoUrl) ? `
                            <div style="width:56px;height:56px;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#ffffff;border:1px solid #e2e8f0;flex-shrink:0;padding:2px;">
                                <img src="${lab.logo || lab.logoUrl}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="Lab Logo">
                            </div>
                            ` : `
                            <div style="width:44px;height:44px;border-radius:50%;background:${hc};border:2px solid ${hc};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.2)"/>
                                    <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z" fill="white"/>
                                </svg>
                            </div>
                            `}
                            <div>
                                <div style="font-size:20px;font-weight:900;line-height:1.1;">
                                    <span style="color:${hc};">${rawLabName.toUpperCase()}</span>
                                </div>
                                <div style="font-size:9.5px;color:#64748b;margin-top:3px;font-style:italic;">
                                    ${lab.tagline || 'Accurate &nbsp;|&nbsp; Caring &nbsp;|&nbsp; Instant'}
                                </div>
                                <div style="font-size:9px;color:#475569;margin-top:4px;max-width:340px;">
                                    ${lab.address || ''}
                                </div>
                            </div>
                        </div>
                    </td>
                    <!-- Contact -->
                    <td style="vertical-align:top;text-align:right;width:45%;">
                        <div style="font-size:10.5px;color:#1e293b;line-height:2;">
                            <div style="display:flex;align-items:center;justify-content:flex-end;gap:6px;">
                                <svg width="12" height="12" fill="${hc}" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                                <span style="font-weight:600;">${lab.phone || ''}</span>
                            </div>
                            <div style="display:flex;align-items:center;justify-content:flex-end;gap:6px;">
                                <svg width="12" height="12" fill="${hc}" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                                <span>${lab.email || ''}</span>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
            <!-- thin accent line bottom of header -->
            <div style="margin-top:12px;height:3px;background:linear-gradient(90deg,${hc},#818cf8 50%,${hc});border-radius:2px 2px 0 0;"></div>
        </div>

        <!-- ░░ PATIENT INFO ROW ░░ -->
        <div style="padding:12px 20px;border-bottom:1px solid #e2e8f0;background:#fafbff;">
            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <!-- Col 1: Patient -->
                    <td style="width:30%;vertical-align:top;padding-right:14px;border-right:1px solid #e2e8f0;">
                        <div style="font-size:14px;font-weight:800;color:#0f172a;letter-spacing:-0.01em;">${patient ? patient.name : 'Unknown Patient'}</div>
                        <div style="font-size:10.5px;color:#475569;margin-top:5px;line-height:1.8;">
                            <div>Age : <strong style="color:#1e293b;">${patient ? patient.age + ' Years' : '—'}</strong></div>
                            <div>Sex : <strong style="color:#1e293b;">${patient ? patient.gender : '—'}</strong></div>
                        </div>
                    </td>
                    <!-- Col 2: Sample info -->
                    <td style="width:38%;vertical-align:top;padding:0 14px;border-right:1px solid #e2e8f0;">
                        <div style="font-size:10.5px;font-weight:700;color:#1e293b;margin-bottom:4px;">Sample Collected At:</div>
                        <div style="font-size:10px;color:#475569;line-height:1.8;">
                            <div>${lab.address || '—'}</div>
                            <div>Ref. By: <strong style="color:#1e293b;">Dr. ${refBy}</strong></div>
                        </div>
                    </td>
                    <!-- Col 3: Dates -->
                    <td style="width:32%;vertical-align:top;padding-left:14px;text-align:right;">
                        <div style="font-size:9.5px;color:#475569;line-height:1.9;text-align:left;">
                            <div><span style="color:#94a3b8;display:inline-block;min-width:80px;">Registered on:</span> ${fmtDT(registered)}</div>
                            <div><span style="color:#94a3b8;display:inline-block;min-width:80px;">Collected on:</span> ${fmtDT(collected)}</div>
                            <div><span style="color:#94a3b8;display:inline-block;min-width:80px;">Reported on:</span> ${fmtDT(reportDate)}</div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- ░░ TEST RESULTS ░░ -->
        <div style="padding:16px 20px;">
            ${testsHtml}
        </div>

        <!-- ░░ SIGNATURES ░░ -->
        <div style="padding:0 20px 16px;">
            <div style="font-size:9.5px;color:#94a3b8;margin-bottom:4px;">Thanks for Reference</div>
            <table style="width:100%;border-collapse:collapse;">
                <tr>${sigsHtml}</tr>
            </table>
        </div>

        <!-- ░░ BOTTOM BANNER ░░ -->
        <div style="background:${hc};padding:10px 20px;display:flex;align-items:center;justify-content:space-between;">
            <div style="font-size:9px;color:rgba(255,255,255,0.7);">
                ****End of Report****
            </div>
            <div style="font-size:9px;color:rgba(255,255,255,0.85);text-align:center;">
                Generated on: ${fmtDT(new Date())}
            </div>
            <div style="font-size:9px;color:rgba(255,255,255,0.7);">Page 1 of 1</div>
        </div>

    </div>`;
}

// ==================== PDF ARCHITECTURE (GENERATE ONCE, SERVE EVERYWHERE) ====================



async function preloadLabLogo(url) {
    if (!url) return false;
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// ==================== BROWSER-NATIVE RUNTIME PRINT ENGINE ====================

async function handlePrintReport(id) {
    try {
        const currentUser = firebase.auth().currentUser;
        if (!currentUser || !DB.userId) {
            showToast('SECURITY ERROR: Unauthenticated tenant session', 'error');
            return;
        }

        const report = await DB.getReportById(id);
        if (!report) {
            showToast('Report not found', 'error');
            return;
        }

        const patient = await DB.getPatientById(report.patientId);
        if (!patient) {
            showToast('SECURITY ERROR: Patient record missing or isolated', 'error');
            return;
        }

        const labSettings = await DB.getLabProfile();
        DB.assertTenantAssets(labSettings);

        const logoUrl = labSettings.logo || labSettings.logoUrl || '';
        console.log("Lab Settings:", labSettings);
        console.log("Logo URL:", logoUrl);

        let success = false;
        if (logoUrl) {
            success = await preloadLabLogo(logoUrl);
            console.log("Logo Loaded:", success);
        }

        // 1. Render transient report HTML in memory
        const reportHtml = getReportHTML(report, patient, labSettings);

        // 2. Create temporary print iframe in DOM
        let iframe = document.getElementById('curebit_print_frame');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'curebit_print_frame';
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            document.body.appendChild(iframe);
        }

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Report - ${patient ? patient.name : 'Patient'}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
                <style>
                    body { margin: 0; padding: 0; background: #fff; font-family: 'Inter', sans-serif; }
                    @media print {
                        @page { size: A4 portrait; margin: 8mm; }
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                ${reportHtml}
            </body>
            </html>
        `);
        doc.close();

        // 3. Trigger Native Browser Print Dialog
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            // 4. Update audit print count in Firestore
            DB.incrementPrintCount(id);

            // 5. Cleanup DOM frame immediately post-print
            setTimeout(() => {
                if (iframe && iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
            }, 1000);
        }, 300);

    } catch (e) {
        console.error('Browser-Native Print Engine Error:', e);
        showToast('Print error: ' + e.message, 'error');
    }
}

// ==================== SHARE & DELIVERY ====================

function isValidPhone(phone) {
    if (!phone) return false;
    const clean = phone.replace(/\D/g, "");
    return clean.length === 10;
}

async function shareOnWhatsApp(id) {
    try {
        const report = await DB.getReportById(id);
        const patient = await DB.getPatientById(report.patientId);
        
        if (!patient || !patient.phone) {
            showToast('Patient phone number missing', 'error');
            return;
        }

        const cleanPhone = patient.phone.replace(/\D/g, "");
        if (cleanPhone.length !== 10) {
            showToast('Invalid 10-digit phone number', 'error');
            return;
        }

        // Use cached PDF URL (One-time generation architecture)
        const pdfUrl = await generateAndStorePDF(id);
        
        if (!pdfUrl) {
            showToast('Could not generate report link', 'error');
            return;
        }

        // Senior SaaS Implementation: Check if it's a local blob (Cloud failure fallback)
        if (pdfUrl.startsWith('blob:')) {
            showToast('Cloud storage full! Direct link unavailable.', 'warning');
            // We can't share local blobs via wa.me links easily, 
            // but we can try to share the current page if it's public (not applicable here usually)
            return;
        }

        const message = `Hello ${patient.name}, your lab report is ready.\n\nYou can view/download it here:\n${pdfUrl}`;
        const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
        
        window.open(waUrl, "_blank");
        showToast('WhatsApp opened', 'success');
    } catch (e) {
        console.error('WhatsApp Share Error:', e);
        showToast('Sharing failed', 'error');
    }
}

async function copyReportLink(id) {
    try {
        const pdfUrl = await generateAndStorePDF(id);
        if (!pdfUrl) throw new Error('No PDF URL available');

        if (pdfUrl.startsWith('blob:')) {
            showToast('Cloud full: Only local link available', 'warning');
        }

        await navigator.clipboard.writeText(pdfUrl);
        showToast('Link copied to clipboard!', 'success');
        
        // Optional: Trigger a success sound or haptic feedback if mobile
        if (window.navigator.vibrate) window.navigator.vibrate(50);
    } catch (e) {
        showToast('Failed to copy link', 'error');
    }
}

// ==================== BILLING & RECEIPTS ====================

// ==================== BILLING & RECEIPTS ====================

function numberToWords(num) {
    if (!num || num === 0) return 'Zero Rupees Only';
    const a = ['','One ','Two ','Three ','Four ','Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
    function inWords(n) {
        if ((n = n.toString()).length > 9) return 'overflow';
        let nStr = ('000000000' + n).substr(-9);
        let nArr = nStr.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!nArr) return '';
        let str = '';
        str += (nArr[1] != 0) ? (a[Number(nArr[1])] || b[nArr[1][0]] + ' ' + a[nArr[1][1]]) + 'Crore ' : '';
        str += (nArr[2] != 0) ? (a[Number(nArr[2])] || b[nArr[2][0]] + ' ' + a[nArr[2][1]]) + 'Lakh ' : '';
        str += (nArr[3] != 0) ? (a[Number(nArr[3])] || b[nArr[3][0]] + ' ' + a[nArr[3][1]]) + 'Thousand ' : '';
        str += (nArr[4] != 0) ? (a[Number(nArr[4])] || b[nArr[4][0]] + ' ' + a[nArr[4][1]]) + 'Hundred ' : '';
        str += (nArr[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(nArr[5])] || b[nArr[5][0]] + ' ' + a[nArr[5][1]]) : '';
        return str;
    }
    return inWords(num).trim() + ' Rupees Only';
}

async function handlePrintReceipt(id) {
    try {
        const report  = await DB.getReportById(id);
        const patient = await DB.getPatientById(report.patientId);
        const lab     = await DB.getLabProfile();
        
        const rawLabName = DB.normalizeLabName ? DB.normalizeLabName(lab.labName) : (lab.labName || auth.currentUser?.displayName || 'Registered Lab');

        const hc         = lab.headerColor || '#1a3a8a';
        const receiptNo  = 'REC-' + (report.id ? report.id.slice(0, 8).toUpperCase() : '0001');
        const reportDate = report.date ? new Date(report.date) : new Date();
        const fmtDate    = d => d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
        const fmtTime    = d => d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });
        const dateStr    = `${fmtDate(reportDate)} ${fmtTime(reportDate)}`;

        /* Billing Calculations */
        const subtotal = Number(report.billing?.subtotal || report.billing?.total || 0);
        const discount = Number(report.billing?.discount || 0);
        const total    = Math.max(0, Number(report.billing?.total || (subtotal - discount)));
        const paid     = Number(report.billing?.paid || 0);
        const due      = Math.max(0, total - paid);
        const isPaid   = paid >= total && total > 0;
        const statusLbl= isPaid ? 'FULLY PAID' : (paid > 0 ? 'PARTIALLY PAID' : 'PENDING');
        const statusBg = isPaid ? '#dcfce7' : (paid > 0 ? '#fef3c7' : '#fee2e2');
        const statusClr= isPaid ? '#15803d' : (paid > 0 ? '#b45309' : '#b91c1c');

        /* Tests Rows */
        const testRows = (report.selectedTemplates || []).map((t, idx) => {
            const price = TEST_PRICES[t] || Math.round(subtotal / (report.selectedTemplates.length || 1)) || 0;
            return `
            <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:10px 14px;font-size:11.5px;color:#64748b;font-weight:600;width:8%;">${idx + 1}</td>
                <td style="padding:10px 14px;font-size:12px;color:#0f172a;font-weight:700;">${t}</td>
                <td style="padding:10px 14px;font-size:11.5px;color:#64748b;text-align:center;">Pathology</td>
                <td style="padding:10px 14px;font-size:12px;color:#0f172a;font-weight:700;text-align:right;">₹${price}</td>
            </tr>`;
        }).join('');

        const win = window.open('', '_blank');
        win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payment Receipt - ${patient?.name || 'Patient'}</title>
            <meta charset="utf-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; padding: 24px; font-size: 12px; }
                .receipt-card { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden; }
                @media print {
                    body { background: #fff; padding: 0; }
                    .receipt-card { border: none; box-shadow: none; border-radius: 0; max-width: 100%; }
                }
            </style>
        </head>
        <body>
            <div class="receipt-card">

                <!-- HEADER BAND -->
                <div style="padding: 20px 24px; border-bottom: 2px solid ${hc}; background: #ffffff;">
                    <table style="width:100%; border-collapse:collapse;">
                        <tr>
                            <td style="vertical-align:middle; width: 60%;">
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <div style="width:42px; height:42px; border-radius:50%; background:${hc}; display:flex; align-items:center; justify-content:center; color:white; font-size:18px; font-weight:900; flex-shrink:0;">
                                        ${rawLabName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style="font-size:18px; font-weight:900; color:${hc}; letter-spacing:-0.01em; text-transform:uppercase;">${rawLabName}</div>
                                        <div style="font-size:10px; color:#64748b; margin-top:2px;">${lab.address || ''}</div>
                                    </div>
                                </div>
                            </td>
                            <td style="vertical-align:middle; text-align:right; width: 40%;">
                                <div style="font-size:10.5px; color:#475569; line-height:1.7;">
                                    <div>📞 <strong style="color:#0f172a;">${lab.phone || ''}</strong></div>
                                    <div>✉ ${lab.email || ''}</div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- TITLE & RECEIPT METRA STRIP -->
                <div style="background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:12px 24px; display:flex; align-items:center; justify-content:space-between;">
                    <div>
                        <span style="font-size:13px; font-weight:800; color:#0f172a; letter-spacing:0.04em; text-transform:uppercase;">PAYMENT RECEIPT</span>
                        <span style="font-size:11px; color:#64748b; margin-left:8px; font-family:monospace;"># ${receiptNo}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:10.5px; color:#64748b;">Date: <strong>${dateStr}</strong></span>
                        <span style="display:inline-block; padding:3px 10px; border-radius:12px; background:${statusBg}; color:${statusClr}; font-size:10px; font-weight:800; letter-spacing:0.04em;">${statusLbl}</span>
                    </div>
                </div>

                <!-- PATIENT & CLINICAL INFO GRID -->
                <div style="padding: 16px 24px; border-bottom:1px solid #e2e8f0; background:#ffffff;">
                    <table style="width:100%; border-collapse:collapse;">
                        <tr>
                            <td style="width:50%; vertical-align:top; padding-right:16px; border-right:1px solid #f1f5f9;">
                                <div style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">PATIENT DETAILS</div>
                                <div style="font-size:14px; font-weight:800; color:#0f172a;">${patient?.name || 'Unknown Patient'}</div>
                                <div style="font-size:11px; color:#475569; margin-top:4px; line-height:1.7;">
                                    <div>Age / Gender : <strong>${patient?.age || '—'} Yrs / ${patient?.gender || '—'}</strong></div>
                                    <div>Mobile No : <strong>${patient?.phone || '—'}</strong></div>
                                </div>
                            </td>
                            <td style="width:50%; vertical-align:top; padding-left:16px;">
                                <div style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">CLINICAL & BILLING REF</div>
                                <div style="font-size:11px; color:#475569; line-height:1.8;">
                                    <div>Ref. By Doctor : <strong style="color:#0f172a;">Dr. ${report.referredBy || patient?.referredBy || 'Self'}</strong></div>
                                    <div>Accession ID : <strong style="color:#0f172a; font-family:monospace;">${report.id ? report.id.slice(0, 10) : '—'}</strong></div>
                                    <div>Payment Mode : <strong style="color:#0f172a;">Cash / Online</strong></div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- ITEMIZED BILLING TABLE -->
                <div style="padding: 16px 24px 0;">
                    <div style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">TESTS & INVESTIGATIONS</div>
                    <table style="width:100%; border-collapse:collapse; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
                        <thead>
                            <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
                                <th style="padding:8px 14px; text-align:left; font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; width:8%;">#</th>
                                <th style="padding:8px 14px; text-align:left; font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase;">Test Particulars</th>
                                <th style="padding:8px 14px; text-align:center; font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase;">Dept</th>
                                <th style="padding:8px 14px; text-align:right; font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>${testRows}</tbody>
                    </table>
                </div>

                <!-- FINANCIAL SUMMARY & AMOUNT IN WORDS -->
                <div style="padding:16px 24px; display:flex; justify-content:space-between; gap:20px; align-items:flex-start;">
                    <!-- Left: Amount in words -->
                    <td style="width:55%; vertical-align:top;">
                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px 14px; margin-top:4px;">
                            <div style="font-size:9.5px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.04em;">Amount in Words</div>
                            <div style="font-size:11.5px; font-weight:700; color:#0f172a; margin-top:3px; font-style:italic;">
                                ${numberToWords(paid)}
                            </div>
                        </div>
                        <div style="font-size:9.5px; color:#94a3b8; margin-top:10px; line-height:1.5;">
                            • Fees once paid are non-refundable.<br>
                            • Please preserve this receipt for diagnostic report collection.
                        </div>
                    </td>

                    <!-- Right: Financial breakdown -->
                    <div style="width:230px; flex-shrink:0;">
                        <table style="width:100%; border-collapse:collapse; font-size:11.5px;">
                            <tr>
                                <td style="padding:4px 0; color:#64748b;">Subtotal</td>
                                <td style="padding:4px 0; text-align:right; font-weight:600; color:#0f172a;">₹${subtotal}</td>
                            </tr>
                            ${discount > 0 ? `
                            <tr>
                                <td style="padding:4px 0; color:#dc2626;">Discount</td>
                                <td style="padding:4px 0; text-align:right; font-weight:700; color:#dc2626;">- ₹${discount}</td>
                            </tr>` : ''}
                            <tr style="border-top:1px solid #e2e8f0;">
                                <td style="padding:6px 0; font-weight:800; color:#0f172a; font-size:12px;">Grand Total</td>
                                <td style="padding:6px 0; text-align:right; font-weight:900; color:#0f172a; font-size:13px;">₹${total}</td>
                            </tr>
                            <tr style="background:#f0fdf4; border-radius:6px;">
                                <td style="padding:6px 8px; font-weight:700; color:#16a34a;">Amount Paid</td>
                                <td style="padding:6px 8px; text-align:right; font-weight:900; color:#16a34a; font-size:13px;">₹${paid}</td>
                            </tr>
                            ${due > 0 ? `
                            <tr style="background:#fff1f2;">
                                <td style="padding:6px 8px; font-weight:700; color:#e11d48;">Balance Due</td>
                                <td style="padding:6px 8px; text-align:right; font-weight:900; color:#e11d48;">₹${due}</td>
                            </tr>` : ''}
                        </table>
                    </div>
                </div>

                <!-- SIGNATURE & FOOTER BAND -->
                <div style="border-top:1px solid #e2e8f0; margin:0 24px; padding:16px 0 12px; display:flex; justify-content:space-between; align-items:flex-end;">
                    <div>
                        <div style="font-size:9.5px; color:#94a3b8; letter-spacing:0.04em;">Generated by CureBIT LIS</div>
                        <div style="font-size:9px; color:#cbd5e1; margin-top:2px;">This is a computer generated payment receipt.</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="width:110px; border-top:1px solid #94a3b8; margin:0 auto 4px;"></div>
                        <div style="font-size:10.5px; font-weight:700; color:#0f172a;">Authorized Cashier</div>
                    </div>
                </div>

                <!-- BOTTOM ACCENT BAR -->
                <div style="height:5px; background:${hc};"></div>

            </div>

            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(() => window.close(), 800);
                };
            </script>
        </body>
        </html>
        `);
        win.document.close();
    } catch (e) {
        console.error('Receipt Error:', e);
        showToast('Receipt error: ' + (e.message || e), 'error');
    }
}



// ==================== DATA EXPORT / IMPORT (Async) ====================
async function exportData() {
    try {
        showToast('Preparing export...', 'info');
        const data = await DB.exportAll();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'CUREBIT_backup_' + new Date().toISOString().split('T')[0] + '.json';
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

// ==================== SUBSCRIPTION GUARD ====================
const SubscriptionGuard = {
    cachedStatus: null,
    
    async init() {
        try {
            if (await DB.checkIfAdmin()) {
                this.cachedStatus = true;
                return;
            }
            const sub = await DB.getSubscription();
            this.cachedStatus = sub && sub.status === 'active' && sub.validUntil && new Date(sub.validUntil.toDate()) > new Date();
        } catch(e) {
            this.cachedStatus = false;
        }
    },
    
    isActive() {
        return this.cachedStatus === true;
    },
    
    showLockedModal() {
        if (document.getElementById('subscriptionLockedModal')) {
            document.getElementById('subscriptionLockedModal').remove();
        }
        
        const modalHtml = `
            <div id="subscriptionLockedModal" class="modal-overlay" style="display:flex;z-index:9999;align-items:center;justify-content:center;">
                <div class="modal-content modal-sm" style="background:white;border-radius:16px;width:100%;max-width:420px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);overflow:hidden;">
                    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);padding:24px;text-align:center;">
                        <div style="background:rgba(255,255,255,0.2);width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px auto;">
                            <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        </div>
                        <h3 style="margin:0;font-size:20px;font-weight:800;color:white;">Feature Locked</h3>
                    </div>
                    <div class="modal-body" style="padding:24px;text-align:center;">
                        <p style="font-size:15px;color:#475569;margin:0;line-height:1.5;">
                            Your CUREBIT subscription has expired. This action is disabled.
                        </p>
                        <p style="font-size:14px;color:#64748b;margin-top:12px;margin-bottom:0;">
                            Please renew your subscription to restore full access to all features, including adding patients, generating reports, and printing.
                        </p>
                    </div>
                    <div class="modal-footer" style="display:flex;gap:12px;padding:20px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                        <button class="btn btn-outline" style="flex:1;" onclick="document.getElementById('subscriptionLockedModal').remove()">Close</button>
                        <button class="btn btn-primary" style="flex:1;background:#dc2626;border-color:#dc2626;" onclick="document.getElementById('subscriptionLockedModal').remove(); showPage('subscription');">
                            View Plans
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },
    
    run(callback) {
        if (this.isActive()) {
            if (typeof callback === 'function') callback();
            return true;
        } else {
            this.showLockedModal();
            return false;
        }
    }
};
