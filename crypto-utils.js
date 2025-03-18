/**
 * SlimEasy - Cryptography Utilities (Local Storage Only Version)
 * This file provides stub functions to replace the cloud storage encryption utilities
 */

/**
 * Stub function for backward compatibility
 * @returns {Promise<Object>} Resolves to a mock key
 */
async function generateEncryptionKey() {
  console.log('Encryption features disabled in local-only version');
  return Promise.resolve({});
}

/**
 * Stub function for backward compatibility
 * @returns {Promise<string>} Resolves to unmodified data
 */
async function encryptData(key, data) {
  // Just return the data as is
  return typeof data === 'object' ? JSON.stringify(data) : String(data);
}

/**
 * Stub function for backward compatibility
 * @returns {Promise<Object|string>} Resolves to unmodified data
 */
async function decryptData(key, encryptedData) {
  // Try to parse as JSON, return string if not JSON
  try {
    return JSON.parse(encryptedData);
  } catch (e) {
    return encryptedData;
  }
}

/**
 * Stub function for backward compatibility
 * @returns {Promise<boolean>} Resolves to true
 */
async function storeEncryptionKey(userId, key) {
  return Promise.resolve(true);
}

/**
 * Stub function for backward compatibility
 * @returns {Promise<Object>} Resolves to a mock key
 */
async function retrieveEncryptionKey(userId) {
  return Promise.resolve({});
}

/**
 * Stub function for backward compatibility
 * @returns {Promise<boolean>} Resolves to false
 */
async function checkEncryptionKeyExists(userId) {
  return Promise.resolve(false);
}

// Export stub functions to global scope
window.generateEncryptionKey = generateEncryptionKey;
window.encryptData = encryptData;
window.decryptData = decryptData;
window.storeEncryptionKey = storeEncryptionKey;
window.retrieveEncryptionKey = retrieveEncryptionKey;
window.checkEncryptionKeyExists = checkEncryptionKeyExists;