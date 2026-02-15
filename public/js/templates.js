/**
 * LabDesk - Test Templates Database
 * All blood test templates with reference ranges
 */

const TEST_TEMPLATES = {
    "Complete Blood Count (CBC)": {
        category: "Hematology",
        tier: "basic",
        tests: [
            { name: "Hemoglobin (Hb)", unit: "g/dL", maleMin: 13.0, maleMax: 17.0, femaleMin: 12.0, femaleMax: 15.5, childMin: 11.0, childMax: 14.0 },
            { name: "Total RBC Count", unit: "million/µL", maleMin: 4.5, maleMax: 5.5, femaleMin: 3.8, femaleMax: 4.8, childMin: 4.0, childMax: 5.2 },
            { name: "Total WBC Count", unit: "cells/µL", maleMin: 4000, maleMax: 11000, femaleMin: 4000, femaleMax: 11000, childMin: 5000, childMax: 13000 },
            { name: "Platelet Count", unit: "lakh/µL", maleMin: 1.5, maleMax: 4.0, femaleMin: 1.5, femaleMax: 4.0, childMin: 1.5, childMax: 4.0 },
            { name: "PCV / Hematocrit", unit: "%", maleMin: 40, maleMax: 50, femaleMin: 36, femaleMax: 44, childMin: 35, childMax: 45 },
            { name: "MCV", unit: "fL", maleMin: 83, maleMax: 101, femaleMin: 83, femaleMax: 101, childMin: 70, childMax: 86 },
            { name: "MCH", unit: "pg", maleMin: 27, maleMax: 32, femaleMin: 27, femaleMax: 32, childMin: 23, childMax: 31 },
            { name: "MCHC", unit: "g/dL", maleMin: 31.5, maleMax: 34.5, femaleMin: 31.5, femaleMax: 34.5, childMin: 30, childMax: 36 },
            { name: "RDW-CV", unit: "%", maleMin: 11.6, maleMax: 14.0, femaleMin: 11.6, femaleMax: 14.0, childMin: 11.6, childMax: 14.0 },
            { name: "MPV", unit: "fL", maleMin: 7.5, maleMax: 11.5, femaleMin: 7.5, femaleMax: 11.5, childMin: 7.5, childMax: 11.5 },
            { name: "PDW", unit: "fL", maleMin: 9.0, maleMax: 17.0, femaleMin: 9.0, femaleMax: 17.0, childMin: 9.0, childMax: 17.0 },
            { name: "PCT", unit: "%", maleMin: 0.15, maleMax: 0.40, femaleMin: 0.15, femaleMax: 0.40, childMin: 0.15, childMax: 0.40 }
        ]
    },
    "Differential Leucocyte Count (DLC)": {
        category: "Hematology",
        tier: "basic",
        tests: [
            { name: "Neutrophils", unit: "%", maleMin: 40, maleMax: 70, femaleMin: 40, femaleMax: 70, childMin: 30, childMax: 60 },
            { name: "Lymphocytes", unit: "%", maleMin: 20, maleMax: 40, femaleMin: 20, femaleMax: 40, childMin: 30, childMax: 50 },
            { name: "Monocytes", unit: "%", maleMin: 2, maleMax: 8, femaleMin: 2, femaleMax: 8, childMin: 2, childMax: 8 },
            { name: "Eosinophils", unit: "%", maleMin: 1, maleMax: 4, femaleMin: 1, femaleMax: 4, childMin: 1, childMax: 4 },
            { name: "Basophils", unit: "%", maleMin: 0, maleMax: 1, femaleMin: 0, femaleMax: 1, childMin: 0, childMax: 1 }
        ]
    },
    "ESR": {
        category: "Hematology",
        tier: "basic",
        tests: [
            { name: "ESR (Westergren)", unit: "mm/hr", maleMin: 0, maleMax: 15, femaleMin: 0, femaleMax: 20, childMin: 0, childMax: 10 }
        ]
    },
    "Blood Group & Rh Typing": {
        category: "Hematology",
        tier: "basic",
        tests: [
            { name: "Blood Group (ABO)", unit: "", maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null, type: "select", options: ["A", "B", "AB", "O"] },
            { name: "Rh Factor", unit: "", maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null, type: "select", options: ["Positive", "Negative"] }
        ]
    },
    "Lipid Profile": {
        category: "Biochemistry",
        tier: "standard",
        tests: [
            { name: "Total Cholesterol", unit: "mg/dL", maleMin: 0, maleMax: 200, femaleMin: 0, femaleMax: 200, childMin: 0, childMax: 200 },
            { name: "Triglycerides", unit: "mg/dL", maleMin: 0, maleMax: 150, femaleMin: 0, femaleMax: 150, childMin: 0, childMax: 150 },
            { name: "HDL Cholesterol", unit: "mg/dL", maleMin: 40, maleMax: 60, femaleMin: 50, femaleMax: 60, childMin: 40, childMax: 60 },
            { name: "LDL Cholesterol", unit: "mg/dL", maleMin: 0, maleMax: 100, femaleMin: 0, femaleMax: 100, childMin: 0, childMax: 100 },
            { name: "VLDL Cholesterol", unit: "mg/dL", maleMin: 5, maleMax: 40, femaleMin: 5, femaleMax: 40, childMin: 5, childMax: 40 },
            { name: "Total Cholesterol/HDL Ratio", unit: "", maleMin: 0, maleMax: 5, femaleMin: 0, femaleMax: 5, childMin: 0, childMax: 5 },
            { name: "LDL/HDL Ratio", unit: "", maleMin: 0, maleMax: 3.5, femaleMin: 0, femaleMax: 3.5, childMin: 0, childMax: 3.5 }
        ]
    },
    "Liver Function Test (LFT)": {
        category: "Biochemistry",
        tier: "standard",
        tests: [
            { name: "Total Bilirubin", unit: "mg/dL", maleMin: 0.1, maleMax: 1.2, femaleMin: 0.1, femaleMax: 1.2, childMin: 0.1, childMax: 1.2 },
            { name: "Direct Bilirubin", unit: "mg/dL", maleMin: 0.0, maleMax: 0.3, femaleMin: 0.0, femaleMax: 0.3, childMin: 0.0, childMax: 0.3 },
            { name: "Indirect Bilirubin", unit: "mg/dL", maleMin: 0.1, maleMax: 0.9, femaleMin: 0.1, femaleMax: 0.9, childMin: 0.1, childMax: 0.9 },
            { name: "SGOT (AST)", unit: "U/L", maleMin: 0, maleMax: 40, femaleMin: 0, femaleMax: 32, childMin: 0, childMax: 40 },
            { name: "SGPT (ALT)", unit: "U/L", maleMin: 0, maleMax: 41, femaleMin: 0, femaleMax: 33, childMin: 0, childMax: 41 },
            { name: "Alkaline Phosphatase (ALP)", unit: "U/L", maleMin: 44, maleMax: 147, femaleMin: 44, femaleMax: 147, childMin: 100, childMax: 400 },
            { name: "Gamma GT (GGT)", unit: "U/L", maleMin: 0, maleMax: 55, femaleMin: 0, femaleMax: 38, childMin: 0, childMax: 45 },
            { name: "Total Protein", unit: "g/dL", maleMin: 6.0, maleMax: 8.3, femaleMin: 6.0, femaleMax: 8.3, childMin: 5.5, childMax: 8.0 },
            { name: "Albumin", unit: "g/dL", maleMin: 3.5, maleMax: 5.5, femaleMin: 3.5, femaleMax: 5.5, childMin: 3.5, childMax: 5.5 },
            { name: "Globulin", unit: "g/dL", maleMin: 2.0, maleMax: 3.5, femaleMin: 2.0, femaleMax: 3.5, childMin: 2.0, childMax: 3.5 },
            { name: "A/G Ratio", unit: "", maleMin: 1.0, maleMax: 2.2, femaleMin: 1.0, femaleMax: 2.2, childMin: 1.0, childMax: 2.2 }
        ]
    },
    "Kidney Function Test (KFT/RFT)": {
        category: "Biochemistry",
        tier: "standard",
        tests: [
            { name: "Blood Urea", unit: "mg/dL", maleMin: 15, maleMax: 40, femaleMin: 15, femaleMax: 40, childMin: 10, childMax: 36 },
            { name: "Blood Urea Nitrogen (BUN)", unit: "mg/dL", maleMin: 7, maleMax: 20, femaleMin: 7, femaleMax: 20, childMin: 5, childMax: 18 },
            { name: "Serum Creatinine", unit: "mg/dL", maleMin: 0.7, maleMax: 1.3, femaleMin: 0.6, femaleMax: 1.1, childMin: 0.3, childMax: 0.7 },
            { name: "Uric Acid", unit: "mg/dL", maleMin: 3.5, maleMax: 7.2, femaleMin: 2.6, femaleMax: 6.0, childMin: 2.0, childMax: 5.5 },
            { name: "Serum Sodium", unit: "mEq/L", maleMin: 136, maleMax: 145, femaleMin: 136, femaleMax: 145, childMin: 136, childMax: 145 },
            { name: "Serum Potassium", unit: "mEq/L", maleMin: 3.5, maleMax: 5.1, femaleMin: 3.5, femaleMax: 5.1, childMin: 3.5, childMax: 5.1 },
            { name: "Serum Chloride", unit: "mEq/L", maleMin: 98, maleMax: 106, femaleMin: 98, femaleMax: 106, childMin: 98, childMax: 106 },
            { name: "Serum Calcium", unit: "mg/dL", maleMin: 8.5, maleMax: 10.5, femaleMin: 8.5, femaleMax: 10.5, childMin: 8.5, childMax: 10.5 },
            { name: "Serum Phosphorus", unit: "mg/dL", maleMin: 2.5, maleMax: 4.5, femaleMin: 2.5, femaleMax: 4.5, childMin: 4.0, childMax: 7.0 },
            { name: "eGFR", unit: "mL/min/1.73m²", maleMin: 90, maleMax: 120, femaleMin: 90, femaleMax: 120, childMin: 90, childMax: 120 }
        ]
    },
    "Blood Sugar / Glucose Tests": {
        category: "Biochemistry",
        tier: "standard",
        tests: [
            { name: "Fasting Blood Sugar (FBS)", unit: "mg/dL", maleMin: 70, maleMax: 100, femaleMin: 70, femaleMax: 100, childMin: 60, childMax: 100 },
            { name: "Post Prandial Blood Sugar (PPBS)", unit: "mg/dL", maleMin: 70, maleMax: 140, femaleMin: 70, femaleMax: 140, childMin: 70, childMax: 140 },
            { name: "Random Blood Sugar (RBS)", unit: "mg/dL", maleMin: 70, maleMax: 140, femaleMin: 70, femaleMax: 140, childMin: 70, childMax: 140 },
            { name: "HbA1c (Glycated Hemoglobin)", unit: "%", maleMin: 4.0, maleMax: 5.6, femaleMin: 4.0, femaleMax: 5.6, childMin: 4.0, childMax: 5.6 }
        ]
    },
    "Thyroid Function Test (TFT)": {
        category: "Endocrinology",
        tier: "pro",
        tests: [
            { name: "T3 (Triiodothyronine)", unit: "ng/dL", maleMin: 80, maleMax: 200, femaleMin: 80, femaleMax: 200, childMin: 80, childMax: 200 },
            { name: "T4 (Thyroxine)", unit: "µg/dL", maleMin: 5.1, maleMax: 14.1, femaleMin: 5.1, femaleMax: 14.1, childMin: 5.1, childMax: 14.1 },
            { name: "TSH", unit: "µIU/mL", maleMin: 0.27, maleMax: 4.20, femaleMin: 0.27, femaleMax: 4.20, childMin: 0.27, childMax: 4.20 },
            { name: "Free T3 (FT3)", unit: "pg/mL", maleMin: 2.0, maleMax: 4.4, femaleMin: 2.0, femaleMax: 4.4, childMin: 2.0, childMax: 4.4 },
            { name: "Free T4 (FT4)", unit: "ng/dL", maleMin: 0.93, maleMax: 1.70, femaleMin: 0.93, femaleMax: 1.70, childMin: 0.93, childMax: 1.70 }
        ]
    },
    "Urine Routine & Microscopy": {
        category: "Clinical Pathology",
        tier: "basic",
        tests: [
            { name: "Color", unit: "", type: "select", options: ["Pale Yellow", "Yellow", "Dark Yellow", "Amber", "Red", "Brown", "Colorless"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Appearance", unit: "", type: "select", options: ["Clear", "Slightly Turbid", "Turbid", "Hazy"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Specific Gravity", unit: "", maleMin: 1.005, maleMax: 1.030, femaleMin: 1.005, femaleMax: 1.030, childMin: 1.005, childMax: 1.030 },
            { name: "pH", unit: "", maleMin: 4.6, maleMax: 8.0, femaleMin: 4.6, femaleMax: 8.0, childMin: 4.6, childMax: 8.0 },
            { name: "Protein/Albumin", unit: "", type: "select", options: ["Nil", "Trace", "+1", "+2", "+3", "+4"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Glucose/Sugar", unit: "", type: "select", options: ["Nil", "Trace", "+1", "+2", "+3", "+4"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Ketone Bodies", unit: "", type: "select", options: ["Nil", "Trace", "+1", "+2", "+3"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Bile Salts", unit: "", type: "select", options: ["Absent", "Present"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Bile Pigments", unit: "", type: "select", options: ["Absent", "Present"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Urobilinogen", unit: "", type: "select", options: ["Normal", "Increased", "Decreased"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Blood/Hemoglobin", unit: "", type: "select", options: ["Nil", "Trace", "+1", "+2", "+3"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Nitrite", unit: "", type: "select", options: ["Negative", "Positive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "RBC", unit: "/hpf", maleMin: 0, maleMax: 2, femaleMin: 0, femaleMax: 2, childMin: 0, childMax: 2 },
            { name: "Pus Cells (WBC)", unit: "/hpf", maleMin: 0, maleMax: 5, femaleMin: 0, femaleMax: 5, childMin: 0, childMax: 5 },
            { name: "Epithelial Cells", unit: "/hpf", type: "select", options: ["Few", "Moderate", "Many", "Absent"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Casts", unit: "", type: "select", options: ["Nil", "Hyaline", "Granular", "RBC Casts", "WBC Casts"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Crystals", unit: "", type: "select", options: ["Nil", "Calcium Oxalate", "Uric Acid", "Triple Phosphate", "Amorphous"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Bacteria", unit: "", type: "select", options: ["Absent", "Few", "Moderate", "Many"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "Coagulation Profile": {
        category: "Hematology",
        tier: "standard",
        tests: [
            { name: "Prothrombin Time (PT)", unit: "seconds", maleMin: 11, maleMax: 13.5, femaleMin: 11, femaleMax: 13.5, childMin: 11, childMax: 13.5 },
            { name: "INR", unit: "", maleMin: 0.8, maleMax: 1.1, femaleMin: 0.8, femaleMax: 1.1, childMin: 0.8, childMax: 1.1 },
            { name: "aPTT", unit: "seconds", maleMin: 25, maleMax: 35, femaleMin: 25, femaleMax: 35, childMin: 25, childMax: 35 },
            { name: "Bleeding Time", unit: "minutes", maleMin: 1, maleMax: 6, femaleMin: 1, femaleMax: 6, childMin: 1, childMax: 6 },
            { name: "Clotting Time", unit: "minutes", maleMin: 4, maleMax: 9, femaleMin: 4, femaleMax: 9, childMin: 4, childMax: 9 },
            { name: "D-Dimer", unit: "ng/mL", maleMin: 0, maleMax: 500, femaleMin: 0, femaleMax: 500, childMin: 0, childMax: 500 }
        ]
    },
    "Iron Studies": {
        category: "Biochemistry",
        tier: "standard",
        tests: [
            { name: "Serum Iron", unit: "µg/dL", maleMin: 65, maleMax: 175, femaleMin: 50, femaleMax: 170, childMin: 50, childMax: 120 },
            { name: "TIBC", unit: "µg/dL", maleMin: 250, maleMax: 370, femaleMin: 250, femaleMax: 370, childMin: 250, childMax: 370 },
            { name: "Transferrin Saturation", unit: "%", maleMin: 20, maleMax: 50, femaleMin: 15, femaleMax: 50, childMin: 20, childMax: 50 },
            { name: "Serum Ferritin", unit: "ng/mL", maleMin: 20, maleMax: 250, femaleMin: 10, femaleMax: 120, childMin: 7, childMax: 140 }
        ]
    },
    "Vitamin Profile": {
        category: "Biochemistry",
        tier: "standard",
        tests: [
            { name: "Vitamin D (25-OH)", unit: "ng/mL", maleMin: 30, maleMax: 100, femaleMin: 30, femaleMax: 100, childMin: 30, childMax: 100 },
            { name: "Vitamin B12", unit: "pg/mL", maleMin: 211, maleMax: 946, femaleMin: 211, femaleMax: 946, childMin: 211, childMax: 946 },
            { name: "Folic Acid", unit: "ng/mL", maleMin: 3.89, maleMax: 26.8, femaleMin: 3.89, femaleMax: 26.8, childMin: 3.89, childMax: 26.8 }
        ]
    },
    "C-Reactive Protein (CRP)": {
        category: "Immunology",
        tier: "pro",
        tests: [
            { name: "CRP (Quantitative)", unit: "mg/L", maleMin: 0, maleMax: 6, femaleMin: 0, femaleMax: 6, childMin: 0, childMax: 6 },
            { name: "hs-CRP", unit: "mg/L", maleMin: 0, maleMax: 3, femaleMin: 0, femaleMax: 3, childMin: 0, childMax: 3 }
        ]
    },
    "Rheumatoid Factor (RA Factor)": {
        category: "Immunology",
        tier: "pro",
        tests: [
            { name: "RA Factor (Quantitative)", unit: "IU/mL", maleMin: 0, maleMax: 14, femaleMin: 0, femaleMax: 14, childMin: 0, childMax: 14 },
            { name: "Anti-CCP Antibody", unit: "U/mL", maleMin: 0, maleMax: 17, femaleMin: 0, femaleMax: 17, childMin: 0, childMax: 17 }
        ]
    },
    "ASO Titre": {
        category: "Immunology",
        tier: "pro",
        tests: [
            { name: "ASO Titre (Quantitative)", unit: "IU/mL", maleMin: 0, maleMax: 200, femaleMin: 0, femaleMax: 200, childMin: 0, childMax: 200 }
        ]
    },
    "Widal Test": {
        category: "Serology",
        tier: "pro",
        tests: [
            { name: "S. Typhi O", unit: "", type: "select", options: ["Negative", "1:20", "1:40", "1:80", "1:160", "1:320"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "S. Typhi H", unit: "", type: "select", options: ["Negative", "1:20", "1:40", "1:80", "1:160", "1:320"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "S. Paratyphi AH", unit: "", type: "select", options: ["Negative", "1:20", "1:40", "1:80", "1:160", "1:320"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "S. Paratyphi BH", unit: "", type: "select", options: ["Negative", "1:20", "1:40", "1:80", "1:160", "1:320"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "Dengue Serology": {
        category: "Serology",
        tier: "pro",
        tests: [
            { name: "Dengue NS1 Antigen", unit: "", type: "select", options: ["Negative", "Positive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Dengue IgM Antibody", unit: "", type: "select", options: ["Negative", "Positive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Dengue IgG Antibody", unit: "", type: "select", options: ["Negative", "Positive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "Malaria Panel": {
        category: "Serology",
        tier: "pro",
        tests: [
            { name: "Malaria Parasite (MP) - Smear", unit: "", type: "select", options: ["Not Detected", "P. vivax Detected", "P. falciparum Detected", "Mixed Infection"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Malaria Antigen (Rapid)", unit: "", type: "select", options: ["Negative", "P. vivax Positive", "P. falciparum Positive", "Mixed Positive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "HIV Screening": {
        category: "Serology",
        tier: "pro",
        tests: [
            { name: "HIV I & II Antibodies", unit: "", type: "select", options: ["Non-Reactive", "Reactive", "Indeterminate"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "HBsAg (Hepatitis B)": {
        category: "Serology",
        tier: "pro",
        tests: [
            { name: "HBsAg", unit: "", type: "select", options: ["Non-Reactive", "Reactive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "HCV (Hepatitis C)": {
        category: "Serology",
        tier: "pro",
        tests: [
            { name: "Anti-HCV Antibody", unit: "", type: "select", options: ["Non-Reactive", "Reactive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "Serum Electrolytes": {
        category: "Biochemistry",
        tier: "pro",
        tests: [
            { name: "Sodium (Na+)", unit: "mEq/L", maleMin: 136, maleMax: 145, femaleMin: 136, femaleMax: 145, childMin: 136, childMax: 145 },
            { name: "Potassium (K+)", unit: "mEq/L", maleMin: 3.5, maleMax: 5.1, femaleMin: 3.5, femaleMax: 5.1, childMin: 3.5, childMax: 5.1 },
            { name: "Chloride (Cl-)", unit: "mEq/L", maleMin: 98, maleMax: 106, femaleMin: 98, femaleMax: 106, childMin: 98, childMax: 106 },
            { name: "Bicarbonate (HCO3)", unit: "mEq/L", maleMin: 22, maleMax: 28, femaleMin: 22, femaleMax: 28, childMin: 22, childMax: 28 }
        ]
    },
    "Pancreatic Function": {
        category: "Biochemistry",
        tier: "premium",
        tests: [
            { name: "Serum Amylase", unit: "U/L", maleMin: 28, maleMax: 100, femaleMin: 28, femaleMax: 100, childMin: 28, childMax: 100 },
            { name: "Serum Lipase", unit: "U/L", maleMin: 0, maleMax: 160, femaleMin: 0, femaleMax: 160, childMin: 0, childMax: 160 }
        ]
    },
    "Cardiac Markers": {
        category: "Biochemistry",
        tier: "premium",
        tests: [
            { name: "Troponin I", unit: "ng/mL", maleMin: 0, maleMax: 0.04, femaleMin: 0, femaleMax: 0.04, childMin: 0, childMax: 0.04 },
            { name: "CK-MB", unit: "U/L", maleMin: 0, maleMax: 25, femaleMin: 0, femaleMax: 25, childMin: 0, childMax: 25 },
            { name: "LDH", unit: "U/L", maleMin: 140, maleMax: 280, femaleMin: 140, femaleMax: 280, childMin: 140, childMax: 280 },
            { name: "CPK (Total)", unit: "U/L", maleMin: 39, maleMax: 308, femaleMin: 26, femaleMax: 192, childMin: 26, childMax: 192 },
            { name: "NT-proBNP", unit: "pg/mL", maleMin: 0, maleMax: 125, femaleMin: 0, femaleMax: 125, childMin: 0, childMax: 125 }
        ]
    },
    "Hormone Panel (Female)": {
        category: "Endocrinology",
        tier: "premium",
        tests: [
            { name: "FSH", unit: "mIU/mL", maleMin: 1.5, maleMax: 12.4, femaleMin: 3.5, femaleMax: 12.5, childMin: 0, childMax: 10 },
            { name: "LH", unit: "mIU/mL", maleMin: 1.7, maleMax: 8.6, femaleMin: 2.4, femaleMax: 12.6, childMin: 0, childMax: 10 },
            { name: "Prolactin", unit: "ng/mL", maleMin: 4.0, maleMax: 15.2, femaleMin: 4.8, femaleMax: 23.3, childMin: 0, childMax: 20 },
            { name: "Estradiol (E2)", unit: "pg/mL", maleMin: 11, maleMax: 44, femaleMin: 12.5, femaleMax: 166, childMin: 0, childMax: 20 },
            { name: "Progesterone", unit: "ng/mL", maleMin: 0.2, maleMax: 1.4, femaleMin: 0.2, femaleMax: 25.0, childMin: 0, childMax: 1 },
            { name: "Testosterone (Total)", unit: "ng/dL", maleMin: 270, maleMax: 1070, femaleMin: 15, femaleMax: 70, childMin: 0, childMax: 20 },
            { name: "DHEA-S", unit: "µg/dL", maleMin: 80, maleMax: 560, femaleMin: 35, femaleMax: 430, childMin: 0, childMax: 200 },
            { name: "AMH", unit: "ng/mL", maleMin: 0, maleMax: 0, femaleMin: 1.0, femaleMax: 3.5, childMin: 0, childMax: 0 }
        ]
    },
    "Diabetes Panel (Advanced)": {
        category: "Biochemistry",
        tier: "premium",
        tests: [
            { name: "Fasting Blood Sugar", unit: "mg/dL", maleMin: 70, maleMax: 100, femaleMin: 70, femaleMax: 100, childMin: 60, childMax: 100 },
            { name: "Post Prandial Blood Sugar", unit: "mg/dL", maleMin: 70, maleMax: 140, femaleMin: 70, femaleMax: 140, childMin: 70, childMax: 140 },
            { name: "HbA1c", unit: "%", maleMin: 4.0, maleMax: 5.6, femaleMin: 4.0, femaleMax: 5.6, childMin: 4.0, childMax: 5.6 },
            { name: "Fasting Insulin", unit: "µIU/mL", maleMin: 2.6, maleMax: 24.9, femaleMin: 2.6, femaleMax: 24.9, childMin: 2.6, childMax: 24.9 },
            { name: "HOMA-IR", unit: "", maleMin: 0, maleMax: 2.5, femaleMin: 0, femaleMax: 2.5, childMin: 0, childMax: 2.5 },
            { name: "C-Peptide", unit: "ng/mL", maleMin: 1.1, maleMax: 4.4, femaleMin: 1.1, femaleMax: 4.4, childMin: 1.1, childMax: 4.4 }
        ]
    },
    "Stool Routine & Microscopy": {
        category: "Clinical Pathology",
        tier: "basic",
        tests: [
            { name: "Color", unit: "", type: "select", options: ["Brown", "Yellow", "Green", "Black", "Red", "Clay/White", "Dark Brown"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Consistency", unit: "", type: "select", options: ["Formed", "Semi-formed", "Loose", "Watery", "Hard", "Mucoid"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Mucus", unit: "", type: "select", options: ["Absent", "Present"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Blood (Occult)", unit: "", type: "select", options: ["Negative", "Positive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Ova/Parasites", unit: "", type: "select", options: ["Not Seen", "Seen"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "RBC", unit: "/hpf", type: "select", options: ["Nil", "Few", "Moderate", "Many"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Pus Cells", unit: "/hpf", type: "select", options: ["Nil", "Few", "Moderate", "Many"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Reducing Substances", unit: "", type: "select", options: ["Absent", "Present"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "Semen Analysis": {
        category: "Clinical Pathology",
        tier: "premium",
        tests: [
            { name: "Volume", unit: "mL", maleMin: 1.5, maleMax: 5.0, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Color", unit: "", type: "select", options: ["Grey-Opalescent", "White", "Yellow", "Brown"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Liquefaction Time", unit: "minutes", maleMin: 0, maleMax: 30, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "pH", unit: "", maleMin: 7.2, maleMax: 8.0, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Sperm Count", unit: "million/mL", maleMin: 15, maleMax: 200, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Total Motility", unit: "%", maleMin: 40, maleMax: 100, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Progressive Motility", unit: "%", maleMin: 32, maleMax: 100, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Normal Morphology", unit: "%", maleMin: 4, maleMax: 100, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Pus Cells", unit: "/hpf", maleMin: 0, maleMax: 5, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "Peripheral Blood Smear": {
        category: "Hematology",
        tier: "premium",
        tests: [
            { name: "RBC Morphology", unit: "", type: "select", options: ["Normocytic Normochromic", "Microcytic Hypochromic", "Macrocytic", "Dimorphic", "Anisocytosis", "Poikilocytosis"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "WBC Morphology", unit: "", type: "select", options: ["Normal", "Shift to Left", "Toxic Granulation", "Atypical Lymphocytes"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Platelet Morphology", unit: "", type: "select", options: ["Adequate", "Reduced", "Increased", "Giant Platelets"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Malarial Parasite", unit: "", type: "select", options: ["Not Seen", "P. vivax Seen", "P. falciparum Seen"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Impression", unit: "", type: "text", maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "Pregnancy Test": {
        category: "Clinical Pathology",
        tier: "premium",
        tests: [
            { name: "Urine Pregnancy Test (UPT)", unit: "", type: "select", options: ["Negative", "Positive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Serum Beta-hCG", unit: "mIU/mL", maleMin: 0, maleMax: 5, femaleMin: 0, femaleMax: 5, childMin: 0, childMax: 5 }
        ]
    },
    "Tumor Markers": {
        category: "Biochemistry",
        tier: "premium",
        tests: [
            { name: "PSA (Total)", unit: "ng/mL", maleMin: 0, maleMax: 4, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "CA-125", unit: "U/mL", maleMin: 0, maleMax: 35, femaleMin: 0, femaleMax: 35, childMin: 0, childMax: 35 },
            { name: "CEA", unit: "ng/mL", maleMin: 0, maleMax: 5, femaleMin: 0, femaleMax: 5, childMin: 0, childMax: 5 },
            { name: "CA 19-9", unit: "U/mL", maleMin: 0, maleMax: 37, femaleMin: 0, femaleMax: 37, childMin: 0, childMax: 37 },
            { name: "AFP", unit: "ng/mL", maleMin: 0, maleMax: 10, femaleMin: 0, femaleMax: 10, childMin: 0, childMax: 10 },
            { name: "Beta HCG", unit: "mIU/mL", maleMin: 0, maleMax: 5, femaleMin: 0, femaleMax: 5, childMin: 0, childMax: 5 }
        ]
    },
    "Typhidot (Rapid)": {
        category: "Serology",
        tier: "premium",
        tests: [
            { name: "Salmonella Typhi IgM", unit: "", type: "select", options: ["Negative", "Positive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Salmonella Typhi IgG", unit: "", type: "select", options: ["Negative", "Positive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "Urine Culture & Sensitivity": {
        category: "Microbiology",
        tier: "premium",
        tests: [
            { name: "Organism Isolated", unit: "", type: "text", maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Colony Count", unit: "CFU/mL", type: "text", maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "Antibiotic Sensitivity", unit: "", type: "textarea", maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "Viral Markers Profile": {
        category: "Serology",
        tier: "premium",
        tests: [
            { name: "HBsAg", unit: "", type: "select", options: ["Non-Reactive", "Reactive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "HIV I & II", unit: "", type: "select", options: ["Non-Reactive", "Reactive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "HCV", unit: "", type: "select", options: ["Non-Reactive", "Reactive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null },
            { name: "VDRL", unit: "", type: "select", options: ["Non-Reactive", "Reactive"], maleMin: null, maleMax: null, femaleMin: null, femaleMax: null, childMin: null, childMax: null }
        ]
    },
    "Arthritis Profile": {
        category: "Immunology",
        tier: "premium",
        tests: [
            { name: "RA Factor", unit: "IU/mL", maleMin: 0, maleMax: 14, femaleMin: 0, femaleMax: 14, childMin: 0, childMax: 14 },
            { name: "CRP", unit: "mg/L", maleMin: 0, maleMax: 6, femaleMin: 0, femaleMax: 6, childMin: 0, childMax: 6 },
            { name: "Uric Acid", unit: "mg/dL", maleMin: 3.5, maleMax: 7.2, femaleMin: 2.6, femaleMax: 6.0, childMin: 2.0, childMax: 5.5 },
            { name: "Calcium", unit: "mg/dL", maleMin: 8.5, maleMax: 10.5, femaleMin: 8.5, femaleMax: 10.5, childMin: 8.5, childMax: 10.5 },
            { name: "Alkaline Phosphatase", unit: "U/L", maleMin: 44, maleMax: 147, femaleMin: 44, femaleMax: 147, childMin: 100, childMax: 400 },
            { name: "ESR", unit: "mm/hr", maleMin: 0, maleMax: 15, femaleMin: 0, femaleMax: 20, childMin: 0, childMax: 10 }
        ]
    }
};

/**
 * Get categories from templates
 */
function getTemplateCategories() {
    const categories = {};
    Object.entries(TEST_TEMPLATES).forEach(([name, template]) => {
        if (!categories[template.category]) categories[template.category] = [];
        categories[template.category].push(name);
    });
    return categories;
}

/**
 * Get tier level for comparison
 */
function getTierLevel(tier) {
    const levels = { 'basic': 1, 'standard': 2, 'pro': 3, 'premium': 4 };
    return levels[tier] || 0;
}

/**
 * Render Templates with Locking Logic
 */
async function renderTemplates() {
    const container = document.getElementById('pageContainer');
    container.innerHTML = '<div class="page-loader"><div class="loader-spinner"></div></div>';

    const categories = getTemplateCategories();

    // Get User Subscription
    let userTier = 'basic'; // Default to basic if no sub (or handled by app.js redirect)
    try {
        const sub = await DB.getSubscription();
        if (sub && sub.status === 'active') {
            userTier = sub.tier || 'basic';
            // Weekly plan gets everything
            if (sub.plan === 'weekly') userTier = 'premium';
        }
    } catch (e) { console.error('Error fetching sub for templates', e); }

    const userLevel = getTierLevel(userTier);

    let html = `
        <div class="space-y-6 fade-in">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Test Templates</h2>
                    <p class="text-gray-500 text-sm">Select a template to generate a report</p>
                </div>
            </div>
            
            <div class="grid grid-3 gap-6">
    `;

    Object.entries(categories).forEach(([category, templates]) => {
        html += `
            <div class="card" style="padding:0;">
                <div class="p-4 border-b bg-gray-50 rounded-t-lg">
                    <h3 class="font-bold text-gray-700">${category}</h3>
                </div>
                <div class="divide-y">
        `;

        templates.forEach(templateName => {
            const template = TEST_TEMPLATES[templateName];
            const requiredTier = template.tier || 'basic';
            const isLocked = getTierLevel(requiredTier) > userLevel;

            if (isLocked) {
                html += `
                    <div class="p-4 flex items-center justify-between bg-gray-50 opacity-75 cursor-not-allowed" title="Available in ${requiredTier.toUpperCase()} Plan">
                        <div class="flex items-center gap-3">
                            <span class="text-gray-500">${templateName}</span>
                            <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-500">${requiredTier}</span>
                        </div>
                        <span class="text-gray-400">${ICONS.lock}</span>
                    </div>
                `;
            } else {
                html += `
                    <button onclick="useTemplate('${templateName}')" class="w-full text-left p-4 hover:bg-indigo-50 transition-colors flex items-center justify-between group">
                        <span class="text-gray-700 group-hover:text-primary">${templateName}</span>
                        <span class="text-gray-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            ${ICONS.chevronRight}
                        </span>
                    </button>
                `;
            }
        });

        html += `
                </div>
            </div>
        `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}

/**
 * Use Template (Open Report Form)
 */
function useTemplate(templateName) {
    // Logic to open report form with template data
    // This usually redirects to report creation page or opens modal
    // For now, let's assume it navigates to 'create-report' or similar
    // Since original code didn't have this fully visible, I'll simulate navigation
    console.log('Using template:', templateName);
    // Ideally: showPage('create-report', { template: templateName });
    // But we'll just show a toast for now as placeholder if actual logic isn't in view
    showToast(`Selected template: ${templateName}`);
}

/**
 * Get template stats
 */
function getTemplateStats() {
    const categories = getTemplateCategories();
    const totalPanels = Object.keys(TEST_TEMPLATES).length;
    const totalParams = Object.values(TEST_TEMPLATES).reduce((a, b) => a + b.tests.length, 0);
    const totalCategories = Object.keys(categories).length;
    return { totalPanels, totalParams, totalCategories, categories };
}
