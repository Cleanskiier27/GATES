# This script opens port 4432 in the Windows Firewall for both TCP and UDP traffic.
# It must be run as an Administrator.

$ruleNameTCP = "Allow Port 4432 TCP"
$ruleNameUDP = "Allow Port 4432 UDP"
$port = 4432

Write-Host "Opening port $port in Windows Firewall..." -ForegroundColor Cyan

# Add TCP rule
if (Get-NetFirewallRule -Name $ruleNameTCP -ErrorAction SilentlyContinue) {
    Write-Host "TCP rule already exists. Updating..." -ForegroundColor Yellow
    Set-NetFirewallRule -Name $ruleNameTCP -LocalPort $port -Protocol TCP -Action Allow -Enabled True
} else {
    New-NetFirewallRule -DisplayName $ruleNameTCP -Name $ruleNameTCP -Direction Inbound -LocalPort $port -Protocol TCP -Action Allow
    Write-Host "TCP rule created." -ForegroundColor Green
}

# Add UDP rule
if (Get-NetFirewallRule -Name $ruleNameUDP -ErrorAction SilentlyContinue) {
    Write-Host "UDP rule already exists. Updating..." -ForegroundColor Yellow
    Set-NetFirewallRule -Name $ruleNameUDP -LocalPort $port -Protocol UDP -Action Allow -Enabled True
} else {
    New-NetFirewallRule -DisplayName $ruleNameUDP -Name $ruleNameUDP -Direction Inbound -LocalPort $port -Protocol UDP -Action Allow
    Write-Host "UDP rule created." -ForegroundColor Green
}

Write-Host "Done! Port $port is now open for inbound traffic." -ForegroundColor Green
