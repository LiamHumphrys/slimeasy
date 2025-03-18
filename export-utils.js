/**
 * SlimEasy Export & Sharing Utilities
 * Provides functionality for exporting and sharing meal plans
 */

// File formats supported for export
window.EXPORT_FORMATS = window.EXPORT_FORMATS || {
    PDF: 'pdf',
    CSV: 'csv',
    JSON: 'json',
    TEXT: 'text'
};

// Social platforms for sharing
window.SHARE_PLATFORMS = window.SHARE_PLATFORMS || {
    EMAIL: 'email',
    WHATSAPP: 'whatsapp',
    TWITTER: 'twitter',
    FACEBOOK: 'facebook',
    COPY: 'copy'
};

/**
 * Initialize export functionality
 */
function initializeExportFeatures() {
    // Replace basic export button with enhanced dropdown
    enhanceExportButton();
    
    // Set up event listeners
    setupEventListeners();
}

/**
 * Replace the basic export button with an enhanced dropdown with multiple options
 */
function enhanceExportButton() {
    const exportBtn = document.getElementById('exportPlan');
    if (!exportBtn) return;
    
    // Get the parent container
    const parentContainer = exportBtn.parentNode;
    if (!parentContainer) return;
    
    // Create new export dropdown container
    const exportContainer = document.createElement('div');
    exportContainer.className = 'export-dropdown';
    
    // Create main export button
    const mainExportBtn = document.createElement('button');
    mainExportBtn.className = 'action-button export-btn';
    mainExportBtn.id = 'exportPlanEnhanced';
    mainExportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export & Share';
    
    // Create dropdown content
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'export-dropdown-content';
    
    // Add export options
    dropdownContent.innerHTML = `
        <div class="export-section">
            <div class="export-header">Export as File</div>
            <button class="export-option" data-action="export" data-format="pdf">
                <i class="fas fa-file-pdf"></i> PDF Document
            </button>
            <button class="export-option" data-action="export" data-format="csv">
                <i class="fas fa-file-csv"></i> CSV Spreadsheet
            </button>
            <button class="export-option" data-action="export" data-format="text">
                <i class="fas fa-file-alt"></i> Text File
            </button>
        </div>
        <div class="export-section">
            <div class="export-header">Share</div>
            <button class="export-option" data-action="share" data-platform="email">
                <i class="fas fa-envelope"></i> Email
            </button>
            <button class="export-option" data-action="share" data-platform="whatsapp">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </button>
            <button class="export-option" data-action="share" data-platform="twitter">
                <i class="fab fa-twitter"></i> Twitter
            </button>
            <button class="export-option" data-action="share" data-platform="copy">
                <i class="fas fa-copy"></i> Copy to Clipboard
            </button>
        </div>
        <div class="export-section">
            <div class="export-header">Print</div>
            <button class="export-option" data-action="print">
                <i class="fas fa-print"></i> Print Meal Plan
            </button>
        </div>
    `;
    
    // Assemble dropdown
    exportContainer.appendChild(mainExportBtn);
    exportContainer.appendChild(dropdownContent);
    
    // Replace original button with new dropdown
    parentContainer.replaceChild(exportContainer, exportBtn);
    
    // Add dropdown toggle behavior
    mainExportBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    });
}

/**
 * Set up event listeners for export and share actions
 */
function setupEventListeners() {
    // Listen for clicks on export options
    document.addEventListener('click', function(e) {
        // Find closest button with export-option class
        const button = e.target.closest('.export-option');
        if (!button) return;
        
        // Get action and format or platform
        const action = button.dataset.action;
        const format = button.dataset.format;
        const platform = button.dataset.platform;
        
        // Handle different actions
        if (action === 'export') {
            handleExport(format);
        } else if (action === 'share') {
            handleShare(platform);
        } else if (action === 'print') {
            handlePrint();
        }
        
        // Close dropdown after action
        const dropdown = document.querySelector('.export-dropdown-content');
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    });
}

/**
 * Handle exporting meal plan in different formats
 * @param {string} format - Export format
 */
function handleExport(format) {
    // Get meal plan data
    const mealPlanData = getMealPlanData();
    
    // Handle based on format
    switch (format) {
        case EXPORT_FORMATS.PDF:
            exportAsPDF(mealPlanData);
            break;
        case EXPORT_FORMATS.CSV:
            exportAsCSV(mealPlanData);
            break;
        case EXPORT_FORMATS.TEXT:
            exportAsText(mealPlanData);
            break;
        default:
            showNotification('Unsupported export format', 'error');
    }
}

/**
 * Handle sharing meal plan on different platforms
 * @param {string} platform - Sharing platform
 */
function handleShare(platform) {
    // Get meal plan data in text format
    const mealPlanData = getMealPlanData();
    const textContent = formatMealPlanAsText(mealPlanData);
    
    // Handle based on platform
    switch (platform) {
        case SHARE_PLATFORMS.EMAIL:
            shareViaEmail(mealPlanData, textContent);
            break;
        case SHARE_PLATFORMS.WHATSAPP:
            shareViaWhatsApp(textContent);
            break;
        case SHARE_PLATFORMS.TWITTER:
            shareViaTwitter(textContent);
            break;
        case SHARE_PLATFORMS.FACEBOOK:
            shareViaFacebook(textContent);
            break;
        case SHARE_PLATFORMS.COPY:
            copyToClipboard(textContent);
            break;
        default:
            showNotification('Unsupported sharing platform', 'error');
    }
}

/**
 * Handle printing the meal plan
 */
function handlePrint() {
    // Create a printable version of the meal plan
    const printContent = createPrintableContent();
    
    // Open print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Add small delay to ensure content is loaded
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

/**
 * Get meal plan data from the weekly planner
 * @returns {Object} Meal plan data
 */
function getMealPlanData() {
    // Get the current user
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return null;
    
    // Get profile data
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    
    // Get meal plan data
    const userKey = `planner_${currentUser.email}`;
    const weeklyCalories = getFromStorage(`${userKey}_calories`, [0, 0, 0, 0, 0, 0, 0]);
    const weeklyExercise = getFromStorage(`${userKey}_exercise`, [0, 0, 0, 0, 0, 0, 0]);
    const weeklyFoods = getFromStorage(`${userKey}_foods`, [[], [], [], [], [], [], []]);
    
    // Get goal information
    const dailyGoal = profile && profile.dailyGoal ? profile.dailyGoal : 2000;
    
    // Get the start date of the current displayed week
    const weekStartDate = document.getElementById('weekStartDate');
    let startDate = new Date();
    
    if (weekStartDate && weekStartDate.value) {
        startDate = new Date(weekStartDate.value);
    } else {
        // If no start date input, calculate the Monday of current week
        const day = startDate.getDay(); // 0 = Sunday
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(startDate.setDate(diff));
    }
    
    // Format the days of the week
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        days.push({
            name: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
            date: date.toISOString().split('T')[0],
            formatted: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
        });
    }
    
    // Calculate weekly totals
    const weeklyTotal = weeklyCalories.reduce((a, b) => a + b, 0);
    const weeklyExerciseTotal = weeklyExercise.reduce((a, b) => a + b, 0);
    const weeklyNet = weeklyTotal - weeklyExerciseTotal;
    const weeklyGoal = dailyGoal * 7;
    const weeklyOutcome = weeklyGoal - weeklyNet;
    
    // Return compiled data
    return {
        user: currentUser.name,
        email: currentUser.email,
        period: {
            startDate: startDate.toISOString().split('T')[0],
            endDate: new Date(startDate.setDate(startDate.getDate() + 6)).toISOString().split('T')[0]
        },
        goals: {
            dailyCalories: dailyGoal,
            weeklyCalories: weeklyGoal,
            currentWeight: profile ? profile.weight : null,
            goalWeight: profile ? profile.goalWeight : null
        },
        summary: {
            totalCalories: weeklyTotal,
            totalExercise: weeklyExerciseTotal,
            netCalories: weeklyNet,
            outcome: weeklyOutcome
        },
        days: days.map((day, index) => ({
            ...day,
            calories: weeklyCalories[index],
            exercise: weeklyExercise[index],
            net: weeklyCalories[index] - weeklyExercise[index],
            remaining: dailyGoal - (weeklyCalories[index] - weeklyExercise[index]),
            foods: organizeFood(weeklyFoods[index])
        }))
    };
}

/**
 * Organize food items by meal type
 * @param {Array} foods - Food items
 * @returns {Object} Organized food items
 */
function organizeFood(foods) {
    // If no foods, return empty object
    if (!Array.isArray(foods) || foods.length === 0) {
        return {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: [],
            exercise: []
        };
    }
    
    // Group foods by type
    return {
        breakfast: foods.filter(food => food.type === 'breakfast'),
        lunch: foods.filter(food => food.type === 'lunch'),
        dinner: foods.filter(food => food.type === 'dinner'),
        snack: foods.filter(food => food.type === 'snack'),
        exercise: foods.filter(food => food.type === 'exercise')
    };
}

/**
 * Create printable HTML content for the meal plan
 * @returns {string} HTML content
 */
function createPrintableContent() {
    const mealPlanData = getMealPlanData();
    if (!mealPlanData) return '<h1>No meal plan data available</h1>';
    
    // Create HTML
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SlimEasy Meal Plan</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1, h2, h3 {
                    color: #4CAF50;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #4CAF50;
                }
                .summary {
                    background-color: #f5f5f5;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                .day {
                    margin-bottom: 30px;
                    break-inside: avoid;
                }
                .day-header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 5px;
                    margin-bottom: 10px;
                }
                .meal-section {
                    margin-bottom: 15px;
                }
                .meal-type {
                    font-weight: bold;
                    color: #4CAF50;
                    margin-bottom: 5px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #f5f5f5;
                }
                .calories {
                    text-align: right;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 12px;
                    color: #777;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                    .no-print {
                        display: none;
                    }
                    .page-break {
                        page-break-after: always;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>SlimEasy Meal Plan</h1>
                <p>Week of ${mealPlanData.days[0].formatted} - ${mealPlanData.days[6].formatted}</p>
                <p>Created for: ${mealPlanData.user}</p>
            </div>
            
            <div class="summary">
                <h2>Weekly Summary</h2>
                <p><strong>Daily Calorie Goal:</strong> ${mealPlanData.goals.dailyCalories} kcal</p>
                <p><strong>Weekly Calorie Goal:</strong> ${mealPlanData.goals.weeklyCalories} kcal</p>
                <p><strong>Total Weekly Intake:</strong> ${mealPlanData.summary.totalCalories} kcal</p>
                <p><strong>Total Exercise Burn:</strong> ${mealPlanData.summary.totalExercise} kcal</p>
                <p><strong>Net Calories:</strong> ${mealPlanData.summary.netCalories} kcal</p>
                ${mealPlanData.summary.outcome >= 0 ? 
                    `<p><strong>Weekly Deficit:</strong> ${mealPlanData.summary.outcome} kcal</p>` : 
                    `<p><strong>Weekly Surplus:</strong> ${Math.abs(mealPlanData.summary.outcome)} kcal</p>`
                }
            </div>
            
            ${mealPlanData.days.map(day => `
                <div class="day">
                    <div class="day-header">
                        <h3>${day.formatted}</h3>
                    </div>
                    
                    ${day.foods.breakfast.length > 0 ? `
                        <div class="meal-section">
                            <div class="meal-type">Breakfast</div>
                            <ul>
                                ${day.foods.breakfast.map(food => `
                                    <li>${food.text}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${day.foods.lunch.length > 0 ? `
                        <div class="meal-section">
                            <div class="meal-type">Lunch</div>
                            <ul>
                                ${day.foods.lunch.map(food => `
                                    <li>${food.text}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${day.foods.dinner.length > 0 ? `
                        <div class="meal-section">
                            <div class="meal-type">Dinner</div>
                            <ul>
                                ${day.foods.dinner.map(food => `
                                    <li>${food.text}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${day.foods.snack.length > 0 ? `
                        <div class="meal-section">
                            <div class="meal-type">Snacks</div>
                            <ul>
                                ${day.foods.snack.map(food => `
                                    <li>${food.text}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${day.foods.exercise.length > 0 ? `
                        <div class="meal-section">
                            <div class="meal-type">Exercise</div>
                            <ul>
                                ${day.foods.exercise.map(food => `
                                    <li>${food.text}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <table>
                        <tr>
                            <th>Total Intake</th>
                            <th>Exercise Burn</th>
                            <th>Net Calories</th>
                            <th>Remaining</th>
                        </tr>
                        <tr>
                            <td class="calories">${day.calories} kcal</td>
                            <td class="calories">${day.exercise} kcal</td>
                            <td class="calories">${day.net} kcal</td>
                            <td class="calories ${day.remaining >= 0 ? 'positive' : 'negative'}">${day.remaining} kcal</td>
                        </tr>
                    </table>
                </div>
                ${day.name !== 'Sunday' ? '<div class="page-break"></div>' : ''}
            `).join('')}
            
            <div class="footer">
                <p>Generated by SlimEasy App - Your Smart Weight Management Assistant</p>
            </div>
            
            <div class="no-print">
                <button onclick="window.print()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">
                    Print this Plan
                </button>
            </div>
        </body>
        </html>
    `;
}

/**
 * Format meal plan as CSV
 * @param {Object} mealPlanData - Meal plan data
 * @returns {string} CSV content
 */
function formatMealPlanAsCSV(mealPlanData) {
    if (!mealPlanData || !mealPlanData.days) return '';
    
    // CSV header
    let csv = 'Day,Date,Breakfast,Lunch,Dinner,Snacks,Exercise,Total Calories,Exercise Calories,Net Calories,Remaining Calories\n';
    
    // Add rows for each day
    mealPlanData.days.forEach(day => {
        // Make sure day.foods exists and has the expected structure
        if (!day.foods) {
            day.foods = { breakfast: [], lunch: [], dinner: [], snack: [], exercise: [] };
        }
        
        // Ensure all meal type arrays exist
        day.foods.breakfast = Array.isArray(day.foods.breakfast) ? day.foods.breakfast : [];
        day.foods.lunch = Array.isArray(day.foods.lunch) ? day.foods.lunch : [];
        day.foods.dinner = Array.isArray(day.foods.dinner) ? day.foods.dinner : [];
        day.foods.snack = Array.isArray(day.foods.snack) ? day.foods.snack : [];
        day.foods.exercise = Array.isArray(day.foods.exercise) ? day.foods.exercise : [];
        
        // Format meals as comma-separated list
        const breakfast = day.foods.breakfast.map(f => f.text ? f.text.replace(/,/g, ' ') : '').join('; ');
        const lunch = day.foods.lunch.map(f => f.text ? f.text.replace(/,/g, ' ') : '').join('; ');
        const dinner = day.foods.dinner.map(f => f.text ? f.text.replace(/,/g, ' ') : '').join('; ');
        const snacks = day.foods.snack.map(f => f.text ? f.text.replace(/,/g, ' ') : '').join('; ');
        const exercise = day.foods.exercise.map(f => f.text ? f.text.replace(/,/g, ' ') : '').join('; ');
        
        // Add row
        csv += `${day.name},${day.date},"${breakfast}","${lunch}","${dinner}","${snacks}","${exercise}",${day.calories || 0},${day.exercise || 0},${day.net || 0},${day.remaining || 0}\n`;
    });
    
    // Add summary row (with null checks)
    if (mealPlanData.period && mealPlanData.summary && mealPlanData.goals) {
        csv += `\nSummary,${mealPlanData.period.startDate} to ${mealPlanData.period.endDate},,,,,,${mealPlanData.summary.totalCalories || 0},${mealPlanData.summary.totalExercise || 0},${mealPlanData.summary.netCalories || 0},${(mealPlanData.goals.weeklyCalories || 0) - (mealPlanData.summary.netCalories || 0)}\n`;
    }
    
    return csv;
}

/**
 * Format meal plan as plain text
 * @param {Object} mealPlanData - Meal plan data
 * @returns {string} Formatted text
 */
function formatMealPlanAsText(mealPlanData) {
    if (!mealPlanData) return 'No meal plan data available';
    
    // Helper to create a separator line
    const separator = '-'.repeat(50) + '\n';
    
    // Start with header
    let text = 'SLIMEASY MEAL PLAN\n';
    text += separator;
    text += `Week of ${mealPlanData.days[0].formatted} - ${mealPlanData.days[6].formatted}\n`;
    text += `Created for: ${mealPlanData.user}\n\n`;
    
    // Add summary
    text += 'WEEKLY SUMMARY\n';
    text += separator;
    text += `Daily Calorie Goal: ${mealPlanData.goals.dailyCalories} kcal\n`;
    text += `Weekly Calorie Goal: ${mealPlanData.goals.weeklyCalories} kcal\n`;
    text += `Total Weekly Intake: ${mealPlanData.summary.totalCalories} kcal\n`;
    text += `Total Exercise Burn: ${mealPlanData.summary.totalExercise} kcal\n`;
    text += `Net Calories: ${mealPlanData.summary.netCalories} kcal\n`;
    
    if (mealPlanData.summary.outcome >= 0) {
        text += `Weekly Deficit: ${mealPlanData.summary.outcome} kcal\n\n`;
    } else {
        text += `Weekly Surplus: ${Math.abs(mealPlanData.summary.outcome)} kcal\n\n`;
    }
    
    // Add each day
    mealPlanData.days.forEach(day => {
        text += `${day.formatted.toUpperCase()}\n`;
        text += separator;
        
        // Add meals
        if (day.foods.breakfast.length > 0) {
            text += 'Breakfast:\n';
            day.foods.breakfast.forEach(food => {
                text += `  • ${food.text}\n`;
            });
            text += '\n';
        }
        
        if (day.foods.lunch.length > 0) {
            text += 'Lunch:\n';
            day.foods.lunch.forEach(food => {
                text += `  • ${food.text}\n`;
            });
            text += '\n';
        }
        
        if (day.foods.dinner.length > 0) {
            text += 'Dinner:\n';
            day.foods.dinner.forEach(food => {
                text += `  • ${food.text}\n`;
            });
            text += '\n';
        }
        
        if (day.foods.snack.length > 0) {
            text += 'Snacks:\n';
            day.foods.snack.forEach(food => {
                text += `  • ${food.text}\n`;
            });
            text += '\n';
        }
        
        if (day.foods.exercise.length > 0) {
            text += 'Exercise:\n';
            day.foods.exercise.forEach(food => {
                text += `  • ${food.text}\n`;
            });
            text += '\n';
        }
        
        // Add summary
        text += `Total Intake: ${day.calories} kcal\n`;
        text += `Exercise Burn: ${day.exercise} kcal\n`;
        text += `Net Calories: ${day.net} kcal\n`;
        text += `Remaining: ${day.remaining} kcal\n\n`;
    });
    
    // Add footer
    text += separator;
    text += 'Generated by SlimEasy App - Your Smart Weight Management Assistant\n';
    
    return text;
}

/**
 * Export meal plan as PDF
 * @param {Object} mealPlanData - Meal plan data
 */
function exportAsPDF(mealPlanData) {
    // Create printable content
    const printContent = createPrintableContent();
    
    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Show instructions
    showNotification('Use your browser\'s "Print to PDF" option to save as PDF', 'info');
}

/**
 * Export meal plan as CSV
 * @param {Object} mealPlanData - Meal plan data
 */
function exportAsCSV(mealPlanData) {
    // Format as CSV
    const csvContent = formatMealPlanAsCSV(mealPlanData);
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SlimEasy_MealPlan_${mealPlanData.period.startDate}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Export meal plan as text file
 * @param {Object} mealPlanData - Meal plan data
 */
function exportAsText(mealPlanData) {
    // Format as text
    const textContent = formatMealPlanAsText(mealPlanData);
    
    // Create blob and download link
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SlimEasy_MealPlan_${mealPlanData.period.startDate}.txt`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Share meal plan via email
 * @param {Object} mealPlanData - Meal plan data
 * @param {string} textContent - Formatted text content
 */
function shareViaEmail(mealPlanData, textContent) {
    // Create email subject
    const subject = `SlimEasy Meal Plan: ${mealPlanData.days[0].formatted} - ${mealPlanData.days[6].formatted}`;
    
    // Create email body with intro and text content
    const body = `Hi,

I wanted to share my SlimEasy meal plan for the week of ${mealPlanData.days[0].formatted} - ${mealPlanData.days[6].formatted}.

${textContent}

You can create your own meal plans with SlimEasy!`;
    
    // Create mailto link
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
}

/**
 * Share meal plan via WhatsApp
 * @param {string} textContent - Formatted text content
 */
function shareViaWhatsApp(textContent) {
    // Create shortened message for WhatsApp
    const shortContent = textContent.split('\n').slice(0, 20).join('\n') + '\n...';
    
    // Create WhatsApp link
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shortContent)}`;
    
    // Open in new tab
    window.open(whatsappLink, '_blank');
}

/**
 * Share meal plan via Twitter
 * @param {string} textContent - Formatted text content
 */
function shareViaTwitter(textContent) {
    // Create short summary for Twitter
    const lines = textContent.split('\n');
    const tweetContent = `${lines[0]}\n${lines[1]}\n${lines[2]}\nMy weekly meal plan includes:\n`;
    
    // Add calories summary
    const calorieInfo = lines.filter(line => line.includes('Calorie') || line.includes('calories')).slice(0, 3).join('\n');
    
    // Combine with app mention
    const tweet = `${tweetContent}${calorieInfo}\n\nCreated with SlimEasy app!`;
    
    // Create Twitter link
    const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    
    // Open in new tab
    window.open(twitterLink, '_blank');
}

/**
 * Share meal plan via Facebook
 * @param {string} textContent - Formatted text content
 */
function shareViaFacebook(textContent) {
    // Facebook sharing requires a URL to share, not just text
    // Ideally, you would have a web page that displays this meal plan
    const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent("Check out my SlimEasy meal plan!")}`;
    
    // Open in new tab
    window.open(facebookLink, '_blank');
}

/**
 * Copy meal plan to clipboard
 * @param {string} textContent - Formatted text content
 */
function copyToClipboard(textContent) {
    // Use Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textContent)
            .then(() => {
                showNotification('Meal plan copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                showNotification('Failed to copy to clipboard', 'error');
                fallbackCopyToClipboard(textContent);
            });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(textContent);
    }
}

/**
 * Fallback method to copy text to clipboard
 * @param {string} text - Text to copy
 */
function fallbackCopyToClipboard(text) {
    // Create textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible but part of the document
    textArea.style.position = 'fixed';
    textArea.style.opacity = 0;
    document.body.appendChild(textArea);
    
    // Select and copy
    textArea.select();
    
    let success = false;
    try {
        success = document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    // Clean up
    document.body.removeChild(textArea);
    
    // Show feedback
    if (success) {
        showNotification('Meal plan copied to clipboard!', 'success');
    } else {
        showNotification('Failed to copy to clipboard', 'error');
    }
}

// Add styles for export dropdown
function addExportStyles() {
    // Create style element if it doesn't exist
    let styleEl = document.getElementById('export-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'export-styles';
        document.head.appendChild(styleEl);
    }
    
    // Add CSS rules
    styleEl.textContent = `
        /* Export Dropdown */
        .export-dropdown {
            position: relative;
            display: inline-block;
        }
        
        .export-btn {
            background-color: var(--primary-color, #4CAF50);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .export-btn:hover {
            background-color: var(--primary-dark, #388E3C);
        }
        
        .export-dropdown-content {
            display: none;
            position: absolute;
            right: 0;
            background-color: white;
            min-width: 220px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            z-index: 1000;
            border-radius: 5px;
            overflow: hidden;
            animation: fadeIn 0.3s;
        }
        
        .export-dropdown-content.show {
            display: block;
        }
        
        .export-section {
            border-bottom: 1px solid rgba(0,0,0,0.05);
            padding: 5px 0;
        }
        
        .export-section:last-child {
            border-bottom: none;
        }
        
        .export-header {
            font-size: 12px;
            color: var(--text-secondary, #666);
            font-weight: 500;
            padding: 8px 15px 4px;
        }
        
        .export-option {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 15px;
            font-size: 14px;
            width: 100%;
            text-align: left;
            border: none;
            background: none;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .export-option:hover {
            background-color: rgba(0,0,0,0.05);
        }
        
        .export-option i {
            width: 18px;
            text-align: center;
            color: var(--primary-color, #4CAF50);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    addExportStyles();
    initializeExportFeatures();
});

// Export functions to global scope
window.initializeExportFeatures = initializeExportFeatures;
window.getMealPlanData = getMealPlanData;
window.exportAsPDF = exportAsPDF;
window.exportAsCSV = exportAsCSV;
window.exportAsText = exportAsText;
window.formatMealPlanAsText = formatMealPlanAsText;
window.copyToClipboard = copyToClipboard;
window.shareViaEmail = shareViaEmail;
window.handlePrint = handlePrint;
