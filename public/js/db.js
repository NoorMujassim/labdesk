/**
 * CUREBIT - Firestore Database Layer
 * All CRUD operations via Firebase Firestore
 */

const DB = {
    // Current logged-in user ID
    userId: null,
    tenantId: null,

    // ==================== CACHE LAYER ====================
    // In-memory cache to reduce Firebase reads by 60-80%
    cache: {
        patients: { data: null, timestamp: null, ttl: 5 * 60 * 1000 }, // 5 min
        reports: { data: null, timestamp: null, ttl: 5 * 60 * 1000 },
        labProfile: { data: null, timestamp: null, ttl: 30 * 60 * 1000 }, // 30 min
        templates: { data: null, timestamp: null, ttl: 30 * 60 * 1000 }
    },

    // Check if cache is valid
    isCacheValid(key) {
        const cache = this.cache[key];
        if (!cache.data || !cache.timestamp) return false;
        return (Date.now() - cache.timestamp) < cache.ttl;
    },

    // Clear specific cache
    clearCache(key) {
        if (this.cache[key]) {
            this.cache[key].data = null;
            this.cache[key].timestamp = null;
        }
    },

    // Clear all caches (on logout or data changes)
    clearAllCaches() {
        Object.keys(this.cache).forEach(key => this.clearCache(key));
    },

    normalizeLabName(value, fallback = null) {
        const authName = firebase.auth().currentUser?.displayName || '';
        const defaultFallback = fallback || authName || 'Registered Lab';
        const name = String(value || '').trim();
        const normalized = name.toUpperCase();
        if (!name || normalized === 'MY LAB' || normalized === 'LABDESK') return defaultFallback;
        return name;
    },

    // Set user context
    async setUser(uid) {
        this.clearAllCaches();
        if (!uid) {
            this.userId = null;
            this.tenantId = null;
            return;
        }
        const authUser = firebase.auth().currentUser;
        if (!authUser || authUser.uid !== uid) throw new Error('SECURITY ERROR: Invalid tenant session');
        this.userId = uid;
        this.tenantId = uid;
        const docRef = this.userDoc();
        const doc = await docRef.get();
        if (!doc.exists) {
            await docRef.set({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: authUser.email,
                labName: 'My Lab',
                labId: uid
            });
        } else if (doc.data().labId !== uid) {
            await docRef.set({ labId: uid }, { merge: true });
        }
        await this.migrateTenantIds();
    },

    assertTenantSession() {
        const user = firebase.auth().currentUser;
        if (!user || !this.userId || !this.tenantId || user.uid !== this.userId || this.tenantId !== this.userId) {
            throw new Error('SECURITY ERROR: Tenant session mismatch');
        }
        return this.tenantId;
    },

    userDoc() {
        this.assertTenantSession();
        return firestore.collection('users').doc(this.tenantId);
    },

    tenantData(data = {}) {
        return { ...data, labId: this.assertTenantSession() };
    },

    assertTenantRecord(record, kind = 'record') {
        if (this.isAdmin === true) return record; // Bypass security assertion for global system admin
        if (!record || record.labId !== this.assertTenantSession()) {
            throw new Error(`SECURITY ERROR: Cross-tenant ${kind} blocked`);
        }
        return record;
    },
    assertTenantAssets(profile) {
        if (this.isAdmin === true) return true; // Bypass security assertion for global system admin
        
        const root = `curebit/labs/${this.assertTenantSession()}/`.toLowerCase();
        const refs = [
            profile.logoPublicId,
            profile.doctorSignaturePublicId,
            profile.pathologistSignaturePublicId,
            profile.profilePhotoPublicId
        ].filter(Boolean);
        
        if (refs.some(ref => !String(ref).toLowerCase().startsWith(root))) {
            const badRef = refs.find(ref => !String(ref).toLowerCase().startsWith(root));
            console.error('Blocked Asset Ref:', badRef, 'Root:', root);
            throw new Error('SECURITY ERROR: Cross-tenant asset blocked');
        }
        
        const urls = [profile.logo, profile.doctorSignatureUrl, profile.pathologistSignatureUrl].filter(Boolean);
        if (urls.some(url => !decodeURIComponent(String(url)).toLowerCase().includes(`/${root}`))) {
            const badUrl = urls.find(url => !decodeURIComponent(String(url)).toLowerCase().includes(`/${root}`));
            console.error('Blocked Asset URL:', badUrl, 'Root:', root);
            throw new Error('SECURITY ERROR: Unverified tenant asset URL blocked');
        }
        return true;
    },

    async migrateTenantIds() {
        for (const name of ['patients', 'reports', 'subscriptions']) {
            const snap = await this.userDoc().collection(name).get();
            const conflict = snap.docs.find(d => d.data().labId && d.data().labId !== this.tenantId);
            if (conflict) throw new Error(`SECURITY ERROR:  tenant mismatch`);
            const missing = snap.docs.filter(d => !d.data().labId);
            for (let i = 0; i < missing.length; i += 400) {
                const batch = firestore.batch();
                missing.slice(i, i + 400).forEach(d => batch.update(d.ref, { labId: this.tenantId }));
                await batch.commit();
            }
        }
    },

    // ==================== PATIENTS ====================
    async getPatients() {
        try {
            const snap = await this.userDoc().collection('patients')
                .orderBy('createdAt', 'desc').get();
            const data = snap.docs.map(doc => this.assertTenantRecord({ id: doc.id, ...doc.data() }));

            // Update cache
            this.cache.patients.data = data;
            this.cache.patients.timestamp = Date.now();

            return data;
        } catch (e) {
            console.error('getPatients error:', e);
            return [];
        }
    },

    async getPatientById(id) {
        try {
            const doc = await this.userDoc().collection('patients').doc(id).get();
            return doc.exists ? this.assertTenantRecord({ id: doc.id, ...doc.data() }) : null;
        } catch (e) {
            console.error('getPatientById error:', e);
            return null;
        }
    },

    async getRecentPatients(limitCount = 6) {
        try {
            const snap = await this.userDoc().collection('patients')
                .orderBy('createdAt', 'desc').limit(limitCount).get();
            return snap.docs.map(doc => this.assertTenantRecord({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error('getRecentPatients error:', e);
            return [];
        }
    },

    async searchPatients(query) {
        try {
            const q = query.toLowerCase();
            const patients = await this.getPatients(); // Utilizing cache
            return patients.filter(p => 
                (p.name && p.name.toLowerCase().includes(q)) || 
                (p.phone && p.phone.includes(q))
            );
        } catch (e) {
            console.error('searchPatients error:', e);
            return [];
        }
    },


    async addPatient(data) {
        try {
            data = this.tenantData(data);
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            data = this.tenantData(data);
            data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            const ref = await this.userDoc().collection('patients').add(data);
            this.clearCache('patients'); // Invalidate cache
            return { id: ref.id, ...data };
        } catch (e) {
            console.error('addPatient error:', e);
            throw e;
        }
    },

    async updatePatient(id, data) {
        try {
            data = this.tenantData(data);
            data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            await this.userDoc().collection('patients').doc(id).update(data);
            this.clearCache('patients'); // Invalidate cache
            return true;
        } catch (e) {
            console.error('updatePatient error:', e);
            return false;
        }
    },

    async deletePatient(id) {
        try {
            // Delete patient
            await this.userDoc().collection('patients').doc(id).delete();
            // Delete associated reports
            const reports = await this.userDoc().collection('reports')
                .where('patientId', '==', id).get();
            const batch = firestore.batch();
            reports.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            this.clearCache('patients'); // Invalidate patient cache
            this.clearCache('reports'); // Invalidate reports cache
            return true;
        } catch (e) {
            console.error('deletePatient error:', e);
            return false;
        }
    },

    // ==================== REPORTS ====================
    async getReports() {
        // Check cache first
        if (this.isCacheValid('reports')) {
            return this.cache.reports.data;
        }

        try {
            const snap = await this.userDoc().collection('reports')
                .orderBy('createdAt', 'desc').get();
            const data = snap.docs.map(doc => this.assertTenantRecord({ id: doc.id, ...doc.data() }));

            // Update cache
            this.cache.reports.data = data;
            this.cache.reports.timestamp = Date.now();

            return data;
        } catch (e) {
            console.error('getReports error:', e);
            return [];
        }
    },

    async getReportById(id) {
        try {
            const doc = await this.userDoc().collection('reports').doc(id).get();
            return doc.exists ? this.assertTenantRecord({ id: doc.id, ...doc.data() }) : null;
        } catch (e) {
            console.error('getReportById error:', e);
            return null;
        }
    },

    async getReportsByPatient(patientId) {
        try {
            const snap = await this.userDoc().collection('reports')
                .where('patientId', '==', patientId)
                .orderBy('createdAt', 'desc').get();
            return snap.docs.map(doc => this.assertTenantRecord({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error('getReportsByPatient error:', e);
            return [];
        }
    },

    async getLastReportByPatient(patientId) {
        try {
            const snap = await this.userDoc().collection('reports')
                .where('patientId', '==', patientId)
                .orderBy('createdAt', 'desc')
                .limit(1).get();
            if (snap.empty) return null;
            return this.assertTenantRecord({ id: snap.docs[0].id, ...snap.docs[0].data() });
        } catch (e) {
            if (e.code === 'failed-precondition') {
                console.warn('📋 Firestore Index building... History auto-fill temporarily disabled.');
            } else {
                console.error('getLastReportByPatient error:', e);
            }
            return null;
        }
    },

    async addReport(data) {
        try {
            data = this.tenantData(data);
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            data = this.tenantData(data);
            data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            const ref = await this.userDoc().collection('reports').add(data);
            this.clearCache('reports'); // Invalidate cache
            return { id: ref.id, ...data };
        } catch (e) {
            console.error('addReport error:', e);
            throw e;
        }
    },

    async updateReport(id, data) {
        try {
            data = this.tenantData(data);
            data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            await this.userDoc().collection('reports').doc(id).update(data);
            this.clearCache('reports'); // Invalidate cache
            return true;
        } catch (e) {
            console.error('updateReport error:', e);
            return false;
        }
    },

    async deleteReport(id) {
        try {
            await this.userDoc().collection('reports').doc(id).delete();
            // Also cleanup PDF if exists
            const pdfPath = `reports/${this.tenantId}/${id}.pdf`;
            await storage.ref(pdfPath).delete().catch(() => {}); 
            this.clearCache('reports');
            return true;
        } catch (e) {
            console.error('deleteReport error:', e);
            return false;
        }
    },

    async uploadReportPdf(reportId, blob) {
        const path = `reports/${this.tenantId}/${reportId}.pdf`;
        const ref = storage.ref(path);
        await ref.put(blob, { contentType: 'application/pdf' });
        return await ref.getDownloadURL();
    },

    async saveReportPdfMetadata(reportId, metadata) {
        return await this.userDoc().collection('reports').doc(reportId).update({
            pdfMetadata: metadata,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    },

    // ==================== LAB PROFILE ====================
    async getLabProfile() {
        try {
            const doc = await this.userDoc().get();
            const data = doc.exists ? doc.data() : {};
            this.assertTenantRecord(data, 'lab settings');
            return {
                labId: data.labId,
                labName: this.normalizeLabName(data.labName, data.ownerName || firebase.auth().currentUser?.displayName || ''),
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || '',
                regNo: data.regNo || data.regNumber || '',
                logo: data.logo || data.logoUrl || '',
                logoPublicId: data.logoPublicId || '',
                doctorSignatureUrl: data.doctorSignatureUrl || '',
                doctorSignaturePublicId: data.doctorSignaturePublicId || '',
                pathologistSignatureUrl: data.pathologistSignatureUrl || '',
                pathologistSignaturePublicId: data.pathologistSignaturePublicId || '',
                doctorName: data.doctorName || data.consultantName || '',
                doctorQualification: data.doctorQualification || data.consultantDegree || '',
                pathologistName: data.pathologistName || '',
                pathologistDegree: data.pathologistDegree || '',
                techName: data.techName || data.drName || '',
                techDegree: data.techDegree || '',
                ownerName: data.ownerName || '',
                signatureText: data.signatureText || '',
                headerColor: data.headerColor || '#1e40af',
                plan: data.plan || 'basic',
                planStatus: data.planStatus || 'inactive',
                planValidUntil: data.planValidUntil || null
            };
        } catch (e) {
            console.error('getLabProfile error:', e);
            if (String(e.message || e).includes('SECURITY ERROR')) throw e;
            return {
                labName: this.normalizeLabName('', ''), address: '', phone: '', email: '',
                regNo: '', logo: '', doctorName: '', doctorQualification: '',
                pathologistName: '', pathologistDegree: '', techName: '', techDegree: '',
                ownerName: '', signatureText: '', headerColor: '#1e40af'
            };
        }
    },

    async saveLabProfile(profile) {
        try {
            await this.userDoc().set(this.tenantData(profile), { merge: true });
            return true;
        } catch (e) {
            console.error('saveLabProfile error:', e);
            return false;
        }
    },

    // ==================== LOGO (Cloudinary Service) ====================
    
    // ==================== TENANT SIGNATURE UPLOADS ====================
    async uploadSignature(file, type = 'pathologist') {
        if (!this.userId) throw new Error('Security Error: Unauthenticated tenant access attempt');
        const folder = `curebit/labs/${this.tenantId}/signatures`;
        const result = await CloudinaryService.uploadImage(file, folder);
        const updateObj = {};
        if (type === 'doctor') {
            updateObj.doctorSignatureUrl = result.secure_url;
            updateObj.doctorSignaturePublicId = result.public_id;
        } else {
            updateObj.pathologistSignatureUrl = result.secure_url;
            updateObj.pathologistSignaturePublicId = result.public_id;
        }
        await this.saveLabProfile(updateObj);
        return result.secure_url;
    },

    async uploadLogo(file) {
        try {
            if (!this.userId) throw new Error('Security Error: Unauthenticated tenant access attempt');
            const result = await CloudinaryService.uploadImage(file, `curebit/labs/${this.tenantId}/logo`);
            await this.saveLabProfile({
                logo: result.secure_url,
                logoPublicId: result.public_id
            });
            return result.secure_url;
        } catch (e) {
            console.error('uploadLogo Cloudinary error:', e);
            throw e;
        }
    },

    async removeLogo() {
        try {
            const profile = await this.getLabProfile();
            if (profile && profile.logoPublicId) {
                await CloudinaryService.deleteImage(profile.logoPublicId).catch(() => {});
            }
            await this.saveLabProfile({ logo: '', logoPublicId: '' });
            return true;
        } catch (e) {
            console.error('removeLogo error:', e);
            return false;
        }
    },

    // ==================== EXPORT / IMPORT ====================
    async exportAll() {
        const [labProfile, patients, reports] = await Promise.all([
            this.getLabProfile(),
            this.getPatients(),
            this.getReports()
        ]);
        return {
            labProfile,
            patients,
            reports,
            exportedAt: new Date().toISOString(),
            version: '3.0-firebase'
        };
    },

    async importAll(data) {
        try {
            if (data.labProfile) await this.saveLabProfile(data.labProfile);

            if (data.patients && data.patients.length > 0) {
                for (const p of data.patients) {
                    const { id, ...pData } = p;
                    pData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    pData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
                    await this.userDoc().collection('patients').add(this.tenantData(pData));
                }
            }

            if (data.reports && data.reports.length > 0) {
                for (const r of data.reports) {
                    const { id, ...rData } = r;
                    rData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    rData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
                    await this.userDoc().collection('reports').add(this.tenantData(rData));
                }
            }
            return true;
        } catch (e) {
            console.error('importAll error:', e);
            throw e;
        }
    },

    async clearAll() {
        try {
            const patients = await this.userDoc().collection('patients').get();
            const reports = await this.userDoc().collection('reports').get();
            const batch = firestore.batch();
            patients.docs.forEach(doc => batch.delete(doc.ref));
            reports.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            await this.userDoc().delete();
            return true;
        } catch (e) {
            console.error('clearAll error:', e);
            return false;
        }
    },

    // ==================== DASHBOARD STATS ====================
    async getDashboardStats() {
        const [patients, reports, labProfile] = await Promise.all([
            this.getPatients(),
            this.getReports(),
            this.getLabProfile()
        ]);
        const today = new Date().toISOString().split('T')[0];
        const todayReports = reports.filter(r => r.date === today);
        const pendingReports = reports.filter(r => r.status === 'pending');
        const completedReports = reports.filter(r => r.status === 'completed');

        // Senior Logic: Calculate Revenue, Outstanding Balance & Unique Patients Today
        const todayRevenue = todayReports.reduce((acc, r) => acc + (r.billing?.paid || 0), 0);
        const todayOutstanding = todayReports.reduce((acc, r) => {
            const total = r.billing?.total || 0;
            const paid = r.billing?.paid || 0;
            return acc + Math.max(0, total - paid);
        }, 0);
        const todayUniquePatients = new Set(todayReports.map(r => r.patientId)).size;

        return {
            labProfile,
            patients,
            reports,
            todayReports,
            pendingReports,
            completedReports,
            todayRevenue,
            todayOutstanding,
            todayUniquePatients,
            totalPatients: patients.length,
            totalReports: reports.length,
            todayCount: todayReports.length,
            pendingCount: pendingReports.length,
            completedCount: completedReports.length
        };
    },


    // ==================== ADMIN / APPROVAL SYSTEM ====================
    async checkIfAdmin() {
        try {
            // Method 1: Check admin/config collection
            try {
                const adminDoc = await firestore.collection('admin').doc('config').get();
                if (adminDoc.exists && adminDoc.data().adminUid === this.userId) {
                    this.isAdmin = true;
                    return true;
                }
            } catch (e) { /* ignore */ }

            // Method 2: Check isAdmin field in user's own document
            try {
                const userDoc = await this.userDoc().get();
                if (userDoc.exists && userDoc.data().isAdmin === true) {
                    this.isAdmin = true;
                    return true;
                }
            } catch (e) { /* ignore */ }

            this.isAdmin = false;
            return false;
        } catch (e) {
            this.isAdmin = false;
            return false;
        }
    },

    async checkApproval() {
        try {
            // Method 1: Admin is always approved
            if (await this.checkIfAdmin()) return true;

            const userDoc = await this.userDoc().get();
            if (!userDoc.exists) return false; // Fail closed if user profile is missing

            const data = userDoc.data();

            // 1. Check if manually approved (legacy support)
            if (data.isApproved === true) return true;

            // 2. Check Subscription Validity
            if (data.planValidUntil) {
                const validUntil = data.planValidUntil.toDate();
                if (new Date() < validUntil) return true; // Subscription active
            }

            return false; // No active plan or approval
        } catch (e) {
            console.error('checkApproval error:', e);
            // Fail closed when subscription/approval cannot be verified.
            return false;
        }
    },

    async submitForApproval(userData) {
        try {
            await firestore.collection('pendingUsers').doc(this.userId).set({
                uid: this.userId,
                email: userData.email || '',
                name: userData.name || '',
                labName: userData.labName || '',
                phone: userData.phone || '',
                requestedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending',
                labId: this.tenantId
            });
            return true;
        } catch (e) {
            console.error('submitForApproval error:', e);
            throw e;
        }
    },

    async checkPendingStatus() {
        try {
            const doc = await firestore.collection('pendingUsers').doc(this.userId).get();
            if (doc.exists) return doc.data().status || 'pending';
            return null;
        } catch (e) {
            return null;
        }
    },

    // Admin functions
    async getPendingUsers() {
        try {
            const snap = await firestore.collection('pendingUsers')
                .where('status', '==', 'pending')
                .orderBy('requestedAt', 'desc').get();
            return snap.docs.map(doc => this.assertTenantRecord({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error('getPendingUsers error:', e);
            return [];
        }
    },

    async getAllApprovedUsers() {
        try {
            const snap = await firestore.collection('approvedUsers').get();
            return snap.docs.map(doc => this.assertTenantRecord({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error('getAllApprovedUsers error:', e);
            return [];
        }
    },

    async approveUser(userId) {
        try {
            const pendingDoc = await firestore.collection('pendingUsers').doc(userId).get();
            const userData = pendingDoc.exists ? pendingDoc.data() : {};

            await firestore.collection('approvedUsers').doc(userId).set({
                approved: true,
                approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: userData.email || '',
                name: userData.name || '',
                labName: userData.labName || ''
            });

            await firestore.collection('pendingUsers').doc(userId).update({
                status: 'approved'
            });

            // Also create user doc so they can start using
            await firestore.collection('users').doc(userId).set({
                labName: userData.labName || userData.name || 'My Lab',
                labId: userId,
                email: userData.email || '',
                isApproved: true, // Explicit approval flag
                approvedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            return true;
        } catch (e) {
            console.error('approveUser error:', e);
            throw e;
        }
    },

    async rejectUser(userId) {
        try {
            await firestore.collection('pendingUsers').doc(userId).update({
                status: 'rejected'
            });
            return true;
        } catch (e) {
            console.error('rejectUser error:', e);
            throw e;
        }
    },

    async revokeUser(userId) {
        try {
            await firestore.collection('approvedUsers').doc(userId).delete();
            return true;
        } catch (e) {
            console.error('revokeUser error:', e);
            throw e;
        }
    },
    // ==================== SUBSCRIPTION ====================
    async getSubscription() {
        try {
            const doc = await this.userDoc().collection('subscriptions').doc('current').get();
            return doc.exists ? doc.data() : null;
        } catch (e) {
            console.error('getSubscription error:', e);
            return null;
        }
    },

    async saveSubscription(data) {
        try {
            await this.userDoc().collection('subscriptions').doc('current').set(this.tenantData(data), { merge: true });
            // Update user profile with plan status
            await this.userDoc().update({
                plan: data.plan,
                planStatus: data.status,
                planValidUntil: data.validUntil
            });
            return true;
        } catch (e) {
            console.error('saveSubscription error:', e);
            throw e;
        }
    },

    // ==================== NEW ADMIN FEATURES ====================
    async registerVerifiedUser(user) {
        try {            // Validate user object
            if (!user || !user.uid) {
                console.warn('registerVerifiedUser: Invalid user object', user);
                return false;
            }

            // Check if already approved/registered to avoid overwrites
            const doc = await firestore.collection('approvedUsers').doc(user.uid).get();
            if (doc.exists) return true; // Already registered

            // Add to approvedUsers so they show up in Admin Panel
            await firestore.collection('approvedUsers').doc(user.uid).set({
                approved: true,
                approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: user.email || '',
                name: user.displayName || 'Verified User',
                labName: user.displayName || 'My Lab', // Default or fetch from profile
                method: 'email_verification'
            });

            // Ensure user doc has approval flag
            await firestore.collection('users').doc(user.uid).set({
                isApproved: true,
                emailVerified: true,
                labId: user.uid
            }, { merge: true });

            return true;
        } catch (e) {
            console.error('registerVerifiedUser error:', e);
            return false;
        }
    },

    async grantFreeSubscription(userId, months = 12) {
        try {
            const validUntil = new Date();
            validUntil.setMonth(validUntil.getMonth() + months);

            const planData = {
                labId: userId,
                plan: 'premium',
                planName: 'Family/Free (Admin Grant)',
                tier: 'premium',
                status: 'active',
                paymentId: 'admin_grant_' + Date.now(),
                orderId: 'admin_grant',
                amount: 0,
                validFrom: firebase.firestore.FieldValue.serverTimestamp(),
                validUntil: firebase.firestore.Timestamp.fromDate(validUntil)
            };

            // Save to user's subscription collection
            await firestore.collection('users').doc(userId).collection('subscriptions').doc('current').set(planData);

            // Update user profile
            await firestore.collection('users').doc(userId).update({
                plan: 'premium',
                planStatus: 'active',
                planValidUntil: firebase.firestore.Timestamp.fromDate(validUntil),
                isApproved: true // Ensure they are approved
            });

            return true;
        } catch (e) {
            console.error('grantFreeSubscription error:', e);
            throw e;
        }
    },

    // ==================== MRILA (MEDICAL REPORT INTEGRITY & LOCK) ====================
    async lockReport(id, verifierName = 'Authorized Pathologist') {
        try {
            const uid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'system';
            const lockData = {
                isLocked: true,
                status: 'final',
                verifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
                verifiedBy: uid,
                verifierName: verifierName,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            await this.userDoc().collection('reports').doc(id).update(lockData);
            this.clearCache('reports');
            return true;
        } catch (e) {
            console.error('lockReport error:', e);
            throw e;
        }
    },

    async incrementPrintCount(id) {
        try {
            await this.userDoc().collection('reports').doc(id).update({
                printedCount: firebase.firestore.FieldValue.increment(1),
                lastPrintedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            this.clearCache('reports');
        } catch (e) {
            console.warn('incrementPrintCount warning:', e);
        }
    },

    async createReportRevision(id, reason = 'Correction Request') {
        try {
            const original = await this.getReportById(id);
            if (!original) throw new Error('Original report not found');

            const currentRev = original.revisionNumber || 1;
            const newRev = currentRev + 1;

            const revisionData = {
                ...original,
                parentReportId: id,
                revisionNumber: newRev,
                revisionReason: reason,
                status: 'draft',
                isLocked: false,
                verifiedAt: null,
                verifiedBy: null,
                verifierName: null,
                printedCount: 0,
                lastPrintedAt: null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            delete revisionData.id;

            const ref = await this.userDoc().collection('reports').add(this.tenantData(revisionData));
            this.clearCache('reports');
            return { id: ref.id, ...revisionData };
        } catch (e) {
            console.error('createReportRevision error:', e);
            throw e;
        }
    },

    // ==================== RAZORPAY LIVE PAYMENTS & TRANSACTIONS ====================
    async savePaymentRecord(paymentData) {
        try {
            paymentData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            paymentData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            const ref = await this.userDoc().collection('payments').add(paymentData);
            
            // Also log to transaction_history
            await this.userDoc().collection('transaction_history').add({
                transactionId: 'TXN_' + Date.now(),
                paymentId: paymentData.paymentId || ref.id,
                orderId: paymentData.orderId || '',
                amount: paymentData.amount || 0,
                planId: paymentData.planId || '',
                status: paymentData.status || 'captured',
                invoiceNumber: paymentData.invoiceNumber || '',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            this.clearCache('reports');
            return { id: ref.id, ...paymentData };
        } catch (e) {
            console.error('savePaymentRecord error:', e);
            throw e;
        }
    },

    async getPaymentHistory() {
        try {
            const snap = await this.userDoc().collection('payments')
                .orderBy('createdAt', 'desc').limit(20).get();
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error('getPaymentHistory error:', e);
            return [];
        }
    },
};

