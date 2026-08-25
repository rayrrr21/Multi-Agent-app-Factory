# This script sets up the Android SDK environment and creates a Pixel 3a AVD (API 33).
# It assumes Android Studio (or the SDK) is already installed on the machine.
# If the SDK is not found, it prints a clear instruction for the user.

# Detect Android SDK location (common default paths)
$possiblePaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:ProgramFiles\Android\AndroidSDK",
    "C:\Android\sdk"
)
$androidSdkRoot = $null
foreach ($p in $possiblePaths) {
    if (Test-Path $p) { $androidSdkRoot = $p; break }
}

if (-not $androidSdkRoot) {
    Write-Host "Android SDK not found in common locations."
    Write-Host "Please install Android Studio (which includes the SDK) manually,"
    Write-Host "or set the environment variable ANDROID_SDK_ROOT to the SDK path,"
    Write-Host "then re-run this script."
    exit 1
}

# Export environment variables for the current session
$env:ANDROID_SDK_ROOT = $androidSdkRoot
$env:PATH += ";$androidSdkRoot\platform-tools;$androidSdkRoot\emulator"

# Paths to SDK tools
$sdkManager = Join-Path $androidSdkRoot "cmdline-tools\latest\bin\sdkmanager.bat"
$avdManager = Join-Path $androidSdkRoot "cmdline-tools\latest\bin\avdmanager.bat"

if (-not (Test-Path $sdkManager)) {
    Write-Error "sdkmanager not found at $sdkManager. Ensure cmdline-tools are installed (via Android Studio)."
    exit 1
}
if (-not (Test-Path $avdManager)) {
    Write-Error "avdmanager not found at $avdManager. Ensure cmdline-tools are installed."
    exit 1
}

# Install platform 33 and Play Store system image if not already present
Write-Host "Installing Android platform 33 and Play Store system image..."
& $sdkManager "platforms;android-33" "system-images;android-33;google_apis_playstore;x86_64" --quiet

# Accept all licenses
Write-Host "Accepting SDK licenses..."
cmd /c "echo y | \"$sdkManager\" --licenses"

# Create AVD if it does not exist
$avdName = "Pixel_3a_API_33"
$existingAvds = & emulator -list-avds
if ($existingAvds -contains $avdName) {
    Write-Host "AVD '$avdName' already exists. Skipping creation."
} else {
    Write-Host "Creating AVD '$avdName'..."
    & $avdManager create avd -n $avdName -k "system-images;android-33;google_apis_playstore;x86_64" --device "pixel"
}

# List AVDs to verify
Write-Host "Available AVDs:"
& emulator -list-avds

Write-Host "Android SDK setup and AVD creation complete. You can start the emulator with:"
Write-Host "    emulator @${avdName}"
