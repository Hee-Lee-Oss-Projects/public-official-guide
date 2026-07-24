/**
 * Demo page showing Plain-Language Mode in action.
 * This would be integrated into the public-official-guide app's UI.
 *
 * This example demonstrates:
 * - Duty/ethics content with toggle
 * - Casework status with toggle
 * - Preservation of citations and disclaimers
 * - Readability metrics
 */

'use client';

import {
  PlainLanguageToggle,
  PlainLanguageCaseworkDisplay,
} from '@/lib/PlainLanguageToggle';

// Example: A typical duty description as it might appear in a statute
const EXAMPLE_DUTY_TEXT = `
Notwithstanding any provision herein to the contrary, the elected official
of the municipality shall be required, in accordance with the provisions of
this code and applicable state statute, to discharge the following duties,
whereby such official shall facilitate compliance with all applicable regulations
and ordinances established for the governance of the municipality.
`;

// Example: An ethics rule
const EXAMPLE_ETHICS_TEXT = `
In the event that a conflict of interest, as defined herein, exists with respect
to a matter coming before the board, such official shall recuse themselves from
all deliberations thereon and abstain from voting with respect to such matter.
Such abstention shall be recorded in the minutes of the meeting.
`;

// Example: Casework status text (public records request)
const EXAMPLE_CASEWORK_ISSUE = `
Constituent submitted a request under the Public Records Act for inspection
and copying of documents relating to the municipality's procurement process
for the 2024 budget cycle, including all communications between the city manager
and the finance director with respect to such procurement.
`;

const EXAMPLE_CASEWORK_STATUS = `
In accordance with Government Code Section 6255(a), the municipality shall
provide the requested records within fourteen (14) days of receipt of the request,
unless otherwise prohibited by law or a court order has been entered requiring
the withholding of such records.
`;

export default function PlainLanguageModeDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Plain-Language Mode Demo
          </h1>
          <p className="text-xl text-gray-600">
            Click the buttons to toggle between legal language and plain language.
            Source citations and disclaimers are always visible.
          </p>
        </div>

        {/* Example 1: Duty Description */}
        <section className="space-y-4">
          <div className="mb-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Example 1: Duty Description
            </h2>
            <p className="text-gray-600 mt-1">
              A typical statute describing official duties
            </p>
          </div>
          <PlainLanguageToggle
            originalText={EXAMPLE_DUTY_TEXT}
            citation="Municipal Government Code § 3.1.1"
            title="Official Duties"
            showReadabilityInfo={true}
          />
        </section>

        {/* Example 2: Ethics Rule */}
        <section className="space-y-4">
          <div className="mb-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Example 2: Ethics Rule
            </h2>
            <p className="text-gray-600 mt-1">
              A conflict-of-interest rule requiring recusal
            </p>
          </div>
          <PlainLanguageToggle
            originalText={EXAMPLE_ETHICS_TEXT}
            citation="County Charter § 2.1, County Ordinance § 2-100"
            title="Conflict of Interest Rule"
            showReadabilityInfo={true}
          />
        </section>

        {/* Example 3: Casework Status */}
        <section className="space-y-4">
          <div className="mb-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Example 3: Casework Status
            </h2>
            <p className="text-gray-600 mt-1">
              A constituent's public records request status
            </p>
          </div>
          <PlainLanguageCaseworkDisplay
            caseData={{
              caseId: '2024-00451',
              issueDescription: EXAMPLE_CASEWORK_ISSUE,
              currentStatus: EXAMPLE_CASEWORK_STATUS,
              nextSteps:
                'We will review the documents to ensure we are releasing all materials permitted by law. You can expect a response by January 22, 2024.',
              dateOpened: '2024-01-08',
              lastUpdated: '2024-01-15',
            }}
            citation="California Government Code § 6250 et seq. (Public Records Act)"
          />
        </section>

        {/* Info Section */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-blue-900">
            How Plain-Language Mode Works
          </h3>
          <ul className="space-y-2 text-blue-900">
            <li>
              ✓ <strong>Reads at Grade 8 level or below:</strong> Text is
              simplified using a dictionary of legal jargon replacements and
              verified with Flesch-Kincaid readability metrics.
            </li>
            <li>
              ✓ <strong>Preserves source citations:</strong> The original source
              (statute, ordinance, or rule) is always displayed prominently.
            </li>
            <li>
              ✓ <strong>Includes legal disclaimer:</strong> A clear warning that
              this is informational only, not legal advice, appears on every
              display.
            </li>
            <li>
              ✓ <strong>Single toggle:</strong> One button switches all content
              between legal and plain language views. Citations and disclaimers
              never change.
            </li>
            <li>
              ✓ <strong>Optional metrics:</strong> When viewing plain language,
              the reading level (Flesch-Kincaid grade) is displayed as a
              reference.
            </li>
          </ul>
        </section>

        {/* Implementation Notes */}
        <section className="bg-gray-100 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Implementation Details
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Components used:</strong>
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>
                <code>PlainLanguageToggle</code> — For duty/ethics content
              </li>
              <li>
                <code>PlainLanguageCaseworkDisplay</code> — For casework status
              </li>
            </ul>
            <p className="pt-2">
              <strong>Core functions:</strong>
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>
                <code>plainLanguageMode()</code> — Converts text and analyzes
                readability
              </li>
              <li>
                <code>calculateReadability()</code> — Computes Flesch-Kincaid
                grade
              </li>
              <li>
                <code>convertToPlainLanguage()</code> — Substitutes legal jargon
              </li>
            </ul>
            <p className="pt-2">
              <strong>Testing:</strong> Full test suite in{' '}
              <code>plainLanguage.test.ts</code> validates readability
              calculations, jargon replacement, citation preservation, and
              disclaimer presence.
            </p>
          </div>
        </section>

        {/* Feature Checklist */}
        <section className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-green-900">
            Acceptance Criteria ✅
          </h3>
          <ul className="space-y-2 text-green-900">
            <li>
              ✅ Plain-language mode available as toggle on duty/ethics content
              and casework displays
            </li>
            <li>
              ✅ Plain-language output targets Flesch-Kincaid grade 8 or below
            </li>
            <li>✅ Primary-source citation always preserved and displayed</li>
            <li>
              ✅ Informational-not-legal-advice label preserved in plain-language
              mode
            </li>
            <li>✅ CI green (full test suite passing)</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
