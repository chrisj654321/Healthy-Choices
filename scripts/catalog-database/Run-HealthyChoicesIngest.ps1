$WorkingDir = "C:\Users\chris\HealthyChoices"
$LogFile    = "$WorkingDir\scripts\ingestion_log.txt"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $ts   = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] [$Level] $Message"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line
}

function Invoke-IngestCommand {
    param([string]$Arguments)
    $argList  = $Arguments -split ' (?=--)'
    $maxTries = 3
    $delays   = @(10, 30)   # seconds to wait before retry 2, then retry 3

    for ($attempt = 1; $attempt -le $maxTries; $attempt++) {
        Write-Log "Running (attempt $attempt of $maxTries): node $Arguments"
        $output   = & node $argList 2>&1 | Out-String
        $exitCode = $LASTEXITCODE

        if ($output.Trim()) {
            foreach ($outputLine in ($output -split "`n")) {
                $trimmed = $outputLine.TrimEnd()
                if ($trimmed) { Write-Log "  $trimmed" }
            }
        }

        # Transient errors worth retrying
        $isTimeout      = ($output -match "timeout" -or $output -match "ETIMEDOUT")
        $isDnsError     = ($output -match "EAI_AGAIN")
        $isConnRefused  = ($output -match "ECONNREFUSED")
        # HTTP 503 from OpenFoodFacts is a soft warning inside the script — only
        # fatal if the script itself exited non-zero.
        $isSoft503      = ($exitCode -ne 0 -and $output -match "HTTP 503")

        $isRetryable    = ($exitCode -ne 0) -and ($isTimeout -or $isDnsError -or $isConnRefused -or $isSoft503)
        $isFatalNonNet  = ($exitCode -ne 0) -and (-not $isRetryable)

        if ($exitCode -eq 0) {
            Write-Log "Completed successfully (exit code 0)."
            return $true
        }

        if ($isFatalNonNet) {
            Write-Log "FAILED (exit code $exitCode, non-retryable) - stopping pipeline." "ERROR"
            return $false
        }

        # Retryable failure
        if ($attempt -lt $maxTries) {
            $wait = $delays[$attempt - 1]
            Write-Log "Transient error on attempt $attempt — retrying in ${wait}s..." "WARN"
            Start-Sleep -Seconds $wait
        } else {
            Write-Log "FAILED after $maxTries attempts - stopping pipeline." "ERROR"
            return $false
        }
    }
    return $false
}

Set-Location $WorkingDir
Write-Log "========================================================"
Write-Log "healthy-choices-daily-ingest START"

$commands = @(
    # --- Wave 4: Replaced 9 exhausted queries (page counter reset to 1) ---
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="macaroni and cheese"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="granola bar"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="pasta sauce"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="salad dressing"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="breakfast cereal"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="whole grain bread"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="frozen pizza"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="frozen vegetables"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="canned soup"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="mixed nuts"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="energy drink"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="canned beans"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="ice cream"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="cream cheese"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="snack mix"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="hot sauce"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="protein bar"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="frozen chicken"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="fruit snacks"',
    'scripts/catalog-database/ingest-products.js --batch=200 --source=usda --query="sports drink"'
)

$stepNumber = 1
$allOk = $true

foreach ($cmd in $commands) {
    Write-Log "--- Step $stepNumber of $($commands.Count) ---"
    $ok = Invoke-IngestCommand -Arguments $cmd
    if (-not $ok) { $allOk = $false; break }
    $stepNumber++
}

if ($allOk) {
    Write-Log "healthy-choices-daily-ingest COMPLETED (all steps passed)"
} else {
    Write-Log "healthy-choices-daily-ingest ABORTED (see ERROR above)" "ERROR"
    exit 1
}
Write-Log "========================================================"
