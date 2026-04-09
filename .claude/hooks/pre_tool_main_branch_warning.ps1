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

$isCodeFile = $command -match '(?i)\.(ts|tsx|js|jsx|mjs|cjs|css|scss|json|yml|yaml|toml|md|py|go|rs|java|cs|php|rb)\b'

if (-not ($isWriteOrEdit -and $isCodeFile)) {
  exit 0
}

$branch = (git rev-parse --abbrev-ref HEAD 2>$null)
if ($LASTEXITCODE -ne 0) {
  exit 0
}
$branch = $branch.Trim()

if ($branch -in @("main", "master")) {
  $message = "Warning: Estas en la rama main. Considera crear una rama antes de continuar."
  $result = @{ systemMessage = $message } | ConvertTo-Json -Compress
  [Console]::Out.Write($result)
}

exit 0
