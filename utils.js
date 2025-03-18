/**
 * SlimEasy Utility Functions
 * Common utility functions for use across the application
 */

/**
 * Safely parse JSON from localStorage with error handling
 * @param {string} key - localStorage key to retrieve
 * @param {*} defaultValue - Default value if key not found or invalid
 * @returns {*} Parsed value or default
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        console.error(`Error retrieving ${key} from localStorage:`, error);
        return defaultValue;
    }
}

/**
 * Get the user's daily water count
 * @returns {Object} Water count data and key
 */
function getWaterCount() {
    try {
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) return { count: 0 };
        
        // Format date for storage key - YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        const waterKey = `water_${currentUser.email}_${today}`;
        
        // Get existing water count from storage
        const waterCount = parseInt(localStorage.getItem(waterKey) || '0');
        return { count: waterCount, key: waterKey };
    } catch (error) {
        console.error('Error getting water count:', error);
        return { count: 0 };
    }
}

/**
 * Safely save JSON to localStorage with error handling
 * @param {string} key - localStorage key to set
 * @param {*} value - Value to stringify and store
 * @returns {boolean} Success status
 */
function saveToStorage(key, value) {
    try {
        // Save to localStorage
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
        return false;
    }
}

/**
 * Format a number with specified precision
 * @param {number} value - Number to format
 * @param {number} precision - Decimal places to round to
 * @returns {string} Formatted number
 */
function formatNumber(value, precision = 0) {
    return Number(value).toFixed(precision);
}

/**
 * Create an element with specified attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Element attributes 
 * @param {Array|string} children - Child elements or text content
 * @returns {HTMLElement} Created element
 */
function createElement(tag, attrs = {}, children = []) {
    const element = document.createElement(tag);
    
    // Add attributes
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'class' || key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Add children
    if (typeof children === 'string' || typeof children === 'number') {
        element.textContent = children;
    } else if (Array.isArray(children)) {
        children.forEach(child => {
            if (child instanceof HTMLElement) {
                element.appendChild(child);
            } else if (child !== null && child !== undefined) {
                element.appendChild(document.createTextNode(String(child)));
            }
        });
    }
    
    return element;
}

/**
 * Debounce a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Show a notification toast
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', 'info', 'warning'
 * @param {number} duration - Time in ms to show notification
 */
function showNotification(message, type = 'success', duration = 3000) {
    // Check if notification container exists
    let container = document.getElementById('notification-container');
    
    if (!container) {
        container = createElement('div', {
            id: 'notification-container',
            style: {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: '1000'
            }
        });
        document.body.appendChild(container);
    }
    
    // Set color based on type
    const colors = {
        success: 'var(--success-color, #4CAF50)',
        error: 'var(--error-color, #F44336)',
        warning: 'var(--warning-color, #FFC107)',
        info: 'var(--info-color, #2196F3)'
    };
    
    // Create notification element
    const notification = createElement('div', {
        style: {
            backgroundColor: colors[type] || colors.info,
            color: 'white',
            padding: '15px',
            margin: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            transform: 'translateX(100%)',
            opacity: '0',
            transition: 'all 0.3s'
        }
    }, [
        createElement('i', {
            class: `fas fa-${type === 'success' ? 'check-circle' : 
                  type === 'error' ? 'exclamation-circle' :
                  type === 'warning' ? 'exclamation-triangle' : 'info-circle'}`,
            style: {
                marginRight: '10px'
            }
        }),
        message
    ]);
    
    // Add to container
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 50);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (container.contains(notification)) {
                container.removeChild(notification);
            }
        }, 300);
    }, duration);
}

/**
 * Register service worker for PWA functionality
 */
function registerServiceWorker() {
    // Prevent multiple registration attempts
    if (window._serviceWorkerRegistrationAttempted) {
        return;
    }
    
    // Mark that we've attempted registration
    window._serviceWorkerRegistrationAttempted = true;
    
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
        console.log('Service Workers not supported in this browser');
        return;
    }
    
    // Service workers only work on HTTPS or localhost (not on file:// protocol)
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    const isSecure = window.location.protocol === 'https:';
    
    // Check if we're in a valid protocol
    if (!isSecure && !isLocalhost) {
        // Only log the error if we're not on file:// protocol (avoid spamming console during development)
        if (window.location.protocol !== 'file:') {
            console.warn('Service Worker registration skipped: must be served over HTTPS or localhost');
        }
        return;
    }
    
    // Ensure we're only registering once
    if (navigator.serviceWorker.controller) {
        console.log('Service Worker already controlling this page');
        return;
    }
    
    // Proceed with registration when the page loads
    const registerSW = () => {
        try {
            // Make sure we haven't already registered
            if (window._serviceWorkerRegistered) return;
            
            navigator.serviceWorker.register('./sw.js', { scope: './' })
                .then(reg => {
                    window._serviceWorkerRegistered = true;
                    console.log('Service Worker registered successfully');
                    
                    // Add push notification support in future versions
                    if (reg.pushManager) {
                        console.log('Push notification support available');
                    }
                })
                .catch(err => {
                    console.warn('Service Worker registration failed:', err);
                    // Don't show error in console during local development
                    if (window.location.protocol === 'file:') {
                        console.info('Note: Service Workers require HTTP/HTTPS to function');
                    }
                });
        } catch (e) {
            console.warn('Error during Service Worker registration:', e);
        }
    };
    
    // Register on load
    if (document.readyState === 'complete') {
        registerSW();
    } else {
        window.addEventListener('load', registerSW);
    }
}

/**
 * Set up mobile menu toggle functionality
 */
function setupMobileMenu() {
    console.log('setupMobileMenu called');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('mainNavLinks');
    const mainNav = document.querySelector('.main-nav');
    
    // Exit early if elements don't exist
    if (!menuToggle) {
        console.warn('Mobile menu toggle not found');
        return;
    }
    
    if (!navLinks) {
        console.warn('Navigation links element not found');
        return;
    }
    
    console.log('Found mobile menu elements', { menuToggle, navLinks });
    
    // Remove any existing event listeners by cloning and replacing the element
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    
    // Function to toggle menu state
    function toggleMenu() {
        navLinks.classList.toggle('show');
        
        // Change icon based on state
        const icon = newMenuToggle.querySelector('i');
        if (icon) {
            if (navLinks.classList.contains('show')) {
                icon.className = 'fas fa-times';
                // Add class to toggle button for visual feedback
                newMenuToggle.classList.add('active');
                
                // Prevent body scrolling when menu is open
                document.body.style.overflow = 'hidden';
                
                // Log state for debugging
                console.log('Menu opened');
            } else {
                icon.className = 'fas fa-bars';
                newMenuToggle.classList.remove('active');
                
                // Restore scrolling
                document.body.style.overflow = '';
                
                // Log state for debugging
                console.log('Menu closed');
            }
        }
    }
    
    // Function to close the menu
    function closeMenu() {
        if (!navLinks.classList.contains('show')) return;
        
        navLinks.classList.remove('show');
        const icon = newMenuToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
            newMenuToggle.classList.remove('active');
        }
        
        // Restore scrolling
        document.body.style.overflow = '';
    }
    
    // Add the click event listener to the menu toggle
    newMenuToggle.addEventListener('click', function(e) {
        console.log('Menu toggle clicked');
        e.stopPropagation(); // Prevent event from bubbling to document
        e.preventDefault(); // Prevent any default behavior
        toggleMenu();
    });
    
    // Add touch event for better mobile responsiveness
    newMenuToggle.addEventListener('touchend', function(e) {
        console.log('Menu toggle touched');
        e.preventDefault(); // Prevent default touch behavior
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking on navigation links and navigate to the link's destination
    const navLinkElements = navLinks.querySelectorAll('a');
    navLinkElements.forEach(link => {
        // Use both click and touchend for better mobile response
        link.addEventListener('click', function(e) {
            // Store the href before closing the menu
            const href = link.getAttribute('href');
            
            // First close the menu
            closeMenu();
            
            // Then navigate to the link's href, using setTimeout to ensure other click handlers run first
            if (href) {
                console.log('Navigating to: ' + href);
                setTimeout(() => {
                    window.location.href = href;
                }, 10);
            }
            
            // Prevent the default action but don't stop propagation
            // This allows other click handlers to still work
            e.preventDefault();
        });
        
        link.addEventListener('touchend', function(e) {
            // Store the href before closing the menu
            const href = link.getAttribute('href');
            
            // First close the menu
            closeMenu();
            
            // Then navigate to the link's href after a slight delay to ensure menu closes first
            if (href) {
                setTimeout(() => {
                    console.log('Navigating to: ' + href);
                    window.location.href = href;
                }, 50);
            }
            
            // Prevent the default action but don't stop propagation
            // This allows other touch handlers to still work
            e.preventDefault();
        });
    });
    
    // Close menu when clicking outside of the menu
    document.addEventListener('click', function(e) {
        // Check if the menu is open and the click is outside the main nav
        if (navLinks.classList.contains('show') && 
            mainNav && !mainNav.contains(e.target)) {
            closeMenu();
            // Do not stopPropagation or preventDefault here
            // This ensures other click handlers still work
        }
    });
    
    // Handle touch events outside menu
    document.addEventListener('touchend', function(e) {
        if (navLinks.classList.contains('show') && 
            mainNav && !mainNav.contains(e.target)) {
            closeMenu();
            // Do not stopPropagation or preventDefault here
            // This ensures other touch handlers still work
        }
    });
    
    // Close menu on resize to landscape
    window.addEventListener('resize', function() {
        // Close menu when screen becomes larger than mobile breakpoint
        if (window.innerWidth > 768 && navLinks.classList.contains('show')) {
            closeMenu();
        }
    });
    
    // Log success
    console.log('Mobile menu initialized successfully with improved touch behavior');
}

/**
 * Check user login status and redirect if not logged in
 * @returns {boolean} True if user is logged in, false otherwise
 */
function checkUserLogin() {
    // Check if user is logged in
    const currentUser = getFromStorage('currentUser');
    if (!currentUser || !currentUser.email) {
        window.location.href = 'login.html';
        return false;
    }
    
    // Ensure user data exists
    ensureUserDataStructures(currentUser.email);
    
    // Display welcome message
    const welcomeElement = document.getElementById('welcomeMessage');
    if (welcomeElement && currentUser.name) {
        welcomeElement.textContent = `Welcome, ${currentUser.name}`;
    }
    
    return true;
}

/**
 * Ensure all necessary data structures exist for a user
 * @param {string} email - User email
 */
function ensureUserDataStructures(email) {
    if (!email) return;
    
    // Check profile data
    const profileKey = `profile_${email}`;
    let profile = getFromStorage(profileKey);
    if (!profile) {
        profile = {};
        saveToStorage(profileKey, profile);
    }
    
    // Check weight history
    const weightDataKey = `weight_history_${email}`;
    if (!getFromStorage(weightDataKey)) {
        saveToStorage(weightDataKey, []);
    }
    
    // Check planner data
    const userKey = `planner_${email}`;
    const weeklyCalories = getFromStorage(`${userKey}_calories`);
    if (!weeklyCalories) {
        saveToStorage(`${userKey}_calories`, [0, 0, 0, 0, 0, 0, 0]);
    }
    
    const weeklyExercise = getFromStorage(`${userKey}_exercise`);
    if (!weeklyExercise) {
        saveToStorage(`${userKey}_exercise`, [0, 0, 0, 0, 0, 0, 0]);
    }
    
    const weeklyFoods = getFromStorage(`${userKey}_foods`);
    if (!weeklyFoods) {
        saveToStorage(`${userKey}_foods`, [[], [], [], [], [], [], []]);
    }
    
    // Check achievements
    const achievementsKey = `achievements_${email}`;
    if (!getFromStorage(achievementsKey)) {
        saveToStorage(achievementsKey, { earned: {}, points: 0 });
    }
}

/**
 * Initialize common page elements and behavior
 */
function initializePage() {
    // First initialize theme
    initializeTheme();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Register service worker (if in proper environment)
    if (window.location.protocol !== 'file:') {
        registerServiceWorker();
    }
    
    // Check user login
    return checkUserLogin();
}

/**
 * Auto-initialize mobile menu on all pages
 * This self-initializing function is a fallback to ensure the menu works
 * even if initializePage() is not explicitly called
 */
(function autoInitMobileMenu() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMobileMenuWrapper);
    } else {
        setupMobileMenuWrapper();
    }
    
    // Add to window load event as well for reliability
    window.addEventListener('load', setupMobileMenuWrapper);
    
    function setupMobileMenuWrapper() {
        console.log('Auto-initializing mobile menu');
        // Increased timeout to ensure DOM is fully ready and accessible
        setTimeout(function() {
            console.log('Setting up mobile menu after delay');
            setupMobileMenu();
            
            // Add direct click handler to menu toggle as a fallback
            const menuToggle = document.getElementById('menuToggle');
            if (menuToggle) {
                console.log('Adding fallback click handler to menu toggle');
                menuToggle.onclick = function(e) {
                    console.log('Menu toggle clicked via direct onclick');
                    e.preventDefault();
                    const navLinks = document.getElementById('mainNavLinks');
                    if (navLinks) {
                        navLinks.classList.toggle('show');
                        const icon = this.querySelector('i');
                        if (icon) {
                            if (navLinks.classList.contains('show')) {
                                icon.className = 'fas fa-times';
                                this.classList.add('active');
                                document.body.style.overflow = 'hidden';
                                
                                // Add click handlers to the nav links for navigation
                                const navLinkElements = navLinks.querySelectorAll('a');
                                navLinkElements.forEach(link => {
                                    // Remove existing handlers first by cloning and replacing
                                    const newLink = link.cloneNode(true);
                                    link.parentNode.replaceChild(newLink, link);
                                    
                                    // Add new handler to navigate to the link's href
                                    newLink.addEventListener('click', function(e) {
                                        // Store the href before closing the menu
                                        const href = newLink.getAttribute('href');
                                        
                                        // Close menu first
                                        navLinks.classList.remove('show');
                                        menuToggle.querySelector('i').className = 'fas fa-bars';
                                        menuToggle.classList.remove('active');
                                        document.body.style.overflow = '';
                                        
                                        // Then navigate, using setTimeout to ensure other click handlers run first
                                        if (href) {
                                            console.log('Navigating to: ' + href);
                                            setTimeout(() => {
                                                window.location.href = href;
                                            }, 10);
                                        }
                                        
                                        // Prevent default but don't stop propagation
                                        // This allows other click handlers to still run
                                        e.preventDefault();
                                    });
                                });
                            } else {
                                icon.className = 'fas fa-bars';
                                this.classList.remove('active');
                                document.body.style.overflow = '';
                            }
                        }
                    }
                    return false;
                };
            }
        }, 300); // Increased delay for better reliability
    }
})();

// Export utilities to global scope
window.getFromStorage = getFromStorage;
window.saveToStorage = saveToStorage;
window.formatNumber = formatNumber;
window.createElement = createElement;
window.debounce = debounce;
window.showNotification = showNotification;
window.setupMobileMenu = setupMobileMenu;
window.initializePage = initializePage;
window.toggleMainMobileMenu = function() {
    console.log('Global toggle function called');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('mainNavLinks');
    if (menuToggle && navLinks) {
        navLinks.classList.toggle('show');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (navLinks.classList.contains('show')) {
                icon.className = 'fas fa-times';
                menuToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Add click handlers to nav links for navigation
                const navLinkElements = navLinks.querySelectorAll('a');
                navLinkElements.forEach(link => {
                    // Remove existing handlers first by cloning and replacing
                    const newLink = link.cloneNode(true);
                    link.parentNode.replaceChild(newLink, link);
                    
                    // Add new handler for navigation
                    newLink.addEventListener('click', function(e) {
                        // Store the href before closing the menu
                        const href = newLink.getAttribute('href');
                        
                        // Close menu first
                        navLinks.classList.remove('show');
                        icon.className = 'fas fa-bars';
                        menuToggle.classList.remove('active');
                        document.body.style.overflow = '';
                        
                        // Then navigate, using setTimeout to ensure other click handlers run first
                        if (href) {
                            console.log('Navigating to: ' + href);
                            setTimeout(() => {
                                window.location.href = href;
                            }, 10);
                        }
                        
                        // Prevent default but don't stop propagation
                        // This allows other click handlers to still run
                        e.preventDefault();
                    });
                });
            } else {
                icon.className = 'fas fa-bars';
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    } else {
        console.warn('Menu elements not found for global toggle');
    }
};
/**
 * Request notification permission
 * @returns {Promise} Promise that resolves with the permission status
 */
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return 'denied';
    }
    
    if (Notification.permission === 'granted') {
        return 'granted';
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission;
    }
    
    return Notification.permission;
}

/**
 * Send a hydration reminder notification
 * @param {number} waterCount - Current water count
 */
function sendHydrationReminder(waterCount) {
    if (Notification.permission !== 'granted') return;
    
    const remainingGlasses = 8 - waterCount;
    
    if (remainingGlasses <= 0) return;
    
    const options = {
        body: `You've had ${waterCount} glasses of water today. Remember to drink ${remainingGlasses} more to reach your goal!`,
        icon: 'slimeasylogo.jpg',
        badge: 'slimeasylogo.jpg',
        tag: 'hydration-reminder',
        renotify: true,
        requireInteraction: true,
        actions: [
            { action: 'add-water', title: 'Record a Glass' },
            { action: 'dismiss', title: 'Dismiss' }
        ],
        data: { waterCount }
    };
    
    const notification = new Notification('Hydration Reminder', options);
    
    notification.onclick = function(event) {
        if (event.action === 'add-water') {
            // Update water count
            const data = getWaterCount();
            if (data.key) {
                const newCount = Math.min(data.count + 1, 8);
                localStorage.setItem(data.key, newCount);
                
                // Update UI if on the tracker page
                const waterContainer = document.getElementById('waterGlasses');
                if (waterContainer) {
                    updateWaterDisplay(newCount);
                    showNotification('Water intake updated!', 'success');
                }
            }
        }
        
        // Focus on window if clicked
        window.focus();
        notification.close();
    };
}

/**
 * Update water display UI elements
 * @param {number} count - Number of water glasses consumed
 */
function updateWaterDisplay(count) {
    // Get UI elements
    const waterContainer = document.getElementById('waterGlasses');
    const waterProgress = document.getElementById('waterProgress');
    const waterStatus = document.getElementById('waterStatus');
    
    if (!waterContainer) return;
    
    // Clear previous glasses
    waterContainer.innerHTML = '';
    
    // Create glass elements
    for (let i = 0; i < 8; i++) {
        const glass = document.createElement('div');
        glass.className = i < count ? 'water-glass filled' : 'water-glass';
        glass.innerHTML = '<i class="fas fa-glass-water"></i>';
        waterContainer.appendChild(glass);
    }
    
    // Update progress bar if exists
    if (waterProgress) {
        const percent = Math.min(Math.round((count / 8) * 100), 100);
        waterProgress.style.width = `${percent}%`;
    }
    
    // Update status text if exists
    if (waterStatus) {
        waterStatus.textContent = `${count}/8 glasses`;
    }
}

/**
 * Initialize hydration reminders
 * @param {number} intervalMinutes - Reminder interval in minutes
 */
function initializeHydrationReminders(intervalMinutes = 120) {
    // Check if reminders are already running (avoid duplicates)
    if (window.hydrationReminderInterval) {
        clearInterval(window.hydrationReminderInterval);
    }
    
    // Request notification permission
    requestNotificationPermission()
        .then(permission => {
            if (permission === 'granted') {
                // Initial check when page loads
                setTimeout(checkHydrationStatus, 60000); // Check after 1 minute
                
                // Set interval for periodic checks
                window.hydrationReminderInterval = setInterval(checkHydrationStatus, intervalMinutes * 60000);
                
                console.log(`Hydration reminders initialized (${intervalMinutes} minute intervals)`);
            }
        })
        .catch(error => {
            console.error('Error requesting notification permission:', error);
        });
    
    // Store user preference
    const currentUser = getFromStorage('currentUser');
    if (currentUser && currentUser.email) {
        saveToStorage(`hydration_reminders_${currentUser.email}`, { 
            enabled: true, 
            interval: intervalMinutes 
        });
    }
}

/**
 * Check hydration status and send reminder if needed
 */
function checkHydrationStatus() {
    const { count } = getWaterCount();
    
    // Only send reminder if less than 8 glasses
    if (count < 8) {
        // Check time of day (only send between 8 AM and 10 PM)
        const currentHour = new Date().getHours();
        if (currentHour >= 8 && currentHour < 22) {
            sendHydrationReminder(count);
        }
    }
}

window.getWaterCount = getWaterCount;
window.updateWaterDisplay = updateWaterDisplay;
window.requestNotificationPermission = requestNotificationPermission;
window.sendHydrationReminder = sendHydrationReminder;
window.initializeHydrationReminders = initializeHydrationReminders;
window.checkHydrationStatus = checkHydrationStatus;
window.registerServiceWorker = registerServiceWorker;
window.setupMobileMenu = setupMobileMenu;
window.checkUserLogin = checkUserLogin;
window.initializePage = initializePage;
