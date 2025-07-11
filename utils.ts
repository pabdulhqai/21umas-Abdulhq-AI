/**
 * Converts a File object to a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string (without the data: URL prefix).
 */
export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URI prefix e.g. "data:image/png;base64,"
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Generates a short, descriptive title from a user's first message.
 * @param message The user's message text.
 * @returns A string to be used as the chat title.
 */
export const generateChatTitle = (message: string): string => {
    const words = message.trim().split(/\s+/);
    // Take the first 5 words and join them.
    let title = words.slice(0, 5).join(' ');
    // If the original message was longer, add an ellipsis.
    if (words.length > 5) {
        title += '...';
    }
    // If the title is still empty (e.g., only whitespace was entered), provide a default.
    if (!title) {
        return "Untitled Conversation";
    }
    return title;
};