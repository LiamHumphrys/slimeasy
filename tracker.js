const urlParams = new URLSearchParams(window.location.search);
const bmr = parseInt(urlParams.get('bmr'));
const tdee = parseInt(urlParams.get('tdee'));
const currentWeight = parseFloat(urlParams.get('weight'));
const goalWeight = parseFloat(urlParams.get('goal'));
const timeWeeks = parseFloat(urlParams.get('time'));

const kcalToKj = 4.184;
const kgToLb = 2.20462;
const unitMultipliers = {
    g: 0.01, cup: 2.4, oz: 0.2835, tbsp: 0.15, tsp: 0.05, unit: 1
};

const weightToLose = currentWeight - goalWeight;
const totalCaloriesToLose = weightToLose * 7700;
const dailyDeficit = totalCaloriesToLose / (timeWeeks * 7);
let dailyGoal = tdee - dailyDeficit;

document.getElementById('bmr').textContent = bmr;
document.getElementById('bmrUnits').textContent = `kcal (${Math.round(bmr * kcalToKj)} kJ)`;
document.getElementById('tdee').textContent = tdee;
document.getElementById('tdeeUnits').textContent = `kcal (${Math.round(tdee * kcalToKj)} kJ)`;
document.getElementById('dailyDeficit').textContent = Math.round(dailyDeficit);
document.getElementById('deficitUnits').textContent = `kcal (${Math.round(dailyDeficit * kcalToKj)} kJ)`;
document.getElementById('dailyGoal').textContent = Math.round(dailyGoal);
document.getElementById('goalUnits').textContent = `kcal (${Math.round(dailyGoal * kcalToKj)} kJ)`;
document.getElementById('goalDisplay').textContent = `${Math.round(dailyGoal)} kcal (${Math.round(dailyGoal * kcalToKj)} kJ)`;

// Weight in kg and lb
const weightDisplay = `${currentWeight} kg (${Math.round(currentWeight * kgToLb)} lb)`;
const goalWeightDisplay = `${goalWeight} kg (${Math.round(goalWeight * kgToLb)} lb)`;

// Reset planner data on load (no prefilled stats)
let weeklyCalories = [0, 0, 0, 0, 0, 0, 0]; // Reset to zeros for each day
let weeklyExercise = [0, 0, 0, 0, 0, 0, 0]; // Reset to zeros for each day
let weeklyFoods = [[], [], [], [], [], [], []]; // Reset to empty arrays for each day

// 300 Common Ingredients
const ingredients = [
    { name: "Chicken Breast (100g)", calories: 165, defaultUnit: "100g" },
    { name: "Chicken Thigh (100g)", calories: 209, defaultUnit: "100g" },
    { name: "Chicken Drumstick (100g)", calories: 172, defaultUnit: "100g" },
    { name: "Chicken Wing (100g)", calories: 203, defaultUnit: "100g" },
    { name: "Beef (100g lean)", calories: 250, defaultUnit: "100g" },
    { name: "Ground Beef (100g 80/20)", calories: 254, defaultUnit: "100g" },
    { name: "Beef Ribeye (100g)", calories: 291, defaultUnit: "100g" },
    { name: "Beef Sirloin (100g)", calories: 212, defaultUnit: "100g" },
    { name: "Pork (100g lean)", calories: 242, defaultUnit: "100g" },
    { name: "Pork Ribs (100g)", calories: 277, defaultUnit: "100g" },
    { name: "Pork Belly (100g)", calories: 518, defaultUnit: "100g" },
    { name: "Pork Chop (100g)", calories: 231, defaultUnit: "100g" },
    { name: "Lamb (100g lean)", calories: 294, defaultUnit: "100g" },
    { name: "Lamb Shank (100g)", calories: 225, defaultUnit: "100g" },
    { name: "Turkey (100g)", calories: 135, defaultUnit: "100g" },
    { name: "Turkey Bacon (1 slice)", calories: 42, defaultUnit: "unit" },
    { name: "Bacon (1 slice)", calories: 43, defaultUnit: "unit" },
    { name: "Sausage (1 link)", calories: 100, defaultUnit: "unit" },
    { name: "Ham (1 slice)", calories: 46, defaultUnit: "unit" },
    { name: "Salami (1 oz)", calories: 110, defaultUnit: "oz" },
    { name: "Pepperoni (1 oz)", calories: 138, defaultUnit: "oz" },
    { name: "Salmon (100g)", calories: 206, defaultUnit: "100g" },
    { name: "Tuna (100g canned)", calories: 132, defaultUnit: "100g" },
    { name: "Cod (100g)", calories: 82, defaultUnit: "100g" },
    { name: "Haddock (100g)", calories: 90, defaultUnit: "100g" },
    { name: "Tilapia (100g)", calories: 96, defaultUnit: "100g" },
    { name: "Shrimp (100g)", calories: 99, defaultUnit: "100g" },
    { name: "Crab (100g)", calories: 83, defaultUnit: "100g" },
    { name: "Lobster (100g)", calories: 89, defaultUnit: "100g" },
    { name: "Clams (100g)", calories: 74, defaultUnit: "100g" },
    { name: "Oysters (100g)", calories: 68, defaultUnit: "100g" },
    { name: "Mussels (100g)", calories: 86, defaultUnit: "100g" },
    { name: "Sardines (100g canned)", calories: 208, defaultUnit: "100g" },
    { name: "Egg (large)", calories: 78, defaultUnit: "unit" },
    { name: "Egg White (1 large)", calories: 17, defaultUnit: "unit" },
    { name: "Egg Yolk (1 large)", calories: 55, defaultUnit: "unit" },
    { name: "Tofu (100g)", calories: 76, defaultUnit: "100g" },
    { name: "Tempeh (100g)", calories: 193, defaultUnit: "100g" },
    { name: "Seitan (100g)", calories: 370, defaultUnit: "100g" },
    { name: "Lentils (1 cup cooked)", calories: 230, defaultUnit: "cup" },
    { name: "Chickpeas (1 cup cooked)", calories: 269, defaultUnit: "cup" },
    { name: "Black Beans (1 cup cooked)", calories: 227, defaultUnit: "cup" },
    { name: "Kidney Beans (1 cup cooked)", calories: 225, defaultUnit: "cup" },
    { name: "Pinto Beans (1 cup cooked)", calories: 245, defaultUnit: "cup" },
    { name: "Navy Beans (1 cup cooked)", calories: 255, defaultUnit: "cup" },
    { name: "White Beans (1 cup cooked)", calories: 249, defaultUnit: "cup" },
    { name: "Peanuts (1 oz)", calories: 161, defaultUnit: "oz" },
    { name: "Almonds (1 oz)", calories: 160, defaultUnit: "oz" },
    { name: "Walnuts (1 oz)", calories: 185, defaultUnit: "oz" },
    { name: "Cashews (1 oz)", calories: 157, defaultUnit: "oz" },
    { name: "Pecans (1 oz)", calories: 196, defaultUnit: "oz" },
    { name: "Hazelnuts (1 oz)", calories: 178, defaultUnit: "oz" },
    { name: "Pistachios (1 oz)", calories: 159, defaultUnit: "oz" },
    { name: "Macadamia Nuts (1 oz)", calories: 204, defaultUnit: "oz" },
    { name: "Brazil Nuts (1 oz)", calories: 186, defaultUnit: "oz" },
    { name: "Sunflower Seeds (1 oz)", calories: 163, defaultUnit: "oz" },
    { name: "Pumpkin Seeds (1 oz)", calories: 151, defaultUnit: "oz" },
    { name: "Chia Seeds (1 tbsp)", calories: 58, defaultUnit: "tbsp" },
    { name: "Flaxseeds (1 tbsp)", calories: 55, defaultUnit: "tbsp" },
    { name: "Sesame Seeds (1 tbsp)", calories: 52, defaultUnit: "tbsp" },
    { name: "White Rice (1 cup cooked)", calories: 205, defaultUnit: "cup" },
    { name: "Brown Rice (1 cup cooked)", calories: 218, defaultUnit: "cup" },
    { name: "Wild Rice (1 cup cooked)", calories: 166, defaultUnit: "cup" },
    { name: "Quinoa (1 cup cooked)", calories: 222, defaultUnit: "cup" },
    { name: "Pasta (1 cup cooked)", calories: 131, defaultUnit: "cup" },
    { name: "Spaghetti (1 cup cooked)", calories: 131, defaultUnit: "cup" },
    { name: "Macaroni (1 cup cooked)", calories: 164, defaultUnit: "cup" },
    { name: "Oats (1/2 cup dry)", calories: 150, defaultUnit: "cup" },
    { name: "Barley (1 cup cooked)", calories: 193, defaultUnit: "cup" },
    { name: "Bulgur (1 cup cooked)", calories: 151, defaultUnit: "cup" },
    { name: "Couscous (1 cup cooked)", calories: 176, defaultUnit: "cup" },
    { name: "Millet (1 cup cooked)", calories: 207, defaultUnit: "cup" },
    { name: "Bread (1 slice white)", calories: 79, defaultUnit: "unit" },
    { name: "Bread (1 slice whole wheat)", calories: 81, defaultUnit: "unit" },
    { name: "Pita Bread (1 medium)", calories: 165, defaultUnit: "unit" },
    { name: "Tortilla (1 medium)", calories: 90, defaultUnit: "unit" },
    { name: "Bagel (medium)", calories: 245, defaultUnit: "unit" },
    { name: "English Muffin (1)", calories: 134, defaultUnit: "unit" },
    { name: "Croissant (1 medium)", calories: 231, defaultUnit: "unit" },
    { name: "Baguette (1 oz)", calories: 81, defaultUnit: "oz" },
    { name: "Potato (medium)", calories: 130, defaultUnit: "unit" },
    { name: "Sweet Potato (medium)", calories: 103, defaultUnit: "unit" },
    { name: "Mashed Potatoes (1 cup)", calories: 214, defaultUnit: "cup" },
    { name: "French Fries (1 cup)", calories: 312, defaultUnit: "cup" },
    { name: "Potato Chips (1 oz)", calories: 152, defaultUnit: "oz" },
    { name: "Corn (1 cup)", calories: 130, defaultUnit: "cup" },
    { name: "Corn on the Cob (1 medium)", calories: 90, defaultUnit: "unit" },
    { name: "Popcorn (1 cup air-popped)", calories: 31, defaultUnit: "cup" },
    { name: "Broccoli (100g)", calories: 35, defaultUnit: "100g" },
    { name: "Spinach (1 cup)", calories: 7, defaultUnit: "cup" },
    { name: "Kale (1 cup)", calories: 33, defaultUnit: "cup" },
    { name: "Lettuce (1 cup shredded)", calories: 5, defaultUnit: "cup" },
    { name: "Cabbage (1 cup shredded)", calories: 22, defaultUnit: "cup" },
    { name: "Cauliflower (1 cup)", calories: 25, defaultUnit: "cup" },
    { name: "Zucchini (medium)", calories: 33, defaultUnit: "unit" },
    { name: "Carrot (medium)", calories: 25, defaultUnit: "unit" },
    { name: "Tomato (medium)", calories: 22, defaultUnit: "unit" },
    { name: "Cherry Tomatoes (1 cup)", calories: 27, defaultUnit: "cup" },
    { name: "Cucumber (1 cup sliced)", calories: 16, defaultUnit: "cup" },
    { name: "Bell Pepper (medium)", calories: 25, defaultUnit: "unit" },
    { name: "Onion (medium)", calories: 44, defaultUnit: "unit" },
    { name: "Green Onion (1 stalk)", calories: 5, defaultUnit: "unit" },
    { name: "Garlic (1 clove)", calories: 4, defaultUnit: "unit" },
    { name: "Mushrooms (1 cup sliced)", calories: 15, defaultUnit: "cup" },
    { name: "Green Beans (1 cup)", calories: 31, defaultUnit: "cup" },
    { name: "Peas (1 cup)", calories: 118, defaultUnit: "cup" },
    { name: "Asparagus (5 spears)", calories: 20, defaultUnit: "unit" },
    { name: "Brussels Sprouts (1 cup)", calories: 38, defaultUnit: "cup" },
    { name: "Celery (1 stalk)", calories: 6, defaultUnit: "unit" },
    { name: "Radish (1 medium)", calories: 1, defaultUnit: "unit" },
    { name: "Eggplant (1 cup cubed)", calories: 20, defaultUnit: "cup" },
    { name: "Leek (1 medium)", calories: 54, defaultUnit: "unit" },
    { name: "Pumpkin (1 cup mashed)", calories: 49, defaultUnit: "cup" },
    { name: "Butternut Squash (1 cup cooked)", calories: 82, defaultUnit: "cup" },
    { name: "Acorn Squash (1 cup cooked)", calories: 115, defaultUnit: "cup" },
    { name: "Spaghetti Squash (1 cup cooked)", calories: 42, defaultUnit: "cup" },
    { name: "Beetroot (1 medium)", calories: 43, defaultUnit: "unit" },
    { name: "Artichoke (1 medium)", calories: 60, defaultUnit: "unit" },
    { name: "Okra (1 cup)", calories: 33, defaultUnit: "cup" },
    { name: "Snow Peas (1 cup)", calories: 42, defaultUnit: "cup" },
    { name: "Bok Choy (1 cup)", calories: 13, defaultUnit: "cup" },
    { name: "Swiss Chard (1 cup)", calories: 7, defaultUnit: "cup" },
    { name: "Arugula (1 cup)", calories: 5, defaultUnit: "cup" },
    { name: "Apple (medium)", calories: 95, defaultUnit: "unit" },
    { name: "Banana (medium)", calories: 105, defaultUnit: "unit" },
    { name: "Orange (medium)", calories: 62, defaultUnit: "unit" },
    { name: "Strawberries (1 cup)", calories: 50, defaultUnit: "cup" },
    { name: "Blueberries (1 cup)", calories: 85, defaultUnit: "cup" },
    { name: "Raspberries (1 cup)", calories: 64, defaultUnit: "cup" },
    { name: "Blackberries (1 cup)", calories: 62, defaultUnit: "cup" },
    { name: "Grapes (1 cup)", calories: 104, defaultUnit: "cup" },
    { name: "Pineapple (1 cup)", calories: 82, defaultUnit: "cup" },
    { name: "Mango (1 cup)", calories: 99, defaultUnit: "cup" },
    { name: "Watermelon (1 cup)", calories: 46, defaultUnit: "cup" },
    { name: "Peach (medium)", calories: 59, defaultUnit: "unit" },
    { name: "Pear (medium)", calories: 101, defaultUnit: "unit" },
    { name: "Plum (medium)", calories: 30, defaultUnit: "unit" },
    { name: "Kiwi (medium)", calories: 42, defaultUnit: "unit" },
    { name: "Cherry (1 cup)", calories: 87, defaultUnit: "cup" },
    { name: "Grapefruit (half)", calories: 52, defaultUnit: "unit" },
    { name: "Pomegranate (1 medium)", calories: 83, defaultUnit: "unit" },
    { name: "Cantaloupe (1 cup)", calories: 54, defaultUnit: "cup" },
    { name: "Honeydew (1 cup)", calories: 64, defaultUnit: "cup" },
    { name: "Apricot (1 medium)", calories: 17, defaultUnit: "unit" },
    { name: "Fig (1 medium)", calories: 37, defaultUnit: "unit" },
    { name: "Raisins (1 oz)", calories: 85, defaultUnit: "oz" },
    { name: "Dates (1 piece)", calories: 20, defaultUnit: "unit" },
    { name: "Cranberries (1 cup)", calories: 46, defaultUnit: "cup" },
    { name: "Lemon (1 medium)", calories: 17, defaultUnit: "unit" },
    { name: "Lime (1 medium)", calories: 20, defaultUnit: "unit" },
    { name: "Milk (1 cup whole)", calories: 150, defaultUnit: "cup" },
    { name: "Milk (1 cup skim)", calories: 83, defaultUnit: "cup" },
    { name: "Milk (1 cup 2%)", calories: 122, defaultUnit: "cup" },
    { name: "Greek Yogurt (100g plain)", calories: 59, defaultUnit: "100g" },
    { name: "Yogurt (1 cup plain)", calories: 110, defaultUnit: "cup" },
    { name: "Cheddar Cheese (1 oz)", calories: 113, defaultUnit: "oz" },
    { name: "Mozzarella (1 oz)", calories: 85, defaultUnit: "oz" },
    { name: "Parmesan (1 tbsp)", calories: 21, defaultUnit: "tbsp" },
    { name: "Cream Cheese (1 tbsp)", calories: 51, defaultUnit: "tbsp" },
    { name: "Butter (1 tbsp)", calories: 102, defaultUnit: "tbsp" },
    { name: "Sour Cream (1 tbsp)", calories: 23, defaultUnit: "tbsp" },
    { name: "Heavy Cream (1 tbsp)", calories: 51, defaultUnit: "tbsp" },
    { name: "Cottage Cheese (1/2 cup)", calories: 110, defaultUnit: "cup" },
    { name: "Feta Cheese (1 oz)", calories: 75, defaultUnit: "oz" },
    { name: "Swiss Cheese (1 oz)", calories: 108, defaultUnit: "oz" },
    { name: "Goat Cheese (1 oz)", calories: 75, defaultUnit: "oz" },
    { name: "Blue Cheese (1 oz)", calories: 100, defaultUnit: "oz" },
    { name: "Ricotta (1/4 cup)", calories: 108, defaultUnit: "cup" },
    { name: "Olive Oil (1 tbsp)", calories: 120, defaultUnit: "tbsp" },
    { name: "Coconut Oil (1 tbsp)", calories: 117, defaultUnit: "tbsp" },
    { name: "Vegetable Oil (1 tbsp)", calories: 120, defaultUnit: "tbsp" },
    { name: "Canola Oil (1 tbsp)", calories: 124, defaultUnit: "tbsp" },
    { name: "Peanut Oil (1 tbsp)", calories: 119, defaultUnit: "tbsp" },
    { name: "Sesame Oil (1 tbsp)", calories: 120, defaultUnit: "tbsp" },
    { name: "Peanut Butter (1 tbsp)", calories: 94, defaultUnit: "tbsp" },
    { name: "Almond Butter (1 tbsp)", calories: 98, defaultUnit: "tbsp" },
    { name: "Cashew Butter (1 tbsp)", calories: 94, defaultUnit: "tbsp" },
    { name: "Tahini (1 tbsp)", calories: 89, defaultUnit: "tbsp" },
    { name: "Ketchup (1 tbsp)", calories: 20, defaultUnit: "tbsp" },
    { name: "Mayonnaise (1 tbsp)", calories: 94, defaultUnit: "tbsp" },
    { name: "Mustard (1 tsp)", calories: 3, defaultUnit: "tsp" },
    { name: "Soy Sauce (1 tbsp)", calories: 8, defaultUnit: "tbsp" },
    { name: "BBQ Sauce (1 tbsp)", calories: 29, defaultUnit: "tbsp" },
    { name: "Hot Sauce (1 tsp)", calories: 1, defaultUnit: "tsp" },
    { name: "Vinegar (1 tbsp)", calories: 3, defaultUnit: "tbsp" },
    { name: "Balsamic Vinegar (1 tbsp)", calories: 14, defaultUnit: "tbsp" },
    { name: "Honey (1 tbsp)", calories: 64, defaultUnit: "tbsp" },
    { name: "Maple Syrup (1 tbsp)", calories: 52, defaultUnit: "tbsp" },
    { name: "Jam (1 tbsp)", calories: 56, defaultUnit: "tbsp" },
    { name: "Salsa (1 tbsp)", calories: 6, defaultUnit: "tbsp" },
    { name: "Teriyaki Sauce (1 tbsp)", calories: 15, defaultUnit: "tbsp" },
    { name: "Hoisin Sauce (1 tbsp)", calories: 35, defaultUnit: "tbsp" },
    { name: "Ranch Dressing (1 tbsp)", calories: 73, defaultUnit: "tbsp" },
    { name: "Caesar Dressing (1 tbsp)", calories: 78, defaultUnit: "tbsp" },
    { name: "Italian Dressing (1 tbsp)", calories: 43, defaultUnit: "tbsp" },
    { name: "Thousand Island (1 tbsp)", calories: 59, defaultUnit: "tbsp" },
    { name: "Salt (1 tsp)", calories: 0, defaultUnit: "tsp" },
    { name: "Black Pepper (1 tsp)", calories: 6, defaultUnit: "tsp" },
    { name: "Garlic Powder (1 tsp)", calories: 9, defaultUnit: "tsp" },
    { name: "Onion Powder (1 tsp)", calories: 8, defaultUnit: "tsp" },
    { name: "Paprika (1 tsp)", calories: 6, defaultUnit: "tsp" },
    { name: "Cumin (1 tsp)", calories: 8, defaultUnit: "tsp" },
    { name: "Chili Powder (1 tsp)", calories: 8, defaultUnit: "tsp" },
    { name: "Cinnamon (1 tsp)", calories: 6, defaultUnit: "tsp" },
    { name: "Nutmeg (1 tsp)", calories: 12, defaultUnit: "tsp" },
    { name: "Oregano (1 tsp)", calories: 5, defaultUnit: "tsp" },
    { name: "Basil (1 tsp dried)", calories: 2, defaultUnit: "tsp" },
    { name: "Thyme (1 tsp)", calories: 3, defaultUnit: "tsp" },
    { name: "Rosemary (1 tsp)", calories: 2, defaultUnit: "tsp" },
    { name: "Parsley (1 tbsp fresh)", calories: 1, defaultUnit: "tbsp" },
    { name: "Cilantro (1 tbsp fresh)", calories: 1, defaultUnit: "tbsp" },
    { name: "Dill (1 tsp fresh)", calories: 1, defaultUnit: "tsp" },
    { name: "Ginger (1 tsp fresh)", calories: 2, defaultUnit: "tsp" },
    { name: "Turmeric (1 tsp)", calories: 8, defaultUnit: "tsp" },
    { name: "Curry Powder (1 tsp)", calories: 6, defaultUnit: "tsp" },
    { name: "Cayenne Pepper (1 tsp)", calories: 6, defaultUnit: "tsp" },
    { name: "Sugar (1 tbsp)", calories: 49, defaultUnit: "tbsp" },
    { name: "Brown Sugar (1 tbsp)", calories: 52, defaultUnit: "tbsp" },
    { name: "Flour (1/4 cup)", calories: 110, defaultUnit: "cup" },
    { name: "Whole Wheat Flour (1/4 cup)", calories: 102, defaultUnit: "cup" },
    { name: "Cornstarch (1 tbsp)", calories: 30, defaultUnit: "tbsp" },
    { name: "Baking Powder (1 tsp)", calories: 2, defaultUnit: "tsp" },
    { name: "Baking Soda (1 tsp)", calories: 0, defaultUnit: "tsp" },
    { name: "Yeast (1 tsp)", calories: 11, defaultUnit: "tsp" },
    { name: "Coffee (1 cup black)", calories: 2, defaultUnit: "cup" },
    { name: "Tea (1 cup black)", calories: 2, defaultUnit: "cup" },
    { name: "Milk Chocolate (1 oz)", calories: 150, defaultUnit: "oz" },
    { name: "Dark Chocolate (1 oz)", calories: 170, defaultUnit: "oz" },
    { name: "White Chocolate (1 oz)", calories: 153, defaultUnit: "oz" },
    { name: "Cocoa Powder (1 tbsp)", calories: 12, defaultUnit: "tbsp" },
    { name: "Pretzels (1 oz)", calories: 108, defaultUnit: "oz" },
    { name: "Granola Bar (1)", calories: 120, defaultUnit: "unit" },
    { name: "Trail Mix (1 oz)", calories: 160, defaultUnit: "oz" },
    { name: "Rice Cake (1)", calories: 35, defaultUnit: "unit" },
    { name: "Crackers (5 saltines)", calories: 70, defaultUnit: "unit" },
    { name: "Graham Crackers (1 sheet)", calories: 59, defaultUnit: "unit" },
    { name: "Soy Milk (1 cup)", calories: 80, defaultUnit: "cup" },
    { name: "Almond Milk (1 cup)", calories: 30, defaultUnit: "cup" },
    { name: "Coconut Milk (1 cup canned)", calories: 140, defaultUnit: "cup" },
    { name: "Oat Milk (1 cup)", calories: 120, defaultUnit: "cup" },
    { name: "Orange Juice (1 cup)", calories: 112, defaultUnit: "cup" },
    { name: "Apple Juice (1 cup)", calories: 114, defaultUnit: "cup" },
    { name: "Grape Juice (1 cup)", calories: 152, defaultUnit: "cup" },
    { name: "Pineapple Juice (1 cup)", calories: 132, defaultUnit: "cup" },
    { name: "Tomato Juice (1 cup)", calories: 41, defaultUnit: "cup" },
    { name: "Wine (5 oz red)", calories: 125, defaultUnit: "oz" },
    { name: "Wine (5 oz white)", calories: 121, defaultUnit: "oz" },
    { name: "Beer (12 oz light)", calories: 103, defaultUnit: "oz" },
    { name: "Beer (12 oz regular)", calories: 153, defaultUnit: "oz" },
    { name: "Vodka (1 oz)", calories: 64, defaultUnit: "oz" },
    { name: "Whiskey (1 oz)", calories: 64, defaultUnit: "oz" },
    { name: "Cola (12 oz)", calories: 140, defaultUnit: "oz" },
    { name: "Diet Cola (12 oz)", calories: 0, defaultUnit: "oz" },
    { name: "Energy Drink (8 oz)", calories: 110, defaultUnit: "oz" },
    { name: "Sports Drink (8 oz)", calories: 60, defaultUnit: "oz" }
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

document.getElementById('ingredientSearch').addEventListener('input', function(e) {
    populateIngredients(e.target.value);
});

// Manual Food Form
document.getElementById('manualForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const dayIndex = parseInt(document.getElementById('manualDay').value);
    const mealType = document.getElementById('manualMealType').value;
    const foodName = document.getElementById('manualFoodName').value;
    const amount = parseInt(document.getElementById('manualAmount').value);
    const unit = document.getElementById('manualUnit').value;
    const calories = unit === 'kcal' ? amount : Math.round(amount / kcalToKj);
    addToPlanner(dayIndex, `${foodName} (${amount} ${unit})`, calories, true, mealType);
    this.reset();
});

// Automatic Meal Builder
let mealIngredients = [];
let mealTotalCalories = 0;

document.getElementById('addIngredient').addEventListener('click', function() {
    const { calories, unit } = JSON.parse(document.getElementById('ingredient').value);
    const qty = parseFloat(document.getElementById('ingredientQty').value);
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

// Add Exercise Button
document.getElementById('addExercise').addEventListener('click', function() {
    localStorage.setItem('weeklyCalories', JSON.stringify(weeklyCalories));
    localStorage.setItem('weeklyExercise', JSON.stringify(weeklyExercise));
    localStorage.setItem('weeklyFoods', JSON.stringify(weeklyFoods));
    localStorage.setItem('timeWeeks', timeWeeks.toString());
    window.location.href = `exercise.html?bmr=${bmr}&dailyGoal=${dailyGoal}&weight=${currentWeight}&goal=${goalWeight}&tdee=${tdee}&time=${timeWeeks}`;
});

// Helper Functions
function addToPlanner(dayIndex, itemText, calories, isFood = true, mealType = null) {
    if (isFood) {
        weeklyCalories[dayIndex] += calories;
        weeklyFoods[dayIndex].push({ text: itemText, cal: calories, type: mealType });
    } else {
        weeklyExercise[dayIndex] += calories;
        weeklyFoods[dayIndex].push({ text: itemText, cal: -calories, type: 'exercise' });
    }
    updatePlanner();
}

function updateMealDisplay() {
    const list = document.getElementById('mealIngredients');
    list.innerHTML = mealIngredients.map(i => `<li>${i.name}</li>`).join('');
    document.getElementById('mealCalories').textContent = mealTotalCalories;
    document.getElementById('mealKj').textContent = Math.round(mealTotalCalories * kcalToKj);
}

function updatePlanner() {
    const rows = document.getElementById('plannerBody').getElementsByTagName('tr');
    let weeklyTotal = 0;
    let weeklyExerciseTotal = 0;
    for (let i = 0; i < 7; i++) {
        weeklyTotal += weeklyCalories[i];
        weeklyExerciseTotal += weeklyExercise[i];
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

        row.cells[6].textContent = `${weeklyCalories[i]} kcal (${Math.round(weeklyCalories[i] * kcalToKj)} kJ)`;
        row.cells[7].textContent = `${weeklyExercise[i]} kcal (${Math.round(weeklyExercise[i] * kcalToKj)} kJ)`;
        const netCalories = weeklyCalories[i] - weeklyExercise[i];
        row.cells[8].textContent = `${netCalories} kcal (${Math.round(netCalories * kcalToKj)} kJ)`;
        const remaining = dailyGoal - netCalories;
        row.cells[9].textContent = `${Math.round(remaining)} kcal (${Math.round(remaining * kcalToKj)} kJ)`;
        row.cells[9].className = remaining >= 0 ? 'green' : 'red';
    }
    document.getElementById('weeklyTotal').textContent = weeklyTotal;
    document.getElementById('weeklyTotalKj').textContent = Math.round(weeklyTotal * kcalToKj);
    document.getElementById('weeklyExercise').textContent = weeklyExerciseTotal;
    document.getElementById('weeklyExerciseKj').textContent = Math.round(weeklyExerciseTotal * kcalToKj);
    const weeklyGoal = dailyGoal * 7;
    const weeklyOutcome = weeklyGoal - (weeklyTotal - weeklyExerciseTotal);
    document.getElementById('weeklyOutcome').textContent = weeklyOutcome >= 0 
        ? `Deficit: ${Math.round(weeklyOutcome)} kcal (${Math.round(weeklyOutcome * kcalToKj)} kJ)` 
        : `Surplus: ${Math.abs(Math.round(weeklyOutcome))} kcal (${Math.abs(Math.round(weeklyOutcome * kcalToKj))} kJ)`;
    document.getElementById('weeklyOutcome').className = weeklyOutcome >= 0 ? 'green' : 'red';

    const weeklyDeficit = weeklyExerciseTotal + (tdee * 7 - weeklyTotal);
    const weightLostKg = weeklyDeficit / 7700;
    document.getElementById('weightLost').textContent = weightLostKg.toFixed(2);
    document.getElementById('weightLostLb').textContent = (weightLostKg * kgToLb).toFixed(2);
    const weeksToGoal = weightLostKg > 0 ? (weightToLose / weightLostKg).toFixed(1) : "N/A";
    document.getElementById('timeToGoal').textContent = weeksToGoal;

    localStorage.setItem('weeklyCalories', JSON.stringify(weeklyCalories));
    localStorage.setItem('weeklyExercise', JSON.stringify(weeklyExercise));
    localStorage.setItem('weeklyFoods', JSON.stringify(weeklyFoods));
}

// Remove Item Function
function removeItem(dayIndex, itemIndex, type) {
    const dayItems = weeklyFoods[dayIndex];
    const filteredItems = dayItems.filter(f => f.type === type);
    const item = filteredItems[itemIndex];
    const globalIndex = dayItems.indexOf(item);
    if (type === 'exercise') {
        weeklyExercise[dayIndex] += item.cal; // Add back since it’s negative
    } else {
        weeklyCalories[dayIndex] -= item.cal;
    }
    weeklyFoods[dayIndex].splice(globalIndex, 1);
    updatePlanner();
}

// Export Meal Plan
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
            <p>Daily Goal: ${Math.round(dailyGoal)} kcal (${Math.round(dailyGoal * kcalToKj)} kJ)</p>
            <h2>Weekly Meal Plan</h2>
            <table>
                <tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th><th>Snack</th><th>Exercises</th><th>Total Intake</th><th>Exercise Burn</th><th>Net Calories</th><th>Remaining</th></tr>
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
                        <td class="${dailyGoal - (weeklyCalories[i] - weeklyExercise[i]) >= 0 ? 'green' : 'red'}">${Math.round(dailyGoal - (weeklyCalories[i] - weeklyExercise[i]))} kcal (${Math.round((dailyGoal - (weeklyCalories[i] - weeklyExercise[i])) * kcalToKj)} kJ)</td>
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

// Initial Update
updatePlanner();

// Make removeItem globally accessible
window.removeItem = removeItem;