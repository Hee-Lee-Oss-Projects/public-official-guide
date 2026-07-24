/**
 * Tests for plain-language conversion and readability analysis.
 */

import {
  calculateReadability,
  convertToPlainLanguage,
  plainLanguageMode,
  formatForDisplay,
} from './plainLanguage';

describe('plainLanguage', () => {
  describe('calculateReadability', () => {
    it('should calculate Flesch-Kincaid grade level', () => {
      const simpleText = 'I like dogs. Dogs are fun. Let us play.';
      const result = calculateReadability(simpleText);

      expect(result.fleschKincaidGrade).toBeLessThan(8);
      expect(result.isAccessible).toBe(true);
    });

    it('should identify complex text as inaccessible', () => {
      const complexText =
        'Notwithstanding any provision herein to the contrary, and in accordance with the aforementioned statutory requirements, the municipality shall facilitate the expedited processing of such applications pursuant to the regulations established thereunder.';
      const result = calculateReadability(complexText);

      expect(result.fleschKincaidGrade).toBeGreaterThan(12);
      expect(result.isAccessible).toBe(false);
    });

    it('should handle empty text', () => {
      const result = calculateReadability('');
      expect(result.fleschKincaidGrade).toBeGreaterThanOrEqual(0);
      expect(result.fleschReadingEase).toBeGreaterThanOrEqual(0);
    });

    it('should calculate reading ease score', () => {
      const text = 'The cat sat.';
      const result = calculateReadability(text);

      expect(result.fleschReadingEase).toBeGreaterThan(0);
      expect(result.fleschReadingEase).toBeLessThanOrEqual(100);
    });
  });

  describe('convertToPlainLanguage', () => {
    it('should replace legal jargon with plain language', () => {
      const legalText = 'In the event that a violation occurs, proceedings shall commence.';
      const result = convertToPlainLanguage(legalText);

      expect(result.toLowerCase()).toContain('if');
      expect(result.toLowerCase()).toContain('must');
      expect(result.toLowerCase()).not.toContain('notwithstanding');
    });

    it('should handle multiple replacements', () => {
      const legalText = 'Pursuant to the aforementioned statute, such actions shall be expedited.';
      const result = convertToPlainLanguage(legalText);

      expect(result).not.toContain('pursuant');
      expect(result).not.toContain('aforementioned');
      expect(result).not.toContain('shall');
    });

    it('should preserve capitalization patterns', () => {
      const text = 'Notwithstanding any provision herein.';
      const result = convertToPlainLanguage(text);

      // Should handle case-insensitive replacement
      expect(result).not.toContain('Notwithstanding');
    });

    it('should be case-insensitive', () => {
      const text = 'NOTWITHSTANDING the provision';
      const result = convertToPlainLanguage(text);

      expect(result.toLowerCase()).not.toContain('notwithstanding');
    });
  });

  describe('plainLanguageMode', () => {
    it('should return structured result with all required fields', () => {
      const text = 'Notwithstanding any provision, proceedings shall commence.';
      const citation = 'Municipal Code § 5.2.1';
      const result = plainLanguageMode(text, citation);

      expect(result.original).toBe(text);
      expect(result.plainLanguage).toBeTruthy();
      expect(result.readability).toBeDefined();
      expect(result.citation).toBe(citation);
      expect(result.legalDisclaimerLabel).toContain('Informational');
      expect(result.legalDisclaimerLabel).toContain('not legal advice');
    });

    it('should handle missing citation', () => {
      const text = 'This is a test.';
      const result = plainLanguageMode(text);

      expect(result.citation).toBeUndefined();
      expect(result.legalDisclaimerLabel).toBeTruthy();
    });

    it('should produce accessible plain language output', () => {
      const complexText =
        'Notwithstanding any provision herein to the contrary, in the event that such violations shall occur, the municipality shall be required to facilitate expedited proceedings.';
      const result = plainLanguageMode(complexText);

      expect(result.readability.isAccessible).toBe(true);
      expect(result.readability.fleschKincaidGrade).toBeLessThanOrEqual(8);
    });

    it('should always include legal disclaimer', () => {
      const texts = [
        'Simple text',
        'Notwithstanding any provision herein',
        '',
      ];

      for (const text of texts) {
        const result = plainLanguageMode(text);
        expect(result.legalDisclaimerLabel).toContain('Informational');
      }
    });
  });

  describe('formatForDisplay', () => {
    it('should include citation when provided', () => {
      const result = plainLanguageMode(
        'Test text',
        'State Statute § 1.2.3'
      );
      const formatted = formatForDisplay(result);

      expect(formatted).toContain('Source:');
      expect(formatted).toContain('State Statute § 1.2.3');
    });

    it('should include disclaimer', () => {
      const result = plainLanguageMode('Test text');
      const formatted = formatForDisplay(result);

      expect(formatted).toContain('Informational');
      expect(formatted).toContain('not legal advice');
    });

    it('should include readability info when requested', () => {
      const result = plainLanguageMode('This is a test text.');
      const formatted = formatForDisplay(result, true);

      expect(formatted).toContain('Readability');
      expect(formatted).toContain('Flesch-Kincaid Grade');
    });

    it('should omit readability info when not requested', () => {
      const result = plainLanguageMode('This is a test text.');
      const formatted = formatForDisplay(result, false);

      expect(formatted).not.toContain('Readability');
    });

    it('should omit citation section when citation is missing', () => {
      const result = plainLanguageMode('Test text');
      const formatted = formatForDisplay(result);

      expect(formatted).not.toContain('Source:');
    });
  });

  describe('real-world legal text', () => {
    it('should simplify duty description', () => {
      const dutyText =
        'Notwithstanding any other provision, the elected official shall be required, in accordance with state statute, to discharge the following duties, whereby such official shall facilitate compliance with all applicable regulations and ordinances.';
      const result = plainLanguageMode(dutyText, 'State Government Code § 3030.1');

      expect(result.readability.isAccessible).toBe(true);
      expect(result.plainLanguage).not.toContain('notwithstanding');
      expect(result.plainLanguage).not.toContain('whereby');
      expect(result.legalDisclaimerLabel).toContain('not legal advice');
    });

    it('should simplify ethics rule', () => {
      const ethicsText =
        'In the event that a conflict of interest, as defined herein, exists with respect to a matter coming before the board, such official shall recuse themselves from all deliberations thereon and abstain from voting with respect to such matter.';
      const result = plainLanguageMode(ethicsText, 'County Ethics Code § 2-100');

      expect(result.readability.isAccessible).toBe(true);
      expect(result.plainLanguage).not.toContain('thereon');
      expect(result.plainLanguage).not.toContain('herein');
    });

    it('should maintain citation visibility', () => {
      const text = 'Official duty text';
      const citation = 'Municipal Code Chapter 5, Section 2.1(c)';
      const result = plainLanguageMode(text, citation);
      const formatted = formatForDisplay(result);

      expect(formatted).toContain(citation);
    });
  });
});
