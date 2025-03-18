/**
 * SlimEasy Dark Mode Fix
 * Ensures dark mode is properly applied across all pages
 */

// Immediately invoke function to set theme based on user preference
(function() {
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
     * Set theme by updating data-theme attribute
     * @param {string} themeName - 'light' or 'dark'
     */
    function setTheme(themeName) {
        // Save to localStorage for persistence
        localStorage.setItem('theme', themeName);
        
        // Update document root attribute
        document.documentElement.setAttribute('data-theme', themeName);
        
        // Add class to body for additional styling hooks
        if (document.body) {
            if (themeName === 'dark') {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
            } else {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
            }
        }
        
        // Update meta theme-color for browser UI
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', 
                themeName === 'dark' ? '#121212' : '#00BFA5');
        }
        
        // Dispatch an event that theme has changed
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName }
        }));
    }
    
    // Try to load theme early
    loadTheme();
    
    // Also wait for DOM content to be fully loaded to ensure theme toggle works
    document.addEventListener('DOMContentLoaded', function() {
        // Check if theme.js is loaded and initializeTheme function exists
        if (typeof window.initializeTheme === 'function') {
            window.initializeTheme();
        } else {
            console.log('Creating theme toggle manually');
            loadTheme();
            createThemeToggle();
        }
    });
    
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
        
        // Update button icon
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = newTheme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
            
            // Add animation effect
            themeToggle.classList.add('theme-toggle-animate');
            setTimeout(() => {
                themeToggle.classList.remove('theme-toggle-animate');
            }, 500);
        }
        
        // Show quick feedback to user
        if (typeof showNotification === 'function') {
            showNotification(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`, 'info');
        }
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
                background-color: var(--primary-color, #00BFA5);
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
            
            .theme-toggle-animate {
                animation: rotate 0.5s ease-in-out;
            }
            
            @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            [data-theme="dark"] .theme-toggle {
                background-color: #FF6D00; /* Orange in dark mode */
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
})();