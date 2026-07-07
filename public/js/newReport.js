let selectedTemplates = [];
let editingReportId = null;
let currentStep = 1;

function getTemplateDescription(name, template) {
    if (!template || !template.tests) return "Diagnostic panel";
    const count = template.tests.length;
    const suffix = count === 1 ? "parameter" : "parameters";
    return `${count} ${suffix}`;
}

function renderTemplateCards() {
    return Object.keys(TEST_TEMPLATES).map((name) => {
        const template = TEST_TEMPLATES[name];
        const desc = getTemplateDescription(name, template);
        const price = TEST_PRICES[name] || 0;
        const isSelected = selectedTemplates.includes(name);

        return `
            <div type="button" class="nr-test-card ${isSelected ? 'is-selected' : ''}" data-template="${name}" onclick="toggleTemplate('${name}')"
                style="position:relative;padding:16px;border-radius:12px;border:1.5px solid ${isSelected ? '#4f46e5' : '#e2e8f0'};background:${isSelected ? '#faf8ff' : '#ffffff'};cursor:pointer;transition:all 0.2s ease;box-shadow:${isSelected ? '0 4px 14px rgba(79,70,229,0.15)' : '0 1px 3px rgba(0,0,0,0.03)'};">
                <div style="display:flex;align-items:flex-start;justify-space-between;gap:8px;">
                    <div style="font-size:14px;font-weight:800;color:${isSelected ? '#4338ca' : '#0f172a'};line-height:1.3;flex:1;">${name}</div>
                    <div style="width:20px;height:20px;border-radius:50%;background:${isSelected ? '#4f46e5' : '#f1f5f9'};color:${isSelected ? 'white' : 'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                    </div>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:10px;border-top:1px dashed ${isSelected ? '#c7d2fe' : '#f1f5f9'};">
                    <span style="font-size:11.5px;color:${isSelected ? '#4f46e5' : '#64748b'};font-weight:600;">${desc}</span>
                    <span style="font-size:13px;font-weight:900;color:${isSelected ? '#4338ca' : '#0f172a'};">₹${price}</span>
                </div>
            </div>
        `;
    }).join("");
}

async function renderNewReport(reportData = null) {
    const container = document.getElementById("pageContainer");
    const isEdit = !!reportData;
    editingReportId = isEdit ? reportData.id : null;
    selectedTemplates = isEdit ? (reportData.selectedTemplates || []) : [];
    currentStep = 1;

    container.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p style="margin-top:12px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Loading report workspace...</p></div>`;

    const recentPatients = await DB.getRecentPatients(6);
    const recentHtml = recentPatients.map((p) => `
        <button onclick="selectPatient('${p.id}')" class="nr-chip" style="padding:6px 14px;border-radius:20px;border:1px solid #e2e8f0;background:white;font-size:12px;font-weight:600;color:#334155;cursor:pointer;transition:all 0.15s;"
            onmouseover="this.style.borderColor='#6366f1';this.style.color='#4338ca';this.style.background='#eef2ff';" onmouseout="this.style.borderColor='#e2e8f0';this.style.color='#334155';this.style.background='white';">
            👤 ${p.name}
        </button>
    `).join("");

    container.innerHTML = `
        <div class="nr-shell fade-in" style="max-width:1600px;width:100%;margin:0 auto;padding-bottom:100px;">
            
            <!-- ░░ HERO WORKSPACE HEADER ░░ -->
            <div style="background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);border-radius:16px;padding:22px 28px;margin-bottom:24px;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
                <div style="display:flex;align-items:center;gap:16px;">
                    <div style="width:48px;height:48px;border-radius:14px;background:#4f46e5;color:white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(79,70,229,0.3);flex-shrink:0;">
                        ${ICONS.newReport}
                    </div>
                    <div>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <h2 style="margin:0;font-size:20px;font-weight:900;color:#0f172a;letter-spacing:-0.02em;">${isEdit ? 'Edit Diagnostic Report' : 'Create Diagnostic Report'}</h2>
                            <span style="padding:2px 10px;border-radius:20px;background:#e0e7ff;color:#4338ca;font-size:11px;font-weight:800;">${isEdit ? 'Modifying Entry' : 'New Order'}</span>
                        </div>
                        <p style="margin:4px 0 0;font-size:12px;color:#64748b;font-weight:500;">
                            Select patient, choose test panels, and enter parameter measurements
                        </p>
                    </div>
                </div>
            </div>

            <!-- ░░ STEP PROGRESS BAR ░░ -->
            <div class="nr-progress" style="background:white;border-radius:14px;padding:16px 28px;border:1px solid #e2e8f0;margin-bottom:20px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
                <div class="nr-progress__track" style="top:32px;"></div>
                <div class="nr-progress__fill" id="progressFill" style="top:32px;width: 15%;"></div>
                
                <div class="nr-step active" id="step_item_1" onclick="setStep(1)" style="cursor:pointer;">
                    <div class="nr-step__dot">1</div>
                    <div class="nr-step__label">1. Patient Details</div>
                </div>
                <div class="nr-step" id="step_item_2" onclick="setStep(2)" style="cursor:pointer;">
                    <div class="nr-step__dot">2</div>
                    <div class="nr-step__label">2. Diagnostics Selection</div>
                </div>
                <div class="nr-step" id="step_item_3" onclick="setStep(3)" style="cursor:pointer;">
                    <div class="nr-step__dot">3</div>
                    <div class="nr-step__label">3. Parameter Terminal</div>
                </div>
            </div>

            <!-- ░░ STEP 1: PATIENT INFORMATION ░░ -->
            <section class="card nr-step-section" id="section_1" style="border-radius:14px;border:1px solid #e2e8f0;padding:24px;margin-bottom:20px;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid #f1f5f9;">
                    <div style="width:28px;height:28px;border-radius:8px;background:#eef2ff;color:#4f46e5;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;">1</div>
                    <div>
                        <h3 style="font-size:15px;font-weight:800;color:#0f172a;margin:0;">Patient Information</h3>
                        <p style="font-size:11.5px;color:#64748b;margin:2px 0 0;">Search patient by name or phone, or pick from recent records.</p>
                    </div>
                </div>

                <div class="nr-grid-2">
                    <div>
                        <label class="nr-label">Search Patient *</label>
                        <div class="nr-input-wrap">
                            <span class="nr-input-icon">${ICONS.search}</span>
                            <input type="text" id="patientSearch" class="nr-input" placeholder="Search by name or mobile number..." oninput="handlePatientSearch(this.value)">
                        </div>
                        <div id="searchResults" class="search-dropdown hidden nr-search-results" style="border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,0.1);"></div>
                        <input type="hidden" id="reportPatient" value="${isEdit ? reportData.patientId : ""}">
                    </div>
                    <div>
                        <label class="nr-label">Referring Physician (Doctor)</label>
                        <div class="nr-input-wrap">
                            <span class="nr-input-icon">${ICONS.userPlus}</span>
                            <input type="text" id="reportRefBy" class="nr-input" placeholder="Dr. Name or Self" value="${isEdit ? reportData.referredBy : ""}">
                        </div>
                    </div>
                </div>

                <div id="patientLastVisitInfo" class="nr-banner hidden" style="margin-top:16px;"></div>

                ${recentPatients.length > 0 ? `
                <div class="nr-recent" style="margin-top:18px;padding-top:14px;border-top:1px solid #f8fafc;">
                    <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px;">Recent Patients</p>
                    <div class="nr-chip-row">${recentHtml}</div>
                </div>` : ''}
            </section>

            <!-- ░░ STEP 2: DIAGNOSTIC SELECTION ░░ -->
            <section class="card nr-step-section nr-step-locked" id="section_2" style="border-radius:14px;border:1px solid #e2e8f0;padding:24px;margin-bottom:20px;">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid #f1f5f9;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:28px;height:28px;border-radius:8px;background:#eef2ff;color:#4f46e5;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;">2</div>
                        <div>
                            <h3 style="font-size:15px;font-weight:800;color:#0f172a;margin:0;">Diagnostic Test Panels</h3>
                            <p style="font-size:11.5px;color:#64748b;margin:2px 0 0;">Click test cards to add them to this report order.</p>
                        </div>
                    </div>

                    <!-- Presets -->
                    <div class="nr-presets" style="margin:0;">
                        <button onclick="applyPreset('CBC')" class="nr-preset">CBC</button>
                        <button onclick="applyPreset('LFT')" class="nr-preset">LFT</button>
                        <button onclick="applyPreset('KFT')" class="nr-preset">KFT</button>
                        <button onclick="applyPreset('SUGAR')" class="nr-preset">SUGAR</button>
                    </div>
                </div>

                <div class="nr-test-grid">
                    ${renderTemplateCards()}
                </div>
            </section>

            <!-- ░░ STEP 3: ENTRY TERMINAL ░░ -->
            <section class="card nr-step-section nr-step-locked" id="section_3" style="border-radius:14px;border:1px solid #e2e8f0;padding:24px;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid #f1f5f9;">
                    <div style="width:28px;height:28px;border-radius:8px;background:#eef2ff;color:#4f46e5;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;">3</div>
                    <div>
                        <h3 style="font-size:15px;font-weight:800;color:#0f172a;margin:0;">Result Entry Terminal</h3>
                        <p style="font-size:11.5px;color:#64748b;margin:2px 0 0;">Type parameter values. Press <kbd style="background:#f1f5f9;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:10px;">Enter</kbd> to jump to the next field.</p>
                    </div>
                </div>

                <div id="testResultsGrid">
                    <div class="nr-empty-state">
                        <div class="nr-empty-state__icon" style="color:#818cf8;">${ICONS.flask}</div>
                        <h4 style="font-size:15px;font-weight:800;color:#0f172a;">Select diagnostic panels to begin</h4>
                        <p style="font-size:12.5px;color:#64748b;">Choose test panels in Step 2 to open parameter input fields.</p>
                    </div>
                </div>
            </section>
        </div>

        <!-- ░░ FLOATING STICKY ACTION DOCK ░░ -->
        <div class="nr-action-bar" style="background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);border-top:1px solid #e2e8f0;box-shadow:0 -4px 20px rgba(0,0,0,0.08);">
            <div class="nr-action-col nr-action-left">
                <div class="nr-stat">
                    <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;">Selected Panels</span>
                    <span style="font-size:16px;font-weight:900;color:#4f46e5;" id="testCountDisplay">0 Panels</span>
                </div>
            </div>
            
            <div class="nr-action-col nr-action-center">
                <button onclick="generateAndPreview()" class="nr-generate-btn" id="generateBtn" disabled
                    style="padding:11px 36px;border-radius:10px;font-size:14px;font-weight:800;box-shadow:0 4px 14px rgba(79,70,229,0.3);gap:8px;display:inline-flex;align-items:center;">
                    ${ICONS.check} Generate & Preview Report
                </button>
            </div>
            
            <div class="nr-action-col nr-action-right">
                <div class="nr-stat">
                    <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;">Total Bill</span>
                    <span style="font-size:18px;font-weight:900;color:#0f172a;" id="billTotalDisplay">₹0</span>
                </div>
                <div class="nr-cash-wrap" style="display:flex;flex-direction:column;gap:2px;">
                    <label for="billingPaid" style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;">Cash Paid (₹)</label>
                    <input type="number" id="billingPaid" value="0" oninput="calculateBilling()"
                        style="width:90px;height:34px;border-radius:8px;border:1.5px solid #cbd5e1;padding:0 8px;font-size:13px;font-weight:700;color:#0f172a;outline:none;">
                </div>
            </div>
        </div>
    `;

    if (isEdit) {
        updateResultsGrid(reportData.results);
        updateSummary();
        setStep(3);
    } else {
        updateSelectedTestCards();
        updateSummary();
    }
}

function setStep(step) {
    currentStep = step;

    const fill = document.getElementById("progressFill");
    if (fill) {
        fill.style.width = step === 1 ? "15%" : step === 2 ? "50%" : "100%";
    }

    for (let i = 1; i <= 3; i++) {
        const item = document.getElementById(`step_item_${i}`);
        const section = document.getElementById(`section_${i}`);
        if (!item || !section) continue;

        item.classList.remove("active", "completed");
        section.classList.remove("nr-step-locked");

        if (i < step) {
            item.classList.add("completed");
        } else if (i === step) {
            item.classList.add("active");
        } else {
            section.classList.add("nr-step-locked");
        }
    }
}

window.handlePatientSearch = async function (query) {
    const resultsEl = document.getElementById("searchResults");
    if (!query || query.length < 2) {
        resultsEl.classList.add("hidden");
        return;
    }

    const patients = await DB.searchPatients(query);
    if (patients.length === 0) {
        resultsEl.innerHTML = `
            <div class="p-4 text-center">
                <p class="text-xs text-gray-400 mb-3">No patient found matching "${query}"</p>
                <button onclick="showAddPatientModal()" class="btn btn-primary btn-sm w-full">
                    ${ICONS.plus} Register New Patient
                </button>
            </div>
        `;
        resultsEl.classList.remove("hidden");
        return;
    }

    resultsEl.innerHTML = patients.map((p) => `
        <div class="nr-search-result-item" onclick="selectPatient('${p.id}')">
            <div>
                <div class="nr-search-result-item__name">${p.name}</div>
                <div class="nr-search-result-item__meta">${p.phone} • ${p.age}Y • ${p.gender}</div>
            </div>
            <div class="nr-search-result-item__add">${ICONS.plus}</div>
        </div>
    `).join("");
    resultsEl.classList.remove("hidden");
};

async function selectPatient(id) {
    const patient = await DB.getPatientById(id);
    if (!patient) return;

    document.getElementById("reportPatient").value = id;
    document.getElementById("patientSearch").value = patient.name;
    document.getElementById("searchResults").classList.add("hidden");

    showToast("Patient selected");
    setStep(2);

    try {
        const lastReport = await DB.getLastReportByPatient(id);
        if (lastReport) {
            const refEl = document.getElementById("reportRefBy");
            if (refEl && !refEl.value) refEl.value = lastReport.referredBy || "Self";

            const banner = document.getElementById("patientLastVisitInfo");
            banner.innerHTML = `
                <div>
                    <p class="nr-muted-title">Suggestion</p>
                    <p>Reuse previous test panels: <strong>${lastReport.selectedTemplates.join(", ")}</strong></p>
                </div>
                <button onclick="reuseLastTests('${lastReport.id}')" class="btn btn-primary btn-sm">Reuse</button>
            `;
            banner.classList.remove("hidden");
        }
    } catch (e) {
        console.warn(e);
    }
}

async function reuseLastTests(reportId) {
    const report = await DB.getReportById(reportId);
    if (report && report.selectedTemplates) {
        selectedTemplates = [...report.selectedTemplates];
        updateSelectedTestCards();
        updateResultsGrid();
        updateSummary();
        setStep(3);
        showToast("Tests reused");
    }
}

function applyPreset(type) {
    const presets = {
        CBC: ["Complete Blood Count (CBC)"],
        LFT: ["Liver Function Test (LFT)"],
        KFT: ["Kidney Function Test (KFT)"],
        SUGAR: ["Blood Sugar"]
    };

    const tests = presets[type] || [];
    tests.forEach((t) => {
        if (!selectedTemplates.includes(t)) selectedTemplates.push(t);
    });

    updateSelectedTestCards();
    updateResultsGrid();
    updateSummary();
    setStep(3);
    showToast(`${type} added`);
}

function toggleTemplate(name) {
    if (selectedTemplates.includes(name)) {
        selectedTemplates = selectedTemplates.filter((t) => t !== name);
    } else {
        selectedTemplates.push(name);
    }
    updateSelectedTestCards();
    updateResultsGrid();
    updateSummary();
    setStep(selectedTemplates.length ? 3 : 2);
}

function removeTemplate(name) {
    selectedTemplates = selectedTemplates.filter((t) => t !== name);
    updateSelectedTestCards();
    updateResultsGrid();
    updateSummary();
    if (selectedTemplates.length === 0) setStep(2);
}

function updateSelectedTestCards() {
    document.querySelectorAll(".nr-test-card").forEach((el) => {
        const name = el.dataset.template;
        if (selectedTemplates.includes(name)) {
            el.classList.add("is-selected");
        } else {
            el.classList.remove("is-selected");
        }
    });
}

function updateResultsGrid(existingData = null) {
    const container = document.getElementById("testResultsGrid");
    if (selectedTemplates.length === 0) {
        container.innerHTML = `
            <div class="nr-empty-state">
                <div class="nr-empty-state__icon">${ICONS.flask}</div>
                <h4>Select diagnostics to begin</h4>
                <p>Pick one or more test panels in Step 2. The result entry terminal will activate automatically.</p>
            </div>
        `;
        return;
    }

    let html = "";
    selectedTemplates.forEach((tName) => {
        const template = TEST_TEMPLATES[tName];
        if (!template) return;

        html += `
            <div class="nr-result-panel slide-up">
                <div class="nr-result-panel__head">
                    <h4>${tName}</h4>
                    <button onclick="removeTemplate('${tName}')">Remove</button>
                </div>
                <table class="nr-results-table">
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Result</th>
                            <th>Unit</th>
                            <th class="hidden-mobile">Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${template.tests.map((test, idx) => {
                            const val = existingData?.[tName]?.[idx]?.value || "";
                            const fieldId = `res_${tName.replace(/\W/g, "")}_${idx}`;
                            return `
                                <tr>
                                    <td>${test.name}</td>
                                    <td>
                                        <input type="text" id="${fieldId}" value="${val}" class="nr-result-input" placeholder="0.00" onkeydown="handleKeyNavigation(event, this)">
                                    </td>
                                    <td>${test.unit}</td>
                                    <td class="hidden-mobile">${getRefRange(test)}</td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
        `;
    });

    container.innerHTML = html;
    const firstInput = container.querySelector("input");
    if (firstInput && !existingData) firstInput.focus();
}

function handleKeyNavigation(e, current) {
    if (e.key === "Enter") {
        e.preventDefault();
        const inputs = Array.from(document.querySelectorAll(".nr-result-input"));
        const idx = inputs.indexOf(current);
        if (idx < inputs.length - 1) {
            inputs[idx + 1].focus();
            inputs[idx + 1].select();
        } else {
            document.getElementById("generateBtn").focus();
        }
    }
}

function updateSummary() {
    const btn = document.getElementById("generateBtn");
    const countEl = document.getElementById("testCountDisplay");
    if (countEl) countEl.textContent = `${selectedTemplates.length} Panel(s)`;
    if (btn) btn.disabled = selectedTemplates.length === 0;
    calculateBilling();
}

function calculateBilling() {
    const subtotal = selectedTemplates.reduce((acc, name) => acc + (TEST_PRICES[name] || 0), 0);
    const total = Math.max(0, subtotal);
    const totalEl = document.getElementById("billTotalDisplay");
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;

    const paidInput = document.getElementById("billingPaid");
    if (paidInput && (paidInput.value === "0" || paidInput.dataset.autoFilled === "true")) {
        paidInput.value = total;
        paidInput.dataset.autoFilled = "true";
    }
}

async function generateAndPreview() {
    const patientId = document.getElementById("reportPatient").value;
    if (!patientId) {
        showToast("Please select a patient first", "error");
        setStep(1);
        document.getElementById("patientSearch").focus();
        return;
    }
    await saveReport("completed", true);
}

let isSavingReport = false;

async function saveReport(status, isGenerating = false) {
    if (isSavingReport) return;

    const patientId = document.getElementById("reportPatient").value;
    const refBy = document.getElementById("reportRefBy").value || "Self";
    const subtotal = selectedTemplates.reduce((acc, name) => acc + (TEST_PRICES[name] || 0), 0);
    const totalDisplay = document.getElementById("billTotalDisplay").textContent;
    const total = parseInt(totalDisplay.replace(/[^\d]/g, ""), 10) || 0;
    const paid = parseInt(document.getElementById("billingPaid").value, 10) || 0;

    if (paid > total) {
        return showToast(`Paid amount cannot exceed total bill (₹${total})`, "error");
    }

    const results = {};
    selectedTemplates.forEach((tName) => {
        const template = TEST_TEMPLATES[tName];
        results[tName] = template.tests.map((test, idx) => {
            const fieldId = `res_${tName.replace(/\W/g, "")}_${idx}`;
            const val = document.getElementById(fieldId).value;
            return { ...test, value: val };
        });
    });

    const reportData = {
        patientId,
        referredBy: refBy,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        sampleType: "Blood",
        selectedTemplates,
        results,
        billing: { subtotal, discount: 0, total, paid },
        status
    };

    try {
        isSavingReport = true;
        const genBtn = document.getElementById("generateBtn");
        if (genBtn) {
            genBtn.disabled = true;
            genBtn.innerHTML = `<div class="btn-loader"></div>Generating...`;
        }

        let reportId;
        if (editingReportId) {
            await DB.updateReport(editingReportId, reportData);
            reportId = editingReportId;
        } else {
            const saved = await DB.addReport(reportData);
            reportId = saved.id;
        }

        if (isGenerating) {
            showToast("Report generated successfully", "success");
            viewReport(reportId);
        } else {
            showToast("Draft saved", "success");
            showPage("reports");
        }
    } catch (e) {
        console.error(e);
        showToast(`Error: ${e.message}`, "error");
    } finally {
        isSavingReport = false;
    }
}
