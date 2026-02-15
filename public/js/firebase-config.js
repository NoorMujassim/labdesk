/**
 * LabDesk - Firebase Configuration & Initialization
 */

const firebaseConfig = {
    apiKey: "AIzaSyAl96H87O_-kOIs-7FUaT7kjFT8MhMx_OY",
    authDomain: "labdesk-18c70.firebaseapp.com",
    databaseURL: "https://labdesk-18c70-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "labdesk-18c70",
    storageBucket: "labdesk-18c70.firebasestorage.app",
    messagingSenderId: "748945233344",
    appId: "1:748945233344:web:c3b10fbfe4c5cf03aba425",
    measurementId: "G-EMBYS1CSGJ"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();

// Enable Firestore offline persistence
firestore.enablePersistence({ synchronizeTabs: true })
    .catch(err => {
        if (err.code === 'failed-precondition') {
            console.warn('Firestore persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            console.warn('Firestore persistence not available in this browser');
        }
    });

console.log('Firebase initialized successfully');
