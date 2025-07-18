/**
 * Removes all Suno-style meta tags (e.g., [verse], [chorus]) from a string.
 * @param text The input string.
 * @returns The cleaned string without meta tags.
 */
export const stripSunoTags = (text: string): string => {
  if (!text) return '';
  // This regex matches anything inside square brackets.
  return text.replace(/\[.*?\]/g, '').trim();
};

/**
 * Sanitizes a string to be used as a Firestore document ID.
 * Firestore document IDs cannot contain forward slashes (/).
 * We'll replace them and other potentially problematic characters.
 * @param text The input string (e.g., artist name).
 * @returns A sanitized string safe for use as a document ID.
 */
export const sanitizeForFirebaseId = (text: string): string => {
    if (!text) return '';
    return text.replace(/[.#$[\]/]/g, '_').toLowerCase().trim();
};
