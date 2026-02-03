// firebase-config.js - Updated with your Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your Firebase configuration from your provided keys
const firebaseConfig = {
  apiKey: "AIzaSyBHmq2hPEyb2z89XIR4y-FlKJYpSObh8Iw",
  authDomain: "printsome-b5197.firebaseapp.com",
  projectId: "printsome-b5197",
  storageBucket: "printsome-b5197.firebasestorage.app",
  messagingSenderId: "558794337754",
  appId: "1:558794337754:web:324c537a347d6e0991a4e3",
  measurementId: "G-TL2RN2TRLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Firebase authentication state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('Firebase user signed in:', user.email);
        
        // Update UI
        const userButton = document.getElementById('user-button');
        const userText = document.getElementById('user-text');
        
        if (userButton && userText) {
            const displayName = user.displayName || user.email.split('@')[0];
            userText.textContent = displayName;
            userButton.innerHTML = `<i class="fas fa-user"></i> <span id="user-text">${displayName}</span>`;
        }
        
        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        getDoc(userDocRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log('Firestore user data:', userData);
                
                // Store user data for use in the application
                window.currentUser = {
                    uid: user.uid,
                    email: user.email,
                    name: userData.name || user.displayName || user.email.split('@')[0],
                    memberSince: userData.memberSince || new Date().toISOString(),
                    discount: userData.discount || 10,
                    orders: userData.orders || []
                };
                
                // Update user display with Firestore data
                updateUserDisplay();
            } else {
                // Create user document if it doesn't exist
                const userData = {
                    email: user.email,
                    name: user.displayName || user.email.split('@')[0],
                    memberSince: new Date().toISOString(),
                    discount: 10,
                    orders: []
                };
                
                setDoc(userDocRef, userData).then(() => {
                    console.log('Firestore user document created');
                    window.currentUser = {
                        uid: user.uid,
                        ...userData
                    };
                    updateUserDisplay();
                }).catch((error) => {
                    console.error('Error creating user document:', error);
                });
            }
        }).catch((error) => {
            console.error('Error fetching user data:', error);
        });
        
    } else {
        // User is signed out
        console.log('Firebase user signed out');
        window.currentUser = null;
        
        // Update UI
        const userButton = document.getElementById('user-button');
        const userText = document.getElementById('user-text');
        
        if (userButton && userText) {
            userText.textContent = 'Sign In';
            userButton.innerHTML = `<i class="fas fa-user"></i> <span id="user-text">Sign In</span>`;
        }
    }
});

// Firebase authentication functions
async function signUpWithEmail(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update user profile
        await updateProfile(user, { displayName: name });
        
        // Create user document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
            email: email,
            name: name,
            memberSince: new Date().toISOString(),
            discount: 10,
            orders: []
        });
        
        return user;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

async function signInWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

async function firebaseSignOut() {
    try {
        await signOut(auth);
        console.log('Firebase user signed out');
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

// Firestore functions for PrintSome
async function saveOrder(orderData) {
    if (!window.currentUser) {
        throw new Error('User must be logged in to save order');
    }
    
    try {
        const ordersCollection = collection(db, 'orders');
        const userOrdersCollection = collection(db, 'users', window.currentUser.uid, 'orders');
        
        const orderWithMetadata = {
            ...orderData,
            userId: window.currentUser.uid,
            createdAt: new Date().toISOString(),
            status: 'processing'
        };
        
        // Save to orders collection
        const orderRef = await addDoc(ordersCollection, orderWithMetadata);
        
        // Also save to user's orders subcollection
        await addDoc(userOrdersCollection, {
            ...orderWithMetadata,
            orderId: orderRef.id
        });
        
        console.log('Order saved successfully with ID:', orderRef.id);
        return orderRef.id;
    } catch (error) {
        console.error('Error saving order:', error);
        throw error;
    }
}

async function getUserOrders() {
    if (!window.currentUser) {
        return [];
    }
    
    try {
        const userOrdersCollection = collection(db, 'users', window.currentUser.uid, 'orders');
        const q = query(userOrdersCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const orders = [];
        querySnapshot.forEach((doc) => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

// Product management functions
async function getProducts() {
    try {
        const productsCollection = collection(db, 'products');
        const q = query(productsCollection, where('active', '==', true));
        const querySnapshot = await getDocs(q);
        
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

async function getProductById(productId) {
    try {
        const productDoc = doc(db, 'products', productId);
        const docSnap = await getDoc(productDoc);
        
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } else {
            throw new Error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

// Helper function to update user profile
async function updateProfile(user, profile) {
    // Note: In Firebase v9 modular, we need to import updateProfile
    const { updateProfile: firebaseUpdateProfile } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
    return firebaseUpdateProfile(user, profile);
}

// Make functions available globally
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;
window.signUpWithEmail = signUpWithEmail;
window.signInWithEmail = signInWithEmail;
window.firebaseSignOut = firebaseSignOut;
window.saveOrder = saveOrder;
window.getUserOrders = getUserOrders;
window.getProducts = getProducts;
window.getProductById = getProductById;

console.log('Firebase initialized successfully');

// Export for use in other modules if needed
export { auth, db, storage, signUpWithEmail, signInWithEmail, firebaseSignOut, saveOrder, getUserOrders, getProducts, getProductById };
