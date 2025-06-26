# CLAUDE.md

## 👋 Overview

This project is built using **React Native CLI** with **TypeScript**.  
It follows the **FSD (Feature-Sliced Design)** architecture for modular and scalable structure.  
All UI components use **NativeWind** (Tailwind CSS for React Native) for styling.

Please follow the conventions below when prompting Cursor or writing code manually.

---

## 📁 Folder Structure (FSD)

src/
├── app/ # Entry point, navigation setup
├── pages/ # Route-level screens
├── widgets/ # UI blocks combining multiple features/entities
├── features/ # Feature-specific logic and components
├── entities/ # Domain models (e.g., User, Run, Location)
├── shared/ # Shared logic, UI, types, utils
│ ├── ui/ # Reusable atomic UI components
│ ├── lib/ # Utility functions and hooks
│ ├── config/ # Constants, env, app config
│ ├── types/ # Global type declarations

yaml
Copy
Edit

Example: `features/run-tracker/model/use-run-tracker.ts`

---

## ⚙️ Coding Guidelines

### 🧠 Code Style

- Use **function components only** – avoid `React.FC`.
- Write all components, hooks, and utils with **explicit TypeScript types**.
- Use `interface` by default, `type` only for unions or mapped types.
- Use `as const` pattern instead of enums:
  ```ts
  export const RunStatus = {
    IDLE: 'idle',
    RUNNING: 'running',
  } as const;
  export type RunStatus = (typeof RunStatus)[keyof typeof RunStatus];
🧩 Component Conventions
All UI must use NativeWind for styling.

Reusable primitives like Button, Card, etc. should be placed in shared/ui/.

Use lucide-react-native for icons consistently.

Example:

tsx
Copy
Edit
export function Button({ children, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-4 py-2 bg-black rounded-md"
    >
      <Text className="text-white text-base font-medium">
        {children}
      </Text>
    </TouchableOpacity>
  );
}
📍 Native Features
Use react-native-geolocation-service for GPS/location tracking.

Use @react-native-async-storage/async-storage for local storage.

Use react-native-permissions to handle OS-level permissions.

🧱 Naming Conventions
Use kebab-case for all folder and file names.

Use descriptive names for components and hooks:

Examples: use-user-session.ts, run-tracker.model.ts, auth-button.tsx

Prefer named exports for all components.

🚫 Anti-patterns
Avoid the following:

enum, any, and React.FC

Class components

Using StyleSheet.create() – always use NativeWind classes instead

Duplicated state or logic – reuse via shared/lib, shared/ui, etc.

📦 Cursor Prompt Template
When writing prompts to Cursor, use clear and consistent instructions:

txt
Copy
Edit
- Build a feature under features/run-tracker with model, ui, and lib
- Style all components using NativeWind
- Follow FSD architecture
- Reuse types and utilities from shared
- Avoid enums; use const object pattern instead
- Define all function and component types explicitly
📱 UI Design Principles
This is a mobile-first app – use flex, gap, px, py, etc. via NativeWind

No responsive web breakpoints; UI adapts via mobile layouts

Use Platform.OS or useWindowDimensions for platform- or device-specific behavior

✅ Summary
Type-safe, modular, and clean React Native code

Tailwind-style styling via NativeWind

FSD-based architecture with domain boundaries

Mobile-focused UI design

Update this file as the project evolves or if conventions are adjusted. Let’s keep code clean, consistent, and scalable 🚀