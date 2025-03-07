document.getElementById('heightUnit').addEventListener('change', function() {
    const heightInches = document.getElementById('heightInches');
    heightInches.style.display = this.value === 'ft' ? 'inline' : 'none';
});

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const age = parseInt(document.getElementById('age').value);
    let weight = parseFloat(document.getElementById('weight').value);
    let height = parseFloat(document.getElementById('height').value);
    const heightInches = parseFloat(document.getElementById('heightInches').value) || 0;
    const gender = document.getElementById('gender').value;
    const activity = parseFloat(document.getElementById('activity').value);
    let goal = parseFloat(document.getElementById('goal').value);
    let time = parseFloat(document.getElementById('time').value);

    const weightUnit = document.getElementById('weightUnit').value;
    const heightUnit = document.getElementById('heightUnit').value;
    const goalUnit = document.getElementById('goalUnit').value;
    const timeUnit = document.getElementById('timeUnit').value;

    if (weightUnit === 'lb') weight *= 0.453592;
    if (heightUnit === 'ft') height = (height * 30.48) + (heightInches * 2.54);
    if (goalUnit === 'lb') goal *= 0.453592;
    if (timeUnit === 'months') time *= 4.345;

    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activity;

    // Save profile data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const profileKey = `profile_${currentUser.email}`;
    const profileData = {
        age,
        weight: parseFloat(document.getElementById('weight').value),
        weightUnit,
        height: parseFloat(document.getElementById('height').value),
        heightUnit,
        heightInches,
        gender,
        activity,
        goal: parseFloat(document.getElementById('goal').value),
        goalUnit,
        time: parseFloat(document.getElementById('time').value),
        timeUnit,
        bmr,
        tdee
    };
    localStorage.setItem(profileKey, JSON.stringify(profileData));

    window.location.href = `tracker.html?bmr=${bmr}&tdee=${tdee}&weight=${weight}&goal=${goal}&time=${time}`;
});
