/**
 * SlimEasy AI Buddy
 * Enhanced personalized AI assistant that provides recommendations based on user data
 */

// Meal database with nutritional information
const mealDatabase = {
    breakfast: [
        {
            name: "Greek Yogurt with Berries and Honey",
            calories: 240,
            protein: 18,
            carbs: 32,
            fat: 5,
            fiber: 4,
            prepTime: 5,
            ingredients: ["1 cup Greek yogurt", "1/2 cup mixed berries", "1 tsp honey", "Optional: 2 tbsp granola"],
            tags: ["high-protein", "quick", "vegetarian"]
        },
        {
            name: "Avocado Toast with Egg",
            calories: 320,
            protein: 14,
            carbs: 30,
            fat: 18,
            fiber: 6,
            prepTime: 10,
            ingredients: ["1 slice whole grain bread", "1/2 avocado", "1 egg", "Salt & pepper to taste", "Red pepper flakes (optional)"],
            tags: ["high-protein", "vegetarian"]
        },
        {
            name: "Overnight Oats with Apples and Cinnamon",
            calories: 290,
            protein: 12,
            carbs: 48,
            fat: 6,
            fiber: 8,
            prepTime: 5,
            ingredients: ["1/2 cup rolled oats", "1/2 cup milk (any type)", "1/2 apple, diced", "1/2 tsp cinnamon", "1 tbsp maple syrup", "1 tbsp chia seeds"],
            tags: ["vegan", "prep-ahead", "high-fiber"]
        },
        {
            name: "Protein Smoothie Bowl",
            calories: 310,
            protein: 24,
            carbs: 40,
            fat: 5,
            fiber: 6,
            prepTime: 5,
            ingredients: ["1 banana", "1 scoop protein powder", "1/2 cup frozen berries", "1/2 cup spinach", "1/4 cup almond milk", "Toppings: granola, seeds, coconut flakes"],
            tags: ["high-protein", "quick", "vegetarian"]
        },
        {
            name: "Vegetable Omelette",
            calories: 280,
            protein: 19,
            carbs: 6,
            fat: 20,
            fiber: 2,
            prepTime: 15,
            ingredients: ["2 eggs", "1/4 cup diced bell peppers", "1/4 cup spinach", "2 tbsp diced onions", "1 oz cheese", "Salt & pepper to taste"],
            tags: ["high-protein", "low-carb", "vegetarian", "keto-friendly"]
        },
        {
            name: "Banana Peanut Butter Toast",
            calories: 350,
            protein: 12,
            carbs: 45,
            fat: 14,
            fiber: 6,
            prepTime: 5,
            ingredients: ["1 slice whole grain bread", "1 tbsp peanut butter", "1 banana, sliced", "1 tsp cinnamon"],
            tags: ["vegetarian", "quick", "high-energy"]
        },
        {
            name: "Chia Seed Pudding",
            calories: 220,
            protein: 8,
            carbs: 18,
            fat: 12,
            fiber: 10,
            prepTime: 5,
            ingredients: ["3 tbsp chia seeds", "1 cup almond milk", "1 tsp vanilla extract", "1 tbsp maple syrup", "Toppings: berries, nuts"],
            tags: ["vegan", "prep-ahead", "high-fiber"]
        }
    ],
    lunch: [
        {
            name: "Mediterranean Quinoa Salad",
            calories: 380,
            protein: 14,
            carbs: 48,
            fat: 16,
            fiber: 8,
            prepTime: 15,
            ingredients: ["1 cup cooked quinoa", "1/2 cucumber, diced", "1/2 cup cherry tomatoes", "1/4 cup olives", "2 tbsp feta cheese", "1 tbsp olive oil", "Lemon juice"],
            tags: ["vegetarian", "high-fiber", "meal-prep"]
        },
        {
            name: "Chicken Avocado Wrap",
            calories: 420,
            protein: 28,
            carbs: 32,
            fat: 22,
            fiber: 6,
            prepTime: 10,
            ingredients: ["1 whole wheat tortilla", "3 oz grilled chicken breast", "1/2 avocado", "1/2 cup mixed greens", "1 tbsp Greek yogurt spread", "Lime juice"],
            tags: ["high-protein", "quick"]
        },
        {
            name: "Lentil Soup with Vegetables",
            calories: 290,
            protein: 16,
            carbs: 42,
            fat: 4,
            fiber: 14,
            prepTime: 30,
            ingredients: ["1 cup cooked lentils", "1/2 cup diced carrots", "1/2 cup diced celery", "1/2 cup diced onions", "2 cups vegetable broth", "Spices: cumin, paprika"],
            tags: ["vegan", "high-fiber", "high-protein", "meal-prep"]
        },
        {
            name: "Turkey and Veggie Lettuce Wraps",
            calories: 250,
            protein: 24,
            carbs: 15,
            fat: 10,
            fiber: 4,
            prepTime: 15,
            ingredients: ["4 oz ground turkey", "1/2 cup diced bell peppers", "1/4 cup diced onions", "1 tbsp soy sauce", "Large lettuce leaves", "1 tsp sriracha (optional)"],
            tags: ["high-protein", "low-carb", "keto-friendly"]
        },
        {
            name: "Chickpea Salad Sandwich",
            calories: 380,
            protein: 15,
            carbs: 50,
            fat: 12,
            fiber: 10,
            prepTime: 10,
            ingredients: ["1 cup chickpeas, mashed", "1 tbsp Greek yogurt", "1 tsp Dijon mustard", "1/4 cup diced celery", "2 slices whole grain bread", "Lettuce and tomato"],
            tags: ["vegetarian", "high-fiber", "quick"]
        },
        {
            name: "Tuna Salad with Whole Grain Crackers",
            calories: 310,
            protein: 28,
            carbs: 24,
            fat: 12,
            fiber: 6,
            prepTime: 10,
            ingredients: ["1 can tuna (in water)", "1 tbsp Greek yogurt", "1 tsp Dijon mustard", "1/4 cup diced celery", "8 whole grain crackers", "Lemon juice"],
            tags: ["high-protein", "quick"]
        },
        {
            name: "Black Bean and Sweet Potato Bowl",
            calories: 340,
            protein: 12,
            carbs: 58,
            fat: 6,
            fiber: 14,
            prepTime: 25,
            ingredients: ["1/2 cup black beans", "1 medium sweet potato, roasted", "1/4 cup corn", "1/4 cup diced red onion", "Cilantro", "Lime juice", "1 tsp cumin"],
            tags: ["vegan", "high-fiber", "meal-prep"]
        }
    ],
    dinner: [
        {
            name: "Grilled Salmon with Roasted Vegetables",
            calories: 380,
            protein: 32,
            carbs: 18,
            fat: 18,
            fiber: 6,
            prepTime: 30,
            ingredients: ["4 oz salmon fillet", "1 cup mixed vegetables (broccoli, carrots)", "1 tbsp olive oil", "1 lemon", "Herbs: dill, parsley", "Salt & pepper"],
            tags: ["high-protein", "omega-3", "keto-friendly"]
        },
        {
            name: "Turkey Meatballs with Zucchini Noodles",
            calories: 350,
            protein: 30,
            carbs: 12,
            fat: 18,
            fiber: 4,
            prepTime: 25,
            ingredients: ["4 oz ground turkey", "1 egg (for meatballs)", "1/4 cup breadcrumbs", "2 medium zucchini, spiralized", "1/2 cup marinara sauce", "2 tbsp grated Parmesan"],
            tags: ["high-protein", "low-carb"]
        },
        {
            name: "Chickpea and Vegetable Curry",
            calories: 310,
            protein: 12,
            carbs: 48,
            fat: 8,
            fiber: 12,
            prepTime: 25,
            ingredients: ["1 cup chickpeas", "1 cup mixed vegetables", "1/2 cup coconut milk", "1 tbsp curry powder", "1 tsp turmeric", "1/2 cup brown rice"],
            tags: ["vegan", "high-fiber", "meal-prep"]
        },
        {
            name: "Stuffed Bell Peppers with Quinoa",
            calories: 320,
            protein: 18,
            carbs: 38,
            fat: 10,
            fiber: 8,
            prepTime: 40,
            ingredients: ["2 bell peppers", "1/2 cup cooked quinoa", "1/4 cup black beans", "1/4 cup corn", "1/4 cup diced tomatoes", "1/4 cup cheese", "Taco seasoning"],
            tags: ["vegetarian", "high-fiber", "meal-prep"]
        },
        {
            name: "Baked Chicken with Sweet Potato",
            calories: 390,
            protein: 34,
            carbs: 30,
            fat: 12,
            fiber: 5,
            prepTime: 35,
            ingredients: ["4 oz chicken breast", "1 medium sweet potato", "1 cup Brussels sprouts", "1 tbsp olive oil", "Herbs: rosemary, thyme", "Salt & pepper"],
            tags: ["high-protein", "gluten-free"]
        },
        {
            name: "Shrimp Stir-Fry with Brown Rice",
            calories: 360,
            protein: 26,
            carbs: 42,
            fat: 8,
            fiber: 6,
            prepTime: 20,
            ingredients: ["4 oz shrimp", "1 cup mixed vegetables", "1/2 cup brown rice", "1 tbsp low-sodium soy sauce", "1 tsp ginger", "1 clove garlic"],
            tags: ["high-protein", "quick"]
        },
        {
            name: "Vegetable and Bean Chili",
            calories: 300,
            protein: 14,
            carbs: 45,
            fat: 6,
            fiber: 16,
            prepTime: 30,
            ingredients: ["1/2 cup kidney beans", "1/2 cup black beans", "1 cup diced tomatoes", "1/2 cup bell peppers", "1/2 cup onions", "Spices: chili powder, cumin, paprika"],
            tags: ["vegan", "high-fiber", "meal-prep"]
        }
    ],
    snacks: [
        {
            name: "Apple with Almond Butter",
            calories: 200,
            protein: 5,
            carbs: 25,
            fat: 10,
            fiber: 5,
            prepTime: 2,
            ingredients: ["1 medium apple", "1 tbsp almond butter"],
            tags: ["vegetarian", "quick", "low-calorie"]
        },
        {
            name: "Cottage Cheese with Pineapple",
            calories: 180,
            protein: 20,
            carbs: 18,
            fat: 2,
            fiber: 2,
            prepTime: 2,
            ingredients: ["3/4 cup cottage cheese", "1/2 cup pineapple chunks"],
            tags: ["high-protein", "quick", "vegetarian"]
        },
        {
            name: "Veggie Sticks with Hummus",
            calories: 150,
            protein: 5,
            carbs: 18,
            fat: 7,
            fiber: 6,
            prepTime: 5,
            ingredients: ["1 cup veggie sticks (carrot, cucumber, bell pepper)", "3 tbsp hummus"],
            tags: ["vegan", "low-calorie", "high-fiber"]
        },
        {
            name: "Trail Mix",
            calories: 220,
            protein: 6,
            carbs: 18,
            fat: 14,
            fiber: 3,
            prepTime: 1,
            ingredients: ["1/4 cup mixed nuts", "1 tbsp dried fruit", "1 tsp dark chocolate chips"],
            tags: ["vegetarian", "high-energy", "portable"]
        },
        {
            name: "Hard-Boiled Eggs",
            calories: 140,
            protein: 12,
            carbs: 0,
            fat: 10,
            fiber: 0,
            prepTime: 15,
            ingredients: ["2 hard-boiled eggs", "Salt & pepper to taste"],
            tags: ["high-protein", "low-carb", "keto-friendly"]
        },
        {
            name: "Yogurt Parfait",
            calories: 190,
            protein: 10,
            carbs: 26,
            fat: 4,
            fiber: 3,
            prepTime: 5,
            ingredients: ["1/2 cup Greek yogurt", "1/4 cup berries", "1 tbsp granola"],
            tags: ["vegetarian", "quick", "high-protein"]
        }
    ]
};

// AI Buddy conversation history
let conversationHistory = [];

// Flag to determine if AI Buddy should proactively suggest meals
let proactiveSuggestionEnabled = true;

/**
 * Initialize AI Buddy functionality
 */
function initializeAIBuddy() {
    // Get UI elements
    const aiBuddyBtn = document.getElementById('aiBuddyBtn');
    const aiBuddyModal = document.getElementById('aiBuddyModal');
    const aiBuddyClose = document.getElementById('aiBuddyClose');
    const aiMessageInput = document.getElementById('aiMessageInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiChatMessages = document.getElementById('aiChatMessages');
    const aiTyping = document.getElementById('aiTyping');
    
    // If key elements missing, exit
    if (!aiBuddyBtn || !aiBuddyModal) return;
    
    // Open AI Buddy modal
    aiBuddyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        aiBuddyModal.classList.add('show');
        aiMessageInput.focus();
        
        // Generate personalized AI suggestions
        generatePersonalizedSuggestions();
        
        // Show an initial personalized greeting if the chat is empty
        if (aiChatMessages && aiChatMessages.children.length === 0) {
            const greeting = generatePersonalizedGreeting();
            addMessageToChat('buddy', greeting);
            // Add to conversation history
            conversationHistory.push({ role: 'buddy', message: greeting });
        }
    });
    
    // Enable AI Buddy notification badge
    setupAIBuddyBadge();
    
    // Close AI Buddy modal
    aiBuddyClose.addEventListener('click', function() {
        aiBuddyModal.classList.remove('show');
    });
    
    // Close when clicking outside the modal content
    aiBuddyModal.addEventListener('click', function(e) {
        if (e.target === aiBuddyModal) {
            aiBuddyModal.classList.remove('show');
        }
    });
    
    // Send message on button click
    aiSendBtn.addEventListener('click', sendAIMessage);
    
    // Send message on Enter key
    aiMessageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendAIMessage();
        }
    });
    
    // Check if we should trigger proactive meal suggestions
    checkForProactiveSuggestions();
}

/**
 * Set up the notification badge for AI Buddy that shows new suggestions
 */
function setupAIBuddyBadge() {
    const aiBuddyBtn = document.getElementById('aiBuddyBtn');
    if (!aiBuddyBtn) return;
    
    // Add badge element if it doesn't exist
    let badge = aiBuddyBtn.querySelector('.ai-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'ai-badge';
        badge.textContent = '1';
        aiBuddyBtn.appendChild(badge);
    }
    
    // Show the badge for new suggestion
    badge.classList.add('show');
    
    // Hide badge when clicking the AI button
    aiBuddyBtn.addEventListener('click', function() {
        badge.classList.remove('show');
    });
}

/**
 * Send a message to the AI Buddy
 */
function sendAIMessage() {
    const aiMessageInput = document.getElementById('aiMessageInput');
    const aiChatMessages = document.getElementById('aiChatMessages');
    const aiTyping = document.getElementById('aiTyping');
    
    if (!aiMessageInput || !aiChatMessages || !aiTyping) return;
    
    const message = aiMessageInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat('user', message);
    
    // Store in conversation history
    conversationHistory.push({ role: 'user', message: message });
    
    // Clear input
    aiMessageInput.value = '';
    
    // Show typing indicator
    aiTyping.style.display = 'flex';
    
    // Scroll to bottom
    scrollAIChat();
    
    // Generate AI response after a delay (simulating processing)
    setTimeout(() => {
        // Hide typing indicator
        aiTyping.style.display = 'none';
        
        // Generate response based on message and user data
        const response = generateAIResponse(message);
        
        // Add AI response to chat
        addMessageToChat('buddy', response);
        
        // Store in conversation history
        conversationHistory.push({ role: 'buddy', message: response });
        
        // Scroll to bottom
        scrollAIChat();
    }, 1500);
}

/**
 * Add a message to the chat
 * @param {string} type - 'user' or 'buddy'
 * @param {string} text - Message text
 */
function addMessageToChat(type, text) {
    const aiChatMessages = document.getElementById('aiChatMessages');
    if (!aiChatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;
    
    // Render links as clickable
    const textWithLinks = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    messageDiv.innerHTML = textWithLinks;
    
    aiChatMessages.appendChild(messageDiv);
}

/**
 * Scroll the chat container to the bottom
 */
function scrollAIChat() {
    const aiChatMessages = document.getElementById('aiChatMessages');
    if (aiChatMessages) {
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }
}

/**
 * Generate personalized AI suggestions based on user data
 */
function generatePersonalizedSuggestions() {
    const aiChatMessages = document.getElementById('aiChatMessages');
    if (!aiChatMessages) return;
    
    // Get current user data
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return;
    
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    
    // Get daily calorie information
    const caloriesInfo = getCurrentCaloriesInfo();
    
    // Don't add suggestions if they already exist
    if (document.querySelector('.ai-suggestions')) return;
    
    // Create a wrapper for suggestions
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'ai-suggestions';
    
    // Add heading
    const heading = document.createElement('div');
    heading.style.margin = '20px 0 15px';
    heading.style.fontWeight = 'bold';
    heading.style.color = 'var(--accent-color)';
    heading.textContent = 'Personalized Recommendations';
    suggestionsDiv.appendChild(heading);
    
    // Create meal suggestion based on remaining calories
    const mealSuggestion = createSuggestion(
        'Meal Suggestion',
        generateSmartMealSuggestion(caloriesInfo),
        `Based on your ${caloriesInfo.remaining > 0 ? 'remaining' : 'exceeded'} calories for today`
    );
    suggestionsDiv.appendChild(mealSuggestion);
    
    // Create exercise suggestion
    const exerciseSuggestion = createSuggestion(
        'Exercise Tip',
        generateExerciseSuggestion(profile),
        'Based on your activity level'
    );
    suggestionsDiv.appendChild(exerciseSuggestion);
    
    // Create motivation suggestion
    const motivationSuggestion = createSuggestion(
        'Progress Insight',
        generateProgressInsight(),
        'Keep going!'
    );
    suggestionsDiv.appendChild(motivationSuggestion);
    
    // Add suggestions to chat
    aiChatMessages.appendChild(suggestionsDiv);
    
    // Scroll to show suggestions
    scrollAIChat();
}

/**
 * Create a suggestion element
 * @param {string} title - Suggestion title
 * @param {string} content - Suggestion content
 * @param {string} meta - Metadata or context for the suggestion
 * @returns {HTMLElement} The suggestion element
 */
function createSuggestion(title, content, meta) {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'ai-suggestion';
    
    // Create title with icon based on type
    const titleDiv = document.createElement('div');
    titleDiv.className = 'ai-suggestion-title';
    
    // Add icon based on title
    let icon = 'lightbulb';
    if (title.includes('Meal')) icon = 'utensils';
    if (title.includes('Exercise')) icon = 'running';
    if (title.includes('Progress')) icon = 'chart-line';
    
    titleDiv.innerHTML = `<i class="fas fa-${icon}"></i> ${title}`;
    
    // Create content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'ai-suggestion-content';
    contentDiv.innerHTML = content;
    
    // Create metadata section
    const metaDiv = document.createElement('div');
    metaDiv.className = 'ai-suggestion-meta';
    metaDiv.textContent = meta;
    
    // Add action button if appropriate
    if (title.includes('Meal')) {
        const actionBtn = document.createElement('button');
        actionBtn.className = 'ai-suggestion-action';
        actionBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add to Tracker';
        actionBtn.onclick = function() {
            // Extract the meal name from content
            const mealName = content.split(":")[0].trim();
            // Add to food tracker with estimated calories
            addMealToTracker(mealName, getCaloriesFromMealSuggestion(content));
            // Show confirmation
            showNotification('Meal added to your food tracker!', 'success');
        };
        suggestionDiv.appendChild(actionBtn);
    }
    
    // Assemble suggestion
    suggestionDiv.appendChild(titleDiv);
    suggestionDiv.appendChild(contentDiv);
    suggestionDiv.appendChild(metaDiv);
    
    return suggestionDiv;
}

/**
 * Extract calories from meal suggestion
 * @param {string} mealText - Meal suggestion text
 * @returns {number} Estimated calories
 */
function getCaloriesFromMealSuggestion(mealText) {
    // Look for calorie information in format like "(~320 calories)"
    const calorieMatch = mealText.match(/\(~(\d+) calories\)/);
    if (calorieMatch && calorieMatch[1]) {
        return parseInt(calorieMatch[1]);
    }
    
    // Default fallback value if no calorie info found
    return 250;
}

/**
 * Generate AI response based on message context and user data
 * @param {string} message - User message
 * @returns {string} AI response
 */
function generateAIResponse(message) {
    message = message.toLowerCase();
    
    // Get current calories info
    const caloriesInfo = getCurrentCaloriesInfo();
    
    // Handle meal-related queries
    if (message.includes('meal') || message.includes('food') || message.includes('eat') || 
        message.includes('dinner') || message.includes('lunch') || message.includes('breakfast') ||
        message.includes('snack') || message.includes('hungry')) {
        
        // Handle specific meal time requests
        if (message.includes('breakfast')) {
            return generateMealSuggestionByType('breakfast', caloriesInfo);
        } else if (message.includes('lunch')) {
            return generateMealSuggestionByType('lunch', caloriesInfo);
        } else if (message.includes('dinner')) {
            return generateMealSuggestionByType('dinner', caloriesInfo);
        } else if (message.includes('snack')) {
            return generateMealSuggestionByType('snacks', caloriesInfo);
        } 
        
        // Look for calorie ranges in the message
        const calorieMatch = message.match(/(\d+)\s*(?:kcal|calories|cal)/);
        if (calorieMatch && calorieMatch[1]) {
            const targetCalories = parseInt(calorieMatch[1]);
            return generateMealSuggestionByCalories(targetCalories);
        }
        
        // Default to smart suggestion based on time of day and remaining calories
        return generateSmartMealSuggestion(caloriesInfo);
    } 
    
    // Handle exercise queries
    else if (message.includes('exercise') || message.includes('workout') || 
             message.includes('activity') || message.includes('move') || 
             message.includes('burn') || message.includes('cardio') ||
             message.includes('strength')) {
        
        // Check if looking for specific type of exercise
        if (message.includes('cardio') || message.includes('aerobic')) {
            return generateExerciseSuggestionByType('cardio');
        } else if (message.includes('strength') || message.includes('weights') || 
                  message.includes('muscle') || message.includes('toning')) {
            return generateExerciseSuggestionByType('strength');
        } else if (message.includes('flexibility') || message.includes('stretch')) {
            return generateExerciseSuggestionByType('flexibility');
        }
        
        // Default exercise suggestion
        return generateExerciseSuggestion();
    } 
    
    // Handle weight/progress queries
    else if (message.includes('weight') || message.includes('progress') || 
             message.includes('lost') || message.includes('losing') || 
             message.includes('goal') || message.includes('target')) {
        return generateProgressInsight();
    } 
    
    // Handle motivation queries
    else if (message.includes('motivation') || message.includes('inspire') || 
             message.includes('help me') || message.includes('struggling') || 
             message.includes('hard') || message.includes('difficult')) {
        return generateMotivationMessage();
    } 
    
    // Handle thank you messages
    else if (message.includes('thanks') || message.includes('thank you')) {
        return "You're welcome! I'm here to help you on your weight loss journey. Let me know if you need any other assistance!";
    } 
    
    // Handle setting-related questions
    else if (message.includes('notification') || message.includes('remind') || 
             message.includes('alert') || message.includes('suggest')) {
        if (message.includes('stop') || message.includes('disable') || 
            message.includes('turn off') || message.includes('no more')) {
            proactiveSuggestionEnabled = false;
            return "I've turned off proactive meal suggestions. I'll only provide recommendations when you ask me directly. You can turn them back on anytime by asking.";
        } else if (message.includes('start') || message.includes('enable') || 
                 message.includes('turn on')) {
            proactiveSuggestionEnabled = true;
            return "I've enabled proactive meal suggestions. I'll now provide timely meal recommendations based on your remaining calories and the time of day. Let me know if you need anything else!";
        } else {
            return "I can provide meal suggestions proactively or only when you ask. Would you like me to enable or disable proactive suggestions?";
        }
    }
    
    // Instead of a generic response, provide personalized suggestions right away
    const caloriesInfo = getCurrentCaloriesInfo();
    const currentHour = new Date().getHours();
    let personalizedResponse = "";
    
    // Determine current meal time context
    if (currentHour >= 5 && currentHour < 11) {
        personalizedResponse += "Good morning! ";
    } else if (currentHour >= 11 && currentHour < 15) {
        personalizedResponse += "Hello! Looking for lunch ideas? ";
    } else if (currentHour >= 15 && currentHour < 18) {
        personalizedResponse += "Good afternoon! Need a healthy snack? ";
    } else if (currentHour >= 18 && currentHour < 22) {
        personalizedResponse += "Good evening! Thinking about dinner? ";
    } else {
        personalizedResponse += "Hi there! ";
    }
    
    // Add calorie context
    if (caloriesInfo.remaining > 500) {
        personalizedResponse += `You have ${caloriesInfo.remaining} calories remaining today. Here's a meal idea:\n\n`;
        personalizedResponse += generateMealSuggestionByType(
            currentHour >= 5 && currentHour < 11 ? 'breakfast' : 
            currentHour >= 11 && currentHour < 15 ? 'lunch' : 
            currentHour >= 18 && currentHour < 22 ? 'dinner' : 'snacks', 
            caloriesInfo
        );
    } else if (caloriesInfo.remaining > 0) {
        personalizedResponse += `You have ${caloriesInfo.remaining} calories remaining today. Here's a light option:\n\n`;
        // Generate a low-calorie snack suggestion
        const snacks = mealDatabase.snacks.filter(s => s.calories <= caloriesInfo.remaining);
        const snack = snacks[Math.floor(Math.random() * snacks.length)] || mealDatabase.snacks[0];
        personalizedResponse += `${snack.name}: ${snack.ingredients.join(', ')}. (~${snack.calories} calories)`;
    } else {
        personalizedResponse += `You've reached your calorie goal for today! How about an exercise suggestion instead?\n\n`;
        personalizedResponse += generateExerciseSuggestion();
    }
    
    personalizedResponse += "\n\nYou can also ask me about meal ideas, exercise suggestions, progress tracking, or motivation. What else can I help with today?";
    
    return personalizedResponse;
}

/**
 * Generate a meal suggestion based on the time of day and remaining calories
 * @param {Object} caloriesInfo - Information about today's calories
 * @returns {string} Meal suggestion
 */
function generateSmartMealSuggestion(caloriesInfo) {
    // Get current time to determine the next meal
    const hour = new Date().getHours();
    let mealType;
    
    // Morning: 5am-11am = Breakfast
    // Midday: 11am-3pm = Lunch
    // Afternoon: 3pm-5pm = Snack
    // Evening: 5pm-9pm = Dinner
    // Night: 9pm-5am = Light snack
    
    if (hour >= 5 && hour < 11) {
        mealType = 'breakfast';
    } else if (hour >= 11 && hour < 15) {
        mealType = 'lunch';
    } else if (hour >= 15 && hour < 17) {
        mealType = 'snacks';
    } else if (hour >= 17 && hour < 21) {
        mealType = 'dinner';
    } else {
        mealType = 'snacks'; // Late night = light snack
    }
    
    // Adjust target calories based on remaining and meal type
    let targetCalories;
    
    if (caloriesInfo.remaining <= 0) {
        // If over budget, suggest very light options
        targetCalories = 150;
        return `You're currently ${Math.abs(caloriesInfo.remaining)} calories over your daily goal. If you're still hungry, try a very light option like cucumber slices with lemon (15 calories) or a cup of herbal tea with a small apple (80 calories).`;
    } else {
        // Allocate calories based on meal type and remaining calories
        switch (mealType) {
            case 'breakfast':
                targetCalories = Math.min(400, Math.max(200, caloriesInfo.remaining * 0.3));
                break;
            case 'lunch':
                targetCalories = Math.min(500, Math.max(250, caloriesInfo.remaining * 0.4));
                break;
            case 'dinner':
                targetCalories = Math.min(600, Math.max(300, caloriesInfo.remaining * 0.5));
                break;
            case 'snacks':
                targetCalories = Math.min(200, Math.max(100, caloriesInfo.remaining * 0.2));
                break;
            default:
                targetCalories = 250;
        }
    }
    
    return generateMealSuggestionByType(mealType, caloriesInfo, Math.round(targetCalories));
}

/**
 * Generate a meal suggestion for a specific type (breakfast, lunch, etc.)
 * @param {string} mealType - Type of meal
 * @param {Object} caloriesInfo - Information about today's calories
 * @param {number} targetCalories - Target calories for the meal
 * @returns {string} Meal suggestion
 */
function generateMealSuggestionByType(mealType, caloriesInfo, targetCalories) {
    if (!mealDatabase[mealType] || mealDatabase[mealType].length === 0) {
        return `I don't have any ${mealType} suggestions at the moment.`;
    }
    
    // If no target calories specified, base it on remaining calories
    if (!targetCalories) {
        if (caloriesInfo.remaining <= 0) {
            targetCalories = 150; // Very light meal if over budget
        } else {
            // Allocate a reasonable portion of remaining calories
            const allocations = {
                breakfast: 0.3,
                lunch: 0.4,
                dinner: 0.5,
                snacks: 0.2
            };
            const allocation = allocations[mealType] || 0.3;
            targetCalories = Math.min(500, Math.max(200, caloriesInfo.remaining * allocation));
        }
    }
    
    // Find meals within 30% of target calories
    const lowerBound = targetCalories * 0.7;
    const upperBound = targetCalories * 1.3;
    
    let eligibleMeals = mealDatabase[mealType].filter(meal => 
        meal.calories >= lowerBound && meal.calories <= upperBound
    );
    
    // If no meals in range, get closest matches
    if (eligibleMeals.length === 0) {
        const sortedByCloseness = [...mealDatabase[mealType]].sort((a, b) => 
            Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories)
        );
        eligibleMeals = sortedByCloseness.slice(0, 3);
    }
    
    // Pick a random meal from eligible options
    const meal = eligibleMeals[Math.floor(Math.random() * eligibleMeals.length)];
    
    // Format meal info with nutrition details
    let response = `${meal.name}: ${meal.ingredients.join(', ')}. (~${meal.calories} calories)\n\n`;
    response += `Nutrition info: ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fat}g fat, ${meal.fiber}g fiber\n\n`;
    
    // Add context about calorie budget
    if (caloriesInfo.remaining > 0) {
        response += `You have ${caloriesInfo.remaining} calories remaining today. This meal would leave you with ${caloriesInfo.remaining - meal.calories} calories for the rest of the day.`;
    } else {
        response += `You've already reached your calorie goal for today. This would put you ${Math.abs(caloriesInfo.remaining) + meal.calories} calories over your target.`;
    }
    
    return response;
}

/**
 * Generate a meal suggestion based on a specific calorie target
 * @param {number} targetCalories - Target calories for the meal
 * @returns {string} Meal suggestion
 */
function generateMealSuggestionByCalories(targetCalories) {
    // Collect all meals from all types
    const allMeals = [
        ...mealDatabase.breakfast,
        ...mealDatabase.lunch,
        ...mealDatabase.dinner,
        ...mealDatabase.snacks
    ];
    
    // Find meals within 30% of target calories
    const lowerBound = targetCalories * 0.7;
    const upperBound = targetCalories * 1.3;
    
    let eligibleMeals = allMeals.filter(meal => 
        meal.calories >= lowerBound && meal.calories <= upperBound
    );
    
    // If no meals in range, get closest matches
    if (eligibleMeals.length === 0) {
        const sortedByCloseness = [...allMeals].sort((a, b) => 
            Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories)
        );
        eligibleMeals = sortedByCloseness.slice(0, 3);
    }
    
    // Pick a random meal from eligible options
    const meal = eligibleMeals[Math.floor(Math.random() * eligibleMeals.length)];
    
    // Format meal info with nutrition details
    let response = `${meal.name}: ${meal.ingredients.join(', ')}. (~${meal.calories} calories)\n\n`;
    response += `Nutrition info: ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fat}g fat, ${meal.fiber}g fiber\n\n`;
    response += `Preparation time: approximately ${meal.prepTime} minutes.`;
    
    return response;
}

/**
 * Generate an exercise suggestion
 * @param {Object} profile - User profile data
 * @returns {string} Exercise suggestion
 */
function generateExerciseSuggestion(profile) {
    // Determine activity level from profile if available
    let activityLevel = 'moderate';
    if (profile && profile.activityLevel) {
        activityLevel = profile.activityLevel.toLowerCase();
    }
    
    // Exercise suggestions based on activity level
    const exerciseSuggestions = {
        sedentary: [
            "Start with a 10-minute walk after each meal to accumulate 30 minutes of activity throughout the day.",
            "Try chair exercises like seated leg lifts, arm circles, and gentle twists during TV commercials.",
            "Begin with 5-10 minutes of gentle stretching in the morning to improve mobility and circulation.",
            "Walk around your house or office during phone calls instead of sitting.",
            "Try a beginner-friendly yoga session focusing on gentle movements and breathing.",
            "Park farther away from entrances to naturally add more steps to your day."
        ],
        light: [
            "Aim for a 20-minute brisk walk 3-4 times this week. It can burn about 100 calories per session.",
            "Try a low-impact 15-minute workout video focusing on core and flexibility.",
            "Add bodyweight exercises like modified push-ups, sit-to-stands, and wall planks twice this week.",
            "Consider swimming or water walking for 20 minutes - it's gentle on joints while providing good resistance.",
            "Try a beginner's cycling session, either outdoors or on a stationary bike for 15-20 minutes.",
            "Add 5-minute 'movement breaks' throughout your day - stand up, stretch, and walk around."
        ],
        moderate: [
            "Try interval walking: alternate 2 minutes of brisk walking with 1 minute of faster pace for 25 minutes.",
            "Add resistance training with light weights or resistance bands twice this week.",
            "Consider a 30-minute moderate-intensity dance workout video.",
            "Try a cycling session with varied intensity for 25-30 minutes.",
            "Add a HIIT workout with 30 seconds of activity followed by 30 seconds of rest for 15 minutes.",
            "Consider a yoga flow class focusing on strength and balance for 30 minutes."
        ],
        active: [
            "Try adding hill sprints or stair intervals to your existing cardio routine.",
            "Consider a 45-minute strength training session focusing on compound movements.",
            "Add plyometric exercises like jump squats and burpees to increase intensity in your workouts.",
            "Try a new challenging class like kickboxing, spinning, or boot camp.",
            "Consider adding a longer (45-60 minute) endurance session once a week.",
            "Incorporate supersets in your strength training to increase intensity and efficiency."
        ],
        very_active: [
            "Try adding 1-2 high-intensity interval sessions while ensuring adequate recovery between them.",
            "Consider periodizing your training to prevent plateaus and optimize performance.",
            "Add tempo training to your cardio sessions: maintain challenging pace for 20-30 minutes.",
            "Try split training routines to allow for more volume while providing recovery for muscle groups.",
            "Consider adding sport-specific training to improve performance in your preferred activities.",
            "Add mobility work on recovery days to improve range of motion and prevent injuries."
        ]
    };
    
    // Get suggestions for the appropriate activity level
    const suggestionsForLevel = exerciseSuggestions[activityLevel] || exerciseSuggestions.moderate;
    
    // Return a random suggestion
    return suggestionsForLevel[Math.floor(Math.random() * suggestionsForLevel.length)];
}

/**
 * Generate an exercise suggestion by type (cardio, strength, flexibility)
 * @param {string} type - Exercise type
 * @returns {string} Exercise suggestion
 */
function generateExerciseSuggestionByType(type) {
    const exercises = {
        cardio: [
            "Try a 30-minute brisk walk, which can burn around 150-200 calories.",
            "Consider a 20-minute HIIT session: 30 seconds of high intensity followed by 30 seconds of rest.",
            "Jump rope for 15 minutes - it can burn up to 200 calories and improves coordination.",
            "Try a 30-minute dance workout video - fun and effective for cardio.",
            "Swimming for 30 minutes is gentle on joints while providing excellent cardio benefits.",
            "Try interval training on a bike: 1 minute fast pedaling followed by 2 minutes moderate pace for 25 minutes."
        ],
        strength: [
            "Try a bodyweight circuit: squats, push-ups, lunges, and plank for 3 rounds of 45 seconds each with 15 seconds rest.",
            "Consider using resistance bands for a full-body workout if you don't have weights.",
            "Try a dumbbell workout focusing on compound movements like squats, rows, presses, and lunges.",
            "Incorporate isometric holds like wall sits, planks, and glute bridges to build strength without equipment.",
            "Try a medicine ball workout focusing on rotational movements and core strength.",
            "Consider adding tempo training to your strength exercises: slow down the lowering phase to increase time under tension."
        ],
        flexibility: [
            "Try a 20-minute gentle yoga flow focusing on major muscle groups.",
            "Consider a targeted stretching routine for areas that feel tight (lower back, hips, shoulders).",
            "Try dynamic stretching before activity and static stretching after.",
            "Add foam rolling to your routine to release muscle tension and improve mobility.",
            "Consider a yoga-with-weights session to combine strength and flexibility training.",
            "Try a Pilates session focusing on core strength and spinal mobility."
        ]
    };
    
    // Get suggestions for the type
    const suggestionsForType = exercises[type] || exercises.cardio;
    
    // Return a random suggestion
    return suggestionsForType[Math.floor(Math.random() * suggestionsForType.length)];
}

/**
 * Generate a motivational message
 * @returns {string} Motivational message
 */
function generateMotivationMessage() {
    const motivationMessages = [
        "Remember that consistency beats perfection. Small daily choices add up to big results over time.",
        "You're not just losing weight, you're gaining health, energy, and confidence with every choice you make.",
        "Progress isn't always linear - focus on your overall trend rather than day-to-day fluctuations.",
        "Every time you choose health, you're voting for your future self. That's something to be proud of!",
        "Your weight loss journey is teaching you discipline and self-care that will benefit all areas of your life.",
        "Don't compare your chapter 1 to someone else's chapter 20. Your journey is uniquely yours.",
        "Success isn't about perfect days, it's about never giving up after imperfect ones.",
        "The fact that you're trying puts you ahead of everyone still sitting on the couch. Keep going!",
        "Think of each healthy choice as a gift to your future self. Future you will be so grateful.",
        "Remember your 'why' - the deeper reason you started this journey will help keep you motivated.",
        "It's not about having time, it's about making time. Prioritizing your health is worth it.",
        "Focus on habits, not outcomes. The right habits will naturally lead to the right outcomes.",
        "Rest days are as important as workout days. Recovery is where progress happens.",
        "Small steps are still steps forward. Celebrate every win, no matter how small.",
        "You may not see changes day to day, but they're happening beneath the surface."
    ];
    
    // Return a random message
    return motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
}

/**
 * Generate an insight about user's progress
 * @returns {string} Progress insight
 */
function generateProgressInsight() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return "I don't have enough data to analyze your progress yet.";
    
    const weightDataKey = `weight_history_${currentUser.email}`;
    const weightData = getFromStorage(weightDataKey, []);
    
    if (!Array.isArray(weightData) || weightData.length < 2) {
        return "I'll need more weight entries to provide meaningful insights about your progress.";
    }
    
    // Sort by date (oldest first)
    const sortedData = [...weightData].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    
    const oldestEntry = sortedData[0];
    const latestEntry = sortedData[sortedData.length - 1];
    const totalChange = latestEntry.weight - oldestEntry.weight;
    const timeSpan = Math.ceil((new Date(latestEntry.date) - new Date(oldestEntry.date)) / (1000 * 60 * 60 * 24));
    
    // Get profile for weight unit and goal weight
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    const weightUnit = profile && profile.weightUnit ? profile.weightUnit : 'kg';
    const goalWeight = profile && profile.goalWeight ? profile.goalWeight : null;
    
    let insight = '';
    
    if (totalChange < 0) {
        // Calculate weekly rate
        const weeklyRate = (Math.abs(totalChange) / (timeSpan / 7)).toFixed(2);
        
        insight = `You've lost ${Math.abs(totalChange).toFixed(1)} ${weightUnit} over ${timeSpan} days. That's an average of ${weeklyRate} ${weightUnit} per week. `;
        
        // Add context about recommended rate
        if (parseFloat(weeklyRate) > 1 && weightUnit === 'kg') {
            insight += "That's faster than the generally recommended 0.5-1 kg per week. Make sure you're getting proper nutrition! ";
        } else if (parseFloat(weeklyRate) > 2 && weightUnit === 'lb') {
            insight += "That's faster than the generally recommended 1-2 lbs per week. Make sure you're getting proper nutrition! ";
        }
        
        // Add projection to goal if we have goal weight
        if (goalWeight !== null) {
            const remaining = latestEntry.weight - goalWeight;
            if (remaining > 0) {
                const weeksToGoal = remaining / parseFloat(weeklyRate);
                const projectedDate = new Date();
                projectedDate.setDate(projectedDate.getDate() + (weeksToGoal * 7));
                
                insight += `At your current rate, you could reach your goal of ${goalWeight} ${weightUnit} around ${projectedDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}!`;
            } else {
                insight += "You've already reached your goal weight! Consider setting a new goal or focusing on maintenance.";
            }
        }
    } else if (totalChange > 0) {
        insight = `Your weight has increased by ${totalChange.toFixed(1)} ${weightUnit} over ${timeSpan} days. Let's look at what might be happening:

1. It could be normal weight fluctuation due to water retention, sodium intake, or hormonal changes.
2. It might be muscle gain if you've been strength training regularly.
3. It could be time to revisit your calorie intake and activity levels.

Would you like me to help you adjust your plan?`;
    } else {
        insight = `Your weight has remained stable at ${latestEntry.weight} ${weightUnit} over the past ${timeSpan} days. Weight maintenance is actually an important skill! If you're looking to lose weight, we might need to adjust your calorie intake or exercise routine.`;
    }
    
    return insight;
}

/**
 * Get information about today's calories
 * @returns {Object} Calorie information
 */
function getCurrentCaloriesInfo() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return { goal: 2000, consumed: 0, remaining: 2000 };
    
    // Get profile
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    const goal = profile && profile.dailyGoal ? parseFloat(profile.dailyGoal) : 2000;
    
    // Get today's calorie info
    const day = new Date().getDay(); // 0 = Sunday
    const dayIndex = day === 0 ? 6 : day - 1; // Convert to 0 = Monday
    
    const userKey = `planner_${currentUser.email}`;
    let calories = 0, exercise = 0;
    
    try {
        const weeklyCalories = getFromStorage(`${userKey}_calories`, [0, 0, 0, 0, 0, 0, 0]);
        calories = parseFloat(weeklyCalories[dayIndex]) || 0;
        
        const weeklyExercise = getFromStorage(`${userKey}_exercise`, [0, 0, 0, 0, 0, 0, 0]);
        exercise = parseFloat(weeklyExercise[dayIndex]) || 0;
    } catch (e) {
        console.error('Error getting calorie info:', e);
    }
    
    // Calculate net and remaining
    const netCalories = calories - exercise;
    const remaining = goal - netCalories;
    
    return {
        goal: goal,
        consumed: calories,
        exercise: exercise,
        net: netCalories,
        remaining: remaining
    };
}

/**
 * Add a meal to the food tracker
 * @param {string} mealName - Name of the meal
 * @param {number} calories - Calorie amount
 */
function addMealToTracker(mealName, calories) {
    // Get today's day index (0 = Monday, 6 = Sunday)
    const day = new Date().getDay(); // 0 = Sunday
    const dayIndex = day === 0 ? 6 : day - 1; // Convert to 0 = Monday
    
    // Get current time to determine meal type
    const hour = new Date().getHours();
    let mealType;
    
    if (hour >= 5 && hour < 11) {
        mealType = 'breakfast';
    } else if (hour >= 11 && hour < 15) {
        mealType = 'lunch';
    } else if (hour >= 15 && hour < 17) {
        mealType = 'snack';
    } else if (hour >= 17 && hour < 21) {
        mealType = 'dinner';
    } else {
        mealType = 'snack';
    }
    
    // Add to tracker
    if (typeof addFoodToTracker === 'function') {
        // Use the dashboard's function if available
        addFoodToTracker(dayIndex, mealName, calories);
    } else {
        // Otherwise implement our own version
        // Get current user
        const currentUser = getFromStorage('currentUser');
        if (!currentUser) return;
        
        const userKey = `planner_${currentUser.email}`;
        
        // Get existing data with fallbacks
        let weeklyCalories = getFromStorage(`${userKey}_calories`, [0, 0, 0, 0, 0, 0, 0]);
        let weeklyFoods = getFromStorage(`${userKey}_foods`, [[], [], [], [], [], [], []]);
        
        // Add calories to the daily total
        weeklyCalories[dayIndex] = (parseFloat(weeklyCalories[dayIndex]) || 0) + calories;
        
        // Add the food item to the foods list
        if (!Array.isArray(weeklyFoods[dayIndex])) {
            weeklyFoods[dayIndex] = [];
        }
        
        weeklyFoods[dayIndex].push({
            text: `${mealName} (${calories} kcal)`,
            cal: calories,
            type: mealType
        });
        
        // Save back to storage
        saveToStorage(`${userKey}_calories`, weeklyCalories);
        saveToStorage(`${userKey}_foods`, weeklyFoods);
    }
}

/**
 * Check if we should trigger proactive meal suggestions
 */
function checkForProactiveSuggestions() {
    // Only check if proactive suggestions are enabled
    if (!proactiveSuggestionEnabled) return;
    
    // Get current time
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    
    // Define key meal times for suggestions
    const mealTimes = [
        { name: 'breakfast', start: 7, end: 9 },
        { name: 'lunch', start: 11, end: 13 },
        { name: 'dinner', start: 17, end: 19 }
    ];
    
    // Check if we're close to a meal time (30 minutes before)
    let isNearMealTime = false;
    let mealTimeName = '';
    
    for (const mealTime of mealTimes) {
        if (hour === mealTime.start - 1 && minute >= 30) {
            isNearMealTime = true;
            mealTimeName = mealTime.name;
            break;
        } else if (hour === mealTime.start && minute <= 15) {
            isNearMealTime = true;
            mealTimeName = mealTime.name;
            break;
        }
    }
    
    // If it's near meal time, set up proactive suggestion
    if (isNearMealTime) {
        // Show badge on AI button
        setupAIBuddyBadge();
        
        // If the dashboard has shower notification function, use it
        if (typeof showNotification === 'function') {
            showNotification(`Meal time approaching! I have ${mealTimeName} suggestions for you.`, 'info');
        }
    }
    
    // Check again in 15 minutes
    setTimeout(checkForProactiveSuggestions, 15 * 60 * 1000);
}

// Add AI Buddy styles
function addAIBuddyStyles() {
    // Create style element if it doesn't exist
    let styleEl = document.getElementById('ai-buddy-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'ai-buddy-styles';
        document.head.appendChild(styleEl);
    }
    
    // Add CSS rules
    styleEl.textContent = `
        /* AI Buddy Badge */
        .ai-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: var(--error-color, #F44336);
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
        }
        
        .ai-badge.show {
            opacity: 1;
            transform: scale(1);
        }
        
        /* AI Suggestion Styling */
        .ai-suggestions {
            margin: 15px 0;
        }
        
        .ai-suggestion {
            background-color: rgba(76, 175, 80, 0.05);
            border-left: 3px solid var(--primary-color, #4CAF50);
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 10px;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .ai-suggestion:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }
        
        .ai-suggestion-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: var(--primary-color, #4CAF50);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .ai-suggestion-content {
            margin-bottom: 8px;
            white-space: pre-line;
        }
        
        .ai-suggestion-meta {
            font-size: 12px;
            color: var(--text-secondary, #666);
            font-style: italic;
        }
        
        .ai-suggestion-action {
            position: absolute;
            top: 12px;
            right: 12px;
            background-color: var(--primary-color, #4CAF50);
            color: white;
            border: none;
            border-radius: 15px;
            padding: 5px 10px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .ai-suggestion:hover .ai-suggestion-action {
            opacity: 1;
        }
        
        .ai-suggestion-action:hover {
            background-color: var(--primary-dark, #388E3C);
        }
    `;
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    addAIBuddyStyles();
    initializeAIBuddy();
});

/**
 * Generate a personalized greeting based on user data
 * @returns {string} Personalized greeting
 */
function generatePersonalizedGreeting() {
    // Get current user data
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return "Hello! I'm your SlimEasy AI Buddy. How can I help you today?";
    
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    
    // Get name for personalization
    const name = currentUser.name ? currentUser.name.split(' ')[0] : '';
    
    // Get time of day for contextual greeting
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour >= 5 && hour < 12) {
        greeting = `Good morning${name ? ', ' + name : ''}! `;
    } else if (hour >= 12 && hour < 18) {
        greeting = `Good afternoon${name ? ', ' + name : ''}! `;
    } else {
        greeting = `Good evening${name ? ', ' + name : ''}! `;
    }
    
    // Get calorie and activity context
    const caloriesInfo = getCurrentCaloriesInfo();
    
    // Build greeting with personalized information
    let personalizedGreeting = greeting;
    
    // Add calorie context
    if (caloriesInfo.goal > 0) {
        const percentConsumed = Math.round((caloriesInfo.consumed / caloriesInfo.goal) * 100);
        
        if (percentConsumed < 20) {
            personalizedGreeting += `You've only consumed about ${percentConsumed}% of your daily calorie goal so far. `;
        } else if (percentConsumed > 90) {
            personalizedGreeting += `You've nearly reached your daily calorie goal (${percentConsumed}%). `;
        } else {
            personalizedGreeting += `You've consumed about ${percentConsumed}% of your daily calorie goal. `;
        }
    }
    
    // Add weight context if available
    if (profile) {
        const weightKey = `weights_${currentUser.email}`;
        const weights = getFromStorage(weightKey, []);
        
        if (weights.length > 0) {
            // Sort by date to get latest weight
            const sortedWeights = [...weights].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            
            const latestWeight = sortedWeights[0].weight;
            
            if (profile.goalWeight) {
                const remaining = Math.abs(latestWeight - profile.goalWeight).toFixed(1);
                if (latestWeight > profile.goalWeight) {
                    personalizedGreeting += `You're ${remaining} ${profile.weightUnit || 'kg'} away from your goal weight. `;
                } else if (latestWeight <= profile.goalWeight) {
                    personalizedGreeting += `Great job! You've reached your goal weight! `;
                }
            }
        }
    }
    
    // Add daily context based on time
    if (hour >= 5 && hour < 11) {
        personalizedGreeting += "Here's a breakfast suggestion to start your day right:\n\n";
        personalizedGreeting += generateMealSuggestionByType('breakfast', caloriesInfo);
    } else if (hour >= 11 && hour < 15) {
        personalizedGreeting += "Looking for a healthy lunch idea? Try this:\n\n";
        personalizedGreeting += generateMealSuggestionByType('lunch', caloriesInfo);
    } else if (hour >= 15 && hour < 18) {
        personalizedGreeting += "Need an afternoon snack? Here's a nutritious option:\n\n";
        personalizedGreeting += generateMealSuggestionByType('snacks', caloriesInfo);
    } else if (hour >= 18 && hour < 22) {
        personalizedGreeting += "For dinner tonight, you might enjoy:\n\n";
        personalizedGreeting += generateMealSuggestionByType('dinner', caloriesInfo);
    } else {
        personalizedGreeting += "Here's today's motivational tip:\n\n";
        personalizedGreeting += generateMotivationMessage();
    }
    
    return personalizedGreeting;
}

// Export functions to global scope
window.initializeAIBuddy = initializeAIBuddy;
window.generateSmartMealSuggestion = generateSmartMealSuggestion;