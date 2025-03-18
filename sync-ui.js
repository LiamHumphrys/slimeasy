/**
 * SlimEasy - Local Storage Only Version
 * This file replaces the cloud synchronization functionality with local storage only
 */

/**
 * Stub function for backward compatibility
 */
function initializeSyncUI() {
  // No-op: Cloud sync disabled
}

/**
 * Stub function for backward compatibility
 */
function updateSyncStatusUI() {
  // No-op: Cloud sync disabled
}

/**
 * Stub function for backward compatibility
 */
function updateNavIndicator() {
  // No-op: Cloud sync disabled
}

/**
 * Check if cloud sync is enabled (always returns false)
 * @returns {Promise<boolean>} Always resolves to false
 */
function isCloudSyncEnabled() {
  return Promise.resolve(false);
}

/**
 * Stub function for backward compatibility
 */
function toggleCloudSync() {
  console.log('Cloud sync is disabled in this version');
  return Promise.resolve(false);
}

/**
 * Stub function for backward compatibility
 */
function manualSync() {
  console.log('Cloud sync is disabled in this version');
  return Promise.resolve(false);
}

/**
 * Stub function for backward compatibility
 */
function getSyncStatus() {
  return { enabled: false, online: true, conflicts: 0, inProgress: false };
}

/**
 * Stub function for backward compatibility
 */
function addSyncStatusListener() {
  // No-op: Cloud sync disabled
}

/**
 * Export user data from local storage only
 */
async function exportUserData() {
  try {
    // Check if user is authenticated
    const user = getCurrentUser();
    if (!user) {
      showNotification('Please log in to export your data', 'warning');
      return;
    }
    
    // Show loading indicator
    const exportButton = document.getElementById('gdprExportButton');
    if (exportButton) {
      exportButton.disabled = true;
      exportButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
    }
    
    showNotification('Preparing your data for export...', 'info');
    
    // Get all user data
    const userData = await collectUserData();
    
    // Create a JSON file
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = `slimeasy_data_export_${new Date().toISOString().split('T')[0]}.json`;
    
    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Reset button
    if (exportButton) {
      exportButton.disabled = false;
      exportButton.innerHTML = '<i class="fas fa-file-export"></i> Export Data (GDPR)';
    }
    
    showNotification('Your data has been exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting user data:', error);
    showNotification('Failed to export data. Please try again later.', 'error');
    
    // Reset button
    const exportButton = document.getElementById('gdprExportButton');
    if (exportButton) {
      exportButton.disabled = false;
      exportButton.innerHTML = '<i class="fas fa-file-export"></i> Export Data (GDPR)';
    }
  }
}

/**
 * Collect all user data for export
 * @returns {Promise<Object>} Collected user data
 */
async function collectUserData() {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const userData = {
      user: {
        email: user.email,
        displayName: user.displayName || user.name || user.email,
        created: new Date().toISOString() // Use current date as we don't store creation time in local-only version
      },
      exportDate: new Date().toISOString(),
      data: {}
    };
    
    // Collect all user data from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Only include keys related to the current user
      if (key && key.includes(user.email)) {
        try {
          userData.data[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          userData.data[key] = localStorage.getItem(key);
        }
      }
    }
    
    return userData;
  } catch (error) {
    console.error('Error collecting user data:', error);
    throw error;
  }
}

// Export functions to global scope
window.initializeSyncUI = initializeSyncUI;
window.updateSyncStatusUI = updateSyncStatusUI;
window.updateNavIndicator = updateNavIndicator;
window.isCloudSyncEnabled = isCloudSyncEnabled;
window.toggleCloudSync = toggleCloudSync;
window.manualSync = manualSync;
window.getSyncStatus = getSyncStatus;
window.addSyncStatusListener = addSyncStatusListener;
window.exportUserData = exportUserData;
window.collectUserData = collectUserData;