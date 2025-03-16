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
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => {
                    console.log('Service Worker registered');
                    
                    // Add push notification support in future versions
                    if (reg.pushManager) {
                        console.log('Push notification support available');
                    }
                })
                .catch(err => console.log('Service Worker failed:', err));
        });
    }
}

/**
 * Set up mobile menu toggle functionality
 */
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('mainNavLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            
            // Change icon based on state
            const icon = this.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('show')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
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
    
    // Check user login
    return checkUserLogin();
}

// Export utilities to global scope
window.getFromStorage = getFromStorage;
window.saveToStorage = saveToStorage;
window.formatNumber = formatNumber;
window.createElement = createElement;
window.debounce = debounce;
window.showNotification = showNotification;
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
window.requestNotificationPermission = requestNotificationPermission;
window.sendHydrationReminder = sendHydrationReminder;
window.initializeHydrationReminders = initializeHydrationReminders;
window.checkHydrationStatus = checkHydrationStatus;
window.registerServiceWorker = registerServiceWorker;
window.setupMobileMenu = setupMobileMenu;
window.checkUserLogin = checkUserLogin;
window.initializePage = initializePage;
