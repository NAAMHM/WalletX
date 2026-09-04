/**
 * Generate unique wallet ID
 * Format: WX-XXXXXXXXXXXX
 * Example: WX-A3B5C7D9E1F2
 */
const generateWalletId = () => {
  const randomPart = Math.random().toString(36).substring(2, 14).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `WX-${randomPart}${timestamp}`.substring(0, 15);
};

module.exports = generateWalletId;
