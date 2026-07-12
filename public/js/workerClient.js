/**
 * CUREBIT - Cloudflare Worker Client API Service
 * Attaches authenticated Firebase ID Tokens to all Cloudflare Worker API requests.
 */

const WORKER_CONFIG = {
    // Local / Cloudflare Worker API Base URL
    baseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:8787'
        : 'https://curebit-backend.skustudio.workers.dev'
};

const WorkerClient = {
    /**
     * Get Firebase Auth ID Token for current user
     */
    async getAuthToken() {
        const user = firebase.auth().currentUser;
        if (!user) return null;
        try {
            return await user.getIdToken(false);
        } catch (e) {
            console.error('Failed to get Firebase ID Token:', e);
            return null;
        }
    },

    /**
     * Send authenticated request to Cloudflare Worker API
     */
    async request(endpoint, options = {}) {
        const token = await this.getAuthToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {})
        };

        const url = `${WORKER_CONFIG.baseUrl}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `Request failed with status ${response.status}`);
            }

            return data;
        } catch (e) {
            console.warn(`Cloudflare Worker API (${endpoint}) fallback:`, e.message);
            throw e;
        }
    },

    /**
     * Create Razorpay Order via Cloudflare Worker
     */
    async createOrder(planId, amountPaise, billingCycle) {
        return await this.request('/api/razorpay/create-order', {
            method: 'POST',
            body: JSON.stringify({ planId, amountPaise, billingCycle })
        });
    },

    /**
     * Verify Razorpay Payment Signature via Cloudflare Worker
     */
    async verifyPaymentSignature(orderId, paymentId, signature, planId, amountPaise, billingCycle) {
        return await this.request('/api/razorpay/verify-payment', {
            method: 'POST',
            body: JSON.stringify({ orderId, paymentId, signature, planId, amountPaise, billingCycle })
        });
    },

    /**
     * Recover a captured Razorpay payment that was not activated
     */
    async recoverPayment(planId, billingCycle, paymentId) {
        return await this.request('/api/razorpay/recover-payment', {
            method: 'POST',
            body: JSON.stringify({ planId, billingCycle, paymentId })
        });
    },

    /**
     * Delete a Firebase Auth user completely (Superadmin only)
     */
    async adminDeleteUser(uid) {
        return await this.request('/api/admin/delete-user', {
            method: 'DELETE',
            body: JSON.stringify({ uid })
        });
    }
};
