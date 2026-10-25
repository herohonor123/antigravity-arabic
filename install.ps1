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

# Register OS-level Windows Scheduled Task (runs silently every 1 min without terminal popups)
try {
    $vbsPath = "$PSScriptRoot\bin\silent-inject.vbs"
    $action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "`"$vbsPath`""
    $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 1)
    Register-ScheduledTask -TaskName "AntigravityArabicWatcher" -Action $action -Trigger $trigger -Force -ErrorAction SilentlyContinue | Out-Null
    Write-Host "✅ Registered persistent Windows Scheduled Task (auto-repairs every 60s)." -ForegroundColor Green
} catch {
    # Ignore if not on Windows or policy restricted
}
