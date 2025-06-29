// utils/helpers.js

/**
 * Truncates a string to a specified length, adding ellipsis if needed.
 */
const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };
  
  /**
   * Converts a URL into its domain (e.g., https://example.com => example.com)
   */
  const extractDomain = (url) => {
    try {
      const { hostname } = new URL(url);
      return hostname.replace(/^www\./, '');
    } catch (err) {
      return '';
    }
  };
  
  module.exports = {
    truncateText,
    extractDomain
  };