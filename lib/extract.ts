
export function extractAndRemoveParentheses(text: string) {
    const pattern = /\((.*?)\)/g;
    const extractedText = text.match(pattern) || [];
    const cleanedText = text.replace(extractedText.toString(), "").trim();
    return [extractedText[0] ? extractedText.toString() : "", cleanedText];
  }
  