/**
 * SlimEasy Barcode Scanner
 * Handles barcode scanning and product lookup for food tracking
 */

// Initialize scanner state
let scanner = null;
let cameraId = null;
let flashOn = false;
let currentBarcode = '';
let currentProduct = null;

// Sample food database with nutritional information
// In a production app, this would be server-side or a more extensive API
const foodDatabase = {
    // Dairy Products
    "737628064502": {
        name: "Greek Yogurt, Plain",
        brand: "Chobani",
        calories: 90,
        protein: 16,
        carbs: 5,
        fat: 0,
        servingSize: "5.3 oz (150g)",
        servingUnit: "container"
    },
    "021130098354": {
        name: "Milk, 2% Reduced Fat",
        brand: "Organic Valley",
        calories: 130,
        protein: 8,
        carbs: 12,
        fat: 5,
        servingSize: "1 cup (240ml)",
        servingUnit: "cup"
    },
    // Bread & Cereals
    "028000031323": {
        name: "Cheerios Original",
        brand: "General Mills",
        calories: 100,
        protein: 3,
        carbs: 20,
        fat: 2,
        servingSize: "28g",
        servingUnit: "cup"
    },
    "072220011398": {
        name: "Whole Wheat Bread",
        brand: "Dave's Killer Bread",
        calories: 110,
        protein: 5,
        carbs: 22,
        fat: 1.5,
        servingSize: "1 slice (42g)",
        servingUnit: "slice"
    },
    // Snacks & Bars
    "722252100900": {
        name: "RXBAR, Chocolate Sea Salt",
        brand: "RXBAR",
        calories: 210,
        protein: 12,
        carbs: 23,
        fat: 9,
        servingSize: "52g",
        servingUnit: "bar"
    },
    "076840100446": {
        name: "Skinny Pop Original Popcorn",
        brand: "Skinny Pop",
        calories: 150,
        protein: 2,
        carbs: 15,
        fat: 10,
        servingSize: "28g",
        servingUnit: "cup"
    },
    // Fruits & Vegetables
    "033383523202": {
        name: "Organic Banana",
        brand: "Chiquita",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
        servingSize: "1 medium (118g)",
        servingUnit: "banana"
    },
    "041443120838": {
        name: "Organic Baby Spinach",
        brand: "Earthbound Farm",
        calories: 20,
        protein: 2,
        carbs: 3,
        fat: 0,
        servingSize: "85g",
        servingUnit: "cup"
    },
    // Beverages
    "052000328103": {
        name: "Gatorade, Cool Blue",
        brand: "Gatorade",
        calories: 80,
        protein: 0,
        carbs: 21,
        fat: 0,
        servingSize: "12 fl oz (355ml)",
        servingUnit: "bottle"
    },
    "049000042566": {
        name: "Coca-Cola Zero Sugar",
        brand: "Coca-Cola",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        servingSize: "12 fl oz (355ml)",
        servingUnit: "can"
    }
    // Additional products would be added in a real implementation
};

/**
 * Initialize the barcode scanner
 */
function initScanner() {
    // Set up mode switch buttons
    document.getElementById('cameraBtn').addEventListener('click', function() {
        setMode('camera');
    });
    
    document.getElementById('manualBtn').addEventListener('click', function() {
        setMode('manual');
    });
    
    // Set up manual lookup button
    document.getElementById('lookupBtn').addEventListener('click', function() {
        const barcode = document.getElementById('barcodeInput').value.trim();
        if (barcode) {
            lookupBarcode(barcode);
        } else {
            showNotification('Please enter a barcode number', 'error');
        }
    });
    
    // Set up switch camera and flash buttons
    document.getElementById('switchCamera').addEventListener('click', switchCamera);
    document.getElementById('toggleFlash').addEventListener('click', toggleFlash);
    
    // Set up result action buttons
    document.getElementById('newScanBtn').addEventListener('click', startNewScan);
    document.getElementById('addManuallyBtn').addEventListener('click', showAddProductModal);
    document.getElementById('addToLogBtn').addEventListener('click', addToFoodLog);
    
    // Set up modal buttons
    document.getElementById('closeProductModal').addEventListener('click', function() {
        document.getElementById('addProductModal').style.display = 'none';
    });
    
    // Set up add product form
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveNewProduct();
    });
    
    // Start in camera mode
    setMode('camera');
}

/**
 * Set the scanner mode (camera or manual)
 * @param {string} mode - Scanner mode ('camera' or 'manual')
 */
function setMode(mode) {
    // Update button states
    document.getElementById('cameraBtn').classList.toggle('active', mode === 'camera');
    document.getElementById('manualBtn').classList.toggle('active', mode === 'manual');
    
    // Show/hide appropriate container
    document.getElementById('scannerContainer').style.display = mode === 'camera' ? 'block' : 'none';
    document.getElementById('manualEntry').style.display = mode === 'manual' ? 'block' : 'none';
    
    // Initialize or stop the scanner as needed
    if (mode === 'camera') {
        initializeQuagga();
    } else {
        if (scanner && typeof scanner.stop === 'function') {
            scanner.stop();
        }
    }
}

/**
 * Initialize the Quagga barcode scanner
 */
function initializeQuagga() {
    if (scanner) {
        scanner.stop();
    }
    
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById('scanner'),
            constraints: {
                facingMode: "environment", // Use back camera by default
                width: { min: 640 },
                height: { min: 480 },
                aspectRatio: { min: 1, max: 2 }
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
            readers: [
                "ean_reader", // EAN-13 and EAN-8
                "upc_reader", // UPC-A and UPC-E
                "code_128_reader" // Code 128
            ],
            debug: {
                showCanvas: true,
                showPatches: true,
                showFoundPatches: true,
                showSkeleton: true,
                showLabels: true,
                showPatchLabels: true,
                showRemainingPatchLabels: true
            }
        },
        locate: true
    }, function(err) {
        if (err) {
            console.error("Error initializing Quagga:", err);
            showNotification("Camera access failed. Please check permissions or use manual entry.", "error");
            // Switch to manual mode if camera fails
            setMode('manual');
            return;
        }
        
        // Start the scanner
        Quagga.start();
        scanner = Quagga;
        
        // Get the track to enable flash
        const videoTrack = Quagga.CameraAccess.getActiveTrack();
        if (videoTrack && typeof videoTrack.getCapabilities === 'function') {
            const capabilities = videoTrack.getCapabilities();
            // Only show flash toggle if torch is available
            document.getElementById('toggleFlash').style.display = 
                capabilities.torch ? 'block' : 'none';
        }
    });
    
    // Add barcode detection handlers
    Quagga.onDetected(result => {
        const barcode = result.codeResult.code;
        
        // Validate barcode to ensure it's not a misread
        if (validateBarcode(barcode)) {
            // Stop scanning
            Quagga.stop();
            scanner = null;
            
            // Play success sound
            playSound('success');
            
            // Process the barcode
            lookupBarcode(barcode);
        }
    });
}

/**
 * Validate a barcode to ensure it's not a misread
 * @param {string} barcode - The barcode to validate
 * @returns {boolean} True if valid
 */
function validateBarcode(barcode) {
    // Basic validation - check for reasonable length and all numbers
    if (!/^\d{8,14}$/.test(barcode)) {
        return false;
    }
    
    // Validate UPC/EAN checksums in a production app
    return true;
}

/**
 * Look up a product by barcode
 * @param {string} barcode - The barcode to look up
 */
function lookupBarcode(barcode) {
    // Store current barcode
    currentBarcode = barcode;
    
    // Show scan results section
    document.getElementById('scanResults').style.display = 'block';
    document.getElementById('barcodeValue').textContent = `Barcode: ${barcode}`;
    
    // Check if the product is in our local database
    if (foodDatabase[barcode]) {
        // Product found in local database
        currentProduct = foodDatabase[barcode];
        displayProduct(currentProduct);
    } else {
        // In a real app, you would make an API call to a barcode database like Open Food Facts
        // For now, we'll just show the not found state
        currentProduct = null;
        document.getElementById('productDetails').style.display = 'none';
        document.getElementById('productNotFound').style.display = 'block';
    }
    
    // Add scan to recent history
    addToRecentScans(barcode, currentProduct);
}

/**
 * Display product information in the UI
 * @param {Object} product - The product to display
 */
function displayProduct(product) {
    // Show product details and hide not found message
    document.getElementById('productDetails').style.display = 'block';
    document.getElementById('productNotFound').style.display = 'none';
    
    // Update product information
    document.getElementById('productName').textContent = 
        product.brand ? `${product.brand} ${product.name}` : product.name;
    document.getElementById('productCalories').textContent = `${product.calories} kcal`;
    document.getElementById('productProtein').textContent = `${product.protein}g`;
    document.getElementById('productCarbs').textContent = `${product.carbs}g`;
    document.getElementById('productFat').textContent = `${product.fat}g`;
    
    // Update serving information
    document.getElementById('servingUnit').textContent = product.servingUnit || 'serving';
}

/**
 * Start a new scan
 */
function startNewScan() {
    // Hide results section
    document.getElementById('scanResults').style.display = 'none';
    
    // Reset current product
    currentProduct = null;
    currentBarcode = '';
    
    // Reset manual input
    document.getElementById('barcodeInput').value = '';
    
    // Start camera again if in camera mode
    if (document.getElementById('cameraBtn').classList.contains('active')) {
        initializeQuagga();
    }
}

/**
 * Switch between front and back cameras
 */
function switchCamera() {
    if (!scanner) return;
    
    Quagga.stop();
    
    // Determine current facing mode
    const currentFacingMode = cameraId ? "environment" : "user";
    const newFacingMode = currentFacingMode === "environment" ? "user" : "environment";
    
    // Toggle camera ID
    cameraId = !cameraId;
    
    // Reinitialize with new camera
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById('scanner'),
            constraints: {
                facingMode: newFacingMode,
                width: { min: 640 },
                height: { min: 480 },
                aspectRatio: { min: 1, max: 2 }
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
            readers: ["ean_reader", "upc_reader", "code_128_reader"]
        },
        locate: true
    }, function(err) {
        if (err) {
            console.error("Error switching camera:", err);
            showNotification("Failed to switch camera", "error");
            return;
        }
        
        Quagga.start();
    });
}

/**
 * Toggle flash/torch on the camera
 */
function toggleFlash() {
    const videoTrack = Quagga.CameraAccess.getActiveTrack();
    if (videoTrack && typeof videoTrack.applyConstraints === 'function') {
        // Toggle flash state
        flashOn = !flashOn;
        
        // Apply new torch state
        videoTrack.applyConstraints({
            advanced: [{ torch: flashOn }]
        }).catch(err => {
            console.error("Error toggling flash:", err);
            showNotification("Flash control is not supported on this device", "error");
        });
        
        // Update button icon
        const flashIcon = document.querySelector('#toggleFlash i');
        if (flashIcon) {
            flashIcon.className = flashOn ? 'fas fa-bolt-slash' : 'fas fa-bolt';
        }
    }
}

/**
 * Add a food item to the user's food log
 */
function addToFoodLog() {
    // Check if we have a product
    if (!currentProduct) {
        showNotification('No product selected', 'error');
        return;
    }
    
    // Get user inputs
    const mealType = document.getElementById('mealType').value;
    const servingSize = parseFloat(document.getElementById('servingSize').value) || 1;
    
    // Get current user
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) {
        showNotification('Please log in to track foods', 'error');
        return;
    }
    
    try {
        // Create food entry
        const foodEntry = {
            name: currentProduct.brand ? `${currentProduct.brand} ${currentProduct.name}` : currentProduct.name,
            calories: Math.round(currentProduct.calories * servingSize),
            protein: Math.round(currentProduct.protein * servingSize * 10) / 10,
            carbs: Math.round(currentProduct.carbs * servingSize * 10) / 10,
            fat: Math.round(currentProduct.fat * servingSize * 10) / 10,
            servingSize: servingSize,
            servingUnit: currentProduct.servingUnit || 'serving',
            barcode: currentBarcode
        };
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const dateStr = `${year}-${month}`;
        const dayStr = day;
        
        // Check if we have a foods object for this month
        const foodsKey = `foods_${currentUser.email}_${dateStr}`;
        let monthFoods = getFromStorage(foodsKey, {});
        
        // Check if we have foods for this day
        if (!monthFoods[dayStr]) {
            monthFoods[dayStr] = {};
        }
        
        // Check if we have foods for this meal type
        if (!monthFoods[dayStr][mealType]) {
            monthFoods[dayStr][mealType] = [];
        }
        
        // Add food to the meal
        monthFoods[dayStr][mealType].push(foodEntry);
        
        // Save back to storage
        saveToStorage(foodsKey, monthFoods);
        
        // Show success notification
        showNotification(`Added ${foodEntry.name} to ${mealType}`, 'success');
        
        // Start a new scan
        startNewScan();
    } catch (error) {
        console.error('Error adding food to log:', error);
        showNotification('Error adding food to log', 'error');
    }
}

/**
 * Show the add product modal
 */
function showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    
    // Set barcode in hidden field
    document.getElementById('productBarcode').value = currentBarcode;
    
    // Clear form fields
    document.getElementById('manualProductName').value = '';
    document.getElementById('manualBrand').value = '';
    document.getElementById('manualCalories').value = '';
    document.getElementById('manualServingSize').value = '';
    document.getElementById('manualProtein').value = '';
    document.getElementById('manualCarbs').value = '';
    document.getElementById('manualFat').value = '';
    
    // Show modal
    modal.style.display = 'block';
}

/**
 * Save a new product from the manual entry form
 */
function saveNewProduct() {
    try {
        // Get form values
        const barcode = document.getElementById('productBarcode').value;
        const name = document.getElementById('manualProductName').value;
        const brand = document.getElementById('manualBrand').value;
        const calories = parseInt(document.getElementById('manualCalories').value) || 0;
        const servingSize = document.getElementById('manualServingSize').value;
        const protein = parseFloat(document.getElementById('manualProtein').value) || 0;
        const carbs = parseFloat(document.getElementById('manualCarbs').value) || 0;
        const fat = parseFloat(document.getElementById('manualFat').value) || 0;
        
        // Create new product
        const newProduct = {
            name: name,
            brand: brand,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat,
            servingSize: servingSize,
            servingUnit: 'serving'
        };
        
        // Get current user's custom food database
        const currentUser = getFromStorage('currentUser');
        if (!currentUser) {
            showNotification('Please log in to save products', 'error');
            return;
        }
        
        const userFoodsKey = `custom_foods_${currentUser.email}`;
        let userFoods = getFromStorage(userFoodsKey, {});
        
        // Add or update product
        userFoods[barcode] = newProduct;
        
        // Save to storage
        saveToStorage(userFoodsKey, userFoods);
        
        // Update current product and display
        currentProduct = newProduct;
        displayProduct(newProduct);
        
        // Close modal
        document.getElementById('addProductModal').style.display = 'none';
        
        // Show success notification
        showNotification('Product saved successfully', 'success');
    } catch (error) {
        console.error('Error saving product:', error);
        showNotification('Error saving product', 'error');
    }
}

/**
 * Add a scan to the recent scans list
 * @param {string} barcode - The scanned barcode
 * @param {Object} product - The product data (if found)
 */
function addToRecentScans(barcode, product) {
    try {
        // Get current user
        const currentUser = getFromStorage('currentUser');
        if (!currentUser) return;
        
        // Get recent scans list
        const scansKey = `recent_scans_${currentUser.email}`;
        let recentScans = getFromStorage(scansKey, []);
        
        // Create scan entry
        const scanEntry = {
            barcode: barcode,
            timestamp: new Date().toISOString(),
            product: product ? {
                name: product.name,
                brand: product.brand,
                calories: product.calories
            } : null
        };
        
        // Add to beginning of list and limit to 10 items
        recentScans.unshift(scanEntry);
        if (recentScans.length > 10) {
            recentScans = recentScans.slice(0, 10);
        }
        
        // Save back to storage
        saveToStorage(scansKey, recentScans);
        
        // Update the UI
        loadRecentScans();
    } catch (error) {
        console.error('Error adding to recent scans:', error);
    }
}

/**
 * Load and display recent scans
 */
function loadRecentScans() {
    try {
        // Get recent scans for current user
        const currentUser = getFromStorage('currentUser');
        if (!currentUser) return;
        
        const scansKey = `recent_scans_${currentUser.email}`;
        const recentScans = getFromStorage(scansKey, []);
        
        // Get list container
        const container = document.getElementById('recentScansList');
        
        // Clear container
        container.innerHTML = '';
        
        // Show empty message if no scans
        if (recentScans.length === 0) {
            container.innerHTML = `
                <div class="empty-list">
                    <p>No recent scans</p>
                </div>
            `;
            return;
        }
        
        // Add each scan to the list
        recentScans.forEach(scan => {
            const scanCard = document.createElement('div');
            scanCard.className = 'recent-scan-card';
            scanCard.setAttribute('data-barcode', scan.barcode);
            
            // Format date
            const scanDate = new Date(scan.timestamp);
            const formattedDate = scanDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Create card content
            let cardContent = `
                <div class="recent-scan-header">
                    <span>Barcode: ${scan.barcode}</span>
                    <span>${formattedDate}</span>
                </div>
                <div class="recent-scan-info">
            `;
            
            if (scan.product) {
                // Product was found
                cardContent += `
                    <h3 class="recent-scan-name">${scan.product.brand ? `${scan.product.brand} ` : ''}${scan.product.name}</h3>
                    <div class="recent-scan-details">
                        <span class="recent-scan-detail">
                            <i class="fas fa-fire"></i> ${scan.product.calories} kcal
                        </span>
                    </div>
                `;
            } else {
                // Product not found
                cardContent += `
                    <h3 class="recent-scan-name">Unknown Product</h3>
                    <div class="recent-scan-details">
                        <span class="recent-scan-detail">
                            <i class="fas fa-exclamation-circle"></i> Not in database
                        </span>
                    </div>
                `;
            }
            
            cardContent += `</div>`;
            scanCard.innerHTML = cardContent;
            
            // Add click event to re-scan this barcode
            scanCard.addEventListener('click', function() {
                lookupBarcode(scan.barcode);
            });
            
            container.appendChild(scanCard);
        });
    } catch (error) {
        console.error('Error loading recent scans:', error);
    }
}

/**
 * Play a sound effect
 * @param {string} type - Type of sound (success, error, etc.)
 */
function playSound(type) {
    // Check if we're allowed to play sounds
    const soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
    if (!soundEnabled) return;
    
    // Create audio element (in a real app, you would preload these)
    const audio = new Audio();
    
    switch (type) {
        case 'success':
            audio.src = 'data:audio/mp3;base64,SUQzAwAAAAABEVRYWFgAAAAXAAAARW5naW5lZXJpbmcAAA8AAGEAAD/+94gAQcGNkYHNwf/AooGD/4Pgg+CD4YPg+D74Pvg+8YP/g+CgMEAYcDhwO//g4EAggXBgoCBQSCgYKB/8H4PwQf/8GgoGDg/8EBAIECD//BAQCAgQEDgwSChIOCgcFhQOEBYcGBwcICQwNDg4QEBQYGBggICAgICAgICAgICAgICAgICAgICAgIAAADtMQU1FMy45OXIBbgAAAAAAAAAAFUAkBGAXQQABzAAACpbbsTsBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAP8AAAf4AAAAgAAA/wAAABAAAB/gAAACAAAD/AAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
            break;
        case 'error':
            audio.src = 'data:audio/mp3;base64,SUQzAwAAAAABEVRYWFgAAAAXAAAARW5naW5lZXJpbmcAAA8AAGEAAD/+94gAQcGNkYHNwf/AooGD/4Pgg+CD4YPg+D74Pvg+8YP/g+CgMEAYcDhwO//g4EAggXBgoCBQSCgYKB/8H4PwQf/8GgoGDg/8EBAIECD//BAQCAgQEDgwSChIOCgcFhQOEBYcGBwcICQwNDg4QEBQYGBggICAgICAgICAgICAgICAgICAgICAgIAAADtMQU1FMy45OXIBbgAAAAAAAAAAFUAkBGAXQQABzAAACQbb0JAtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAP8AAAf4AAAAgAAA/wAAABAAAB/gAAACAAAD/AAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
            break;
    }
    
    // Play the sound
    audio.play().catch(e => {
        // Suppress errors from browsers requiring user interaction
        console.log('Audio playback blocked:', e);
    });
}

/**
 * Get the combined food database (built-in + user's custom foods)
 * @returns {Object} Combined food database
 */
function getCombinedFoodDatabase() {
    try {
        // Get current user
        const currentUser = getFromStorage('currentUser');
        if (!currentUser) return foodDatabase;
        
        // Get user's custom foods
        const userFoodsKey = `custom_foods_${currentUser.email}`;
        const userFoods = getFromStorage(userFoodsKey, {});
        
        // Combine databases (user foods take precedence)
        return { ...foodDatabase, ...userFoods };
    } catch (error) {
        console.error('Error getting combined food database:', error);
        return foodDatabase;
    }
}