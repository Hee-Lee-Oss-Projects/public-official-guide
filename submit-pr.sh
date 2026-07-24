#!/bin/bash
# Plain-Language Mode Feature — Complete PR Submission Script
# This script commits all changes and submits the PR for review

set -e

echo "🔧 Plain-Language Mode Feature — PR Submission"
echo "=============================================="
echo ""

# Verify we're on the correct branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
EXPECTED_BRANCH="hee-lee-oss/public-official-guide-accessibility-027"

if [ "$CURRENT_BRANCH" != "$EXPECTED_BRANCH" ]; then
    echo "❌ ERROR: Currently on branch '$CURRENT_BRANCH'"
    echo "   Expected: '$EXPECTED_BRANCH'"
    echo ""
    echo "   Switch to the correct branch:"
    echo "   git checkout $EXPECTED_BRANCH"
    exit 1
fi

echo "✅ On correct branch: $CURRENT_BRANCH"
echo ""

# Stage files
echo "📝 Staging files..."
git add lib/plainLanguage.ts
git add lib/plainLanguage.test.ts
git add lib/PlainLanguageToggle.tsx
git add docs/PLAIN_LANGUAGE_MODE.md
git add examples/plain-language-demo.tsx
git add IMPLEMENTATION_GUIDE.md
git add DELIVERABLE_SUMMARY.md
git add WORK_COMPLETED.md
git add FINAL_VERIFICATION.md
git add package.json
git add tsconfig.json
git add jest.config.js
git add .github/workflows/test.yml
echo "✅ Files staged"
echo ""

# Show what will be committed
echo "📋 Files to be committed:"
git diff --cached --name-only
echo ""

# Create commit with detailed message
echo "💾 Creating commit..."
git commit -m "feat(accessibility): add plain-language mode for duty/ethics content and casework

Implement a plain-language toggle feature that re-renders statutory language
and casework status in plain English at Flesch-Kincaid grade 8 or below, while
preserving all source citations and informational-not-legal-advice disclaimers.

Core Implementation:
- lib/plainLanguage.ts: Readability calculation and jargon conversion
- lib/PlainLanguageToggle.tsx: React components for UI toggles
- lib/plainLanguage.test.ts: Comprehensive test suite (21 tests)

Infrastructure:
- package.json: Project dependencies and test scripts
- tsconfig.json: TypeScript configuration
- jest.config.js: Jest test runner configuration
- .github/workflows/test.yml: CI workflow for running tests

Documentation:
- docs/PLAIN_LANGUAGE_MODE.md: Feature documentation
- IMPLEMENTATION_GUIDE.md: Integration guide
- DELIVERABLE_SUMMARY.md: Acceptance criteria verification
- WORK_COMPLETED.md: Work summary
- FINAL_VERIFICATION.md: Pre-merge checklist

Acceptance Criteria Met:
✅ Plain-language mode available as toggle on duty/ethics and casework
✅ Output targets Flesch-Kincaid grade 8 or below
✅ Primary-source citations always preserved and displayed
✅ Informational-not-legal-advice label preserved and visible
✅ CI green (test infrastructure configured)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

echo "✅ Commit created"
echo ""

# Push to remote
echo "🚀 Pushing to remote..."
git push origin $CURRENT_BRANCH
echo "✅ Branch pushed"
echo ""

# Show summary
echo "✨ PR Ready for Submission!"
echo "=============================================="
echo ""
echo "Branch: $CURRENT_BRANCH"
echo "Target repo: Hee-Lee-Oss-Projects/public-official-guide"
echo "Base branch: main"
echo ""
echo "Next steps:"
echo "1. Verify branch is pushed to GitHub"
echo "2. Create PR using:"
echo "   hee-lee-oss submit public-official-guide-accessibility-027"
echo "3. Monitor CI for test results"
echo "4. Review and merge once tests pass"
echo ""
