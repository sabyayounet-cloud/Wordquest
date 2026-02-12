#!/bin/bash
# =============================================================================
# WordQuest iOS Build Script
# Builds the iOS app for App Store distribution (.ipa)
# =============================================================================
#
# Prerequisites:
#   1. Xcode installed (from Mac App Store)
#   2. Apple Developer account configured in Xcode
#   3. Run: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
#   4. Run: npm run build:mobile (to sync latest web assets)
#
# Usage:
#   chmod +x scripts/build-ios.sh
#   ./scripts/build-ios.sh
#
# =============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
IOS_DIR="$PROJECT_DIR/ios/App"
BUILD_DIR="$PROJECT_DIR/ios/build"
ARCHIVE_PATH="$BUILD_DIR/WordQuest.xcarchive"
EXPORT_PATH="$BUILD_DIR/export"
EXPORT_OPTIONS="$PROJECT_DIR/ios/ExportOptions-AppStore.plist"

SCHEME="App"
WORKSPACE="$IOS_DIR/App.xcodeproj"

echo ""
echo "🏗️  WordQuest iOS Build"
echo "========================"
echo ""

# Check for Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Error: xcodebuild not found. Please install Xcode from the Mac App Store."
    exit 1
fi

XCODE_VERSION=$(xcodebuild -version | head -1)
echo "📱 Using: $XCODE_VERSION"
echo ""

# Clean build directory
echo "🧹 Cleaning previous builds..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Resolve SPM dependencies
echo "📦 Resolving Swift Package Manager dependencies..."
cd "$IOS_DIR"
xcodebuild -resolvePackageDependencies -project App.xcodeproj -scheme "$SCHEME" 2>&1 | tail -5

# Step 1: Build archive
echo ""
echo "📦 Step 1/2: Creating archive..."
echo ""

xcodebuild archive \
    -project App.xcodeproj \
    -scheme "$SCHEME" \
    -destination "generic/platform=iOS" \
    -archivePath "$ARCHIVE_PATH" \
    CODE_SIGN_STYLE=Automatic \
    -allowProvisioningUpdates \
    | tail -20

if [ ! -d "$ARCHIVE_PATH" ]; then
    echo "❌ Archive failed. Check Xcode signing configuration."
    echo "   Open in Xcode: npm run open:ios"
    echo "   Then set your Development Team in Signing & Capabilities."
    exit 1
fi

echo "✅ Archive created: $ARCHIVE_PATH"

# Step 2: Export IPA for App Store
echo ""
echo "📦 Step 2/2: Exporting IPA for App Store..."
echo ""

xcodebuild -exportArchive \
    -archivePath "$ARCHIVE_PATH" \
    -exportPath "$EXPORT_PATH" \
    -exportOptionsPlist "$EXPORT_OPTIONS" \
    -allowProvisioningUpdates \
    | tail -10

if [ ! -d "$EXPORT_PATH" ]; then
    echo "❌ Export failed. Ensure your Apple Developer account is configured."
    exit 1
fi

echo ""
echo "🎉 iOS Build Complete!"
echo "========================"
echo ""
echo "📁 Archive:  $ARCHIVE_PATH"
echo "📁 IPA:      $EXPORT_PATH/"
echo ""
echo "Next steps:"
echo "  1. Open Xcode Organizer (Xcode > Window > Organizer)"
echo "  2. Select the archive and click 'Distribute App'"
echo "  3. Choose 'App Store Connect' and follow the wizard"
echo ""
echo "  Or upload directly using:"
echo "    xcrun altool --upload-app -f $EXPORT_PATH/App.ipa -t ios"
echo ""
