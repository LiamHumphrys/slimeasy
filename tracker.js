// Parse URL parameters with fallback to avoid NaN
const urlParams = new URLSearchParams(window.location.search);
const bmr = parseFloat(urlParams.get('bmr')) || 0;
const tdee = parseFloat(urlParams.get('tdee')) || 0;
const currentWeight = parseFloat(urlParams.get('weight')) || 0;
const goalWeight = parseFloat(urlParams.get('goal')) || 0;
const timeWeeks = parseFloat(urlParams.get('time')) || 0;
const goalCalories = parseFloat(urlParams.get('goalCalories')) || 0;

// Constants for unit conversions
const kcalToKj = 4.184;
const kgToLb = 2.20462;
const unitMultipliers = {
    g: 0.01, cup: 2.4, oz: 0.2835, tbsp: 0.15, tsp: 0.05, unit: 1
};

// Use goalCalories from URL if provided, otherwise calculate with validation
let dailyGoal;

// Check if we have all necessary values for calculation
if (goalCalories > 0) {
    dailyGoal = goalCalories;
} else if (tdee > 0 && currentWeight > goalWeight && timeWeeks > 0) {
    // Calculate from weight loss target
    dailyGoal = tdee - ((currentWeight - goalWeight) * 7700 / (timeWeeks * 7));
} else {
    // Fallback to TDEE or a reasonable default
    dailyGoal = tdee > 0 ? tdee : 2000;
}

// Round and ensure a reasonable value
dailyGoal = isNaN(dailyGoal) || !isFinite(dailyGoal) || dailyGoal < 1200 ? tdee : Math.round(dailyGoal);

// Calculate daily deficit for display (with fallback to avoid NaN)
const dailyDeficit = !isNaN(tdee) && !isNaN(dailyGoal) ? tdee - dailyGoal : 0; // Reflects the actual deficit used

// Display initial values with units
document.getElementById('bmr').textContent = bmr.toFixed(0);
document.getElementById('bmrUnits').textContent = `kcal (${Math.round(bmr * kcalToKj)} kJ)`;
document.getElementById('tdee').textContent = tdee.toFixed(0);
document.getElementById('tdeeUnits').textContent = `kcal (${Math.round(tdee * kcalToKj)} kJ)`;
document.getElementById('dailyDeficit').textContent = Math.round(dailyDeficit);
document.getElementById('deficitUnits').textContent = `kcal (${Math.round(dailyDeficit * kcalToKj)} kJ)`;
document.getElementById('dailyGoal').textContent = dailyGoal;
document.getElementById('goalUnits').textContent = `kcal (${Math.round(dailyGoal * kcalToKj)} kJ)`;
document.getElementById('goalDisplay').textContent = `${dailyGoal} kcal (${Math.round(dailyGoal * kcalToKj)} kJ)`;

// Weight displays
const weightDisplay = `${currentWeight} kg (${Math.round(currentWeight * kgToLb)} lb)`;
const goalWeightDisplay = `${goalWeight} kg (${Math.round(goalWeight * kgToLb)} lb)`;

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
    { name: "Peach (1 medium)", calories: 59, defaultUnit: "unit" },
    { name: "Pear (1 medium)", calories: 101, defaultUnit: "unit" },
    { name: "Watermelon (1 cup)", calories: 46, defaultUnit: "cup" },
    { name: "Cantaloupe (1 cup)", calories: 53, defaultUnit: "cup" },
    { name: "Honeydew (1 cup)", calories: 61, defaultUnit: "cup" },
    { name: "Kiwi (1 medium)", calories: 42, defaultUnit: "unit" },
    { name: "Plum (1 medium)", calories: 30, defaultUnit: "unit" },
    { name: "Cherry (1 cup)", calories: 87, defaultUnit: "cup" },
    { name: "Pomegranate (1 cup)", calories: 144, defaultUnit: "cup" },
    { name: "Grapefruit (1 medium)", calories: 52, defaultUnit: "unit" },
    { name: "Apricot (1 medium)", calories: 17, defaultUnit: "unit" },
    { name: "Fig (1 medium)", calories: 37, defaultUnit: "unit" },
    { name: "Date (1 piece)", calories: 20, defaultUnit: "unit" },
    { name: "Cranberries (1 cup)", calories: 46, defaultUnit: "cup" },
    { name: "Lemon (1 medium)", calories: 17, defaultUnit: "unit" },

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
    { name: "Cauliflower (1 cup)", calories: 25, defaultUnit: "cup" },
    { name: "Brussels Sprouts (1 cup)", calories: 56, defaultUnit: "cup" },
    { name: "Asparagus (1 cup)", calories: 27, defaultUnit: "cup" },
    { name: "Green Beans (1 cup)", calories: 31, defaultUnit: "cup" },
    { name: "Peas (1 cup)", calories: 118, defaultUnit: "cup" },
    { name: "Corn (1 cup)", calories: 132, defaultUnit: "cup" },
    { name: "Onion (1 medium)", calories: 44, defaultUnit: "unit" },
    { name: "Garlic (1 clove)", calories: 4, defaultUnit: "unit" },
    { name: "Mushrooms (1 cup)", calories: 15, defaultUnit: "cup" },
    { name: "Eggplant (1 cup)", calories: 20, defaultUnit: "cup" },
    { name: "Celery (1 stalk)", calories: 6, defaultUnit: "unit" },
    { name: "Radish (1 cup)", calories: 19, defaultUnit: "cup" },
    { name: "Beet (1 medium)", calories: 35, defaultUnit: "unit" },
    { name: "Cabbage (1 cup)", calories: 22, defaultUnit: "cup" },
    { name: "Lettuce (1 cup)", calories: 5, defaultUnit: "cup" },

    // Grains & Cereals (25)
    { name: "Brown Rice (1 cup cooked)", calories: 218, defaultUnit: "cup" },
    { name: "White Rice (1 cup cooked)", calories: 205, defaultUnit: "cup" },
    { name: "Quinoa (1 cup cooked)", calories: 222, defaultUnit: "cup" },
    { name: "Oats (1 cup cooked)", calories: 154, defaultUnit: "cup" },
    { name: "Whole Wheat Bread (1 slice)", calories: 81, defaultUnit: "unit" },
    { name: "White Bread (1 slice)", calories: 79, defaultUnit: "unit" },
    { name: "Pasta (1 cup cooked)", calories: 131, defaultUnit: "cup" },
    { name: "Couscous (1 cup cooked)", calories: 176, defaultUnit: "cup" },
    { name: "Barley (1 cup cooked)", calories: 193, defaultUnit: "cup" },
    { name: "Bulgur (1 cup cooked)", calories: 151, defaultUnit: "cup" },
    { name: "Millet (1 cup cooked)", calories: 207, defaultUnit: "cup" },
    { name: "Cornmeal (1 cup cooked)", calories: 94, defaultUnit: "cup" },
    { name: "Bagel (1 medium)", calories: 289, defaultUnit: "unit" },
    { name: "English Muffin (1 piece)", calories: 134, defaultUnit: "unit" },
    { name: "Pita Bread (1 medium)", calories: 165, defaultUnit: "unit" },
    { name: "Tortilla (1 medium)", calories: 90, defaultUnit: "unit" },
    { name: "Crackers (5 pieces)", calories: 70, defaultUnit: "unit" },
    { name: "Rice Cake (1 piece)", calories: 35, defaultUnit: "unit" },
    { name: "Granola (1 cup)", calories: 471, defaultUnit: "cup" },
    { name: "Cereal (Corn Flakes, 1 cup)", calories: 100, defaultUnit: "cup" },
    { name: "Cereal (Oatmeal Squares, 1 cup)", calories: 210, defaultUnit: "cup" },
    { name: "Popcorn (1 cup popped)", calories: 31, defaultUnit: "cup" },
    { name: "Pretzels (1 oz)", calories: 108, defaultUnit: "oz" },
    { name: "Rye Bread (1 slice)", calories: 83, defaultUnit: "unit" },
    { name: "Sourdough Bread (1 slice)", calories: 93, defaultUnit: "unit" },

    // Dairy (25)
    { name: "Milk (1 cup)", calories: 103, defaultUnit: "cup" },
    { name: "Skim Milk (1 cup)", calories: 83, defaultUnit: "cup" },
    { name: "Almond Milk (1 cup)", calories: 39, defaultUnit: "cup" },
    { name: "Soy Milk (1 cup)", calories: 80, defaultUnit: "cup" },
    { name: "Greek Yogurt (1 cup)", calories: 100, defaultUnit: "cup" },
    { name: "Plain Yogurt (1 cup)", calories: 112, defaultUnit: "cup" },
    { name: "Cheddar Cheese (1 oz)", calories: 113, defaultUnit: "oz" },
    { name: "Mozzarella (1 oz)", calories: 85, defaultUnit: "oz" },
    { name: "Parmesan (1 oz)", calories: 111, defaultUnit: "oz" },
    { name: "Swiss Cheese (1 oz)", calories: 106, defaultUnit: "oz" },
    { name: "Cream Cheese (1 tbsp)", calories: 51, defaultUnit: "tbsp" },
    { name: "Butter (1 tbsp)", calories: 102, defaultUnit: "tbsp" },
    { name: "Margarine (1 tbsp)", calories: 75, defaultUnit: "tbsp" },
    { name: "Sour Cream (1 tbsp)", calories: 23, defaultUnit: "tbsp" },
    { name: "Heavy Cream (1 tbsp)", calories: 51, defaultUnit: "tbsp" },
    { name: "Whipped Cream (1 tbsp)", calories: 8, defaultUnit: "tbsp" },
    { name: "Cottage Cheese (1 cup)", calories: 163, defaultUnit: "cup" },
    { name: "Ricotta Cheese (1 cup)", calories: 428, defaultUnit: "cup" },
    { name: "Feta Cheese (1 oz)", calories: 75, defaultUnit: "oz" },
    { name: "Goat Cheese (1 oz)", calories: 75, defaultUnit: "oz" },
    { name: "Blue Cheese (1 oz)", calories: 100, defaultUnit: "oz" },
    { name: "Ice Cream (1 cup)", calories: 267, defaultUnit: "cup" },
    { name: "Frozen Yogurt (1 cup)", calories: 221, defaultUnit: "cup" },
    { name: "Half and Half (1 tbsp)", calories: 20, defaultUnit: "tbsp" },
    { name: "Evaporated Milk (1 cup)", calories: 338, defaultUnit: "cup" },

    // Nuts & Seeds (25)
    { name: "Almonds (1 oz)", calories: 161, defaultUnit: "oz" },
    { name: "Peanuts (1 oz)", calories: 161, defaultUnit: "oz" },
    { name: "Walnuts (1 oz)", calories: 185, defaultUnit: "oz" },
    { name: "Cashews (1 oz)", calories: 157, defaultUnit: "oz" },
    { name: "Pecans (1 oz)", calories: 196, defaultUnit: "oz" },
    { name: "Hazelnuts (1 oz)", calories: 178, defaultUnit: "oz" },
    { name: "Macadamia Nuts (1 oz)", calories: 204, defaultUnit: "oz" },
    { name: "Pistachios (1 oz)", calories: 159, defaultUnit: "oz" },
    { name: "Brazil Nuts (1 oz)", calories: 186, defaultUnit: "oz" },
    { name: "Peanut Butter (1 tbsp)", calories: 94, defaultUnit: "tbsp" },
    { name: "Almond Butter (1 tbsp)", calories: 98, defaultUnit: "tbsp" },
    { name: "Cashew Butter (1 tbsp)", calories: 94, defaultUnit: "tbsp" },
    { name: "Sunflower Seeds (1 oz)", calories: 163, defaultUnit: "oz" },
    { name: "Pumpkin Seeds (1 oz)", calories: 151, defaultUnit: "oz" },
    { name: "Chia Seeds (1 oz)", calories: 137, defaultUnit: "oz" },
    { name: "Flaxseeds (1 oz)", calories: 150, defaultUnit: "oz" },
    { name: "Sesame Seeds (1 oz)", calories: 161, defaultUnit: "oz" },
    { name: "Hemp Seeds (1 oz)", calories: 166, defaultUnit: "oz" },
    { name: "Pine Nuts (1 oz)", calories: 191, defaultUnit: "oz" },
    { name: "Tahini (1 tbsp)", calories: 89, defaultUnit: "tbsp" },
    { name: "Trail Mix (1 oz)", calories: 131, defaultUnit: "oz" },
    { name: "Coconut (shredded, 1 oz)", calories: 99, defaultUnit: "oz" },
    { name: "Nutella (1 tbsp)", calories: 100, defaultUnit: "tbsp" },
    { name: "Peanut Oil (1 tbsp)", calories: 119, defaultUnit: "tbsp" },
    { name: "Sunflower Butter (1 tbsp)", calories: 99, defaultUnit: "tbsp" },

    // Legumes & Beans (25)
    { name: "Lentils (1 cup cooked)", calories: 230, defaultUnit: "cup" },
    { name: "Chickpeas (1 cup cooked)", calories: 269, defaultUnit: "cup" },
    { name: "Black Beans (1 cup cooked)", calories: 227, defaultUnit: "cup" },
    { name: "Kidney Beans (1 cup cooked)", calories: 225, defaultUnit: "cup" },
    { name: "Pinto Beans (1 cup cooked)", calories: 245, defaultUnit: "cup" },
    { name: "Navy Beans (1 cup cooked)", calories: 255, defaultUnit: "cup" },
    { name: "White Beans (1 cup cooked)", calories: 249, defaultUnit: "cup" },
    { name: "Soybeans (1 cup cooked)", calories: 298, defaultUnit: "cup" },
    { name: "Tofu (100g)", calories: 76, defaultUnit: "100g" },
    { name: "Tempeh (100g)", calories: 193, defaultUnit: "100g" },
    { name: "Edamame (1 cup)", calories: 121, defaultUnit: "cup" },
    { name: "Split Peas (1 cup cooked)", calories: 231, defaultUnit: "cup" },
    { name: "Fava Beans (1 cup cooked)", calories: 187, defaultUnit: "cup" },
    { name: "Lima Beans (1 cup cooked)", calories: 209, defaultUnit: "cup" },
    { name: "Mung Beans (1 cup cooked)", calories: 212, defaultUnit: "cup" },
    { name: "Adzuki Beans (1 cup cooked)", calories: 294, defaultUnit: "cup" },
    { name: "Black-Eyed Peas (1 cup cooked)", calories: 200, defaultUnit: "cup" },
    { name: "Hummus (1 tbsp)", calories: 25, defaultUnit: "tbsp" },
    { name: "Falafel (1 patty)", calories: 57, defaultUnit: "unit" },
    { name: "Peanut Soup (1 cup)", calories: 200, defaultUnit: "cup" },
    { name: "Bean Burrito (1 medium)", calories: 300, defaultUnit: "unit" },
    { name: "Lentil Soup (1 cup)", calories: 130, defaultUnit: "cup" },
    { name: "Chili with Beans (1 cup)", calories: 287, defaultUnit: "cup" },
    { name: "Refried Beans (1 cup)", calories: 217, defaultUnit: "cup" },
    { name: "Soy Milk (1 cup)", calories: 80, defaultUnit: "cup" },

    // Snacks & Sweets (25)
    { name: "Dark Chocolate (1 oz)", calories: 170, defaultUnit: "oz" },
    { name: "Milk Chocolate (1 oz)", calories: 152, defaultUnit: "oz" },
    { name: "Gummy Bears (1 oz)", calories: 100, defaultUnit: "oz" },
    { name: "Jelly Beans (1 oz)", calories: 105, defaultUnit: "oz" },
    { name: "Granola Bar (1 bar)", calories: 120, defaultUnit: "unit" },
    { name: "Protein Bar (1 bar)", calories: 200, defaultUnit: "unit" },
    { name: "Potato Chips (1 oz)", calories: 152, defaultUnit: "oz" },
    { name: "Tortilla Chips (1 oz)", calories: 138, defaultUnit: "oz" },
    { name: "Pretzels (1 oz)", calories: 108, defaultUnit: "oz" },
    { name: "Popcorn (1 cup popped)", calories: 31, defaultUnit: "cup" },
    { name: "Rice Cakes (1 piece)", calories: 35, defaultUnit: "unit" },
    { name: "Cookies (1 medium)", calories: 78, defaultUnit: "unit" },
    { name: "Brownie (1 square)", calories: 112, defaultUnit: "unit" },
    { name: "Donut (1 medium)", calories: 195, defaultUnit: "unit" },
    { name: "Muffin (1 medium)", calories: 200, defaultUnit: "unit" },
    { name: "Cake Slice (1 piece)", calories: 235, defaultUnit: "unit" },
    { name: "Candy Bar (Snickers, 1 bar)", calories: 215, defaultUnit: "unit" },
    { name: "Ice Cream (1 cup)", calories: 267, defaultUnit: "cup" },
    { name: "Pudding (1 cup)", calories: 160, defaultUnit: "cup" },
    { name: "Fruit Snack (1 oz)", calories: 90, defaultUnit: "oz" },
    { name: "Cheese Puffs (1 oz)", calories: 150, defaultUnit: "oz" },
    { name: "Crackers (5 pieces)", calories: 70, defaultUnit: "unit" },
    { name: "Trail Mix (1 oz)", calories: 131, defaultUnit: "oz" },
    { name: "Energy Gel (1 packet)", calories: 100, defaultUnit: "unit" },
    { name: "Chocolate Chip Cookie (1 large)", calories: 221, defaultUnit: "unit" },

    // Beverages (25)
    { name: "Coffee (black, 1 cup)", calories: 2, defaultUnit: "cup" },
    { name: "Green Tea (1 cup)", calories: 0, defaultUnit: "cup" },
    { name: "Black Tea (1 cup)", calories: 2, defaultUnit: "cup" },
    { name: "Orange Juice (1 cup)", calories: 112, defaultUnit: "cup" },
    { name: "Apple Juice (1 cup)", calories: 114, defaultUnit: "cup" },
    { name: "Grape Juice (1 cup)", calories: 152, defaultUnit: "cup" },
    { name: "Cranberry Juice (1 cup)", calories: 116, defaultUnit: "cup" },
    { name: "Sports Drink (8 oz)", calories: 60, defaultUnit: "oz" },
    { name: "Energy Drink (8 oz)", calories: 110, defaultUnit: "oz" },
    { name: "Cola (12 oz)", calories: 136, defaultUnit: "oz" },
    { name: "Diet Cola (12 oz)", calories: 0, defaultUnit: "oz" },
    { name: "Lemonade (1 cup)", calories: 99, defaultUnit: "cup" },
    { name: "Iced Tea (1 cup)", calories: 90, defaultUnit: "cup" },
    { name: "Beer (12 oz)", calories: 153, defaultUnit: "oz" },
    { name: "Wine (5 oz)", calories: 123, defaultUnit: "oz" },
    { name: "Vodka (1 oz)", calories: 64, defaultUnit: "oz" },
    { name: "Whiskey (1 oz)", calories: 64, defaultUnit: "oz" },
    { name: "Smoothie (1 cup)", calories: 130, defaultUnit: "cup" },
    { name: "Protein Shake (1 cup)", calories: 160, defaultUnit: "cup" },
    { name: "Coconut Water (1 cup)", calories: 46, defaultUnit: "cup" },
    { name: "Kombucha (1 cup)", calories: 30, defaultUnit: "cup" },
    { name: "Hot Chocolate (1 cup)", calories: 192, defaultUnit: "cup" },
    { name: "Latte (1 cup)", calories: 120, defaultUnit: "cup" },
    { name: "Cappuccino (1 cup)", calories: 60, defaultUnit: "cup" },
    { name: "Water (1 cup)", calories: 0, defaultUnit: "cup" },

    // Oils & Condiments (25)
    { name: "Olive Oil (1 tbsp)", calories: 119, defaultUnit: "tbsp" },
    { name: "Canola Oil (1 tbsp)", calories: 124, defaultUnit: "tbsp" },
    { name: "Coconut Oil (1 tbsp)", calories: 117, defaultUnit: "tbsp" },
    { name: "Vegetable Oil (1 tbsp)", calories: 120, defaultUnit: "tbsp" },
    { name: "Butter (1 tbsp)", calories: 102, defaultUnit: "tbsp" },
    { name: "Margarine (1 tbsp)", calories: 75, defaultUnit: "tbsp" },
    { name: "Mayonnaise (1 tbsp)", calories: 94, defaultUnit: "tbsp" },
    { name: "Ketchup (1 tbsp)", calories: 15, defaultUnit: "tbsp" },
    { name: "Mustard (1 tsp)", calories: 3, defaultUnit: "tsp" },
    { name: "Soy Sauce (1 tbsp)", calories: 8, defaultUnit: "tbsp" },
    { name: "Hot Sauce (1 tsp)", calories: 1, defaultUnit: "tsp" },
    { name: "BBQ Sauce (1 tbsp)", calories: 29, defaultUnit: "tbsp" },
    { name: "Honey (1 tbsp)", calories: 64, defaultUnit: "tbsp" },
    { name: "Maple Syrup (1 tbsp)", calories: 52, defaultUnit: "tbsp" },
    { name: "Jam (1 tbsp)", calories: 56, defaultUnit: "tbsp" },
    { name: "Peanut Butter (1 tbsp)", calories: 94, defaultUnit: "tbsp" },
    { name: "Ranch Dressing (1 tbsp)", calories: 73, defaultUnit: "tbsp" },
    { name: "Caesar Dressing (1 tbsp)", calories: 78, defaultUnit: "tbsp" },
    { name: "Vinaigrette (1 tbsp)", calories: 43, defaultUnit: "tbsp" },
    { name: "Salsa (1 tbsp)", calories: 4, defaultUnit: "tbsp" },
    { name: "Guacamole (1 tbsp)", calories: 23, defaultUnit: "tbsp" },
    { name: "Hummus (1 tbsp)", calories: 25, defaultUnit: "tbsp" },
    { name: "Tahini (1 tbsp)", calories: 89, defaultUnit: "tbsp" },
    { name: "Fish Sauce (1 tbsp)", calories: 10, defaultUnit: "tbsp" },
    { name: "Teriyaki Sauce (1 tbsp)", calories: 15, defaultUnit: "tbsp" },

    // Prepared Foods (25)
    { name: "Pizza Slice (1/8 of 12\")", calories: 200, defaultUnit: "unit" },
    { name: "Cheeseburger (1 medium)", calories: 300, defaultUnit: "unit" },
    { name: "Hamburger (1 medium)", calories: 240, defaultUnit: "unit" },
    { name: "Hot Dog (1 piece)", calories: 150, defaultUnit: "unit" },
    { name: "Chicken Nuggets (1 piece)", calories: 48, defaultUnit: "unit" },
    { name: "French Fries (1 cup)", calories: 312, defaultUnit: "cup" },
    { name: "Onion Rings (1 ring)", calories: 41, defaultUnit: "unit" },
    { name: "Salmon Sushi Roll (1 piece)", calories: 48, defaultUnit: "unit" },
    { name: "California Roll (1 piece)", calories: 33, defaultUnit: "unit" },
    { name: "Taco (1 medium)", calories: 150, defaultUnit: "unit" },
    { name: "Burrito (1 medium)", calories: 300, defaultUnit: "unit" },
    { name: "Sandwich (Turkey, 1 piece)", calories: 200, defaultUnit: "unit" },
    { name: "BLT Sandwich (1 piece)", calories: 240, defaultUnit: "unit" },
    { name: "Grilled Cheese (1 piece)", calories: 290, defaultUnit: "unit" },
    { name: "Pancake (1 medium)", calories: 88, defaultUnit: "unit" },
    { name: "Waffle (1 medium)", calories: 218, defaultUnit: "unit" },
    { name: "Omelette (2 eggs)", calories: 160, defaultUnit: "unit" },
    { name: "Fried Egg (1 large)", calories: 90, defaultUnit: "unit" },
    { name: "Scrambled Eggs (2 eggs)", calories: 140, defaultUnit: "unit" },
    { name: "Spaghetti with Sauce (1 cup)", calories: 221, defaultUnit: "cup" },
    { name: "Lasagna (1 piece)", calories: 336, defaultUnit: "unit" },
    { name: "Mac and Cheese (1 cup)", calories: 310, defaultUnit: "cup" },
    { name: "Chicken Soup (1 cup)", calories: 75, defaultUnit: "cup" },
    { name: "Vegetable Soup (1 cup)", calories: 98, defaultUnit: "cup" },
    { name: "Beef Stew (1 cup)", calories: 235, defaultUnit: "cup" }
];

// Edamam API credentials
const EDAMAM_APP_ID = 'b047d111';
const EDAMAM_APP_KEY = 'cf3bf39de00d2b05fe3215fbdcf3d773';
const EDAMAM_API_URL = 'https://api.edamam.com/api/food-database/v2/parser';

// Populate Ingredient Dropdown from both API and local data
const ingredientSelect = document.getElementById('ingredient');
let searchTimeout;
let lastSearchQuery = '';
let apiResults = [];

// Function to perform API search for foods
async function searchFoodAPI(query) {
    if (!query || query.length < 2) return [];
    
    try {
        const url = `${EDAMAM_API_URL}?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&ingr=${encodeURIComponent(query)}&nutrition-type=logging`;
        
        // Show loading indicator
        const searchBox = document.getElementById('ingredientSearch').parentNode;
        let loadingEl = searchBox.querySelector('.search-loading');
        if (!loadingEl) {
            loadingEl = document.createElement('div');
            loadingEl.className = 'search-loading';
            loadingEl.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
            searchBox.appendChild(loadingEl);
        }
        
        const response = await fetch(url);
        
        // Remove loading indicator
        if (loadingEl) {
            searchBox.removeChild(loadingEl);
        }
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API results to match our format
        return data.hints.map(item => {
            const food = item.food;
            const measure = item.measures[0] || { label: 'g', weight: 100 };
            const nutrients = food.nutrients || {};
            
            return {
                name: `${food.label} (API)`,
                calories: Math.round(nutrients.ENERC_KCAL || 0),
                defaultUnit: measure.label.toLowerCase(),
                weight: measure.weight,
                nutrientData: {
                    protein: nutrients.PROCNT || 0,
                    fat: nutrients.FAT || 0,
                    carbs: nutrients.CHOCDF || 0,
                    fiber: nutrients.FIBTG || 0
                },
                source: 'api',
                foodId: food.foodId
            };
        });
    } catch (error) {
        console.error('Food API search error:', error);
        showNotification('Error searching food database', 'error');
        return [];
    }
}

function populateIngredients(filter = '') {
    ingredientSelect.innerHTML = '';
    
    // Always include local database results
    const localFiltered = ingredients.filter(ing => ing.name.toLowerCase().includes(filter.toLowerCase()));
    
    // Combine local and API results
    const allResults = [...apiResults, ...localFiltered];
    
    if (allResults.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = filter ? 'No matches found - try another search' : 'Start typing to search foods';
        option.disabled = true;
        ingredientSelect.appendChild(option);
    } else {
        allResults.forEach(ing => {
            const option = document.createElement('option');
            // For API items, include complete nutrient data
            const valueData = {
                calories: ing.calories,
                unit: ing.defaultUnit, 
                weight: ing.weight || 100,
                source: ing.source || 'local'
            };
            
            if (ing.nutrientData) {
                valueData.nutrients = ing.nutrientData;
            }
            
            option.value = JSON.stringify(valueData);
            
            // Show API or local source in the option text
            const sourceIndicator = ing.source === 'api' ? ' 🌐' : '';
            option.textContent = `${ing.name}${sourceIndicator} (${ing.calories} kcal / ${Math.round(ing.calories * kcalToKj)} kJ per ${ing.defaultUnit})`;
            ingredientSelect.appendChild(option);
        });
    }
    
    // Add nutrient info display to the dropdown
    updateNutrientInfoDisplay();
}

// Add function to update nutrient info when selecting an item
function updateNutrientInfoDisplay() {
    const selectedOption = ingredientSelect.options[ingredientSelect.selectedIndex];
    if (!selectedOption || !selectedOption.value) return;
    
    try {
        const itemData = JSON.parse(selectedOption.value);
        const calories = itemData.calories || 0;
        
        // Update the nutrient info display with selected item data
        document.getElementById('nutrientCalories').textContent = calories;
        
        if (itemData.nutrients) {
            // Use actual nutrient data when available
            const protein = parseFloat(itemData.nutrients.protein) || 0;
            const carbs = parseFloat(itemData.nutrients.carbs) || 0;
            const fat = parseFloat(itemData.nutrients.fat) || 0;
            
            document.getElementById('nutrientProtein').textContent = protein.toFixed(1);
            document.getElementById('nutrientCarbs').textContent = carbs.toFixed(1);
            document.getElementById('nutrientFat').textContent = fat.toFixed(1);
            
            // Update data in itemData to ensure macros are captured
            itemData.nutrients = {
                protein: protein,
                carbs: carbs,
                fat: fat
            };
            
            // Update the selected option value to include nutrients
            selectedOption.value = JSON.stringify(itemData);
        } else {
            // For items without detailed nutrients, generate estimated macros based on calories
            const estimatedProtein = Math.round(calories * 0.25 / 4); // 25% of calories from protein (4 cal per gram)
            const estimatedCarbs = Math.round(calories * 0.5 / 4);    // 50% of calories from carbs (4 cal per gram)
            const estimatedFat = Math.round(calories * 0.25 / 9);     // 25% of calories from fat (9 cal per gram)
            
            document.getElementById('nutrientProtein').textContent = estimatedProtein.toFixed(1);
            document.getElementById('nutrientCarbs').textContent = estimatedCarbs.toFixed(1);
            document.getElementById('nutrientFat').textContent = estimatedFat.toFixed(1);
            
            // Add estimated nutrients to item data to ensure they're captured
            itemData.nutrients = {
                protein: estimatedProtein,
                carbs: estimatedCarbs,
                fat: estimatedFat
            };
            
            // Update the selected option value to include the nutrients
            selectedOption.value = JSON.stringify(itemData);
            
            // Add note that these are estimated values
            const nutrientInfoEl = document.getElementById('nutrientInfo');
            if (nutrientInfoEl) {
                // Check if note already exists
                let noteEl = nutrientInfoEl.querySelector('.nutrient-note');
                if (!noteEl) {
                    noteEl = document.createElement('div');
                    noteEl.className = 'nutrient-note';
                    noteEl.textContent = '* Estimated values based on calories';
                    noteEl.style.fontSize = '11px';
                    noteEl.style.color = 'var(--text-secondary)';
                    noteEl.style.fontStyle = 'italic';
                    noteEl.style.marginTop = '5px';
                    nutrientInfoEl.appendChild(noteEl);
                }
            }
        }
        
        // Make the card visible
        const nutrientCard = document.querySelector('.nutrient-info-card');
        if (nutrientCard) {
            nutrientCard.style.display = 'block';
        }
        
        // Update serving text
        document.getElementById('perServingText').textContent = `(per ${itemData.unit || 'serving'})`;
        
        // Enable nutrition details button if it's API data with full nutrients
        const viewDetailsBtn = document.getElementById('viewNutritionDetails');
        if (viewDetailsBtn) {
            viewDetailsBtn.disabled = itemData.source !== 'api';
            viewDetailsBtn.title = itemData.source === 'api' ? 
                'View complete nutrition information' : 
                'Complete nutrition details only available for database items';
        }
    } catch (e) {
        console.error('Error updating nutrient info:', e);
    }
}

// Function to get detailed nutrition data from API for a specific food
async function getFoodDetails(foodId) {
    if (!foodId) return null;
    
    try {
        const url = `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;
        
        // Show loading modal or indicator
        showNotification('Loading nutrition details...', 'info');
        
        // Create request body as per Edamam API documentation
        const requestBody = {
            ingredients: [
                {
                    quantity: 1,
                    measureURI: 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram',
                    foodId: foodId
                }
            ]
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching food details:', error);
        showNotification('Error loading nutrition details', 'error');
        return null;
    }
}

// Functions for nutrition modal
function openNutritionModal(foodData, detailedNutrients = null) {
    const modal = document.getElementById('nutritionModal');
    if (!modal) return;
    
    try {
        // Set basic info
        document.getElementById('modalFoodName').textContent = 
            foodData.name || 'Food Nutrition Details';
        document.getElementById('servingInfo').textContent = 
            `Serving size: ${foodData.weight || 100}${foodData.unit || 'g'}`;
        document.getElementById('modalCalories').textContent = 
            `${foodData.calories || 0}`;
        
        // Source info
        document.getElementById('modalSource').textContent = 
            foodData.source === 'api' ? 'Source: Edamam Food Database' : 'Source: Local Database';
        
        // If we have detailed nutrients from the API, use them
        if (detailedNutrients) {
            const nutrients = detailedNutrients.totalNutrients || {};
            
            // Set nutrient values with proper units
            if (nutrients.FAT) document.getElementById('modalFat').textContent = 
                `${nutrients.FAT.quantity.toFixed(1)}${nutrients.FAT.unit}`;
            if (nutrients.FASAT) document.getElementById('modalSatFat').textContent = 
                `${nutrients.FASAT.quantity.toFixed(1)}${nutrients.FASAT.unit}`;
            if (nutrients.FATRN) document.getElementById('modalTransFat').textContent = 
                `${nutrients.FATRN.quantity.toFixed(1)}${nutrients.FATRN.unit}`;
            if (nutrients.CHOLE) document.getElementById('modalCholesterol').textContent = 
                `${nutrients.CHOLE.quantity.toFixed(1)}${nutrients.CHOLE.unit}`;
            if (nutrients.NA) document.getElementById('modalSodium').textContent = 
                `${nutrients.NA.quantity.toFixed(1)}${nutrients.NA.unit}`;
            if (nutrients.CHOCDF) document.getElementById('modalCarbs').textContent = 
                `${nutrients.CHOCDF.quantity.toFixed(1)}${nutrients.CHOCDF.unit}`;
            if (nutrients.FIBTG) document.getElementById('modalFiber').textContent = 
                `${nutrients.FIBTG.quantity.toFixed(1)}${nutrients.FIBTG.unit}`;
            if (nutrients.SUGAR) document.getElementById('modalSugars').textContent = 
                `${nutrients.SUGAR.quantity.toFixed(1)}${nutrients.SUGAR.unit}`;
            if (nutrients.PROCNT) document.getElementById('modalProtein').textContent = 
                `${nutrients.PROCNT.quantity.toFixed(1)}${nutrients.PROCNT.unit}`;
            if (nutrients.VITD) document.getElementById('modalVitaminD').textContent = 
                `${nutrients.VITD.quantity.toFixed(1)}${nutrients.VITD.unit}`;
            if (nutrients.CA) document.getElementById('modalCalcium').textContent = 
                `${nutrients.CA.quantity.toFixed(1)}${nutrients.CA.unit}`;
            if (nutrients.FE) document.getElementById('modalIron').textContent = 
                `${nutrients.FE.quantity.toFixed(1)}${nutrients.FE.unit}`;
            if (nutrients.K) document.getElementById('modalPotassium').textContent = 
                `${nutrients.K.quantity.toFixed(1)}${nutrients.K.unit}`;
        } else if (foodData.nutrients) {
            // Use basic nutrient data if detailed not available
            document.getElementById('modalFat').textContent = `${parseFloat(foodData.nutrients.fat || 0).toFixed(1)}g`;
            document.getElementById('modalCarbs').textContent = `${parseFloat(foodData.nutrients.carbs || 0).toFixed(1)}g`;
            document.getElementById('modalFiber').textContent = `0g`;
            document.getElementById('modalProtein').textContent = `${parseFloat(foodData.nutrients.protein || 0).toFixed(1)}g`;
            
            // Set default 0 values for other nutrients
            document.getElementById('modalSatFat').textContent = '0g';
            document.getElementById('modalTransFat').textContent = '0g';
            document.getElementById('modalCholesterol').textContent = '0mg';
            document.getElementById('modalSodium').textContent = '0mg';
            document.getElementById('modalSugars').textContent = '0g';
            document.getElementById('modalVitaminD').textContent = '0mcg';
            document.getElementById('modalCalcium').textContent = '0mg';
            document.getElementById('modalIron').textContent = '0mg';
            document.getElementById('modalPotassium').textContent = '0mg';
        } else {
            // Just show calories if that's all we have
            // Set default 0 values for nutrients
            document.getElementById('modalFat').textContent = '0g';
            document.getElementById('modalSatFat').textContent = '0g';
            document.getElementById('modalTransFat').textContent = '0g';
            document.getElementById('modalCholesterol').textContent = '0mg';
            document.getElementById('modalSodium').textContent = '0mg';
            document.getElementById('modalCarbs').textContent = '0g';
            document.getElementById('modalFiber').textContent = '0g';
            document.getElementById('modalSugars').textContent = '0g';
            document.getElementById('modalProtein').textContent = '0g';
            document.getElementById('modalVitaminD').textContent = '0mcg';
            document.getElementById('modalCalcium').textContent = '0mg';
            document.getElementById('modalIron').textContent = '0mg';
            document.getElementById('modalPotassium').textContent = '0mg';
        }
        
        // Store current food data for "Add to Meal" button
        modal.dataset.currentFood = JSON.stringify(foodData);
        
        // Show the modal
        modal.style.display = 'block';
        
    } catch (error) {
        console.error('Error displaying nutrition modal:', error);
        showNotification('Error displaying nutrition information', 'error');
    }
}

function closeNutritionModal() {
    const modal = document.getElementById('nutritionModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize with local data first
populateIngredients();

// Event Listeners
document.getElementById('ingredientSearch').addEventListener('input', function(e) {
    const query = e.target.value.trim();
    
    // Immediately show local results
    populateIngredients(query);
    
    // Debounce API search to prevent too many requests
    clearTimeout(searchTimeout);
    
    // Only search API if query has changed and is substantial
    if (query.length >= 2 && query !== lastSearchQuery) {
        searchTimeout = setTimeout(async () => {
            lastSearchQuery = query;
            apiResults = await searchFoodAPI(query);
            populateIngredients(query);
        }, 500); // 500ms delay
    }
});

// Add change event to ingredient select to update nutrient info
ingredientSelect.addEventListener('change', updateNutrientInfoDisplay);

// Nutrition modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    // View nutrition details button
    const viewNutritionBtn = document.getElementById('viewNutritionDetails');
    if (viewNutritionBtn) {
        viewNutritionBtn.addEventListener('click', async function() {
            const selectedOption = ingredientSelect.options[ingredientSelect.selectedIndex];
            if (!selectedOption || !selectedOption.value) return;
            
            try {
                const itemData = JSON.parse(selectedOption.value);
                const foodName = selectedOption.textContent.split('(')[0].trim();
                
                // Create a food data object with all the info we have
                const foodData = {
                    name: foodName,
                    calories: itemData.calories,
                    unit: itemData.unit,
                    weight: itemData.weight,
                    nutrients: itemData.nutrients,
                    source: itemData.source,
                    foodId: itemData.foodId
                };
                
                // For API items, fetch detailed nutrition
                let detailedNutrition = null;
                if (itemData.source === 'api' && itemData.foodId) {
                    detailedNutrition = await getFoodDetails(itemData.foodId);
                }
                
                // Open the modal
                openNutritionModal(foodData, detailedNutrition);
            } catch (e) {
                console.error('Error opening nutrition modal:', e);
                showNotification('Error showing nutrition details', 'error');
            }
        });
    }
    
    // Close modal button and X icon
    document.getElementById('closeNutritionModal').addEventListener('click', closeNutritionModal);
    const closeBtn = document.querySelector('.modal-header .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeNutritionModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('nutritionModal');
        if (event.target === modal) {
            closeNutritionModal();
        }
    });
    
    // Add from modal button
    document.getElementById('addFromModal').addEventListener('click', function() {
        const modal = document.getElementById('nutritionModal');
        if (!modal || !modal.dataset.currentFood) return;
        
        // Get selected date for database food
        const mealDate = document.getElementById('dbMealDate').value || new Date().toISOString().split('T')[0];
        
        try {
            const foodData = JSON.parse(modal.dataset.currentFood);
            const qty = 1; // Default quantity
            const foodName = foodData.name;
            const calories = foodData.calories;
            
            // Add to meal ingredients list
            mealIngredients.push({ 
                name: `${qty} ${foodData.unit || 'serving'} ${foodName}`, 
                calories: calories 
            });
            mealTotalCalories += calories;
            updateMealDisplay();
            
            // Close modal and show notification
            closeNutritionModal();
            showNotification(`Added ${foodName} to meal`, 'success');
        } catch (e) {
            console.error('Error adding from modal:', e);
        }
    });
});

// Quick add common foods
const quickAddFoods = [
    { name: "Banana", calories: 105, type: "snack" },
    { name: "Apple", calories: 95, type: "snack" },
    { name: "Greek Yogurt", calories: 150, type: "breakfast" },
    { name: "Oatmeal", calories: 158, type: "breakfast" },
    { name: "Scrambled Eggs", calories: 140, type: "breakfast" },
    { name: "Chicken Breast", calories: 165, type: "lunch" },
    { name: "Turkey Sandwich", calories: 330, type: "lunch" },
    { name: "Tuna Salad", calories: 180, type: "lunch" },
    { name: "Green Salad", calories: 50, type: "dinner" },
    { name: "Salmon Fillet", calories: 175, type: "dinner" },
    { name: "Brown Rice", calories: 215, type: "dinner" },
    { name: "Coffee with Milk", calories: 30, type: "breakfast" }
];

// Create quick add buttons
function createQuickAddButtons() {
    // Find or create the quick add container
    let quickAddContainer = document.getElementById('quickAddContainer');
    if (!quickAddContainer) {
        // Only add if in manual food section
        const manualSection = document.getElementById('manual');
        if (!manualSection) return;
        
        // Create container
        quickAddContainer = document.createElement('div');
        quickAddContainer.id = 'quickAddContainer';
        quickAddContainer.className = 'card';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'card-header';
        header.innerHTML = '<i class="fas fa-bolt"></i><h3 class="card-title">Quick Add Common Foods</h3>';
        
        // Create content
        const content = document.createElement('div');
        content.className = 'card-body';
        content.innerHTML = '<p>Click to quickly add common foods to your daily log:</p>';
        
        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'quick-add';
        
        // Add quick add food buttons
        quickAddFoods.forEach(food => {
            const button = document.createElement('button');
            button.className = 'quick-add-btn';
            button.setAttribute('data-calories', food.calories);
            button.setAttribute('data-name', food.name);
            button.setAttribute('data-type', food.type);
            button.innerHTML = `<i class="fas fa-utensils"></i> ${food.name}`;
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Get current day selection
                const dayIndex = parseInt(document.getElementById('manualDay').value);
                const calories = parseInt(this.getAttribute('data-calories'));
                const foodName = this.getAttribute('data-name');
                const mealType = this.getAttribute('data-type');
                
                // Add to planner
                addToPlanner(dayIndex, `${foodName} (${calories} kcal)`, calories, true, mealType);
                
                // Show feedback
                showQuickAddNotification(foodName, calories);
            });
            
            buttonsContainer.appendChild(button);
        });
        
        // Assemble and add to DOM
        content.appendChild(buttonsContainer);
        quickAddContainer.appendChild(header);
        quickAddContainer.appendChild(content);
        
        // Insert before the manual form
        const manualForm = document.getElementById('manualForm');
        manualSection.insertBefore(quickAddContainer, manualForm);
    }
}

// Show notification for quick add
function showQuickAddNotification(foodName, calories) {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.style.backgroundColor = 'var(--success-color)';
    notification.style.color = 'white';
    notification.style.padding = '15px';
    notification.style.margin = '10px';
    notification.style.borderRadius = 'var(--border-radius)';
    notification.style.boxShadow = 'var(--card-shadow)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.transition = 'all 0.3s';
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    notification.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 10px;"></i> Added ${foodName} (${calories} kcal)`;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 50);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 3000);
}

// Event listener for manual food form
document.getElementById('manualForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const dayIndex = parseInt(document.getElementById('manualDay').value);
    const mealType = document.getElementById('manualMealType').value;
    const foodName = document.getElementById('manualFoodName').value;
    const amount = parseFloat(document.getElementById('manualAmount').value) || 0;
    const unit = document.getElementById('manualUnit').value;
    const calories = unit === 'kcal' ? amount : Math.round(amount / kcalToKj);
    
    // Estimate macros based on calories (rough estimate)
    const macros = {
        protein: Math.round(calories * 0.25 / 4), // 25% of calories from protein (4 cal per gram)
        carbs: Math.round(calories * 0.5 / 4),    // 50% of calories from carbs (4 cal per gram)
        fat: Math.round(calories * 0.25 / 9),     // 25% of calories from fat (9 cal per gram)
        fiber: Math.round(calories * 0.05 / 2)     // ~5% of calories (estimate)
    };
    
    addToPlanner(dayIndex, `${foodName} (${amount} ${unit})`, calories, true, mealType, macros);
    
    // Show notification
    showQuickAddNotification(foodName, calories);
    
    this.reset();
});

let mealIngredients = [];
let mealTotalCalories = 0;
let inCustomMeal = false; // Flag to know if we're building a meal or adding directly

document.getElementById('addIngredient').addEventListener('click', function() {
    try {
        // Get selected food data and quantity
        const selectedValue = document.getElementById('ingredient').value;
        if (!selectedValue) {
            showNotification('Please select a food item first', 'warning');
            return;
        }
        
        // Get date and meal type
        const mealDate = document.getElementById('dbMealDate').value || new Date().toISOString().split('T')[0];
        const mealType = document.getElementById('dbMealType').value;
        
        const itemData = JSON.parse(selectedValue);
        const qty = parseFloat(document.getElementById('ingredientQty').value) || 0;
        if (qty <= 0) {
            showNotification('Please enter a valid quantity', 'warning');
            return;
        }
        
        const selectedUnit = document.getElementById('ingredientUnit').value;
        const foodText = document.getElementById('ingredient').options[document.getElementById('ingredient').selectedIndex].text;
        const foodName = foodText.split('(')[0].trim();
        
        // Calculate adjusted calories based on unit conversion
        const baseUnit = itemData.unit || '100g';
        const baseMultiplier = baseUnit === "100g" ? 100 : 
                              (baseUnit === "cup" ? 1 : 
                              (baseUnit === "oz" ? 1 : 
                              (baseUnit === "tbsp" ? 1 : 
                              (baseUnit === "tsp" ? 1 : 1))));
        
        const caloriesPerUnit = itemData.calories / baseMultiplier;
        const multiplier = unitMultipliers[selectedUnit] * (baseUnit === "100g" ? 100 : 1);
        const adjustedCalories = Math.round(caloriesPerUnit * qty * multiplier);
        
        // Create a descriptive item with source indicator
        const sourceIndicator = itemData.source === 'api' ? ' 🌐' : '';
        const itemName = `${qty} ${selectedUnit} ${foodName}${sourceIndicator}`;
        
        // Add to meal with full nutrition data if available
        const mealItem = { 
            name: itemName, 
            calories: adjustedCalories,
            source: itemData.source,
            type: mealType
        };
        
        // If we have nutrition data, include it
        if (itemData.nutrients) {
            const nutrientMultiplier = qty * multiplier / baseMultiplier;
            mealItem.nutrients = {
                protein: Math.round(itemData.nutrients.protein * nutrientMultiplier * 10) / 10,
                carbs: Math.round(itemData.nutrients.carbs * nutrientMultiplier * 10) / 10,
                fat: Math.round(itemData.nutrients.fat * nutrientMultiplier * 10) / 10,
                fiber: Math.round(itemData.nutrients.fiber * nutrientMultiplier * 10) / 10
            };
        }
        
        mealIngredients.push(mealItem);
        mealTotalCalories += adjustedCalories;
        updateMealDisplay();
        
        // Save directly to calendar if we're not batch adding to a meal
        if (!inCustomMeal) {
            // Create calendar item that includes all nutritional data
            const calendarItem = {
                text: itemName,
                calories: adjustedCalories,
                type: mealType
            };
            
            // Add nutrient data if available
            if (mealItem.nutrients) {
                calendarItem.protein = mealItem.nutrients.protein;
                calendarItem.carbs = mealItem.nutrients.carbs;
                calendarItem.fat = mealItem.nutrients.fat;
            }
            
            // Use existing calendar functions to save the food directly
            saveToCalendarWithDate(mealDate, calendarItem);
            showNotification(`Added to ${mealType} on ${mealDate}`, 'success');
        }
        
        // Show success notification
        showNotification(`Added ${foodName} to meal`, 'success');
    } catch (error) {
        console.error('Error adding ingredient:', error);
        showNotification('Error adding ingredient', 'error');
    }
});

document.getElementById('removeIngredient').addEventListener('click', function() {
    if (mealIngredients.length > 0) {
        const lastIng = mealIngredients.pop();
        mealTotalCalories -= lastIng.calories;
        updateMealDisplay();
    }
});

// Set inCustomMeal flag when user starts building a meal
document.getElementById('mealName').addEventListener('focus', function() {
    inCustomMeal = true;
});

document.getElementById('saveMealForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const mealDate = document.getElementById('saveMealDate').value || new Date().toISOString().split('T')[0]; // Default to today if not selected
    const mealType = document.getElementById('mealType').value;
    const mealName = document.getElementById('mealName').value;
    
    // Use the macros calculated in updateMealDisplay if available
    const macros = window.currentMealMacros || {
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
    };
    
    // If we don't have macros from updateMealDisplay, calculate them
    if (!window.currentMealMacros) {
        // Sum up macros from all ingredients
        mealIngredients.forEach(ingredient => {
            if (ingredient.nutrients) {
                macros.protein += parseFloat(ingredient.nutrients.protein) || 0;
                macros.carbs += parseFloat(ingredient.nutrients.carbs) || 0;
                macros.fat += parseFloat(ingredient.nutrients.fat) || 0;
                macros.fiber += parseFloat(ingredient.nutrients.fiber) || 0;
            }
        });
        
        // Round the values for display
        Object.keys(macros).forEach(key => {
            macros[key] = Math.round(macros[key]);
        });
    }
    
    // Create a meal description that's not too long
    let mealDescription;
    if (mealIngredients.length <= 3) {
        mealDescription = `${mealName} (${mealIngredients.map(i => i.name.split(' ')[0]).join(', ')})`;
    } else {
        const firstThree = mealIngredients.slice(0, 3).map(i => i.name.split(' ')[0]).join(', ');
        mealDescription = `${mealName} (${firstThree} & ${mealIngredients.length - 3} more)`;
    }
    
    // Add to planner using date
    addToPlanner(
        mealDate, 
        mealDescription, 
        mealTotalCalories, 
        true, 
        mealType,
        macros
    );
    
    // Show success notification
    showNotification(`Added ${mealName} to ${mealType}`, 'success');
    
    // Reset the meal builder
    mealIngredients = [];
    mealTotalCalories = 0;
    window.currentMealMacros = null;
    inCustomMeal = false; // Reset flag
    updateMealDisplay();
    this.reset();
});

document.getElementById('addExercise').addEventListener('click', function() {
    saveToStorage();
    window.location.href = `exercise.html?bmr=${bmr}&dailyGoal=${dailyGoal}&weight=${currentWeight}&goal=${goalWeight}&tdee=${tdee}&time=${timeWeeks}`;
});

// Helper Functions
function addToPlanner(dateOrDayIndex, itemText, calories, isFood = true, mealType = null, macros = null) {
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
    }
    
    if (isFood) {
        weeklyCalories[dayIndex] = (parseFloat(weeklyCalories[dayIndex]) || 0) + calories;
        
        // Add more nutrition data if available
        const foodItem = { 
            text: itemText, 
            cal: calories, 
            calories: calories, // Add explicit calories property for calendar view
            type: mealType 
        };
        
        // Add macros if available
        if (macros) {
            foodItem.protein = macros.protein || 0;
            foodItem.carbs = macros.carbs || 0;
            foodItem.fat = macros.fat || 0;
        }
        
        weeklyFoods[dayIndex].push(foodItem);
        
        // Save to calendar data format as well (YYYY-MM-DD)
        if (dateStr) {
            // Save directly using the date string
            saveToCalendarWithDate(dateStr, foodItem);
        } else {
            // Convert day index to date
            saveToCalendar(dayIndex, foodItem);
        }
    } else {
        weeklyExercise[dayIndex] = (parseFloat(weeklyExercise[dayIndex]) || 0) + calories;
        const exerciseItem = { 
            text: itemText, 
            cal: -calories, 
            calories: calories, // For calendar view
            type: 'exercise' 
        };
        weeklyFoods[dayIndex].push(exerciseItem);
        
        // Save exercise to calendar data
        if (dateStr) {
            saveExerciseToCalendarWithDate(dateStr, exerciseItem);
        } else {
            saveExerciseToCalendar(dayIndex, exerciseItem);
        }
    }
    
    console.log('After addToPlanner:', { dayIndex, itemText, calories, weeklyCalories, weeklyExercise });
    updatePlanner();
    saveToStorage();
}

function updateMealDisplay() {
    const list = document.getElementById('mealIngredients');
    if (!list) return;
    
    // Clear the list
    list.innerHTML = '';
    
    // Calculate total nutrition values
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    
    // Add each ingredient with expanded details
    mealIngredients.forEach((item, index) => {
        const listItem = document.createElement('li');
        
        // Create main text
        const itemText = document.createElement('div');
        itemText.className = 'item-text';
        itemText.textContent = item.name;
        
        // Create details section
        const itemDetails = document.createElement('div');
        itemDetails.className = 'item-details';
        
        // Add calories
        const caloriesInfo = document.createElement('span');
        caloriesInfo.className = 'calories-info';
        caloriesInfo.textContent = `${item.calories} kcal`;
        itemDetails.appendChild(caloriesInfo);
        
        // Add nutrition info if available
        if (item.nutrients) {
            // Make sure values are valid numbers
            const protein = parseFloat(item.nutrients.protein) || 0;
            const carbs = parseFloat(item.nutrients.carbs) || 0;
            const fat = parseFloat(item.nutrients.fat) || 0;
            const fiber = parseFloat(item.nutrients.fiber) || 0;
            
            totalProtein += protein;
            totalCarbs += carbs;
            totalFat += fat;
            totalFiber += fiber;
            
            const nutrientInfo = document.createElement('span');
            nutrientInfo.className = 'nutrient-info-inline';
            nutrientInfo.textContent = `(P: ${protein.toFixed(1)}g · C: ${carbs.toFixed(1)}g · F: ${fat.toFixed(1)}g)`;
            itemDetails.appendChild(nutrientInfo);
        } else {
            // If no nutrients data, estimate based on calories
            const estimatedProtein = Math.round(item.calories * 0.25 / 4); // 25% of calories from protein
            const estimatedCarbs = Math.round(item.calories * 0.5 / 4);    // 50% of calories from carbs
            const estimatedFat = Math.round(item.calories * 0.25 / 9);     // 25% of calories from fat
            const estimatedFiber = Math.round(item.calories * 0.05 / 2);   // ~5% estimate
            
            // Create nutrient data if it doesn't exist
            item.nutrients = {
                protein: estimatedProtein,
                carbs: estimatedCarbs,
                fat: estimatedFat,
                fiber: estimatedFiber
            };
            
            totalProtein += estimatedProtein;
            totalCarbs += estimatedCarbs;
            totalFat += estimatedFat;
            totalFiber += estimatedFiber;
            
            const nutrientInfo = document.createElement('span');
            nutrientInfo.className = 'nutrient-info-inline';
            nutrientInfo.textContent = `(P: ${estimatedProtein}g · C: ${estimatedCarbs}g · F: ${estimatedFat}g)`;
            nutrientInfo.title = 'Estimated macros based on calories';
            itemDetails.appendChild(nutrientInfo);
        }
        
        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-ingredient-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', function() {
            mealTotalCalories -= item.calories;
            mealIngredients.splice(index, 1);
            updateMealDisplay();
        });
        
        // Assemble item
        listItem.appendChild(itemText);
        listItem.appendChild(itemDetails);
        listItem.appendChild(removeBtn);
        list.appendChild(listItem);
    });
    
    // Update totals display
    document.getElementById('mealCalories').textContent = mealTotalCalories;
    document.getElementById('mealKj').textContent = Math.round(mealTotalCalories * kcalToKj);
    
    // Create global variable to track macros for the meal
    window.currentMealMacros = {
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fat: Math.round(totalFat),
        fiber: Math.round(totalFiber)
    };
    
    // If we have nutrition summaries, show them
    if (totalProtein > 0 || totalCarbs > 0 || totalFat > 0) {
        let nutritionSummary = document.getElementById('mealNutritionSummary');
        if (!nutritionSummary) {
            nutritionSummary = document.createElement('div');
            nutritionSummary.id = 'mealNutritionSummary';
            nutritionSummary.className = 'meal-nutrition-summary';
            const totalContainer = document.querySelector('.meal-total');
            if (totalContainer) {
                totalContainer.appendChild(nutritionSummary);
            }
        }
        
        nutritionSummary.innerHTML = `
            <div class="summary-macros">
                <span class="macro protein">Protein: ${totalProtein.toFixed(1)}g</span>
                <span class="macro carbs">Carbs: ${totalCarbs.toFixed(1)}g</span>
                <span class="macro fat">Fat: ${totalFat.toFixed(1)}g</span>
                <span class="macro fiber">Fiber: ${totalFiber.toFixed(1)}g</span>
            </div>
            <div class="macro-percentages">
                <div class="macro-bar">
                    <div class="protein-bar" style="width: ${calculateMacroPercentage(totalProtein, totalCarbs, totalFat, 'protein')}%"></div>
                    <div class="carbs-bar" style="width: ${calculateMacroPercentage(totalProtein, totalCarbs, totalFat, 'carbs')}%"></div>
                    <div class="fat-bar" style="width: ${calculateMacroPercentage(totalProtein, totalCarbs, totalFat, 'fat')}%"></div>
                </div>
            </div>
        `;
    }
}

// Calculate macro percentages for the progress bar
function calculateMacroPercentage(protein, carbs, fat, macroType) {
    const proteinCalories = protein * 4;
    const carbsCalories = carbs * 4;
    const fatCalories = fat * 9;
    const totalCalories = proteinCalories + carbsCalories + fatCalories;
    
    if (totalCalories === 0) return 0;
    
    switch (macroType) {
        case 'protein':
            return Math.round((proteinCalories / totalCalories) * 100);
        case 'carbs':
            return Math.round((carbsCalories / totalCalories) * 100);
        case 'fat':
            return Math.round((fatCalories / totalCalories) * 100);
        default:
            return 0;
    }
}

function updatePlanner() {
    try {
        const plannerBody = document.getElementById('plannerBody');
        if (!plannerBody) {
            console.error('Planner body element not found');
            return;
        }
        
        const rows = plannerBody.getElementsByTagName('tr');
        if (!rows || rows.length !== 7) {
            console.error('Expected 7 rows in planner, found', rows ? rows.length : 0);
            return;
        }
        
        let weeklyTotal = 0;
        let weeklyExerciseTotal = 0;
        const dailyGoalValue = parseFloat(dailyGoal) || 2000; // Use dailyGoal with fallback

        for (let i = 0; i < 7; i++) {
            const totalIntake = parseFloat(weeklyCalories[i]) || 0;
            const exerciseBurn = parseFloat(weeklyExercise[i]) || 0;
            weeklyTotal += totalIntake;
            weeklyExerciseTotal += exerciseBurn;
            const row = rows[i];
            const breakfastItems = weeklyFoods[i].filter(f => f.type === 'breakfast');
            const lunchItems = weeklyFoods[i].filter(f => f.type === 'lunch');
            const dinnerItems = weeklyFoods[i].filter(f => f.type === 'dinner');
            const snackItems = weeklyFoods[i].filter(f => f.type === 'snack');
            const exerciseItems = weeklyFoods[i].filter(f => f.type === 'exercise');
            row.cells[1].innerHTML = breakfastItems.length > 0 
                ? breakfastItems.map((f, idx) => `<span>${f.text}</span> <button class="remove-btn" onclick="removeItem(${i}, ${idx}, 'breakfast')">Remove</button>`).join('<br>')
                : 'None';
            row.cells[2].innerHTML = lunchItems.length > 0 
                ? lunchItems.map((f, idx) => `<span>${f.text}</span> <button class="remove-btn" onclick="removeItem(${i}, ${idx}, 'lunch')">Remove</button>`).join('<br>')
                : 'None';
            row.cells[3].innerHTML = dinnerItems.length > 0 
                ? dinnerItems.map((f, idx) => `<span>${f.text}</span> <button class="remove-btn" onclick="removeItem(${i}, ${idx}, 'dinner')">Remove</button>`).join('<br>')
                : 'None';
            row.cells[4].innerHTML = snackItems.length > 0 
                ? snackItems.map((f, idx) => `<span>${f.text}</span> <button class="remove-btn" onclick="removeItem(${i}, ${idx}, 'snack')">Remove</button>`).join('<br>')
                : 'None';
            row.cells[5].innerHTML = exerciseItems.length > 0 
                ? exerciseItems.map((f, idx) => `<span>${f.text}</span> <button class="remove-btn" onclick="removeItem(${i}, ${idx}, 'exercise')">Remove</button>`).join('<br>')
                : 'None';
            row.cells[6].textContent = `${totalIntake} kcal (${Math.round(totalIntake * kcalToKj)} kJ)`;
            row.cells[7].textContent = `${exerciseBurn} kcal (${Math.round(exerciseBurn * kcalToKj)} kJ)`;
            const netCalories = totalIntake - exerciseBurn;
            row.cells[8].textContent = `${netCalories} kcal (${Math.round(netCalories * kcalToKj)} kJ)`;
            const remaining = dailyGoalValue - totalIntake + exerciseBurn;
            row.cells[9].textContent = `${remaining} kcal (${Math.round(remaining * kcalToKj)} kJ)`;
            row.cells[9].className = remaining >= 0 ? 'green' : 'red';
        }
        document.getElementById('weeklyTotal').textContent = weeklyTotal;
        document.getElementById('weeklyTotalKj').textContent = Math.round(weeklyTotal * kcalToKj);
        document.getElementById('weeklyExercise').textContent = weeklyExerciseTotal;
        document.getElementById('weeklyExerciseKj').textContent = Math.round(weeklyExerciseTotal * kcalToKj);
        const weeklyGoal = dailyGoalValue * 7;
        const weeklyOutcome = weeklyGoal - (weeklyTotal - weeklyExerciseTotal);
        document.getElementById('weeklyOutcome').textContent = weeklyOutcome >= 0 
            ? `Deficit: ${Math.round(weeklyOutcome)} kcal (${Math.round(weeklyOutcome * kcalToKj)} kJ)` 
            : `Surplus: ${Math.abs(Math.round(weeklyOutcome))} kcal (${Math.abs(Math.round(weeklyOutcome * kcalToKj))} kJ)`;
        document.getElementById('weeklyOutcome').className = weeklyOutcome >= 0 ? 'green' : 'red';
        const weeklyDeficit = weeklyExerciseTotal + (tdee * 7 - weeklyTotal);
        const weightLostKg = weeklyDeficit > 0 ? weeklyDeficit / 7700 : 0;
        document.getElementById('weightLost').textContent = weightLostKg.toFixed(2);
        document.getElementById('weightLostLb').textContent = (weightLostKg * kgToLb).toFixed(2);
        let weeksToGoal = "N/A";
        if (weightLostKg > 0 && currentWeight > goalWeight) {
            weeksToGoal = ((currentWeight - goalWeight) / weightLostKg).toFixed(1);
            // Sanity check for ridiculous numbers
            if (weeksToGoal > 1000 || weeksToGoal < 0) weeksToGoal = "N/A";
        }
        document.getElementById('timeToGoal').textContent = weeksToGoal;
    } catch (error) {
        console.error('Error in updatePlanner:', error);
    }
}

function saveToStorage() {
    localStorage.setItem(`${userKey}_calories`, JSON.stringify(weeklyCalories));
    localStorage.setItem(`${userKey}_exercise`, JSON.stringify(weeklyExercise));
    localStorage.setItem(`${userKey}_foods`, JSON.stringify(weeklyFoods));
}

/**
 * Save food data to calendar format (by day of month)
 * @param {number} dayIndex - Day index (0-6 for Monday-Sunday)
 * @param {Object} foodItem - Food item data with calories and nutrition
 */
function saveToCalendarWithDate(dateStr, foodItem) {
    try {
        // Parse the date string to get year-month and day
        const [yearMonth, day] = [dateStr.substring(0, 7), dateStr.substring(8, 10)];
        
        // Create storage key for this month's foods
        const foodsKey = `foods_${currentUser.email}_${yearMonth}`;
        
        // Get existing foods for this month or initialize
        const monthFoods = getFromStorage(foodsKey, {});
        
        // Get foods for this day or initialize
        if (!monthFoods[day]) {
            monthFoods[day] = {};
        }
        
        // Get meals for this type or initialize
        const mealType = foodItem.type || 'other';
        if (!monthFoods[day][mealType]) {
            monthFoods[day][mealType] = [];
        }
        
        // Add the food to the appropriate meal list
        const foodEntry = {
            name: foodItem.text,
            calories: foodItem.calories || foodItem.cal,
            protein: foodItem.protein || 0,
            carbs: foodItem.carbs || 0,
            fat: foodItem.fat || 0
        };
        
        monthFoods[day][mealType].push(foodEntry);
        
        // Save back to localStorage
        saveToStorage(foodsKey, monthFoods);
        
        console.log(`Food saved to calendar: ${yearMonth}-${day}, ${mealType}`, foodEntry);
    } catch (error) {
        console.error('Error saving food to calendar:', error);
    }
}

function saveToCalendar(dayIndex, foodItem) {
    try {
        // Get the date for the specified day index relative to the current week
        const currentDate = new Date();
        const today = currentDate.getDay(); // 0-6 (Sunday-Saturday)
        
        // Convert from Monday-Sunday (0-6) to Sunday-Saturday (0-6) indexing
        const dayDiff = dayIndex + 1 - (today === 0 ? 7 : today);
        
        // Create date for the target day
        const targetDate = new Date(currentDate);
        targetDate.setDate(currentDate.getDate() + dayDiff);
        
        // Get date string in YYYY-MM-DD format
        const dateStr = targetDate.toISOString().split('T')[0];
        
        // Use the direct date function
        saveToCalendarWithDate(dateStr, foodItem);
    } catch (error) {
        console.error('Error saving food to calendar:', error);
    }
}

/**
 * Save exercise data to calendar format
 * @param {number} dayIndex - Day index (0-6 for Monday-Sunday)
 * @param {Object} exerciseItem - Exercise item data
 */
function saveExerciseToCalendarWithDate(dateStr, exerciseItem) {
    try {
        // Parse the date string to get year-month and day
        const [yearMonth, day] = [dateStr.substring(0, 7), dateStr.substring(8, 10)];
        
        // Create storage key for this month's exercises
        const exerciseKey = `exercise_${currentUser.email}_${yearMonth}`;
        
        // Get existing exercises for this month or initialize
        const monthExercise = getFromStorage(exerciseKey, {});
        
        // Get exercises for this day or initialize
        if (!monthExercise[day]) {
            monthExercise[day] = [];
        }
        
        // Create exercise entry
        const exerciseName = exerciseItem.text.replace(' (calories burned)', '').trim();
        const exerciseEntry = {
            name: exerciseName,
            calories: exerciseItem.calories || Math.abs(exerciseItem.cal) || 0,
            duration: parseInt(exerciseItem.duration) || 30 // Default duration if not specified
        };
        
        // Add to day's exercises
        monthExercise[day].push(exerciseEntry);
        
        // Save back to localStorage
        saveToStorage(exerciseKey, monthExercise);
        
        console.log(`Exercise saved to calendar: ${yearMonth}-${day}`, exerciseEntry);
    } catch (error) {
        console.error('Error saving exercise to calendar:', error);
    }
}

function saveExerciseToCalendar(dayIndex, exerciseItem) {
    try {
        // Similar date calculation as saveToCalendar
        const currentDate = new Date();
        const today = currentDate.getDay(); // 0-6 (Sunday-Saturday)
        const dayDiff = dayIndex + 1 - (today === 0 ? 7 : today);
        const targetDate = new Date(currentDate);
        targetDate.setDate(currentDate.getDate() + dayDiff);
        
        // Get date string in YYYY-MM-DD format
        const dateStr = targetDate.toISOString().split('T')[0];
        
        // Use the direct date function
        saveExerciseToCalendarWithDate(dateStr, exerciseItem);
    } catch (error) {
        console.error('Error saving exercise to calendar:', error);
    }
}

function removeItem(dayIndex, itemIndex, type) {
    const dayItems = weeklyFoods[dayIndex];
    const filteredItems = dayItems.filter(f => f.type === type);
    if (itemIndex < 0 || itemIndex >= filteredItems.length) {
        console.error('Invalid itemIndex:', itemIndex, 'for type:', type, 'in day:', dayIndex);
        return;
    }
    const item = filteredItems[itemIndex];
    const globalIndex = dayItems.indexOf(item);
    if (globalIndex === -1) {
        console.error('Item not found in dayItems at day:', dayIndex, 'item:', item);
        return;
    }
    if (type === 'exercise') {
        weeklyExercise[dayIndex] = Math.max(0, (parseFloat(weeklyExercise[dayIndex]) || 0) - Math.abs(item.cal));
    } else {
        weeklyCalories[dayIndex] = Math.max(0, (parseFloat(weeklyCalories[dayIndex]) || 0) - item.cal);
    }
    weeklyFoods[dayIndex].splice(globalIndex, 1);
    console.log('After removeItem:', { dayIndex, type, weeklyCalories, weeklyExercise });
    updatePlanner();
    saveToStorage();
}

document.getElementById('exportPlan').addEventListener('click', function() {
    const exportWindow = window.open('', '_blank');
    exportWindow.document.write(`
        <html>
        <head>
            <title>SlimEasy Meal Plan</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2ecc71; text-align: center; }
                h2 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background: #2ecc71; color: white; }
                .green { color: green; }
                .red { color: red; }
            </style>
        </head>
        <body>
            <h1>SlimEasy Meal Plan</h1>
            <h2>Your Goals</h2>
            <p>Current Weight: ${weightDisplay}</p>
            <p>Goal Weight: ${goalWeightDisplay}</p>
            <p>Weeks to Goal: ${timeWeeks.toFixed(2)}</p>
            <p>BMR: ${bmr} kcal (${Math.round(bmr * kcalToKj)} kJ)</p>
            <p>TDEE: ${tdee} kcal (${Math.round(tdee * kcalToKj)} kJ)</p>
            <p>Daily Deficit: ${Math.round(dailyDeficit)} kcal (${Math.round(dailyDeficit * kcalToKj)} kJ)</p>
            <p>Daily Goal: ${dailyGoal} kcal (${Math.round(dailyGoal * kcalToKj)} kJ)</p>
            <h2>Weekly Meal Plan</h2>
            <table>
                <tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th><th>Snack</th><th>Exercises</th><th>Total Intake</th><th>Exercise Burn</th><th>Net Calories</th><th>Remaining Goal</th></tr>
                ${weeklyFoods.map((day, i) => `
                    <tr>
                        <td>${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i]}</td>
                        <td>${day.filter(f => f.type === 'breakfast').map(f => f.text).join(', ') || 'None'}</td>
                        <td>${day.filter(f => f.type === 'lunch').map(f => f.text).join(', ') || 'None'}</td>
                        <td>${day.filter(f => f.type === 'dinner').map(f => f.text).join(', ') || 'None'}</td>
                        <td>${day.filter(f => f.type === 'snack').map(f => f.text).join(', ') || 'None'}</td>
                        <td>${day.filter(f => f.type === 'exercise').map(f => f.text).join(', ') || 'None'}</td>
                        <td>${weeklyCalories[i]} kcal (${Math.round(weeklyCalories[i] * kcalToKj)} kJ)</td>
                        <td>${weeklyExercise[i]} kcal (${Math.round(weeklyExercise[i] * kcalToKj)} kJ)</td>
                        <td>${weeklyCalories[i] - weeklyExercise[i]} kcal (${Math.round((weeklyCalories[i] - weeklyExercise[i]) * kcalToKj)} kJ)</td>
                        <td class="${(dailyGoal - weeklyCalories[i] + weeklyExercise[i]) >= 0 ? 'green' : 'red'}">${dailyGoal - weeklyCalories[i] + weeklyExercise[i]} kcal (${Math.round((dailyGoal - weeklyCalories[i] + weeklyExercise[i]) * kcalToKj)} kJ)</td>
                    </tr>
                `).join('')}
            </table>
            <h2>Weekly Summary</h2>
            <p>Total Weekly Intake: ${weeklyCalories.reduce((a, b) => a + b, 0)} kcal (${Math.round(weeklyCalories.reduce((a, b) => a + b, 0) * kcalToKj)} kJ)</p>
            <p>Total Weekly Exercise Burn: ${weeklyExercise.reduce((a, b) => a + b, 0)} kcal (${Math.round(weeklyExercise.reduce((a, b) => a + b, 0) * kcalToKj)} kJ)</p>
            <p>Weekly Outcome: ${document.getElementById('weeklyOutcome').textContent}</p>
            <p>Estimated Weight Lost: ${document.getElementById('weightLost').textContent} kg (${document.getElementById('weightLostLb').textContent} lb)</p>
            <p>Estimated Time to Goal: ${document.getElementById('timeToGoal').textContent} weeks</p>
        </body>
        </html>
    `);
    exportWindow.document.close();
});

// Initialize daily tips
function loadDailyTip() {
    const tips = [
        "Stay consistent with your tracking. Research shows that people who log their food regularly lose more weight and keep it off longer.",
        "Don't forget to drink water! Often thirst can be mistaken for hunger.",
        "Focus on progress, not perfection. Small, consistent changes lead to lasting results.",
        "Include protein with each meal to help you feel fuller longer.",
        "Plan your meals ahead of time to avoid last-minute unhealthy choices.",
        "Get enough sleep! Poor sleep is linked to increased appetite and cravings.",
        "A 10-minute walk after meals can help digestion and stabilize blood sugar.",
        "Eating slowly and mindfully helps you recognize when you're full.",
        "Focus on nutrient-dense foods rather than just calorie counting.",
        "Celebrate non-scale victories like increased energy and better-fitting clothes.",
        "Incorporate strength training to boost your metabolism.",
        "Remember that weight fluctuates naturally day to day.",
        "Prepping healthy snacks can help you avoid vending machines and drive-thrus.",
        "Find physical activities you enjoy rather than exercises you dread."
    ];
    
    // Get date-based index to keep the tip consistent for the whole day
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (24 * 60 * 60 * 1000));
    const tipIndex = dayOfYear % tips.length;
    
    const dailyTipElement = document.getElementById('dailyTip');
    if (dailyTipElement) {
        dailyTipElement.textContent = tips[tipIndex];
    }
}

// Initialize week selector
let currentWeekStart = getStartOfWeek(new Date());
let copiedWeekData = null;

function getStartOfWeek(date) {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
    return new Date(date.setDate(diff));
}

function formatWeekRange(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    const options = { month: 'short', day: 'numeric' };
    const startFormatted = startDate.toLocaleDateString('en-US', options);
    const endFormatted = endDate.toLocaleDateString('en-US', options);
    const yearFormatted = startDate.getFullYear();
    
    return `${startFormatted} - ${endFormatted}, ${yearFormatted}`;
}

function initializeWeekSelector() {
    const datePicker = document.getElementById('weekStartDate');
    const weekLabel = document.getElementById('weekLabel');
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    const copyWeekBtn = document.getElementById('copyWeek');
    const pasteWeekBtn = document.getElementById('pasteWeek');
    
    if (!datePicker || !weekLabel) return;
    
    // Set initial date and label
    const formattedDate = currentWeekStart.toISOString().split('T')[0];
    datePicker.value = formattedDate;
    weekLabel.textContent = formatWeekRange(currentWeekStart);
    
    // Previous week button
    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', function() {
            const newDate = new Date(currentWeekStart);
            newDate.setDate(newDate.getDate() - 7);
            changeWeek(newDate);
        });
    }
    
    // Next week button
    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', function() {
            const newDate = new Date(currentWeekStart);
            newDate.setDate(newDate.getDate() + 7);
            changeWeek(newDate);
        });
    }
    
    // Date picker change
    datePicker.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        changeWeek(getStartOfWeek(selectedDate));
    });
    
    // Copy week functionality
    if (copyWeekBtn) {
        copyWeekBtn.addEventListener('click', function() {
            copyCurrentWeek();
        });
    }
    
    // Paste week functionality
    if (pasteWeekBtn) {
        pasteWeekBtn.addEventListener('click', function() {
            pasteWeekToCurrentWeek();
        });
    }
}

function changeWeek(newStartDate) {
    // Update global current week
    currentWeekStart = newStartDate;
    
    // Update UI
    const datePicker = document.getElementById('weekStartDate');
    const weekLabel = document.getElementById('weekLabel');
    
    if (datePicker) {
        datePicker.value = currentWeekStart.toISOString().split('T')[0];
    }
    
    if (weekLabel) {
        weekLabel.textContent = formatWeekRange(currentWeekStart);
    }
    
    // Load data for the selected week
    loadWeekData(currentWeekStart);
}

function getWeekKey(date) {
    return date.toISOString().split('T')[0].substring(0, 10); // YYYY-MM-DD format
}

function loadWeekData(weekStart) {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return;
    
    const weekKey = getWeekKey(weekStart);
    const userKey = `planner_${currentUser.email}`;
    const weekStorageKey = `${userKey}_week_${weekKey}`;
    
    // Try to load saved data for this specific week
    let weekData = getFromStorage(weekStorageKey);
    
    if (weekData) {
        // We have data for this week, use it
        weeklyCalories = weekData.calories || [0, 0, 0, 0, 0, 0, 0];
        weeklyExercise = weekData.exercise || [0, 0, 0, 0, 0, 0, 0];
        weeklyFoods = weekData.foods || [[], [], [], [], [], [], []];
    } else {
        // For current week, use current data
        const today = new Date();
        const todayWeekStart = getStartOfWeek(today);
        
        if (weekStart.getTime() === todayWeekStart.getTime()) {
            // This is the current week, use regular keys
            weeklyCalories = getFromStorage(`${userKey}_calories`) || [0, 0, 0, 0, 0, 0, 0];
            weeklyExercise = getFromStorage(`${userKey}_exercise`) || [0, 0, 0, 0, 0, 0, 0];
            weeklyFoods = getFromStorage(`${userKey}_foods`) || [[], [], [], [], [], [], []];
        } else {
            // This is a different week, initialize with empty data
            weeklyCalories = [0, 0, 0, 0, 0, 0, 0];
            weeklyExercise = [0, 0, 0, 0, 0, 0, 0];
            weeklyFoods = [[], [], [], [], [], [], []];
        }
    }
    
    // Update the planner display
    updatePlanner();
}

function saveWeekData() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return;
    
    const weekKey = getWeekKey(currentWeekStart);
    const userKey = `planner_${currentUser.email}`;
    const weekStorageKey = `${userKey}_week_${weekKey}`;
    
    // Create week data object
    const weekData = {
        calories: weeklyCalories,
        exercise: weeklyExercise,
        foods: weeklyFoods,
        lastUpdated: new Date().toISOString()
    };
    
    // Save to localStorage
    saveToStorage(weekStorageKey, weekData);
    
    // If this is the current week, update regular keys too
    const today = new Date();
    const todayWeekStart = getStartOfWeek(today);
    
    if (currentWeekStart.getTime() === todayWeekStart.getTime()) {
        saveToStorage(`${userKey}_calories`, weeklyCalories);
        saveToStorage(`${userKey}_exercise`, weeklyExercise);
        saveToStorage(`${userKey}_foods`, weeklyFoods);
    }
}

function copyCurrentWeek() {
    // Store the current week's data in our variable
    copiedWeekData = {
        calories: [...weeklyCalories],
        exercise: [...weeklyExercise],
        foods: JSON.parse(JSON.stringify(weeklyFoods)) // Deep copy
    };
    
    // Show paste button
    const pasteWeekBtn = document.getElementById('pasteWeek');
    if (pasteWeekBtn) {
        pasteWeekBtn.style.display = 'inline-block';
    }
    
    // Show notification
    showNotification('Week copied! Select another week to paste.', 'success');
}

function pasteWeekToCurrentWeek() {
    if (!copiedWeekData) {
        showNotification('No week data to paste!', 'error');
        return;
    }
    
    // Confirm before overwriting
    if (!confirm('This will overwrite the current week\'s data. Continue?')) {
        return;
    }
    
    // Copy data from our stored week
    weeklyCalories = [...copiedWeekData.calories];
    weeklyExercise = [...copiedWeekData.exercise];
    weeklyFoods = JSON.parse(JSON.stringify(copiedWeekData.foods)); // Deep copy
    
    // Update display
    updatePlanner();
    
    // Save changes
    saveWeekData();
    
    // Show notification
    showNotification('Week data pasted successfully!', 'success');
}

// Extended saveToStorage function to save current week data
function saveToStorage() {
    // Save regular keys
    localStorage.setItem(`${userKey}_calories`, JSON.stringify(weeklyCalories));
    localStorage.setItem(`${userKey}_exercise`, JSON.stringify(weeklyExercise));
    localStorage.setItem(`${userKey}_foods`, JSON.stringify(weeklyFoods));
    
    // Also save to week-specific storage
    saveWeekData();
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', function() {
    // Create quick add buttons
    createQuickAddButtons();
    
    // Load daily tip
    loadDailyTip();
    
    // Initialize week selector
    initializeWeekSelector();
    
    // Update planner with initial week
    loadWeekData(currentWeekStart);
});

// Make functions accessible to window
window.removeItem = removeItem;
window.loadDailyTip = loadDailyTip;
window.changeWeek = changeWeek;
window.copyCurrentWeek = copyCurrentWeek;
window.pasteWeekToCurrentWeek = pasteWeekToCurrentWeek;

/**
 * Load user profile data and initialize tracker
 * @param {Object} currentUser - Current user data
 */
function loadUserProfile(currentUser) {
    // Get profile data
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    
    if (!profile) {
        window.location.href = 'index.html'; // Redirect to profile if no data
        return;
    }
    
    // Get or parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // If no URL parameters, redirect with profile data
    if (urlParams.toString() === '') {
        const params = new URLSearchParams({
            bmr: profile.bmr || 0,
            tdee: profile.tdee || 0,
            weight: profile.weight || 0,
            goalWeight: profile.goalWeight || 0,
            timeToGoal: profile.timeToGoal || 0,
            dailyDeficit: profile.dailyDeficit || 0,
            goalCalories: profile.dailyGoal || 0,
            timeUnit: profile.timeUnit || 'weeks'
        });
        window.location.href = `tracker.html?${params.toString()}`;
        return;
    }
    
    // Initialize components
    initializeComponents();
    
    // Initialize gamification features
    updateStreakDisplay();
    
    // Check for profile completion achievement
    checkProfileAchievement(profile);
    
    // Update weight loss achievements
    if (profile.startWeight && profile.weight) {
        const weightLoss = profile.startWeight - profile.weight;
        if (weightLoss > 0) {
            checkWeightLossAchievements(weightLoss);
        }
    }
    
    // Render achievements in the achievements tab
    renderAchievements('achievementsContainer');
}

/**
 * Initialize all tracker page components
 */
function initializeComponents() {
    // Set up tab navigation
    setupTabNavigation();
    
    // Initialize water tracker
    initializeWaterTracker();
    
    // Set up quick add buttons
    createQuickAddButtons();
    
    // Load daily tip
    loadDailyTip();
    
    // Update planner
    updatePlanner();
    
    // Update streak display and gamification elements
    updateStreakDisplay();
}

/**
 * Initialize water tracking functionality with gamification
 */
function initializeWaterTracker() {
    // Get current water count
    const { count, key } = getWaterCount();
    
    // Update the display
    updateWaterDisplay(count);
    
    // Set up add water button
    const addWaterBtn = document.getElementById('addWater');
    if (addWaterBtn) {
        addWaterBtn.addEventListener('click', function() {
            const { count, key } = getWaterCount();
            const newCount = Math.min(count + 1, 8); // Cap at 8 glasses
            localStorage.setItem(key, newCount);
            updateWaterDisplay(newCount);
            
            // Check achievements when user reaches 8 glasses
            if (newCount === 8) {
                checkHydrationAchievements(8, 1); // We'll implement streak tracking later
            }
        });
    }
    
    // Set up remove water button
    const removeWaterBtn = document.getElementById('removeWater');
    if (removeWaterBtn) {
        removeWaterBtn.addEventListener('click', function() {
            const { count, key } = getWaterCount();
            const newCount = Math.max(count - 1, 0); // Don't go below 0
            localStorage.setItem(key, newCount);
            updateWaterDisplay(newCount);
        });
    }
}

/**
 * Update water glasses display and progress bar
 * @param {number} count - Number of water glasses consumed
 */
function updateWaterDisplay(count) {
    // Get DOM elements
    const waterGlasses = document.getElementById('waterGlasses');
    const waterProgress = document.getElementById('waterProgress');
    const waterStatus = document.getElementById('waterStatus');
    
    if (!waterGlasses || !waterProgress || !waterStatus) return;
    
    // Clear glasses container
    waterGlasses.innerHTML = '';
    
    // Create 8 glass elements
    for (let i = 0; i < 8; i++) {
        const glass = document.createElement('div');
        glass.className = `water-glass${i < count ? ' filled' : ''}`;
        glass.addEventListener('click', function() {
            // Toggle this specific glass
            const { count: currentCount, key } = getWaterCount();
            const newCount = i < currentCount ? i : i + 1;
            localStorage.setItem(key, newCount);
            updateWaterDisplay(newCount);
            
            // Check achievements when user reaches 8 glasses
            if (newCount === 8) {
                checkHydrationAchievements(8, 1);
            }
        });
        waterGlasses.appendChild(glass);
    }
    
    // Update progress bar
    const progressPercent = Math.min(count / 8 * 100, 100);
    waterProgress.style.width = `${progressPercent}%`;
    
    // Add animation class if goal reached
    if (count === 8) {
        waterProgress.classList.add('goal-complete');
        
        // Show achievement celebration if first time today
        const celebrationKey = `water_celebration_${new Date().toISOString().split('T')[0]}`;
        if (!localStorage.getItem(celebrationKey)) {
            localStorage.setItem(celebrationKey, 'true');
            showNotification('Daily hydration goal achieved! 💧', 'success');
        }
    } else {
        waterProgress.classList.remove('goal-complete');
    }
    
    // Update status text
    waterStatus.textContent = `${count}/8 glasses`;
}

/**
 * Create quick add buttons for common food items
 */
function createQuickAddButtons() {
    const quickAddContainer = document.querySelector('.quick-add');
    if (!quickAddContainer) return;
    
    // Common quick add food items
    const quickItems = [
        { name: 'Apple', calories: 95, icon: 'fa-apple-alt' },
        { name: 'Banana', calories: 105, icon: 'fa-banana' },
        { name: 'Coffee', calories: 5, icon: 'fa-coffee' },
        { name: 'Egg', calories: 70, icon: 'fa-egg' },
        { name: 'Water', calories: 0, icon: 'fa-tint' },
        { name: 'Salad', calories: 25, icon: 'fa-leaf' }
    ];
    
    // Clear container
    quickAddContainer.innerHTML = '';
    
    // Create buttons
    quickItems.forEach(item => {
        const button = document.createElement('button');
        button.className = 'quick-add-btn';
        button.innerHTML = `<i class="fas ${item.icon}"></i> ${item.name}`;
        button.addEventListener('click', function() {
            // Create food item
            const foodItem = {
                text: `${item.name} (Quick Add)`,
                calories: item.calories,
                type: 'snack'
            };
            
            // Get today's date
            const today = new Date().toISOString().split('T')[0];
            
            // Add to food log and planner
            updateFoodLog(foodItem);
            addToPlanner(today, foodItem.text, foodItem.calories, true, foodItem.type);
            
            // Show notification
            showNotification(`Added ${item.name} (${item.calories} kcal)`, 'success');
        });
        
        quickAddContainer.appendChild(button);
    });
}

/**
 * Update the streak display on the tracker page
 */
function updateStreakDisplay() {
    // Get streak data
    const streak = updateStreak('weight');
    
    // Update streak display
    const currentStreakEl = document.getElementById('currentStreak');
    const longestStreakEl = document.getElementById('longestStreak');
    const pointsEl = document.getElementById('achievementPoints');
    
    if (currentStreakEl) {
        currentStreakEl.textContent = `${streak.current} day${streak.current !== 1 ? 's' : ''}`;
    }
    
    if (longestStreakEl) {
        longestStreakEl.textContent = `${streak.longest} day${streak.longest !== 1 ? 's' : ''}`;
    }
    
    // Update achievement points
    const achievements = getUserAchievements();
    if (pointsEl) {
        pointsEl.textContent = achievements.points;
    }
}

/**
 * Update food log and check for streak and achievement updates
 * @param {Object} foodItem - Food item being added
 */
function updateFoodLog(foodItem) {
    // Add food item to log
    const today = new Date().toISOString().split('T')[0];
    const currentUser = getFromStorage('currentUser');
    if (!currentUser || !currentUser.email) return;
    
    // Get or create food log for today
    const foodLogKey = `food_log_${currentUser.email}_${today}`;
    const foodLog = getFromStorage(foodLogKey, []);
    
    // Add new food item to log
    foodLog.push(foodItem);
    
    // Save updated log
    saveToStorage(foodLogKey, foodLog);
    
    // Update streak and check achievements
    updateStreakDisplay();
    
    // Check hydration achievements if all 8 glasses are consumed
    const { count } = getWaterCount();
    if (count >= 8) {
        checkHydrationAchievements(count, 1); // We don't track streak days yet
    }
}

/**
 * Load a daily tip for the user
 */
function loadDailyTip() {
    const tipContainer = document.querySelector('.daily-tip p');
    if (!tipContainer) return;
    
    // Array of health and wellness tips
    const tips = [
        "Aim to drink water before each meal to help with portion control.",
        "Try to include protein in every meal to keep you feeling full longer.",
        "Not all calories are created equal - focus on nutrient-dense foods.",
        "Smaller plates can help control portion sizes and reduce calorie intake.",
        "Get at least 30 minutes of moderate activity most days of the week.",
        "The most successful diet is one you can maintain as a lifestyle.",
        "Aim for 7-9 hours of quality sleep to support weight management.",
        "Keep a food journal to become more aware of your eating habits.",
        "Choose whole foods over processed foods whenever possible.",
        "Don't skip meals - it often leads to overeating later.",
        "Adding more vegetables is an easy way to increase nutrition without many calories.",
        "Mindful eating helps you recognize hunger and fullness cues better.",
        "Balancing your plate with proteins, healthy fats, and complex carbs aids weight management.",
        "Regular weightlifting can boost your metabolism even when you're not exercising.",
        "Remember that sustainable progress is better than quick fixes.",
        "Plan your meals ahead of time to avoid unhealthy impulse eating.",
        "Find physical activities you enjoy - exercise shouldn't feel like punishment!",
        "Keep healthy snacks on hand to avoid reaching for processed options.",
        "Celebrate non-scale victories like improved energy and better sleep.",
        "Your weight can fluctuate 2-4 pounds daily due to water, food, and hormones."
    ];
    
    // Seed the random number generator with today's date
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Simple seeded random number generator
    const seededRandom = function() {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
    
    // Select a tip based on the day
    const tipIndex = Math.floor(seededRandom() * tips.length);
    tipContainer.textContent = tips[tipIndex];
    
    // Add achievement for reading tips - implement later if needed
}

/**
 * Set up tab navigation between sections
 */
function setupTabNavigation() {
    // Tab navigation buttons
    const tabButtons = [
        { id: 'viewSummary', target: 'summary' },
        { id: 'viewManual', target: 'manual' },
        { id: 'viewMealBuilder', target: 'automatic' },
        { id: 'viewPlanner', target: 'planner' },
        { id: 'goToManual', target: 'manual' }
    ];
    
    // Add click handlers to buttons
    tabButtons.forEach(button => {
        const element = document.getElementById(button.id);
        if (element) {
            element.addEventListener('click', () => showTab(button.target));
        }
    });
    
    // Handle button clicks for profile and dashboard
    const backToProfileBtn = document.getElementById('backToProfile');
    if (backToProfileBtn) {
        backToProfileBtn.addEventListener('click', () => window.location.href = 'index.html');
    }
    
    const navDashboard = document.getElementById('navDashboard');
    if (navDashboard) {
        navDashboard.addEventListener('click', () => window.location.href = 'dashboard.html');
    }
    
    // Add Exercise button
    const goToExerciseBtn = document.getElementById('goToExercise');
    if (goToExerciseBtn) {
        goToExerciseBtn.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const currentUser = getFromStorage('currentUser');
            const profileKey = `profile_${currentUser.email}`;
            const profile = getFromStorage(profileKey);
            
            const params = new URLSearchParams({
                bmr: urlParams.get('bmr') || profile.bmr || 0,
                dailyGoal: urlParams.get('goalCalories') || profile.dailyGoal || 0,
                weight: profile.weight || 0,
                goal: profile.goalWeight || 0,
                tdee: urlParams.get('tdee') || profile.tdee || 0,
                time: profile.timeToGoal || 0
            });
            
            window.location.href = `exercise.html?${params.toString()}`;
        });
    }
    
    // Add Export Plan button handler
    const exportPlanBtn = document.getElementById('exportPlan');
    if (exportPlanBtn) {
        exportPlanBtn.addEventListener('click', exportPlan);
    }
}

/**
 * Show the specified tab content
 * @param {string} tabId - ID of the tab to show
 */
function showTab(tabId) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Deactivate all nav buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activate corresponding nav button
    const navSelector = `[id="view${tabId.charAt(0).toUpperCase() + tabId.slice(1)}"]`;
    const activeNavButton = document.querySelector(navSelector);
    if (activeNavButton) {
        activeNavButton.classList.add('active');
    }
}
