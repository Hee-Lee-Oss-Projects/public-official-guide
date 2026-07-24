#!/bin/bash
git add lib/plainLanguage.ts
git add lib/plainLanguage.test.ts
git add lib/PlainLanguageToggle.tsx
git add docs/PLAIN_LANGUAGE_MODE.md
git add examples/plain-language-demo.tsx
git add IMPLEMENTATION_GUIDE.md
git commit -m "feat(accessibility): add plain-language mode for duty/ethics content and casework

Implement a plain-language toggle feature that re-renders statutory language
and casework status in plain English at Flesch-Kincaid grade 8 or below, while
preserving all source citations and informational-not-legal-advice disclaimers.

Acceptance criteria met:
- Plain-language mode available as toggle on duty/ethics and casework displays
- Output targets Flesch-Kincaid grade 8 or below (verified with calculation)
- Primary-source citations always preserved and displayed prominently
- Informational-not-legal-advice label preserved and always visible
- Comprehensive test suite (15+ tests covering readability, jargon conversion, etc.)

New files:
- lib/plainLanguage.ts: Core utility (readability calculation, jargon conversion)
- lib/plainLanguage.test.ts: Full test suite
- lib/PlainLanguageToggle.tsx: React components (two toggle-based components)
- docs/PLAIN_LANGUAGE_MODE.md: Detailed feature documentation
- examples/plain-language-demo.tsx: Demo page showing usage
- IMPLEMENTATION_GUIDE.md: Integration and deployment guide

This is a low-risk accessibility feature that improves readability for both
officials absorbing duties and constituents understanding case status.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
