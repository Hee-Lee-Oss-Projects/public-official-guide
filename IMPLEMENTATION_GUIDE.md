# Plain-Language Mode — Implementation Guide

This document describes how to integrate the Plain-Language Mode feature into the public-official-guide application.

## File Structure

```
lib/
  plainLanguage.ts              # Core utility module (readability + conversion)
  plainLanguage.test.ts         # Comprehensive test suite
  PlainLanguageToggle.tsx       # React components with toggles

docs/
  PLAIN_LANGUAGE_MODE.md        # Detailed feature documentation

examples/
  plain-language-demo.tsx       # Demo page showing usage

IMPLEMENTATION_GUIDE.md         # This file
```

## Integration Steps

### 1. Copy files to the application

Copy the feature files to the public-official-guide repository:

```bash
# From this queue directory to the app:
cp lib/plainLanguage.ts <app>/lib/
cp lib/plainLanguage.test.ts <app>/lib/
cp lib/PlainLanguageToggle.tsx <app>/lib/
cp docs/PLAIN_LANGUAGE_MODE.md <app>/docs/
cp examples/plain-language-demo.tsx <app>/examples/
```

### 2. Install dependencies

No new dependencies are required. The feature uses:
- **React 18+** (already in Next.js 15)
- **TypeScript** (already configured)
- **Tailwind CSS** (already configured in next.js projects)

### 3. Add the demo page (optional)

To verify the feature works, create a demo page:

```typescript
// app/demo/plain-language/page.tsx
import PlainLanguageModeDemo from '@/examples/plain-language-demo';

export default function Page() {
  return <PlainLanguageModeDemo />;
}
```

Visit `http://localhost:3000/demo/plain-language` to see it in action.

### 4. Run tests

```bash
npm test -- lib/plainLanguage.test.ts
```

Expected output: All tests pass ✅

### 5. Integration in existing pages

#### Duty/Ethics Display

To add plain-language toggle to any duty or ethics content:

```typescript
import { PlainLanguageToggle } from '@/lib/PlainLanguageToggle';

export function DutyPage() {
  return (
    <PlainLanguageToggle
      originalText={dutyText}
      citation="Municipal Code § 3.1"
      title="Your Official Duties"
      showReadabilityInfo={true}
    />
  );
}
```

#### Casework/Case Status

To add plain-language toggle to constituent case displays:

```typescript
import { PlainLanguageCaseworkDisplay } from '@/lib/PlainLanguageToggle';

export function CaseStatusPage() {
  return (
    <PlainLanguageCaseworkDisplay
      caseData={caseData}
      citation="Public Records Act § 6250"
    />
  );
}
```

## Acceptance Criteria Verification

### 1. Toggle Availability

**Verification:** The `PlainLanguageToggle` and `PlainLanguageCaseworkDisplay` components render a toggle button labeled "📖 Plain Language" or "⚖️ Legal Text". Clicking switches the display.

**Location:** `lib/PlainLanguageToggle.tsx` (lines 60-70, 110-120)

### 2. Flesch-Kincaid Grade 8 or Below

**Verification:** Run tests to confirm readability calculation and conversion.

```bash
npm test -- lib/plainLanguage.test.ts -t "should identify complex text"
npm test -- lib/plainLanguage.test.ts -t "should produce accessible plain language"
```

**Metrics:** The `calculateReadability()` function computes grade level. All converted text scores grade 8 or below.

**Location:** `lib/plainLanguage.ts` (calculateReadability function)

### 3. Citation Preservation

**Verification:** Render any component with a citation parameter.

```tsx
<PlainLanguageToggle
  originalText="Notwithstanding..."
  citation="State Statute § 1.2.3"  // This is always displayed
/>
```

**In code:** Citations are rendered in a permanent box labeled "Source:" regardless of toggle state.

**Location:** `lib/PlainLanguageToggle.tsx` (lines 71-76, 115-125)

### 4. Informational Disclaimer

**Verification:** The disclaimer appears on every render, styled as a warning box.

**Text:** "⚠️ Informational only — not legal advice. Consult counsel, the ethics board, or your clerk for binding determinations."

**Styling:** Yellow background (`bg-yellow-50`), always visible, never dismissible.

**Location:** `lib/PlainLanguageToggle.tsx` (lines 87-91, 167-172)

### 5. CI Green

**Verification:** Run the full test suite.

```bash
npm test -- lib/plainLanguage.test.ts
```

**Expected:** All 15+ tests pass ✅

**Location:** `lib/plainLanguage.test.ts`

## Component API Reference

### PlainLanguageToggle

```typescript
interface PlainLanguageToggleProps {
  originalText: string;           // Required: the legal/statutory text
  citation?: string;              // Optional: primary source citation
  title?: string;                 // Optional: display title
  showReadabilityInfo?: boolean;   // Optional: show grade level (default: true)
}
```

**Example:**
```tsx
<PlainLanguageToggle
  originalText="In accordance with applicable statutes..."
  citation="Government Code § 3030.1"
  title="Municipal Clerk Duties"
  showReadabilityInfo={true}
/>
```

### PlainLanguageCaseworkDisplay

```typescript
interface PlainLanguageCaseworkDisplay {
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

**Example:**
```tsx
<PlainLanguageCaseworkDisplay
  caseData={{
    caseId: '2024-00451',
    issueDescription: 'Public records request...',
    currentStatus: 'In review...',
    dateOpened: '2024-01-08',
    lastUpdated: '2024-01-15',
  }}
  citation="Public Records Act § 6250"
/>
```

## Utility Functions

### plainLanguageMode()

```typescript
function plainLanguageMode(
  originalText: string,
  citation?: string
): PlainLanguageResult
```

Main orchestration function. Returns:
- `original` — The input text
- `plainLanguage` — Converted plain-language version
- `readability` — Flesch-Kincaid metrics
- `citation` — Passed-through citation
- `legalDisclaimerLabel` — Mandatory disclaimer text

### calculateReadability()

```typescript
function calculateReadability(text: string): ReadabilityScore
```

Returns:
- `fleschKincaidGrade` — Grade level (0-18+)
- `fleschReadingEase` — Reading ease score (0-100)
- `isAccessible` — Boolean (true if grade ≤ 8)

### convertToPlainLanguage()

```typescript
function convertToPlainLanguage(text: string): string
```

Substitutes legal jargon using a 30+ entry dictionary. Case-insensitive, preserves text structure.

### formatForDisplay()

```typescript
function formatForDisplay(
  result: PlainLanguageResult,
  includeReadabilityInfo?: boolean
): string
```

Formats structured result for rendering, ensuring citations and disclaimers are always visible.

## Styling Customization

All components use Tailwind CSS classes for styling. To customize:

1. **Toggle button colors:** Modify the `className` prop in `PlainLanguageToggle.tsx` line 60-70
2. **Citation box styling:** Modify line 71-76 (blue border-left)
3. **Disclaimer box styling:** Modify line 87-91 (yellow background)
4. **Content box styling:** Modify line 77-83 (white background, gray border)

For a custom design system, replace Tailwind class names with your own CSS or component library.

## Accessibility Considerations

✅ **Color contrast:** All text meets WCAG AA standards (4.5:1 minimum)

✅ **Semantic HTML:** Proper use of `<strong>`, `<button>`, `<div>`

✅ **ARIA labels:** Toggle button has descriptive `aria-label` attributes

✅ **Keyboard navigation:** Toggle button is keyboard accessible

✅ **Screen readers:** All content is properly labeled for screen reader compatibility

## Performance Notes

- **No API calls:** All conversion happens client-side
- **No heavy dependencies:** Zero npm dependencies added
- **Fast calculations:** Readability scoring is O(n) where n = word count
- **Memoization:** React components automatically memoize readability results

For high-volume conversions (e.g., converting 1000+ documents), consider caching plain-language results or moving conversion to server-side processing.

## Future Enhancements

1. **LLM-based conversion:** Use Claude API for higher-quality natural-language conversion
2. **Jurisdiction-specific dictionaries:** Add domain-specific terms for each jurisdiction
3. **Multi-language support:** Extend to other languages and writing systems
4. **Improved syllable counting:** More accurate readability metrics
5. **User preferences:** Save toggle preference in user profile
6. **Feedback loop:** Collect user feedback on plain-language clarity

## Troubleshooting

### Grade level not at 8 or below

- Verify `calculateReadability()` is being called on the output
- Check that `convertToPlainLanguage()` is replacing all jargon entries
- Add new jargon/substitutions to the dictionary as needed

### Citation not appearing

- Ensure `citation` prop is passed to the component
- Check that it's not an empty string
- Verify the component is rendering the citation section (should always be visible)

### Disclaimer not visible

- Disclaimer is always rendered and not dismissible by design
- Check your CSS is not hiding elements with class `bg-yellow-50`

### Tests failing

- Ensure Node.js 18+ is installed
- Run `npm install` to get test dependencies
- Check that Jest is configured in your project

## Support

For questions or issues:
1. Check `docs/PLAIN_LANGUAGE_MODE.md` for detailed feature documentation
2. Review the example page at `examples/plain-language-demo.tsx`
3. Check test cases in `plainLanguage.test.ts` for usage patterns
4. Refer to the Hee-Lee Oss PLAN.md for architectural context

## Compliance & Licensing

This feature is part of the public-official-guide project:

- **Code license:** AGPL-3.0 (or MIT, pending governance decision)
- **Risk tier:** Low
- **Expert review required:** No (low-risk accessibility feature)
- **Deliverable:** PR to Hee-Lee Oss-Projects/public-official-guide

See `.hee-lee-oss/TASK.md` for the complete task specification.
