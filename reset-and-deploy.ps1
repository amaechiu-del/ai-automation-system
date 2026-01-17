Write-Host "--- Starting DomisAuto Reset & Build ---" -ForegroundColor Cyan

# Create missing folders/files to prevent errors
if (-not (Test-Path "app")) { New-Item -ItemType Directory "app" }
if (-not (Test-Path "app/layout.tsx")) { 
    Set-Content "app/layout.tsx" "export default function RootLayout({children}: {children: React.ReactNode}) { return (<html lang='en'><body>{children}</body></html>) }"
}
if (-not (Test-Path "app/page.tsx")) { 
    Set-Content "app/page.tsx" "export default function Page() { return (<h1>System Online</h1>) }"
}

# Clean and Build
Write-Host "Cleaning cache..." -ForegroundColor Yellow
if (Test-Path .next) { Remove-Item -Recurse -Force .next }

Write-Host "Running Build..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "BUILD SUCCESSFUL!" -ForegroundColor Green
} else {
    Write-Host "BUILD FAILED. Check errors above." -ForegroundColor Red
}
