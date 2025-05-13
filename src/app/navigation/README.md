# 앱 네비게이션 구조 설명서

이 문서는 앱의 네비게이션 구조와, 화면 간 이동 방법을 설명합니다.

## 네비게이션 구조 개요

앱은 다음과 같은 계층 구조로 네비게이션이 구성되어 있습니다:

```
RootStack (AppNavigator)
├── MainScreen (ROUTES.MAIN)
│   └── DrawerNavigator (MainNavigator)
│       ├── HomeStack (ROUTES.HOME)
│       │   └── HomeScreen
│       └── WebViewStack (ROUTES.WEBVIEW)
│           └── WebViewScreen
└── SettingsScreen (ROUTES.SETTINGS) - 모달로 표시
```

## 파일 구조

- `app-navigator.tsx` - 루트 네비게이터 (앱의 최상위 네비게이션)
- `main-navigator.tsx` - Drawer 네비게이터와 그 안의 스택 네비게이터들
- `routes.ts` - 라우트 이름 상수 정의
- `types.ts` - 네비게이션 관련 타입 정의
- `hooks/use-app-navigation.ts` - 화면 이동 및 네비게이션 관련 훅
- `hooks/use-screen-params.ts` - 화면 파라미터를 쉽게 사용하기 위한 훅

## 네비게이션 타입

앱은 다음과 같은 주요 타입을 사용합니다:

1. `RootStackParamList` - 모든 화면 파라미터를 정의
2. `DrawerParamList` - Drawer 메뉴 항목 파라미터를 정의
3. `AppNavigationProp` - 네비게이션 객체 타입 (Stack + Drawer)

## 네비게이션 방법

### 1. 훅을 사용한 네비게이션

앱에서는 `useAppNavigation` 훅을 사용하여 어느 컴포넌트에서든 쉽게 화면 이동이 가능합니다:

```tsx
import { useAppNavigation } from '../app/navigation/hooks/use-app-navigation';

const MyComponent = () => {
  const { goToHome, goToSettings, goToWebView, openDrawer } = useAppNavigation();

  return (
    <View>
      <Button onPress={goToHome} title="홈으로 이동" />
      <Button onPress={() => goToWebView('https://example.com')} title="웹뷰 열기" />
      <Button onPress={goToSettings} title="설정" />
      <Button onPress={openDrawer} title="메뉴 열기" />
    </View>
  );
};
```

### 2. 동적 화면 이동

특정 화면으로 이동하는 고정 함수 외에도, 동적으로 화면 이동이 필요할 때는 `goTo` 함수를 사용할 수 있습니다:

```tsx
const { goTo } = useAppNavigation();

// 이동할 화면과 파라미터를 동적으로 결정
goTo(ROUTES.WEBVIEW, { url: dynamicUrl });
```

### 3. Drawer 조작

Drawer 메뉴를 열고 닫는 기능도 제공합니다:

```tsx
const { openDrawer, closeDrawer, toggleDrawer } = useAppNavigation();
```

## 화면 파라미터 사용

화면에서 전달된 파라미터는 전용 훅을 통해 쉽게 접근할 수 있습니다:

```tsx
import { useWebViewParams } from '../app/navigation/hooks/use-screen-params';

const WebViewScreen = () => {
  // url 파라미터를 쉽게 추출
  const { url } = useWebViewParams();

  return <WebView source={{ uri: url }} />;
};
```

## 네비게이션 커스터마이징

1. 새 화면 추가:

   - `routes.ts`에 새 라우트 이름 추가
   - `types.ts`에 파라미터 타입 추가
   - 적절한 네비게이터에 새 화면 등록

2. 새 파라미터 훅 추가:
   - `hooks/use-screen-params.ts`에 새 훅 추가
   - 필요한 타입 별칭 `types.ts`에 추가
