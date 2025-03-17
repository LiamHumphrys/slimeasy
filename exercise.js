// Enhanced Exercise Database with METs (Metabolic Equivalent of Task) values
const exerciseDatabase = {
    // Cardio Exercises
    cardio: {
        running: [
            { id: "running_5mph", name: "Running - Light (5 mph)", met: 8.3, description: "Jogging at a comfortable pace" },
            { id: "running_6mph", name: "Running - Moderate (6 mph)", met: 9.8, description: "Running at moderate intensity" },
            { id: "running_7mph", name: "Running - Vigorous (7 mph)", met: 11.8, description: "Running at a challenging pace" },
            { id: "running_8mph", name: "Running - Fast (8 mph)", met: 12.8, description: "Fast-paced running" },
            { id: "running_10mph", name: "Running - Sprint (10 mph)", met: 14.5, description: "Sprint or race pace" },
            { id: "running_hills", name: "Running - Hills", met: 12.3, description: "Running uphill or on incline" },
            { id: "running_stairs", name: "Running - Stairs", met: 13.2, description: "Running up and down stairs" },
            { id: "running_trail", name: "Running - Trail", met: 10.2, description: "Running on uneven terrain" },
            { id: "running_intervals", name: "Running - Intervals", met: 12.0, description: "Alternating between high and low intensity" }
        ],
        walking: [
            { id: "walking_2mph", name: "Walking - Slow (2 mph)", met: 2.5, description: "Casual stroll" },
            { id: "walking_3mph", name: "Walking - Moderate (3 mph)", met: 3.8, description: "Moderate pace walking" },
            { id: "walking_4mph", name: "Walking - Brisk (4 mph)", met: 5.0, description: "Brisk walking" },
            { id: "walking_5mph", name: "Walking - Power (5 mph)", met: 6.5, description: "Very brisk or power walking" },
            { id: "walking_uphill", name: "Walking - Uphill", met: 7.2, description: "Walking uphill or incline" },
            { id: "walking_stairs", name: "Walking - Stairs", met: 8.0, description: "Walking up and down stairs" },
            { id: "walking_hiking", name: "Hiking", met: 6.0, description: "Walking on trails with elevation changes" },
            { id: "walking_backpacking", name: "Backpacking", met: 7.8, description: "Hiking with a backpack" },
            { id: "walking_treadmill", name: "Walking - Treadmill", met: 4.0, description: "Walking on a treadmill at moderate pace" }
        ],
        cycling: [
            { id: "cycling_leisure", name: "Cycling - Leisure (<10 mph)", met: 5.8, description: "Casual biking at a relaxed pace" },
            { id: "cycling_10mph", name: "Cycling - Light (10-12 mph)", met: 7.5, description: "Light effort cycling" },
            { id: "cycling_12mph", name: "Cycling - Moderate (12-14 mph)", met: 8.5, description: "Moderate effort cycling" },
            { id: "cycling_14mph", name: "Cycling - Vigorous (14-16 mph)", met: 10.0, description: "Vigorous effort cycling" },
            { id: "cycling_16mph", name: "Cycling - Racing (16-19 mph)", met: 12.0, description: "Racing or fast cycling" },
            { id: "cycling_20mph", name: "Cycling - Racing (>20 mph)", met: 15.8, description: "Very fast racing pace" },
            { id: "cycling_stationary_light", name: "Stationary Cycling - Light", met: 6.8, description: "Stationary bike at light effort" },
            { id: "cycling_stationary_moderate", name: "Stationary Cycling - Moderate", met: 8.5, description: "Stationary bike at moderate effort" },
            { id: "cycling_stationary_vigorous", name: "Stationary Cycling - Vigorous", met: 10.5, description: "Stationary bike at vigorous effort" },
            { id: "cycling_spinning", name: "Spinning Class", met: 10.8, description: "High-intensity indoor cycling class" },
            { id: "cycling_mountain", name: "Mountain Biking", met: 9.5, description: "Off-road cycling on trails" }
        ],
        swimming: [
            { id: "swimming_freestyle_light", name: "Swimming - Freestyle Light", met: 6.0, description: "Freestyle swimming at light effort" },
            { id: "swimming_freestyle_moderate", name: "Swimming - Freestyle Moderate", met: 8.3, description: "Freestyle swimming at moderate effort" },
            { id: "swimming_freestyle_vigorous", name: "Swimming - Freestyle Vigorous", met: 10.0, description: "Freestyle swimming at vigorous effort" },
            { id: "swimming_backstroke", name: "Swimming - Backstroke", met: 7.0, description: "Backstroke swimming" },
            { id: "swimming_breaststroke", name: "Swimming - Breaststroke", met: 7.5, description: "Breaststroke swimming" },
            { id: "swimming_butterfly", name: "Swimming - Butterfly", met: 11.0, description: "Butterfly stroke swimming" },
            { id: "swimming_leisure", name: "Swimming - Leisure", met: 5.0, description: "Casual swimming" },
            { id: "swimming_treading", name: "Swimming - Treading Water", met: 3.5, description: "Treading water, moderate effort" },
            { id: "swimming_water_aerobics", name: "Water Aerobics", met: 5.5, description: "Aerobic exercises in water" }
        ],
        elliptical: [
            { id: "elliptical_light", name: "Elliptical Trainer - Light", met: 5.0, description: "Light effort on elliptical machine" },
            { id: "elliptical_moderate", name: "Elliptical Trainer - Moderate", met: 7.0, description: "Moderate effort on elliptical machine" },
            { id: "elliptical_vigorous", name: "Elliptical Trainer - Vigorous", met: 9.0, description: "Vigorous effort on elliptical machine" }
        ],
        rowing: [
            { id: "rowing_light", name: "Rowing Machine - Light", met: 4.8, description: "Light effort on rowing machine" },
            { id: "rowing_moderate", name: "Rowing Machine - Moderate", met: 7.0, description: "Moderate effort on rowing machine" },
            { id: "rowing_vigorous", name: "Rowing Machine - Vigorous", met: 8.5, description: "Vigorous effort on rowing machine" },
            { id: "rowing_water", name: "Rowing - Water", met: 7.5, description: "Rowing on water, moderate effort" }
        ],
        jumping: [
            { id: "jumping_rope_moderate", name: "Jump Rope - Moderate", met: 11.0, description: "Jumping rope at moderate pace" },
            { id: "jumping_rope_vigorous", name: "Jump Rope - Vigorous", met: 12.5, description: "Jumping rope at fast pace" },
            { id: "jumping_jacks", name: "Jumping Jacks", met: 8.0, description: "Continuous jumping jacks" }
        ],
        other_cardio: [
            { id: "stair_climber", name: "Stair Climber", met: 8.8, description: "Using a stair climbing machine" },
            { id: "cross_trainer", name: "Cross Trainer", met: 7.5, description: "Using a cross-training machine" },
            { id: "aerobics_low", name: "Aerobics - Low Impact", met: 5.0, description: "Low impact aerobic exercises" },
            { id: "aerobics_high", name: "Aerobics - High Impact", met: 7.3, description: "High impact aerobic exercises" },
            { id: "aerobics_step_low", name: "Step Aerobics - Low Impact", met: 6.5, description: "Step aerobics with low impact movements" },
            { id: "aerobics_step_high", name: "Step Aerobics - High Impact", met: 9.5, description: "Step aerobics with high impact movements" },
            { id: "dancing_casual", name: "Dancing - Casual", met: 4.8, description: "Casual social dancing" },
            { id: "dancing_vigorous", name: "Dancing - Vigorous", met: 7.8, description: "Energetic or competitive dancing" },
            { id: "dancing_zumba", name: "Zumba", met: 7.5, description: "Zumba dance fitness" },
            { id: "boxing_cardio", name: "Cardio Boxing", met: 8.0, description: "Boxing movements for cardio, no sparring" },
            { id: "kickboxing", name: "Kickboxing", met: 9.0, description: "Kickboxing workout or class" }
        ]
    },
    
    // Strength Training Exercises
    strength: {
        bodyweight: [
            { id: "pushups", name: "Push-ups", met: 4.0, description: "Standard push-ups" },
            { id: "pullups", name: "Pull-ups", met: 4.5, description: "Standard pull-ups" },
            { id: "squats_bodyweight", name: "Bodyweight Squats", met: 4.0, description: "Squats using only body weight" },
            { id: "lunges_bodyweight", name: "Bodyweight Lunges", met: 4.0, description: "Lunges using only body weight" },
            { id: "plank", name: "Plank", met: 3.5, description: "Static plank position" },
            { id: "burpees", name: "Burpees", met: 9.8, description: "Full burpee exercise with jump" },
            { id: "mountain_climbers", name: "Mountain Climbers", met: 8.0, description: "Dynamic mountain climber exercise" },
            { id: "dips", name: "Dips", met: 4.0, description: "Tricep or chest dips" }
        ],
        weightlifting: [
            { id: "weight_light", name: "Weight Lifting - Light", met: 3.5, description: "Light effort weight training" },
            { id: "weight_moderate", name: "Weight Lifting - Moderate", met: 5.0, description: "Moderate effort weight training" },
            { id: "weight_vigorous", name: "Weight Lifting - Vigorous", met: 6.0, description: "Vigorous effort weight training" },
            { id: "weight_squats", name: "Weighted Squats", met: 5.5, description: "Squats with added weight" },
            { id: "weight_deadlifts", name: "Deadlifts", met: 6.0, description: "Standard deadlift exercise" },
            { id: "weight_bench_press", name: "Bench Press", met: 4.5, description: "Standard bench press exercise" },
            { id: "weight_overhead_press", name: "Overhead Press", met: 4.5, description: "Shoulder press exercise" },
            { id: "weight_rows", name: "Rows", met: 4.5, description: "Rowing exercises with weights" }
        ],
        circuit: [
            { id: "circuit_training_light", name: "Circuit Training - Light", met: 4.5, description: "Light effort circuit training" },
            { id: "circuit_training_moderate", name: "Circuit Training - Moderate", met: 6.5, description: "Moderate effort circuit training" },
            { id: "circuit_training_vigorous", name: "Circuit Training - Vigorous", met: 8.5, description: "Vigorous effort circuit training" },
            { id: "hiit", name: "HIIT - High Intensity Interval Training", met: 9.0, description: "High intensity interval training" },
            { id: "crossfit", name: "CrossFit", met: 9.5, description: "CrossFit workout" }
        ]
    },
    
    // Flexibility & Balance Exercises
    flexibility: {
        yoga: [
            { id: "yoga_hatha", name: "Yoga - Hatha", met: 3.0, description: "Traditional gentle yoga" },
            { id: "yoga_power", name: "Yoga - Power", met: 4.0, description: "More intense flowing yoga" },
            { id: "yoga_flow", name: "Yoga - Flow/Vinyasa", met: 3.5, description: "Flowing yoga sequences" }
        ],
        stretching: [
            { id: "stretching_light", name: "Stretching - Light", met: 2.5, description: "Light stretching exercises" },
            { id: "stretching_active", name: "Stretching - Active", met: 3.0, description: "Active or dynamic stretching" }
        ],
        balance: [
            { id: "tai_chi", name: "Tai Chi", met: 3.0, description: "Tai chi movements and exercises" },
            { id: "pilates", name: "Pilates", met: 3.5, description: "Pilates exercises" },
            { id: "barre", name: "Barre", met: 4.0, description: "Barre fitness exercises" }
        ]
    },
    
    // Sports Activities
    sports: {
        ball_sports: [
            { id: "basketball", name: "Basketball", met: 7.8, description: "Playing basketball game" },
            { id: "basketball_shooting", name: "Basketball - Shooting Baskets", met: 4.5, description: "Shooting baskets casually" },
            { id: "soccer", name: "Soccer", met: 8.5, description: "Playing soccer game" },
            { id: "tennis", name: "Tennis", met: 7.5, description: "Playing tennis game" },
            { id: "volleyball", name: "Volleyball", met: 6.0, description: "Playing volleyball game" },
            { id: "golf_with_cart", name: "Golf (with cart)", met: 3.5, description: "Playing golf using a cart" },
            { id: "golf_walking", name: "Golf (walking)", met: 5.0, description: "Playing golf carrying clubs" },
            { id: "baseball", name: "Baseball/Softball", met: 5.0, description: "Playing baseball or softball" },
            { id: "table_tennis", name: "Table Tennis", met: 4.5, description: "Playing table tennis/ping pong" }
        ],
        racquet_sports: [
            { id: "badminton", name: "Badminton", met: 5.5, description: "Playing badminton game" },
            { id: "racquetball", name: "Racquetball", met: 8.0, description: "Playing racquetball game" },
            { id: "squash", name: "Squash", met: 9.5, description: "Playing squash game" }
        ],
        outdoor_sports: [
            { id: "rock_climbing", name: "Rock Climbing", met: 8.5, description: "Rock climbing activity" },
            { id: "skateboarding", name: "Skateboarding", met: 5.5, description: "Skateboarding activity" },
            { id: "skiing_downhill", name: "Skiing - Downhill", met: 6.8, description: "Downhill skiing" },
            { id: "skiing_cross_country", name: "Skiing - Cross Country", met: 8.5, description: "Cross country skiing" },
            { id: "snowboarding", name: "Snowboarding", met: 6.5, description: "Snowboarding activity" },
            { id: "ice_skating", name: "Ice Skating", met: 6.0, description: "Ice skating activity" },
            { id: "surfing", name: "Surfing", met: 5.5, description: "Surfing waves" },
            { id: "paddle_boarding", name: "Paddle Boarding", met: 4.5, description: "Stand-up paddle boarding" },
            { id: "kayaking", name: "Kayaking", met: 5.0, description: "Kayaking activity" }
        ]
    },
    
    // Daily Activities
    daily: {
        housework: [
            { id: "cleaning_house", name: "Cleaning - General Housework", met: 3.0, description: "General household cleaning" },
            { id: "cleaning_vigorous", name: "Cleaning - Vigorous", met: 3.5, description: "Heavy cleaning, washing floors" },
            { id: "vacuuming", name: "Vacuuming", met: 3.5, description: "Vacuuming floors or carpet" },
            { id: "gardening_light", name: "Gardening - Light", met: 3.5, description: "Light gardening activities" },
            { id: "gardening_heavy", name: "Gardening - Heavy", met: 5.0, description: "Heavy gardening with digging" },
            { id: "mowing_lawn", name: "Mowing Lawn (power mower)", met: 4.5, description: "Mowing lawn with a power mower" },
            { id: "shoveling_snow", name: "Shoveling Snow", met: 6.0, description: "Shoveling snow by hand" }
        ],
        occupational: [
            { id: "construction", name: "Construction Work", met: 5.5, description: "General construction work" },
            { id: "carpentry", name: "Carpentry", met: 4.5, description: "General carpentry work" },
            { id: "farming", name: "Farming Activities", met: 5.0, description: "General farming activities" },
            { id: "forestry", name: "Forestry", met: 6.0, description: "Working in forestry" }
        ],
        transportation: [
            { id: "commuting_walking", name: "Commuting - Walking", met: 3.5, description: "Walking as transportation" },
            { id: "commuting_cycling", name: "Commuting - Cycling", met: 6.0, description: "Cycling as transportation" },
            { id: "carrying_load", name: "Carrying Heavy Load", met: 5.0, description: "Walking while carrying heavy objects" }
        ]
    }
};

// Convert the object structure to a flat array for easy selection
let flatExerciseList = [];
Object.keys(exerciseDatabase).forEach(category => {
    Object.keys(exerciseDatabase[category]).forEach(subCategory => {
        exerciseDatabase[category][subCategory].forEach(exercise => {
            flatExerciseList.push({
                ...exercise,
                category,
                subCategory
            });
        });
    });
});

// Get user information from localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { email: 'guest' };
const profileKey = currentUser.email ? `profile_${currentUser.email}` : 'profile_guest';
const profile = JSON.parse(localStorage.getItem(profileKey)) || {};

// Get user metrics for calorie calculations
const currentWeight = profile ? (parseFloat(profile.weightKg) || parseFloat(profile.weight) || 70) : 70; // in kg
const height = profile ? (parseFloat(profile.heightCm) || 170) : 170; // in cm
const age = profile ? (parseFloat(profile.age) || 30) : 30; // in years
const gender = profile ? (profile.gender || 'female') : 'female'; // male or female

// Constants for conversions
const kcalToKj = 4.184;
const kgToLbs = 2.20462;

// Track added exercises during this session
let sessionExercises = [];

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
 * @returns {number} BMR in calories/day
 */
function calculateBMR() {
    // Convert weight to kg if needed
    let weightKg = currentWeight;
    if (profile.weightUnit === 'lb') {
        weightKg = currentWeight / kgToLbs;
    }
    
    // Convert height to cm if needed
    let heightCm = height;
    if (profile.heightUnit === 'ft') {
        // Assuming height is stored as decimal feet
        heightCm = height * 30.48;
    }
    
    // Calculate BMR using Mifflin-St Jeor equation
    if (gender.toLowerCase() === 'male') {
        return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
        return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
}

/**
 * Calculate calories burned more accurately using MET formula with personal metrics
 * @param {number} met - MET value of the activity
 * @param {number} durationMinutes - Duration of activity in minutes
 * @returns {number} Calories burned
 */
function calculateCaloriesBurned(met, durationMinutes) {
    // Convert weight to kg if needed
    let weightKg = currentWeight;
    if (profile.weightUnit === 'lb') {
        weightKg = currentWeight / kgToLbs;
    }
    
    // MET formula: Calories = MET × weight(kg) × duration(hours)
    const durationHours = durationMinutes / 60;
    const caloriesBurned = met * weightKg * durationHours;
    
    return Math.round(caloriesBurned);
}

// Populate exercise dropdown with categorized options
function populateExerciseDropdown() {
    const exerciseTypeSelect = document.getElementById('exerciseType');
    if (!exerciseTypeSelect) return;
    
    // Clear existing options
    exerciseTypeSelect.innerHTML = '';
    
    // Add categories in a structured way
    Object.keys(exerciseDatabase).forEach(category => {
        // Create category label with proper formatting
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        const categoryOptgroup = document.createElement('optgroup');
        categoryOptgroup.label = categoryName;
        
        // Add subcategories as nested optgroups
        Object.keys(exerciseDatabase[category]).forEach(subCategory => {
            // Format subcategory name
            const subCategoryName = subCategory.replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            const exercises = exerciseDatabase[category][subCategory];
            exercises.forEach(exercise => {
                const option = document.createElement('option');
                option.value = exercise.id;
                option.textContent = exercise.name;
                option.setAttribute('data-met', exercise.met);
                option.setAttribute('data-category', category);
                option.setAttribute('data-subcategory', subCategory);
                categoryOptgroup.appendChild(option);
            });
        });
        
        exerciseTypeSelect.appendChild(categoryOptgroup);
    });
}

// Add event listener for form submission
document.addEventListener('DOMContentLoaded', function() {
    // Populate the exercise dropdown
    populateExerciseDropdown();
    
    // Event listener for the form
    const exerciseForm = document.getElementById('exerciseForm');
    if (exerciseForm) {
        exerciseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const exerciseDate = document.getElementById('exerciseDate').value;
            const exerciseType = document.getElementById('exerciseType').value;
            const duration = parseInt(document.getElementById('duration').value);
            const timeOfDay = document.getElementById('exerciseTime').value; // Get time of day
            
            // Find the selected exercise object
            const selectedExercise = flatExerciseList.find(ex => ex.id === exerciseType);
            if (!selectedExercise) {
                showNotification('Exercise not found', 'error');
                return;
            }
            
            // Calculate calories burned using enhanced calculation
            const caloriesBurned = calculateCaloriesBurned(selectedExercise.met, duration);
            
            // Validate date
            if (!exerciseDate) {
                showNotification('Please select a date', 'error');
                return;
            }
            
            // Convert date to day of the week (0-6, Monday-Sunday) for weekly planner
            const selectedDate = new Date(exerciseDate);
            let dayIndex = selectedDate.getDay() - 1; // Convert from 0-6 (Sunday-Saturday) to 0-6 (Monday-Sunday)
            if (dayIndex === -1) dayIndex = 6; // Sunday becomes 6 in our system
            
            // Save to localStorage with validation
            const userKey = currentUser && currentUser.email ? `planner_${currentUser.email}` : 'planner_guest';
            
            // Initialize arrays with proper validation
            let weeklyCalories, weeklyExercise, weeklyFoods;
            
            try {
                const caloriesData = localStorage.getItem(`${userKey}_calories`);
                weeklyCalories = caloriesData ? JSON.parse(caloriesData) : [0,0,0,0,0,0,0];
                // Validate array
                if (!Array.isArray(weeklyCalories) || weeklyCalories.length !== 7) {
                    weeklyCalories = [0,0,0,0,0,0,0];
                }
            } catch (e) {
                console.error('Error parsing calories data:', e);
                weeklyCalories = [0,0,0,0,0,0,0];
            }
            
            try {
                const exerciseData = localStorage.getItem(`${userKey}_exercise`);
                weeklyExercise = exerciseData ? JSON.parse(exerciseData) : [0,0,0,0,0,0,0];
                // Validate array
                if (!Array.isArray(weeklyExercise) || weeklyExercise.length !== 7) {
                    weeklyExercise = [0,0,0,0,0,0,0];
                }
            } catch (e) {
                console.error('Error parsing exercise data:', e);
                weeklyExercise = [0,0,0,0,0,0,0];
            }
            
            try {
                const foodsData = localStorage.getItem(`${userKey}_foods`);
                weeklyFoods = foodsData ? JSON.parse(foodsData) : [[],[],[],[],[],[],[]];
                // Validate array
                if (!Array.isArray(weeklyFoods) || weeklyFoods.length !== 7) {
                    weeklyFoods = [[],[],[],[],[],[],[]];
                }
            } catch (e) {
                console.error('Error parsing foods data:', e);
                weeklyFoods = [[],[],[],[],[],[],[]];
            }
            
            // Update storage for weekly planner (using day of week)
            weeklyExercise[dayIndex] += caloriesBurned;
            weeklyFoods[dayIndex].push({
                text: `${selectedExercise.name} (${duration} min, ${caloriesBurned} kcal)`,
                cal: caloriesBurned,
                type: 'exercise',
                timeOfDay: timeOfDay, // Add time of day
                exerciseId: selectedExercise.id, // Save the exercise ID for reference
                category: selectedExercise.category,
                subCategory: selectedExercise.subCategory
            });
            
            localStorage.setItem(`${userKey}_calories`, JSON.stringify(weeklyCalories));
            localStorage.setItem(`${userKey}_exercise`, JSON.stringify(weeklyExercise));
            localStorage.setItem(`${userKey}_foods`, JSON.stringify(weeklyFoods));
            
            // Track this exercise for the session
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            sessionExercises.push({
                name: selectedExercise.name,
                duration: duration,
                calories: caloriesBurned,
                timeOfDay: timeOfDay,
                day: days[dayIndex],
                date: exerciseDate,
                category: selectedExercise.category,
                subCategory: selectedExercise.subCategory,
                met: selectedExercise.met,
                id: selectedExercise.id
            });
            
            // Format date for display
            const dateObj = new Date(exerciseDate);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            // Save exercise with time of day to calendar
            saveExerciseToCalendarWithTimeOfDay(exerciseDate, {
                name: selectedExercise.name,
                duration: duration,
                calories: caloriesBurned,
                timeOfDay: timeOfDay,
                formattedDate: formattedDate,
                category: selectedExercise.category,
                subCategory: selectedExercise.subCategory,
                met: selectedExercise.met,
                id: selectedExercise.id
            });
            
            // Update summary display
            updateExerciseSummary();
            
            // Reset form
            document.getElementById('exerciseForm').reset();
            
            // Show a notification
            showNotification(`Added: ${selectedExercise.name} - ${caloriesBurned} kcal burned`);
        });
    }
});

// Update the exercise summary display
function updateExerciseSummary() {
    const summary = document.getElementById('exerciseSummary');
    
    if (sessionExercises.length === 0) {
        summary.textContent = '';
        summary.classList.remove('visible');
        return;
    }
    
    const lastExercise = sessionExercises[sessionExercises.length - 1];
    
    // Format time of day with first letter capitalized
    const timeFormatted = lastExercise.timeOfDay.charAt(0).toUpperCase() + lastExercise.timeOfDay.slice(1);
    
    // Format date for display
    const dateObj = new Date(lastExercise.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
    });
    
    // Enhanced summary with MET information
    summary.innerHTML = `
        <strong>Added:</strong> ${lastExercise.name} for ${lastExercise.duration} min on ${formattedDate} (${timeFormatted})
        <div class="calories-info">
            <span class="calorie-value">${lastExercise.calories} kcal</span> 
            <span class="calorie-detail">(${Math.round(lastExercise.calories * kcalToKj)} kJ burned)</span>
        </div>
        <div class="exercise-detail">
            <span class="met-info">MET: ${lastExercise.met}</span>
            <span class="category-info">${lastExercise.category.charAt(0).toUpperCase() + lastExercise.category.slice(1)}</span>
        </div>
    `;
    
    summary.classList.add('visible');
}

// Show a temporary notification
function showNotification(message, type = 'success') {
    // Check if notification container exists, otherwise create it
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
    
    // Determine color based on notification type
    let color, icon;
    switch (type) {
        case 'error':
            color = '#F44336';
            icon = 'fa-exclamation-circle';
            break;
        case 'warning':
            color = '#FF9800';
            icon = 'fa-exclamation-triangle';
            break;
        case 'info':
            color = '#2196F3';
            icon = 'fa-info-circle';
            break;
        case 'success':
        default:
            color = 'var(--primary-color, #4CAF50)';
            icon = 'fa-check-circle';
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    notification.style.backgroundColor = color;
    notification.style.color = 'white';
    notification.style.padding = '12px 15px';
    notification.style.marginTop = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Save exercise to calendar with time of day
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {Object} exerciseData - Exercise data including time of day
 */
function saveExerciseToCalendarWithTimeOfDay(dateStr, exerciseData) {
    try {
        // Parse the date string to get year-month and day
        const [yearMonth, day] = [dateStr.substring(0, 7), dateStr.substring(8, 10)];
        
        // Create storage key for this month's exercises
        const exerciseKey = `exercise_${currentUser.email}_${yearMonth}`;
        
        // Get existing exercises for this month or initialize
        const monthExercise = JSON.parse(localStorage.getItem(exerciseKey) || '{}');
        
        // Get exercises for this day or initialize
        if (!monthExercise[day]) {
            monthExercise[day] = {};
        }
        
        // Get time of day specific exercises or initialize
        const timeOfDay = exerciseData.timeOfDay || 'morning';
        if (!monthExercise[day][timeOfDay]) {
            monthExercise[day][timeOfDay] = [];
        }
        
        // Create exercise entry with enhanced data
        const exerciseEntry = {
            name: exerciseData.name,
            calories: exerciseData.calories,
            duration: exerciseData.duration,
            category: exerciseData.category,
            subCategory: exerciseData.subCategory,
            met: exerciseData.met,
            id: exerciseData.id
        };
        
        // Add to day's exercises for this time of day
        monthExercise[day][timeOfDay].push(exerciseEntry);
        
        // Save back to localStorage
        localStorage.setItem(exerciseKey, JSON.stringify(monthExercise));
        
        console.log(`Exercise saved to calendar: ${yearMonth}-${day}, ${timeOfDay}`, exerciseEntry);
    } catch (error) {
        console.error('Error saving exercise to calendar with time of day:', error);
    }
}

/**
 * Get user profile from localStorage
 * @returns {Object} User profile data
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        console.error(`Error retrieving ${key} from localStorage:`, error);
        return defaultValue;
    }
}

/**
 * Load and display exercise history
 */
function loadExerciseHistory() {
    const historyContainer = document.getElementById('exerciseHistoryContainer');
    if (!historyContainer) return;
    
    // Clear container
    historyContainer.innerHTML = '';
    
    try {
        // Get all exercise records for current user
        const currentUser = getFromStorage('currentUser');
        if (!currentUser || !currentUser.email) {
            historyContainer.innerHTML = '<p class="empty-state">Please log in to view your exercise history.</p>';
            return;
        }
        
        // Collect all exercises from localStorage
        const exercises = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        // Check the current month and the previous month
        for (let monthOffset = 0; monthOffset < 2; monthOffset++) {
            let year = currentYear;
            let month = currentMonth - monthOffset;
            
            if (month < 1) {
                month = 12 + month;
                year--;
            }
            
            const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
            const exerciseKey = `exercise_${currentUser.email}_${yearMonth}`;
            const monthData = getFromStorage(exerciseKey, {});
            
            // Process each day's exercises
            for (const day in monthData) {
                const dayData = monthData[day];
                
                // Process each time of day
                for (const timeOfDay in dayData) {
                    const timeExercises = dayData[timeOfDay];
                    
                    // Add each exercise to our array
                    if (Array.isArray(timeExercises)) {
                        timeExercises.forEach(ex => {
                            exercises.push({
                                ...ex,
                                date: `${yearMonth}-${day}`,
                                timeOfDay: timeOfDay
                            });
                        });
                    }
                }
            }
        }
        
        // Sort exercises by date (newest first)
        exercises.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Display exercises or empty state
        if (exercises.length === 0) {
            historyContainer.innerHTML = '<p class="empty-state">No exercise history found. Start tracking your workouts!</p>';
            return;
        }
        
        // Display the most recent 15 exercises
        const recentExercises = exercises.slice(0, 15);
        recentExercises.forEach(exercise => {
            // Format date for display
            const exerciseDate = new Date(exercise.date);
            const formattedDate = exerciseDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
            });
            
            // Format time of day with first letter capitalized
            const timeFormatted = exercise.timeOfDay.charAt(0).toUpperCase() + exercise.timeOfDay.slice(1);
            
            // Determine which icon to use based on exercise category and subcategory
            let iconClass = 'fa-running';
            
            if (exercise.category === 'cardio') {
                if (exercise.subCategory === 'cycling' || exercise.id?.includes('cycling')) {
                    iconClass = 'fa-biking';
                } else if (exercise.subCategory === 'walking' || exercise.id?.includes('walking')) {
                    iconClass = 'fa-walking';
                } else if (exercise.subCategory === 'swimming' || exercise.id?.includes('swimming')) {
                    iconClass = 'fa-swimmer';
                } else if (exercise.subCategory === 'elliptical' || exercise.id?.includes('elliptical')) {
                    iconClass = 'fa-ellipsis-h';
                } else if (exercise.subCategory === 'rowing' || exercise.id?.includes('rowing')) {
                    iconClass = 'fa-water';
                } else if (exercise.subCategory === 'jumping' || exercise.id?.includes('jumping')) {
                    iconClass = 'fa-arrow-up';
                }
            } else if (exercise.category === 'strength') {
                iconClass = 'fa-dumbbell';
            } else if (exercise.category === 'flexibility') {
                iconClass = 'fa-pray';
            } else if (exercise.category === 'sports') {
                iconClass = 'fa-basketball-ball';
                if (exercise.subCategory === 'racquet_sports') {
                    iconClass = 'fa-table-tennis';
                } else if (exercise.subCategory === 'outdoor_sports') {
                    iconClass = 'fa-mountain';
                }
            } else if (exercise.category === 'daily') {
                iconClass = 'fa-home';
                if (exercise.subCategory === 'occupational') {
                    iconClass = 'fa-briefcase';
                } else if (exercise.subCategory === 'transportation') {
                    iconClass = 'fa-car';
                }
            }
            
            // Create history item with enhanced visualization
            const historyItem = document.createElement('div');
            historyItem.className = 'exercise-history-item';
            
            // Set background color based on exercise category
            let categoryColor = '';
            switch (exercise.category) {
                case 'cardio':
                    categoryColor = 'rgba(76, 175, 80, 0.1)'; // Green
                    break;
                case 'strength':
                    categoryColor = 'rgba(33, 150, 243, 0.1)'; // Blue
                    break;
                case 'flexibility':
                    categoryColor = 'rgba(156, 39, 176, 0.1)'; // Purple
                    break;
                case 'sports':
                    categoryColor = 'rgba(255, 152, 0, 0.1)'; // Orange
                    break;
                case 'daily':
                    categoryColor = 'rgba(158, 158, 158, 0.1)'; // Grey
                    break;
                default:
                    categoryColor = 'rgba(76, 175, 80, 0.1)'; // Default green
            }
            
            historyItem.style.backgroundColor = categoryColor;
            
            historyItem.innerHTML = `
                <div class="exercise-history-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="exercise-history-details">
                    <h4 class="exercise-history-title">${exercise.name || 'Exercise'}</h4>
                    <div class="exercise-history-meta">
                        <span><i class="fas fa-calendar-day"></i> ${formattedDate}</span>
                        <span><i class="fas fa-clock"></i> ${timeFormatted}</span>
                        <span><i class="fas fa-stopwatch"></i> ${exercise.duration || '-'} min</span>
                    </div>
                </div>
                <div class="exercise-history-calories">
                    ${exercise.calories || 0} kcal
                </div>
            `;
            
            historyContainer.appendChild(historyItem);
        });
        
    } catch (error) {
        console.error('Error loading exercise history:', error);
        historyContainer.innerHTML = '<p class="empty-state">Error loading exercise history. Please try again.</p>';
    }
}

// Initialize based on URL parameters if available
document.addEventListener('DOMContentLoaded', function() {
    // Check URL for parameters from tracker page
    const urlParams = new URLSearchParams(window.location.search);
    const today = new Date().getDay(); // 0 is Sunday in JS
    const dayIndex = today === 0 ? 6 : today - 1; // Convert to our 0-based index (Monday = 0)
    
    // Set up tab navigation
    setupTabNavigation();
    
    // Load exercise history
    loadExerciseHistory();
    
    // Set default date to today
    const dateInput = document.getElementById('exerciseDate');
    if (dateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        dateInput.value = formattedDate;
    }
    
    // Add filtering capability to exercise dropdown
    addExerciseFilteringFunctionality();
});

/**
 * Set up tab navigation functionality
 */
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show selected tab content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).style.display = 'block';
        });
    });
}

/**
 * Add filtering functionality to exercise dropdown
 */
function addExerciseFilteringFunctionality() {
    // Check if we need to add a search field
    const exerciseFormContainer = document.querySelector('.form-group:has(#exerciseType)');
    if (!exerciseFormContainer) return;
    
    // Add search field before the dropdown
    const searchDiv = document.createElement('div');
    searchDiv.className = 'exercise-search-container';
    searchDiv.innerHTML = `
        <input type="text" id="exerciseSearch" placeholder="Search for an exercise..." class="exercise-search-input">
        <div class="search-icon">
            <i class="fas fa-search"></i>
        </div>
    `;
    
    exerciseFormContainer.insertBefore(searchDiv, document.getElementById('exerciseType'));
    
    // Add event listener to the search field
    const searchInput = document.getElementById('exerciseSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterExerciseOptions(searchTerm);
        });
    }
}

/**
 * Filter exercise options based on search term
 * @param {string} searchTerm - Term to search for
 */
function filterExerciseOptions(searchTerm) {
    const exerciseTypeSelect = document.getElementById('exerciseType');
    if (!exerciseTypeSelect) return;
    
    // Get all optgroups and options
    const optgroups = exerciseTypeSelect.querySelectorAll('optgroup');
    
    optgroups.forEach(optgroup => {
        let visibleOptions = 0;
        const options = optgroup.querySelectorAll('option');
        
        options.forEach(option => {
            const optionText = option.textContent.toLowerCase();
            const matchesSearch = optionText.includes(searchTerm);
            
            // Show/hide option based on search
            if (matchesSearch) {
                option.style.display = '';
                visibleOptions++;
            } else {
                option.style.display = 'none';
            }
        });
        
        // Show/hide optgroup based on visible options
        optgroup.style.display = visibleOptions > 0 ? '' : 'none';
    });
}
