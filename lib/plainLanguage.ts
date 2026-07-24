/**
 * Plain-language text conversion and readability analysis.
 * Converts statutory/legal text to plain English at defined reading levels.
 * All output includes source citations and informational-not-legal-advice labels.
 */

interface ReadabilityScore {
  fleschKincaidGrade: number;
  fleschReadingEase: number;
  isAccessible: boolean;
}

interface PlainLanguageResult {
  original: string;
  plainLanguage: string;
  readability: ReadabilityScore;
  citation?: string;
  legalDisclaimerLabel: string;
}

/**
 * Calculate Flesch-Kincaid Grade Level and Flesch Reading Ease Score.
 * Formula from Flesch-Kincaid Reading Ease:
 *   FRE = 206.835 - 1.015(words/sentences) - 84.6(syllables/words)
 * Flesch-Kincaid Grade Level:
 *   FKGL = 0.39(words/sentences) + 11.8(syllables/words) - 15.59
 */
export function calculateReadability(text: string): ReadabilityScore {
  const sentences = text.match(/[.!?]+/g) || [];
  const words = text.match(/\b\w+\b/g) || [];
  const syllables = countSyllables(text);

  const sentenceCount = Math.max(1, sentences.length);
  const wordCount = Math.max(1, words.length);

  const fleschReadingEase = Math.max(
    0,
    206.835 -
      1.015 * (wordCount / sentenceCount) -
      84.6 * (syllables / wordCount)
  );
  const fleschKincaidGrade = Math.max(
    0,
    0.39 * (wordCount / sentenceCount) +
      11.8 * (syllables / wordCount) -
      15.59
  );

  return {
    fleschKincaidGrade: Math.round(fleschKincaidGrade * 10) / 10,
    fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
    isAccessible: fleschKincaidGrade <= 8,
  };
}

/**
 * Estimate syllable count using a simple heuristic.
 * More accurate algorithms exist but this is suitable for grade-level estimation.
 */
function countSyllables(text: string): number {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  let total = 0;

  for (const word of words) {
    total += estimateWordSyllables(word);
  }

  return total;
}

/**
 * Estimate syllables in a single word.
 */
function estimateWordSyllables(word: string): number {
  word = word.toLowerCase();
  let count = 0;
  let previousWasVowel = false;

  const vowels = 'aeiouy';

  for (const char of word) {
    const isVowel = vowels.includes(char);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }

  if (word.endsWith('e')) {
    count--;
  }

  if (word.endsWith('le') && word.length > 2) {
    count++;
  }

  return Math.max(1, count);
}

/**
 * Simple plain-language conversion using substitution dictionary.
 * In production, this would use more sophisticated NLP/LLM-based approaches.
 */
const plainLanguageDictionary: Record<string, string> = {
  'in accordance with': 'following',
  'in the event that': 'if',
  'notwithstanding': 'despite',
  'pursuant to': 'under',
  'heretofore': 'before',
  'thereof': 'of it',
  'therein': 'in it',
  'whereby': 'by which',
  'hereinafter': 'after this',
  'aforementioned': 'mentioned above',
  'shall be required to': 'must',
  'shall not': "mustn't",
  'shall': 'must',
  'may': 'can',
  'except as otherwise': 'unless',
  'due to the fact that': 'because',
  'for the purpose of': 'to',
  'in order to': 'to',
  'with respect to': 'about',
  'with regard to': 'about',
  'such': 'the',
  'auspices': 'support',
  'facilitate': 'help',
  'expedite': 'speed up',
  'utilize': 'use',
  'notwithstanding the foregoing': 'despite the above',
  'herein': 'in this',
  'hereunder': 'under this',
};

/**
 * Convert text to plain language by replacing jargon and complex phrases.
 */
export function convertToPlainLanguage(text: string): string {
  let result = text;

  for (const [jargon, plain] of Object.entries(plainLanguageDictionary)) {
    const regex = new RegExp(`\\b${jargon}\\b`, 'gi');
    result = result.replace(regex, plain);
  }

  return result;
}

/**
 * Main function: convert legal/statutory text to plain language with analysis.
 * Returns structured result with original text, plain version, readability score,
 * citation reference, and mandatory informational disclaimer.
 */
export function plainLanguageMode(
  originalText: string,
  citation?: string
): PlainLanguageResult {
  const plainLanguage = convertToPlainLanguage(originalText);
  const readability = calculateReadability(plainLanguage);

  return {
    original: originalText,
    plainLanguage,
    readability,
    citation,
    legalDisclaimerLabel:
      'Informational only — not legal advice. Consult counsel, the ethics board, or your clerk for binding determinations.',
  };
}

/**
 * Format a plain-language result for display,
 * ensuring citations and disclaimers are always visible.
 */
export function formatForDisplay(
  result: PlainLanguageResult,
  includeReadabilityInfo: boolean = false
): string {
  let output = '';

  if (result.citation) {
    output += `📋 **Source:** ${result.citation}\n\n`;
  }

  output += `**Plain Language:**\n\n${result.plainLanguage}\n\n`;

  if (includeReadabilityInfo) {
    output += `**Readability:** Flesch-Kincaid Grade ${result.readability.fleschKincaidGrade}`;
    if (result.readability.isAccessible) {
      output += ' (accessible)';
    }
    output += '\n\n';
  }

  output += `⚠️ **${result.legalDisclaimerLabel}**`;

  return output;
}
