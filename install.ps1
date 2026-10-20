# Antigravity Arabic - One-Click PowerShell Installer

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   🚀 Antigravity Arabic Enhancer (أنتيجرافيتي بالعربي) " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Node.js is required to install Antigravity Arabic." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org and rerun this script." -ForegroundColor Yellow
    Exit 1
}

node "$PSScriptRoot\bin\cli.js" install
