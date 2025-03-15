/**
 * SlimEasy Wearable Device Integration Module
 * Provides integration with popular fitness wearables and health platforms
 */

// Supported platforms
const PLATFORMS = {
    FITBIT: 'fitbit',
    APPLE_HEALTH: 'apple_health',
    GOOGLE_FIT: 'google_fit',
    SAMSUNG_HEALTH: 'samsung_health',
    GARMIN: 'garmin'
};

// Tracks connected platforms
let connectedPlatforms = [];

/**
 * Initialize wearable integration functionality
 */
function initializeWearableIntegration() {
    loadConnectedPlatforms();
    renderIntegrationUI();
    setupEventListeners();
}

/**
 * Load previously connected platforms from storage
 */
function loadConnectedPlatforms() {
    try {
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) return;
        
        const key = `wearable_connections_${currentUser.email}`;
        const savedConnections = getFromStorage(key, []);
        
        if (Array.isArray(savedConnections) && savedConnections.length > 0) {
            connectedPlatforms = savedConnections;
            console.log('Loaded connected platforms:', connectedPlatforms);
        }
    } catch (error) {
        console.error('Error loading connected platforms:', error);
    }
}

/**
 * Render the wearable integration UI
 */
function renderIntegrationUI() {
    const container = document.getElementById('wearableIntegrationContainer');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Create section heading
    const heading = document.createElement('h3');
    heading.className = 'section-heading';
    heading.innerHTML = '<i class="fas fa-sync"></i> Connect Wearable Devices';
    container.appendChild(heading);
    
    // Create integration cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'integration-cards';
    container.appendChild(cardsContainer);
    
    // Add integration cards for each platform
    addIntegrationCard(cardsContainer, PLATFORMS.FITBIT, 'Fitbit', 'fa-watch');
    addIntegrationCard(cardsContainer, PLATFORMS.APPLE_HEALTH, 'Apple Health', 'fa-apple');
    addIntegrationCard(cardsContainer, PLATFORMS.GOOGLE_FIT, 'Google Fit', 'fa-google');
    addIntegrationCard(cardsContainer, PLATFORMS.SAMSUNG_HEALTH, 'Samsung Health', 'fa-mobile-alt');
    addIntegrationCard(cardsContainer, PLATFORMS.GARMIN, 'Garmin Connect', 'fa-heartbeat');
    
    // Add sync history section
    addSyncHistorySection(container);
}

/**
 * Add an integration card for a specific platform
 * @param {Element} container - Container element
 * @param {string} platform - Platform identifier
 * @param {string} name - Display name
 * @param {string} icon - FontAwesome icon class
 */
function addIntegrationCard(container, platform, name, icon) {
    const isConnected = connectedPlatforms.some(p => p.platform === platform);
    
    const card = document.createElement('div');
    card.className = `integration-card ${isConnected ? 'connected' : ''}`;
    card.setAttribute('data-platform', platform);
    
    card.innerHTML = `
        <div class="integration-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="integration-info">
            <h4>${name}</h4>
            <p class="status">${isConnected ? 'Connected' : 'Not connected'}</p>
        </div>
        <button class="integration-button ${isConnected ? 'disconnect' : 'connect'}">
            ${isConnected ? 'Disconnect' : 'Connect'}
        </button>
    `;
    
    container.appendChild(card);
}

/**
 * Add sync history section
 * @param {Element} container - Container element
 */
function addSyncHistorySection(container) {
    const syncSection = document.createElement('div');
    syncSection.className = 'sync-history-section';
    syncSection.innerHTML = `
        <h4>Sync History</h4>
        <div class="sync-controls">
            <button id="syncNowButton" class="primary-button">
                <i class="fas fa-sync-alt"></i> Sync Now
            </button>
        </div>
        <div class="sync-history" id="syncHistoryList">
            ${renderSyncHistory()}
        </div>
    `;
    
    container.appendChild(syncSection);
}

/**
 * Render sync history entries
 * @returns {string} HTML for sync history
 */
function renderSyncHistory() {
    const syncHistory = getSyncHistory();
    
    if (syncHistory.length === 0) {
        return '<p class="no-history">No sync history available</p>';
    }
    
    return syncHistory.map(entry => `
        <div class="sync-entry">
            <div class="sync-platform">
                <i class="fas ${getPlatformIcon(entry.platform)}"></i>
                ${getPlatformName(entry.platform)}
            </div>
            <div class="sync-details">
                <div class="sync-time">${formatSyncTime(entry.timestamp)}</div>
                <div class="sync-metrics">${formatSyncMetrics(entry.metrics)}</div>
            </div>
            <div class="sync-status ${entry.status}">
                <i class="fas ${entry.status === 'success' ? 'fa-check' : 'fa-exclamation-triangle'}"></i>
            </div>
        </div>
    `).join('');
}

/**
 * Get sync history for current user
 * @returns {Array} Sync history entries
 */
function getSyncHistory() {
    try {
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) return [];
        
        const key = `wearable_sync_history_${currentUser.email}`;
        return getFromStorage(key, []);
    } catch (error) {
        console.error('Error getting sync history:', error);
        return [];
    }
}

/**
 * Get platform icon class
 * @param {string} platform - Platform identifier
 * @returns {string} FontAwesome icon class
 */
function getPlatformIcon(platform) {
    switch (platform) {
        case PLATFORMS.FITBIT: return 'fa-watch';
        case PLATFORMS.APPLE_HEALTH: return 'fa-apple';
        case PLATFORMS.GOOGLE_FIT: return 'fa-google';
        case PLATFORMS.SAMSUNG_HEALTH: return 'fa-mobile-alt';
        case PLATFORMS.GARMIN: return 'fa-heartbeat';
        default: return 'fa-question';
    }
}

/**
 * Get platform display name
 * @param {string} platform - Platform identifier
 * @returns {string} Display name
 */
function getPlatformName(platform) {
    switch (platform) {
        case PLATFORMS.FITBIT: return 'Fitbit';
        case PLATFORMS.APPLE_HEALTH: return 'Apple Health';
        case PLATFORMS.GOOGLE_FIT: return 'Google Fit';
        case PLATFORMS.SAMSUNG_HEALTH: return 'Samsung Health';
        case PLATFORMS.GARMIN: return 'Garmin Connect';
        default: return 'Unknown Platform';
    }
}

/**
 * Format sync timestamp for display
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} Formatted timestamp
 */
function formatSyncTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Format sync metrics for display
 * @param {Object} metrics - Synced metrics
 * @returns {string} Formatted metrics
 */
function formatSyncMetrics(metrics) {
    const metricDescriptions = [];
    
    if (metrics.steps) {
        metricDescriptions.push(`${metrics.steps.toLocaleString()} steps`);
    }
    
    if (metrics.weight) {
        metricDescriptions.push(`Weight: ${metrics.weight} ${metrics.weightUnit || 'kg'}`);
    }
    
    if (metrics.caloriesBurned) {
        metricDescriptions.push(`${metrics.caloriesBurned} calories burned`);
    }
    
    if (metrics.exercises && metrics.exercises.length > 0) {
        metricDescriptions.push(`${metrics.exercises.length} exercises`);
    }
    
    return metricDescriptions.join(' • ') || 'No metrics synced';
}

/**
 * Set up event listeners for integration UI
 */
function setupEventListeners() {
    document.addEventListener('click', function(event) {
        // Connect button
        if (event.target.classList.contains('connect')) {
            const card = event.target.closest('.integration-card');
            if (card) {
                const platform = card.getAttribute('data-platform');
                connectPlatform(platform);
            }
        }
        
        // Disconnect button
        if (event.target.classList.contains('disconnect')) {
            const card = event.target.closest('.integration-card');
            if (card) {
                const platform = card.getAttribute('data-platform');
                disconnectPlatform(platform);
            }
        }
        
        // Sync now button
        if (event.target.id === 'syncNowButton' || event.target.closest('#syncNowButton')) {
            syncAllConnectedPlatforms();
        }
    });
}

/**
 * Connect to a wearable platform
 * @param {string} platform - Platform identifier
 */
function connectPlatform(platform) {
    // In a real implementation, this would:
    // 1. Launch OAuth flow for the platform
    // 2. Handle authorization and token exchange
    // 3. Store credentials securely
    
    // For demo purposes, we'll simulate a successful connection
    showNotification(`Connecting to ${getPlatformName(platform)}...`, 'info');
    
    // Simulate API authorization delay
    setTimeout(() => {
        // Add to connected platforms if not already connected
        if (!connectedPlatforms.some(p => p.platform === platform)) {
            const newConnection = {
                platform,
                connected: Date.now(),
                lastSync: null
            };
            
            connectedPlatforms.push(newConnection);
            saveConnectedPlatforms();
        }
        
        // Update UI
        renderIntegrationUI();
        
        // Show success notification
        showNotification(`Successfully connected to ${getPlatformName(platform)}!`, 'success');
        
        // Sync data immediately after connecting
        syncPlatformData(platform);
    }, 1500);
}

/**
 * Disconnect from a wearable platform
 * @param {string} platform - Platform identifier
 */
function disconnectPlatform(platform) {
    // In a real implementation, this would:
    // 1. Revoke OAuth tokens
    // 2. Remove stored credentials
    
    // For demo purposes, we'll simulate a successful disconnection
    showNotification(`Disconnecting from ${getPlatformName(platform)}...`, 'info');
    
    // Simulate API request delay
    setTimeout(() => {
        // Remove from connected platforms
        connectedPlatforms = connectedPlatforms.filter(p => p.platform !== platform);
        saveConnectedPlatforms();
        
        // Update UI
        renderIntegrationUI();
        
        // Show success notification
        showNotification(`Disconnected from ${getPlatformName(platform)}.`, 'success');
    }, 1000);
}

/**
 * Save connected platforms to storage
 */
function saveConnectedPlatforms() {
    try {
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) return;
        
        const key = `wearable_connections_${currentUser.email}`;
        saveToStorage(key, connectedPlatforms);
        console.log('Saved connected platforms:', connectedPlatforms);
    } catch (error) {
        console.error('Error saving connected platforms:', error);
    }
}

/**
 * Sync data from all connected platforms
 */
function syncAllConnectedPlatforms() {
    if (connectedPlatforms.length === 0) {
        showNotification('No connected platforms to sync.', 'info');
        return;
    }
    
    showNotification(`Syncing data from ${connectedPlatforms.length} connected platforms...`, 'info');
    
    // Sync each platform
    connectedPlatforms.forEach(connection => {
        syncPlatformData(connection.platform);
    });
}

/**
 * Sync data from a specific platform
 * @param {string} platform - Platform identifier
 */
function syncPlatformData(platform) {
    // In a real implementation, this would:
    // 1. Request data from the platform API
    // 2. Process and transform the data
    // 3. Import it into the app's storage format
    
    // For demo purposes, we'll simulate a successful sync with mock data
    showNotification(`Syncing data from ${getPlatformName(platform)}...`, 'info');
    
    // Simulate API request delay
    setTimeout(() => {
        // Generate mock data based on platform
        const mockData = generateMockPlatformData(platform);
        
        // Process and import the data
        processPlatformData(platform, mockData);
        
        // Update last sync time
        updateLastSyncTime(platform);
        
        // Add to sync history
        addSyncHistoryEntry(platform, 'success', mockData);
        
        // Update UI
        renderIntegrationUI();
        
        // Show success notification
        showNotification(`Successfully synced data from ${getPlatformName(platform)}!`, 'success');
    }, 2000);
}

/**
 * Generate mock data for a platform (for demonstration purposes)
 * @param {string} platform - Platform identifier
 * @returns {Object} Mock data
 */
function generateMockPlatformData(platform) {
    // Base metrics all platforms might have
    const data = {
        steps: Math.floor(5000 + Math.random() * 10000),
        caloriesBurned: Math.floor(500 + Math.random() * 1000),
        timestamp: Date.now()
    };
    
    // Add platform-specific metrics
    switch (platform) {
        case PLATFORMS.FITBIT:
            data.heartRate = {
                resting: Math.floor(55 + Math.random() * 20),
                zones: {
                    fat: Math.floor(20 + Math.random() * 40),
                    cardio: Math.floor(10 + Math.random() * 30),
                    peak: Math.floor(Math.random() * 15)
                }
            };
            data.sleep = {
                duration: Math.floor(5 + Math.random() * 4) * 3600000, // hours in ms
                stages: {
                    deep: Math.floor(1 + Math.random() * 2) * 3600000,
                    light: Math.floor(2 + Math.random() * 3) * 3600000,
                    rem: Math.floor(1 + Math.random() * 2) * 3600000
                }
            };
            data.exercises = generateMockExercises(1 + Math.floor(Math.random() * 2));
            break;
            
        case PLATFORMS.APPLE_HEALTH:
            data.standHours = Math.floor(6 + Math.random() * 6);
            data.exerciseMinutes = Math.floor(20 + Math.random() * 40);
            data.activeCalories = Math.floor(300 + Math.random() * 500);
            data.weight = parseFloat((60 + Math.random() * 30).toFixed(1));
            data.weightUnit = 'kg';
            data.exercises = generateMockExercises(1 + Math.floor(Math.random() * 3));
            break;
            
        case PLATFORMS.GOOGLE_FIT:
            data.activeMinutes = Math.floor(30 + Math.random() * 60);
            data.distance = parseFloat((2 + Math.random() * 8).toFixed(2));
            data.exercises = generateMockExercises(Math.floor(Math.random() * 2));
            break;
            
        case PLATFORMS.SAMSUNG_HEALTH:
            data.heartRate = {
                average: Math.floor(65 + Math.random() * 20),
                max: Math.floor(120 + Math.random() * 40)
            };
            data.water = Math.floor(1 + Math.random() * 7); // cups
            data.exercises = generateMockExercises(Math.floor(Math.random() * 3));
            break;
            
        case PLATFORMS.GARMIN:
            data.stress = Math.floor(20 + Math.random() * 60);
            data.bodyBattery = Math.floor(40 + Math.random() * 60);
            data.exercises = generateMockExercises(1 + Math.floor(Math.random() * 2));
            break;
    }
    
    return data;
}

/**
 * Generate mock exercises for demonstration
 * @param {number} count - Number of exercises to generate
 * @returns {Array} Mock exercises
 */
function generateMockExercises(count) {
    const exerciseTypes = [
        { name: 'Running', caloriesPerMinute: 8, minDuration: 15, maxDuration: 60 },
        { name: 'Walking', caloriesPerMinute: 4, minDuration: 20, maxDuration: 90 },
        { name: 'Cycling', caloriesPerMinute: 7, minDuration: 20, maxDuration: 120 },
        { name: 'Swimming', caloriesPerMinute: 9, minDuration: 20, maxDuration: 60 },
        { name: 'HIIT', caloriesPerMinute: 12, minDuration: 15, maxDuration: 45 },
        { name: 'Yoga', caloriesPerMinute: 3, minDuration: 30, maxDuration: 90 },
        { name: 'Weight Training', caloriesPerMinute: 5, minDuration: 30, maxDuration: 75 }
    ];
    
    const exercises = [];
    
    for (let i = 0; i < count; i++) {
        const exerciseType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
        const duration = Math.floor(exerciseType.minDuration + Math.random() * (exerciseType.maxDuration - exerciseType.minDuration));
        const calories = Math.floor(exerciseType.caloriesPerMinute * duration);
        
        exercises.push({
            name: exerciseType.name,
            duration: duration,
            calories: calories,
            startTime: Date.now() - (Math.floor(Math.random() * 24) * 3600000) // random time in last 24h
        });
    }
    
    return exercises;
}

/**
 * Process platform data and save to app storage
 * @param {string} platform - Platform identifier
 * @param {Object} data - Platform data
 */
function processPlatformData(platform, data) {
    try {
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) return;
        
        // Process steps
        if (data.steps) {
            saveDailySteps(currentUser.email, data.steps);
        }
        
        // Process weight if available
        if (data.weight) {
            saveWeight(currentUser.email, data.weight, data.weightUnit);
        }
        
        // Process exercises
        if (data.exercises && data.exercises.length > 0) {
            data.exercises.forEach(exercise => {
                saveExercise(currentUser.email, exercise);
            });
        }
        
        // Process overall calories burned
        if (data.caloriesBurned) {
            saveCaloriesBurned(currentUser.email, data.caloriesBurned);
        }
        
        console.log(`Processed data from ${platform}:`, data);
    } catch (error) {
        console.error(`Error processing data from ${platform}:`, error);
    }
}

/**
 * Save daily steps to app storage
 * @param {string} userEmail - User email
 * @param {number} steps - Step count
 */
function saveDailySteps(userEmail, steps) {
    try {
        // Get current date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Create key for steps
        const stepsKey = `steps_${userEmail}_${today}`;
        
        // Save steps to storage
        localStorage.setItem(stepsKey, steps);
        
        console.log(`Saved ${steps} steps for ${today}`);
    } catch (error) {
        console.error('Error saving steps:', error);
    }
}

/**
 * Save weight measurement to app storage
 * @param {string} userEmail - User email
 * @param {number} weight - Weight value
 * @param {string} unit - Weight unit
 */
function saveWeight(userEmail, weight, unit = 'kg') {
    try {
        // Get current date in ISO format
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        
        // Create weight entry
        const weightEntry = {
            weight: parseFloat(weight),
            date: dateStr,
            timestamp: now.getTime()
        };
        
        // Get existing weight history
        const weightHistoryKey = `weight_history_${userEmail}`;
        const weightHistory = getFromStorage(weightHistoryKey, []);
        
        // Add new entry (avoiding duplicates for same day)
        const existingEntryIndex = weightHistory.findIndex(entry => entry.date === dateStr);
        
        if (existingEntryIndex >= 0) {
            weightHistory[existingEntryIndex] = weightEntry;
        } else {
            weightHistory.push(weightEntry);
        }
        
        // Save weight history
        saveToStorage(weightHistoryKey, weightHistory);
        
        // Update user profile with latest weight
        const profileKey = `profile_${userEmail}`;
        const profile = getFromStorage(profileKey, {});
        profile.weight = parseFloat(weight);
        profile.weightUnit = unit;
        saveToStorage(profileKey, profile);
        
        console.log(`Saved weight: ${weight} ${unit}`);
    } catch (error) {
        console.error('Error saving weight:', error);
    }
}

/**
 * Save exercise from wearable to app storage
 * @param {string} userEmail - User email
 * @param {Object} exercise - Exercise data
 */
function saveExercise(userEmail, exercise) {
    try {
        // Convert timestamp to date components
        const date = new Date(exercise.startTime || Date.now());
        const dateStr = date.toISOString().split('T')[0];
        const [yearMonth, day] = [dateStr.substring(0, 7), dateStr.substring(8, 10)];
        
        // Get time of day based on hour
        const hour = date.getHours();
        let timeOfDay = 'morning';
        
        if (hour >= 12 && hour < 17) {
            timeOfDay = 'afternoon';
        } else if (hour >= 17) {
            timeOfDay = 'evening';
        }
        
        // Create exercise storage key
        const exerciseKey = `exercise_${userEmail}_${yearMonth}`;
        
        // Get existing exercises for this month
        const monthExercises = getFromStorage(exerciseKey, {});
        
        // Initialize structures if needed
        if (!monthExercises[day]) {
            monthExercises[day] = {};
        }
        
        if (!monthExercises[day][timeOfDay]) {
            monthExercises[day][timeOfDay] = [];
        }
        
        // Create exercise entry
        const exerciseEntry = {
            name: exercise.name,
            duration: exercise.duration,
            calories: exercise.calories,
            fromWearable: true
        };
        
        // Add to exercises for this day and time
        monthExercises[day][timeOfDay].push(exerciseEntry);
        
        // Save back to storage
        saveToStorage(exerciseKey, monthExercises);
        
        // Also update weekly data for dashboard charts
        updateWeeklyExerciseData(userEmail, exercise);
        
        console.log(`Saved exercise: ${exercise.name}, ${exercise.duration} min, ${exercise.calories} calories`);
    } catch (error) {
        console.error('Error saving exercise:', error);
    }
}

/**
 * Update weekly exercise data for dashboard charts
 * @param {string} userEmail - User email
 * @param {Object} exercise - Exercise data
 */
function updateWeeklyExerciseData(userEmail, exercise) {
    try {
        // Convert timestamp to date
        const date = new Date(exercise.startTime || Date.now());
        
        // Get day index (0 = Monday, 6 = Sunday)
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Monday, 6 = Sunday
        
        // Create user key for weekly data
        const userKey = `planner_${userEmail}`;
        
        // Get existing weekly exercise data
        let weeklyExercise = getFromStorage(`${userKey}_exercise`, [0, 0, 0, 0, 0, 0, 0]);
        let weeklyFoods = getFromStorage(`${userKey}_foods`, [[], [], [], [], [], [], []]);
        
        // Validate arrays
        if (!Array.isArray(weeklyExercise) || weeklyExercise.length !== 7) {
            weeklyExercise = [0, 0, 0, 0, 0, 0, 0];
        }
        
        if (!Array.isArray(weeklyFoods) || weeklyFoods.length !== 7) {
            weeklyFoods = [[], [], [], [], [], [], []];
        }
        
        // Update exercise calories for this day
        weeklyExercise[dayIndex] += exercise.calories;
        
        // Add exercise to foods array (used for display in the tracker)
        weeklyFoods[dayIndex].push({
            text: `${exercise.name} (${exercise.duration} min, ${exercise.calories} kcal)`,
            cal: exercise.calories,
            type: 'exercise',
            fromWearable: true
        });
        
        // Save back to storage
        saveToStorage(`${userKey}_exercise`, weeklyExercise);
        saveToStorage(`${userKey}_foods`, weeklyFoods);
    } catch (error) {
        console.error('Error updating weekly exercise data:', error);
    }
}

/**
 * Save overall calories burned to app storage
 * @param {string} userEmail - User email
 * @param {number} calories - Calories burned
 */
function saveCaloriesBurned(userEmail, calories) {
    try {
        // Get current date
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        // Store in activity log
        const activityKey = `activity_${userEmail}_${dateStr}`;
        const activityData = getFromStorage(activityKey, {
            steps: 0,
            caloriesBurned: 0,
            activeMinutes: 0
        });
        
        // Update calories burned (but don't overwrite if the existing value is higher)
        activityData.caloriesBurned = Math.max(activityData.caloriesBurned, calories);
        
        // Save to storage
        saveToStorage(activityKey, activityData);
        
        console.log(`Saved ${calories} calories burned for ${dateStr}`);
    } catch (error) {
        console.error('Error saving calories burned:', error);
    }
}

/**
 * Update last sync time for a platform
 * @param {string} platform - Platform identifier
 */
function updateLastSyncTime(platform) {
    try {
        // Find platform in connected platforms
        const platformIndex = connectedPlatforms.findIndex(p => p.platform === platform);
        
        if (platformIndex >= 0) {
            // Update last sync time
            connectedPlatforms[platformIndex].lastSync = Date.now();
            
            // Save connected platforms
            saveConnectedPlatforms();
        }
    } catch (error) {
        console.error('Error updating last sync time:', error);
    }
}

/**
 * Add an entry to sync history
 * @param {string} platform - Platform identifier
 * @param {string} status - Sync status
 * @param {Object} metrics - Synced metrics
 */
function addSyncHistoryEntry(platform, status, metrics) {
    try {
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) return;
        
        // Create sync history entry
        const entry = {
            platform,
            status,
            timestamp: Date.now(),
            metrics: {
                steps: metrics.steps,
                caloriesBurned: metrics.caloriesBurned,
                weight: metrics.weight,
                weightUnit: metrics.weightUnit,
                exercises: metrics.exercises ? metrics.exercises.length : 0
            }
        };
        
        // Get existing sync history
        const key = `wearable_sync_history_${currentUser.email}`;
        const history = getFromStorage(key, []);
        
        // Add new entry (limit to most recent 20)
        history.unshift(entry);
        if (history.length > 20) {
            history.length = 20;
        }
        
        // Save sync history
        saveToStorage(key, history);
    } catch (error) {
        console.error('Error adding sync history entry:', error);
    }
}

/**
 * Set up automatic background sync
 * @param {number} intervalMinutes - Sync interval in minutes
 */
function setupAutoSync(intervalMinutes = 60) {
    if (!intervalMinutes || intervalMinutes < 15) {
        intervalMinutes = 60; // Minimum 15 minutes, default 60
    }
    
    // Clear any existing interval
    if (window.autoSyncInterval) {
        clearInterval(window.autoSyncInterval);
    }
    
    // Set up new interval
    window.autoSyncInterval = setInterval(() => {
        // Only sync if we have connected platforms
        if (connectedPlatforms.length > 0) {
            console.log(`Auto-syncing ${connectedPlatforms.length} connected platforms...`);
            syncAllConnectedPlatforms();
        }
    }, intervalMinutes * 60 * 1000);
    
    console.log(`Automatic sync configured for every ${intervalMinutes} minutes`);
}

/**
 * Initialize the widget for displaying wearable data
 * @param {string} containerId - ID of the container element
 */
function initializeWearableWidget(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Create widget structure
    container.innerHTML = `
        <div class="wearable-widget">
            <div class="wearable-header">
                <h4><i class="fas fa-heartbeat"></i> Today's Activity</h4>
                <button id="refreshWearableData" class="icon-button">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
            <div class="wearable-metrics">
                <div class="metric-card steps">
                    <div class="metric-icon"><i class="fas fa-shoe-prints"></i></div>
                    <div class="metric-value" id="stepsValue">0</div>
                    <div class="metric-label">Steps</div>
                </div>
                <div class="metric-card calories">
                    <div class="metric-icon"><i class="fas fa-fire"></i></div>
                    <div class="metric-value" id="caloriesValue">0</div>
                    <div class="metric-label">Calories</div>
                </div>
                <div class="metric-card activity">
                    <div class="metric-icon"><i class="fas fa-running"></i></div>
                    <div class="metric-value" id="exercisesValue">0</div>
                    <div class="metric-label">Exercises</div>
                </div>
            </div>
            <div class="wearable-footer">
                <span id="lastUpdated">Not synced yet</span>
                <a href="wearable-settings.html" class="settings-link">
                    <i class="fas fa-cog"></i> Settings
                </a>
            </div>
        </div>
    `;
    
    // Add event listener for refresh button
    document.getElementById('refreshWearableData').addEventListener('click', () => {
        updateWearableWidget();
        syncAllConnectedPlatforms();
    });
    
    // Initial update
    updateWearableWidget();
}

/**
 * Update the wearable widget with latest data
 */
function updateWearableWidget() {
    try {
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) return;
        
        // Get today's date
        const today = new Date().toISOString().split('T')[0];
        
        // Get steps
        const stepsKey = `steps_${currentUser.email}_${today}`;
        const steps = parseInt(localStorage.getItem(stepsKey) || '0');
        
        // Get activity data
        const activityKey = `activity_${currentUser.email}_${today}`;
        const activityData = getFromStorage(activityKey, {
            steps: 0,
            caloriesBurned: 0,
            activeMinutes: 0
        });
        
        // Get exercise count
        const yearMonth = today.substring(0, 7);
        const day = today.substring(8, 10);
        const exerciseKey = `exercise_${currentUser.email}_${yearMonth}`;
        const monthExercises = getFromStorage(exerciseKey, {});
        
        let exerciseCount = 0;
        if (monthExercises[day]) {
            Object.values(monthExercises[day]).forEach(timeSlot => {
                if (Array.isArray(timeSlot)) {
                    exerciseCount += timeSlot.length;
                }
            });
        }
        
        // Update widget values
        document.getElementById('stepsValue').textContent = steps.toLocaleString();
        document.getElementById('caloriesValue').textContent = Math.round(activityData.caloriesBurned).toLocaleString();
        document.getElementById('exercisesValue').textContent = exerciseCount;
        
        // Update last synced time
        const lastUpdated = document.getElementById('lastUpdated');
        if (connectedPlatforms.length > 0) {
            // Find most recent sync
            const latestSync = connectedPlatforms.reduce((latest, platform) => {
                return platform.lastSync > latest ? platform.lastSync : latest;
            }, 0);
            
            if (latestSync > 0) {
                const syncDate = new Date(latestSync);
                lastUpdated.textContent = `Last synced: ${syncDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            } else {
                lastUpdated.textContent = 'Not synced today';
            }
        } else {
            lastUpdated.textContent = 'No devices connected';
        }
    } catch (error) {
        console.error('Error updating wearable widget:', error);
    }
}

/**
 * Add CSS styles for wearable integration
 */
function addWearableStyles() {
    const styleId = 'wearable-integration-styles';
    
    // Don't add styles if they already exist
    if (document.getElementById(styleId)) return;
    
    // Create style element
    const style = document.createElement('style');
    style.id = styleId;
    
    // Add CSS rules
    style.textContent = `
        /* Integration Cards */
        .integration-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .integration-card {
            display: flex;
            align-items: center;
            padding: 1rem;
            border-radius: 8px;
            background-color: var(--card-bg, #f9f9f9);
            border: 1px solid var(--border-color, #eaeaea);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .integration-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .integration-card.connected {
            border-left: 4px solid var(--success-color, #4CAF50);
        }
        
        .integration-icon {
            font-size: 1.5rem;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background-color: var(--primary-light, rgba(76, 175, 80, 0.1));
            color: var(--primary-color, #4CAF50);
            margin-right: 1rem;
        }
        
        .integration-info {
            flex: 1;
        }
        
        .integration-info h4 {
            margin: 0 0 0.25rem;
            font-size: 1rem;
        }
        
        .integration-info .status {
            margin: 0;
            font-size: 0.85rem;
            color: var(--text-secondary, #666);
        }
        
        .integration-card.connected .status {
            color: var(--success-color, #4CAF50);
        }
        
        .integration-button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .integration-button.connect {
            background-color: var(--primary-color, #4CAF50);
            color: white;
        }
        
        .integration-button.disconnect {
            background-color: transparent;
            color: var(--error-color, #F44336);
            border: 1px solid var(--error-color, #F44336);
        }
        
        .integration-button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        /* Sync History Section */
        .sync-history-section {
            margin-top: 2rem;
            padding: 1rem;
            border-radius: 8px;
            background-color: var(--card-bg, #f9f9f9);
            border: 1px solid var(--border-color, #eaeaea);
        }
        
        .sync-history-section h4 {
            margin-top: 0;
            border-bottom: 1px solid var(--border-color, #eaeaea);
            padding-bottom: 0.5rem;
        }
        
        .sync-controls {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
        }
        
        .sync-history {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .sync-entry {
            display: flex;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border-color, #eaeaea);
        }
        
        .sync-platform {
            width: 120px;
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 0.9rem;
        }
        
        .sync-platform i {
            margin-right: 0.5rem;
            color: var(--primary-color, #4CAF50);
        }
        
        .sync-details {
            flex: 1;
            margin: 0 1rem;
        }
        
        .sync-time {
            font-size: 0.8rem;
            color: var(--text-secondary, #666);
            margin-bottom: 0.25rem;
        }
        
        .sync-metrics {
            font-size: 0.85rem;
        }
        
        .sync-status {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 1rem;
        }
        
        .sync-status.success {
            color: var(--success-color, #4CAF50);
        }
        
        .sync-status.error {
            color: var(--error-color, #F44336);
        }
        
        .no-history {
            color: var(--text-secondary, #666);
            font-style: italic;
            text-align: center;
            padding: 1rem;
        }
        
        /* Wearable Widget */
        .wearable-widget {
            background-color: var(--card-bg, #f9f9f9);
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .wearable-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .wearable-header h4 {
            margin: 0;
            display: flex;
            align-items: center;
            font-size: 1rem;
        }
        
        .wearable-header h4 i {
            margin-right: 0.5rem;
            color: var(--primary-color, #4CAF50);
        }
        
        .wearable-metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
            margin-bottom: 1rem;
        }
        
        .metric-card {
            background-color: white;
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
            box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        
        .metric-icon {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
        }
        
        .metric-card.steps .metric-icon {
            color: #2196F3;
        }
        
        .metric-card.calories .metric-icon {
            color: #FF9800;
        }
        
        .metric-card.activity .metric-icon {
            color: #E91E63;
        }
        
        .metric-value {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.25rem;
        }
        
        .metric-label {
            font-size: 0.85rem;
            color: var(--text-secondary, #666);
        }
        
        .wearable-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: var(--text-secondary, #666);
        }
        
        .settings-link {
            color: var(--primary-color, #4CAF50);
            text-decoration: none;
        }
        
        .settings-link:hover {
            text-decoration: underline;
        }
        
        .icon-button {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--primary-color, #4CAF50);
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .icon-button:hover {
            background-color: var(--primary-light, rgba(76, 175, 80, 0.1));
        }
    `;
    
    // Add style to document head
    document.head.appendChild(style);
}

// Initialize styles when script loads
addWearableStyles();

// Export functions to global scope
window.initializeWearableIntegration = initializeWearableIntegration;
window.syncAllConnectedPlatforms = syncAllConnectedPlatforms;
window.setupAutoSync = setupAutoSync;
window.initializeWearableWidget = initializeWearableWidget;
window.PLATFORMS = PLATFORMS;