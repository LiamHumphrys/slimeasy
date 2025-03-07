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

// Use goalCalories from URL if provided, otherwise calculate
let dailyGoal = goalCalories > 0 ? goalCalories : (tdee - ((currentWeight - goalWeight) * 7700 / (timeWeeks * 7)));
dailyGoal = isNaN(dailyGoal) || !isFinite(dailyGoal) ? tdee : Math.round(dailyGoal); // 1730.7222222222222 → 1731 kcal

// Calculate daily deficit for display
const dailyDeficit = tdee - dailyGoal; // Reflects the actual deficit used

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

// 300 Common Ingredients (full list)
const ingredients = [
    // Meats (25)
    { name: "Chicken Breast (100g)", calories: 165, defaultUnit: "100g" },
    { name: "Chicken Thigh (100g)", calories: 209, defaultUnit: "100g" },
    { name: "Chicken Drumstick (100g)", calories: 172, defaultUnit: "100g" },
    { name: "Turkey Breast (100g)", calories: 135, defaultUnit: "100g" },
    { name: "Turkey Leg (100g)", calories: 208, defaultUnit: "100g" },
    { name: "Beef Steak (100g)", calories: 271, defaultUnit: "100g" },
    { name: "Ground Beef 80/20 (100g)", calories: 254, defaultUnit: "100g" },
    { name: "Beef Ribeye (100g)", calories: 291, defaultUnit: "100g" },
    { name: "Pork Chop (100g)", calories: 231, defaultUnit: "100g" },
    { name: "Pork Belly (100g)", calories: 518, defaultUnit: "100g" },
    { name: "Bacon (1 slice)", calories: 43, defaultUnit: "unit" },
    { name: "Ham (100g)", calories: 145, defaultUnit: "100g" },
    { name: "Lamb Chop (100g)", calories: 294, defaultUnit: "100g" },
    { name: "Sausage (1 link)", calories: 85, defaultUnit: "unit" },
    { name: "Pepperoni (1 oz)", calories: 138, defaultUnit: "oz" },
    { name: "Salmon (100g)", calories: 206, defaultUnit: "100g" },
    { name: "Tuna (100g)", calories: 144, defaultUnit: "100g" },
    { name: "Cod (100g)", calories: 82, defaultUnit: "100g" },
    { name: "Tilapia (100g)", calories: 96, defaultUnit: "100g" },
    { name: "Shrimp (100g)", calories: 99, defaultUnit: "100g" },
    { name: "Crab (100g)", calories: 83, defaultUnit: "100g" },
    { name: "Lobster (100g)", calories: 77, defaultUnit: "100g" },
    { name: "Duck Breast (100g)", calories: 337, defaultUnit: "100g" },
    { name: "Venison (100g)", calories: 158, defaultUnit: "100g" },
    { name: "Bison (100g)", calories: 143, defaultUnit: "100g" },

    // Fruits (25)
    { name: "Apple (1 medium)", calories: 95, defaultUnit: "unit" },
    { name: "Banana (1 medium)", calories: 105, defaultUnit: "unit" },
    { name: "Orange (1 medium)", calories: 62, defaultUnit: "unit" },
    { name: "Strawberries (1 cup)", calories: 49, defaultUnit: "cup" },
    { name: "Blueberries (1 cup)", calories: 83, defaultUnit: "cup" },
    { name: "Raspberries (1 cup)", calories: 64, defaultUnit: "cup" },
    { name: "Blackberries (1 cup)", calories: 62, defaultUnit: "cup" },
    { name: "Grapes (1 cup)", calories: 104, defaultUnit: "cup" },
    { name: "Pineapple (1 cup)", calories: 82, defaultUnit: "cup" },
    { name: "Mango (1 cup)", calories: 99, defaultUnit: "cup" },
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
    { name: "Broccoli (1 cup)", calories: 55, defaultUnit: "cup" },
    { name: "Carrots (1 cup)", calories: 52, defaultUnit: "cup" },
    { name: "Spinach (1 cup)", calories: 7, defaultUnit: "cup" },
    { name: "Kale (1 cup)", calories: 33, defaultUnit: "cup" },
    { name: "Potato (1 medium)", calories: 130, defaultUnit: "unit" },
    { name: "Sweet Potato (1 medium)", calories: 103, defaultUnit: "unit" },
    { name: "Tomato (1 medium)", calories: 22, defaultUnit: "unit" },
    { name: "Cucumber (1 cup)", calories: 16, defaultUnit: "cup" },
    { name: "Bell Pepper (1 medium)", calories: 25, defaultUnit: "unit" },
    { name: "Zucchini (1 cup)", calories: 33, defaultUnit: "cup" },
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

// Populate Ingredient Dropdown
const ingredientSelect = document.getElementById('ingredient');
function populateIngredients(filter = '') {
    ingredientSelect.innerHTML = '';
    const filtered = ingredients.filter(ing => ing.name.toLowerCase().includes(filter.toLowerCase()));
    filtered.forEach(ing => {
        const option = document.createElement('option');
        option.value = JSON.stringify({ calories: ing.calories, unit: ing.defaultUnit });
        option.textContent = `${ing.name} (${ing.calories} kcal / ${Math.round(ing.calories * kcalToKj)} kJ per ${ing.defaultUnit})`;
        ingredientSelect.appendChild(option);
    });
}
populateIngredients();

// Event Listeners
document.getElementById('ingredientSearch').addEventListener('input', function(e) {
    populateIngredients(e.target.value);
});

document.getElementById('manualForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const dayIndex = parseInt(document.getElementById('manualDay').value);
    const mealType = document.getElementById('manualMealType').value;
    const foodName = document.getElementById('manualFoodName').value;
    const amount = parseFloat(document.getElementById('manualAmount').value) || 0;
    const unit = document.getElementById('manualUnit').value;
    const calories = unit === 'kcal' ? amount : Math.round(amount / kcalToKj);
    addToPlanner(dayIndex, `${foodName} (${amount} ${unit})`, calories, true, mealType);
    this.reset();
});

let mealIngredients = [];
let mealTotalCalories = 0;

document.getElementById('addIngredient').addEventListener('click', function() {
    const { calories, unit } = JSON.parse(document.getElementById('ingredient').value);
    const qty = parseFloat(document.getElementById('ingredientQty').value) || 0;
    const selectedUnit = document.getElementById('ingredientUnit').value;
    const baseMultiplier = unit === "100g" ? 100 : (unit === "cup" ? 1 : (unit === "oz" ? 1 : (unit === "tbsp" ? 1 : (unit === "tsp" ? 1 : 1))));
    const caloriesPerUnit = calories / (unit === "100g" ? 100 : baseMultiplier);
    const multiplier = unitMultipliers[selectedUnit] * (unit === "100g" ? 100 : 1);
    const adjustedCalories = Math.round(caloriesPerUnit * qty * multiplier);
    const foodText = document.getElementById('ingredient').options[document.getElementById('ingredient').selectedIndex].text;
    mealIngredients.push({ name: `${qty} ${selectedUnit} ${foodText}`, calories: adjustedCalories });
    mealTotalCalories += adjustedCalories;
    updateMealDisplay();
});

document.getElementById('removeIngredient').addEventListener('click', function() {
    if (mealIngredients.length > 0) {
        const lastIng = mealIngredients.pop();
        mealTotalCalories -= lastIng.calories;
        updateMealDisplay();
    }
});

document.getElementById('saveMealForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const dayIndex = parseInt(document.getElementById('mealDay').value);
    const mealType = document.getElementById('mealType').value;
    const mealName = document.getElementById('mealName').value;
    addToPlanner(dayIndex, `${mealName} (${mealIngredients.map(i => i.name).join(', ')})`, mealTotalCalories, true, mealType);
    mealIngredients = [];
    mealTotalCalories = 0;
    updateMealDisplay();
    this.reset();
});

document.getElementById('addExercise').addEventListener('click', function() {
    saveToStorage();
    window.location.href = `exercise.html?bmr=${bmr}&dailyGoal=${dailyGoal}&weight=${currentWeight}&goal=${goalWeight}&tdee=${tdee}&time=${timeWeeks}`;
});

// Helper Functions
function addToPlanner(dayIndex, itemText, calories, isFood = true, mealType = null) {
    calories = parseFloat(calories) || 0;
    if (isFood) {
        weeklyCalories[dayIndex] = (parseFloat(weeklyCalories[dayIndex]) || 0) + calories;
        weeklyFoods[dayIndex].push({ text: itemText, cal: calories, type: mealType });
    } else {
        weeklyExercise[dayIndex] = (parseFloat(weeklyExercise[dayIndex]) || 0) + calories;
        weeklyFoods[dayIndex].push({ text: itemText, cal: -calories, type: 'exercise' });
    }
    console.log('After addToPlanner:', { dayIndex, itemText, calories, weeklyCalories, weeklyExercise });
    updatePlanner();
    saveToStorage();
}

function updateMealDisplay() {
    const list = document.getElementById('mealIngredients');
    list.innerHTML = mealIngredients.map(i => `<li>${i.name}</li>`).join('');
    document.getElementById('mealCalories').textContent = mealTotalCalories;
    document.getElementById('mealKj').textContent = Math.round(mealTotalCalories * kcalToKj);
}

function updatePlanner() {
    try {
        const rows = document.getElementById('plannerBody').getElementsByTagName('tr');
        let weeklyTotal = 0;
        let weeklyExerciseTotal = 0;
        const dailyGoalValue = dailyGoal; // Use the pre-rounded dailyGoal directly

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
        const weightLostKg = weeklyDeficit / 7700;
        document.getElementById('weightLost').textContent = weightLostKg.toFixed(2);
        document.getElementById('weightLostLb').textContent = (weightLostKg * kgToLb).toFixed(2);
        const weeksToGoal = weightLostKg > 0 ? ((currentWeight - goalWeight) / weightLostKg).toFixed(1) : "N/A";
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

// Initial update and debug log
console.log('Initial state:', { dailyGoal, weeklyCalories, weeklyExercise });
updatePlanner();
window.removeItem = removeItem;
