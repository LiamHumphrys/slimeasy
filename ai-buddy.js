/**
 * SlimEasy AI Coaches Suite
 * A comprehensive AI system featuring three specialized coaches:
 * 1. AI Buddy - Motivational coach for mindset advice and emotional support
 * 2. AI Chef - Nutrition expert providing meal suggestions and recipe guidance
 * 3. AI Trainer - Fitness coach offering personalized workout plans and exercise advice
 * All coaches use state-of-the-art AI to provide personalized guidance based on user data
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

// Conversation history for each AI coach
let buddyConversationHistory = []; // AI Buddy conversation history (mindset & motivation)
let chefConversationHistory = []; // AI Chef conversation history (meals & nutrition)
let trainerConversationHistory = []; // AI Trainer conversation history (fitness & exercise)

// Flags to determine if AI coaches should proactively suggest content
let proactiveSuggestionEnabled = true;

// Context tracking for better conversation continuity (shared between coaches)
let sharedContext = {
    lastCalorieTarget: null,     // Last discussed calorie target
    dietaryPreferences: [],      // User's dietary preferences inferred from conversation
    userFeedback: {},            // Track user likes/dislikes for better recommendations
    currentMealTime: null,       // Current meal time based on time of day
    recentQueries: [],           // List of recent user queries for context (shared)
    activeCoach: 'buddy',        // Current active AI coach (buddy, chef, trainer)
};

// Specialized context for AI Buddy (motivation & mindset coach)
let buddyContext = {
    lastTopic: null,             // Last topic of conversation (motivation, mindset, etc.)
    motivationLevel: 'moderate', // User's current motivation level
    challenges: [],              // User's reported challenges
    achievements: [],            // User's reported achievements
    moodHistory: [],             // Track user's reported mood
    goalProgress: null,          // Progress towards goals
    lastMotivationMessage: null, // Last motivation message provided
    personalizedApproach: 'supportive' // Approach style (supportive, challenging, etc.)
};

// Specialized context for AI Chef (meal & nutrition coach)
let chefContext = {
    lastMealType: null,          // Last meal type discussed (breakfast, lunch, dinner, snack)
    lastMealSuggested: null,     // Last meal suggested to user
    savedRecipes: [],            // Recipes the user has saved
    mealPlanType: 'balanced',    // User's preferred meal plan type
    cookingSkill: 'intermediate', // User's cooking skill level
    cookingTime: 30,             // Preferred cooking time in minutes
    lastIngredientDiscussed: [], // Last ingredients discussed
    cuisinePreferences: [],      // Preferred cuisines
    mealPrepMode: 'regular',     // Meal prep mode (regular, batch, quick)
    weeklyMealPlan: null         // Generated weekly meal plan
};

// Specialized context for AI Trainer (fitness & exercise coach)
let trainerContext = {
    workoutPreferences: {        // User's workout preferences
        fitnessLevel: 'beginner', // Default to beginner
        preferredActivities: [],  // Store preferred workout types
        workoutDuration: 30,      // Default workout duration in minutes
        equipmentAvailable: false, // Whether user has access to gym equipment
        focusAreas: [],           // Body areas to focus on
        injuryConsiderations: []  // Injuries to consider
    },
    lastGeneratedWorkout: null,  // Last workout plan generated
    savedWorkouts: [],           // Workouts the user has saved
    workoutHistory: [],          // Track completed workouts
    fitnessGoals: [],            // User's fitness goals
    progressMetrics: {},         // Fitness progress metrics
    weeklyWorkoutPlan: null,     // Generated weekly workout plan
    lastExerciseFocus: null      // Last exercise focus area
};

/**
 * Initialize AI Coaches Hub functionality
 */
function initializeAICoaches() {
    // Get UI elements for coaches selection
    const aiCoachesBtn = document.getElementById('aiCoachesBtn');
    const aiCoachesModal = document.getElementById('aiCoachesModal');
    
    // Create the AI Coaches button if it doesn't exist
    if (!aiCoachesBtn) {
        createAICoachesButton();
    }
    
    // Create the AI Coaches modal if it doesn't exist
    if (!aiCoachesModal) {
        createAICoachesModal();
    }
    
    // Add styles for all AI coaches
    addAICoachesStyles();
    
    // Initialize all AI coach modules
    initializeAIBuddy();
    initializeAIChef();
    initializeAITrainer();
    
    // Set up shared context based on time of day
    setupInitialContext();
    
    // Check for proactive suggestions
    if (proactiveSuggestionEnabled) {
        checkForProactiveSuggestions();
    }
}

/**
 * Set up initial AI context based on user data and time of day
 */
function setupInitialContext() {
    // Get current user data
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return;
    
    // Get profile
    const profileKey = `profile_${currentUser.email}`;
    const profile = getFromStorage(profileKey);
    
    // Load stored preferences if available
    const preferencesKey = `ai_preferences_${currentUser.email}`;
    const storedPreferences = getFromStorage(preferencesKey);
    
    if (storedPreferences) {
        if (storedPreferences.dietaryPreferences) {
            sharedContext.dietaryPreferences = storedPreferences.dietaryPreferences;
        }
        if (storedPreferences.userFeedback) {
            sharedContext.userFeedback = storedPreferences.userFeedback;
        }
    }
    
    // Set meal time based on current time
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
        sharedContext.currentMealTime = 'breakfast';
    } else if (hour >= 11 && hour < 15) {
        sharedContext.currentMealTime = 'lunch';
    } else if (hour >= 15 && hour < 17) {
        sharedContext.currentMealTime = 'snacks';
    } else if (hour >= 17 && hour < 21) {
        sharedContext.currentMealTime = 'dinner';
    } else {
        sharedContext.currentMealTime = 'snacks';
    }
    
    // Set fitness level based on profile if available
    if (profile && profile.activityLevel) {
        const activityMap = {
            'sedentary': 'beginner',
            'light': 'beginner',
            'moderate': 'intermediate',
            'active': 'advanced',
            'very_active': 'advanced'
        };
        trainerContext.workoutPreferences.fitnessLevel = activityMap[profile.activityLevel.toLowerCase()] || 'beginner';
    }
    
    // Set cooking skill level based on number of logged meals if available
    const foodDataKey = `planner_${currentUser.email}_foods`;
    const foodData = getFromStorage(foodDataKey);
    if (foodData && Array.isArray(foodData)) {
        // Flatten the array to count total meals
        const allMeals = foodData.flat();
        if (allMeals.length > 30) {
            chefContext.cookingSkill = 'advanced';
        } else if (allMeals.length > 10) {
            chefContext.cookingSkill = 'intermediate';
        } else {
            chefContext.cookingSkill = 'beginner';
        }
    }
}

/**
 * Create AI Coaches Button if it doesn't exist
 */
function createAICoachesButton() {
    // Check if button already exists
    if (document.getElementById('aiCoachesBtn')) return;
    
    // Find a good place to add the button (usually in header or action area)
    const navMenu = document.querySelector('.nav-menu') || document.querySelector('.action-buttons') || document.querySelector('header');
    
    if (navMenu) {
        // Create the button
        const aiCoachesBtn = document.createElement('button');
        aiCoachesBtn.id = 'aiCoachesBtn';
        aiCoachesBtn.className = 'action-button ai-coaches-btn';
        aiCoachesBtn.innerHTML = '<i class="fas fa-robot"></i> AI Coaches';
        
        // Add to the navigation menu
        navMenu.appendChild(aiCoachesBtn);
        
        // Add event listener to open coaches selection modal
        aiCoachesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const aiCoachesModal = document.getElementById('aiCoachesModal');
            if (aiCoachesModal) {
                aiCoachesModal.classList.add('show');
            }
        });
    }
}

/**
 * Create AI Coaches Selection Modal
 */
function createAICoachesModal() {
    // Check if modal already exists
    if (document.getElementById('aiCoachesModal')) return;
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'aiCoachesModal';
    modal.className = 'modal ai-coaches-modal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content ai-coaches-content">
            <div class="modal-header">
                <h2><i class="fas fa-robot"></i> AI Coaches</h2>
                <button id="aiCoachesClose" class="close-btn">&times;</button>
            </div>
            <div class="coaches-selection">
                <div class="coach-card" id="aiBuddyCard">
                    <div class="coach-icon"><i class="fas fa-heart"></i></div>
                    <h3>AI Buddy</h3>
                    <p>Your motivational coach who provides mindset advice and emotional support based on your data.</p>
                    <button class="coach-select-btn" id="selectAIBuddy">Chat with AI Buddy</button>
                </div>
                <div class="coach-card" id="aiChefCard">
                    <div class="coach-icon"><i class="fas fa-utensils"></i></div>
                    <h3>AI Chef</h3>
                    <p>Get personalized meal ideas and recipes tailored to your preferences and nutritional goals.</p>
                    <button class="coach-select-btn" id="selectAIChef">Chat with AI Chef</button>
                </div>
                <div class="coach-card" id="aiTrainerCard">
                    <div class="coach-icon"><i class="fas fa-dumbbell"></i></div>
                    <h3>AI Trainer</h3>
                    <p>Receive customized workout plans and fitness advice based on your goals and activity level.</p>
                    <button class="coach-select-btn" id="selectAITrainer">Chat with AI Trainer</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Set up event listeners
    setupAICoachesModalEvents();
    
    // Add styles for the coaches modal
    addAICoachesStyles();
}

/**
 * Set up event listeners for AI Coaches modal
 */
function setupAICoachesModalEvents() {
    const aiCoachesModal = document.getElementById('aiCoachesModal');
    const aiCoachesClose = document.getElementById('aiCoachesClose');
    
    // Close button event
    if (aiCoachesClose) {
        aiCoachesClose.addEventListener('click', function() {
            aiCoachesModal.classList.remove('show');
        });
    }
    
    // Close when clicking outside the modal content
    aiCoachesModal.addEventListener('click', function(e) {
        if (e.target === aiCoachesModal) {
            aiCoachesModal.classList.remove('show');
        }
    });
    
    // Coach selection buttons
    const selectAIBuddy = document.getElementById('selectAIBuddy');
    const selectAIChef = document.getElementById('selectAIChef');
    const selectAITrainer = document.getElementById('selectAITrainer');
    
    // AI Buddy selection
    if (selectAIBuddy) {
        selectAIBuddy.addEventListener('click', function() {
            // Hide coaches modal
            aiCoachesModal.classList.remove('show');
            
            // Show AI Buddy modal
            const aiBuddyModal = document.getElementById('aiBuddyModal');
            if (aiBuddyModal) {
                aiBuddyModal.classList.add('show');
                
                // Reset conversation context for Buddy mode
                conversationContext.activeCoach = 'buddy';
                
                // Focus the input
                const aiMessageInput = document.getElementById('aiMessageInput');
                if (aiMessageInput) aiMessageInput.focus();
                
                // Show initial greeting if chat is empty
                const aiChatMessages = document.getElementById('aiChatMessages');
                if (aiChatMessages && aiChatMessages.children.length === 0) {
                    const greeting = generatePersonalizedGreeting();
                    addMessageToChat('buddy', greeting);
                    conversationHistory.push({ role: 'buddy', message: greeting });
                }
            }
        });
    }
    
    // AI Chef selection
    if (selectAIChef) {
        selectAIChef.addEventListener('click', function() {
            // Hide coaches modal
            aiCoachesModal.classList.remove('show');
            
            // Show AI Chef modal
            const aiChefModal = document.getElementById('aiChefModal');
            if (aiChefModal) {
                aiChefModal.classList.add('show');
                
                // Reset conversation context for Chef mode
                conversationContext.activeCoach = 'chef';
                
                // Focus the input
                const aiChefMessageInput = document.getElementById('aiChefMessageInput');
                if (aiChefMessageInput) aiChefMessageInput.focus();
                
                // Show initial chef greeting if chat is empty
                const aiChefChatMessages = document.getElementById('aiChefChatMessages');
                if (aiChefChatMessages && aiChefChatMessages.children.length === 0) {
                    const greeting = generateChefGreeting();
                    addMessageToChefChat('chef', greeting);
                    chefConversationHistory.push({ role: 'chef', message: greeting });
                }
            }
        });
    }
    
    // AI Trainer selection
    if (selectAITrainer) {
        selectAITrainer.addEventListener('click', function() {
            // Hide coaches modal
            aiCoachesModal.classList.remove('show');
            
            // Show AI Trainer modal
            const aiTrainerModal = document.getElementById('aiTrainerModal');
            if (aiTrainerModal) {
                aiTrainerModal.classList.add('show');
                
                // Reset conversation context for Trainer mode
                conversationContext.activeCoach = 'trainer';
                
                // Focus the input
                const aiTrainerMessageInput = document.getElementById('aiTrainerMessageInput');
                if (aiTrainerMessageInput) aiTrainerMessageInput.focus();
                
                // Show initial trainer greeting if chat is empty
                const aiTrainerChatMessages = document.getElementById('aiTrainerChatMessages');
                if (aiTrainerChatMessages && aiTrainerChatMessages.children.length === 0) {
                    const greeting = generateTrainerGreeting();
                    addMessageToTrainerChat('trainer', greeting);
                    trainerConversationHistory.push({ role: 'trainer', message: greeting });
                }
            }
        });
    }
}

/**
 * Add styles for AI Coaches interface
 */
function addAICoachesStyles() {
    // Create style element if it doesn't exist
    let styleEl = document.getElementById('ai-coaches-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'ai-coaches-styles';
        document.head.appendChild(styleEl);
    }
    
    // Add CSS rules
    styleEl.textContent = `
        /* AI Coaches Button */
        .ai-coaches-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            background-color: var(--primary-color, #4CAF50);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .ai-coaches-btn:hover {
            background-color: var(--primary-dark, #388E3C);
        }
        
        /* AI Assistants Link */
        .ai-assistants-link {
            font-size: 12px;
            color: var(--primary-color, #4CAF50);
            text-decoration: none;
            margin-right: auto;
            margin-left: 15px;
            padding: 5px 10px;
            border-radius: 15px;
            background-color: rgba(0, 191, 165, 0.1);
            transition: background-color 0.3s ease;
        }
        
        .ai-assistants-link:hover {
            background-color: rgba(0, 191, 165, 0.2);
        }
        
        /* AI Coaches Modal */
        .ai-coaches-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
            animation: fadeIn 0.3s;
        }
        
        .ai-coaches-modal.show {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .ai-coaches-content {
            background-color: white;
            margin: auto;
            width: 90%;
            max-width: 1000px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
            animation: slideUp 0.3s;
        }
        
        .coaches-selection {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            padding: 20px;
        }
        
        .coach-card {
            flex: 1;
            min-width: 280px;
            max-width: 320px;
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .coach-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.08);
            border-color: var(--primary-color, #4CAF50);
        }
        
        .coach-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: var(--primary-color, #4CAF50);
            color: white;
            margin: 0 auto 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32px;
        }
        
        #aiBuddyCard .coach-icon {
            background-color: #FF5722;
        }
        
        #aiChefCard .coach-icon {
            background-color: #2196F3;
        }
        
        #aiTrainerCard .coach-icon {
            background-color: #9C27B0;
        }
        
        .coach-card h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #333;
        }
        
        .coach-card p {
            color: #666;
            margin-bottom: 20px;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .coach-select-btn {
            background-color: var(--primary-color, #4CAF50);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        #aiBuddyCard .coach-select-btn {
            background-color: #FF5722;
        }
        
        #aiChefCard .coach-select-btn {
            background-color: #2196F3;
        }
        
        #aiTrainerCard .coach-select-btn {
            background-color: #9C27B0;
        }
        
        .coach-select-btn:hover {
            filter: brightness(1.1);
            transform: scale(1.05);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .coaches-selection {
                flex-direction: column;
                align-items: center;
            }
            
            .coach-card {
                max-width: 100%;
            }
        }
    `;
}

/**
 * Initialize AI Buddy functionality
 */
/**
 * Initialize AI Buddy - Motivational Coach
 * Focuses on mindset, motivation, and emotional support
 */
function initializeAIBuddy() {
    // Get UI elements
    const aiBuddyBtn = document.getElementById('aiBuddyBtn');
    const aiBuddyModal = document.getElementById('aiBuddyModal');
    
    // If AI Buddy modal doesn't exist, create it
    if (!aiBuddyModal) {
        createAIBuddyModal();
    }
    
    // Get the updated elements
    const aiBuddyClose = document.getElementById('aiBuddyClose');
    const aiMessageInput = document.getElementById('aiMessageInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiChatMessages = document.getElementById('aiChatMessages');
    const aiTyping = document.getElementById('aiTyping');
    
    // If key elements still missing after creation, exit
    if (!aiBuddyModal || !aiMessageInput || !aiSendBtn) return;
    
    // Keep original AI Buddy button functionality if it exists
    if (aiBuddyBtn) {
        aiBuddyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            aiBuddyModal.classList.add('show');
            aiMessageInput.focus();
            
            // Show an initial personalized greeting if the chat is empty
            if (aiChatMessages && aiChatMessages.children.length === 0) {
                const greeting = generateBuddyGreeting();
                addMessageToChat('buddy', greeting);
                // Add to conversation history
                buddyConversationHistory.push({ role: 'buddy', message: greeting });
                
                // Set active coach
                sharedContext.activeCoach = 'buddy';
            }
        });
    }
    
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
    
    // Add quick suggestion buttons tailored for motivational coach
    if (aiChatMessages && !document.getElementById('buddyQuickSuggestions')) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'buddyQuickSuggestions';
        suggestionsContainer.className = 'quick-suggestions';
        
        // Create suggestion buttons specific to motivation coach
        const suggestions = [
            { text: "Need motivation", action: () => handleBuddyQuickSuggestion("I need some motivation today") },
            { text: "Feeling stuck", action: () => handleBuddyQuickSuggestion("I'm feeling stuck with my progress") },
            { text: "Celebrate wins", action: () => handleBuddyQuickSuggestion("Help me celebrate my achievements") },
            { text: "Overcome cravings", action: () => handleBuddyQuickSuggestion("I'm struggling with cravings") }
        ];
        
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'quick-suggestion-btn buddy-suggestion-btn';
            button.textContent = suggestion.text;
            button.addEventListener('click', suggestion.action);
            suggestionsContainer.appendChild(button);
        });
        
        // Insert before the message input
        const chatContainer = document.querySelector('.ai-chat-container');
        if (chatContainer) {
            const inputContainer = document.querySelector('.ai-input-container');
            chatContainer.insertBefore(suggestionsContainer, inputContainer);
        }
    }
    
    // Send message on button click
    aiSendBtn.addEventListener('click', () => sendBuddyMessage());
    
    // Send message on Enter key
    aiMessageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendBuddyMessage();
        }
    });
    
    // Add voice input button if supported by browser
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        addVoiceInputButton(aiMessageInput, sendBuddyMessage);
    }
    
    // Add AI Buddy specific styles
    addAIBuddyStyles();
}

/**
 * Initialize AI Chef - Nutrition Coach
 * Focuses on meal planning, recipes, and nutrition advice
 */
function initializeAIChef() {
    // Create AI Chef modal if it doesn't exist
    if (!document.getElementById('aiChefModal')) {
        createAIChefModal();
    }
    
    // Get the updated elements
    const aiChefModal = document.getElementById('aiChefModal');
    const aiChefClose = document.getElementById('aiChefClose');
    const aiChefMessageInput = document.getElementById('aiChefMessageInput');
    const aiChefSendBtn = document.getElementById('aiChefSendBtn');
    const aiChefChatMessages = document.getElementById('aiChefChatMessages');
    
    // If key elements still missing after creation, exit
    if (!aiChefModal || !aiChefMessageInput || !aiChefSendBtn) return;
    
    // Close AI Chef modal
    aiChefClose.addEventListener('click', function() {
        aiChefModal.classList.remove('show');
    });
    
    // Close when clicking outside the modal content
    aiChefModal.addEventListener('click', function(e) {
        if (e.target === aiChefModal) {
            aiChefModal.classList.remove('show');
        }
    });
    
    // Add quick suggestion buttons tailored for meal suggestions
    if (aiChefChatMessages && !document.getElementById('chefQuickSuggestions')) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'chefQuickSuggestions';
        suggestionsContainer.className = 'quick-suggestions';
        
        // Create suggestion buttons specific to meal planning
        const suggestions = [
            { text: "Breakfast ideas", action: () => handleChefQuickSuggestion("Suggest healthy breakfast ideas") },
            { text: "Quick meals", action: () => handleChefQuickSuggestion("I need quick meal ideas under 15 minutes") },
            { text: "Weekly meal plan", action: () => handleChefQuickSuggestion("Create a weekly meal plan for me") },
            { text: "High protein", action: () => handleChefQuickSuggestion("Suggest high protein meals") }
        ];
        
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'quick-suggestion-btn chef-suggestion-btn';
            button.textContent = suggestion.text;
            button.addEventListener('click', suggestion.action);
            suggestionsContainer.appendChild(button);
        });
        
        // Insert before the message input
        const chatContainer = document.querySelector('.ai-chef-container');
        if (chatContainer) {
            const inputContainer = document.querySelector('.ai-chef-input-container');
            chatContainer.insertBefore(suggestionsContainer, inputContainer);
        }
    }
    
    // Send message on button click
    aiChefSendBtn.addEventListener('click', () => sendChefMessage());
    
    // Send message on Enter key
    aiChefMessageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendChefMessage();
        }
    });
    
    // Add voice input button if supported by browser
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        addVoiceInputButton(aiChefMessageInput, sendChefMessage, 'aiChefVoiceBtn');
    }
    
    // Add AI Chef specific styles
    addAIChefStyles();
}

/**
 * Initialize AI Trainer - Fitness Coach
 * Focuses on workout planning, exercise guidance, and fitness progress
 */
function initializeAITrainer() {
    // Create AI Trainer modal if it doesn't exist
    if (!document.getElementById('aiTrainerModal')) {
        createAITrainerModal();
    }
    
    // Get the updated elements
    const aiTrainerModal = document.getElementById('aiTrainerModal');
    const aiTrainerClose = document.getElementById('aiTrainerClose');
    const aiTrainerMessageInput = document.getElementById('aiTrainerMessageInput');
    const aiTrainerSendBtn = document.getElementById('aiTrainerSendBtn');
    const aiTrainerChatMessages = document.getElementById('aiTrainerChatMessages');
    
    // If key elements still missing after creation, exit
    if (!aiTrainerModal || !aiTrainerMessageInput || !aiTrainerSendBtn) return;
    
    // Close AI Trainer modal
    aiTrainerClose.addEventListener('click', function() {
        aiTrainerModal.classList.remove('show');
    });
    
    // Close when clicking outside the modal content
    aiTrainerModal.addEventListener('click', function(e) {
        if (e.target === aiTrainerModal) {
            aiTrainerModal.classList.remove('show');
        }
    });
    
    // Add quick suggestion buttons tailored for fitness
    if (aiTrainerChatMessages && !document.getElementById('trainerQuickSuggestions')) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'trainerQuickSuggestions';
        suggestionsContainer.className = 'quick-suggestions';
        
        // Create suggestion buttons specific to fitness coaching
        const suggestions = [
            { text: "Quick workout", action: () => handleTrainerQuickSuggestion("Give me a quick 15-minute workout") },
            { text: "Weekly plan", action: () => handleTrainerQuickSuggestion("Create a weekly workout plan for me") },
            { text: "No equipment", action: () => handleTrainerQuickSuggestion("Suggest exercises I can do without equipment") },
            { text: "Track progress", action: () => handleTrainerQuickSuggestion("How should I track my fitness progress?") }
        ];
        
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'quick-suggestion-btn trainer-suggestion-btn';
            button.textContent = suggestion.text;
            button.addEventListener('click', suggestion.action);
            suggestionsContainer.appendChild(button);
        });
        
        // Insert before the message input
        const chatContainer = document.querySelector('.ai-trainer-container');
        if (chatContainer) {
            const inputContainer = document.querySelector('.ai-trainer-input-container');
            chatContainer.insertBefore(suggestionsContainer, inputContainer);
        }
    }
    
    // Send message on button click
    aiTrainerSendBtn.addEventListener('click', () => sendTrainerMessage());
    
    // Send message on Enter key
    aiTrainerMessageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendTrainerMessage();
        }
    });
    
    // Add voice input button if supported by browser
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        addVoiceInputButton(aiTrainerMessageInput, sendTrainerMessage, 'aiTrainerVoiceBtn');
    }
    
    // Add AI Trainer specific styles
    addAITrainerStyles();
}

/**
 * Create AI Buddy Modal (Mindset & Motivation Coach)
 */
function createAIBuddyModal() {
    // Check if modal already exists
    if (document.getElementById('aiBuddyModal')) return;
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'aiBuddyModal';
    modal.className = 'modal ai-buddy-modal';
    
    // Create modal content with updated header
    modal.innerHTML = `
        <div class="modal-content ai-chat-content buddy-theme">
            <div class="modal-header buddy-header">
                <h2><i class="fas fa-heart"></i> AI Buddy - Motivation Coach</h2>
                <div class="coach-subtitle">Mindset advice & emotional support</div>
                <a href="ai-assistants.html" class="ai-assistants-link">View All AI Assistants</a>
                <button id="aiBuddyClose" class="close-btn">&times;</button>
            </div>
            <div class="ai-chat-container">
                <div id="aiChatMessages" class="ai-chat-messages"></div>
                <div id="aiTyping" class="ai-typing">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
                <div class="ai-input-container">
                    <input type="text" id="aiMessageInput" class="ai-message-input" 
                        placeholder="Ask about motivation, mindset, or emotional support...">
                    <button id="aiSendBtn" class="ai-send-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
}

/**
 * Create AI Chef Modal (Nutrition & Meal Coach)
 */
function createAIChefModal() {
    // Check if modal already exists
    if (document.getElementById('aiChefModal')) return;
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'aiChefModal';
    modal.className = 'modal ai-chef-modal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content ai-chat-content chef-theme">
            <div class="modal-header chef-header">
                <h2><i class="fas fa-utensils"></i> AI Chef - Nutrition Coach</h2>
                <div class="coach-subtitle">Meal plans, recipes & nutrition advice</div>
                <button id="aiChefClose" class="close-btn">&times;</button>
            </div>
            <div class="ai-chat-container ai-chef-container">
                <div id="aiChefChatMessages" class="ai-chat-messages"></div>
                <div id="aiChefTyping" class="ai-typing">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
                <div class="ai-input-container ai-chef-input-container">
                    <input type="text" id="aiChefMessageInput" class="ai-message-input" 
                        placeholder="Ask about recipes, meal plans, or nutrition...">
                    <button id="aiChefSendBtn" class="ai-send-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
}

/**
 * Create AI Trainer Modal (Fitness & Exercise Coach)
 */
function createAITrainerModal() {
    // Check if modal already exists
    if (document.getElementById('aiTrainerModal')) return;
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'aiTrainerModal';
    modal.className = 'modal ai-trainer-modal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content ai-chat-content trainer-theme">
            <div class="modal-header trainer-header">
                <h2><i class="fas fa-dumbbell"></i> AI Trainer - Fitness Coach</h2>
                <div class="coach-subtitle">Workout plans & exercise guidance</div>
                <button id="aiTrainerClose" class="close-btn">&times;</button>
            </div>
            <div class="ai-chat-container ai-trainer-container">
                <div id="aiTrainerChatMessages" class="ai-chat-messages"></div>
                <div id="aiTrainerTyping" class="ai-typing">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
                <div class="ai-input-container ai-trainer-input-container">
                    <input type="text" id="aiTrainerMessageInput" class="ai-message-input" 
                        placeholder="Ask about workouts, exercises, or fitness plans...">
                    <button id="aiTrainerSendBtn" class="ai-send-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
}

/**
 * Handle quick suggestion button click for AI Buddy
 * @param {string} text - Suggestion text
 */
function handleBuddyQuickSuggestion(text) {
    const aiMessageInput = document.getElementById('aiMessageInput');
    if (aiMessageInput) {
        aiMessageInput.value = text;
        sendBuddyMessage();
    }
}

/**
 * Handle quick suggestion button click for AI Chef
 * @param {string} text - Suggestion text
 */
function handleChefQuickSuggestion(text) {
    const aiChefMessageInput = document.getElementById('aiChefMessageInput');
    if (aiChefMessageInput) {
        aiChefMessageInput.value = text;
        sendChefMessage();
    }
}

/**
 * Handle quick suggestion button click for AI Trainer
 * @param {string} text - Suggestion text
 */
function handleTrainerQuickSuggestion(text) {
    const aiTrainerMessageInput = document.getElementById('aiTrainerMessageInput');
    if (aiTrainerMessageInput) {
        aiTrainerMessageInput.value = text;
        sendTrainerMessage();
    }
}

/**
 * Add voice input button to the chat
 */
function addVoiceInputButton() {
    const inputContainer = document.querySelector('.ai-input-container');
    if (!inputContainer) return;
    
    // Check if button already exists
    if (document.getElementById('aiVoiceBtn')) return;
    
    // Create voice button
    const voiceBtn = document.createElement('button');
    voiceBtn.id = 'aiVoiceBtn';
    voiceBtn.className = 'ai-voice-btn';
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceBtn.title = 'Voice input';
    
    // Add to input container before send button
    const sendBtn = document.getElementById('aiSendBtn');
    if (sendBtn && sendBtn.parentNode) {
        sendBtn.parentNode.insertBefore(voiceBtn, sendBtn);
    }
    
    // Set up speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        // Handle results
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const aiMessageInput = document.getElementById('aiMessageInput');
            if (aiMessageInput) {
                aiMessageInput.value = transcript;
                // Send message automatically
                sendAIMessage();
            }
        };
        
        // Handle end of voice input
        recognition.onend = function() {
            voiceBtn.classList.remove('recording');
        };
        
        // Handle errors
        recognition.onerror = function() {
            voiceBtn.classList.remove('recording');
        };
        
        // Toggle voice recording on click
        voiceBtn.addEventListener('click', function() {
            if (voiceBtn.classList.contains('recording')) {
                recognition.stop();
                voiceBtn.classList.remove('recording');
            } else {
                recognition.start();
                voiceBtn.classList.add('recording');
            }
        });
    }
}

/**
 * Load user preferences from storage
 */
function loadUserPreferences() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser || !currentUser.email) return;
    
    // Check for stored preferences
    const preferencesKey = `ai_preferences_${currentUser.email}`;
    const storedPreferences = getFromStorage(preferencesKey);
    
    if (storedPreferences) {
        // Load dietary preferences
        if (storedPreferences.dietaryPreferences) {
            conversationContext.dietaryPreferences = storedPreferences.dietaryPreferences;
        }
        
        // Load feedback
        if (storedPreferences.userFeedback) {
            conversationContext.userFeedback = storedPreferences.userFeedback;
        }
    }
    
    // Set default sound preference if not set
    if (getFromStorage('soundEnabled') === null) {
        saveToStorage('soundEnabled', true);
    }
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
    
    // Update context tracking with user query
    updateConversationContext(message);
    
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
        
        // Generate response based on message and user data with context
        const response = generateAIResponse(message);
        
        // Add AI response to chat
        addMessageToChat('buddy', response);
        
        // Store in conversation history
        conversationHistory.push({ role: 'buddy', message: response });
        
        // Update conversation context with the response
        storeResponseInContext(response);
        
        // Scroll to bottom
        scrollAIChat();
        
        // Play a subtle sound for notification if enabled
        if (getFromStorage('soundEnabled', true)) {
            const audioElement = document.getElementById('messageSound');
            if (audioElement) {
                audioElement.volume = 0.3; // Keep volume low
                audioElement.play().catch(e => console.log('Audio play prevented by browser.'));
            }
        }
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
    
    // Render links as clickable with proper styling
    let textWithLinks = text.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" style="color: inherit; text-decoration: underline;">$1</a>'
    );
    
    // Format nutrition info in buddy messages (make them more readable)
    if (type === 'buddy') {
        // Format calorie mentions
        textWithLinks = textWithLinks.replace(
            /(\~\d+\s*calories)/g, 
            '<strong style="color: var(--primary-color, #4CAF50);">$1</strong>'
        );
        
        // Format nutrition info section
        textWithLinks = textWithLinks.replace(
            /(Nutrition info:)([^\.]+\.)/g, 
            '<div style="margin: 8px 0; padding: 5px; background-color: rgba(33, 150, 243, 0.05); border-radius: 5px; display: inline-block;">$1$2</div>'
        );
        
        // Make protein, carbs, fat and fiber numbers bold
        textWithLinks = textWithLinks.replace(
            /(\d+g\s*(protein|carbs|fat|fiber))/g,
            '<strong>$1</strong>'
        );
        
        // Format meal names (first part before colon if exists)
        textWithLinks = textWithLinks.replace(
            /^([^:]+):/,
            '<span style="font-size: 1.1em; font-weight: bold; color: var(--primary-color, #4CAF50);">$1:</span>'
        );
    }
    
    messageDiv.innerHTML = textWithLinks;
    
    // Add timestamp
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.style.fontSize = '10px';
    timestamp.style.marginTop = '5px';
    timestamp.style.opacity = '0.7';
    timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    messageDiv.appendChild(timestamp);
    
    // Add to chat
    aiChatMessages.appendChild(messageDiv);
    
    // If it's a buddy message, update the context and save preferences
    if (type === 'buddy') {
        storeResponseInContext(text);
        saveUserPreferences();
    }
    
    // If it's a user message, check for preference information
    if (type === 'user') {
        if (text.toLowerCase().includes('like') || 
            text.toLowerCase().includes('prefer') || 
            text.toLowerCase().includes('enjoy')) {
            learnUserPreferences(text);
        }
        
        if (text.toLowerCase().includes('don\'t like') || 
            text.toLowerCase().includes("don't like") || 
            text.toLowerCase().includes('dislike') || 
            text.toLowerCase().includes('hate') || 
            text.toLowerCase().includes('allergic')) {
            learnUserDislikes(text);
        }
        
        // Save preferences after learning
        saveUserPreferences();
    }
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
            const mealNameMatch = content.match(/(.+?):/); 
            const mealName = mealNameMatch ? mealNameMatch[1].trim() : content.trim();
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
    
    // Check for follow-up queries that reference previous context
    if (isFollowUpQuery(message)) {
        return handleFollowUpQuery(message, caloriesInfo);
    }
    
    // Handle meal-related queries
    if (message.includes('meal') || message.includes('food') || message.includes('eat') || 
        message.includes('dinner') || message.includes('lunch') || message.includes('breakfast') ||
        message.includes('snack') || message.includes('hungry') || message.includes('recipe')) {
        
        // Handle specific meal time requests
        if (message.includes('breakfast') || message.includes('morning meal')) {
            return generateMealSuggestionByType('breakfast', caloriesInfo, extractDietaryPreferences(message));
        } else if (message.includes('lunch') || message.includes('midday')) {
            return generateMealSuggestionByType('lunch', caloriesInfo, extractDietaryPreferences(message));
        } else if (message.includes('dinner') || message.includes('supper') || message.includes('evening meal')) {
            return generateMealSuggestionByType('dinner', caloriesInfo, extractDietaryPreferences(message));
        } else if (message.includes('snack')) {
            return generateMealSuggestionByType('snacks', caloriesInfo, extractDietaryPreferences(message));
        } 
        
        // Look for calorie ranges in the message
        const calorieMatch = message.match(/(\d+)\s*(?:kcal|calories|cal)/);
        if (calorieMatch && calorieMatch[1]) {
            const targetCalories = parseInt(calorieMatch[1]);
            return generateMealSuggestionByCalories(targetCalories, extractDietaryPreferences(message));
        }
        
        // Check for dietary preferences in the query
        const dietaryPreferences = extractDietaryPreferences(message);
        
        // Default to smart suggestion based on time of day and remaining calories
        return generateSmartMealSuggestion(caloriesInfo, dietaryPreferences);
    } 
    
    // Handle exercise queries
    else if (message.includes('exercise') || message.includes('workout') || 
             message.includes('activity') || message.includes('move') || 
             message.includes('burn') || message.includes('cardio') ||
             message.includes('strength') || message.includes('training')) {
        
        // Check if looking for specific type of exercise
        if (message.includes('cardio') || message.includes('aerobic') || message.includes('running') || 
            message.includes('walking') || message.includes('cycling') || message.includes('swimming')) {
            return generateExerciseSuggestionByType('cardio');
        } else if (message.includes('strength') || message.includes('weights') || 
                  message.includes('muscle') || message.includes('toning') || message.includes('resistance')) {
            return generateExerciseSuggestionByType('strength');
        } else if (message.includes('flexibility') || message.includes('stretch') || 
                  message.includes('yoga') || message.includes('mobility')) {
            return generateExerciseSuggestionByType('flexibility');
        }
        
        // Check for duration mentions
        const durationMatch = message.match(/(\d+)\s*(?:minute|min|hour)/);
        if (durationMatch && durationMatch[1]) {
            const minutes = parseInt(durationMatch[1]);
            // Adjust suggestions based on duration
            return generateExerciseSuggestionByDuration(minutes);
        }
        
        // Check for intensity mentions
        if (message.includes('easy') || message.includes('light') || message.includes('beginner')) {
            return generateExerciseSuggestionByIntensity('light');
        } else if (message.includes('hard') || message.includes('intense') || message.includes('advanced')) {
            return generateExerciseSuggestionByIntensity('intense');
        }
        
        // Default exercise suggestion
        return generateExerciseSuggestion();
    } 
    
    // Handle weight/progress queries
    else if (message.includes('weight') || message.includes('progress') || 
             message.includes('lost') || message.includes('losing') || 
             message.includes('gain') || message.includes('gained') ||
             message.includes('goal') || message.includes('target') ||
             message.includes('track') || message.includes('tracking')) {
        return generateProgressInsight();
    } 
    
    // Handle motivation queries
    else if (message.includes('motivation') || message.includes('inspire') || 
             message.includes('help me') || message.includes('struggling') || 
             message.includes('hard') || message.includes('difficult') ||
             message.includes('discouraged') || message.includes('stuck') ||
             message.includes('plateau')) {
        return generateMotivationMessage();
    } 
    
    // Handle thank you messages
    else if (message.includes('thanks') || message.includes('thank you') || message.includes('thx')) {
        // More personalized thanks based on context
        if (conversationContext.lastTopic === 'meals') {
            return "You're welcome! I'm glad I could help with meal suggestions. Let me know if you'd like more food ideas or have questions about nutrition!";
        } else if (conversationContext.lastTopic === 'exercise') {
            return "You're welcome! Keep up the great work with your exercise routine. I'm here if you need more workout ideas or tips!";
        } else if (conversationContext.lastTopic === 'progress') {
            return "You're welcome! Keep focusing on your progress, not perfection. Every step counts, and I'm here to support your journey!";
        } else {
            return "You're welcome! I'm here to help you on your health journey. Let me know if you need anything else!";
        }
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
    
    // Handle preference learning queries
    else if (message.includes('like') || message.includes('prefer') || message.includes('love') || 
             message.includes('favorite') || message.includes('enjoy')) {
        
        // Learn user preferences for future personalization
        learnUserPreferences(message);
        
        return "Thanks for sharing your preferences! I'll keep that in mind for future recommendations. Would you like me to suggest something based on what you enjoy?";
    }
    
    // Handle dislike queries
    else if (message.includes('don\'t like') || message.includes("don't like") || 
             message.includes('dislike') || message.includes('hate') || 
             message.includes('allergic') || message.includes('avoid')) {
        
        // Learn user dislikes for future personalization
        learnUserDislikes(message);
        
        return "I've noted what you want to avoid. I'll make sure future recommendations take this into account. Would you like me to suggest an alternative?";
    }
    
    // Instead of a generic response, provide personalized suggestions based on context
    const currentHour = new Date().getHours();
    let personalizedResponse = "";
    
    // Determine current meal time context with more natural language
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
    
    // Add calorie context with more natural language
    if (caloriesInfo.remaining > 500) {
        personalizedResponse += `You have ${caloriesInfo.remaining} calories remaining today. Here's a meal idea that fits your plan:\n\n`;
        personalizedResponse += generateMealSuggestionByType(
            currentHour >= 5 && currentHour < 11 ? 'breakfast' : 
            currentHour >= 11 && currentHour < 15 ? 'lunch' : 
            currentHour >= 18 && currentHour < 22 ? 'dinner' : 'snacks', 
            caloriesInfo,
            conversationContext.dietaryPreferences
        );
    } else if (caloriesInfo.remaining > 0) {
        personalizedResponse += `With ${caloriesInfo.remaining} calories remaining, you might want something light. Here's an option:\n\n`;
        // Generate a low-calorie snack suggestion taking into account dietary preferences
        const snacks = mealDatabase.snacks.filter(s => s.calories <= caloriesInfo.remaining);
        let filteredSnacks = snacks;
        
        // Filter by dietary preferences if any are known
        if (conversationContext.dietaryPreferences.length > 0) {
            filteredSnacks = snacks.filter(snack => {
                // Check if snack tags match any dietary preferences
                return snack.tags.some(tag => conversationContext.dietaryPreferences.includes(tag));
            });
            
            // If no matches, fall back to all snacks
            if (filteredSnacks.length === 0) filteredSnacks = snacks;
        }
        
        const snack = filteredSnacks[Math.floor(Math.random() * filteredSnacks.length)] || snacks[0] || mealDatabase.snacks[0];
        personalizedResponse += `${snack.name}: ${snack.ingredients.join(', ')}. (~${snack.calories} calories)`;
    } else {
        personalizedResponse += `You've reached your calorie goal for today! How about an exercise suggestion to boost your progress?\n\n`;
        personalizedResponse += generateExerciseSuggestion();
    }
    
    personalizedResponse += "\n\nYou can ask me about specific meals, exercise routines, or how your progress is going. What would you like to know more about?";
    
    return personalizedResponse;
}

/**
 * Determine if a message is a follow-up query referencing previous context
 * @param {string} message - User message
 * @returns {boolean} True if this is a follow-up query
 */
function isFollowUpQuery(message) {
    const followUpPhrases = [
        'another', 'different', 'more', 'similar', 'like that', 'else', 'other',
        'again', 'instead', 'alternative', 'something else', 'one more'
    ];
    
    // Check if message contains any follow-up phrases
    return followUpPhrases.some(phrase => message.includes(phrase));
}

/**
 * Handle follow-up queries by using conversation context
 * @param {string} message - User message
 * @param {Object} caloriesInfo - Current calorie information
 * @returns {string} AI response
 */
function handleFollowUpQuery(message, caloriesInfo) {
    // If we have a previous topic, use it to determine response
    if (conversationContext.lastTopic) {
        switch(conversationContext.lastTopic) {
            case 'meals':
                // If asking for another meal suggestion, use the last meal type
                if (conversationContext.lastMealType) {
                    // Filter out the last suggested meal to ensure variety
                    let response = `Here's another ${conversationContext.lastMealType} idea for you:\n\n`;
                    response += generateMealSuggestionByType(
                        conversationContext.lastMealType, 
                        caloriesInfo,
                        conversationContext.dietaryPreferences,
                        conversationContext.lastMealSuggested // Exclude last suggested meal
                    );
                    return response;
                } 
                // If asking for a different calorie target
                else if (message.includes('lower') || message.includes('fewer') || message.includes('less')) {
                    const newTarget = conversationContext.lastCalorieTarget 
                        ? Math.max(100, conversationContext.lastCalorieTarget - 100)
                        : Math.max(100, caloriesInfo.remaining * 0.4);
                    
                    return generateMealSuggestionByCalories(newTarget, conversationContext.dietaryPreferences);
                }
                else if (message.includes('higher') || message.includes('more')) {
                    const newTarget = conversationContext.lastCalorieTarget 
                        ? conversationContext.lastCalorieTarget + 100
                        : caloriesInfo.remaining * 0.6;
                    
                    return generateMealSuggestionByCalories(newTarget, conversationContext.dietaryPreferences);
                }
                else {
                    // Default to current meal time
                    return generateMealSuggestionByType(
                        conversationContext.currentMealTime,
                        caloriesInfo,
                        conversationContext.dietaryPreferences
                    );
                }
                break;
                
            case 'exercise':
                // Provide different exercise suggestion based on context
                if (message.includes('easier') || message.includes('beginner')) {
                    return generateExerciseSuggestionByIntensity('light');
                } else if (message.includes('harder') || message.includes('advanced')) {
                    return generateExerciseSuggestionByIntensity('intense');
                } else if (message.includes('different') || message.includes('type')) {
                    // Provide a different type than last time
                    const types = ['cardio', 'strength', 'flexibility'];
                    const lastType = types.find(type => conversationHistory.slice(-3).some(h => 
                        h.role === 'buddy' && h.message.includes(type)));
                    
                    // Remove last type from options
                    const filteredTypes = lastType ? types.filter(t => t !== lastType) : types;
                    const newType = filteredTypes[Math.floor(Math.random() * filteredTypes.length)];
                    
                    return generateExerciseSuggestionByType(newType);
                } else {
                    // Default to another general exercise
                    return generateExerciseSuggestion();
                }
                break;
                
            case 'progress':
                // Provide additional insights about progress
                return "Looking at your progress from a different angle: consistency in healthy habits is just as important as the numbers. Small daily choices add up to big results over time. Would you like me to suggest some small, sustainable habit changes that could help?";
                break;
                
            default:
                // Default to meal suggestions if topic unclear
                return generateSmartMealSuggestion(caloriesInfo, conversationContext.dietaryPreferences);
        }
    }
    
    // If no clear context, provide a meal suggestion based on time
    return generateSmartMealSuggestion(caloriesInfo, conversationContext.dietaryPreferences);
}

/**
 * Extract dietary preferences from user message
 * @param {string} message - User message
 * @returns {Array} List of dietary preferences
 */
function extractDietaryPreferences(message) {
    const preferences = [];
    const lowerMessage = message.toLowerCase();
    
    // Check for specific dietary terms
    if (lowerMessage.includes('vegetarian') || 
        lowerMessage.includes('no meat')) {
        preferences.push('vegetarian');
    }
    
    if (lowerMessage.includes('vegan') || 
        lowerMessage.includes('plant based') || 
        lowerMessage.includes('no animal')) {
        preferences.push('vegan');
    }
    
    if (lowerMessage.includes('gluten free') || 
        lowerMessage.includes('gluten-free') || 
        lowerMessage.includes('no gluten') ||
        lowerMessage.includes('celiac')) {
        preferences.push('gluten-free');
    }
    
    if (lowerMessage.includes('keto') || 
        lowerMessage.includes('ketogenic') || 
        lowerMessage.includes('low carb') ||
        lowerMessage.includes('low-carb')) {
        preferences.push('keto-friendly');
    }
    
    if (lowerMessage.includes('high protein') || 
        lowerMessage.includes('high-protein') ||
        lowerMessage.includes('protein rich')) {
        preferences.push('high-protein');
    }
    
    if (lowerMessage.includes('quick') || 
        lowerMessage.includes('fast') || 
        lowerMessage.includes('easy')) {
        preferences.push('quick');
    }
    
    // Get preferences from context if none in message
    if (preferences.length === 0 && conversationContext.dietaryPreferences.length > 0) {
        return [...conversationContext.dietaryPreferences];
    }
    
    return preferences;
}

/**
 * Learn and store user preferences from message
 * @param {string} message - User message
 */
function learnUserPreferences(message) {
    // Common food preferences to detect
    const foodPreferences = [
        'chicken', 'beef', 'fish', 'seafood', 'pork', 'vegetarian', 'vegan', 
        'pasta', 'rice', 'quinoa', 'bread', 'salad', 'soup', 'sandwich',
        'spicy', 'sweet', 'savory', 'fruit', 'vegetables', 'dairy', 'cheese',
        'eggs', 'nuts', 'seeds', 'legumes', 'beans', 'tofu', 'gluten-free'
    ];
    
    // Add detected preferences to context
    foodPreferences.forEach(food => {
        if (message.toLowerCase().includes(food)) {
            // Store in user feedback
            if (!conversationContext.userFeedback.likes) {
                conversationContext.userFeedback.likes = [];
            }
            
            if (!conversationContext.userFeedback.likes.includes(food)) {
                conversationContext.userFeedback.likes.push(food);
            }
        }
    });
}

/**
 * Learn and store user dislikes from message
 * @param {string} message - User message
 */
function learnUserDislikes(message) {
    // Common food dislikes to detect
    const foodDislikes = [
        'chicken', 'beef', 'fish', 'seafood', 'pork', 'meat', 
        'pasta', 'rice', 'quinoa', 'bread', 'gluten', 'salad', 'soup', 'sandwich',
        'spicy', 'sweet', 'savory', 'fruit', 'vegetables', 'dairy', 'cheese',
        'eggs', 'nuts', 'seeds', 'legumes', 'beans', 'tofu', 'soy'
    ];
    
    // Extract what user doesn't like
    const lowerMessage = message.toLowerCase();
    
    // Check common patterns for expressing dislikes
    const dislikePatterns = [
        /(?:don\'t|dont|do not|cannot|can\'t) (?:eat|have|like|stand|tolerate) ([a-z\s]+)/i,
        /(?:hate|dislike|avoid) ([a-z\s]+)/i,
        /(?:allergic to) ([a-z\s]+)/i,
        /no ([a-z\s]+) (?:please|for me)/i
    ];
    
    // Try to extract specific disliked foods from patterns
    dislikePatterns.forEach(pattern => {
        const match = lowerMessage.match(pattern);
        if (match && match[1]) {
            const dislikedFood = match[1].trim();
            
            // Store in user feedback
            if (!conversationContext.userFeedback.dislikes) {
                conversationContext.userFeedback.dislikes = [];
            }
            
            if (!conversationContext.userFeedback.dislikes.includes(dislikedFood)) {
                conversationContext.userFeedback.dislikes.push(dislikedFood);
            }
        }
    });
    
    // Also check for specific known foods
    foodDislikes.forEach(food => {
        const negativeContext = [
            `don't like ${food}`, 
            `don't eat ${food}`, 
            `hate ${food}`, 
            `dislike ${food}`,
            `allergic to ${food}`,
            `avoid ${food}`,
            `no ${food}`
        ];
        
        if (negativeContext.some(phrase => lowerMessage.includes(phrase))) {
            // Store in user feedback
            if (!conversationContext.userFeedback.dislikes) {
                conversationContext.userFeedback.dislikes = [];
            }
            
            if (!conversationContext.userFeedback.dislikes.includes(food)) {
                conversationContext.userFeedback.dislikes.push(food);
            }
        }
    });
}

/**
 * Generate an exercise suggestion based on specified duration
 * @param {number} minutes - Duration in minutes
 * @returns {string} Exercise suggestion
 */
function generateExerciseSuggestionByDuration(minutes) {
    // Short workouts (less than 15 minutes)
    if (minutes < 15) {
        const shortWorkouts = [
            `Try this ${minutes}-minute HIIT routine: 30 seconds each of jumping jacks, push-ups, squats, and plank with 15 seconds rest between exercises. Repeat until time is up.`,
            `For a quick ${minutes}-minute workout, try a tabata format: 20 seconds of mountain climbers followed by 10 seconds of rest, then 20 seconds of high knees, 10 seconds rest. Repeat for the full duration.`,
            `Even with just ${minutes} minutes, you can do 3 rounds of 10 squats, 10 push-ups (modified if needed), and 30 seconds of marching in place.`,
            `Try this ${minutes}-minute cardio blast: 30 seconds each of jumping jacks, high knees, butt kicks, and fast feet. Rest as needed and repeat until time is up.`
        ];
        return shortWorkouts[Math.floor(Math.random() * shortWorkouts.length)];
    }
    // Medium workouts (15-30 minutes)
    else if (minutes <= 30) {
        const mediumWorkouts = [
            `For a ${minutes}-minute workout, try this circuit: 1 minute each of jumping jacks, squats, push-ups, lunges, and plank. Rest 1 minute, then repeat for 2-3 rounds.`,
            `Here's a ${minutes}-minute walking interval workout: alternate 2 minutes of brisk walking with 1 minute of speed walking or light jogging.`,
            `Try this ${minutes}-minute bodyweight routine: 12 squats, 10 push-ups, 10 reverse lunges (each leg), 30-second plank, and 15 mountain climbers. Rest 1 minute between rounds and repeat.`,
            `For a ${minutes}-minute workout, try 5 minutes of light cardio warm-up, then alternate 1 minute of strength (squats, push-ups, etc.) with 1 minute of cardio (jumping jacks, high knees) until time is up.`
        ];
        return mediumWorkouts[Math.floor(Math.random() * mediumWorkouts.length)];
    }
    // Longer workouts (more than 30 minutes)
    else {
        const longWorkouts = [
            `For a ${minutes}-minute session, try: 10-minute warm-up, 20 minutes of interval training (1 minute high intensity, 2 minutes recovery), followed by 10 minutes of strength exercises and 5 minutes of stretching.`,
            `Here's a full ${minutes}-minute workout: 5-minute warm-up, 15 minutes of strength training (3 sets of squats, lunges, push-ups, rows), 15 minutes of moderate cardio, and 5-10 minutes of cool-down stretches.`,
            `For a complete ${minutes}-minute routine: Start with 10 minutes of mobility work, then 20 minutes of circuit training (30 seconds work/15 seconds rest), followed by 10 minutes of steady-state cardio and 5 minutes of stretching.`,
            `Try this ${minutes}-minute workout: 10-minute warm-up, 20-minute pyramid intervals (increase intensity for 5 minutes, then decrease for 5 minutes, repeat), 10 minutes of core work, and 5 minutes of stretching.`
        ];
        return longWorkouts[Math.floor(Math.random() * longWorkouts.length)];
    }
}

/**
 * Generate an exercise suggestion based on specified intensity
 * @param {string} intensity - 'light', 'moderate', or 'intense'
 * @returns {string} Exercise suggestion
 */
function generateExerciseSuggestionByIntensity(intensity) {
    const suggestions = {
        'light': [
            "Try a gentle 20-minute walk around your neighborhood, focusing on your posture and breathing deeply.",
            "Consider a beginner yoga flow that focuses on basic poses and proper breathing techniques. Just 15-20 minutes can help your flexibility and relaxation.",
            "Try chair exercises: seated leg lifts, arm circles, and gentle twists. Perfect for when you need low-impact movement.",
            "A light stretching routine focusing on your major muscle groups for 10-15 minutes can improve mobility and reduce stiffness.",
            "Try a 15-minute light dance workout to your favorite music - movement that brings joy is always beneficial!"
        ],
        'moderate': [
            "Consider a 30-minute brisk walking routine, aiming to walk at a pace where conversation is possible but you're still feeling some exertion.",
            "Try a circuit of bodyweight exercises: 12 squats, 10 push-ups (modified if needed), 10 lunges each leg, and a 30-second plank. Rest 30 seconds between exercises and repeat 3 times.",
            "A 25-minute bike ride at a steady pace is excellent moderate-intensity exercise that's low impact on your joints.",
            "Try a 30-minute dance workout video focusing on continuous movement rather than high-intensity jumps and moves.",
            "Consider a yoga flow class that incorporates some strength poses like warrior sequences and chair pose, which provide a moderate challenge."
        ],
        'intense': [
            "Try a HIIT workout: 40 seconds of burpees, mountain climbers, jump squats, and push-ups with 20 seconds rest between each. Repeat for 4-5 rounds.",
            "For an intense cardio session, try sprint intervals: 30 seconds of all-out effort followed by 90 seconds of recovery, repeated 8-10 times.",
            "Try a pyramid strength workout: Start with 10 reps of squats, push-ups, and lunges, then 9, then 8, all the way down to 1, resting only when needed.",
            "Consider a Tabata workout: 20 seconds of maximum effort followed by 10 seconds of rest, repeated 8 times for each exercise (jumping jacks, push-ups, mountain climbers, high knees).",
            "For a challenging workout, try 5 rounds of: 15 kettlebell swings, 10 burpees, 15 mountain climbers, and 10 push-ups, resting only between rounds."
        ]
    };
    
    const intensitySuggestions = suggestions[intensity] || suggestions.moderate;
    return intensitySuggestions[Math.floor(Math.random() * intensitySuggestions.length)];
}

/**
 * Generate a meal suggestion based on the time of day and remaining calories
 * @param {Object} caloriesInfo - Information about today's calories
 * @param {Array} dietaryPreferences - User's dietary preferences 
 * @returns {string} Meal suggestion
 */
function generateSmartMealSuggestion(caloriesInfo, dietaryPreferences = []) {
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
        
        // Check for dietary preferences
        let lightOptions = "cucumber slices with lemon (15 calories) or a cup of herbal tea with a small apple (80 calories)";
        
        if (dietaryPreferences.includes('high-protein')) {
            lightOptions = "a hard-boiled egg white (17 calories) or a small portion of plain Greek yogurt (60 calories)";
        } else if (dietaryPreferences.includes('vegan')) {
            lightOptions = "cucumber and carrot sticks (25 calories) or a handful of berries (30 calories)";
        } else if (dietaryPreferences.includes('keto-friendly')) {
            lightOptions = "a few slices of cucumber with a thin spread of cream cheese (45 calories) or a small handful of mixed nuts (70 calories)";
        }
        
        return `You're currently ${Math.abs(caloriesInfo.remaining)} calories over your daily goal. If you're still hungry, try a very light option like ${lightOptions}.`;
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
    
    return generateMealSuggestionByType(mealType, caloriesInfo, Math.round(targetCalories), dietaryPreferences);
}

/**
 * Generate a meal suggestion for a specific type (breakfast, lunch, etc.)
 * @param {string} mealType - Type of meal
 * @param {Object} caloriesInfo - Information about today's calories
 * @param {number} targetCalories - Target calories for the meal
 * @param {Array} dietaryPreferences - User's dietary preferences
 * @param {string} excludeMeal - Name of a meal to exclude (for variety)
 * @returns {string} Meal suggestion
 */
function generateMealSuggestionByType(mealType, caloriesInfo, targetCalories, dietaryPreferences = [], excludeMeal = null) {
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
    
    // Start with meals in the calorie range
    let eligibleMeals = mealDatabase[mealType].filter(meal => 
        meal.calories >= lowerBound && meal.calories <= upperBound
    );
    
    // Filter by dietary preferences if specified
    if (dietaryPreferences && dietaryPreferences.length > 0) {
        // Keep meals that match ANY of the dietary preferences in their tags
        const filteredByDiet = eligibleMeals.filter(meal => 
            meal.tags.some(tag => dietaryPreferences.includes(tag))
        );
        
        // Only use filtered results if we found matches
        if (filteredByDiet.length > 0) {
            eligibleMeals = filteredByDiet;
        }
    }
    
    // Check for user preferences and dislikes in conversation context
    if (conversationContext.userFeedback) {
        // Filter out meals containing disliked ingredients
        if (conversationContext.userFeedback.dislikes && conversationContext.userFeedback.dislikes.length > 0) {
            eligibleMeals = eligibleMeals.filter(meal => {
                // Check if any of the disliked ingredients are in this meal
                return !conversationContext.userFeedback.dislikes.some(dislike => 
                    // Check ingredients as a string to catch partial matches
                    meal.ingredients.join(' ').toLowerCase().includes(dislike.toLowerCase())
                );
            });
        }
        
        // Prioritize meals containing liked ingredients if we have more than 3 options
        if (conversationContext.userFeedback.likes && conversationContext.userFeedback.likes.length > 0 && eligibleMeals.length > 3) {
            const preferredMeals = eligibleMeals.filter(meal => {
                // Check if any of the liked ingredients are in this meal
                return conversationContext.userFeedback.likes.some(like => 
                    // Check ingredients as a string to catch partial matches
                    meal.ingredients.join(' ').toLowerCase().includes(like.toLowerCase())
                );
            });
            
            // Use preferred meals if we found matches
            if (preferredMeals.length > 0) {
                eligibleMeals = preferredMeals;
            }
        }
    }
    
    // Exclude the specified meal if needed
    if (excludeMeal) {
        eligibleMeals = eligibleMeals.filter(meal => meal.name !== excludeMeal);
    }
    
    // If no meals in range after filtering, get closest matches
    if (eligibleMeals.length === 0) {
        // Try again without dietary filters but still respect calorie range
        eligibleMeals = mealDatabase[mealType].filter(meal => 
            meal.calories >= lowerBound && meal.calories <= upperBound
        );
        
        // If still empty, sort all meals by closest calorie match
        if (eligibleMeals.length === 0) {
            const sortedByCloseness = [...mealDatabase[mealType]].sort((a, b) => 
                Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories)
            );
            
            // Exclude previously suggested meal
            if (excludeMeal) {
                eligibleMeals = sortedByCloseness.filter(meal => meal.name !== excludeMeal).slice(0, 3);
            } else {
                eligibleMeals = sortedByCloseness.slice(0, 3);
            }
        }
    }
    
    // Pick a random meal from eligible options
    const meal = eligibleMeals[Math.floor(Math.random() * eligibleMeals.length)];
    
    // Format meal info with nutrition details
    let response = `${meal.name}: ${meal.ingredients.join(', ')}. (~${meal.calories} calories)\n\n`;
    response += `Nutrition info: ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fat}g fat, ${meal.fiber}g fiber\n\n`;
    
    // Add context about calorie budget with appropriate language
    if (caloriesInfo.remaining > 0) {
        const caloriesLeft = caloriesInfo.remaining - meal.calories;
        if (caloriesLeft > 300) {
            response += `You have ${caloriesInfo.remaining} calories remaining today. This meal would leave you with ${caloriesLeft} calories for the rest of the day - enough for another meal or snacks.`;
        } else if (caloriesLeft > 0) {
            response += `You have ${caloriesInfo.remaining} calories remaining today. This meal would leave you with ${caloriesLeft} calories - perfect for a light snack later.`;
        } else {
            response += `This meal would put you ${Math.abs(caloriesLeft)} calories over your daily goal. You might want to add some exercise or adjust portion sizes.`;
        }
    } else {
        response += `You've already reached your calorie goal for today. This would put you ${Math.abs(caloriesInfo.remaining) + meal.calories} calories over your target. Consider adding some exercise to offset this, or perhaps a lighter option.`;
    }
    
    return response;
}

/**
 * Generate a meal suggestion based on a specific calorie target
 * @param {number} targetCalories - Target calories for the meal
 * @param {Array} dietaryPreferences - User's dietary preferences
 * @returns {string} Meal suggestion
 */
function generateMealSuggestionByCalories(targetCalories, dietaryPreferences = []) {
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
    
    // Start with meals in the calorie range
    let eligibleMeals = allMeals.filter(meal => 
        meal.calories >= lowerBound && meal.calories <= upperBound
    );
    
    // Filter by dietary preferences if specified
    if (dietaryPreferences && dietaryPreferences.length > 0) {
        const filteredByDiet = eligibleMeals.filter(meal => 
            meal.tags.some(tag => dietaryPreferences.includes(tag))
        );
        
        // Only use filtered results if we found matches
        if (filteredByDiet.length > 0) {
            eligibleMeals = filteredByDiet;
        }
    }
    
    // Check for user preferences and dislikes
    if (conversationContext.userFeedback) {
        // Filter out meals containing disliked ingredients
        if (conversationContext.userFeedback.dislikes && conversationContext.userFeedback.dislikes.length > 0) {
            eligibleMeals = eligibleMeals.filter(meal => {
                return !conversationContext.userFeedback.dislikes.some(dislike => 
                    meal.ingredients.join(' ').toLowerCase().includes(dislike.toLowerCase())
                );
            });
        }
        
        // Prioritize meals containing liked ingredients
        if (conversationContext.userFeedback.likes && conversationContext.userFeedback.likes.length > 0 && eligibleMeals.length > 3) {
            const preferredMeals = eligibleMeals.filter(meal => {
                return conversationContext.userFeedback.likes.some(like => 
                    meal.ingredients.join(' ').toLowerCase().includes(like.toLowerCase())
                );
            });
            
            if (preferredMeals.length > 0) {
                eligibleMeals = preferredMeals;
            }
        }
    }
    
    // If no meals in range after filtering, get closest matches
    if (eligibleMeals.length === 0) {
        // Try again without dietary filters but respect calorie range
        eligibleMeals = allMeals.filter(meal => 
            meal.calories >= lowerBound && meal.calories <= upperBound
        );
        
        // If still empty, sort all meals by closest calorie match
        if (eligibleMeals.length === 0) {
            const sortedByCloseness = [...allMeals].sort((a, b) => 
                Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories)
            );
            eligibleMeals = sortedByCloseness.slice(0, 3);
        }
    }
    
    // Pick a random meal from eligible options
    const meal = eligibleMeals[Math.floor(Math.random() * eligibleMeals.length)];
    
    // Determine the meal type based on database
    let mealTypeLabel = "meal";
    if (mealDatabase.breakfast.some(m => m.name === meal.name)) {
        mealTypeLabel = "breakfast";
    } else if (mealDatabase.lunch.some(m => m.name === meal.name)) {
        mealTypeLabel = "lunch";
    } else if (mealDatabase.dinner.some(m => m.name === meal.name)) {
        mealTypeLabel = "dinner";
    } else if (mealDatabase.snacks.some(m => m.name === meal.name)) {
        mealTypeLabel = "snack";
    }
    
    // Format meal info with nutrition details and additional context
    let response = `${meal.name}: ${meal.ingredients.join(', ')}. (~${meal.calories} calories)\n\n`;
    response += `Nutrition info: ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fat}g fat, ${meal.fiber}g fiber\n\n`;
    response += `Preparation time: approximately ${meal.prepTime} minutes.\n\n`;
    
    // Add context about when this meal might be appropriate
    response += `This would make a great ${mealTypeLabel} option${meal.tags.length > 0 ? ' and is ' + meal.tags.join(', ') : ''}.`;
    
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

/**
 * Save current user preferences to storage
 */
function saveUserPreferences() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser || !currentUser.email) return;
    
    // Prepare preferences object
    const preferences = {
        dietaryPreferences: conversationContext.dietaryPreferences,
        userFeedback: conversationContext.userFeedback
    };
    
    // Save to storage
    const preferencesKey = `ai_preferences_${currentUser.email}`;
    saveToStorage(preferencesKey, preferences);
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
        
        /* Quick Suggestions */
        .quick-suggestions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 10px 0;
            padding: 5px 0;
        }
        
        .quick-suggestion-btn {
            background-color: var(--bg-secondary, #f5f5f5);
            border: 1px solid var(--border-color, #ddd);
            border-radius: 15px;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: var(--text-primary, #333);
        }
        
        .quick-suggestion-btn:hover {
            background-color: var(--primary-light, #c8e6c9);
            border-color: var(--primary-color, #4CAF50);
        }
        
        /* Voice Input Button */
        .ai-voice-btn {
            background-color: var(--bg-secondary, #f5f5f5);
            border: 1px solid var(--border-color, #ddd);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-right: 8px;
        }
        
        .ai-voice-btn:hover {
            background-color: var(--primary-light, #c8e6c9);
        }
        
        .ai-voice-btn.recording {
            background-color: var(--primary-color, #4CAF50);
            color: white;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
            }
        }
        
        /* Enhanced Message Styling */
        .ai-message {
            position: relative;
            padding: 12px 15px;
            border-radius: 10px;
            margin-bottom: 10px;
            line-height: 1.5;
            max-width: 85%;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .ai-message.user {
            background-color: var(--primary-color, #4CAF50);
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 2px;
        }
        
        .ai-message.buddy {
            background-color: var(--bg-secondary, #f5f5f5);
            color: var(--text-primary, #333);
            margin-right: auto;
            border-bottom-left-radius: 2px;
        }
        
        .ai-message.user::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: -10px;
            width: 10px;
            height: 10px;
            background-color: var(--primary-color, #4CAF50);
            clip-path: polygon(0 0, 0% 100%, 100% 100%);
        }
        
        .ai-message.buddy::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: -10px;
            width: 10px;
            height: 10px;
            background-color: var(--bg-secondary, #f5f5f5);
            clip-path: polygon(100% 0, 0% 100%, 100% 100%);
        }
        
        /* Typing Indicator Styling */
        .ai-typing {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            border-radius: 10px;
            margin-bottom: 10px;
            background-color: var(--bg-secondary, #f5f5f5);
            max-width: 60px;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            background-color: var(--text-secondary, #666);
            border-radius: 50%;
            margin-right: 4px;
            animation: typingAnimation 1.2s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) {
            animation-delay: 0s;
        }
        
        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
            margin-right: 0;
        }
        
        @keyframes typingAnimation {
            0% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-5px);
            }
            100% {
                transform: translateY(0);
            }
        }
    `;
}

/**
 * Update the conversation context based on user message
 * @param {string} message - User message
 */
function updateConversationContext(message) {
    // Store the last 5 queries for context
    conversationContext.recentQueries.unshift(message.toLowerCase());
    if (conversationContext.recentQueries.length > 5) {
        conversationContext.recentQueries.pop();
    }
    
    // Detect meal type mentions
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('breakfast') || 
        lowerMessage.includes('morning meal') ||
        lowerMessage.includes('brunch') ||
        lowerMessage.includes('morning food')) {
        conversationContext.lastMealType = 'breakfast';
        conversationContext.lastTopic = 'meals';
    } else if (lowerMessage.includes('lunch') || 
               lowerMessage.includes('midday meal') ||
               lowerMessage.includes('noon')) {
        conversationContext.lastMealType = 'lunch';
        conversationContext.lastTopic = 'meals';
    } else if (lowerMessage.includes('dinner') || 
               lowerMessage.includes('evening meal') ||
               lowerMessage.includes('supper') ||
               lowerMessage.includes('night meal')) {
        conversationContext.lastMealType = 'dinner';
        conversationContext.lastTopic = 'meals';
    } else if (lowerMessage.includes('snack')) {
        conversationContext.lastMealType = 'snacks';
        conversationContext.lastTopic = 'meals';
    }
    
    // Detect exercise mentions
    if (lowerMessage.includes('exercise') || 
        lowerMessage.includes('workout') || 
        lowerMessage.includes('activity') || 
        lowerMessage.includes('cardio') ||
        lowerMessage.includes('strength') ||
        lowerMessage.includes('training')) {
        conversationContext.lastTopic = 'exercise';
    }
    
    // Detect progress mentions
    if (lowerMessage.includes('progress') || 
        lowerMessage.includes('weight') || 
        lowerMessage.includes('lost') ||
        lowerMessage.includes('goal')) {
        conversationContext.lastTopic = 'progress';
    }
    
    // Detect calorie mentions
    const calorieMatch = lowerMessage.match(/(\d+)\s*(?:kcal|calories|cal)/);
    if (calorieMatch && calorieMatch[1]) {
        conversationContext.lastCalorieTarget = parseInt(calorieMatch[1]);
    }
    
    // Detect dietary preferences
    const dietaryTerms = {
        'vegetarian': ['vegetarian', 'no meat'],
        'vegan': ['vegan', 'plant based', 'no animal products'],
        'gluten-free': ['gluten free', 'gluten-free', 'no gluten', 'celiac'],
        'keto': ['keto', 'ketogenic', 'low carb', 'low-carb'],
        'dairy-free': ['dairy free', 'dairy-free', 'no dairy', 'lactose'],
        'high-protein': ['high protein', 'protein rich', 'more protein'],
        'low-fat': ['low fat', 'low-fat', 'less fat'],
        'paleo': ['paleo', 'caveman diet']
    };
    
    // Check for dietary preferences in message
    Object.entries(dietaryTerms).forEach(([preference, terms]) => {
        if (terms.some(term => lowerMessage.includes(term)) && 
            !conversationContext.dietaryPreferences.includes(preference)) {
            conversationContext.dietaryPreferences.push(preference);
        }
    });
    
    // Detect reference to previous meals with phrases like "another one", "similar", etc.
    if ((lowerMessage.includes('another') || 
         lowerMessage.includes('similar') || 
         lowerMessage.includes('like that') ||
         lowerMessage.includes('more') ||
         lowerMessage.includes('different') ||
         lowerMessage.includes('else')) && 
        conversationContext.lastTopic === 'meals') {
        
        // Keep the previous meal type context
        // The AI will use this to suggest another meal of the same type
    }
    
    // Update current meal time context based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
        conversationContext.currentMealTime = 'breakfast';
    } else if (hour >= 11 && hour < 15) {
        conversationContext.currentMealTime = 'lunch';
    } else if (hour >= 15 && hour < 17) {
        conversationContext.currentMealTime = 'snacks';
    } else if (hour >= 17 && hour < 21) {
        conversationContext.currentMealTime = 'dinner';
    } else {
        conversationContext.currentMealTime = 'snacks';
    }
}

/**
 * Store AI response information in context for future reference
 * @param {string} response - AI response
 */
function storeResponseInContext(response) {
    // Extract meal name if a meal was suggested
    const mealNameMatch = response.match(/^([^:]+):/);
    if (mealNameMatch && mealNameMatch[1]) {
        conversationContext.lastMealSuggested = mealNameMatch[1].trim();
    }
    
    // Record if the response was about exercise
    if (response.includes('workout') || 
        response.includes('exercise') || 
        response.includes('activity') ||
        response.includes('cardio') ||
        response.includes('training')) {
        conversationContext.lastTopic = 'exercise';
    }
    
    // Record if the response was about progress
    if (response.includes('progress') || 
        response.includes('weight') || 
        response.includes('lost') ||
        response.includes('BMI') ||
        response.includes('goal')) {
        conversationContext.lastTopic = 'progress';
    }
    
    // Extract calorie information if mentioned
    const calorieMatch = response.match(/~(\d+) calories/);
    if (calorieMatch && calorieMatch[1]) {
        const calories = parseInt(calorieMatch[1]);
        if (calories > 0) {
            conversationContext.lastCalorieTarget = calories;
        }
    }
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    addAIBuddyStyles();
    initializeAIBuddy();
    
    // Add sound element for notifications
    const soundElement = document.createElement('audio');
    soundElement.id = 'messageSound';
    soundElement.src = 'achievement.mp3'; // Reuse existing sound
    soundElement.preload = 'auto';
    document.body.appendChild(soundElement);
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

/**
 * Generate AI Buddy (Motivation Coach) response
 * @param {string} message - User message
 * @returns {string} AI Buddy response focused on motivation and mindset
 */
function generateBuddyResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Extract user's current emotional/motivational state from message
    if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire')) {
        buddyContext.lastTopic = 'motivation';
        return generateMotivationMessage();
    }
    
    if (lowerMessage.includes('stuck') || lowerMessage.includes('plateau') || 
        lowerMessage.includes('not working') || lowerMessage.includes('giving up')) {
        buddyContext.lastTopic = 'plateau';
        
        // Customized response for plateaus and feeling stuck
        return "It's completely normal to hit plateaus in your wellness journey. Remember that progress isn't always linear, and your body is constantly adapting. Here are a few strategies that might help:\n\n" +
               "1. Revisit your 'why' - reconnect with your deeper motivation\n" +
               "2. Change one variable in your routine to create a new stimulus\n" +
               "3. Celebrate non-scale victories like improved energy or better sleep\n" +
               "4. Consider a short maintenance break to reset mentally\n\n" +
               "Remember, consistency over time is what creates lasting change. You've already shown tremendous strength by getting this far!";
    }
    
    if (lowerMessage.includes('craving') || lowerMessage.includes('temptation') ||
        lowerMessage.includes('cheat') || lowerMessage.includes('slip up')) {
        buddyContext.lastTopic = 'cravings';
        
        // Customized response for dealing with cravings
        return "Cravings can be challenging, but they're also a normal part of changing your habits. Here are some effective strategies to handle them:\n\n" +
               "1. The 10-minute rule: Wait 10 minutes before giving in - cravings often pass\n" +
               "2. Distraction: Engage in a quick activity that shifts your focus\n" +
               "3. Substitution: Find healthier alternatives that satisfy similar tastes\n" +
               "4. Mindfulness: Notice the craving without judgment, then let it pass\n\n" +
               "Remember, occasional indulgences can be part of a sustainable approach. The key is finding balance that works for you long-term.";
    }
    
    if (lowerMessage.includes('celebrate') || lowerMessage.includes('proud') ||
        lowerMessage.includes('achievement') || lowerMessage.includes('milestone')) {
        buddyContext.lastTopic = 'celebration';
        
        // Customized response for celebrating achievements
        return "Celebrating your wins - both big and small - is so important! Taking time to acknowledge your progress reinforces positive behaviors and boosts motivation.\n\n" +
               "Some meaningful ways to celebrate include:\n" +
               "• Journal about your progress and how far you've come\n" +
               "• Share your achievement with a supportive friend\n" +
               "• Treat yourself to something special (non-food related)\n" +
               "• Take a moment for simple gratitude\n\n" +
               "What specific achievement are you proud of right now? I'd love to celebrate with you!";
    }
    
    // Default motivation if no specific trigger found
    return generateMotivationMessage();
}

/**
 * Generate AI Chef (Nutrition Coach) response
 * @param {string} message - User message
 * @returns {string} AI Chef response focused on meals and nutrition
 */
function generateChefResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Handle meal type specific requests
    if (lowerMessage.includes('breakfast') || 
        (lowerMessage.includes('morning') && lowerMessage.includes('meal'))) {
        chefContext.lastMealType = 'breakfast';
        
        // Get calorie info
        const caloriesInfo = getCurrentCaloriesInfo();
        // Estimate breakfast calories (typically 25-30% of daily calories)
        const breakfastCalories = Math.round(caloriesInfo.goal * 0.25);
        
        return generateMealSuggestion('breakfast', breakfastCalories);
    }
    
    if (lowerMessage.includes('lunch') || 
        (lowerMessage.includes('midday') && lowerMessage.includes('meal'))) {
        chefContext.lastMealType = 'lunch';
        
        // Get calorie info
        const caloriesInfo = getCurrentCaloriesInfo();
        // Estimate lunch calories (typically 30-35% of daily calories)
        const lunchCalories = Math.round(caloriesInfo.goal * 0.3);
        
        return generateMealSuggestion('lunch', lunchCalories);
    }
    
    if (lowerMessage.includes('dinner') || lowerMessage.includes('supper') ||
        (lowerMessage.includes('evening') && lowerMessage.includes('meal'))) {
        chefContext.lastMealType = 'dinner';
        
        // Get calorie info
        const caloriesInfo = getCurrentCaloriesInfo();
        // Estimate dinner calories (typically 30-35% of daily calories)
        const dinnerCalories = Math.round(caloriesInfo.goal * 0.3);
        
        return generateMealSuggestion('dinner', dinnerCalories);
    }
    
    if (lowerMessage.includes('snack')) {
        chefContext.lastMealType = 'snacks';
        
        // Get calorie info
        const caloriesInfo = getCurrentCaloriesInfo();
        // Estimate snack calories (typically 10-15% of daily calories)
        const snackCalories = Math.round(caloriesInfo.goal * 0.1);
        
        return generateMealSuggestion('snacks', snackCalories);
    }
    
    // Handle meal plan requests
    if (lowerMessage.includes('meal plan') || 
        (lowerMessage.includes('plan') && lowerMessage.includes('week'))) {
        
        return "I'd be happy to create a personalized weekly meal plan for you! I'll customize it based on your calorie targets, preferences, and nutritional needs.\n\n" +
               "To create the most effective plan, I should consider:\n" +
               "• Your daily calorie target\n" +
               "• Any dietary preferences or restrictions\n" +
               "• How much time you have for meal prep\n" +
               "• Any specific cuisines you enjoy\n\n" +
               "Would you like me to generate a complete 7-day meal plan with breakfast, lunch, dinner and snacks?";
    }
    
    // Handle high protein meal requests
    if (lowerMessage.includes('protein') || lowerMessage.includes('muscle')) {
        let mealType = 'dinner'; // Default to dinner for protein-focused meals
        
        // Detect if specific meal type mentioned
        if (lowerMessage.includes('breakfast')) mealType = 'breakfast';
        if (lowerMessage.includes('lunch')) mealType = 'lunch';
        
        // Get high-protein options
        const highProteinMeals = mealDatabase[mealType].filter(meal => meal.protein > 20);
        
        if (highProteinMeals.length > 0) {
            const meal = highProteinMeals[Math.floor(Math.random() * highProteinMeals.length)];
            
            let response = `${meal.name}: ${meal.ingredients.join(', ')}. (~${meal.calories} calories)\n\n`;
            response += `Nutrition info: ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fat}g fat, ${meal.fiber}g fiber\n\n`;
            response += `This high-protein option provides ${meal.protein}g of protein to support muscle maintenance and recovery. Protein-rich meals can help with satiety and stabilizing blood sugar levels.`;
            
            return response;
        }
    }
    
    // Default to current meal time suggestion if no specific request
    const hourOfDay = new Date().getHours();
    let mealTypeByTime = 'snacks';
    
    if (hourOfDay >= 5 && hourOfDay < 10) {
        mealTypeByTime = 'breakfast';
    } else if (hourOfDay >= 10 && hourOfDay < 14) {
        mealTypeByTime = 'lunch';
    } else if (hourOfDay >= 16 && hourOfDay < 20) {
        mealTypeByTime = 'dinner';
    }
    
    const caloriesInfo = getCurrentCaloriesInfo();
    const caloriesPerMeal = {
        breakfast: Math.round(caloriesInfo.goal * 0.25),
        lunch: Math.round(caloriesInfo.goal * 0.3),
        dinner: Math.round(caloriesInfo.goal * 0.3),
        snacks: Math.round(caloriesInfo.goal * 0.15)
    };
    
    return generateMealSuggestion(mealTypeByTime, caloriesPerMeal[mealTypeByTime]);
}

/**
 * Generate AI Trainer (Fitness Coach) response
 * @param {string} message - User message
 * @returns {string} AI Trainer response focused on exercise and fitness
 */
function generateTrainerResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Handle quick workout requests
    if ((lowerMessage.includes('quick') || lowerMessage.includes('short')) && 
        (lowerMessage.includes('workout') || lowerMessage.includes('exercise'))) {
        
        trainerContext.lastExerciseFocus = 'quick';
        
        const quickWorkout = `Here's a quick and effective 15-minute workout you can do with minimal equipment:\n\n` +
            `**Warm-up (2 minutes)**\n` +
            `• Arm circles: 30 seconds\n` +
            `• High knees: 30 seconds\n` +
            `• Bodyweight squats: 30 seconds\n` +
            `• Torso twists: 30 seconds\n\n` +
            
            `**Circuit (repeat 3 times, 4 minutes per round)**\n` +
            `• Push-ups (or modified knee push-ups): 40 seconds, 20 seconds rest\n` +
            `• Reverse lunges: 40 seconds, 20 seconds rest\n` +
            `• Mountain climbers: 40 seconds, 20 seconds rest\n` +
            `• Plank hold: 40 seconds, 20 seconds rest\n\n` +
            
            `**Cooldown (1 minute)**\n` +
            `• Gentle stretching for major muscle groups\n\n` +
            
            `This workout provides a good balance of cardio and strength training, targeting all major muscle groups. You can adjust the intensity by modifying the exercises or changing the work/rest intervals.`;
        
        return quickWorkout;
    }
    
    // Handle weekly plan requests
    if (lowerMessage.includes('weekly') || lowerMessage.includes('week plan') || 
        lowerMessage.includes('workout plan')) {
        
        trainerContext.lastExerciseFocus = 'weekly plan';
        
        const fitnessLevel = trainerContext.workoutPreferences.fitnessLevel || 'beginner';
        let weeklyPlan = '';
        
        if (fitnessLevel === 'beginner') {
            weeklyPlan = `Here's a balanced weekly workout plan for beginners:\n\n` +
                `**Monday: Cardio Focus**\n` +
                `• 20-30 minutes walking/jogging or cycling\n` +
                `• 10 minutes of bodyweight exercises (squats, push-ups, lunges)\n` +
                `• 5 minutes stretching\n\n` +
                
                `**Tuesday: Upper Body Strength**\n` +
                `• Push-ups: 3 sets of 5-10 reps\n` +
                `• Dumbbell rows: 3 sets of 10 reps\n` +
                `• Shoulder press: 3 sets of 10 reps\n` +
                `• Tricep dips: 3 sets of 8 reps\n\n` +
                
                `**Wednesday: Rest or Light Activity**\n` +
                `• Gentle walking or yoga\n\n` +
                
                `**Thursday: Lower Body Strength**\n` +
                `• Bodyweight squats: 3 sets of 12 reps\n` +
                `• Lunges: 3 sets of 10 reps per leg\n` +
                `• Glute bridges: 3 sets of 12 reps\n` +
                `• Calf raises: 3 sets of 15 reps\n\n` +
                
                `**Friday: Cardio & Core**\n` +
                `• 20 minutes of interval walking/jogging\n` +
                `• Planks: 3 sets of 20-30 seconds\n` +
                `• Bicycle crunches: 3 sets of 10 reps per side\n` +
                `• Russian twists: 3 sets of 10 reps per side\n\n` +
                
                `**Saturday: Full Body**\n` +
                `• Circuit training: 3 rounds of:\n` +
                `  - Squats: 12 reps\n` +
                `  - Push-ups: 8 reps\n` +
                `  - Walking lunges: 10 steps\n` +
                `  - Plank: 30 seconds\n` +
                `  - Rest 1-2 minutes between rounds\n\n` +
                
                `**Sunday: Active Recovery**\n` +
                `• Gentle stretching or yoga\n` +
                `• Light walking\n\n` +
                
                `Remember to start with proper warm-ups and end with stretching. Adjust weights and reps based on your comfort level, and gradually increase intensity as you progress.`;
        } else if (fitnessLevel === 'intermediate') {
            weeklyPlan = `Here's a balanced weekly workout plan for intermediate fitness levels:\n\n` +
                `**Monday: Push (Chest, Shoulders, Triceps)**\n` +
                `• Bench press or push-ups: 3 sets of 10-12 reps\n` +
                `• Shoulder press: 3 sets of 10-12 reps\n` +
                `• Incline dumbbell press: 3 sets of 10-12 reps\n` +
                `• Tricep dips: 3 sets of 12 reps\n` +
                `• Lateral raises: 3 sets of 12-15 reps\n\n` +
                
                `**Tuesday: HIIT Cardio**\n` +
                `• 5 minute warm-up\n` +
                `• 20 minutes HIIT (30 seconds work, 30 seconds rest)\n` +
                `• 5 minute cool-down\n\n` +
                
                `**Wednesday: Pull (Back, Biceps)**\n` +
                `• Pull-ups or assisted pull-ups: 3 sets of 8-10 reps\n` +
                `• Bent-over rows: 3 sets of 10-12 reps\n` +
                `• Face pulls: 3 sets of 12-15 reps\n` +
                `• Bicep curls: 3 sets of 12 reps\n` +
                `• Reverse flyes: 3 sets of 15 reps\n\n` +
                
                `**Thursday: Core & Mobility**\n` +
                `• Plank variations: 3 sets of 45-60 seconds\n` +
                `• Russian twists: 3 sets of 20 reps\n` +
                `• Mountain climbers: 3 sets of 30 seconds\n` +
                `• Hanging leg raises: 3 sets of 12 reps\n` +
                `• 15 minutes of mobility work\n\n` +
                
                `**Friday: Legs**\n` +
                `• Squats: 4 sets of 10-12 reps\n` +
                `• Romanian deadlifts: 3 sets of 10-12 reps\n` +
                `• Walking lunges: 3 sets of 12 steps per leg\n` +
                `• Leg press: 3 sets of 12 reps\n` +
                `• Calf raises: 4 sets of 15 reps\n\n` +
                
                `**Saturday: Steady State Cardio + Core**\n` +
                `• 30-40 minutes moderate intensity cardio\n` +
                `• 15 minutes core circuit\n\n` +
                
                `**Sunday: Active Recovery**\n` +
                `• Yoga or mobility work\n` +
                `• Light walking or swimming\n\n` +
                
                `Adjust weights to challenge yourself while maintaining proper form. Aim to progressively increase weight or reps over time.`;
        } else {
            weeklyPlan = `Here's an advanced weekly workout plan for experienced fitness enthusiasts:\n\n` +
                `**Monday: Upper Body Power**\n` +
                `• Bench press: 5 sets of 5 reps\n` +
                `• Weighted pull-ups: 4 sets of 6-8 reps\n` +
                `• Overhead press: 4 sets of 6-8 reps\n` +
                `• Bent-over rows: 4 sets of 8 reps\n` +
                `• Weighted dips: 3 sets of 8 reps\n\n` +
                
                `**Tuesday: Lower Body Power**\n` +
                `• Barbell squats: 5 sets of 5 reps\n` +
                `• Deadlifts: 4 sets of 5 reps\n` +
                `• Walking lunges with weights: 3 sets of 12 per leg\n` +
                `• Box jumps: 4 sets of 8 reps\n` +
                `• Weighted hip thrusts: 3 sets of 10 reps\n\n` +
                
                `**Wednesday: HIIT & Core**\n` +
                `• 5 minute warm-up\n` +
                `• 25-30 minute HIIT session (work:rest ratio 1:1 or 2:1)\n` +
                `• Complex core circuit: 4 rounds\n` +
                `• 5 minute cool-down\n\n` +
                
                `**Thursday: Upper Body Hypertrophy**\n` +
                `• Incline dumbbell press: 4 sets of 8-10 reps\n` +
                `• Cable rows: 4 sets of 10-12 reps\n` +
                `• Lateral raises: 3 sets of 12-15 reps\n` +
                `• Face pulls: 3 sets of 15-20 reps\n` +
                `• Tricep extensions: 3 sets of 12 reps\n` +
                `• Bicep curls: 3 sets of 12 reps\n\n` +
                
                `**Friday: Lower Body Hypertrophy**\n` +
                `• Front squats: 4 sets of 8-10 reps\n` +
                `• Romanian deadlifts: 4 sets of 10 reps\n` +
                `• Bulgarian split squats: 3 sets of 10 per leg\n` +
                `• Leg press: 3 sets of 12 reps\n` +
                `• Seated calf raises: 4 sets of 15 reps\n\n` +
                
                `**Saturday: Conditioning**\n` +
                `• Circuit training: 5 rounds of 5 exercises\n` +
                `• 30 seconds work / 15 seconds rest\n` +
                `• Include compound movements\n` +
                `• Finish with 20 minutes steady-state cardio\n\n` +
                
                `**Sunday: Active Recovery/Mobility**\n` +
                `• Foam rolling\n` +
                `• Dynamic stretching\n` +
                `• Yoga or mobility work\n\n` +
                
                `This plan incorporates periodization with both strength and hypertrophy work. Adjust weights to ensure the last 1-2 reps of each set are challenging.`;
        }
        
        return weeklyPlan;
    }
    
    // Handle no-equipment workout requests
    if ((lowerMessage.includes('no equipment') || lowerMessage.includes('bodyweight') || 
         lowerMessage.includes('at home')) && 
        (lowerMessage.includes('workout') || lowerMessage.includes('exercise'))) {
        
        trainerContext.lastExerciseFocus = 'no equipment';
        
        return `Here's an effective full-body workout you can do without any equipment:\n\n` +
            `**Warm-up (5 minutes)**\n` +
            `• Jumping jacks: 30 seconds\n` +
            `• Arm circles: 30 seconds\n` +
            `• High knees: 30 seconds\n` +
            `• Bodyweight squats: 30 seconds\n` +
            `• Torso twists: 30 seconds\n` +
            `• Repeat once\n\n` +
            
            `**Main Workout (20-30 minutes)**\n` +
            `Complete 3-4 rounds of:\n` +
            `• Push-ups: 10-15 reps (modify on knees if needed)\n` +
            `• Bodyweight squats: 15-20 reps\n` +
            `• Mountain climbers: 30 seconds\n` +
            `• Reverse lunges: 10 reps per leg\n` +
            `• Plank: 30-60 seconds\n` +
            `• Glute bridges: 15-20 reps\n` +
            `• Bicycle crunches: 20 total reps\n` +
            `• Rest 60-90 seconds between rounds\n\n` +
            
            `**Finisher (optional, 5 minutes)**\n` +
            `• 30 seconds jumping jacks\n` +
            `• 30 seconds high knees\n` +
            `• 30 seconds bodyweight squats\n` +
            `• 30 seconds push-ups\n` +
            `• 30 seconds plank\n` +
            `• Repeat once\n\n` +
            
            `**Cool-down (5 minutes)**\n` +
            `• Static stretching for major muscle groups\n` +
            `• Hold each stretch for 20-30 seconds\n\n` +
            
            `To progress this workout over time:\n` +
            `• Increase the number of rounds\n` +
            `• Increase reps of each exercise\n` +
            `• Decrease rest periods\n` +
            `• Try more challenging variations (e.g., decline push-ups, pistol squats)`;
    }
    
    // Handle progress tracking requests
    if (lowerMessage.includes('track') || lowerMessage.includes('measure') || 
        lowerMessage.includes('progress')) {
        
        trainerContext.lastExerciseFocus = 'progress tracking';
        
        return `Tracking your fitness progress is essential for staying motivated and making informed adjustments to your routine. Here are the most effective metrics to track:\n\n` +
            `**Performance Metrics:**\n` +
            `• Strength: Record weights, reps, and sets for key exercises\n` +
            `• Endurance: Track distance, time, or pace for cardio activities\n` +
            `• Workout volume: Total weight lifted or time under tension\n` +
            `• Recovery: Resting heart rate and perceived exertion\n\n` +
            
            `**Body Composition Metrics:**\n` +
            `• Weight: Weekly measurements, same time of day\n` +
            `• Measurements: Monthly check of waist, hips, chest, arms, thighs\n` +
            `• Photos: Monthly progress pictures in consistent lighting/poses\n` +
            `• Body fat percentage (if available): Every 1-2 months\n\n` +
            
            `**Habit & Wellness Metrics:**\n` +
            `• Workout consistency: Number of completed workouts/week\n` +
            `• Sleep quality and duration\n` +
            `• Energy levels and mood\n` +
            `• Recovery quality\n\n` +
            
            `**Practical Tracking Methods:**\n` +
            `• Use the SlimEasy app to log workouts and measurements\n` +
            `• Keep a dedicated fitness journal\n` +
            `• Take progress photos in the same lighting/position/clothing\n` +
            `• Set specific, measurable goals to track against\n\n` +
            
            `Remember that progress isn't always linear - focus on trends over time rather than day-to-day fluctuations.`;
    }
    
    // Default to general exercise suggestion based on fitness level
    const profile = getUserProfile();
    return generateExerciseSuggestion(profile);
}

/**
 * Generate personalized greeting for AI Buddy
 * @returns {string} Personalized motivational greeting
 */
function generateBuddyGreeting() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return "Hello! I'm your SlimEasy AI Buddy, here to provide motivation and mindset support. How can I help you today?";
    
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
    
    greeting += "I'm your SlimEasy AI Buddy, here to support your mindset and motivation. ";
    
    // Check for recent progress
    const weightDataKey = `weight_history_${currentUser.email}`;
    const weightData = getFromStorage(weightDataKey, []);
    
    if (Array.isArray(weightData) && weightData.length > 1) {
        // Sort by date (newest first)
        const sortedData = [...weightData].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        const latestEntry = sortedData[0];
        const previousEntry = sortedData[1];
        
        if (latestEntry && previousEntry) {
            const weightChange = latestEntry.weight - previousEntry.weight;
            
            if (weightChange < 0) {
                greeting += `I see you're making great progress with your weight loss journey. How's your mindset today?`;
            } else if (weightChange > 0) {
                greeting += `I'm here to support you through all the ups and downs of your wellness journey. How can I help you today?`;
            } else {
                greeting += `Maintaining consistency is a significant achievement. How can I support your motivation today?`;
            }
        } else {
            greeting += `How can I help support your wellness journey today?`;
        }
    } else {
        greeting += `How can I support you with motivation or mindset advice today?`;
    }
    
    return greeting;
}

/**
 * Generate personalized greeting for AI Chef
 * @returns {string} Personalized meal-focused greeting
 */
function generateChefGreeting() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return "Hello! I'm your SlimEasy AI Chef, here to help with nutrition, recipes, and meal planning. What would you like to eat today?";
    
    const name = currentUser.name ? currentUser.name.split(' ')[0] : '';
    
    // Get time of day for contextual meal greeting
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour >= 5 && hour < 10) {
        greeting = `Good morning${name ? ', ' + name : ''}! Ready for a nutritious breakfast to start your day? `;
    } else if (hour >= 10 && hour < 14) {
        greeting = `Hello${name ? ', ' + name : ''}! Thinking about lunch options? `;
    } else if (hour >= 14 && hour < 17) {
        greeting = `Good afternoon${name ? ', ' + name : ''}! Need some healthy snack ideas? `;
    } else if (hour >= 17 && hour < 21) {
        greeting = `Good evening${name ? ', ' + name : ''}! Let's plan a satisfying dinner that fits your goals. `;
    } else {
        greeting = `Hello${name ? ', ' + name : ''}! `;
    }
    
    greeting += "I'm your SlimEasy AI Chef, here to help with personalized meal suggestions, recipes, and nutrition advice. ";
    
    // Get calorie info for context
    const caloriesInfo = getCurrentCaloriesInfo();
    if (caloriesInfo && caloriesInfo.remaining) {
        greeting += `You have about ${caloriesInfo.remaining} calories remaining for today. What kind of meal are you in the mood for?`;
    } else {
        greeting += `What kind of meal would you like help with today?`;
    }
    
    return greeting;
}

/**
 * Generate personalized greeting for AI Trainer
 * @returns {string} Personalized fitness-focused greeting
 */
function generateTrainerGreeting() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return "Hello! I'm your SlimEasy AI Trainer, ready to help with workouts and fitness plans. How would you like to move today?";
    
    const name = currentUser.name ? currentUser.name.split(' ')[0] : '';
    
    // Get day of week and time for contextual workout greeting
    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour >= 5 && hour < 10) {
        greeting = `Good morning${name ? ', ' + name : ''}! A morning workout is a great way to start the day. `;
    } else if (hour >= 10 && hour < 15) {
        greeting = `Hello${name ? ', ' + name : ''}! Looking for some midday movement? `;
    } else if (hour >= 15 && hour < 21) {
        greeting = `Good evening${name ? ', ' + name : ''}! Ready for an afternoon or evening workout? `;
    } else {
        greeting = `Hello${name ? ', ' + name : ''}! `;
    }
    
    greeting += "I'm your SlimEasy AI Trainer, here to help with personalized workout plans and fitness advice. ";
    
    // Weekend vs weekday context
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        greeting += `It's the weekend - a perfect time for a longer workout or trying something new! What type of exercise are you interested in today?`;
    } else {
        greeting += `What type of workout are you looking for today? I can help with quick routines, targeted exercises, or comprehensive plans.`;
    }
    
    return greeting;
}

/**
 * Update AI Buddy context based on conversation
 * @param {string} userMessage - User's message
 * @param {string} aiResponse - AI's response
 */
function updateBuddyContext(userMessage, aiResponse) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Add to recent queries for context
    sharedContext.recentQueries.unshift(lowerMessage);
    if (sharedContext.recentQueries.length > 5) {
        sharedContext.recentQueries.pop();
    }
    
    // Detect mood from message
    const moodKeywords = {
        positive: ['happy', 'excited', 'motivated', 'proud', 'accomplished'],
        negative: ['sad', 'depressed', 'unmotivated', 'stuck', 'struggling'],
        neutral: ['okay', 'alright', 'fine', 'stable']
    };
    
    let detectedMood = 'neutral';
    
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            detectedMood = mood;
            break;
        }
    }
    
    // Add to mood history
    buddyContext.moodHistory.unshift({
        mood: detectedMood,
        timestamp: new Date().toISOString()
    });
    
    if (buddyContext.moodHistory.length > 10) {
        buddyContext.moodHistory.pop();
    }
    
    // Detect challenges mentioned
    const challengeKeywords = ['hard', 'difficult', 'challenge', 'struggle', 'problem', 'obstacle', 'can\'t'];
    
    for (const keyword of challengeKeywords) {
        if (lowerMessage.includes(keyword)) {
            // Basic sentence extraction around the challenge keyword
            const sentences = lowerMessage.split(/[.!?]+/);
            for (const sentence of sentences) {
                if (sentence.toLowerCase().includes(keyword)) {
                    const challenge = sentence.trim();
                    if (challenge && !buddyContext.challenges.includes(challenge)) {
                        buddyContext.challenges.push(challenge);
                    }
                }
            }
        }
    }
    
    // Limit challenges list size
    if (buddyContext.challenges.length > 5) {
        buddyContext.challenges = buddyContext.challenges.slice(0, 5);
    }
    
    // If motivation provided, track it
    if (aiResponse.includes('motivation') || buddyContext.lastTopic === 'motivation') {
        buddyContext.lastMotivationMessage = aiResponse;
    }
    
    // Save user preferences
    saveUserPreferences();
}

/**
 * Update AI Chef context based on conversation
 * @param {string} userMessage - User's message
 * @param {string} aiResponse - AI's response
 */
function updateChefContext(userMessage, aiResponse) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Add to recent queries for context
    sharedContext.recentQueries.unshift(lowerMessage);
    if (sharedContext.recentQueries.length > 5) {
        sharedContext.recentQueries.pop();
    }
    
    // Extract meal name if a meal was suggested
    const mealNameMatch = aiResponse.match(/^([^:]+):/);
    if (mealNameMatch && mealNameMatch[1]) {
        chefContext.lastMealSuggested = mealNameMatch[1].trim();
    }
    
    // Detect cuisine preferences
    const cuisines = [
        'italian', 'mexican', 'chinese', 'japanese', 'thai', 'indian', 
        'mediterranean', 'greek', 'french', 'spanish', 'middle eastern',
        'american', 'korean', 'vietnamese'
    ];
    
    for (const cuisine of cuisines) {
        if (lowerMessage.includes(cuisine)) {
            if (!chefContext.cuisinePreferences.includes(cuisine)) {
                chefContext.cuisinePreferences.push(cuisine);
            }
            break;
        }
    }
    
    // Detect cooking time preferences
    if (lowerMessage.includes('quick') || lowerMessage.includes('fast') || 
        lowerMessage.includes('hurry') || lowerMessage.includes('minutes')) {
        chefContext.cookingTime = 15;  // Quick meals under 15 minutes
    } else if (lowerMessage.includes('meal prep') || lowerMessage.includes('batch') || 
               lowerMessage.includes('prepare ahead')) {
        chefContext.mealPrepMode = 'batch';
    }
    
    // Detect dietary preferences
    const dietaryTerms = {
        'vegetarian': ['vegetarian', 'no meat'],
        'vegan': ['vegan', 'plant based', 'no animal products'],
        'gluten-free': ['gluten free', 'gluten-free', 'no gluten', 'celiac'],
        'keto': ['keto', 'ketogenic', 'low carb', 'low-carb'],
        'dairy-free': ['dairy free', 'dairy-free', 'no dairy', 'lactose'],
        'high-protein': ['high protein', 'protein rich', 'more protein'],
        'low-fat': ['low fat', 'low-fat', 'less fat'],
        'paleo': ['paleo', 'caveman diet']
    };
    
    // Check for dietary preferences in message
    Object.entries(dietaryTerms).forEach(([preference, terms]) => {
        if (terms.some(term => lowerMessage.includes(term)) && 
            !sharedContext.dietaryPreferences.includes(preference)) {
            sharedContext.dietaryPreferences.push(preference);
        }
    });
    
    // Track meal ingredients discussed
    const ingredients = [
        'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'tofu', 'tempeh',
        'beans', 'lentils', 'rice', 'quinoa', 'pasta', 'potatoes', 'sweet potatoes',
        'broccoli', 'spinach', 'kale', 'avocado', 'tomatoes', 'bell peppers',
        'eggs', 'yogurt', 'cheese', 'milk', 'bread', 'oats', 'nuts', 'seeds'
    ];
    
    for (const ingredient of ingredients) {
        if (lowerMessage.includes(ingredient)) {
            if (!chefContext.lastIngredientDiscussed.includes(ingredient)) {
                chefContext.lastIngredientDiscussed.unshift(ingredient);
                if (chefContext.lastIngredientDiscussed.length > 5) {
                    chefContext.lastIngredientDiscussed.pop();
                }
            }
        }
    }
    
    // Save user preferences
    saveUserPreferences();
}

/**
 * Update AI Trainer context based on conversation
 * @param {string} userMessage - User's message
 * @param {string} aiResponse - AI's response
 */
function updateTrainerContext(userMessage, aiResponse) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Add to recent queries for context
    sharedContext.recentQueries.unshift(lowerMessage);
    if (sharedContext.recentQueries.length > 5) {
        sharedContext.recentQueries.pop();
    }
    
    // Detect workout preferences
    if (lowerMessage.includes('beginner') || lowerMessage.includes('start') || 
        lowerMessage.includes('new to') || lowerMessage.includes('just beginning')) {
        trainerContext.workoutPreferences.fitnessLevel = 'beginner';
    } else if (lowerMessage.includes('advanced') || lowerMessage.includes('experienced') || 
               lowerMessage.includes('athlete') || lowerMessage.includes('competitive')) {
        trainerContext.workoutPreferences.fitnessLevel = 'advanced';
    } else if (lowerMessage.includes('intermediate') || lowerMessage.includes('somewhat fit') || 
               lowerMessage.includes('moderately')) {
        trainerContext.workoutPreferences.fitnessLevel = 'intermediate';
    }
    
    // Detect equipment availability
    if (lowerMessage.includes('no equipment') || lowerMessage.includes('bodyweight') || 
        lowerMessage.includes('without equipment') || lowerMessage.includes('at home')) {
        trainerContext.workoutPreferences.equipmentAvailable = false;
    } else if (lowerMessage.includes('gym') || lowerMessage.includes('equipment') || 
               lowerMessage.includes('weights') || lowerMessage.includes('dumbbell') || 
               lowerMessage.includes('barbell')) {
        trainerContext.workoutPreferences.equipmentAvailable = true;
    }
    
    // Detect workout duration preference
    const durationMatches = lowerMessage.match(/(\d+)[\s-]*(minute|min)/);
    if (durationMatches && durationMatches[1]) {
        const minutes = parseInt(durationMatches[1]);
        if (minutes > 0 && minutes < 180) {  // Reasonable range check
            trainerContext.workoutPreferences.workoutDuration = minutes;
        }
    }
    
    // Detect focus areas
    const bodyAreas = [
        'arms', 'biceps', 'triceps', 'shoulders', 'chest', 'back', 'core', 
        'abs', 'legs', 'quads', 'hamstrings', 'glutes', 'calves', 'cardio',
        'upper body', 'lower body', 'full body'
    ];
    
    for (const area of bodyAreas) {
        if (lowerMessage.includes(area)) {
            if (!trainerContext.workoutPreferences.focusAreas.includes(area)) {
                trainerContext.workoutPreferences.focusAreas.push(area);
            }
        }
    }
    
    // Keep focus areas list manageable
    if (trainerContext.workoutPreferences.focusAreas.length > 3) {
        trainerContext.workoutPreferences.focusAreas = trainerContext.workoutPreferences.focusAreas.slice(0, 3);
    }
    
    // Detect injuries or limitations
    const injuryKeywords = [
        'injury', 'hurt', 'pain', 'sore', 'sprain', 'strain', 'bad', 'issue',
        'knee', 'back', 'shoulder', 'ankle', 'wrist', 'neck', 'hip', 'elbow'
    ];
    
    for (const keyword of injuryKeywords) {
        if (lowerMessage.includes(keyword)) {
            // Basic sentence extraction around the injury keyword
            const sentences = lowerMessage.split(/[.!?]+/);
            for (const sentence of sentences) {
                if (sentence.toLowerCase().includes(keyword)) {
                    const injury = sentence.trim();
                    if (injury && !trainerContext.workoutPreferences.injuryConsiderations.includes(injury)) {
                        trainerContext.workoutPreferences.injuryConsiderations.push(injury);
                    }
                }
            }
        }
    }
    
    // Save user preferences
    saveUserPreferences();
}

/**
 * Add message to AI Chef chat
 * @param {string} role - Message role (user or chef)
 * @param {string} message - Message text
 */
function addMessageToChefChat(role, message) {
    const aiChefChatMessages = document.getElementById('aiChefChatMessages');
    if (!aiChefChatMessages) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ${role}`;
    
    // Process message text (handle line breaks, links, etc.)
    const processedMessage = message.replace(/\n/g, '<br>');
    messageEl.innerHTML = processedMessage;
    
    aiChefChatMessages.appendChild(messageEl);
    
    // Scroll to bottom
    aiChefChatMessages.scrollTop = aiChefChatMessages.scrollHeight;
}

/**
 * Add message to AI Trainer chat
 * @param {string} role - Message role (user or trainer)
 * @param {string} message - Message text
 */
function addMessageToTrainerChat(role, message) {
    const aiTrainerChatMessages = document.getElementById('aiTrainerChatMessages');
    if (!aiTrainerChatMessages) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ${role}`;
    
    // Process message text (handle line breaks, links, etc.)
    const processedMessage = message.replace(/\n/g, '<br>');
    messageEl.innerHTML = processedMessage;
    
    aiTrainerChatMessages.appendChild(messageEl);
    
    // Scroll to bottom
    aiTrainerChatMessages.scrollTop = aiTrainerChatMessages.scrollHeight;
}

/**
 * Add coach-specific styles for AI Chef and AI Trainer 
 */
function addAIChefStyles() {
    // Create style element if it doesn't exist
    let styleEl = document.getElementById('ai-chef-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'ai-chef-styles';
        document.head.appendChild(styleEl);
    }
    
    // Add chef-specific CSS
    styleEl.textContent = `
        /* Chef Theme Colors */
        .chef-theme {
            --chef-primary: #2196F3;
            --chef-primary-light: #BBDEFB;
            --chef-primary-dark: #1976D2;
        }
        
        .chef-header {
            background-color: var(--chef-primary) !important;
        }
        
        /* Chef Message Styling */
        .ai-message.chef {
            background-color: var(--chef-primary-light);
            color: #333;
            margin-right: auto;
            border-bottom-left-radius: 2px;
        }
        
        .ai-message.chef::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: -10px;
            width: 10px;
            height: 10px;
            background-color: var(--chef-primary-light);
            clip-path: polygon(100% 0, 0% 100%, 100% 100%);
        }
        
        /* Chef Quick Suggestion Buttons */
        .chef-suggestion-btn {
            background-color: var(--chef-primary-light);
            border-color: var(--chef-primary);
        }
        
        .chef-suggestion-btn:hover {
            background-color: var(--chef-primary);
            color: white;
        }
        
        /* Nutritional Information Highlighting */
        .nutrition-highlight {
            background-color: rgba(33, 150, 243, 0.1);
            border-left: 3px solid var(--chef-primary);
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
        }
        
        /* Recipe Formatting */
        .recipe-title {
            font-weight: bold;
            color: var(--chef-primary);
            margin-bottom: 5px;
        }
        
        .recipe-ingredients {
            margin-bottom: 10px;
        }
        
        .recipe-instructions {
            line-height: 1.5;
        }
    `;
}

function addAITrainerStyles() {
    // Create style element if it doesn't exist
    let styleEl = document.getElementById('ai-trainer-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'ai-trainer-styles';
        document.head.appendChild(styleEl);
    }
    
    // Add trainer-specific CSS
    styleEl.textContent = `
        /* Trainer Theme Colors */
        .trainer-theme {
            --trainer-primary: #9C27B0;
            --trainer-primary-light: #E1BEE7;
            --trainer-primary-dark: #7B1FA2;
        }
        
        .trainer-header {
            background-color: var(--trainer-primary) !important;
        }
        
        /* Trainer Message Styling */
        .ai-message.trainer {
            background-color: var(--trainer-primary-light);
            color: #333;
            margin-right: auto;
            border-bottom-left-radius: 2px;
        }
        
        .ai-message.trainer::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: -10px;
            width: 10px;
            height: 10px;
            background-color: var(--trainer-primary-light);
            clip-path: polygon(100% 0, 0% 100%, 100% 100%);
        }
        
        /* Trainer Quick Suggestion Buttons */
        .trainer-suggestion-btn {
            background-color: var(--trainer-primary-light);
            border-color: var(--trainer-primary);
        }
        
        .trainer-suggestion-btn:hover {
            background-color: var(--trainer-primary);
            color: white;
        }
        
        /* Workout Formatting */
        .workout-section {
            margin: 10px 0;
        }
        
        .workout-title {
            font-weight: bold;
            color: var(--trainer-primary);
            margin-bottom: 5px;
        }
        
        .exercise-item {
            margin-bottom: 5px;
            padding-left: 15px;
            position: relative;
        }
        
        .exercise-item:before {
            content: '•';
            position: absolute;
            left: 0;
            color: var(--trainer-primary);
        }
        
        .workout-note {
            font-style: italic;
            margin-top: 5px;
            color: #666;
        }
    `;
}

// Export functions to global scope
window.initializeAICoaches = initializeAICoaches;
window.initializeAIBuddy = initializeAIBuddy;
window.initializeAIChef = initializeAIChef;
window.initializeAITrainer = initializeAITrainer;
window.generateBuddyResponse = generateBuddyResponse;
window.generateChefResponse = generateChefResponse;
window.generateTrainerResponse = generateTrainerResponse;
window.generateSmartMealSuggestion = generateSmartMealSuggestion;
