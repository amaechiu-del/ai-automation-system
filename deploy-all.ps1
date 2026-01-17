# Master Deploy Script for DomisAuto
Clear-Host
Write-Host "--- AI-AUTOMATION SYSTEM: GLOBAL DEPLOYMENT ---" -ForegroundColor Cyan
Write-Host "Where do you want to deploy today?" -ForegroundColor Yellow
Write-Host "1) Firebase"
Write-Host "2) Netlify"
Write-Host "3) Cloudflare Pages"
Write-Host "4) Azure Static Web App"
Write-Host "5) Static.app"
Write-Host "6) GLOBAL (GitHub Push - Updates All)"
Write-Host "q) Quit"

$choice = Read-Host "Enter selection"

switch ($choice) {
    "1" { Write-Host "Deploying to Firebase..."; firebase deploy }
    "2" { Write-Host "Deploying to Netlify..."; netlify deploy --prod }
    "3" { Write-Host "Deploying to Cloudflare..."; wrangler pages deploy ./dist }
    "4" { Write-Host "Deploying to Azure..."; swa deploy ./dist }
    "5" { Write-Host "Deploying to Static.app..."; static-app deploy ./dist }
    "6" { 
        $msg = Read-Host "Enter commit message"
        git add .
        git commit -m "$msg"
        git push origin main
        Write-Host "Global Update Sent to GitHub!" -ForegroundColor Green
    }
    "q" { Exit }
    Default { Write-Host "Invalid Selection" -ForegroundColor Red }
}