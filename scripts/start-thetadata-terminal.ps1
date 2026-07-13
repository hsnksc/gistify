$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $repoRoot ".env.local"
$thetaDir = Join-Path $env:USERPROFILE ".thetadata"
$jarPath = Join-Path $thetaDir "ThetaTerminalv3.jar"

if (-not (Test-Path -LiteralPath $envFile)) {
  throw ".env.local bulunamadi. THETADATA_API_KEY ayarini ekleyin."
}

$keyLine = Get-Content -LiteralPath $envFile |
  Where-Object { $_ -like "THETADATA_API_KEY=*" } |
  Select-Object -First 1

if (-not $keyLine) {
  throw "THETADATA_API_KEY .env.local icinde bulunamadi."
}

if (-not (Test-Path -LiteralPath $jarPath)) {
  New-Item -ItemType Directory -Force -Path $thetaDir | Out-Null
  Invoke-WebRequest `
    -Uri "https://download-unstable.thetadata.us/ThetaTerminalv3.jar" `
    -OutFile $jarPath
}

$javaHome = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory |
  Where-Object Name -Like "jdk-21*" |
  Sort-Object Name -Descending |
  Select-Object -First 1 -ExpandProperty FullName

if (-not $javaHome) {
  throw "Java 21 bulunamadi. EclipseAdoptium.Temurin.21.JDK kurun."
}

$listener = Get-NetTCPConnection -LocalPort 25503 -State Listen -ErrorAction SilentlyContinue
if ($listener) {
  Write-Output "Theta Terminal zaten calisiyor: http://127.0.0.1:25503"
  exit 0
}

$env:THETADATA_API_KEY = $keyLine.Substring("THETADATA_API_KEY=".Length).Trim().Trim('"')
Start-Process `
  -FilePath (Join-Path $javaHome "bin\javaw.exe") `
  -ArgumentList "-jar", "ThetaTerminalv3.jar" `
  -WorkingDirectory $thetaDir `
  -WindowStyle Hidden | Out-Null

for ($attempt = 0; $attempt -lt 30; $attempt += 1) {
  Start-Sleep -Seconds 2
  if (Get-NetTCPConnection -LocalPort 25503 -State Listen -ErrorAction SilentlyContinue) {
    Write-Output "Theta Terminal hazir: http://127.0.0.1:25503"
    exit 0
  }
}

throw "Theta Terminal 60 saniye icinde baslatilamadi."
