document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const age = parseInt(document.getElementById('age').value);
    let weight = parseFloat(document.getElementById('weight').value);
    const weightUnit = document.getElementById('weightUnit').value;
    let height = parseFloat(document.getElementById('height').value);
    const heightUnit = document.getElementById('heightUnit').value;
    const heightInches = parseFloat(document.getElementById('heightInches').value) || 0;
    const gender = document.getElementById('gender').value;
    const activity = parseFloat(document.getElementById('activity').value);
    let goal = parseFloat(document.getElementById('goal').value);
    const goalUnit = document.getElementById('goalUnit').value;
    const time = parseFloat(document.getElementById('time').value);
    const timeUnit = document.getElementById('timeUnit').value;

    // Conversions to metric
    if (weightUnit === 'lb') {
        weight = weight / 2.20462; // lb to kg
    }
    if (heightUnit === 'ft') {
        height = (height * 30.48) + (heightInches * 2.54); // ft + inches to cm
    }
    if (goalUnit === 'lb') {
        goal = goal / 2.20462; // lb to kg
    }
    const timeWeeks = timeUnit === 'weeks' ? time : time * 4.345; // Avg 4.345 weeks/month

    // BMR Calculation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activity;

    window.location.href = `tracker.html?bmr=${Math.round(bmr)}&tdee=${Math.round(tdee)}&weight=${weight}&goal=${goal}&time=${timeWeeks}`;
});

// Toggle inches input visibility based on height unit
document.getElementById('heightUnit').addEventListener('change', function() {
    const heightInchesInput = document.getElementById('heightInches');
    if (this.value === 'ft') {
        heightInchesInput.style.display = 'inline-block';
    } else {
        heightInchesInput.style.display = 'none';
        heightInchesInput.value = ''; // Reset inches when switching to cm
    }
});