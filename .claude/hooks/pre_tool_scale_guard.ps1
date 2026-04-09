$rawInput = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($rawInput)) {
  exit 0
}

try {
  $payload = $rawInput | ConvertFrom-Json
} catch {
  exit 0
}

$command = ""
if ($null -ne $payload.tool_input -and $null -ne $payload.tool_input.command) {
  $command = [string]$payload.tool_input.command
}

if ([string]::IsNullOrWhiteSpace($command)) {
  exit 0
}

$isWriteOrEdit = (
  ($command -match '(?i)\b(write|edit)\b') -or
  ($command -match '(?i)\b(apply_patch|set-content|add-content|out-file|new-item|move-item|copy-item)\b') -or
  ($command -match '(?i)\s(>|>>)\s')
)

$isCodeFile = $command -match '(?i)\.(ts|tsx|js|jsx|mjs|cjs|css|scss|json|yml|yaml|toml|md)\b'

if (-not ($isWriteOrEdit -and $isCodeFile)) {
  exit 0
}

$isBusinessOrDataPath = $command -match '(?i)(dashboard|configuration|access|sites|services|hooks|api|auth|documents|companies|workers)'

if (-not $isBusinessOrDataPath) {
  exit 0
}

$message = @"
Scale Gate:
Before coding, state impact for 1/10/50/100 concurrent users.
Check frontend loops (useEffect/SWR), request amplification, pagination, and error-retry behavior.
If backend/API changes: include idempotency and race-condition handling plan.
"@

$result = @{ systemMessage = $message.Trim() } | ConvertTo-Json -Compress
[Console]::Out.Write($result)

exit 0
