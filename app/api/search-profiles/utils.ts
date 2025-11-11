export const cleanPdfText = (text: string) => {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove extra spaces, tabs, newlines
  cleaned = cleaned.replace(/\s+/g, ' ');

  // 2. Fix PDFs that split letters: "J o b" -> "Job"
  cleaned = cleaned.replace(/\b([A-Za-z]) (?=[A-Za-z]\b)/g, '$1');

  // 3. Ensure space after punctuation (like ":")
  cleaned = cleaned.replace(/([.,;!?])(?=\S)/g, '$1 ');

  // 4. Remove space before punctuation
  cleaned = cleaned.replace(/\s+([.,;!?])/g, '$1');

  // 5. Trim
  cleaned = cleaned.trim();

  return cleaned;
};
