# Install Android Studio and set up an Android emulator (Pixel 3a API 33)
# This script assumes winget is available on the system.

# 1. Install Android Studio (includes SDK and emulator)
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Error "winget not found. Please install winget first."
    exit 1
}

# Install Android Studio from Microsoft Store via winget
winget install --id Google.AndroidStudio --exact --source msstore -h

# Give the installer a moment (adjust if needed)
Start-Sleep -Seconds 15

# 2. Set SDK environment variables (default location)
$androidSdkRoot = "$env:LOCALAPPDATA\Android\Sdk"
if (-not (Test-Path $androidSdkRoot)) {
    Write-Error "Android SDK not found at $androidSdkRoot. Installation may have failed."
    exit 1
}
$env:ANDROID_SDK_ROOT = $androidSdkRoot
$env:PATH += ";$androidSdkRoot\platform-tools;$androidSdkRoot\emulator"

# 3. Install platform 33 and a Play Store system image (x86_64)
$cmdline = Join-Path $androidSdkRoot "cmdline-tools\latest\bin\sdkmanager.bat"
if (-not (Test-Path $cmdline)) {
    Write-Error "sdkmanager not found at $cmdline"
    exit 1
}
& $cmdline "platforms;android-33" "system-images;android-33;google_apis_playstore;x86_64"

# Accept all SDK licences
& $cmdline --licenses

# 4. Create an AVD named Pixel_3a_API_33 using the installed system image
$avdmanager = Join-Path $androidSdkRoot "cmdline-tools\latest\bin\avdmanager.bat"
if (-not (Test-Path $avdmanager)) {
    Write-Error "avdmanager not found at $avdmanager"
    exit 1
}
& $avdmanager create avd -n Pixel_3a_API_33 -k "system-images;android-33;google_apis_playstore;x86_64" --device "pixel"

# 5. Verify the AVD was created
emulator -list-avds

Write-Host "Android emulator installation and AVD setup complete. You can start the emulator with: emulator @Pixel_3a_API_33"
