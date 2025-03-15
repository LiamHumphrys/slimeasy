/**
 * SlimEasy Charts Module
 * Provides visualization charts for user progress
 */

// Chart color palette based on app theme
const chartColors = {
    primary: '#4CAF50',
    secondary: '#2196F3',
    accent: '#FFC107',
    danger: '#F44336',
    light: 'rgba(76, 175, 80, 0.1)',
    primaryTransparent: 'rgba(76, 175, 80, 0.2)',
    secondaryTransparent: 'rgba(33, 150, 243, 0.2)',
    grid: 'rgba(0, 0, 0, 0.05)',
    text: '#666'
};

// Shared chart options
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 12,
                padding: 15,
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#ddd',
            borderWidth: 1,
            cornerRadius: 8,
            boxPadding: 6,
            usePointStyle: true
        }
    },
    scales: {
        x: {
            grid: {
                color: chartColors.grid,
                borderColor: chartColors.grid,
                tickColor: chartColors.grid
            },
            ticks: {
                font: {
                    size: 11
                },
                color: chartColors.text
            }
        },
        y: {
            grid: {
                color: chartColors.grid,
                borderColor: chartColors.grid,
                tickColor: chartColors.grid
            },
            ticks: {
                font: {
                    size: 11
                },
                color: chartColors.text
            },
            beginAtZero: true
        }
    }
};

// Chart instances
let weightChart = null;
let calorieChart = null;
let avgCalorieChart = null;
let exerciseChart = null;

/**
 * Initialize all dashboard charts
 * @param {Object} profile - User profile data
 */
function initializeCharts(profile) {
    // Get user data to populate charts
    const weightData = getWeightChartData(profile);
    const calorieData = getCalorieChartData();
    const exerciseData = getExerciseChartData();
    
    // Create charts
    createWeightChart(weightData.labels, weightData.values, weightData.trend);
    createCalorieChart(calorieData.labels, calorieData.intake, calorieData.goal);
    createExerciseChart(exerciseData.labels, exerciseData.values);
    // Note: Average Calorie Chart removed to maintain 4 graphs
    createExerciseChart(exerciseData.labels, exerciseData.values);
}

/**
 * Get weight data for chart
 * @param {Object} profile - User profile data
 * @returns {Object} Chart data with labels, values, and trend
 */
function getWeightChartData(profile) {
    // Get weight history
    const weightHistory = getWeeklyWeightData();
    
    // Create datasets
    const labels = [];
    const values = [];
    
    // Add weight entries
    weightHistory.forEach(entry => {
        const date = new Date(entry.date);
        labels.push(formatChartDate(date));
        values.push(entry.weight);
    });
    
    // Calculate weight trend line using simple moving average
    const trend = calculateTrendLine(values);
    
    return { labels, values, trend };
}

/**
 * Format date for chart display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatChartDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Calculate trend line using simple moving average
 * @param {Array} data - Data array
 * @param {number} period - Moving average period
 * @returns {Array} Trend line data
 */
function calculateTrendLine(data, period = 3) {
    if (!data || data.length < period) {
        return data.map(v => v); // Return copy of original if not enough data
    }
    
    const result = [];
    
    // Add null values for the start points
    for (let i = 0; i < period - 1; i++) {
        result.push(null);
    }
    
    // Calculate moving average for the rest
    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j];
        }
        result.push(parseFloat((sum / period).toFixed(1)));
    }
    
    return result;
}

/**
 * Get calorie data for daily chart
 * @returns {Object} Chart data with labels, intake, and goal
 */
function getCalorieChartData() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return { labels: [], intake: [], goal: [] };
    
    // Get profile for goal
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    const dailyGoal = profile && profile.dailyGoal ? parseFloat(profile.dailyGoal) : 2000;
    
    // Get last 7 days of calorie data
    const userKey = `planner_${currentUser.email}`;
    const weeklyCalories = getFromStorage(`${userKey}_calories`, [0, 0, 0, 0, 0, 0, 0]);
    const weeklyExercise = getFromStorage(`${userKey}_exercise`, [0, 0, 0, 0, 0, 0, 0]);
    
    // Get day labels
    const labels = [];
    const intake = [];
    const goal = [];
    
    // Create the last 7 days labels
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(formatChartDate(date));
        
        // Add data - weekday order in app is Monday(0) to Sunday(6)
        // JS Date has Sunday(0) to Saturday(6), so we need to convert
        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
        
        // Net calorie intake (consumed - burned)
        intake.push(Math.max(0, weeklyCalories[dayIndex] - weeklyExercise[dayIndex]));
        
        // Daily goal
        goal.push(dailyGoal);
    }
    
    return { labels, intake, goal };
}

/**
 * Get average calorie data for weekly chart
 * @returns {Object} Chart data with labels, values, and trend
 */
function getAvgCalorieChartData() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return { labels: [], values: [], trend: [] };
    
    // Mock data for the past 4 weeks to show trend
    // In a real app, we would pull historical data from storage
    const today = new Date();
    const labels = [];
    const values = [];
    
    // Create 4 weeks of data
    for (let i = 3; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        
        // Format week label
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const label = `${formatChartDate(weekStart)} - ${formatChartDate(weekEnd)}`;
        labels.push(label);
        
        // Simulate downward trend in average calories
        // More consistent with weight loss goal
        const baseCalories = 1900;
        const reduction = i * 75; // Each week shows improvement
        const variance = Math.random() * 100 - 50; // Add some natural variance
        values.push(Math.round(baseCalories - reduction + variance));
    }
    
    // Add trend line
    const trend = calculateTrendLine(values);
    
    return { labels, values, trend };
}

/**
 * Get exercise data for chart
 * @returns {Object} Chart data with labels and values
 */
function getExerciseChartData() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return { labels: [], values: [] };
    
    // Get exercise calories
    const userKey = `planner_${currentUser.email}`;
    const weeklyExercise = getFromStorage(`${userKey}_exercise`, [0, 0, 0, 0, 0, 0, 0]);
    
    // Create labels for days of week
    const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return { labels, values: weeklyExercise };
}

/**
 * Create and render weight trend chart
 * @param {Array} labels - X-axis labels
 * @param {Array} values - Weight values
 * @param {Array} trend - Trend line values
 */
function createWeightChart(labels, values, trend) {
    const ctx = document.getElementById('weightChart');
    if (!ctx) return;
    
    // Destroy previous chart instance if it exists
    if (weightChart) {
        weightChart.destroy();
    }
    
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Weight',
                    data: values,
                    backgroundColor: chartColors.primaryTransparent,
                    borderColor: chartColors.primary,
                    borderWidth: 2,
                    pointBackgroundColor: chartColors.primary,
                    pointRadius: 4,
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Trend',
                    data: trend,
                    borderColor: chartColors.secondary,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            // Get weight unit from profile
                            const currentUser = getFromStorage('currentUser');
                            const profileKey = `profile_${currentUser.email}`;
                            const profile = getFromStorage(profileKey);
                            const unit = profile && profile.weightUnit ? profile.weightUnit : 'kg';
                            return `${label}: ${value} ${unit}`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create and render calorie intake chart
 * @param {Array} labels - X-axis labels
 * @param {Array} intake - Calorie intake values
 * @param {Array} goal - Goal calorie values
 */
function createCalorieChart(labels, intake, goal) {
    const ctx = document.getElementById('calorieChart');
    if (!ctx) return;
    
    // Destroy previous chart instance if it exists
    if (calorieChart) {
        calorieChart.destroy();
    }
    
    calorieChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Net Calories',
                    data: intake,
                    backgroundColor: chartColors.primaryTransparent,
                    borderColor: chartColors.primary,
                    borderWidth: 1,
                    borderRadius: 4,
                    categoryPercentage: 0.6,
                    barPercentage: 0.8
                },
                {
                    label: 'Goal',
                    data: goal,
                    type: 'line',
                    borderColor: chartColors.accent,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointStyle: 'dash',
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            ...chartDefaults,
            scales: {
                ...chartDefaults.scales,
                y: {
                    ...chartDefaults.scales.y,
                    title: {
                        display: true,
                        text: 'Calories (kcal)'
                    }
                }
            }
        }
    });
}

/**
 * Create and render average calorie chart
 * @param {Array} labels - X-axis labels
 * @param {Array} values - Average calorie values
 * @param {Array} trend - Trend line values
 */
function createAvgCalorieChart(labels, values, trend) {
    const ctx = document.getElementById('avgCalorieChart');
    if (!ctx) return;
    
    // Destroy previous chart instance if it exists
    if (avgCalorieChart) {
        avgCalorieChart.destroy();
    }
    
    avgCalorieChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Avg. Calories',
                    data: values,
                    backgroundColor: chartColors.secondaryTransparent,
                    borderColor: chartColors.secondary,
                    borderWidth: 2,
                    pointBackgroundColor: chartColors.secondary,
                    pointRadius: 4,
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Trend',
                    data: trend,
                    borderColor: chartColors.accent,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            ...chartDefaults,
            scales: {
                ...chartDefaults.scales,
                y: {
                    ...chartDefaults.scales.y,
                    title: {
                        display: true,
                        text: 'Calories (kcal)'
                    }
                }
            }
        }
    });
}

/**
 * Create and render exercise activity chart
 * @param {Array} labels - X-axis labels
 * @param {Array} values - Exercise calorie values
 */
function createExerciseChart(labels, values) {
    const ctx = document.getElementById('exerciseChart');
    if (!ctx) return;
    
    // Destroy previous chart instance if it exists
    if (exerciseChart) {
        exerciseChart.destroy();
    }
    
    exerciseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Calories Burned',
                    data: values,
                    backgroundColor: chartColors.secondaryTransparent,
                    borderColor: chartColors.secondary,
                    borderWidth: 1,
                    borderRadius: 4,
                    categoryPercentage: 0.6,
                    barPercentage: 0.8
                }
            ]
        },
        options: {
            ...chartDefaults,
            scales: {
                ...chartDefaults.scales,
                y: {
                    ...chartDefaults.scales.y,
                    title: {
                        display: true,
                        text: 'Calories Burned (kcal)'
                    }
                }
            }
        }
    });
}

/**
 * Update charts based on view mode (weekly or monthly)
 * @param {string} viewMode - 'weekly' or 'monthly'
 */
function updateCharts(viewMode) {
    // Get current user profile
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return;
    
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    
    // Update time period of data based on view mode
    if (viewMode === 'weekly') {
        // Show last 4 weeks
        const weightData = getWeightChartData(profile);
        const calorieData = getCalorieChartData();
        
        // Update charts with new data
        if (weightChart) {
            weightChart.data.labels = weightData.labels;
            weightChart.data.datasets[0].data = weightData.values;
            weightChart.data.datasets[1].data = weightData.trend;
            weightChart.update();
        }
        
        if (calorieChart) {
            calorieChart.data.labels = calorieData.labels;
            calorieChart.data.datasets[0].data = calorieData.intake;
            calorieChart.data.datasets[1].data = calorieData.goal;
            calorieChart.update();
        }
    } else if (viewMode === 'monthly') {
        // Simulate monthly view with expanded data
        const monthlyWeightData = getMonthlyWeightData(profile);
        const monthlyCalorieData = getMonthlyCalorieData();
        
        // Update charts with monthly data
        if (weightChart) {
            weightChart.data.labels = monthlyWeightData.labels;
            weightChart.data.datasets[0].data = monthlyWeightData.values;
            weightChart.data.datasets[1].data = monthlyWeightData.trend;
            weightChart.update();
        }
        
        if (calorieChart) {
            calorieChart.data.labels = monthlyCalorieData.labels;
            calorieChart.data.datasets[0].data = monthlyCalorieData.intake;
            calorieChart.data.datasets[1].data = monthlyCalorieData.goal;
            calorieChart.update();
        }
    }
}

/**
 * Get monthly weight data for chart
 * @param {Object} profile - User profile data
 * @returns {Object} Chart data with labels, values, and trend
 */
function getMonthlyWeightData(profile) {
    // Get weight history
    const weightHistory = getWeeklyWeightData();
    
    // Create additional historical data if we don't have enough
    const labels = [];
    const values = [];
    
    // If we have some real data points
    if (weightHistory.length > 0) {
        // Use the actual data we have
        weightHistory.forEach(entry => {
            const date = new Date(entry.date);
            labels.push(formatChartDate(date));
            values.push(entry.weight);
        });
        
        // Add projected data for the next 2 months
        const lastWeight = weightHistory[weightHistory.length - 1].weight;
        const goalWeight = profile.goalWeight;
        const lastDate = new Date(weightHistory[weightHistory.length - 1].date);
        
        // Add 8 more weeks of projected data
        for (let i = 1; i <= 8; i++) {
            const date = new Date(lastDate);
            date.setDate(date.getDate() + (i * 7));
            labels.push(formatChartDate(date));
            
            // Progress toward goal weight with diminishing returns
            const progressFactor = 1 - Math.exp(-i / 10); // Exponential decay function
            const weeklyLoss = 0.5 * progressFactor; // Diminishing weight loss
            const projectedWeight = Math.max(goalWeight, lastWeight - (weeklyLoss * i));
            
            values.push(parseFloat(projectedWeight.toFixed(1)));
        }
    } else {
        // Generate completely mocked data if no history exists
        const startWeight = profile.weight || 70;
        const goalWeight = profile.goalWeight || startWeight - 5;
        
        // Generate 3 months of weekly data
        const today = new Date();
        today.setDate(today.getDate() - 84); // Start 12 weeks ago
        
        for (let i = 0; i < 12; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + (i * 7));
            labels.push(formatChartDate(date));
            
            // Progressive weight loss curve
            const weeksSoFar = i + 1;
            const progressFactor = 1 - Math.exp(-weeksSoFar / 15);
            const targetLoss = startWeight - goalWeight;
            const currentLoss = targetLoss * progressFactor;
            
            // Add some natural fluctuation
            const fluctuation = (Math.random() * 0.4) - 0.2;
            const weekWeight = (startWeight - currentLoss + fluctuation).toFixed(1);
            
            values.push(parseFloat(weekWeight));
        }
    }
    
    // Calculate weight trend line
    const trend = calculateTrendLine(values, 4);
    
    return { labels, values, trend };
}

/**
 * Get monthly calorie data for chart
 * @returns {Object} Chart data with labels, intake, and goal
 */
function getMonthlyCalorieData() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return { labels: [], intake: [], goal: [] };
    
    // Get profile for goal
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    const dailyGoal = profile && profile.dailyGoal ? parseFloat(profile.dailyGoal) : 2000;
    
    // Generate 30 days of data
    const labels = [];
    const intake = [];
    const goal = [];
    
    // Create labels for the past 30 days
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(formatChartDate(date));
        
        // Generate semi-realistic calorie intake
        // Most days under goal, occasional days over
        const variance = Math.random();
        let calorieValue;
        
        if (variance > 0.8) {
            // Occasional day over goal
            calorieValue = dailyGoal + Math.round(Math.random() * 300);
        } else {
            // Most days under goal
            calorieValue = dailyGoal - Math.round(Math.random() * 300);
        }
        
        intake.push(Math.max(0, calorieValue));
        goal.push(dailyGoal);
    }
    
    return { labels, intake, goal };
}

/**
 * Display a confirmation dialog for weight input
 */
function promptWeeklyWeight() {
    // Get current user
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return;
    
    // Get profile data for context
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    if (!profile) return;
    
    // Get weight unit
    const weightUnit = profile.weightUnit || 'kg';
    
    // Create prompt for weight
    let weight = prompt(`Enter your current weight (${weightUnit}):`, profile.weight || '');
    
    // Validate input
    if (weight !== null) {
        weight = parseFloat(weight);
        if (!isNaN(weight) && weight > 0) {
            // Add weight entry
            addWeeklyWeightEntry(weight);
            
            // Update profile weight
            profile.weight = weight;
            saveToStorage(profileKey, profile);
            
            // Update displays
            initializeCharts(profile);
            initializeStats(profile, new Date());
            
            // Show success notification
            showNotification('Weight updated successfully!', 'success');
        } else {
            showNotification('Please enter a valid weight value', 'error');
        }
    }
}

/**
 * Update weight history display
 * @param {Array} weightData - Array of weight entries with date and weight
 */
function updateWeightHistoryDisplay(weightData) {
    const historyContainer = document.getElementById('weightHistoryEntries');
    if (!historyContainer) return;
    
    // Clear existing entries
    historyContainer.innerHTML = '';
    
    // Get current user profile for weight unit
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return;
    
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    const weightUnit = profile && profile.weightUnit ? profile.weightUnit : 'kg';
    
    // Sort entries by date (newest first)
    const sortedData = [...weightData].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Add entries to display
    sortedData.forEach((entry, index) => {
        // Only show last 5 entries max
        if (index < 5) {
            const entryDate = new Date(entry.date);
            const formattedDate = entryDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit'
            });
            
            const entryEl = document.createElement('div');
            entryEl.className = 'weight-entry';
            entryEl.innerHTML = `
                <div class="weight-entry-date">${formattedDate}</div>
                <div class="weight-entry-value">${entry.weight} ${weightUnit}</div>
            `;
            
            historyContainer.appendChild(entryEl);
        }
    });
}

/**
 * Get macronutrient data for the current day/week
 * @param {string} period - 'day' or 'week'
 * @returns {Object} Macronutrient data
 */
function getMacroData(period = 'day') {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return { protein: 0, carbs: 0, fat: 0 };
    
    // Mock data for now - in a real app we would calculate from food entries
    // These would be calculated by aggregating nutrient data from food entries
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    
    if (period === 'day') {
        // Get today's data
        const today = new Date();
        const dateKey = today.toISOString().split('T')[0];
        const yearMonth = dateKey.substring(0, 7);
        const day = dateKey.substring(8, 10);
        
        // Check for food data
        const foodsKey = `foods_${currentUser.email}_${yearMonth}`;
        const monthFoods = getFromStorage(foodsKey, {});
        
        // Get today's foods
        const dayFoods = monthFoods[day] || {};
        
        // Calculate macros from all meals
        Object.values(dayFoods).forEach(meal => {
            if (Array.isArray(meal)) {
                meal.forEach(food => {
                    protein += food.protein || 0;
                    carbs += food.carbs || 0;
                    fat += food.fat || 0;
                });
            }
        });
    } else {
        // For demo purposes, generate sample data
        // In a real app, we would aggregate across the week
        protein = 65 + Math.round(Math.random() * 20);
        carbs = 120 + Math.round(Math.random() * 30);
        fat = 48 + Math.round(Math.random() * 15);
    }
    
    // If no data yet, generate sample data for demo
    if (protein === 0 && carbs === 0 && fat === 0) {
        protein = 65 + Math.round(Math.random() * 20);
        carbs = 120 + Math.round(Math.random() * 30);
        fat = 48 + Math.round(Math.random() * 15);
    }
    
    return { protein, carbs, fat };
}

/**
 * Create and render macronutrient pie chart
 */
function createMacroChart() {
    const ctx = document.getElementById('macroChart');
    if (!ctx) return;
    
    // Get macro data
    const macroData = getMacroData('day');
    const { protein, carbs, fat } = macroData;
    
    // Calculate total and percentages
    const total = protein + carbs + fat;
    const proteinPct = total > 0 ? Math.round(protein / total * 100) : 0;
    const carbsPct = total > 0 ? Math.round(carbs / total * 100) : 0;
    const fatPct = total > 0 ? Math.round(fat / total * 100) : 0;
    
    // Update UI progress bars and values
    document.getElementById('proteinBar').style.width = `${proteinPct}%`;
    document.getElementById('carbsBar').style.width = `${carbsPct}%`;
    document.getElementById('fatBar').style.width = `${fatPct}%`;
    
    document.getElementById('proteinValue').textContent = `${Math.round(protein)}g`;
    document.getElementById('carbsValue').textContent = `${Math.round(carbs)}g`;
    document.getElementById('fatValue').textContent = `${Math.round(fat)}g`;
    
    document.getElementById('proteinPercent').textContent = `${proteinPct}%`;
    document.getElementById('carbsPercent').textContent = `${carbsPct}%`;
    document.getElementById('fatPercent').textContent = `${fatPct}%`;
    
    // Destroy previous chart instance if it exists
    if (window.macroChart) {
        window.macroChart.destroy();
    }
    
    // Create pie chart
    window.macroChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Protein', 'Carbs', 'Fat'],
            datasets: [{
                data: [protein, carbs, fat],
                backgroundColor: ['#E91E63', '#2196F3', '#FF9800'],
                borderColor: ['#C2185B', '#1976D2', '#F57C00'],
                borderWidth: 1,
                hoverOffset: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw;
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value}g (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update dashboard initialization to include macro chart
const originalInitializeCharts = initializeCharts;
initializeCharts = function(profile) {
    // Call the original function
    originalInitializeCharts(profile);
    
    // Add macro chart
    createMacroChart();
};

// Update when view changes
const originalUpdateCharts = updateCharts;
updateCharts = function(period) {
    // Call the original function
    originalUpdateCharts(period);
    
    // Update macro chart based on period
    createMacroChart();
};

// Export functions to global scope
window.initializeCharts = initializeCharts;
window.updateCharts = updateCharts;
window.promptWeeklyWeight = promptWeeklyWeight;
window.getMacroData = getMacroData;
window.createMacroChart = createMacroChart;