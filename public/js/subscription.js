/**
 * LabDesk - Subscription & Payment Handler (Razorpay)
 */

const RAZORPAY_KEY_ID = 'rzp_test_S707OAHFQYtN6O'; // TEST KEY - Replace with live key in production

const SUBSCRIPTION_PLANS = {
    weekly: {
        id: 'weekly',
        name: 'Weekly Pass',
        price: 49,
        durationDays: 7,
        tier: 'premium', // Weekly gets full access
        features: ['Full Access for 7 Days', 'All Test Templates', 'Priority Support']
    },
    basic: {
        id: 'basic',
        name: 'Basic Plan',
        price: 149,
        durationDays: 30,
        tier: 'basic',
        features: ['100 Patients / mo', 'Hematology & Urine', 'Email Support']
    },
    standard: {
        id: 'standard',
        name: 'Standard Plan',
        price: 199,
        durationDays: 30,
        tier: 'standard',
        features: ['300 Patients / mo', '+ Biochemistry & Serology', 'WhatsApp Integration']
    },
    pro: {
        id: 'pro',
        name: 'Pro Plan',
        price: 299,
        durationDays: 30,
        tier: 'pro',
        features: ['500 Patients / mo', '+ Immunology & Micro', 'Custom Letterhead']
    },
    premium: {
        id: 'premium',
        name: 'Premium Plan',
        price: 399,
        durationDays: 30,
        tier: 'premium',
        features: ['Unlimited Patients', 'All Advanced Panels', 'Multi-User Access', 'Priority Support']
    }
};

let isYearly = false;

async function renderSubscription() {
    const container = document.getElementById('pageContainer');
    if (!container) return;

    container.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p class="text-sm text-gray-400" style="margin-top:12px;">Loading subscription details...</p></div>`;

    try {
        const sub = await DB.getSubscription();
        const isActive = sub && sub.status === 'active' && sub.validUntil && new Date(sub.validUntil.toDate()) > new Date();

        // Calculate Prices
        const getPrice = (plan) => {
            if (plan.id === 'weekly') return plan.price;
            return isYearly ? Math.round(plan.price * 12 * 0.70) : plan.price; // 30% discount
        };

        const getDurationLabel = (plan) => {
            if (plan.id === 'weekly') return '/ 7 days';
            return isYearly ? '/ year' : '/ month';
        };

        const plansHtml = Object.values(SUBSCRIPTION_PLANS).map(plan => {
            const price = getPrice(plan);
            const isMain = plan.id === 'premium';
            const label = getDurationLabel(plan);

            return `
            <div class="card relative flex flex-col ${isMain ? 'border-primary shadow-lg ring-1 ring-primary' : 'border-gray-200'}" style="padding:20px;transition:transform 0.2s;">
                ${isMain ? `<div class="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">BEST VALUE</div>` : ''}
                
                <h3 class="text-lg font-bold ${isMain ? 'text-primary' : 'text-gray-800'}">${plan.name}</h3>
                <div class="my-3">
                    <span class="text-3xl font-bold text-gray-900">₹${price}</span>
                    <span class="text-xs text-gray-500">${label}</span>
                </div>
                
                <ul class="space-y-2 mb-6 flex-1">
                    ${plan.features.map(f => `<li class="flex items-start gap-2 text-xs text-gray-600">${ICONS.check} <span style="flex:1">${f}</span></li>`).join('')}
                </ul>
                
                <button onclick="handlePayment('${plan.id}')" class="btn ${isMain ? 'btn-primary' : 'btn-outline'} w-full text-sm py-2">
                    ${isActive && sub.plan === plan.id ? 'Current Plan' : 'Select Plan'}
                </button>
            </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="space-y-6 fade-in" style="max-width:1200px;margin:0 auto;padding-bottom:100px;">
                <div class="text-center" style="margin-bottom:20px;">
                    <h2 class="text-3xl font-bold text-gray-800">Choose Your Plan</h2>
                    <p class="text-gray-500" style="margin-top:8px;">Unlock full access to LabDesk. Start with a 7-day trial!</p>
                    
                    <!-- Toggle -->
                    <div class="flex justify-center items-center gap-4 mt-6">
                        <span class="text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}">Monthly</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" onchange="toggleBilling(this)" ${isYearly ? 'checked' : ''}>
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                        <span class="text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}">Yearly <span class="text-xs text-success font-bold bg-success-light px-2 py-0.5 rounded-full ml-1">SAVE 30%</span></span>
                    </div>
                </div>

                <!-- Current Status -->
                ${isActive ? `
                <div class="card bg-success-light border-success" style="padding:16px;display:flex;align-items:center;gap:16px;margin-bottom:24px;max-width:500px;margin-left:auto;margin-right:auto;">
                    <div style="width:40px;height:40px;background:white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--success);">
                        ${ICONS.check}
                    </div>
                    <div>
                        <h3 class="font-bold text-success-dark">Active Plan: ${sub.planName || 'Plan'}</h3>
                        <p class="text-sm text-success-dark opacity-80">Valid until: ${new Date(sub.validUntil.toDate()).toLocaleDateString()}</p>
                    </div>
                </div>
                ` : ''}

                <!-- Pricing Grid - 5 Columns -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    ${plansHtml}
                </div>
                
                <div class="text-center mt-8 text-gray-500 text-sm">
                    <p>Contact us for Enterprise plans with custom requirements.</p>
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Render Subscription Error:', e);
        container.innerHTML = `<div class="empty-state"><p class="text-danger">Error loading subscription info: ${e.message}</p></div>`;
    }
}

function toggleBilling(checkbox) {
    isYearly = checkbox.checked;
    renderSubscription();
}

async function handlePayment(planId) {
    const user = auth.currentUser;
    if (!user) return;

    const plan = SUBSCRIPTION_PLANS[planId];
    // Calculate final price based on toggle
    let finalPrice = plan.id === 'weekly'
        ? plan.price
        : (isYearly ? Math.round(plan.price * 12 * 0.70) : plan.price);

    // Amount in paise
    const amountPaise = finalPrice * 100;

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: amountPaise,
        currency: "INR",
        name: "LabDesk",
        description: `${plan.name} (${plan.id === 'weekly' ? 'One Time' : (isYearly ? 'Yearly' : 'Monthly')})`,
        image: "https://labdesk.pages.dev/apple-touch-icon.png",
        handler: async function (response) {
            showToast('Processing payment...');

            try {
                // Determine Validity
                const now = new Date();
                let validUntil = new Date();

                if (plan.id === 'weekly') {
                    validUntil.setDate(now.getDate() + 7);
                } else {
                    if (isYearly) validUntil.setFullYear(now.getFullYear() + 1);
                    else validUntil.setDate(now.getDate() + 30);
                }

                await DB.saveSubscription({
                    plan: plan.id,
                    planName: plan.name,
                    tier: plan.tier, // Save tier for access control
                    status: 'active',
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id || 'order_' + Date.now(),
                    amount: finalPrice,
                    validFrom: firebase.firestore.FieldValue.serverTimestamp(),
                    validUntil: firebase.firestore.Timestamp.fromDate(validUntil)
                });

                showToast('Plan Activated Successfully! 🚀');
                setTimeout(() => window.location.reload(), 1500);
            } catch (e) {
                console.error('Activation Error:', e);
                showToast('Payment successful but activation failed.', 'error');
            }
        },
        prefill: {
            name: user.displayName || "",
            email: user.email || "",
            contact: ""
        },
        theme: { color: "#4f46e5" }
    };

    const rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        showToast('Payment Failed: ' + response.error.description, 'error');
    });
    rzp1.open();
}
