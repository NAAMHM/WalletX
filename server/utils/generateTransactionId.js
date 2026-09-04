/**
 * Generate unique transaction ID
 * Format: WLX-YYYY-XXXXXXXX
 * Example: WLX-2026-A3B5C7D9
 */
let counter = 0;
const generateTransactionId = () => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 4).toUpperCase();
  const count = (counter++).toString(36).toUpperCase().padStart(2, '0');
  return `WLX-${year}-${timestamp}${randomPart}${count}`;
};

module.exports = generateTransactionId;
