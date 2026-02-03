// script.js - PrintSome 3D Printing Service

// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const userButton = document.getElementById('user-button');
const userText = document.getElementById('user-text');
const authModal = document.getElementById('auth-modal');
const closeAuth = document.querySelector('.close-auth');
const ctaSignup = document.getElementById('cta-signup');
const footerLogin = document.getElementById('footer-login');
const mobileAuthBtn = document.getElementById('mobile-auth-btn');
const cartButtons = document.querySelectorAll('.add-to-cart');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.querySelector('.cart-footer .btn');

// State
let cart = JSON.parse(localStorage.getItem('printsome-cart')) || [];
let isLoggedIn = false;
let currentUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize authentication
    initAuth();
    
    // Initialize cart
    initCart();
    
    // Initialize animations
    initAnimations();
    
    // Update cart display
    updateCartDisplay();
    
    // Check if user is logged in (simulated)
    checkAuthStatus();
});

// Mobile Menu Toggle
function initMobileMenu() {
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });
    
    // Close mobile menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        });
    });
    
    // Update active nav link
    updateActiveNavLink();
}

// Update active navigation link based on current page
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    mobileNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Authentication
function initAuth() {
    // Open auth modal
    const authTriggers = [userButton, ctaSignup, footerLogin, mobileAuthBtn];
    
    authTriggers.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                openAuthModal();
            });
        }
    });
    
    // Close auth modal
    if (closeAuth) {
        closeAuth.addEventListener('click', closeAuthModal);
    }
    
    // Close modal when clicking outside
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });
}

function openAuthModal() {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Simulate authentication status (would be replaced with Clerk/Firebase)
function checkAuthStatus() {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('printsome-user');
    
    if (userData) {
        currentUser = JSON.parse(userData);
        isLoggedIn = true;
        updateUserDisplay();
    }
}

function updateUserDisplay() {
    if (isLoggedIn && currentUser) {
        userText.textContent = currentUser.name.split(' ')[0];
        userButton.innerHTML = `<i class="fas fa-user"></i> <span id="user-text">${currentUser.name.split(' ')[0]}</span>`;
        
        // Update auth modal to show user info
        const authBody = document.querySelector('.auth-body');
        if (authBody) {
            authBody.innerHTML = `
                <div class="user-profile">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <h3>Welcome, ${currentUser.name}</h3>
                    <p>Email: ${currentUser.email}</p>
                    <div class="user-benefits">
                        <h4><i class="fas fa-crown"></i> Your Benefits</h4>
                        <ul>
                            <li><i class="fas fa-check-circle"></i> Member discount: 15% off all products</li>
                            <li><i class="fas fa-check-circle"></i> Free shipping on all orders</li>
                            <li><i class="fas fa-check-circle"></i> Priority customer support</li>
                            <li><i class="fas fa-check-circle"></i> Access to exclusive products</li>
                        </ul>
                    </div>
                    <button id="logout-btn" class="btn btn-secondary">Log Out</button>
                </div>
            `;
            
            document.getElementById('logout-btn').addEventListener('click', logout);
        }
    }
}

// Simulate login (would be replaced with Clerk/Firebase)
function simulateLogin() {
    currentUser = {
        name: "Alex Johnson",
        email: "alex@example.com",
        memberSince: "2023-01-15",
        discount: 15
    };
    
    isLoggedIn = true;
    localStorage.setItem('printsome-user', JSON.stringify(currentUser));
    updateUserDisplay();
    closeAuthModal();
    
    // Show success message
    showNotification('Successfully logged in! Welcome back.', 'success');
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('printsome-user');
    
    userText.textContent = 'Sign In';
    userButton.innerHTML = `<i class="fas fa-user"></i> <span id="user-text">Sign In</span>`;
    
    // Reset auth modal
    const authBody = document.querySelector('.auth-body');
    if (authBody) {
        authBody.innerHTML = `
            <div id="clerk-auth"></div>
            <div class="auth-benefits">
                <h4><i class="fas fa-star"></i> Member Benefits</h4>
                <ul>
                    <li><i class="fas fa-check-circle"></i> Exclusive discounts</li>
                    <li><i class="fas fa-check-circle"></i> Early access to new products</li>
                    <li><i class="fas fa-check-circle"></i> Free shipping on orders over €50</li>
                    <li><i class="fas fa-check-circle"></i> Custom design requests</li>
                    <li><i class="fas fa-check-circle"></i> Loyalty points program</li>
                </ul>
            </div>
        `;
    }
    
    closeAuthModal();
    showNotification('You have been logged out.', 'info');
}

// Shopping Cart
function initCart() {
    // Add to cart buttons
    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            addToCart(productName);
        });
    });
    
    // Cart toggle
    const cartIcon = document.createElement('button');
    cartIcon.className = 'cart-icon';
    cartIcon.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    cartIcon.addEventListener('click', toggleCart);
    
    // Add cart icon to navbar
    const navContainer = document.querySelector('.nav-links');
    if (navContainer) {
        navContainer.insertBefore(cartIcon, userButton);
    }
    
    // Close cart
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    // Close cart when clicking overlay
    cartOverlay.addEventListener('click', closeCartSidebar);
    
    // Initialize checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : 'auto';
}

function openCartSidebar() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function addToCart(productName) {
    // Find product in our product list
    const products = {
        'Infinity Cube': { price: 12.99, image: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
        'Premium Fidget Spinner': { price: 9.99, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
        'Mechanical Gear Fidget': { price: 15.99, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }
    };
    
    const product = products[productName];
    
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('printsome-cart', JSON.stringify(cart));
    
    // Update display
    updateCartDisplay();
    
    // Show notification
    showNotification(`Added ${productName} to cart!`, 'success');
    
    // Open cart sidebar
    openCartSidebar();
}

function updateCartDisplay() {
    // Update cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Checkout';
        }
    } else {
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-decrease" data-product="${item.name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-increase" data-product="${item.name}">+</button>
                        <button class="cart-item-remove" data-product="${item.name}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Add event listeners for quantity buttons
        document.querySelectorAll('.quantity-decrease').forEach(button => {
            button.addEventListener('click', function() {
                updateQuantity(this.getAttribute('data-product'), -1);
            });
        });
        
        document.querySelectorAll('.quantity-increase').forEach(button => {
            button.addEventListener('click', function() {
                updateQuantity(this.getAttribute('data-product'), 1);
            });
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                removeFromCart(this.getAttribute('data-product'));
            });
        });
        
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = `Checkout (€${calculateTotal().toFixed(2)})`;
        }
    }
    
    // Update total
    cartTotalPrice.textContent = `€${calculateTotal().toFixed(2)}`;
    
    // Update cart icon badge
    updateCartBadge();
}

function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    
    if (item) {
        item.quantity += change;
        
        // Remove if quantity is 0 or less
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.name !== productName);
        }
        
        // Save to localStorage
        localStorage.setItem('printsome-cart', JSON.stringify(cart));
        
        // Update display
        updateCartDisplay();
    }
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    
    // Save to localStorage
    localStorage.setItem('printsome-cart', JSON.stringify(cart));
    
    // Update display
    updateCartDisplay();
    
    // Show notification
    showNotification(`Removed ${productName} from cart.`, 'info');
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartBadge() {
    const cartIcon = document.querySelector('.cart-icon');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Remove existing badge
    const existingBadge = document.querySelector('.cart-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    // Add badge if there are items
    if (totalItems > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = totalItems;
        cartIcon.appendChild(badge);
    }
}

function proceedToCheckout() {
    if (!isLoggedIn) {
        showNotification('Please log in to proceed to checkout.', 'warning');
        openAuthModal();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty.', 'warning');
        return;
    }
    
    // Simulate checkout process
    showNotification('Proceeding to checkout...', 'info');
    
    // In a real application, this would redirect to a checkout page
    setTimeout(() => {
        const orderTotal = calculateTotal();
        const discount = currentUser?.discount || 0;
        const finalTotal = orderTotal * (1 - discount/100);
        
        const orderDetails = {
            items: cart,
            subtotal: orderTotal,
            discount: discount,
            total: finalTotal,
            date: new Date().toISOString(),
            orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };
        
        // Save order to localStorage (simulated)
        const orders = JSON.parse(localStorage.getItem('printsome-orders')) || [];
        orders.push(orderDetails);
        localStorage.setItem('printsome-orders', JSON.stringify(orders));
        
        // Clear cart
        cart = [];
        localStorage.setItem('printsome-cart', JSON.stringify(cart));
        updateCartDisplay();
        
        // Show success message
        showNotification(`Order placed successfully! Order ID: ${orderDetails.orderId}`, 'success');
        
        // Close cart
        closeCartSidebar();
    }, 1500);
}

// Animations
function initAnimations() {
    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll('.feature-card, .product-card, .process-step, .testimonial-card');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // Add sequential delays
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.classList.add(`delay-${index % 3}`);
    });
    
    document.querySelectorAll('.process-step').forEach((step, index) => {
        step.classList.add(`delay-${index % 4}`);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Add close button event
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background-color: #fff;
                border-left: 4px solid;
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                padding: 15px 20px;
                min-width: 300px;
                max-width: 400px;
                z-index: 3000;
                display: flex;
                justify-content: space-between;
                align-items: center;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-info {
                border-color: #17a2b8;
            }
            
            .notification-success {
                border-color: #28a745;
            }
            
            .notification-warning {
                border-color: #ffc107;
            }
            
            .notification-error {
                border-color: #dc3545;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-info .notification-content i {
                color: #17a2b8;
            }
            
            .notification-success .notification-content i {
                color: #28a745;
            }
            
            .notification-warning .notification-content i {
                color: #ffc107;
            }
            
            .notification-error .notification-content i {
                color: #dc3545;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #888;
                cursor: pointer;
                font-size: 1rem;
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
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'times-circle';
        default: return 'info-circle';
    }
}

// Cart icon styles
const cartIconStyles = document.createElement('style');
cartIconStyles.textContent = `
    .cart-icon {
        background: none;
        border: none;
        color: #fff;
        font-size: 1.2rem;
        cursor: pointer;
        position: relative;
        padding: 5px 10px;
    }
    
    .cart-icon:hover {
        color: #FFD700;
    }
    
    .cart-badge {
        position: absolute;
        top: -5px;
        right: 0;
        background-color: #FFD700;
        color: #000;
        font-size: 0.7rem;
        font-weight: 700;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .cart-item {
        display: flex;
        gap: 15px;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
    }
    
    .cart-item:last-child {
        border-bottom: none;
    }
    
    .cart-item-image {
        width: 80px;
        height: 80px;
        border-radius: 5px;
        overflow: hidden;
    }
    
    .cart-item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .cart-item-details {
        flex: 1;
    }
    
    .cart-item-details h4 {
        font-size: 1rem;
        margin-bottom: 5px;
        color: #222;
    }
    
    .cart-item-price {
        font-weight: 600;
        color: #222;
        margin-bottom: 10px;
    }
    
    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .cart-item-quantity button {
        background: none;
        border: 1px solid #ddd;
        width: 25px;
        height: 25px;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    
    .cart-item-quantity button:hover {
        background-color: #f5f5f5;
    }
    
    .cart-item-remove {
        margin-left: auto;
        color: #dc3545;
    }
    
    .user-profile {
        padding: 2rem;
        text-align: center;
    }
    
    .user-avatar {
        width: 80px;
        height: 80px;
        background-color: #f5f5f5;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        color: #FFD700;
        margin: 0 auto 1.5rem;
    }
    
    .user-benefits {
        text-align: left;
        margin: 2rem 0;
        padding: 1.5rem;
        background-color: #f9f9f9;
        border-radius: 10px;
    }
    
    .user-benefits h4 {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #222;
        margin-bottom: 1rem;
    }
    
    .user-benefits ul {
        list-style: none;
    }
    
    .user-benefits li {
        margin-bottom: 0.8rem;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #555;
    }
    
    .user-benefits li i {
        color: #FFD700;
    }
`;
document.head.appendChild(cartIconStyles);

// Add event listener for Clerk/Firebase initialization
document.addEventListener('DOMContentLoaded', function() {
    // This would be replaced with actual Clerk initialization
    // For now, we'll simulate a login button in the auth modal
    setTimeout(() => {
        const clerkAuth = document.getElementById('clerk-auth');
        if (clerkAuth && !isLoggedIn) {
            clerkAuth.innerHTML = `
                <div class="simulated-auth">
                    <h3>Sign In to PrintSome</h3>
                    <p>Access exclusive member benefits and discounts</p>
                    <div class="auth-options">
                        <button id="simulated-login" class="btn btn-primary btn-block">
                            <i class="fas fa-sign-in-alt"></i> Sign In with Email
                        </button>
                        <div class="auth-divider">
                            <span>or continue with</span>
                        </div>
                        <button class="btn btn-outline btn-block">
                            <i class="fab fa-google"></i> Google
                        </button>
                        <button class="btn btn-outline btn-block">
                            <i class="fab fa-github"></i> GitHub
                        </button>
                        <button class="btn btn-outline btn-block">
                            <i class="fab fa-facebook"></i> Facebook
                        </button>
                    </div>
                    <p class="auth-terms">By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
                </div>
            `;
            
            document.getElementById('simulated-login').addEventListener('click', simulateLogin);
        }
    }, 100);
});

// Page-specific scripts
if (window.location.pathname.includes('products.html')) {
    // Products page scripts would go here
    console.log('Products page loaded');
}

if (window.location.pathname.includes('pricing.html')) {
    // Pricing page scripts would go here
    console.log('Pricing page loaded');
}

if (window.location.pathname.includes('contact.html')) {
    // Contact page scripts would go here
    console.log('Contact page loaded');
}
