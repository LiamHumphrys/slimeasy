/**
 * SlimEasy - Tracker Fixed Module
 * This file redirects to the main tracker.js implementation.
 * It exists to maintain compatibility but all functionality is now in tracker.js.
 */

console.log("tracker-fixed.js is deprecated. Using tracker.js instead.");

// Re-export critical functions to ensure backward compatibility
if (typeof addIngredientToMeal === 'function') {
    window.addIngredientToMeal = addIngredientToMeal;
}

if (typeof populateIngredients === 'function') {
    window.populateIngredients = populateIngredients;
}

if (typeof updateNutrientInfo === 'function') {
    window.updateNutrientInfo = updateNutrientInfo;
}

// Ensure food buttons are properly initialized from this module too
window.addEventListener('load', function() {
    console.log("tracker-fixed.js: Ensuring food buttons are initialized");
    
    // Add click handler for the Add Ingredient button
    const addIngredientBtn = document.getElementById('addIngredient');
    if (addIngredientBtn && typeof addIngredientToMeal === 'function') {
        addIngredientBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Add Ingredient button clicked from tracker-fixed");
            addIngredientToMeal();
        });
    }
    
    // Initialize ingredient select if needed
    const ingredientSelect = document.getElementById('ingredient');
    if (ingredientSelect && typeof populateIngredients === 'function') {
        // Add change listener
        ingredientSelect.addEventListener('change', function() {
            if (typeof updateNutrientInfo === 'function') {
                updateNutrientInfo();
            }
        });
    }
});