/**
 * PlainLanguageToggle component
 * Provides a user-facing toggle for switching between legal and plain-language views.
 * Preserves all source citations and informational-not-legal-advice disclaimers.
 */

'use client';

import { useState } from 'react';
import {
  plainLanguageMode,
  calculateReadability,
  formatForDisplay,
} from './plainLanguage';

interface PlainLanguageToggleProps {
  originalText: string;
  citation?: string;
  title?: string;
  showReadabilityInfo?: boolean;
}

export function PlainLanguageToggle({
  originalText,
  citation,
  title = 'Duty or Compliance Information',
  showReadabilityInfo = true,
}: PlainLanguageToggleProps) {
  const [usePlainLanguage, setUsePlainLanguage] = useState(false);
  const plainResult = plainLanguageMode(originalText, citation);
  const displayText = usePlainLanguage ? plainResult.plainLanguage : originalText;

  return (
    <div className="plain-language-container border rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={() => setUsePlainLanguage(!usePlainLanguage)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            usePlainLanguage
              ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
          aria-label={
            usePlainLanguage
              ? 'Switch to legal language'
              : 'Switch to plain language'
          }
        >
          {usePlainLanguage ? '📖 Plain Language' : '⚖️ Legal Text'}
        </button>
      </div>

      {/* Citation - always visible */}
      {citation && (
        <div className="text-sm text-gray-600 border-l-4 border-blue-500 pl-4">
          <strong>Source:</strong> {citation}
        </div>
      )}

      {/* Main content */}
      <div className="prose prose-sm max-w-none bg-white p-4 rounded border border-gray-200">
        <div
          className="text-gray-800 leading-relaxed"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {displayText}
        </div>
      </div>

      {/* Readability info for plain language */}
      {usePlainLanguage && showReadabilityInfo && (
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
          📊 Readability: Flesch-Kincaid Grade{' '}
          {plainResult.readability.fleschKincaidGrade}
          {plainResult.readability.isAccessible ? ' (accessible)' : ''}
        </div>
      )}

      {/* Legal disclaimer - always visible */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-900">
        <strong>⚠️ {plainResult.legalDisclaimerLabel}</strong>
      </div>
    </div>
  );
}

/**
 * PlainLanguageCaseworkDisplay component
 * Specialized variant for displaying casework status with plain-language toggle.
 */
interface CaseworkData {
  caseId: string;
  issueDescription: string;
  currentStatus: string;
  nextSteps?: string;
  dateOpened: string;
  lastUpdated: string;
}

export function PlainLanguageCaseworkDisplay({
  caseData,
  citation,
}: {
  caseData: CaseworkData;
  citation?: string;
}) {
  const [usePlainLanguage, setUsePlainLanguage] = useState(false);

  const issueResult = plainLanguageMode(caseData.issueDescription, citation);
  const statusResult = plainLanguageMode(caseData.currentStatus, citation);

  const displayIssue = usePlainLanguage
    ? issueResult.plainLanguage
    : issueResult.original;
  const displayStatus = usePlainLanguage
    ? statusResult.plainLanguage
    : statusResult.original;

  return (
    <div className="casework-display space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Case #{caseData.caseId}
        </h1>
        <button
          onClick={() => setUsePlainLanguage(!usePlainLanguage)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            usePlainLanguage
              ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
          aria-label={
            usePlainLanguage
              ? 'Switch to legal language'
              : 'Switch to plain language'
          }
        >
          {usePlainLanguage ? '📖 Plain Language' : '⚖️ Legal Text'}
        </button>
      </div>

      {/* Case metadata */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <strong>Opened:</strong> {caseData.dateOpened}
        </div>
        <div>
          <strong>Last Updated:</strong> {caseData.lastUpdated}
        </div>
      </div>

      {/* Issue description with toggle */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Your Issue</h2>
        <div className="bg-white p-4 rounded border border-gray-200 text-gray-800 leading-relaxed">
          {displayIssue}
        </div>
        {usePlainLanguage && (
          <div className="text-xs text-gray-500">
            📊 Reading level: Grade {issueResult.readability.fleschKincaidGrade}
          </div>
        )}
      </div>

      {/* Status with toggle */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Current Status</h2>
        <div className="bg-white p-4 rounded border border-gray-200 text-gray-800 leading-relaxed">
          {displayStatus}
        </div>
        {usePlainLanguage && (
          <div className="text-xs text-gray-500">
            📊 Reading level: Grade {statusResult.readability.fleschKincaidGrade}
          </div>
        )}
      </div>

      {/* Next steps */}
      {caseData.nextSteps && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Next Steps</h2>
          <div className="bg-blue-50 p-4 rounded border border-blue-200 text-gray-800 leading-relaxed">
            {caseData.nextSteps}
          </div>
        </div>
      )}

      {/* Citation and disclaimer - always visible */}
      <div className="space-y-3 border-t pt-4">
        {citation && (
          <div className="text-sm text-gray-600 border-l-4 border-blue-500 pl-4">
            <strong>Source Reference:</strong> {citation}
          </div>
        )}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-900">
          <strong>⚠️ Informational only</strong> — not legal advice. For
          official determinations, contact your agency or seek legal counsel.
        </div>
      </div>
    </div>
  );
}
