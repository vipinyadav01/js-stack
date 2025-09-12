# PowerShell script to publish only README.md to GitHub documentation repository
# This keeps your source code separate from public documentation

Write-Host "Publishing README.md to GitHub..." -ForegroundColor Green

# Create a temporary directory
if (Test-Path "temp-github-publish") {
    Remove-Item -Recurse -Force "temp-github-publish"
}
New-Item -ItemType Directory -Path "temp-github-publish" | Out-Null
Set-Location "temp-github-publish"

try {
    # Initialize git repository
    git init
    git branch -M main

    # Copy only the README.md
    Copy-Item "../README.md" "."

    # Create a basic package.json for GitHub display
    $packageJson = @{
        name = "create-js-stack"
        version = "1.0.6"
        description = "A modern CLI tool for scaffolding JavaScript full-stack projects"
        main = "index.js"
        repository = @{
            type = "git"
            url = "https://github.com/vipinyadav01/create-js-stack.git"
        }
        keywords = @("cli", "javascript", "fullstack", "scaffold", "generator")
        author = "vipinyadav01"
        license = "MIT"
    } | ConvertTo-Json -Depth 10

    $packageJson | Out-File -FilePath "package.json" -Encoding UTF8

    # Create .gitignore
    @"
# Ignore everything except README.md
*
!README.md
!package.json
!.gitignore
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8

    # Add and commit
    git add .
    git commit -m "Update documentation v1.0.6"

    # Add remote and push (replace with your GitHub repo URL)
    git remote add origin https://github.com/vipinyadav01/create-js-stack.git
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main --force

    Write-Host "✅ README.md published to GitHub successfully!" -ForegroundColor Green

} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Clean up
    Set-Location ".."
    if (Test-Path "temp-github-publish") {
        Remove-Item -Recurse -Force "temp-github-publish"
    }
}