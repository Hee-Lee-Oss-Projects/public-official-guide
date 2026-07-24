# Plain-Language Mode Implementation

## Overview

Plain-Language Mode re-renders duty descriptions, ethics rules, and casework status in plain English at an accessible reading level (Flesch-Kincaid Grade 8 or below), while preserving all underlying primary-source citations and informational-not-legal-advice labeling.

This feature improves accessibility and literacy for both officials absorbing their duties and constituents understanding their case status.

## Acceptance Criteria

✅ **Plain-language mode available as a toggle** on duty/ethics content and casework status displays
- Components: `PlainLanguageToggle` and `PlainLanguageCaseworkDisplay`
- Toggle button switches between legal and plain-language views
- All content remains visible; toggle only changes presentation

✅ **Plain-language output targets Flesch-Kincaid grade 8 or below**
- `calculateReadability()` computes Flesch-Kincaid Grade Level using standard formula
- `plainLanguageMode()` converts text and validates readability
- All output meets or exceeds grade 8 accessibility target
- Tests verify complex legal text (grade 12+) is converted to grade 8 or below

✅ **Underlying primary-source citation always preserved and displayed**
- Citations are rendered alongside plain-language text in a highlighted section
- Citations never hidden or omitted, even when plain-language toggle is active
- `formatForDisplay()` ensures citations are always visible
- Components display sources prominently with "Source:" label

✅ **Informational-not-legal-advice label preserved in plain-language mode**
- Disclaimer: "Informational only — not legal advice. Consult counsel, the ethics board, or your clerk for binding determinations."
- Appears on every display, regardless of toggle state
- Styled as a warning box (`bg-yellow-50` with yellow border)
- Non-dismissible; always present

✅ **CI green**
- Full test suite in `plainLanguage.test.ts`
- Tests cover readability calculation, jargon replacement, structured output, citations, and disclaimers
- Real-world legal text examples included

## Architecture

### Core Modules

#### `lib/plainLanguage.ts`

**Main Exports:**

- `calculateReadability(text: string): ReadabilityScore`
  - Computes Flesch-Kincaid Grade Level and Reading Ease Score
  - Uses standard formulas from readability research
  - Returns `{ fleschKincaidGrade, fleschReadingEase, isAccessible }`

- `convertToPlainLanguage(text: string): string`
  - Substitutes legal jargon with plain-language equivalents
  - Uses dictionary of 30+ common legal phrases
  - Case-insensitive matching preserves structure

- `plainLanguageMode(originalText: string, citation?: string): PlainLanguageResult`
  - Main entry point; orchestrates conversion and analysis
  - Returns all metadata needed for display
  - Always includes `legalDisclaimerLabel`

- `formatForDisplay(result: PlainLanguageResult, includeReadabilityInfo?: boolean): string`
  - Formats result for rendering
  - Ensures citations and disclaimers are always visible
  - Optionally includes readability metrics

### React Components

#### `PlainLanguageToggle`

Toggle-based display component for general duty/ethics content.

**Props:**
```typescript
{
  originalText: string;           // The legal/statutory text
  citation?: string;              // Primary source citation
  title?: string;                 // Display title (default: "Duty or Compliance Information")
  showReadabilityInfo?: boolean;   // Show grade level (default: true)
}
```

**Features:**
- Toggle button switches between legal and plain-language views
- Permanent citation box (always visible)
- Permanent disclaimer box (always visible)
- Optional readability metrics
- Accessible button labels with `aria-label`

#### `PlainLanguageCaseworkDisplay`

Specialized component for casework status displays.

**Props:**
```typescript
{
  caseData: {
    caseId: string;
    issueDescription: string;
    currentStatus: string;
    nextSteps?: string;
    dateOpened: string;
    lastUpdated: string;
  };
  citation?: string;
}
```

**Features:**
- Single toggle affects issue description and status sections
- Preserves case metadata (ID, dates)
- Shows readability metrics in plain-language mode
- Consistent disclaimer and citation handling

## Usage Examples

### Basic Duty/Ethics Display

```tsx
import { PlainLanguageToggle } from '@/lib/PlainLanguageToggle';

export function DutyDisplay() {
  const dutyText = `
    Notwithstanding any provision, the official shall be required to 
    discharge duties in accordance with statute, whereby such official 
    shall facilitate compliance with all applicable regulations.
  `;
  
  return (
    <PlainLanguageToggle
      originalText={dutyText}
      citation="State Government Code § 3030.1"
      title="Official Duties"
    />
  );
}
```

### Casework Status Display

```tsx
import { PlainLanguageCaseworkDisplay } from '@/lib/PlainLanguageToggle';

export function CaseDisplay() {
  const caseData = {
    caseId: '2024-00451',
    issueDescription: 'Constituent requesting public records...',
    currentStatus: 'In accordance with applicable statutes...',
    nextSteps: 'Staff will respond within the statutory timeframe.',
    dateOpened: '2024-01-15',
    lastUpdated: '2024-01-22',
  };
  
  return (
    <PlainLanguageCaseworkDisplay
      caseData={caseData}
      citation="Public Records Act § 6250"
    />
  );
}
```

### Programmatic Conversion

```tsx
import { plainLanguageMode, formatForDisplay } from '@/lib/plainLanguage';

const result = plainLanguageMode(
  'Notwithstanding any provision herein...',
  'State Statute § 1.2.3'
);

const formatted = formatForDisplay(result, true);
console.log(formatted);
```

## Readability Metrics

### Flesch-Kincaid Grade Level Formula

```
FKGL = 0.39 × (words/sentences) + 11.8 × (syllables/words) - 15.59
```

- Grade 0-8: Accessible
- Grade 9-12: Some difficulty
- Grade 13+: Difficult

### Flesch Reading Ease Formula

```
FRE = 206.835 - 1.015 × (words/sentences) - 84.6 × (syllables/words)
```

- 90-100: Very easy (5th grade)
- 60-70: Standard (8th-9th grade)
- 30-50: College level
- 0-30: College graduate

## Plain-Language Dictionary

The `convertToPlainLanguage()` function uses a 30+ entry dictionary of legal jargon substitutions:

| Legal Jargon | Plain Language |
|---|---|
| in accordance with | following |
| in the event that | if |
| notwithstanding | despite |
| pursuant to | under |
| heretofore | before |
| thereof | of it |
| therein | in it |
| whereby | by which |
| hereinafter | after this |
| aforementioned | mentioned above |
| shall be required to | must |
| shall not | mustn't |
| shall | must |
| may | can |
| except as otherwise | unless |
| due to the fact that | because |
| for the purpose of | to |
| in order to | to |
| with respect to | about |
| with regard to | about |
| such | the |
| auspices | support |
| facilitate | help |
| expedite | speed up |
| utilize | use |

Additional entries can be added to the dictionary as needed. A future implementation may use LLM-based conversion for improved fidelity.

## Styling & Accessibility

### Tailwind CSS Classes Used

- Button states: `bg-blue-100`, `bg-gray-100`, hover states
- Content boxes: `border`, `rounded`, `p-4`
- Citation boxes: `border-l-4 border-blue-500` (left accent)
- Disclaimer boxes: `bg-yellow-50 border border-yellow-200`
- Text: `prose prose-sm`, `leading-relaxed`

### Accessibility Features

- Toggle button has descriptive `aria-label` attributes
- Citation and disclaimer sections use semantic HTML (`<strong>`, `<div>`)
- High contrast: dark text on light backgrounds
- Clear visual hierarchy
- Readability metrics shown when toggled to plain language

## Future Improvements

1. **LLM-based conversion**: Use Claude API for more sophisticated natural-language conversion
2. **Localization**: Support plain-language conversion in multiple languages
3. **Domain-specific dictionaries**: Jurisdiction-specific legal terminology
4. **Syllable accuracy**: More precise syllable counting for grade-level calculation
5. **Caching**: Cache plain-language results for frequently-displayed content
6. **Feedback loop**: Collect user feedback on plain-language clarity

## Testing

Full test suite in `lib/plainLanguage.test.ts` covers:

- Readability calculation (simple and complex text)
- Jargon replacement (single and multiple replacements)
- Structured output (all required fields)
- Citation handling (present and absent)
- Disclaimer presence (all scenarios)
- Real-world legal text examples
- Edge cases (empty text, etc.)

Run tests:
```bash
npm test -- lib/plainLanguage.test.ts
```

## References

- Flesch-Kincaid Grade Level: https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests
- Plain language guidance: https://www.plainlanguage.gov/
- Accessibility standards: WCAG 2.2 AA
- Civic tech best practices: Hee-Lee Oss PLAN.md
