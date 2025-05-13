# React Native Template

This is a React Native template project designed to help you quickly build new applications. It includes pre-configured settings and commonly used libraries to speed up development.

## Tech Stack

- React Native (0.79.2)
- React Native WebView
- React Native Vector Icons (Feather)
- NativeWind (TailwindCSS 3)

## Prerequisites

### Android Environment Setup

1. Install Java Development Kit (JDK)
2. Install Android Studio
   ```sh
   brew install --cask android-studio
   ```
3. Install Android Command Line Tools
   ```sh
   brew install android-commandlinetools
   ```
4. Configure Android SDK environment variables
   ```sh
   export ANDROID_HOME=$HOME/Library/Android/sdk
   ```
5. Open Android Studio and install:
   - SDK Manager
   - Virtual Device Manager

### iOS Environment Setup

1. Install CocoaPods
   ```sh
   brew install cocoapods
   ```

### Common Dependencies

1. Install Watchman (required for file watching)
   ```sh
   brew install watchman
   ```

## Getting Started

1. Clone the repository and install dependencies:

   ```sh
   git clone https://github.com/your-org/your-app.git
   cd your-app
   pnpm install
   ```

2. Rename the app (name and bundle ID):

   ```sh
   pnpm rename
   ```

3. Start Metro bundler:

   ```sh
   pnpm start
   ```

4. Run the app:

   ```sh
   # for iOS (Mac only)
   pnpm pod-install
   pnpm ios

   # for Android (ensure emulator is running)
   pnpm android
   ```

## Local Development

### iOS Setup

1. Open `ios/YourApp.xcworkspace` in Xcode
2. Set a valid Team in Signing & Capabilities
3. Clean build folder (⇧ + ⌘ + K) if needed

### Android Setup

1. Ensure Android Studio is installed with SDK + emulator
2. Create an emulator via Android Studio or CLI
3. Start emulator manually, then run `pnpm android`

### Dev Menu Shortcuts

| Platform | Shortcut                       |
| -------- | ------------------------------ |
| iOS      | ⌘ + D or Shake device          |
| Android  | ⌘ + M or ⌃ + M or Shake device |

## 🧪 Troubleshooting

### Android WebView Localhost Access

If you need to access localhost content in Android WebView:

```sh
# Forward localhost:8080 to the Android device/emulator for WebView access
adb reverse tcp:8080 tcp:8080
```

This command allows your Android WebView to access localhost content running on port 8080 of your development machine.

### iOS Build Issues

#### Error: "xcodebuild exited with code 70"

1. Open `ios/YourApp.xcworkspace` in Xcode
2. Set a valid development team
3. Product > Clean Build Folder > Run

#### Sandbox / Hermes Errors

If you see errors like: `Sandbox: rsync.samba(...) deny(1) file-read-data ...hermes.framework`

Try:

```sh
killall Simulator
killall Xcode
pnpm ios-clean
pnpm pod-install
pnpm ios
```

#### Build Service Issues

If you see: "Build service: unable to initiate PIF transfer session"

```sh
sudo killall -9 xcbuild
```

## Development Tips

### iOS Development

- **Restart App in Simulator**:

  - Press `R` in the iOS Simulator
  - Or use the Dev Menu (Cmd + M)

- **Debugging**:
  - Use Safari Developer Tools
  - Enable Remote JS Debugging in the Dev Menu

### Using Icons

This template uses `react-native-vector-icons` with the Feather icon set:

```jsx
import Icon from 'react-native-vector-icons/Feather';

// Example usage
<Icon name="x" size={24} className="text-zinc-600" />;
```

View all available icons at: [Feather Icons](https://oblador.github.io/react-native-vector-icons/#Feather)

### Navigation & WebView

This template includes pre-configured navigation and WebView components to help you get started quickly.

#### Navigation

For detailed information about the app's navigation structure, see the dedicated [Navigation README](src/app/navigation/README.md) that covers:

- Navigation structure overview
- File organization
- Navigation types
- Screen navigation methods
- Using screen parameters
- How to customize navigation

#### WebView Usage

The template provides a reusable WebView component with built-in features. For detailed usage information, check the [WebView README](src/shared/ui/webview/README.md) that includes:

- Basic usage examples
- Custom navigation handlers
- Additional WebView properties
- Custom JavaScript injection
- Complete props documentation

For quick implementation, see these examples:

```jsx
// Basic WebView usage
import { WebViewLayout } from '../shared/ui/webview';

function WebViewScreen() {
  return <WebViewLayout url="https://example.com" />;
}

// Communication with WebView
const handleWebViewMessage = (event) => {
  const message = event.nativeEvent.data;
  console.log('Message from WebView:', message);
};

<WebView
  ref={webViewRef}
  onMessage={handleWebViewMessage}
  // Other props...
/>;
```

Remember to check the Android WebView localhost access instructions in the Troubleshooting section if you need to load content from your development machine.

## Known Issues & Solutions

### NativeWind Issues

1. **Babel Build Error**

   - Reference: [NativeWind Issue #894](https://github.com/nativewind/nativewind/issues/894)

2. **👀 Waiting TailwindCSS v4 Update**
   - Check status: [NativeWind Discussion #1422](https://github.com/nativewind/nativewind/discussions/1422)

### WebView Issues

1. **White Screen Issue**

   - Reference: [React Native Blog - New Architecture](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here#opt-out)

2. **Android Localhost Connection**
   - Before accessing localhost in WebView, run:
     ```sh
     adb reverse tcp:8080 tcp:8080
     ```
   - Solution: [Stack Overflow - Localhost Connection](https://stackoverflow.com/questions/44702554/cant-connect-to-localhost-in-react-native-webview)

## Troubleshooting

### iOS Issues

If you encounter build or runtime issues with iOS:

1. Clean the iOS build:

   ```sh
   pnpm ios-clean
   ```

2. Reinstall pods:

   ```sh
   pnpm pod-install
   ```

3. Run the app again:
   ```sh
   pnpm ios
   ```

> **Note**: You should also run `pnpm pod-install` after:
>
> - Adding new native dependencies
> - Updating existing native packages
> - Pulling new changes that include native dependencies
> - Any time you see pod-related errors in the build
