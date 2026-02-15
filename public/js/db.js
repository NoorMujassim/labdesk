/**
 * LabDesk - Firestore Database Layer
 * All CRUD operations via Firebase Firestore
 */

const DB = {
    // Current logged-in user ID
    userId: null,

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

    // Set user context
    async setUser(uid) {
        this.userId = uid;
        // Ensure user doc exists for trial tracking
        const docRef = this.userDoc();
        const doc = await docRef.get();
        if (!doc.exists) {
            await docRef.set({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: firebase.auth().currentUser.email,
                labName: 'My Lab'
            }, { merge: true });
        }
    },

    // Helper: Get user's root collection path
    userDoc() {
        return firestore.collection('users').doc(this.userId);
    },

    // ==================== PATIENTS ====================
    async getPatients() {
        try {
            const snap = await this.userDoc().collection('patients')
                .orderBy('createdAt', 'desc').get();
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
        } catch (e) {
            console.error('getPatientById error:', e);
            return null;
        }
    },

    async addPatient(data) {
        try {
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
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
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
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
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error('getReportsByPatient error:', e);
            return [];
        }
    },

    async addReport(data) {
        try {
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
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
            this.clearCache('reports'); // Invalidate cache
            return true;
        } catch (e) {
            console.error('deleteReport error:', e);
            return false;
        }
    },

    // ==================== LAB PROFILE ====================
    async getLabProfile() {
        try {
            const doc = await this.userDoc().get();
            const data = doc.exists ? doc.data() : {};
            return {
                labName: data.labName || 'My Lab',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || '',
                regNo: data.regNo || data.regNumber || '',
                logo: data.logo || data.logoUrl || '',
                doctorName: data.doctorName || data.consultantName || '',
                doctorQualification: data.doctorQualification || data.consultantDegree || '',
                pathologistName: data.pathologistName || '',
                pathologistDegree: data.pathologistDegree || '',
                techName: data.techName || data.drName || '',
                techDegree: data.techDegree || '',
                ownerName: data.ownerName || '',
                signatureText: data.signatureText || '',
                headerColor: data.headerColor || '#1e40af'
            };
        } catch (e) {
            console.error('getLabProfile error:', e);
            return {
                labName: 'My Lab', address: '', phone: '', email: '',
                regNo: '', logo: '', doctorName: '', doctorQualification: '',
                pathologistName: '', pathologistDegree: '', techName: '', techDegree: '',
                ownerName: '', signatureText: '', headerColor: '#1e40af'
            };
        }
    },

    async saveLabProfile(profile) {
        try {
            await this.userDoc().set(profile, { merge: true });
            return true;
        } catch (e) {
            console.error('saveLabProfile error:', e);
            return false;
        }
    },

    // ==================== LOGO (Firebase Storage) ====================
    async uploadLogo(file) {
        try {
            const ref = storage.ref(`logos/${this.userId}/logo`);
            await ref.put(file);
            const url = await ref.getDownloadURL();
            await this.saveLabProfile({ logo: url });
            return url;
        } catch (e) {
            console.error('uploadLogo error:', e);
            throw e;
        }
    },

    async removeLogo() {
        try {
            const ref = storage.ref(`logos/${this.userId}/logo`);
            await ref.delete().catch(() => { }); // ignore if not exists
            await this.saveLabProfile({ logo: '' });
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
                    await this.userDoc().collection('patients').add(pData);
                }
            }

            if (data.reports && data.reports.length > 0) {
                for (const r of data.reports) {
                    const { id, ...rData } = r;
                    rData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    rData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
                    await this.userDoc().collection('reports').add(rData);
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
        const [patients, reports] = await Promise.all([
            this.getPatients(),
            this.getReports()
        ]);
        const today = new Date().toISOString().split('T')[0];
        const todayReports = reports.filter(r => r.date === today);
        const pendingReports = reports.filter(r => r.status === 'pending');
        const completedReports = reports.filter(r => r.status === 'completed');

        return {
            patients,
            reports,
            todayReports,
            pendingReports,
            completedReports,
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
                    return true;
                }
            } catch (e) { /* ignore */ }

            // Method 2: Check isAdmin field in user's own document
            try {
                const userDoc = await this.userDoc().get();
                if (userDoc.exists && userDoc.data().isAdmin === true) {
                    return true;
                }
            } catch (e) { /* ignore */ }

            return false;
        } catch (e) {
            return false;
        }
    },

    async checkApproval() {
        try {
            // Method 1: Admin is always approved
            if (await this.checkIfAdmin()) return true;

            const userDoc = await this.userDoc().get();
            if (!userDoc.exists) return true; // New user -> approved (trial starts)

            const data = userDoc.data();

            // 1. Check if manually approved (legacy support)
            if (data.isApproved === true) return true;

            // 2. Check Subscription Validity
            if (data.planValidUntil) {
                const validUntil = data.planValidUntil.toDate();
                if (new Date() < validUntil) return true; // Subscription active
            }

            // 3. Check Trial Period (7 Days from creation)
            const createdAt = data.createdAt ? data.createdAt.toDate() : new Date();
            const diffTime = Math.abs(new Date() - createdAt);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Count complete days only

            if (diffDays <= 7) return true; // Within 7-day trial

            return false; // Trial expired & no active plan
        } catch (e) {
            console.error('checkApproval error:', e);
            // Default to true to avoid locking out on error, but in strict mode should be false
            return true;
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
                status: 'pending'
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
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error('getPendingUsers error:', e);
            return [];
        }
    },

    async getAllApprovedUsers() {
        try {
            const snap = await firestore.collection('approvedUsers').get();
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
            await this.userDoc().collection('subscriptions').doc('current').set(data, { merge: true });
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
                emailVerified: true
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
    }
};
