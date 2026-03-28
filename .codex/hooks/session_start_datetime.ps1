$nowLocal = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
$nowUtc = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss 'UTC'")

Write-Output "Fecha/hora actual (local): $nowLocal"
Write-Output "Fecha/hora actual (UTC): $nowUtc"

exit 0
