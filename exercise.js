const exercises = {
    "running_5mph": 8, "running_6mph": 10, "running_7mph": 12,
    "walking_3mph": 3, "walking_4mph": 4, "walking_5mph": 5,
    "cycling_10mph": 6, "cycling_12mph": 8, "cycling_14mph": 10
};

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const profileKey = `profile_${currentUser.email}`;
const profile = JSON.parse(localStorage.getItem(profileKey));
const currentWeight = profile ? profile.weight : 70;

document.getElementById('exerciseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const dayIndex = parseInt(document.getElementById('exerciseDay').value);
    const exerciseType = document.getElementById('exerciseType').value;
    const duration = parseInt(document.getElementById('duration').value);

    const met = exercises[exerciseType];
    const caloriesBurned = Math.round(met * currentWeight * (duration / 60));
    const exerciseName = document.getElementById('exerciseType').options[document.getElementById('exerciseType').selectedIndex].text.split(' - ')[0];

    const userKey = currentUser ? `planner_${currentUser.email}` : 'planner_guest';
    let weeklyCalories = JSON.parse(localStorage.getItem(`${userKey}_calories`) || '[0,0,0,0,0,0,0]');
    let weeklyExercise = JSON.parse(localStorage.getItem(`${userKey}_exercise`) || '[0,0,0,0,0,0,0]');
    let weeklyFoods = JSON.parse(localStorage.getItem(`${userKey}_foods`) || '[[],[],[],[],[],[],[]]');

    weeklyExercise[dayIndex] += caloriesBurned;
    weeklyFoods[dayIndex].push({
        text: `${exerciseName} (${duration} min, ${caloriesBurned} kcal)`,
        cal: caloriesBurned,
        type: 'exercise'
    });

    localStorage.setItem(`${userKey}_calories`, JSON.stringify(weeklyCalories));
    localStorage.setItem(`${userKey}_exercise`, JSON.stringify(weeklyExercise));
    localStorage.setItem(`${userKey}_foods`, JSON.stringify(weeklyFoods));

    document.getElementById('exerciseSummary').textContent = `Last exercise added: ${exerciseName} - ${caloriesBurned} kcal burned`;
    document.getElementById('exerciseForm').reset();
});
