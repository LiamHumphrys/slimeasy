/**
 * SlimEasy Charts Module
 */

// Initialize all dashboard charts
function initializeCharts(profile) {
    try {
        if (!profile) {
            console.error('No profile data provided for chart initialization');
            return;
        }
        
        // Initialize charts
        initializeWeightChart(profile);
        initializeCalorieChart(profile);
        
        console.log('Charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Update charts based on view mode
function updateCharts(viewMode) {
    try {
        // Update weight chart with new view mode
        if (window.weightChart) {
            console.log('Updating weight chart for view mode:', viewMode);
            window.weightChart.update();
        }
        
        // Update calorie chart with new view mode
        if (window.calorieChart) {
            console.log('Updating calorie chart for view mode:', viewMode);
            window.calorieChart.update();
        }
    } catch (error) {
        console.error('Error updating charts:', error);
    }
}

// Initialize weight chart
function initializeWeightChart(profile) {
    try {
        const weightChartElement = document.getElementById('weightChart');
        if (!weightChartElement) {
            console.warn('Weight chart element not found');
            return;
        }
        
        // Get weight data
        const weightData = getWeeklyWeightData();
        if (!weightData || weightData.length === 0) {
            console.warn('No weight data available for chart');
            return;
        }
        
        // Format data for chart
        const labels = weightData.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        const data = weightData.map(entry => entry.weight);
        
        // Create chart
        window.weightChart = new Chart(weightChartElement, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Weight',
                    data: data,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return value + ' ' + (profile.weightUnit || 'kg');
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing weight chart:', error);
    }
}

// Initialize calorie chart
function initializeCalorieChart(profile) {
    try {
        const calorieChartElement = document.getElementById('calorieChart');
        if (!calorieChartElement) {
            console.warn('Calorie chart element not found');
            return;
        }
        
        // Get calorie data
        const calorieData = getWeeklyCalorieData();
        if (!calorieData || !calorieData.days || calorieData.days.length === 0) {
            console.warn('No calorie data available for chart');
            return;
        }
        
        // Create chart
        window.calorieChart = new Chart(calorieChartElement, {
            type: 'bar',
            data: {
                labels: calorieData.days,
                datasets: [{
                    label: 'Calories',
                    data: calorieData.values,
                    backgroundColor: 'rgba(76, 175, 80, 0.6)',
                    borderColor: '#4CAF50',
                    borderWidth: 1
                }, {
                    label: 'Target',
                    data: Array(calorieData.days.length).fill(parseFloat(profile.dailyGoal) || 2000),
                    type: 'line',
                    borderColor: '#FFC107',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' kcal';
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing calorie chart:', error);
    }
}

// Get weekly calorie data
function getWeeklyCalorieData() {
    try {
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) return { days: [], values: [] };
        
        const userKey = `planner_${currentUser.email}`;
        const weeklyCalories = getFromStorage(`${userKey}_calories`, [0, 0, 0, 0, 0, 0, 0]);
        
        if (!Array.isArray(weeklyCalories) || weeklyCalories.length !== 7) {
            return { days: [], values: [] };
        }
        
        // Get days of the week
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // Convert to correct format
        return {
            days: days,
            values: weeklyCalories.map(cal => parseFloat(cal) || 0)
        };
    } catch (error) {
        console.error('Error getting weekly calorie data:', error);
        return { days: [], values: [] };
    }
}

// Implement promptWeeklyWeight function to ensure it works properly
window.promptWeeklyWeight = function() {
    try {
        // Get weight unit from profile
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) {
            console.error("No current user found");
            alert('Please log in to record your weight.');
            return;
        }
        
        const profileKey = `profile_${currentUser.email}`;
        const profile = getFromStorage(profileKey);
        if (!profile) {
            console.error("No profile found for user");
            alert('Please set up your profile first.');
            window.location.href = 'index.html';
            return;
        }
        
        const weightUnit = profile && profile.weightUnit ? profile.weightUnit : 'kg';
        
        // Show input prompt with options
        const selectedOption = prompt(`What would you like to record?\n1. Current Weight\n2. Starting Weight\n\nEnter 1 or 2:`);
        
        if (selectedOption === null) return;
        
        const isStartWeight = selectedOption.trim() === '2';
        const promptMessage = isStartWeight 
            ? `Enter your starting weight (${weightUnit}):` 
            : `Enter your current weight (${weightUnit}):`;
        
        const weight = prompt(promptMessage); 
        
        if (weight !== null && weight.trim() !== '') {
            // Validate input
            const weightValue = parseFloat(weight);
            if (!isNaN(weightValue) && weightValue > 0 && weightValue < 500) {
                // Add the weight entry
                if (window.addWeeklyWeightEntry(weightValue, isStartWeight)) {
                    // Success! Update the dashboard UI
                    window.showNotification(isStartWeight ? 'Starting weight recorded successfully!' : 'Weight recorded successfully!', 'success');
                    
                    // Update current weight display
                    const currentWeightElement = document.getElementById('currentWeight');
                    if (currentWeightElement) {
                        currentWeightElement.textContent = `${weightValue} ${weightUnit}`;
                    }
                    
                    // Force refresh the stats section
                    const today = new Date();
                    if (typeof window.initializeStats === 'function') {
                        window.initializeStats(getFromStorage(profileKey), today);
                    }
                    
                    // Update profile values in dashboard
                    updateDashboardMetrics(profile);
                    
                    // Redirect to refresh the page with new data
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    alert('Failed to record weight. Please try again.');
                }
            } else {
                alert('Please enter a valid weight (between 0 and 500).');
            }
        }
    } catch (error) {
        console.error("Error in promptWeeklyWeight:", error);
        alert('An error occurred while recording your weight. Please try again.');
    }
};

// Function to update all dashboard metrics with profile data
// Function to add a new weight entry
window.addWeeklyWeightEntry = function(weight, isStartWeight = false) {
    try {
        console.log("Adding weekly weight entry:", { weight, isStartWeight });
        
        if (!weight || isNaN(parseFloat(weight))) {
            throw new Error('Invalid weight value');
        }
        
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) {
            console.error("No current user found when adding weight");
            return false;
        }
        
        const weightDataKey = `weight_history_${currentUser.email}`;
        let weightData = getFromStorage(weightDataKey, []);
        console.log("Current weight data:", weightData);
        
        if (!Array.isArray(weightData)) {
            console.log("Weight data not an array, resetting to empty array");
            weightData = [];
        }
        
        // Add new entry with today's date
        let today;
        try {
            today = new Date().toISOString().split('T')[0];
        } catch (e) {
            console.error('Error formatting date in addWeeklyWeightEntry:', e);
            return false;
        }
        
        // Check if we already have an entry for today
        const todayEntryIndex = weightData.findIndex(entry => entry.date === today);
        const newEntry = {
            date: today,
            weight: parseFloat(weight),
            isStartWeight: isStartWeight
        };
        
        // If this is a starting weight, clear any existing start weights
        if (isStartWeight) {
            weightData = weightData.map(entry => ({
                ...entry,
                isStartWeight: false
            }));
        }
        
        if (todayEntryIndex >= 0) {
            // Update existing entry for today
            weightData[todayEntryIndex] = newEntry;
        } else {
            // Add new entry
            weightData.push(newEntry);
        }
        
        // Keep only the most recent 12 entries
        if (weightData.length > 12) {
            weightData = weightData.slice(weightData.length - 12);
        }
        
        // Save updated data
        saveToStorage(weightDataKey, weightData);
        
        // Update profile with new weight and starting weight if applicable
        const profileKey = `profile_${currentUser.email}`;
        const profile = getFromStorage(profileKey);
        if (profile) {
            // If it's a starting weight or there's no current weight, update profile weight
            if (isStartWeight || !profile.weight) {
                profile.weight = parseFloat(weight);
            }
            
            // If it's marked as starting weight, store it specifically
            if (isStartWeight) {
                profile.startWeight = parseFloat(weight);
                
                // If no goal weight is set, suggest one based on starting weight
                if (!profile.goalWeight) {
                    // Default goal: lose 10% of starting weight
                    const suggestedGoal = Math.round(parseFloat(weight) * 0.9 * 10) / 10;
                    profile.goalWeight = suggestedGoal;
                }
            }
            
            saveToStorage(profileKey, profile);
        }
        
        return true;
    } catch (error) {
        console.error('Error adding weight entry:', error);
        return false;
    }
};

function updateDashboardMetrics(profile) {
    if (!profile) {
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) return;
        
        const profileKey = `profile_${currentUser.email}`;
        profile = getFromStorage(profileKey);
        if (!profile) return;
    }
    
    // Update weight info
    const currentWeight = parseFloat(profile.weight) || 0;
    const weightUnit = profile.weightUnit || 'kg';
    const weightDisplay = `${currentWeight} ${weightUnit}`;
    
    const currentWeightElement = document.getElementById('currentWeight');
    if (currentWeightElement) {
        currentWeightElement.textContent = weightDisplay;
    }
    
    // Update goal progress
    const goalWeight = parseFloat(profile.goalWeight) || 0;
    if (goalWeight > 0 && currentWeight > 0) {
        const startWeight = parseFloat(profile.startWeight || profile.weight) || 0;
        const totalToLose = Math.max(0.1, startWeight - goalWeight);
        const lost = Math.max(0, startWeight - currentWeight);
        
        let progressPercent = 0;
        if (totalToLose > 0) {
            progressPercent = (lost / totalToLose) * 100;
            progressPercent = Math.min(100, Math.max(0, progressPercent));
        }
        
        // Update progress display
        const progressPercentElement = document.getElementById('progressPercent');
        const progressBarElement = document.getElementById('progressBar');
        
        if (progressPercentElement) {
            progressPercentElement.textContent = `${Math.round(progressPercent)}%`;
        }
        
        if (progressBarElement) {
            progressBarElement.style.width = `${progressPercent}%`;
        }
        
        // Update remaining to goal
        const remainingToLose = Math.max(0, currentWeight - goalWeight);
        const remainingToGoalElement = document.getElementById('remainingToGoal');
        if (remainingToGoalElement) {
            if (remainingToLose <= 0) {
                remainingToGoalElement.textContent = `Goal reached! 🎉`;
            } else {
                remainingToGoalElement.textContent = `${remainingToLose.toFixed(1)} ${weightUnit} to go`;
            }
        }
    }
    
    // Update estimated completion date
    const dailyDeficit = parseFloat(profile.dailyDeficit) || 500;
    const remainingToLose = Math.max(0, currentWeight - goalWeight);
    
    if (remainingToLose > 0 && dailyDeficit > 0) {
        const caloriesPerKg = 7700;
        const weightLossPerWeek = (dailyDeficit * 7) / caloriesPerKg * 0.85;
        const weeksToGoal = remainingToLose / weightLossPerWeek;
        
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + Math.round(weeksToGoal * 7));
        const daysRemaining = Math.round(weeksToGoal * 7);
        
        // Update estimated date display
        const estimatedDateElement = document.getElementById('estimatedDate');
        if (estimatedDateElement) {
            estimatedDateElement.textContent = estimatedDate.toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
            });
        }
        
        const daysRemainingElement = document.getElementById('daysRemaining');
        if (daysRemainingElement) {
            daysRemainingElement.textContent = `~${daysRemaining} days remaining`;
        }
    }
    
    // Update energy metrics (already handled by updateEnergyMetrics function)
    if (typeof window.updateEnergyMetrics === 'function') {
        window.updateEnergyMetrics();
    }
    
    // Update calories
    const dailyGoal = parseFloat(profile.dailyGoal) || 2000;
    const caloriesConsumedElement = document.getElementById('caloriesConsumed');
    if (caloriesConsumedElement) {
        // Get food data for today
        const today = new Date();
        const yearMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
        const dayStr = today.getDate().toString().padStart(2, '0');
        
        const currentUser = getFromStorage('currentUser');
        if (!currentUser) return;
        
        const foodsKey = `foods_${currentUser.email}_${yearMonth}`;
        const monthFoods = getFromStorage(foodsKey, {});
        const dayFoods = monthFoods[dayStr];
        
        let totalCalories = 0;
        if (dayFoods) {
            Object.values(dayFoods).forEach(foods => {
                if (Array.isArray(foods)) {
                    foods.forEach(food => {
                        totalCalories += (food.calories || 0) * (food.quantity || 1);
                    });
                }
            });
        }
        
        caloriesConsumedElement.textContent = `${Math.round(totalCalories)} / ${Math.round(dailyGoal)} kcal`;
        
        // Update calorie bar
        const caloriePercent = dailyGoal > 0 ? (totalCalories / dailyGoal) * 100 : 0;
        const caloriesBarElement = document.getElementById('caloriesBar');
        if (caloriesBarElement) {
            caloriesBarElement.style.width = `${Math.min(100, Math.max(0, caloriePercent))}%`;
        }
        
        // Update calories remaining
        const caloriesRemaining = dailyGoal - totalCalories;
        const caloriesRemainingElement = document.getElementById('caloriesRemaining');
        if (caloriesRemainingElement) {
            caloriesRemainingElement.textContent = caloriesRemaining > 0 
                ? `${Math.round(caloriesRemaining)} kcal remaining` 
                : `${Math.abs(Math.round(caloriesRemaining))} kcal over budget`;
        }
    }
}

// Export functions to global scope for backward compatibility
window.initializeCharts = initializeCharts;
window.updateCharts = updateCharts;
window.getMacroData = function() { return {}; }; // Empty function
window.createMacroChart = function() {
    console.log('Macronutrient chart has been removed');
    return null;
}; // Empty function with log
window.updateChartTheme = function() {}; // Empty function
window.enhanceChartUI = function() {}; // Empty function 
window.updateDashboardMetrics = updateDashboardMetrics; // Export new function
