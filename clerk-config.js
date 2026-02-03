// clerk-config.js - Clerk authentication for PrintSome 3D Printing Service

// Clerk publishable key from your environment
const CLERK_PUBLISHABLE_KEY = 'pk_test_cmljaC1rb2ktNzkuY2xlcmsuYWNjb3VudHMuZGV2JA';

// Clerk initialization function
async function initializeClerk() {
    // Check if Clerk is available
    if (typeof Clerk === 'undefined') {
        console.error('Clerk is not loaded. Make sure the Clerk script is included before this file.');
        setupFallbackAuth();
        return;
    }

    try {
        // Load Clerk with your publishable key
        await Clerk.load({
            publishableKey: CLERK_PUBLISHABLE_KEY,
            afterSignOutUrl: window.location.href,
            appearance: {
                variables: {
                    colorPrimary: '#FFD700', // Yellow to match your theme
                    colorText: '#000000', // Black text
                    colorBackground: '#FFFFFF', // White background
                    colorInputBackground: '#F9F9F9', // Light gray input background
                    colorInputText: '#000000', // Black input text
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif'
                },
                elements: {
                    // Customize Clerk components to match your theme
                    card: {
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    },
                    header: {
                        background: '#000000',
                        color: '#FFFFFF'
                    },
                    socialButtons: {
                        button: {
                            border: '1px solid #E5E7EB',
                            '&:hover': {
                                background: '#F9FAFB'
                            }
                        }
                    },
                    formButtonPrimary: {
                        background: '#FFD700',
                        color: '#000000',
                        '&:hover': {
                            background: '#FFC400'
                        }
                    },
                    footer: {
                        '& a': {
                            color: '#FFD700'
                        }
                    }
                }
            }
        });

        console.log('Clerk initialized successfully');

        // Set up Clerk UI
        setupClerkUI();

        // Listen for authentication changes
        Clerk.addListener(({ user, session }) => {
            console.log('Clerk auth state changed:', user ? 'User signed in' : 'User signed out');
            handleAuthStateChange(user);
        });

        // Check initial auth state
        if (Clerk.user) {
            handleAuthStateChange(Clerk.user);
        }

    } catch (error) {
        console.error('Error initializing Clerk:', error);
        setupFallbackAuth();
    }
}

// Set up Clerk UI components
function setupClerkUI() {
    // Find the auth container
    const authContainer = document.getElementById('clerk-auth');
    
    if (!authContainer) {
        console.warn('Clerk auth container not found');
        return;
    }

    // Clear any existing content
    authContainer.innerHTML = '';

    if (Clerk.user) {
        // User is signed in - show user profile
        showUserProfile(authContainer);
    } else {
        // User is not signed in - show sign-in
        showSignIn(authContainer);
    }
}

// Show sign-in component
function showSignIn(container) {
    if (!Clerk.signIn) {
        console.error('Clerk signIn not available');
        return;
    }

    // Create sign-in component
    const signIn = Clerk.signIn;
    signIn.mount(container);
}

// Show user profile component
function showUserProfile(container) {
    if (!Clerk.user) return;

    const user = Clerk.user;
    
    // Create user profile UI
    container.innerHTML = `
        <div class="clerk-user-profile">
            <div class="user-header">
                ${user.imageUrl ? 
                    `<img src="${user.imageUrl}" alt="${user.fullName}" class="user-avatar-img" crossorigin="anonymous">` : 
                    `<div class="user-avatar"><i class="fas fa-user"></i></div>`
                }
                <h3>Welcome, ${user.firstName || user.username || 'User'}!</h3>
                <p class="user-email">${user.primaryEmailAddress?.emailAddress || ''}</p>
                <p class="user-member-since">Member since ${new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div class="user-benefits">
                <h4><i class="fas fa-crown"></i> Your PrintSome Benefits</h4>
                <ul>
                    <li><i class="fas fa-check-circle"></i> <strong>15% discount</strong> on all products</li>
                    <li><i class="fas fa-check-circle"></i> <strong>Free shipping</strong> on all orders</li>
                    <li><i class="fas fa-check-circle"></i> Priority customer support</li>
                    <li><i class="fas fa-check-circle"></i> Access to exclusive products</li>
                    <li><i class="fas fa-check-circle"></i> Early access to new designs</li>
                    <li><i class="fas fa-check-circle"></i> Custom design consultation</li>
                </ul>
            </div>
            
            <div class="user-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Orders</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-euro-sign"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">€0</div>
                        <div class="stat-label">Saved</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">15%</div>
                        <div class="stat-label">Discount</div>
                    </div>
                </div>
            </div>
            
            <div class="user-actions">
                <button id="manage-account-btn" class="btn btn-secondary">
                    <i class="fas fa-user-cog"></i> Manage Account
                </button>
                <button id="sign-out-btn" class="btn btn-outline">
                    <i class="fas fa-sign-out-alt"></i> Sign Out
                </button>
            </div>
            
            <div class="account-links">
                <a href="#" id="view-orders-link"><i class="fas fa-box"></i> My Orders</a>
                <a href="#" id="view-wishlist-link"><i class="fas fa-heart"></i> Wishlist</a>
                <a href="#" id="billing-link"><i class="fas fa-credit-card"></i> Billing</a>
            </div>
        </div>
    `;

    // Add event listeners
    document.getElementById('manage-account-btn').addEventListener('click', () => {
        Clerk.openUserProfile();
    });

    document.getElementById('sign-out-btn').addEventListener('click', async () => {
        try {
            await Clerk.signOut();
            showNotification('Successfully signed out', 'success');
        } catch (error) {
            console.error('Error signing out:', error);
            showNotification('Error signing out', 'error');
        }
    });

    // Add other event listeners
    document.getElementById('view-orders-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Orders feature coming soon!', 'info');
    });

    document.getElementById('view-wishlist-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Wishlist feature coming soon!', 'info');
    });

    document.getElementById('billing-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Billing feature coming soon!', 'info');
    });
}

// Handle authentication state changes
function handleAuthStateChange(user) {
    const userButton = document.getElementById('user-button');
    const userText = document.getElementById('user-text');
    const authModal = document.getElementById('auth-modal');

    if (user) {
        // User signed in
        console.log('User signed in:', user);
        
        // Update UI elements
        if (userButton && userText) {
            const displayName = user.firstName || user.username || user.primaryEmailAddress?.emailAddress.split('@')[0] || 'User';
            userText.textContent = displayName;
            userButton.innerHTML = `<i class="fas fa-user"></i> <span id="user-text">${displayName}</span>`;
        }

        // Store user info globally
        window.currentUser = {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            name: user.fullName || user.username || user.primaryEmailAddress?.emailAddress.split('@')[0],
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            memberSince: new Date(user.createdAt).toISOString(),
            clerkSession: Clerk.session
        };

        // Sync with Firebase if available
        syncWithFirebase(user);

        // Update auth modal
        updateAuthModalForSignedInUser();

        // Show welcome notification
        showNotification(`Welcome back, ${user.firstName || 'User'}!`, 'success');

    } else {
        // User signed out
        console.log('User signed out');
        
        // Update UI elements
        if (userButton && userText) {
            userText.textContent = 'Sign In';
            userButton.innerHTML = `<i class="fas fa-user"></i> <span id="user-text">Sign In</span>`;
        }

        // Clear user info
        window.currentUser = null;

        // Update auth modal
        updateAuthModalForSignedOutUser();

        // Close auth modal if open
        if (authModal && authModal.classList.contains('active')) {
            closeAuthModal();
        }
    }
}

// Sync Clerk user with Firebase
async function syncWithFirebase(clerkUser) {
    try {
        // Check if Firebase is available
        if (window.firebaseDb && window.getDoc && window.setDoc && window.doc) {
            const userRef = doc(window.firebaseDb, 'clerk_users', clerkUser.id);
            const userSnap = await getDoc(userRef);

            const userData = {
                clerkId: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress,
                name: clerkUser.fullName || clerkUser.primaryEmailAddress?.emailAddress.split('@')[0],
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
                imageUrl: clerkUser.imageUrl,
                lastLogin: new Date().toISOString(),
                memberSince: new Date(clerkUser.createdAt).toISOString(),
                discount: 15, // Clerk users get 15% discount
                tier: 'premium'
            };

            if (!userSnap.exists()) {
                // Create new user in Firebase
                await setDoc(userRef, {
                    ...userData,
                    createdAt: new Date().toISOString(),
                    orders: [],
                    wishlist: [],
                    points: 100 // Welcome points
                });
                console.log('Clerk user synced with Firebase');
            } else {
                // Update existing user
                await setDoc(userRef, {
                    ...userData,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
                console.log('Clerk user updated in Firebase');
            }
        }
    } catch (error) {
        console.error('Error syncing with Firebase:', error);
    }
}

// Update auth modal for signed in user
function updateAuthModalForSignedInUser() {
    const authBody = document.querySelector('.auth-body');
    if (!authBody) return;

    // Update the auth modal content
    const authContainer = document.getElementById('clerk-auth');
    if (authContainer) {
        setupClerkUI();
    }
}

// Update auth modal for signed out user
function updateAuthModalForSignedOutUser() {
    const authBody = document.querySelector('.auth-body');
    if (!authBody) return;

    // Reset to sign-in view
    const authContainer = document.getElementById('clerk-auth');
    if (authContainer) {
        setupClerkUI();
    }
}

// Fallback authentication (if Clerk fails)
function setupFallbackAuth() {
    console.log('Setting up fallback authentication');
    
    const authContainer = document.getElementById('clerk-auth');
    if (!authContainer) return;

    authContainer.innerHTML = `
        <div class="fallback-auth">
            <div class="fallback-header">
                <h3><i class="fas fa-user-lock"></i> Authentication</h3>
                <p>Sign in to access your PrintSome account</p>
            </div>
            
            <div class="fallback-options">
                <div class="auth-method">
                    <button class="auth-btn" id="firebase-auth-btn">
                        <i class="fas fa-envelope"></i>
                        <span>Continue with Email</span>
                    </button>
                    <p class="auth-note">Using Firebase Authentication</p>
                </div>
                
                <div class="auth-divider">
                    <span>Or continue with</span>
                </div>
                
                <div class="social-auth">
                    <button class="social-btn google-btn">
                        <i class="fab fa-google"></i>
                        <span>Google</span>
                    </button>
                    <button class="social-btn github-btn">
                        <i class="fab fa-github"></i>
                        <span>GitHub</span>
                    </button>
                </div>
            </div>
            
            <div class="fallback-terms">
                <p>By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
            </div>
        </div>
    `;

    // Add event listeners for fallback auth
    document.getElementById('firebase-auth-btn')?.addEventListener('click', () => {
        showFirebaseAuthModal();
    });

    document.querySelector('.google-btn')?.addEventListener('click', () => {
        showNotification('Google authentication coming soon!', 'info');
    });

    document.querySelector('.github-btn')?.addEventListener('click', () => {
        showNotification('GitHub authentication coming soon!', 'info');
    });
}

// Show Firebase authentication modal
function showFirebaseAuthModal() {
    const authContainer = document.getElementById('clerk-auth');
    if (!authContainer) return;

    authContainer.innerHTML = `
        <div class="firebase-auth-modal">
            <div class="auth-tabs">
                <button class="auth-tab active" data-tab="signin">Sign In</button>
                <button class="auth-tab" data-tab="signup">Sign Up</button>
            </div>
            
            <div class="auth-content">
                <!-- Sign In Form -->
                <form id="firebase-signin-form" class="auth-form active" data-form="signin">
                    <div class="form-group">
                        <label for="signin-email">Email Address</label>
                        <input type="email" id="signin-email" placeholder="your@email.com" required>
                    </div>
                    <div class="form-group">
                        <label for="signin-password">Password</label>
                        <input type="password" id="signin-password" placeholder="••••••••" required>
                    </div>
                    <div class="form-options">
                        <label class="checkbox">
                            <input type="checkbox" id="remember-me">
                            <span>Remember me</span>
                        </label>
                        <a href="#" class="forgot-password">Forgot password?</a>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </button>
                </form>
                
                <!-- Sign Up Form -->
                <form id="firebase-signup-form" class="auth-form" data-form="signup">
                    <div class="form-group">
                        <label for="signup-name">Full Name</label>
                        <input type="text" id="signup-name" placeholder="John Doe" required>
                    </div>
                    <div class="form-group">
                        <label for="signup-email">Email Address</label>
                        <input type="email" id="signup-email" placeholder="your@email.com" required>
                    </div>
                    <div class="form-group">
                        <label for="signup-password">Password</label>
                        <input type="password" id="signup-password" placeholder="••••••••" required>
                        <small class="form-hint">At least 8 characters</small>
                    </div>
                    <div class="form-group">
                        <label for="signup-confirm">Confirm Password</label>
                        <input type="password" id="signup-confirm" placeholder="••••••••" required>
                    </div>
                    <div class="form-options">
                        <label class="checkbox">
                            <input type="checkbox" id="accept-terms" required>
                            <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">
                        <i class="fas fa-user-plus"></i> Create Account
                    </button>
                </form>
            </div>
            
            <div class="auth-back">
                <button id="back-to-auth-options">
                    <i class="fas fa-arrow-left"></i> Back to options
                </button>
            </div>
        </div>
    `;

    // Add tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Update active tab
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
                if (form.getAttribute('data-form') === tabName) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Add back button functionality
    document.getElementById('back-to-auth-options').addEventListener('click', () => {
        setupFallbackAuth();
    });

    // Handle sign in form
    document.getElementById('firebase-signin-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        
        try {
            if (window.signInWithEmail) {
                await window.signInWithEmail(email, password);
                showNotification('Successfully signed in!', 'success');
                closeAuthModal();
            } else {
                showNotification('Authentication service not available', 'error');
            }
        } catch (error) {
            showNotification(`Sign in failed: ${error.message}`, 'error');
        }
    });

    // Handle sign up form
    document.getElementById('firebase-signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        
        if (password !== confirm) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 8) {
            showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        
        try {
            if (window.signUpWithEmail) {
                await window.signUpWithEmail(email, password, name);
                showNotification('Account created successfully!', 'success');
                closeAuthModal();
            } else {
                showNotification('Authentication service not available', 'error');
            }
        } catch (error) {
            showNotification(`Sign up failed: ${error.message}`, 'error');
        }
    });
}

// Helper functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.global-notification');
    existing.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `global-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Add Clerk CSS styles
function addClerkStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Clerk User Profile Styles */
        .clerk-user-profile {
            padding: 20px;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .user-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .user-avatar-img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #FFD700;
            margin-bottom: 15px;
        }
        
        .user-avatar {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #FFD700, #FFC400);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            color: #000;
            font-size: 40px;
        }
        
        .user-header h3 {
            color: #000;
            margin-bottom: 5px;
            font-size: 1.5rem;
        }
        
        .user-email {
            color: #666;
            margin-bottom: 5px;
            font-size: 0.9rem;
        }
        
        .user-member-since {
            color: #888;
            font-size: 0.8rem;
            font-style: italic;
        }
        
        .user-benefits {
            background: #f9f9f9;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
            border-left: 4px solid #FFD700;
        }
        
        .user-benefits h4 {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #000;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .user-benefits ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .user-benefits li {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 10px;
            color: #333;
            font-size: 0.9rem;
        }
        
        .user-benefits li i {
            color: #FFD700;
            margin-top: 3px;
        }
        
        .user-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .stat-card {
            background: #fff;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .stat-icon {
            width: 40px;
            height: 40px;
            background: #FFD700;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            color: #000;
            font-size: 18px;
        }
        
        .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #000;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 0.8rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .user-actions {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .user-actions .btn {
            flex: 1;
        }
        
        .account-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        
        .account-links a {
            color: #666;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.9rem;
            transition: color 0.3s ease;
        }
        
        .account-links a:hover {
            color: #FFD700;
        }
        
        /* Fallback Auth Styles */
        .fallback-auth {
            padding: 20px;
        }
        
        .fallback-header {
            text-align: center;
            margin-bottom: 25px;
        }
        
        .fallback-header h3 {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: #000;
            margin-bottom: 10px;
        }
        
        .fallback-header p {
            color: #666;
            font-size: 0.9rem;
        }
        
        .fallback-options {
            margin-bottom: 25px;
        }
        
        .auth-method {
            margin-bottom: 20px;
        }
        
        .auth-btn {
            width: 100%;
            padding: 15px;
            background: #000;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .auth-btn:hover {
            background: #333;
            transform: translateY(-2px);
        }
        
        .auth-note {
            text-align: center;
            color: #888;
            font-size: 0.8rem;
            margin-top: 5px;
        }
        
        .auth-divider {
            text-align: center;
            position: relative;
            margin: 25px 0;
        }
        
        .auth-divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #eee;
        }
        
        .auth-divider span {
            background: #fff;
            padding: 0 15px;
            color: #888;
            font-size: 0.9rem;
            position: relative;
        }
        
        .social-auth {
            display: flex;
            gap: 15px;
        }
        
        .social-btn {
            flex: 1;
            padding: 12px;
            border: 1px solid #ddd;
            background: #fff;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .social-btn:hover {
            border-color: #FFD700;
            transform: translateY(-2px);
        }
        
        .google-btn {
            color: #DB4437;
        }
        
        .github-btn {
            color: #333;
        }
        
        .fallback-terms {
            text-align: center;
            color: #888;
            font-size: 0.8rem;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        
        .fallback-terms a {
            color: #FFD700;
            text-decoration: none;
        }
        
        .fallback-terms a:hover {
            text-decoration: underline;
        }
        
        /* Firebase Auth Modal Styles */
        .firebase-auth-modal {
            padding: 20px;
        }
        
        .auth-tabs {
            display: flex;
            border-bottom: 1px solid #eee;
            margin-bottom: 25px;
        }
        
        .auth-tab {
            flex: 1;
            padding: 12px;
            background: none;
            border: none;
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
            font-weight: 500;
            color: #888;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
        }
        
        .auth-tab.active {
            color: #000;
            border-bottom: 3px solid #FFD700;
        }
        
        .auth-content {
            position: relative;
            min-height: 300px;
        }
        
        .auth-form {
            display: none;
        }
        
        .auth-form.active {
            display: block;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
            font-size: 0.9rem;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #FFD700;
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }
        
        .form-hint {
            display: block;
            margin-top: 5px;
            color: #888;
            font-size: 0.8rem;
        }
        
        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            color: #666;
        }
        
        .checkbox input {
            margin: 0;
        }
        
        .forgot-password {
            color: #FFD700;
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .forgot-password:hover {
            text-decoration: underline;
        }
        
        .auth-back {
            text-align: center;
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        
        .auth-back button {
            background: none;
            border: none;
            color: #666;
            font-family: 'Poppins', sans-serif;
            font-size: 0.9rem;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            transition: color 0.3s ease;
        }
        
        .auth-back button:hover {
            color: #FFD700;
        }
        
        /* Global Notification Styles */
        .global-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #fff;
            border-left: 4px solid;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            padding: 15px 20px;
            min-width: 300px;
            max-width: 400px;
            z-index: 9999;
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation: slideInRight 0.3s ease;
        }
        
        .notification-success {
            border-left-color: #28a745;
        }
        
        .notification-error {
            border-left-color: #dc3545;
        }
        
        .notification-warning {
            border-left-color: #ffc107;
        }
        
        .notification-info {
            border-left-color: #17a2b8;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification-success .notification-content i {
            color: #28a745;
        }
        
        .notification-error .notification-content i {
            color: #dc3545;
        }
        
        .notification-warning .notification-content i {
            color: #ffc107;
        }
        
        .notification-info .notification-content i {
            color: #17a2b8;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #888;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            margin-left: 15px;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add Clerk styles
    addClerkStyles();
    
    // Initialize Clerk
    if (typeof Clerk !== 'undefined') {
        initializeClerk();
    } else {
        // Wait for Clerk to load
        const checkClerk = setInterval(() => {
            if (typeof Clerk !== 'undefined') {
                clearInterval(checkClerk);
                initializeClerk();
            }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkClerk);
            if (typeof Clerk === 'undefined') {
                console.error('Clerk failed to load after 5 seconds');
                setupFallbackAuth();
            }
        }, 5000);
    }
});

// Export functions for use in other modules
export { initializeClerk, setupClerkUI, handleAuthStateChange };
