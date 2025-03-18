/**
 * SlimEasy Community Functions
 * Handles community feed, post creation, and social sharing
 */

// Sample motivational quotes for initial content
const motivationalQuotes = [
    "The difference between try and triumph is just a little umph!",
    "You don't have to be great to start, but you have to start to be great.",
    "It's never too late to be what you might have been.",
    "Your body hears everything your mind says.",
    "You are stronger than you think.",
    "The hard days are what make you stronger.",
    "Progress, not perfection.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Strive for progress, not perfection.",
    "Your health is an investment, not an expense."
];

// Types of posts that can be shared
const postTypes = {
    weight: {
        icon: 'weight',
        title: 'Weight Milestone',
        modalTitle: 'Share Weight Milestone',
        placeholder: 'Share details about your weight loss achievement...'
    },
    meal: {
        icon: 'utensils',
        title: 'Healthy Meal',
        modalTitle: 'Share Healthy Meal',
        placeholder: 'Describe your meal and what makes it healthy...'
    },
    exercise: {
        icon: 'running',
        title: 'Workout Achievement',
        modalTitle: 'Share Workout Achievement',
        placeholder: 'Share details about your workout accomplishment...'
    },
    motivation: {
        icon: 'quote-right',
        title: 'Motivation',
        modalTitle: 'Share Motivation',
        placeholder: 'Share an inspiring quote or helpful tip...'
    }
};

/**
 * Check URL for shared content from other pages
 */
function checkForSharedContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const isShare = urlParams.get('share') === 'true';
    
    if (isShare) {
        // Get share parameters
        const type = urlParams.get('type') || 'weight';
        const title = urlParams.get('title') || '';
        const message = urlParams.get('message') || '';
        
        // Show share modal
        const shareModal = document.getElementById('shareModal');
        const postTypeInput = document.getElementById('postType');
        const modalTitle = document.getElementById('modalTitle');
        const titleInput = document.getElementById('postTitle');
        const contentTextarea = document.getElementById('postContent');
        
        // Update form for this post type
        postTypeInput.value = type;
        modalTitle.textContent = postTypes[type].modalTitle;
        contentTextarea.placeholder = postTypes[type].placeholder;
        
        // Pre-fill form
        titleInput.value = title;
        contentTextarea.value = message;
        
        // Show/hide appropriate extra fields
        toggleExtraFields(type);
        
        // Show modal
        shareModal.classList.add('show');
        
        // Clean URL
        window.history.replaceState({}, document.title, 'community.html');
    }
}

/**
 * Initialize community features when document loads
 */
function setupShareButtons() {
    // Set up share buttons
    const shareButtons = document.querySelectorAll('.share-button');
    const shareModal = document.getElementById('shareModal');
    const closeButton = document.getElementById('closeShareModal');
    const postTypeInput = document.getElementById('postType');
    const modalTitle = document.getElementById('modalTitle');
    const contentTextarea = document.getElementById('postContent');
    
    // Add click events to share buttons
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postType = this.getAttribute('data-type');
            
            // Update form for this post type
            postTypeInput.value = postType;
            modalTitle.textContent = postTypes[postType].modalTitle;
            contentTextarea.placeholder = postTypes[postType].placeholder;
            
            // Show/hide appropriate extra fields
            toggleExtraFields(postType);
            
            // Show modal
            shareModal.classList.add('show');
        });
    });
    
    // Close modal when close button is clicked
    closeButton.addEventListener('click', function() {
        shareModal.classList.remove('show');
        // Reset form when closing
        shareForm.reset();
    });
    
    // Close modal when clicking outside content
    shareModal.addEventListener('click', function(e) {
        if (e.target === shareModal) {
            shareModal.classList.remove('show');
            // Reset form when closing
            shareForm.reset();
        }
    });
    
    // Set up form submission
    const shareForm = document.getElementById('shareForm');
    if (shareForm) {
        shareForm.addEventListener('submit', handlePostSubmission);
    } else {
        console.error('Share form not found');
    }
}

/**
 * Toggle extra fields based on post type
 * @param {string} postType - Type of post being created
 */
function toggleExtraFields(postType) {
    // Hide all extra fields first
    document.querySelectorAll('.extra-fields').forEach(field => {
        field.style.display = 'none';
    });
    
    // Show only relevant fields
    if (postType === 'weight') {
        document.getElementById('weightFields').style.display = 'block';
    } else if (postType === 'meal') {
        document.getElementById('mealFields').style.display = 'block';
    } else if (postType === 'exercise') {
        document.getElementById('exerciseFields').style.display = 'block';
    }
}

/**
 * Handle form submission for new posts
 * @param {Event} e - Form submission event
 */
function handlePostSubmission(e) {
    e.preventDefault();
    
    try {
        // Get current user
        const currentUser = getFromStorage('currentUser');
        if (!currentUser) {
            showNotification('Please log in to share posts', 'error');
            return;
        }
        
        // Get form data
        const form = e.target;
        const formData = new FormData(form);
        const postType = formData.get('postType');
        const title = formData.get('title');
        const content = formData.get('content');
        
        // Create post object
        const post = {
            id: Date.now().toString(),
            type: postType,
            title: title,
            content: content,
            author: {
                name: currentUser.name || currentUser.email.split('@')[0],
                id: currentUser.email
            },
            date: new Date().toISOString(),
            likes: 0,
            comments: [],
            userLiked: false
        };
        
        // Add type-specific data
        if (postType === 'weight') {
            post.weightLost = parseFloat(formData.get('weightValue')) || 0;
        } else if (postType === 'meal') {
            post.calories = parseInt(formData.get('calories')) || 0;
        } else if (postType === 'exercise') {
            post.duration = parseInt(formData.get('duration')) || 0;
        }
        
        // Handle social sharing
        const shareToTwitter = formData.get('shareTwitter') === 'on';
        const shareToFacebook = formData.get('shareFacebook') === 'on';
        
        if (shareToTwitter || shareToFacebook) {
            // In a real app, this would integrate with social APIs
            // For now, we'll just show a notification
            const networks = [];
            if (shareToTwitter) networks.push('Twitter');
            if (shareToFacebook) networks.push('Facebook');
            
            showNotification(`Shared to ${networks.join(' and ')}!`, 'success');
        }
        
        // Save the post
        savePost(post);
        
        // Close modal and reset form
        document.getElementById('shareModal').classList.remove('show');
        form.reset();
        
        // Reload feed to show new post
        loadCommunityFeed();
        
        // Show success notification
        showNotification('Post shared successfully!', 'success');
    } catch (error) {
        console.error('Error submitting post:', error);
        showNotification('Error sharing post', 'error');
    }
}

/**
 * Save a post to local storage
 * @param {Object} post - Post data to save
 */
function savePost(post) {
    try {
        // Get existing posts or initialize empty array
        const communityPosts = getFromStorage('community_posts', []);
        
        // Add new post to beginning of array
        communityPosts.unshift(post);
        
        // Save back to storage
        saveToStorage('community_posts', communityPosts);
        
        console.log('Post saved:', post);
    } catch (error) {
        console.error('Error saving post:', error);
        throw error;
    }
}

/**
 * Load posts for the community feed
 * @param {string} filter - Optional filter for post type
 */
function loadCommunityFeed(filter = 'all') {
    try {
        // Get feed container
        const feedContainer = document.getElementById('communityFeed');
        
        // Get posts from storage
        let posts = getFromStorage('community_posts', []);
        
        // If no posts exist, create sample content
        if (posts.length === 0) {
            createSampleContent();
            posts = getFromStorage('community_posts', []);
        }
        
        // Apply filter if not 'all'
        if (filter !== 'all') {
            posts = posts.filter(post => post.type === filter);
        }
        
        // Clear current feed
        feedContainer.innerHTML = '';
        
        // If no posts after filtering, show empty message
        if (posts.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-feed-message';
            emptyMessage.innerHTML = `
                <i class="fas fa-filter"></i>
                <p>No ${filter} posts found. Why not create one?</p>
            `;
            feedContainer.appendChild(emptyMessage);
            return;
        }
        
        // Render each post
        posts.forEach(post => {
            const postElement = createPostElement(post);
            feedContainer.appendChild(postElement);
        });
        
        // Set up filter change handler
        document.getElementById('feedFilter').addEventListener('change', function() {
            loadCommunityFeed(this.value);
        });
    } catch (error) {
        console.error('Error loading community feed:', error);
        showNotification('Error loading community feed', 'error');
    }
}

/**
 * Create a post element for the feed
 * @param {Object} post - Post data
 * @returns {HTMLElement} The created post element
 */
function createPostElement(post) {
    // Create post container
    const postElement = document.createElement('div');
    postElement.className = 'feed-post';
    postElement.setAttribute('data-post-id', post.id);
    postElement.setAttribute('data-post-type', post.type);
    
    // Format date
    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Get first letter of author name for avatar
    const avatarLetter = post.author.name.charAt(0).toUpperCase();
    
    // Get type badge text and icon
    const typeBadgeClass = `post-type-${post.type}`;
    const typeBadgeText = postTypes[post.type].title;
    const typeIcon = postTypes[post.type].icon;
    
    // Create post header
    let postContent = `
        <div class="post-header">
            <div class="post-avatar">
                ${avatarLetter}
            </div>
            <div class="post-meta">
                <h3 class="post-author">${post.author.name}</h3>
                <p class="post-date">${formattedDate}</p>
            </div>
            <span class="post-type-badge ${typeBadgeClass}">
                <i class="fas fa-${typeIcon}"></i> ${typeBadgeText}
            </span>
        </div>
        <h2 class="post-title">${post.title}</h2>
        <p class="post-content">${post.content}</p>
    `;
    
    // Add type-specific details
    if (post.type === 'weight' && post.weightLost > 0) {
        postContent += `
            <div class="post-details">
                <strong><i class="fas fa-weight"></i> Weight Lost:</strong> ${post.weightLost.toFixed(1)} kg (${Math.round(post.weightLost * 2.20462)} lb)
            </div>
        `;
    } else if (post.type === 'meal' && post.calories > 0) {
        postContent += `
            <div class="post-details">
                <strong><i class="fas fa-fire"></i> Calories:</strong> ${post.calories} kcal
            </div>
        `;
    } else if (post.type === 'exercise' && post.duration > 0) {
        postContent += `
            <div class="post-details">
                <strong><i class="fas fa-clock"></i> Duration:</strong> ${post.duration} minutes
            </div>
        `;
    }
    
    // Add post actions
    postContent += `
        <div class="post-actions">
            <button class="post-action like-button ${post.userLiked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}">
                <i class="fas fa-heart"></i> ${post.likes}
            </button>
            <button class="post-action" data-action="comment" data-post-id="${post.id}">
                <i class="fas fa-comment"></i> ${post.comments.length}
            </button>
            <button class="post-action" data-action="share" data-post-id="${post.id}">
                <i class="fas fa-share-alt"></i> Share
            </button>
        </div>
    `;
    
    // Set inner HTML and add event listeners
    postElement.innerHTML = postContent;
    
    // Add event listeners to action buttons
    addPostActionListeners(postElement);
    
    return postElement;
}

/**
 * Add event listeners to post action buttons
 * @param {HTMLElement} postElement - The post element
 */
function addPostActionListeners(postElement) {
    // Like button
    const likeButton = postElement.querySelector('.like-button');
    if (likeButton) {
        likeButton.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            toggleLike(postId, this);
        });
    }
    
    // Comment button
    const commentButton = postElement.querySelector('[data-action="comment"]');
    if (commentButton) {
        commentButton.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            showNotification('Comments feature coming soon!', 'info');
        });
    }
    
    // Share button
    const shareButton = postElement.querySelector('[data-action="share"]');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            sharePostExternally(postId);
        });
    }
}

/**
 * Toggle like on a post
 * @param {string} postId - ID of the post
 * @param {HTMLElement} button - Like button element
 */
function toggleLike(postId, button) {
    try {
        // Get posts from storage
        const posts = getFromStorage('community_posts', []);
        
        // Find the post
        const postIndex = posts.findIndex(post => post.id === postId);
        if (postIndex === -1) return;
        
        const post = posts[postIndex];
        
        // Toggle like status
        if (post.userLiked) {
            post.likes = Math.max(0, post.likes - 1);
            post.userLiked = false;
            button.classList.remove('liked');
        } else {
            post.likes += 1;
            post.userLiked = true;
            button.classList.add('liked');
        }
        
        // Update like count in button
        button.innerHTML = `<i class="fas fa-heart"></i> ${post.likes}`;
        
        // Save updated posts
        saveToStorage('community_posts', posts);
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

/**
 * Share a post to external platforms
 * @param {string} postId - ID of the post to share
 */
function sharePostExternally(postId) {
    try {
        // Get posts from storage
        const posts = getFromStorage('community_posts', []);
        
        // Find the post
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        
        // In a real app, we'd integrate with Web Share API or social media APIs
        // For now, show a dialog with sharing options
        
        // Create sharing text
        const shareText = `Check out my ${postTypes[post.type].title.toLowerCase()} on SlimEasy: ${post.title}`;
        
        // If Web Share API is available, use it
        if (navigator.share) {
            navigator.share({
                title: 'SlimEasy Progress Share',
                text: shareText,
                url: window.location.href
            })
            .then(() => console.log('Successful share'))
            .catch(error => console.log('Error sharing:', error));
        } else {
            // Otherwise show notification
            showNotification('Shared to clipboard!', 'success');
            
            // Try to copy to clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText)
                    .then(() => console.log('Text copied to clipboard'))
                    .catch(err => console.error('Error copying text: ', err));
            }
        }
    } catch (error) {
        console.error('Error sharing post:', error);
        showNotification('Error sharing post', 'error');
    }
}

/**
 * Create sample content for first-time users
 */
function createSampleContent() {
    try {
        // Check if we already have posts
        const existingPosts = getFromStorage('community_posts', []);
        if (existingPosts.length > 0) return;
        
        // Create a random motivational post
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        
        const samplePosts = [
            {
                id: 'sample-1',
                type: 'motivation',
                title: 'Daily Motivation',
                content: randomQuote,
                author: {
                    name: 'SlimEasy Team',
                    id: 'team@slimeasy.app'
                },
                date: new Date().toISOString(),
                likes: 5,
                comments: [],
                userLiked: false
            },
            {
                id: 'sample-2',
                type: 'weight',
                title: 'First Week Success!',
                content: 'Really happy with my progress this week. Staying consistent with my diet and exercise plan is paying off!',
                author: {
                    name: 'Sarah',
                    id: 'sarah@example.com'
                },
                date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                likes: 8,
                weightLost: 1.5,
                comments: [],
                userLiked: false
            },
            {
                id: 'sample-3',
                type: 'meal',
                title: 'Healthy Breakfast Bowl',
                content: 'Started my day with a nutritious breakfast bowl: Greek yogurt, mixed berries, chia seeds, and a drizzle of honey.',
                author: {
                    name: 'Michael',
                    id: 'michael@example.com'
                },
                date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                likes: 12,
                calories: 320,
                comments: [],
                userLiked: false
            },
            {
                id: 'sample-4',
                type: 'exercise',
                title: 'Morning Run Personal Best',
                content: 'Beat my personal best on my morning run today! Feeling stronger every day.',
                author: {
                    name: 'Emma',
                    id: 'emma@example.com'
                },
                date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                likes: 15,
                duration: 45,
                comments: [],
                userLiked: false
            }
        ];
        
        // Save sample posts
        saveToStorage('community_posts', samplePosts);
    } catch (error) {
        console.error('Error creating sample content:', error);
    }
}

/**
 * Show notification toast
 * @param {string} message - Message to show
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'success') {
    try {
        // Use utility function from utils.js if available
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // Fallback implementation
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        
        const notification = document.createElement('div');
        notification.style.background = type === 'success' ? '#4CAF50' : 
                                      type === 'error' ? '#F44336' : '#2196F3';
        notification.style.color = 'white';
        notification.style.padding = '12px 16px';
        notification.style.marginTop = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.transition = 'all 0.3s ease-in-out';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.textContent = message;
        
        container.appendChild(notification);
        document.body.appendChild(container);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.removeChild(container);
            }, 300);
        }, 3000);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}
