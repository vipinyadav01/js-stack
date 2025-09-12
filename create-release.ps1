# PowerShell script to create GitHub release
# You'll need to set your GitHub token as an environment variable or replace it here

$headers = @{
    "Authorization" = "token YOUR_GITHUB_TOKEN"
    "Accept" = "application/vnd.github.v3+json"
}

$body = @{
    "tag_name" = "v1.0.8"
    "target_commitish" = "main"
    "name" = "Create JS Stack CLI v1.0.8 - Template Fixes & Deployment Improvements"
    "body" = Get-Content "RELEASE_NOTES_v1.0.8.md" -Raw
    "draft" = $false
    "prerelease" = $false
} | ConvertTo-Json

$uri = "https://api.github.com/repos/vipinyadav01/create-js-stack-cli/releases"

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Release created successfully: $($response.html_url)" -ForegroundColor Green
} catch {
    Write-Host "Error creating release: $($_.Exception.Message)" -ForegroundColor Red
}
