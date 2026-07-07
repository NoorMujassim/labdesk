/**
 * CureBIT - Firebase Configuration & Initialization
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

// PHI must not survive sign-out in a persistent browser database. Firestore's
// default in-memory cache is intentionally used instead of IndexedDB persistence.

console.log('Firebase initialized successfully');

