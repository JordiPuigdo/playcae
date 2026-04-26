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

$touchesAuthPath = $command -match '(?i)(auth|token)'

if ($isWriteOrEdit -and $touchesAuthPath) {
  $message = "Warning: You are modifying authentication-related code. Confirm this is intended."
  $result = @{ systemMessage = $message } | ConvertTo-Json -Compress
  [Console]::Out.Write($result)
}

exit 0
