/**
 * SlimEasy Theme Management
 * Handles theme setting, loading and toggle functionality
 */

// Initialize theme when page loads
function initializeTheme() {
    // First load the theme
    loadTheme();
    
    // Then create the toggle button
    createThemeToggle();
}

/**
 * Load theme based on saved preference or device setting
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Use saved user preference
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Use system preference (dark mode)
        setTheme('dark');
    } else {
        // Default to light mode
        setTheme('light');
    }
}

/**
 * Set theme by updating data-theme attribute and saving to localStorage
 * @param {string} themeName - 'light' or 'dark'
 */
function setTheme(themeName) {
    // Save to localStorage for persistence
    localStorage.setItem('theme', themeName);
    
    // Update document root attribute
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Update any existing toggle button
    const existingToggle = document.querySelector('.theme-toggle');
    if (existingToggle) {
        existingToggle.innerHTML = themeName === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }
}

/**
 * Create theme toggle button and add to document
 */
function createThemeToggle() {
    // Prevent multiple toggle buttons
    if (document.querySelector('.theme-toggle')) {
        return;
    }
    
    // Create button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
    themeToggle.setAttribute('title', 'Toggle dark/light mode');
    
    // Set initial icon based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    themeToggle.innerHTML = currentTheme === 'dark' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    
    // Add click handler
    themeToggle.addEventListener('click', toggleTheme);
    
    // Add to document
    document.body.appendChild(themeToggle);
    
    // Add theme toggle styles if they don't exist
    addThemeToggleStyles();
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply the new theme
    setTheme(newTheme);
}

/**
 * Add theme toggle button styles to the document
 */
function addThemeToggleStyles() {
    // Check if styles already exist
    if (document.getElementById('theme-toggle-styles')) {
        return;
    }
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'theme-toggle-styles';
    style.textContent = `
        .theme-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.3s ease;
        }
        
        .theme-toggle:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .theme-toggle:active {
            transform: translateY(0);
        }
        
        @media (max-width: 768px) {
            .theme-toggle {
                width: 40px;
                height: 40px;
                bottom: 15px;
                right: 15px;
                font-size: 16px;
            }
        }
    `;
    
    // Add to document head
    document.head.appendChild(style);
}

// Export the theme functions for use in other files
window.initializeTheme = initializeTheme;
window.setTheme = setTheme;
window.toggleTheme = toggleTheme;
window.addThemeToggleStyles = addThemeToggleStyles;
