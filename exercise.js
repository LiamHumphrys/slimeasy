const urlParams = new URLSearchParams(window.location.search);
const bmr = parseInt(urlParams.get('bmr'));
const dailyGoalBase = parseInt(urlParams.get('dailyGoal'));
const currentWeight = parseFloat(urlParams.get('weight'));
const goalWeight = parseFloat(urlParams.get('goal'));
const tdee = parseInt(urlParams.get('tdee')); // Added missing tdee
const timeWeeks = parseFloat(localStorage.getItem('timeWeeks')) || parseFloat(urlParams.get('time')); // Fallback
const kcalToKj = 4.184;

let weeklyCalories = JSON.parse(localStorage.getItem('weeklyCalories')) || [0, 0, 0, 0, 0, 0, 0];
let weeklyExercise = JSON.parse(localStorage.getItem('weeklyExercise')) || [0, 0, 0, 0, 0, 0, 0];
let weeklyFoods = JSON.parse(localStorage.getItem('weeklyFoods')) || [[], [], [], [], [], [], []];

// Expanded Exercise Database (50+ Exercises)
const exercises = [
    { name: "Walking (slow, 2 mph)", met: 2.0 },
    { name: "Walking (brisk, 3.5 mph)", met: 4.3 },
    { name: "Walking (very brisk, 4.5 mph)", met: 6.0 },
    { name: "Running (5 mph)", met: 8.0 },
    { name: "Running (6 mph)", met: 9.8 },
    { name: "Running (7 mph)", met: 11.5 },
    { name: "Running (8 mph)", met: 13.5 },
    { name: "Cycling (10-12 mph)", met: 6.0 },
    { name: "Cycling (12-14 mph)", met: 8.0 },
    { name: "Cycling (16-19 mph)", met: 10.0 },
    { name: "Cycling (20+ mph)", met: 12.0 },
    { name: "Swimming (slow)", met: 4.5 },
    { name: "Swimming (moderate)", met: 6.0 },
    { name: "Swimming (vigorous)", met: 8.0 },
    { name: "Weightlifting (light)", met: 3.0 },
    { name: "Weightlifting (moderate)", met: 4.5 },
    { name: "Weightlifting (vigorous)", met: 6.0 },
    { name: "Yoga (Hatha)", met: 2.5 },
    { name: "Yoga (Vinyasa)", met: 4.0 },
    { name: "Pilates", met: 3.0 },
    { name: "Tennis (singles)", met: 8.0 },
    { name: "Tennis (doubles)", met: 6.0 },
    { name: "Basketball (casual)", met: 6.0 },
    { name: "Basketball (game)", met: 8.0 },
    { name: "Soccer (casual)", met: 7.0 },
    { name: "Soccer (competitive)", met: 10.0 },
    { name: "Hiking (flat)", met: 6.0 },
    { name: "Hiking (uphill)", met: 7.5 },
    { name: "Jump Rope (slow)", met: 8.0 },
    { name: "Jump Rope (fast)", met: 12.0 },
    { name: "Rowing (moderate)", met: 7.0 },
    { name: "Rowing (vigorous)", met: 8.5 },
    { name: "Dancing (slow)", met: 3.0 },
    { name: "Dancing (moderate)", met: 4.5 },
    { name: "Dancing (vigorous)", met: 6.0 },
    { name: "Boxing (sparring)", met: 7.8 },
    { name: "Boxing (in ring)", met: 9.0 },
    { name: "Martial Arts (moderate)", met: 5.0 },
    { name: "Martial Arts (vigorous)", met: 10.0 },
    { name: "Golf (walking)", met: 4.5 },
    { name: "Volleyball (casual)", met: 4.0 },
    { name: "Volleyball (competitive)", met: 8.0 },
    { name: "Badminton", met: 5.5 },
    { name: "Stair Climbing (slow)", met: 4.0 },
    { name: "Stair Climbing (fast)", met: 8.0 },
    { name: "Elliptical (moderate)", met: 5.0 },
    { name: "Elliptical (vigorous)", met: 8.0 },
    { name: "Gardening (light)", met: 3.0 },
    { name: "Gardening (heavy)", met: 5.0 },
    { name: "House Cleaning (light)", met: 2.5 },
    { name: "House Cleaning (heavy)", met: 4.0 }
];

// Intensity Multipliers
const intensityMultipliers = { low: 0.8, medium: 1.0, high: 1.2 };

// Populate Exercise Dropdown
const exerciseSelect = document.getElementById('exerciseType');
exercises.forEach(ex => {
    const option = document.createElement('option');
    option.value = ex.met;
    option.textContent = ex.name;
    exerciseSelect.appendChild(option);
});

// Calculate and Update Burn Estimate
function updateBurnEstimate() {
    const met = parseFloat(document.getElementById('exerciseType').value);
    const intensity = document.getElementById('intensity').value;
    const duration = parseInt(document.getElementById('duration').value) || 0;
    const metAdjusted = met * intensityMultipliers[intensity];
    const caloriesBurned = Math.round((metAdjusted * (bmr / 24) * (duration / 60)));
    document.getElementById('burnEstimate').textContent = caloriesBurned;
    document.getElementById('burnKj').textContent = Math.round(caloriesBurned * kcalToKj);
}

document.getElementById('intensity').addEventListener('change', updateBurnEstimate);
document.getElementById('duration').addEventListener('input', updateBurnEstimate);
document.getElementById('exerciseType').addEventListener('change', updateBurnEstimate);

// Exercise Form Submission
document.getElementById('exerciseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const dayIndex = parseInt(document.getElementById('exerciseDay').value);
    const exerciseName = document.getElementById('exerciseType').options[document.getElementById('exerciseType').selectedIndex].text;
    const intensity = document.getElementById('intensity').value;
    const duration = parseInt(document.getElementById('duration').value);
    const met = parseFloat(document.getElementById('exerciseType').value);
    const metAdjusted = met * intensityMultipliers[intensity];
    const caloriesBurned = Math.round((metAdjusted * (bmr / 24) * (duration / 60)));
    const exerciseText = `${exerciseName} (${intensity}, ${duration} min, ${caloriesBurned} kcal)`;
    
    weeklyExercise[dayIndex] += caloriesBurned;
    weeklyFoods[dayIndex].push({ text: exerciseText, cal: -caloriesBurned });
    localStorage.setItem('weeklyCalories', JSON.stringify(weeklyCalories));
    localStorage.setItem('weeklyExercise', JSON.stringify(weeklyExercise));
    localStorage.setItem('weeklyFoods', JSON.stringify(weeklyFoods));
    localStorage.setItem('timeWeeks', timeWeeks.toString()); // Ensure persistence
    
    this.reset();
    updateBurnEstimate();
});

// Back to Tracker - Fixed
document.getElementById('backToTracker').addEventListener('click', function() {
    window.location.href = `tracker.html?bmr=${bmr}&tdee=${tdee}&weight=${currentWeight}&goal=${goalWeight}&time=${timeWeeks}`;
});

// Initial Estimate
updateBurnEstimate();