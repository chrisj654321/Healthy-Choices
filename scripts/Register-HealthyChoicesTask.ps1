# Register-HealthyChoicesTask.ps1
# Run this ONCE (as Administrator) to create the scheduled task.
# After that, Windows Task Scheduler will fire Run-HealthyChoicesIngest.ps1
# every day at 09:30.

$TaskName   = "healthy-choices-daily-ingest"
$ScriptPath = "C:\Users\chris\HealthyChoices\scripts\Run-HealthyChoicesIngest.ps1"
$WorkingDir = "C:\Users\chris\HealthyChoices"
$RunTime    = "09:30"

# ── Remove any existing task with the same name ───────────────────────────────
if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Write-Host "Removing existing task '$TaskName' ..."
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# ── Build the action ──────────────────────────────────────────────────────────
# PowerShell is launched with -NonInteractive so it never prompts,
# and -ExecutionPolicy Bypass so the script runs even on locked-down machines.
$Action = New-ScheduledTaskAction `
    -Execute    "powershell.exe" `
    -Argument   "-NonInteractive -ExecutionPolicy Bypass -File `"$ScriptPath`"" `
    -WorkingDirectory $WorkingDir

# ── Build the trigger (daily at 09:30) ───────────────────────────────────────
$Trigger = New-ScheduledTaskTrigger -Daily -At $RunTime

# ── Settings ─────────────────────────────────────────────────────────────────
$Settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit      (New-TimeSpan -Hours 2) `
    -MultipleInstances       IgnoreNew `
    -StartWhenAvailable                              # catch up if machine was off at 09:30
    # Remove -StartWhenAvailable if you DON'T want catch-up runs

# ── Register ─────────────────────────────────────────────────────────────────
# Runs as the current logged-in user; password is not stored (INTERACTIVE token).
# If you need it to run when no one is logged in, change -LogonType to Password
# and add -Password "yourpassword" (or use a service account).
Register-ScheduledTask `
    -TaskName  $TaskName `
    -Action    $Action `
    -Trigger   $Trigger `
    -Settings  $Settings `
    -RunLevel  Highest `
    -LogonType Interactive `
    -Force

Write-Host ""
Write-Host "Task '$TaskName' registered successfully."
Write-Host "It will run every day at $RunTime using:"
Write-Host "  $ScriptPath"
Write-Host ""
Write-Host "To test it immediately:"
Write-Host "  Start-ScheduledTask -TaskName '$TaskName'"
Write-Host ""
Write-Host "To view task history in the GUI:"
Write-Host "  taskschd.msc  →  Task Scheduler Library  →  $TaskName"
