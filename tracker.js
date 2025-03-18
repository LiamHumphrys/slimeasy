// Get metrics from localStorage with fallback to URL parameters
// Get the current user
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { email: 'guest' };
const profileKey = `profile_${currentUser.email}`;
const profile = JSON.parse(localStorage.getItem(profileKey)) || {};

// First try to get values from profile in localStorage
let bmr = profile.bmr || 0;
let tdee = profile.tdee || 0;
let currentWeight = profile.weight || 0;
let goalWeight = profile.goal || 0;
let timeWeeks = profile.time || 0;
let goalCalories = profile.goalCalories || 0;

// Fallback to URL parameters if needed (for backward compatibility)
if (bmr === 0 || tdee === 0) {
    const urlParams = new URLSearchParams(window.location.search);
    if (parseFloat(urlParams.get('bmr')) > 0) bmr = parseFloat(urlParams.get('bmr'));
    if (parseFloat(urlParams.get('tdee')) > 0) tdee = parseFloat(urlParams.get('tdee'));
    if (parseFloat(urlParams.get('weight')) > 0) currentWeight = parseFloat(urlParams.get('weight'));
    if (parseFloat(urlParams.get('goal')) > 0) goalWeight = parseFloat(urlParams.get('goal'));
    if (parseFloat(urlParams.get('time')) > 0) timeWeeks = parseFloat(urlParams.get('time'));
    if (parseFloat(urlParams.get('goalCalories')) > 0) goalCalories = parseFloat(urlParams.get('goalCalories'));
}

// Constants for unit conversions
const kcalToKj = 4.184;
const kgToLb = 2.20462;
const unitMultipliers = {
    g: 0.01, cup: 1, oz: 0.2835, tbsp: 0.15, tsp: 0.05, unit: 1
};

// Use goalCalories from URL if provided, otherwise calculate with validation
let dailyGoal;

// Check if we have all necessary values for calculation
if (goalCalories > 0) {
    dailyGoal = goalCalories;
} else if (tdee > 0 && timeWeeks > 0) {
    if (currentWeight > goalWeight) {
        // Calculate from weight loss target
        dailyGoal = tdee - ((currentWeight - goalWeight) * 7700 / (timeWeeks * 7));
    } else if (currentWeight < goalWeight) {
        // Calculate for weight gain
        dailyGoal = tdee + ((goalWeight - currentWeight) * 7700 / (timeWeeks * 7));
    } else {
        // Maintain weight
        dailyGoal = tdee;
    }
} else {
    // Fallback to TDEE or a reasonable default
    dailyGoal = tdee > 0 ? tdee : 2000;
}

// Round and ensure a reasonable value
// For weight loss, don't go below 1200 for health reasons
// For weight gain, don't go excessively high
const minCalories = 1200;
const maxCalories = tdee * 1.5; // Maximum 50% more than TDEE for reasonable weight gain
dailyGoal = isNaN(dailyGoal) || !isFinite(dailyGoal) ? tdee : 
           (dailyGoal < minCalories ? minCalories : 
           (dailyGoal > maxCalories ? maxCalories : Math.round(dailyGoal)));

// Calculate daily deficit for display (with fallback to avoid NaN)
// Use absolute value for display when in weight gain mode
const dailyDeficit = !isNaN(tdee) && !isNaN(dailyGoal) ? tdee - dailyGoal : 0;
const isWeightGain = currentWeight < goalWeight;
const displayDeficit = isWeightGain ? Math.abs(dailyDeficit) : dailyDeficit; // Reflects the actual deficit/surplus used

// Load or initialize planner data with safeguards
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { email: 'guest' };
const userKey = `planner_${currentUser.email}`;
let weeklyCalories = JSON.parse(localStorage.getItem(`${userKey}_calories`));
let weeklyExercise = JSON.parse(localStorage.getItem(`${userKey}_exercise`));
let weeklyFoods = JSON.parse(localStorage.getItem(`${userKey}_foods`));

// Force reset if invalid or extreme
if (!Array.isArray(weeklyCalories) || weeklyCalories.length !== 7 || weeklyCalories.some(val => val < -1000 || val > 10000)) {
    console.log('Resetting weeklyCalories due to invalid data:', weeklyCalories);
    weeklyCalories = [0, 0, 0, 0, 0, 0, 0];
    localStorage.setItem(`${userKey}_calories`, JSON.stringify(weeklyCalories));
} else {
    weeklyCalories = weeklyCalories.map(val => parseFloat(val) || 0);
}

if (!Array.isArray(weeklyExercise) || weeklyExercise.length !== 7 || weeklyExercise.some(val => val < -1000 || val > 10000)) {
    console.log('Resetting weeklyExercise due to invalid data:', weeklyExercise);
    weeklyExercise = [0, 0, 0, 0, 0, 0, 0];
    localStorage.setItem(`${userKey}_exercise`, JSON.stringify(weeklyExercise));
} else {
    weeklyExercise = weeklyExercise.map(val => parseFloat(val) || 0);
}

if (!Array.isArray(weeklyFoods) || weeklyFoods.length !== 7) {
    console.log('Resetting weeklyFoods due to invalid data:', weeklyFoods);
    weeklyFoods = [[], [], [], [], [], [], []];
    localStorage.setItem(`${userKey}_foods`, JSON.stringify(weeklyFoods));
}

// Initialize containers
let mealIngredients = [];
let mealTotalCalories = 0;
let inCustomMeal = false; // Flag to know if we're building a meal or adding directly

// Ensure ingredient select element is available
let ingredientSelect;

// 300 Common Ingredients (full list) with macronutrients
const ingredients = [
    // Meats (25)
    { name: "Chicken Breast (100g)", calories: 165, defaultUnit: "100g", nutrients: { protein: 31, carbs: 0, fat: 3.6, fiber: 0 } },
    { name: "Chicken Thigh (100g)", calories: 209, defaultUnit: "100g", nutrients: { protein: 26, carbs: 0, fat: 10.9, fiber: 0 } },
    { name: "Chicken Drumstick (100g)", calories: 172, defaultUnit: "100g", nutrients: { protein: 24.3, carbs: 0, fat: 7.8, fiber: 0 } },
    { name: "Turkey Breast (100g)", calories: 135, defaultUnit: "100g", nutrients: { protein: 29.9, carbs: 0, fat: 1.2, fiber: 0 } },
    { name: "Turkey Leg (100g)", calories: 208, defaultUnit: "100g", nutrients: { protein: 28.6, carbs: 0, fat: 9.7, fiber: 0 } },
    { name: "Beef Steak (100g)", calories: 271, defaultUnit: "100g", nutrients: { protein: 26.2, carbs: 0, fat: 17.6, fiber: 0 } },
    { name: "Ground Beef 80/20 (100g)", calories: 254, defaultUnit: "100g", nutrients: { protein: 17.2, carbs: 0, fat: 20, fiber: 0 } },
    { name: "Beef Ribeye (100g)", calories: 291, defaultUnit: "100g", nutrients: { protein: 21.6, carbs: 0, fat: 22.6, fiber: 0 } },
    { name: "Pork Chop (100g)", calories: 231, defaultUnit: "100g", nutrients: { protein: 25.7, carbs: 0, fat: 14.0, fiber: 0 } },
    { name: "Pork Belly (100g)", calories: 518, defaultUnit: "100g", nutrients: { protein: 9.3, carbs: 0, fat: 53.0, fiber: 0 } },
    { name: "Bacon (1 slice)", calories: 43, defaultUnit: "unit", nutrients: { protein: 3.0, carbs: 0.1, fat: 3.3, fiber: 0 } },
    { name: "Ham (100g)", calories: 145, defaultUnit: "100g", nutrients: { protein: 21.8, carbs: 0.5, fat: 6.0, fiber: 0 } },
    { name: "Lamb Chop (100g)", calories: 294, defaultUnit: "100g", nutrients: { protein: 24.7, carbs: 0, fat: 21.2, fiber: 0 } },
    { name: "Sausage (1 link)", calories: 85, defaultUnit: "unit", nutrients: { protein: 5.0, carbs: 0.8, fat: 7.0, fiber: 0 } },
    { name: "Pepperoni (1 oz)", calories: 138, defaultUnit: "oz", nutrients: { protein: 6.1, carbs: 0.9, fat: 12.1, fiber: 0 } },
    { name: "Salmon (100g)", calories: 206, defaultUnit: "100g", nutrients: { protein: 22.1, carbs: 0, fat: 12.4, fiber: 0 } },
    { name: "Tuna (100g)", calories: 144, defaultUnit: "100g", nutrients: { protein: 30.0, carbs: 0, fat: 1.0, fiber: 0 } },
    { name: "Cod (100g)", calories: 82, defaultUnit: "100g", nutrients: { protein: 18.0, carbs: 0, fat: 0.7, fiber: 0 } },
    { name: "Tilapia (100g)", calories: 96, defaultUnit: "100g", nutrients: { protein: 20.1, carbs: 0, fat: 1.7, fiber: 0 } },
    { name: "Shrimp (100g)", calories: 99, defaultUnit: "100g", nutrients: { protein: 24.0, carbs: 0.2, fat: 0.3, fiber: 0 } },
    { name: "Crab (100g)", calories: 83, defaultUnit: "100g", nutrients: { protein: 18, carbs: 0, fat: 1.1, fiber: 0 } },
    { name: "Lobster (100g)", calories: 77, defaultUnit: "100g", nutrients: { protein: 16.5, carbs: 0.5, fat: 0.6, fiber: 0 } },
    { name: "Duck Breast (100g)", calories: 337, defaultUnit: "100g", nutrients: { protein: 18.3, carbs: 0, fat: 28.4, fiber: 0 } },
    { name: "Venison (100g)", calories: 158, defaultUnit: "100g", nutrients: { protein: 30.2, carbs: 0, fat: 3.2, fiber: 0 } },
    { name: "Bison (100g)", calories: 143, defaultUnit: "100g", nutrients: { protein: 28.4, carbs: 0, fat: 2.4, fiber: 0 } },

    // Fruits (25)
    { name: "Apple (1 medium)", calories: 95, defaultUnit: "unit", nutrients: { protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 } },
    { name: "Banana (1 medium)", calories: 105, defaultUnit: "unit", nutrients: { protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 } },
    { name: "Orange (1 medium)", calories: 62, defaultUnit: "unit", nutrients: { protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1 } },
    { name: "Strawberries (1 cup)", calories: 49, defaultUnit: "cup", nutrients: { protein: 1, carbs: 11.7, fat: 0.5, fiber: 3 } },
    { name: "Blueberries (1 cup)", calories: 83, defaultUnit: "cup", nutrients: { protein: 1.1, carbs: 21.2, fat: 0.5, fiber: 3.6 } },
    { name: "Raspberries (1 cup)", calories: 64, defaultUnit: "cup", nutrients: { protein: 1.5, carbs: 14.7, fat: 0.8, fiber: 8 } },
    { name: "Blackberries (1 cup)", calories: 62, defaultUnit: "cup", nutrients: { protein: 2, carbs: 14.5, fat: 0.7, fiber: 7.6 } },
    { name: "Grapes (1 cup)", calories: 104, defaultUnit: "cup", nutrients: { protein: 1.1, carbs: 27.3, fat: 0.2, fiber: 1.4 } },
    { name: "Pineapple (1 cup)", calories: 82, defaultUnit: "cup", nutrients: { protein: 0.9, carbs: 21.7, fat: 0.2, fiber: 2.3 } },
    { name: "Mango (1 cup)", calories: 99, defaultUnit: "cup", nutrients: { protein: 1.4, carbs: 24.7, fat: 0.6, fiber: 2.6 } },
    { name: "Peach (1 medium)", calories: 59, defaultUnit: "unit", nutrients: { protein: 1.4, carbs: 14.3, fat: 0.4, fiber: 2.3 } },
    { name: "Pear (1 medium)", calories: 101, defaultUnit: "unit", nutrients: { protein: 0.6, carbs: 27.1, fat: 0.2, fiber: 5.5 } },
    { name: "Watermelon (1 cup)", calories: 46, defaultUnit: "cup", nutrients: { protein: 0.9, carbs: 11.5, fat: 0.2, fiber: 0.6 } },
    { name: "Cantaloupe (1 cup)", calories: 53, defaultUnit: "cup", nutrients: { protein: 1.3, carbs: 12.7, fat: 0.3, fiber: 1.4 } },
    { name: "Honeydew (1 cup)", calories: 61, defaultUnit: "cup", nutrients: { protein: 0.9, carbs: 15.5, fat: 0.2, fiber: 1.4 } },
    { name: "Kiwi (1 medium)", calories: 42, defaultUnit: "unit", nutrients: { protein: 0.8, carbs: 10.1, fat: 0.4, fiber: 2.1 } },
    { name: "Plum (1 medium)", calories: 30, defaultUnit: "unit", nutrients: { protein: 0.5, carbs: 7.5, fat: 0.2, fiber: 0.9 } },
    { name: "Cherry (1 cup)", calories: 87, defaultUnit: "cup", nutrients: { protein: 1.5, carbs: 22.1, fat: 0.3, fiber: 2.9 } },
    { name: "Pomegranate (1 cup)", calories: 144, defaultUnit: "cup", nutrients: { protein: 2.9, carbs: 32.6, fat: 1.9, fiber: 7.0 } },
    { name: "Grapefruit (1 medium)", calories: 52, defaultUnit: "unit", nutrients: { protein: 0.9, carbs: 13.1, fat: 0.2, fiber: 2.0 } },
    { name: "Apricot (1 medium)", calories: 17, defaultUnit: "unit", nutrients: { protein: 0.5, carbs: 3.9, fat: 0.1, fiber: 0.7 } },
    { name: "Fig (1 medium)", calories: 37, defaultUnit: "unit", nutrients: { protein: 0.4, carbs: 9.6, fat: 0.2, fiber: 1.4 } },
    { name: "Date (1 piece)", calories: 20, defaultUnit: "unit", nutrients: { protein: 0.2, carbs: 5.3, fat: 0.0, fiber: 0.6 } },
    { name: "Cranberries (1 cup)", calories: 46, defaultUnit: "cup", nutrients: { protein: 0.4, carbs: 12.2, fat: 0.1, fiber: 3.6 } },
    { name: "Lemon (1 medium)", calories: 17, defaultUnit: "unit", nutrients: { protein: 0.6, carbs: 5.4, fat: 0.2, fiber: 1.6 } },

    // Vegetables (25)
    { name: "Broccoli (1 cup)", calories: 55, defaultUnit: "cup", nutrients: { protein: 3.7, carbs: 11.2, fat: 0.6, fiber: 5.1 } },
    { name: "Carrots (1 cup)", calories: 52, defaultUnit: "cup", nutrients: { protein: 1.2, carbs: 12.3, fat: 0.3, fiber: 3.6 } },
    { name: "Spinach (1 cup)", calories: 7, defaultUnit: "cup", nutrients: { protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7 } },
    { name: "Kale (1 cup)", calories: 33, defaultUnit: "cup", nutrients: { protein: 2.9, carbs: 6.7, fat: 0.5, fiber: 1.3 } },
    { name: "Potato (1 medium)", calories: 130, defaultUnit: "unit", nutrients: { protein: 3.2, carbs: 29.6, fat: 0.1, fiber: 2.9 } },
    { name: "Sweet Potato (1 medium)", calories: 103, defaultUnit: "unit", nutrients: { protein: 2, carbs: 23.6, fat: 0.2, fiber: 3.8 } },
    { name: "Tomato (1 medium)", calories: 22, defaultUnit: "unit", nutrients: { protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5 } },
    { name: "Cucumber (1 cup)", calories: 16, defaultUnit: "cup", nutrients: { protein: 0.8, carbs: 3.1, fat: 0.2, fiber: 1 } },
    { name: "Bell Pepper (1 medium)", calories: 25, defaultUnit: "unit", nutrients: { protein: 1, carbs: 6, fat: 0.2, fiber: 2 } },
    { name: "Zucchini (1 cup)", calories: 33, defaultUnit: "cup", nutrients: { protein: 2.4, carbs: 6.6, fat: 0.6, fiber: 2 } },
    { name: "Cauliflower (1 cup)", calories: 25, defaultUnit: "cup", nutrients: { protein: 2, carbs: 5, fat: 0.1, fiber: 2.5 } },
    { name: "Brussels Sprouts (1 cup)", calories: 56, defaultUnit: "cup", nutrients: { protein: 4, carbs: 11, fat: 0.4, fiber: 4 } },
    { name: "Asparagus (1 cup)", calories: 27, defaultUnit: "cup", nutrients: { protein: 3, carbs: 5, fat: 0.2, fiber: 2.8 } },
    { name: "Green Beans (1 cup)", calories: 31, defaultUnit: "cup", nutrients: { protein: 2, carbs: 7, fat: 0.1, fiber: 3.4 } },
    { name: "Peas (1 cup)", calories: 118, defaultUnit: "cup", nutrients: { protein: 8, carbs: 21, fat: 0.4, fiber: 7.4 } },
    { name: "Corn (1 cup)", calories: 132, defaultUnit: "cup", nutrients: { protein: 5, carbs: 29, fat: 1.2, fiber: 3.5 } },
    { name: "Onion (1 medium)", calories: 44, defaultUnit: "unit", nutrients: { protein: 1.2, carbs: 10, fat: 0.1, fiber: 1.9 } },
    { name: "Garlic (1 clove)", calories: 4, defaultUnit: "unit", nutrients: { protein: 0.2, carbs: 1, fat: 0, fiber: 0.1 } },
    { name: "Mushrooms (1 cup)", calories: 15, defaultUnit: "cup", nutrients: { protein: 2.2, carbs: 2.3, fat: 0.2, fiber: 0.7 } },
    { name: "Eggplant (1 cup)", calories: 20, defaultUnit: "cup", nutrients: { protein: 0.8, carbs: 4.8, fat: 0.2, fiber: 2.5 } },
    { name: "Celery (1 stalk)", calories: 6, defaultUnit: "unit", nutrients: { protein: 0.3, carbs: 1.5, fat: 0.1, fiber: 0.7 } },
    { name: "Radish (1 cup)", calories: 19, defaultUnit: "cup", nutrients: { protein: 0.8, carbs: 4, fat: 0.1, fiber: 1.9 } },
    { name: "Beet (1 medium)", calories: 35, defaultUnit: "unit", nutrients: { protein: 1.3, carbs: 8, fat: 0.2, fiber: 2.3 } },
    { name: "Cabbage (1 cup)", calories: 22, defaultUnit: "cup", nutrients: { protein: 1.1, carbs: 5.2, fat: 0.1, fiber: 2.2 } },
    { name: "Lettuce (1 cup)", calories: 5, defaultUnit: "cup", nutrients: { protein: 0.5, carbs: 1, fat: 0.1, fiber: 0.5 } },

    // Dairy and common foods - just a few examples
    { name: "Milk (1 cup)", calories: 103, defaultUnit: "cup", nutrients: { protein: 8, carbs: 12, fat: 2.4, fiber: 0 } },
    { name: "Egg (1 large)", calories: 70, defaultUnit: "unit", nutrients: { protein: 6, carbs: 0.6, fat: 5, fiber: 0 } },
    { name: "Cheddar Cheese (1 oz)", calories: 113, defaultUnit: "oz", nutrients: { protein: 7, carbs: 0.4, fat: 9, fiber: 0 } },
    { name: "Greek Yogurt (1 cup)", calories: 100, defaultUnit: "cup", nutrients: { protein: 17, carbs: 6, fat: 0.7, fiber: 0 } },
    { name: "Bread (1 slice)", calories: 80, defaultUnit: "unit", nutrients: { protein: 3, carbs: 15, fat: 1, fiber: 1.5 } },
    { name: "Rice (1 cup cooked)", calories: 205, defaultUnit: "cup", nutrients: { protein: 4, carbs: 45, fat: 0.4, fiber: 0.6 } },
    { name: "Pasta (1 cup cooked)", calories: 220, defaultUnit: "cup", nutrients: { protein: 8, carbs: 43, fat: 1.3, fiber: 2.5 } },
    { name: "Olive Oil (1 tbsp)", calories: 119, defaultUnit: "tbsp", nutrients: { protein: 0, carbs: 0, fat: 14, fiber: 0 } }
];

/**
 * Function to populate the ingredient dropdown
 */
function populateIngredients(filter = '') {
    console.log("populateIngredients called with filter:", filter);
    
    const ingredientSelect = document.getElementById('ingredient');
    if (!ingredientSelect) {
        console.error("Ingredient select element not found!");
        return;
    }
    
    // Clear the dropdown
    ingredientSelect.innerHTML = '';
    
    // Filter ingredients based on search term (if provided)
    const filteredIngredients = ingredients.filter(ing => {
        return ing.name.toLowerCase().includes((filter || '').toLowerCase());
    });
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = filter ? 'Search results...' : 'Select a food...';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    ingredientSelect.appendChild(defaultOption);
    
    // Add filtered ingredients to the dropdown
    if (filteredIngredients.length > 0) {
        filteredIngredients.forEach(ing => {
            const option = document.createElement('option');
            // Prepare the value as JSON for easy retrieval
            const valueData = {
                calories: ing.calories,
                unit: ing.defaultUnit,
                nutrients: ing.nutrients
            };
            option.value = JSON.stringify(valueData);
            option.textContent = `${ing.name} (${ing.calories} kcal)`;
            ingredientSelect.appendChild(option);
        });
    } else {
        const noResults = document.createElement('option');
        noResults.value = '';
        noResults.textContent = 'No matching foods found';
        noResults.disabled = true;
        ingredientSelect.appendChild(noResults);
    }
    
    console.log(`Populated ${filteredIngredients.length} ingredients`);
}

/**
 * Update nutrient info when an ingredient is selected
 */
function updateNutrientInfo() {
    const ingredientSelect = document.getElementById('ingredient');
    if (!ingredientSelect) return;
    
    const selectedOption = ingredientSelect.options[ingredientSelect.selectedIndex];
    if (!selectedOption || !selectedOption.value) return;
    
    try {
        const itemData = JSON.parse(selectedOption.value);
        const calories = itemData.calories || 0;
        
        // Update the nutrient info display in main view and popup
        const caloriesElements = document.querySelectorAll('[id^="nutrientCalories"]');
        caloriesElements.forEach(element => {
            element.textContent = calories;
        });
        
        if (itemData.nutrients) {
            const protein = itemData.nutrients.protein || 0;
            const carbs = itemData.nutrients.carbs || 0;
            const fat = itemData.nutrients.fat || 0;
            const fiber = itemData.nutrients.fiber || 0;
            
            // Update both main and popup values
            document.getElementById('nutrientProtein').textContent = protein.toFixed(1);
            document.getElementById('nutrientCarbs').textContent = carbs.toFixed(1);
            document.getElementById('nutrientFat').textContent = fat.toFixed(1);
            
            if (document.getElementById('nutrientFiber')) {
                document.getElementById('nutrientFiber').textContent = fiber.toFixed(1);
            }
        } else {
            document.getElementById('nutrientProtein').textContent = '0';
            document.getElementById('nutrientCarbs').textContent = '0';
            document.getElementById('nutrientFat').textContent = '0';
            
            if (document.getElementById('nutrientFiber')) {
                document.getElementById('nutrientFiber').textContent = '0';
            }
        }
        
        // Update serving text
        document.getElementById('perServingText').textContent = `(per ${itemData.unit || 'serving'})`;
        
        // Set the unit dropdown to match the ingredient's default unit
        const unitDropdown = document.getElementById('ingredientUnit');
        if (unitDropdown && itemData.unit) {
            // Find matching option
            for (let i = 0; i < unitDropdown.options.length; i++) {
                if (unitDropdown.options[i].value === itemData.unit) {
                    unitDropdown.selectedIndex = i;
                    break;
                }
            }
        }
    } catch (e) {
        console.error("Error updating nutrient info:", e);
    }
}

/**
 * Toggle the nutrition details popup
 */
function toggleNutritionPopup() {
    const popup = document.getElementById('nutrientDetailsPopup');
    if (popup) {
        if (popup.style.display === 'none' || !popup.style.display) {
            popup.style.display = 'block';
        } else {
            popup.style.display = 'none';
        }
    }
}

/**
 * Save the current food selection as a favorite
 */
function saveAsFavorite() {
    // Get selected food details
    const ingredientSelect = document.getElementById('ingredient');
    if (!ingredientSelect || !ingredientSelect.value) {
        // Try to use custom food form if database food isn't selected
        if (document.getElementById('customFoodName') && document.getElementById('customFoodName').value) {
            return saveCustomAsFavorite();
        }
        
        alert("Please select or enter a food item first");
        return;
    }
    
    try {
        // Get name from the displayed text
        const foodName = ingredientSelect.options[ingredientSelect.selectedIndex].text.split('(')[0].trim();
        
        // Parse the food data
        const itemData = JSON.parse(ingredientSelect.value);
        
        // Get the current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { email: 'guest' };
        
        // Get saved favorites
        const savedFoodsKey = `favorites_${currentUser.email}`;
        const savedFoods = JSON.parse(localStorage.getItem(savedFoodsKey)) || [];
        
        // Create favorite food object
        const favoriteFood = {
            id: Date.now().toString(), // Create unique ID based on timestamp
            name: foodName,
            type: 'ingredient',
            calories: itemData.calories,
            unit: itemData.unit || 'serving',
            date: new Date().toISOString(),
            nutrients: itemData.nutrients || {}
        };
        
        // Add to favorites
        savedFoods.push(favoriteFood);
        
        // Save back to storage
        localStorage.setItem(savedFoodsKey, JSON.stringify(savedFoods));
        
        // Update the display
        renderSavedFoods();
        
        // Show success message
        alert(`${foodName} has been saved to your favorites!`);
        
    } catch (error) {
        console.error("Error saving favorite:", error);
        alert("There was an error saving this food. Please try again.");
    }
}

/**
 * Save a custom food as favorite
 */
function saveCustomAsFavorite() {
    // Validate inputs
    const foodName = document.getElementById('customFoodName').value.trim();
    const calories = parseFloat(document.getElementById('customCalories').value);
    const protein = parseFloat(document.getElementById('customProtein').value) || 0;
    const carbs = parseFloat(document.getElementById('customCarbs').value) || 0;
    const fat = parseFloat(document.getElementById('customFat').value) || 0;
    
    if (!foodName) {
        alert("Please enter a food name");
        return;
    }
    
    if (isNaN(calories) || calories < 0) {
        alert("Please enter valid calories");
        return;
    }
    
    // Get the current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { email: 'guest' };
    
    // Get saved favorites
    const savedFoodsKey = `favorites_${currentUser.email}`;
    const savedFoods = JSON.parse(localStorage.getItem(savedFoodsKey)) || [];
    
    // Create favorite food object
    const favoriteFood = {
        id: Date.now().toString(), // Create unique ID based on timestamp
        name: foodName,
        type: 'custom',
        calories: calories,
        unit: 'serving',
        date: new Date().toISOString(),
        nutrients: {
            protein: protein,
            carbs: carbs,
            fat: fat
        }
    };
    
    // Add to favorites
    savedFoods.push(favoriteFood);
    
    // Save back to storage
    localStorage.setItem(savedFoodsKey, JSON.stringify(savedFoods));
    
    // Update the display
    renderSavedFoods();
    
    // Show success message
    alert(`${foodName} has been saved to your favorites!`);
}

/**
 * Add saved food to the calendar
 * @param {string} foodId - The ID of the saved food
 */
function addSavedFoodToCalendar(foodId) {
    // Get the current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { email: 'guest' };
    
    // Get saved favorites
    const savedFoodsKey = `favorites_${currentUser.email}`;
    const savedFoods = JSON.parse(localStorage.getItem(savedFoodsKey)) || [];
    
    // Find the food by ID
    const food = savedFoods.find(f => f.id === foodId);
    if (!food) {
        alert("Food not found in favorites");
        return;
    }
    
    // Get date and meal type from form (or defaults)
    const dateElement = document.getElementById('dbMealDate') || document.getElementById('customMealDate');
    const typeElement = document.getElementById('dbMealType') || document.getElementById('customMealType');
    
    const mealDate = dateElement ? dateElement.value : new Date().toISOString().split('T')[0];
    const mealType = typeElement ? typeElement.value : 'snack';
    
    // Create food item for adding to calendar
    const foodItem = {
        text: `1 ${food.unit} ${food.name}`,
        name: food.name,
        calories: food.calories,
        type: mealType,
        isFavorite: true,
        favoriteId: food.id
    };
    
    // Add nutrients if available
    if (food.nutrients) {
        foodItem.protein = food.nutrients.protein || 0;
        foodItem.carbs = food.nutrients.carbs || 0;
        foodItem.fat = food.nutrients.fat || 0;
        foodItem.fiber = food.nutrients.fiber || 0;
    }
    
    // Add to calendar
    addToPlanner(mealDate, foodItem.text, foodItem.calories, true, mealType, food.nutrients);
    
    // Show success message
    alert(`Added ${food.name} to the Calendar for ${mealDate}`);
}

/**
 * Remove a saved food from favorites
 * @param {string} foodId - The ID of the saved food
 */
function removeSavedFood(foodId) {
    if (!confirm("Are you sure you want to remove this food from your favorites?")) {
        return;
    }
    
    // Get the current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { email: 'guest' };
    
    // Get saved favorites
    const savedFoodsKey = `favorites_${currentUser.email}`;
    const savedFoods = JSON.parse(localStorage.getItem(savedFoodsKey)) || [];
    
    // Filter out the removed food
    const updatedFoods = savedFoods.filter(f => f.id !== foodId);
    
    // Save back to storage
    localStorage.setItem(savedFoodsKey, JSON.stringify(updatedFoods));
    
    // Update the display
    renderSavedFoods();
}

/**
 * Render saved foods in the UI
 * @param {string} filter - Optional filter type (all, meals, ingredients)
 * @param {string} search - Optional search term
 */
function renderSavedFoods(filter = 'all', search = '') {
    const container = document.getElementById('savedFoodsList');
    if (!container) return;
    
    // Get the current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { email: 'guest' };
    
    // Get saved favorites
    const savedFoodsKey = `favorites_${currentUser.email}`;
    const savedFoods = JSON.parse(localStorage.getItem(savedFoodsKey)) || [];
    
    // Filter foods if needed
    let filteredFoods = savedFoods;
    
    if (filter !== 'all') {
        filteredFoods = savedFoods.filter(food => food.type === filter);
    }
    
    if (search) {
        const searchLower = search.toLowerCase();
        filteredFoods = filteredFoods.filter(food => 
            food.name.toLowerCase().includes(searchLower)
        );
    }
    
    // Show/hide empty state
    const emptyState = document.getElementById('noSavedMeals');
    if (emptyState) {
        emptyState.style.display = filteredFoods.length === 0 ? 'block' : 'none';
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Render each food
    filteredFoods.forEach(food => {
        const foodCard = document.createElement('div');
        foodCard.className = 'saved-food-card';
        foodCard.dataset.id = food.id;
        
        const typeName = food.type === 'ingredient' ? 'Food' : 
                         food.type === 'meal' ? 'Meal' : 'Custom';
        
        foodCard.innerHTML = `
            <div class="saved-food-type">${typeName}</div>
            <div class="saved-food-name">${food.name}</div>
            <div class="saved-food-calories">${food.calories} kcal</div>
            <div class="saved-food-macros">
                <span>P: ${food.nutrients?.protein || 0}g</span>
                <span>C: ${food.nutrients?.carbs || 0}g</span>
                <span>F: ${food.nutrients?.fat || 0}g</span>
            </div>
            <div class="saved-food-actions">
                <button type="button" class="saved-food-btn add-saved" data-id="${food.id}">
                    <i class="fas fa-plus"></i> Add
                </button>
                <button type="button" class="saved-food-btn delete" data-id="${food.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(foodCard);
    });
    
    // Add event listeners
    const addButtons = document.querySelectorAll('.saved-food-btn.add-saved');
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const foodId = this.dataset.id;
            addSavedFoodToCalendar(foodId);
        });
    });
    
    const deleteButtons = document.querySelectorAll('.saved-food-btn.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const foodId = this.dataset.id;
            removeSavedFood(foodId);
        });
    });
}

/**
 * Add an ingredient to the meal
 */
function addIngredientToMeal() {
    console.log("Adding ingredient to meal");
    
    // Get selected food
    const ingredientSelect = document.getElementById('ingredient');
    if (!ingredientSelect || !ingredientSelect.value) {
        alert("Please select a food item first");
        return;
    }
    
    try {
        // Parse the selected food data
        const itemData = JSON.parse(ingredientSelect.value);
        
        // Get quantity and unit
        const qty = parseFloat(document.getElementById('ingredientQty').value) || 1;
        const unit = document.getElementById('ingredientUnit').value;
        
        // Get meal date and type
        const mealDate = document.getElementById('dbMealDate').value || new Date().toISOString().split('T')[0];
        const mealType = document.getElementById('dbMealType').value;
        
        // Get notes if available
        const notes = document.getElementById('mealNotes') ? document.getElementById('mealNotes').value.trim() : '';
        
        // Get food name from selected option text
        const foodName = ingredientSelect.options[ingredientSelect.selectedIndex].text.split('(')[0].trim();
        
        // Calculate calories based on quantity and unit
        let calories = itemData.calories;
        if (unit !== itemData.unit) {
            // Apply conversion if units are different
            const baseMultiplier = itemData.unit === "100g" ? 100 : 1;
            const finalMultiplier = unitMultipliers[unit] || 1;
            calories = calories * (finalMultiplier / baseMultiplier) * qty;
        } else {
            calories = calories * qty;
        }
        
        // Round to whole number
        calories = Math.round(calories);
        
        // Create nutrient data with proper scaling
        let nutrients = null;
        if (itemData.nutrients) {
            const multiplier = qty * (unitMultipliers[unit] || 1) / (itemData.unit === "100g" ? 100 : 1);
            nutrients = {
                protein: Math.round(itemData.nutrients.protein * multiplier * 10) / 10,
                carbs: Math.round(itemData.nutrients.carbs * multiplier * 10) / 10,
                fat: Math.round(itemData.nutrients.fat * multiplier * 10) / 10,
                fiber: Math.round((itemData.nutrients.fiber || 0) * multiplier * 10) / 10
            };
        }
        
        // Create food item with more details for calendar
        const foodItem = {
            text: `${qty} ${unit} ${foodName}`,
            name: foodName,
            calories: calories,
            type: mealType,
            quantity: qty,
            unit: unit,
            dateAdded: new Date().toISOString()
        };
        
        // Add notes if provided
        if (notes) {
            foodItem.notes = notes;
        }
        
        // Add nutrients if available
        if (nutrients) {
            foodItem.protein = nutrients.protein;
            foodItem.carbs = nutrients.carbs;
            foodItem.fat = nutrients.fat;
            foodItem.fiber = nutrients.fiber;
        }
        
        // Add to calendar
        addToPlanner(mealDate, foodItem.text, foodItem.calories, true, mealType, nutrients);
        
        // Show success message
        alert(`Added ${foodName} to the Calendar for ${mealDate}`);
        
    } catch (error) {
        console.error("Error adding ingredient:", error);
        alert("An error occurred while adding the ingredient. Please try again.");
    }
}

/**
 * Calculate macro nutrients from calories
 */
function calculateMacros() {
    console.log("Calculating macros");
    
    const calories = parseFloat(document.getElementById('customCalories').value);
    if (isNaN(calories) || calories <= 0) {
        alert("Please enter a valid calorie amount first");
        return;
    }
    
    // Use default macronutrient ratio: 30% protein, 40% carbs, 30% fat
    const proteinPct = 0.3;
    const carbsPct = 0.4;
    const fatPct = 0.3;
    
    // Calculate grams of each macronutrient
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram
    const proteinGrams = Math.round((calories * proteinPct) / 4);
    const carbsGrams = Math.round((calories * carbsPct) / 4);
    const fatGrams = Math.round((calories * fatPct) / 9);
    
    // Update form fields
    document.getElementById('customProtein').value = proteinGrams;
    document.getElementById('customCarbs').value = carbsGrams;
    document.getElementById('customFat').value = fatGrams;
    
    alert("Macros calculated successfully!");
}

/**
 * Add a custom food
 */
function addCustomFood() {
    console.log("Adding custom food");
    
    // Validate inputs
    const foodName = document.getElementById('customFoodName').value.trim();
    const calories = parseFloat(document.getElementById('customCalories').value);
    const quantity = parseFloat(document.getElementById('customQuantity').value) || 1;
    const protein = parseFloat(document.getElementById('customProtein').value) || 0;
    const carbs = parseFloat(document.getElementById('customCarbs').value) || 0;
    const fat = parseFloat(document.getElementById('customFat').value) || 0;
    
    if (!foodName) {
        alert("Please enter a food name");
        return;
    }
    
    if (isNaN(calories) || calories < 0) {
        alert("Please enter valid calories");
        return;
    }
    
    // Get date and meal type
    const mealDate = document.getElementById('customMealDate').value || new Date().toISOString().split('T')[0];
    const mealType = document.getElementById('customMealType').value;
    
    // Get notes if available
    const notes = document.getElementById('customMealNotes') ? document.getElementById('customMealNotes').value.trim() : '';
    
    // Calculate total calories based on quantity
    const totalCalories = Math.round(calories * quantity);
    
    // Create food item with macros
    const foodItem = {
        text: `${quantity} serving${quantity !== 1 ? 's' : ''} ${foodName}`,
        name: foodName,
        calories: totalCalories,
        type: mealType,
        protein: Math.round(protein * quantity * 10) / 10,
        carbs: Math.round(carbs * quantity * 10) / 10,
        fat: Math.round(fat * quantity * 10) / 10
    };
    
    // Add notes if provided
    if (notes) {
        foodItem.notes = notes;
    }
    
    // Add to planner
    addToPlanner(mealDate, foodItem.text, foodItem.calories, true, mealType, {
        protein: foodItem.protein,
        carbs: foodItem.carbs,
        fat: foodItem.fat
    });
    
    // Show success message
    alert(`Added ${foodName} to the Calendar for ${mealDate}`);
    
    // Reset form
    document.getElementById('customFoodForm').reset();
    document.getElementById('customMealDate').value = mealDate; // Keep the date
}

/**
 * Add food to the calendar
 */
function addToPlanner(dateOrDayIndex, itemText, calories, isFood = true, mealType = null, macros = null) {
    console.log("Adding to calendar:", {dateOrDayIndex, itemText, calories, isFood, mealType, macros});
    
    calories = parseFloat(calories) || 0;
    
    // Check if we're using a date string or day index
    let dayIndex = 0;
    let dateStr = null;
    
    if (typeof dateOrDayIndex === 'string' && dateOrDayIndex.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // It's a date string in YYYY-MM-DD format
        dateStr = dateOrDayIndex;
        
        // Get day of week (0-6) for weekly display
        const date = new Date(dateStr);
        // Convert from Sunday (0) to Monday (0) based system
        dayIndex = date.getDay();
        dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    } else {
        // It's a day index (0-6)
        dayIndex = parseInt(dateOrDayIndex) || 0;
        if (dayIndex < 0 || dayIndex > 6) dayIndex = 0;
        
        // Convert day index to date string for calendar
        const today = new Date();
        const startOfWeek = new Date(today);
        const day = today.getDay(); // 0 = Sunday
        const diff = day === 0 ? -6 : 1 - day; // Calculate days to Monday
        startOfWeek.setDate(today.getDate() + diff);
        
        const targetDate = new Date(startOfWeek);
        targetDate.setDate(startOfWeek.getDate() + dayIndex);
        dateStr = targetDate.toISOString().split('T')[0];
    }
    
    if (isFood && dateStr) {
        // Add to weekly totals (keep this for backward compatibility)
        if (dayIndex >= 0 && dayIndex < 7) {
            if (!weeklyCalories[dayIndex]) weeklyCalories[dayIndex] = 0;
            weeklyCalories[dayIndex] = (parseFloat(weeklyCalories[dayIndex]) || 0) + calories;
            
            // Add food item to tracking
            const foodItem = { 
                text: itemText, 
                cal: calories, 
                calories: calories,
                type: mealType,
                name: itemText // Add a name field for consistency with calendar
            };
            
            // Add macros if available
            if (macros) {
                foodItem.protein = macros.protein || 0;
                foodItem.carbs = macros.carbs || 0;
                foodItem.fat = macros.fat || 0;
            }
            
            // Make sure the day's foods array exists
            if (!weeklyFoods[dayIndex]) weeklyFoods[dayIndex] = [];
            
            weeklyFoods[dayIndex].push(foodItem);
            
            // Save to weekly storage (for backward compatibility)
            localStorage.setItem(`${userKey}_calories`, JSON.stringify(weeklyCalories));
            localStorage.setItem(`${userKey}_foods`, JSON.stringify(weeklyFoods));
        }
        
        // IMPORTANT: Save to calendar storage
        // Parse the date parts
        const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
        const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
        const dayStr = day.toString().padStart(2, '0');
        
        // Create food item for calendar with additional details
        // Use the first parameter (itemText) as a fallback but prefer the name, text properties
        // from the calling functions, which will include more details
        const calendarFoodItem = {
            name: itemText,
            calories: calories,
            text: itemText,
            type: mealType,
            dateAdded: new Date().toISOString()
        };
        
        // Copy additional properties from the weekly food item
        // This assumes the weekly food item is the LAST item in the weeklyFoods array
        if (weeklyFoods[dayIndex] && weeklyFoods[dayIndex].length > 0) {
            const sourceItem = weeklyFoods[dayIndex][weeklyFoods[dayIndex].length - 1];
            
            // Copy any properties that aren't in the base calendar item
            for (let prop in sourceItem) {
                if (!calendarFoodItem.hasOwnProperty(prop)) {
                    calendarFoodItem[prop] = sourceItem[prop];
                }
            }
        }
        
        // Add macros if available
        if (macros) {
            calendarFoodItem.protein = macros.protein || 0;
            calendarFoodItem.carbs = macros.carbs || 0;
            calendarFoodItem.fat = macros.fat || 0;
            calendarFoodItem.fiber = macros.fiber || 0;
            
            // Add nutrients object for compatibility with calendar view
            calendarFoodItem.nutrients = {
                protein: macros.protein || 0,
                carbs: macros.carbs || 0,
                fat: macros.fat || 0,
                fiber: macros.fiber || 0
            };
        }
        
        // Get existing calendar data
        const foodsKey = `foods_${currentUser.email}_${yearMonth}`;
        const monthFoods = JSON.parse(localStorage.getItem(foodsKey)) || {};
        
        // Make sure the day entry exists
        if (!monthFoods[dayStr]) {
            monthFoods[dayStr] = {};
        }
        
        // Make sure the meal type array exists
        if (!monthFoods[dayStr][mealType]) {
            monthFoods[dayStr][mealType] = [];
        }
        
        // Add food to the appropriate meal type - use the calendar food item with all details
        monthFoods[dayStr][mealType].push(calendarFoodItem);
        
        // Save back to storage
        localStorage.setItem(foodsKey, JSON.stringify(monthFoods));
        
        console.log("Updated calendar storage:", {yearMonth, dayStr, mealType, calendarFoodItem});
    }
}

// Setup event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing tracker...");
    
    // Initialize common page elements first (menu, theme, etc.)
    if (typeof initializePage === 'function') {
        initializePage();
    } else {
        console.warn("initializePage function not found, make sure utils.js is loaded first");
    }
    
    // Set up food tab navigation
    const foodTabs = document.querySelectorAll('.food-tab');
    foodTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get the target tab
            const tabId = this.getAttribute('data-tab');
            
            // Hide all food content tabs
            const foodContents = document.querySelectorAll('.sub-tab-content');
            foodContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show the selected tab
            const selectedContent = document.getElementById(tabId);
            if (selectedContent) {
                selectedContent.style.display = 'block';
            }
            
            // Update active state
            const allFoodTabs = document.querySelectorAll('.food-tab');
            allFoodTabs.forEach(foodTab => {
                foodTab.classList.remove('active');
            });
            this.classList.add('active');
            
            // If My Meals tab is active, render saved foods
            if (tabId === 'my-meals') {
                renderSavedFoods();
            }
            
            console.log("Switched to food tab:", tabId);
        });
    });
    
    // Set up ingredient select
    ingredientSelect = document.getElementById('ingredient');
    if (ingredientSelect) {
        console.log("Setting up ingredient select");
        populateIngredients();
        
        // Add change listener
        ingredientSelect.addEventListener('change', updateNutrientInfo);
    }
    
    // Set up search box
    const searchBox = document.getElementById('ingredientSearch');
    if (searchBox) {
        console.log("Setting up search box");
        searchBox.addEventListener('input', function(e) {
            populateIngredients(e.target.value);
        });
    }
    
    // Set up Add Ingredient button
    const addIngredientBtn = document.getElementById('addIngredient');
    if (addIngredientBtn) {
        console.log("Setting up add ingredient button");
        addIngredientBtn.addEventListener('click', addIngredientToMeal);
    }
    
    // Set up Calculate Macros button
    const calculateMacrosBtn = document.getElementById('calculateMacrosButton');
    if (calculateMacrosBtn) {
        console.log("Setting up calculate macros button");
        calculateMacrosBtn.addEventListener('click', calculateMacros);
    }
    
    // Set up Add Custom Food button
    const addCustomFoodBtn = document.getElementById('addCustomFood');
    if (addCustomFoodBtn) {
        console.log("Setting up add custom food button");
        addCustomFoodBtn.addEventListener('click', addCustomFood);
    }
    
    // Set up Nutrition Popup
    const viewNutritionBtn = document.getElementById('viewNutritionBtn');
    if (viewNutritionBtn) {
        viewNutritionBtn.addEventListener('click', toggleNutritionPopup);
    }
    
    const closeNutritionBtn = document.getElementById('closeNutritionBtn');
    if (closeNutritionBtn) {
        closeNutritionBtn.addEventListener('click', function() {
            document.getElementById('nutrientDetailsPopup').style.display = 'none';
        });
    }
    
    // View nutrition details button (complete details modal)
    const viewNutritionDetailsBtn = document.getElementById('viewNutritionDetails');
    if (viewNutritionDetailsBtn) {
        viewNutritionDetailsBtn.addEventListener('click', function() {
            const ingredientSelect = document.getElementById('ingredient');
            const selectedOption = ingredientSelect.options[ingredientSelect.selectedIndex];
            
            if (selectedOption && selectedOption.value) {
                showNutritionModal(selectedOption.value);
            } else {
                showNotification('Please select a food item first', 'warning');
            }
        });
    }
    
    // Manage saved meals button
    const manageSavedMealsBtn = document.getElementById('manageSavedMeals');
    if (manageSavedMealsBtn) {
        manageSavedMealsBtn.addEventListener('click', function() {
            openSavedMealsManager();
        });
    }
    
    // Go to Exercise button
    const goToExerciseBtn = document.getElementById('goToExercise');
    if (goToExerciseBtn) {
        goToExerciseBtn.addEventListener('click', function() {
            window.location.href = 'exercise.html';
        });
    }
    
    // Go to Add Food button
    const goToAddFoodBtn = document.getElementById('goToAddFood');
    if (goToAddFoodBtn) {
        goToAddFoodBtn.addEventListener('click', function() {
            // Find and click the Add Food tab button
            const addFoodTab = document.querySelector('.tab-button[data-tab="add-food"]');
            if (addFoodTab) {
                addFoodTab.click();
            }
        });
    }
    
    // Set up saved foods functionality
    const saveCurrentMealBtn = document.getElementById('saveCurrentMeal');
    if (saveCurrentMealBtn) {
        saveCurrentMealBtn.addEventListener('click', saveAsFavorite);
    }
    
    // Set up saved foods filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            const filter = this.dataset.filter || 'all';
            const search = document.getElementById('savedFoodSearch')?.value || '';
            renderSavedFoods(filter, search);
        });
    });
    
    // Set up saved foods search
    const savedFoodSearch = document.getElementById('savedFoodSearch');
    if (savedFoodSearch) {
        savedFoodSearch.addEventListener('input', function() {
            const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            renderSavedFoods(filter, this.value);
        });
    }
    
    // Set up tab navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the target tab
            const tabId = this.getAttribute('data-tab');
            
            // Handle main tabs or sub-tabs differently
            if (this.closest('.main-tabs')) {
                // For main tabs, show/hide sections
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(tabId).style.display = 'block';
                
                // Update active state
                const mainTabs = document.querySelectorAll('.main-tabs .tab-button');
                mainTabs.forEach(tab => {
                    tab.classList.remove('active');
                });
                this.classList.add('active');
            } else {
                // For sub-tabs, show/hide content within the current tab
                const parentTab = this.closest('.tab-content');
                const subTabs = parentTab.querySelectorAll('.sub-tab-content');
                subTabs.forEach(content => {
                    content.style.display = 'none';
                });
                parentTab.querySelector(`#${tabId}`).style.display = 'block';
                
                // Update active state
                const subTabButtons = this.closest('.tab-button').parentElement.querySelectorAll('.tab-button');
                subTabButtons.forEach(tab => {
                    tab.classList.remove('active');
                });
                this.classList.add('active');
                
                // If My Meals tab is active, render saved foods
                if (tabId === 'my-meals') {
                    renderSavedFoods();
                }
            }
        });
    });
    
    // Set today's date on all date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.value = today;
    });
});

// Display initial stats from URL parameters
document.addEventListener('DOMContentLoaded', function() {
    // Display initial values with units
    const isWeightGain = currentWeight < goalWeight;
    const deficitLabel = document.getElementById('deficitLabel');
    if (deficitLabel && isWeightGain) {
        deficitLabel.textContent = 'Daily Surplus:';
    }
    
    const elements = {
        'bmr': bmr.toFixed(0),
        'bmrUnits': `kcal (${Math.round(bmr * kcalToKj)} kJ)`,
        'tdee': tdee.toFixed(0),
        'tdeeUnits': `kcal (${Math.round(tdee * kcalToKj)} kJ)`,
        'dailyDeficit': Math.abs(Math.round(dailyDeficit)),  // Use absolute value
        'deficitUnits': `kcal (${Math.abs(Math.round(dailyDeficit * kcalToKj))} kJ)`,
        'dailyGoal': dailyGoal,
        'goalUnits': `kcal (${Math.round(dailyGoal * kcalToKj)} kJ)`
    };
    
    // Update DOM elements
    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }
});

/**
 * Helper function to switch between tabs programmatically
 * @param {string} tabId - The ID of the tab to switch to
 */
function switchTab(tabId) {
    const tabButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (tabButton) {
        tabButton.click();
    }
}

/**
 * Show complete nutrition information modal for selected food
 * @param {string} foodId - ID of the selected food
 */
function showNutritionModal(foodId) {
    // Find the food item in the ingredients array
    const food = ingredients.find(item => item.name === foodId);
    if (!food) {
        showNotification('Food information not found', 'error');
        return;
    }
    
    // Populate modal with food data
    document.getElementById('modalFoodName').textContent = food.name;
    document.getElementById('servingInfo').textContent = `Serving size: ${food.defaultUnit || '100g'}`;
    document.getElementById('modalCalories').textContent = food.calories || 0;
    
    // Populate nutrient values
    const nutrients = food.nutrients || {};
    document.getElementById('modalFat').textContent = `${nutrients.fat || 0}g`;
    document.getElementById('modalSatFat').textContent = `${nutrients.satFat || 0}g`;
    document.getElementById('modalTransFat').textContent = `${nutrients.transFat || 0}g`;
    document.getElementById('modalCholesterol').textContent = `${nutrients.cholesterol || 0}mg`;
    document.getElementById('modalSodium').textContent = `${nutrients.sodium || 0}mg`;
    document.getElementById('modalCarbs').textContent = `${nutrients.carbs || 0}g`;
    document.getElementById('modalFiber').textContent = `${nutrients.fiber || 0}g`;
    document.getElementById('modalSugars').textContent = `${nutrients.sugars || 0}g`;
    document.getElementById('modalProtein').textContent = `${nutrients.protein || 0}g`;
    document.getElementById('modalVitaminD').textContent = `${nutrients.vitaminD || 0}mcg`;
    document.getElementById('modalCalcium').textContent = `${nutrients.calcium || 0}mg`;
    document.getElementById('modalIron').textContent = `${nutrients.iron || 0}mg`;
    document.getElementById('modalPotassium').textContent = `${nutrients.potassium || 0}mg`;
    
    // Update source information
    document.getElementById('modalSource').textContent = 'Source: Local Database';
    
    // Show the modal
    const modal = document.getElementById('nutritionModal');
    if (modal) {
        modal.style.display = 'block';
    }
    
    // Setup close button
    const closeBtn = document.querySelector('.modal-header .close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }
    
    // Setup add from modal button
    const addFromModalBtn = document.getElementById('addFromModal');
    if (addFromModalBtn) {
        addFromModalBtn.onclick = function() {
            // Try to select this food in the dropdown
            const ingredientSelect = document.getElementById('ingredient');
            if (ingredientSelect) {
                // Need to find the option that matches this food
                const options = ingredientSelect.options;
                for (let i = 0; i < options.length; i++) {
                    try {
                        const optionData = JSON.parse(options[i].value);
                        if (optionData && food && optionData.calories === food.calories) {
                            ingredientSelect.selectedIndex = i;
                            updateNutrientInfo();
                            break;
                        }
                    } catch (e) {
                        console.error("Error parsing option value:", e);
                    }
                }
            }
            
            // Close modal
            modal.style.display = 'none';
        };
    }
    
    // Close button at the bottom
    const closeModalBtn = document.getElementById('closeNutritionModal');
    if (closeModalBtn) {
        closeModalBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }
    
    // Close when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

/**
 * Open the saved meals manager interface
 */
function openSavedMealsManager() {
    // Switch to My Favorites tab first
    const myMealsTab = document.querySelector('.food-tab[data-tab="my-meals"]');
    if (myMealsTab) {
        myMealsTab.click();
    }
    
    // Get the saved foods list
    const savedFoodsList = document.getElementById('savedFoodsList');
    if (!savedFoodsList) {
        showNotification('Saved foods list not found', 'error');
        return;
    }
    
    // Enable management mode on the container
    savedFoodsList.classList.add('management-mode');
    
    // Make all delete buttons visible
    const deleteButtons = savedFoodsList.querySelectorAll('.saved-food-btn.delete');
    deleteButtons.forEach(btn => {
        btn.style.display = 'flex';
    });
    
    // Show user notification
    showNotification('Saved foods management mode enabled. Click delete buttons to remove items.', 'info');
}
