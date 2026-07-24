# Plain-Language Mode Feature — Git Commit and PR Submission Script
# PowerShell version for Windows

param(
    [switch]$AmendLast = $false,
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🔧 Plain-Language Mode Feature — PR Submission" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Get current directory
$repoPath = Get-Location
$gitDir = Join-Path $repoPath ".git"

if (-not (Test-Path $gitDir)) {
    Write-Host "❌ ERROR: Not in a git repository" -ForegroundColor Red
    exit 1
}

# Verify branch
$branch = & git rev-parse --abbrev-ref HEAD
$expectedBranch = "hee-lee-oss/public-official-guide-accessibility-027"

if ($branch -ne $expectedBranch) {
    Write-Host "❌ ERROR: Currently on branch '$branch'" -ForegroundColor Red
    Write-Host "   Expected: '$expectedBranch'" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Switch to the correct branch:" -ForegroundColor Yellow
    Write-Host "   git checkout $expectedBranch" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ On correct branch: $branch" -ForegroundColor Green
Write-Host ""

# Stage files
Write-Host "📝 Staging new configuration files..." -ForegroundColor Cyan
$filesToAdd = @(
    "package.json",
    "tsconfig.json",
    "jest.config.js",
    ".github/workflows/test.yml",
    "PR-READINESS-CHECKLIST.md",
    "DELIVERABLE_SUMMARY.md",
    "WORK_COMPLETED.md"
)

foreach ($file in $filesToAdd) {
    if (Test-Path $file) {
        Write-Host "  → $file" -ForegroundColor Gray
        & git add $file
    }
}

Write-Host "✅ Files staged" -ForegroundColor Green
Write-Host ""

# Show what will be committed
Write-Host "📋 Files to be committed:" -ForegroundColor Cyan
& git diff --cached --name-only

Write-Host ""

# Create commit
$commitMessage = @'
ci: add test infrastructure for plain-language feature

Add missing build and CI configuration files to enable automated testing:

- package.json: npm scripts for testing and type checking, dependencies
- tsconfig.json: TypeScript compiler configuration
- jest.config.js: Jest test runner configuration
- .github/workflows/test.yml: GitHub Actions CI workflow

This enables acceptance criterion 5 (CI green) to run automatically.

Also updated documentation:
- PR-READINESS-CHECKLIST.md: Complete PR readiness guide
- DELIVERABLE_SUMMARY.md: Updated with CI infrastructure details
- WORK_COMPLETED.md: Added CI/build configuration section

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
'@

Write-Host "💾 Creating commit..." -ForegroundColor Cyan

if ($AmendLast) {
    Write-Host "  (Amending last commit)" -ForegroundColor Gray
    & git commit --amend --no-edit
} else {
    & git commit -m $commitMessage
}

Write-Host "✅ Commit created" -ForegroundColor Green
Write-Host ""

# Push to remote
Write-Host "🚀 Pushing to remote..." -ForegroundColor Cyan
if ($AmendLast -and $Force) {
    & git push --force-with-lease origin $branch
    Write-Host "✅ Branch pushed (force-with-lease)" -ForegroundColor Green
} else {
    & git push origin $branch
    Write-Host "✅ Branch pushed" -ForegroundColor Green
}

Write-Host ""

# Summary
Write-Host "✨ Ready for PR Submission!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Branch: $branch" -ForegroundColor Cyan
Write-Host "Target: main (Hee-Lee-Oss-Projects/public-official-guide)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next step:" -ForegroundColor Yellow
Write-Host "  hee-lee-oss submit public-official-guide-accessibility-027" -ForegroundColor Yellow
Write-Host ""
Write-Host "PR will trigger CI tests automatically:" -ForegroundColor Gray
Write-Host "  - npm test (21 tests)" -ForegroundColor Gray
Write-Host "  - tsc --noEmit (type checking)" -ForegroundColor Gray
Write-Host "  - Coverage reporting" -ForegroundColor Gray
Write-Host ""
