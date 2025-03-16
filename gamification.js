/**
 * SlimEasy Gamification System
 * Handles streaks, badges, achievements, and user rewards
 */

// Achievement definitions with requirements and rewards
const ACHIEVEMENTS = {
    // Logging streaks
    streak_3days: {
        id: 'streak_3days',
        name: 'Getting Started',
        description: 'Log your weight for 3 days in a row',
        icon: 'fas fa-seedling',
        category: 'streak',
        requirement: 3,
        points: 10
    },
    streak_7days: {
        id: 'streak_7days',
        name: 'Week Warrior',
        description: 'Log your weight for 7 days in a row',
        icon: 'fas fa-calendar-week',
        category: 'streak',
        requirement: 7,
        points: 25
    },
    streak_30days: {
        id: 'streak_30days',
        name: 'Monthly Master',
        description: 'Log your weight for 30 days in a row',
        icon: 'fas fa-calendar-alt',
        category: 'streak',
        requirement: 30,
        points: 100
    },
    streak_100days: {
        id: 'streak_100days',
        name: 'Century Club',
        description: 'Log your weight for 100 days in a row',
        icon: 'fas fa-trophy',
        category: 'streak',
        requirement: 100,
        points: 500
    },
    
    // Weight milestones
    weight_loss_1kg: {
        id: 'weight_loss_1kg',
        name: 'First Step',
        description: 'Lose your first kilogram',
        icon: 'fas fa-weight',
        category: 'weight',
        requirement: 1,
        points: 20
    },
    weight_loss_5kg: {
        id: 'weight_loss_5kg',
        name: 'Momentum Builder',
        description: 'Lose 5 kilograms total',
        icon: 'fas fa-weight',
        category: 'weight',
        requirement: 5,
        points: 50
    },
    weight_loss_10kg: {
        id: 'weight_loss_10kg',
        name: 'Major Milestone',
        description: 'Lose 10 kilograms total',
        icon: 'fas fa-medal',
        category: 'weight',
        requirement: 10,
        points: 100
    },
    
    // Hydration achievements
    hydration_daily: {
        id: 'hydration_daily',
        name: 'Well Hydrated',
        description: 'Drink 8 glasses of water in a day',
        icon: 'fas fa-tint',
        category: 'hydration',
        requirement: 8,
        points: 10
    },
    hydration_week: {
        id: 'hydration_week',
        name: 'Hydration Hero',
        description: 'Drink 8 glasses of water for 7 days in a row',
        icon: 'fas fa-glass-whiskey',
        category: 'hydration',
        requirement: 7,
        points: 50
    },
    
    // Exercise achievements
    exercise_first: {
        id: 'exercise_first',
        name: 'Getting Active',
        description: 'Log your first exercise session',
        icon: 'fas fa-running',
        category: 'exercise',
        requirement: 1,
        points: 10
    },
    exercise_10_sessions: {
        id: 'exercise_10_sessions',
        name: 'Exercise Enthusiast',
        description: 'Log 10 exercise sessions',
        icon: 'fas fa-dumbbell',
        category: 'exercise',
        requirement: 10,
        points: 50
    },
    
    // Profile completion
    profile_complete: {
        id: 'profile_complete',
        name: 'Profile Pro',
        description: 'Complete your user profile with all details',
        icon: 'fas fa-user-circle',
        category: 'profile',
        requirement: 1,
        points: 15
    }
};

// Streak tracking functions

/**
 * Get current streak data for user
 * @returns {Object} Streak data (current, longest, lastUpdated)
 */
function getUserStreak() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser || !currentUser.email) return { current: 0, longest: 0 };
    
    const streakKey = `streak_${currentUser.email}`;
    return getFromStorage(streakKey, { current: 0, longest: 0, lastUpdated: null });
}

/**
 * Update user's streak based on their activity
 * @param {string} type - Type of activity (weight, hydration, etc.)
 * @returns {Object} Updated streak information
 */
function updateStreak(type = 'weight') {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser || !currentUser.email) return null;
    
    const streakKey = `streak_${currentUser.email}`;
    const streak = getFromStorage(streakKey, { 
        current: 0, 
        longest: 0, 
        lastUpdated: null 
    });
    
    const today = new Date().toISOString().split('T')[0];
    
    // If already updated today, just return current streak
    if (streak.lastUpdated === today) {
        return streak;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // If last update was yesterday, increment streak
    if (streak.lastUpdated === yesterdayStr) {
        streak.current++;
        if (streak.current > streak.longest) {
            streak.longest = streak.current;
        }
    } 
    // If last update was before yesterday, reset streak to 1
    else if (streak.lastUpdated) {
        streak.current = 1;
    } 
    // If no last update (first time), set streak to 1
    else {
        streak.current = 1;
    }
    
    // Update last updated timestamp
    streak.lastUpdated = today;
    
    // Save updated streak
    saveToStorage(streakKey, streak);
    
    // Check for streak achievements
    checkStreakAchievements(streak.current);
    
    return streak;
}

// Achievement tracker functions

/**
 * Get user achievements
 * @returns {Object} User achievements
 */
function getUserAchievements() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser || !currentUser.email) return { earned: {}, points: 0 };
    
    const achievementsKey = `achievements_${currentUser.email}`;
    return getFromStorage(achievementsKey, { earned: {}, points: 0 });
}

/**
 * Award achievement to user
 * @param {string} achievementId - ID of achievement to award
 * @returns {Object|null} Achievement data if newly awarded, null if already earned
 */
function awardAchievement(achievementId) {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser || !currentUser.email) return null;
    
    // Get achievement details
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return null;
    
    // Get user achievements
    const achievementsKey = `achievements_${currentUser.email}`;
    const userAchievements = getFromStorage(achievementsKey, { earned: {}, points: 0 });
    
    // Check if already earned
    if (userAchievements.earned[achievementId]) return null;
    
    // Add achievement with timestamp
    userAchievements.earned[achievementId] = {
        dateEarned: new Date().toISOString(),
        ...achievement
    };
    
    // Add points
    userAchievements.points += achievement.points;
    
    // Save updated achievements
    saveToStorage(achievementsKey, userAchievements);
    
    // Show notification
    showAchievementNotification(achievement);
    
    return achievement;
}

/**
 * Show achievement notification
 * @param {Object} achievement - Achievement data
 */
function showAchievementNotification(achievement) {
    // Check if achievement is valid
    if (!achievement || !achievement.name || !achievement.description) {
        console.error('Invalid achievement data:', achievement);
        return;
    }

    // Create achievement popup
    const container = document.createElement('div');
    container.className = 'achievement-popup';
    container.innerHTML = `
        <div class="achievement-icon">
            <i class="${achievement.icon || 'fas fa-trophy'}"></i>
        </div>
        <div class="achievement-content">
            <h3>Achievement Unlocked!</h3>
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
            <p class="achievement-points">+${achievement.points || 0} points</p>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(container);
    
    // Trigger animation
    setTimeout(() => {
        container.classList.add('show');
        
        // Play sound if available
        try {
            const achievementSound = new Audio('./achievement.mp3');
            achievementSound.volume = 0.5;
            achievementSound.play().catch(e => console.log('Achievement sound not loaded:', e.message));
        } catch (error) {
            console.log('Error playing achievement sound:', error.message);
        }
        
        // Remove after animation
        setTimeout(() => {
            container.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
            }, 500);
        }, 5000);
    }, 100);
    
    // Also show as a notification
    if (typeof showNotification === 'function') {
        showNotification(`Achievement Unlocked: ${achievement.name}`, 'success', 5000);
    }
}

/**
 * Check streak achievements
 * @param {number} currentStreak - Current streak count
 */
function checkStreakAchievements(currentStreak) {
    if (currentStreak >= 3) awardAchievement('streak_3days');
    if (currentStreak >= 7) awardAchievement('streak_7days');
    if (currentStreak >= 30) awardAchievement('streak_30days');
    if (currentStreak >= 100) awardAchievement('streak_100days');
}

/**
 * Check weight loss achievements
 * @param {number} totalLoss - Total weight loss in kg
 */
function checkWeightLossAchievements(totalLoss) {
    if (totalLoss >= 1) awardAchievement('weight_loss_1kg');
    if (totalLoss >= 5) awardAchievement('weight_loss_5kg');
    if (totalLoss >= 10) awardAchievement('weight_loss_10kg');
}

/**
 * Check hydration achievements
 * @param {number} waterCount - Today's water count
 * @param {number} streakDays - Days in a row with 8 glasses
 */
function checkHydrationAchievements(waterCount, streakDays) {
    if (waterCount >= 8) awardAchievement('hydration_daily');
    if (streakDays >= 7) awardAchievement('hydration_week');
}

/**
 * Check exercise achievements
 * @param {number} totalSessions - Total exercise sessions logged
 */
function checkExerciseAchievements(totalSessions) {
    if (totalSessions >= 1) awardAchievement('exercise_first');
    if (totalSessions >= 10) awardAchievement('exercise_10_sessions');
}

/**
 * Check profile completion achievement
 * @param {Object} profileData - User profile data
 */
function checkProfileAchievement(profileData) {
    const requiredFields = ['age', 'weight', 'height', 'gender', 'activity', 'goal'];
    const isComplete = requiredFields.every(field => 
        profileData[field] !== null && profileData[field] !== undefined && profileData[field] !== '');
    
    if (isComplete) {
        awardAchievement('profile_complete');
    }
}

/**
 * Render user's achievements on a page
 * @param {string} containerId - HTML container to render achievements in
 */
function renderAchievements(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Get user achievements
    const { earned, points } = getUserAchievements();
    
    // Create header with points
    const header = document.createElement('div');
    header.className = 'achievements-header';
    header.innerHTML = `
        <h2>Your Achievements</h2>
        <div class="achievement-points-display">
            <i class="fas fa-star"></i>
            <span>${points} points</span>
        </div>
    `;
    container.appendChild(header);
    
    // Create categories
    const categories = {
        streak: { name: 'Logging Streaks', icon: 'fas fa-calendar-alt' },
        weight: { name: 'Weight Loss', icon: 'fas fa-weight' },
        hydration: { name: 'Hydration', icon: 'fas fa-tint' },
        exercise: { name: 'Exercise', icon: 'fas fa-running' },
        profile: { name: 'Profile', icon: 'fas fa-user' }
    };
    
    // Create tabs for categories
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'achievement-tabs';
    
    const achievementsContainer = document.createElement('div');
    achievementsContainer.className = 'achievements-container';
    
    // Add tabs and content sections for each category
    Object.entries(categories).forEach(([category, info], index) => {
        // Create tab
        const tab = document.createElement('div');
        tab.className = `achievement-tab ${index === 0 ? 'active' : ''}`;
        tab.dataset.category = category;
        tab.innerHTML = `<i class="${info.icon}"></i> ${info.name}`;
        tabsContainer.appendChild(tab);
        
        // Create content section
        const section = document.createElement('div');
        section.className = `achievement-section ${index === 0 ? 'active' : ''}`;
        section.dataset.category = category;
        
        // Filter achievements by category
        const categoryAchievements = Object.values(ACHIEVEMENTS).filter(a => a.category === category);
        
        // Create achievement cards
        categoryAchievements.forEach(achievement => {
            const isEarned = earned[achievement.id];
            const card = document.createElement('div');
            card.className = `achievement-card ${isEarned ? 'earned' : 'locked'}`;
            
            card.innerHTML = `
                <div class="achievement-card-icon">
                    <i class="${achievement.icon}"></i>
                    ${isEarned ? '<span class="earned-badge"><i class="fas fa-check"></i></span>' : ''}
                </div>
                <div class="achievement-card-content">
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                    <div class="achievement-card-footer">
                        <span class="achievement-points">${achievement.points} points</span>
                        ${isEarned ? `<span class="earned-date">Earned: ${new Date(earned[achievement.id].dateEarned).toLocaleDateString()}</span>` : ''}
                    </div>
                </div>
            `;
            section.appendChild(card);
        });
        
        achievementsContainer.appendChild(section);
    });
    
    // Add tab click handlers
    tabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.achievement-tab');
        if (!tab) return;
        
        // Update active tab
        document.querySelectorAll('.achievement-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active section
        const category = tab.dataset.category;
        document.querySelectorAll('.achievement-section').forEach(s => s.classList.remove('active'));
        document.querySelector(`.achievement-section[data-category="${category}"]`).classList.add('active');
    });
    
    // Add tabs and content to main container
    container.appendChild(tabsContainer);
    container.appendChild(achievementsContainer);
}

// Export functions to global scope
window.getUserStreak = getUserStreak;
window.updateStreak = updateStreak;
window.getUserAchievements = getUserAchievements;
window.awardAchievement = awardAchievement;
window.checkStreakAchievements = checkStreakAchievements;
window.checkWeightLossAchievements = checkWeightLossAchievements;
window.checkHydrationAchievements = checkHydrationAchievements;
window.checkExerciseAchievements = checkExerciseAchievements;
window.checkProfileAchievement = checkProfileAchievement;
window.renderAchievements = renderAchievements;
window.ACHIEVEMENTS = ACHIEVEMENTS;
