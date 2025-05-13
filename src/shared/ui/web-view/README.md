# WebViewLayout 컴포넌트

이 컴포넌트는 앱 전체에서 재사용 가능한 WebView 레이아웃을 제공합니다.

## 특징

- 기본 네비게이션 처리: 링크 클릭시 새 웹뷰 화면으로 이동
- 커스텀 네비게이션 핸들러 지원
- 키보드 관련 설정 최적화
- 로딩 인디케이터 내장
- 웹 페이지와 앱 간 통신 지원

## 사용법

### 기본 사용법

```tsx
import { WebViewLayout } from '../../../shared/ui/web-view';

const MyScreen = () => {
  return <WebViewLayout url="https://example.com" />;
};
```

### 커스텀 네비게이션 핸들러 사용

```tsx
import { WebViewLayout } from '../../../shared/ui/web-view';

const MyScreen = () => {
  const handleNavigation = (url: string) => {
    // 링크 처리를 위한 커스텀 로직
    console.log('사용자가 링크 클릭:', url);
    // 외부 브라우저로 열기, 특정 조건에 따라 다른 화면으로 이동 등
  };

  return <WebViewLayout url="https://example.com" handleNavigation={handleNavigation} />;
};
```

### 추가 WebView 속성 사용

```tsx
import { WebViewLayout } from '../../../shared/ui/web-view';

const MyScreen = () => {
  return (
    <WebViewLayout
      url="https://example.com"
      useKeyboardAvoidingView={false} // 키보드 피하기 비활성화
      scrollEnabled={true} // 스크롤 활성화
      onLoadProgress={(event) => console.log('로딩 진행률:', event.nativeEvent.progress)}
    />
  );
};
```

### 커스텀 JavaScript 주입

```tsx
import { WebViewLayout } from '../../../shared/ui/web-view';

const MyScreen = () => {
  const customJS = `
    // 커스텀 JavaScript 코드
    document.body.style.backgroundColor = 'lightblue';
    
    // 네이티브 앱과의 통신 예시
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'custom',
      data: '커스텀 데이터'
    }));
  `;

  return <WebViewLayout url="https://example.com" injectedJavaScript={customJS} />;
};
```

커스텀 JavaScript는 기본 스크립트와 함께 실행됩니다. 따라서 링크 클릭 감지와 같은 기본 기능을 유지하면서 추가 기능을 구현할 수 있습니다.

## Props

| 속성                    | 타입                  | 필수   | 기본값 | 설명                                                          |
| ----------------------- | --------------------- | ------ | ------ | ------------------------------------------------------------- |
| url                     | string                | 예     | -      | 웹뷰에 로드할 URL                                             |
| handleNavigation        | (url: string) => void | 아니오 | -      | 링크 클릭시 호출될 함수                                       |
| useKeyboardAvoidingView | boolean               | 아니오 | true   | 키보드 피하기 사용 여부                                       |
| injectedJavaScript      | string                | 아니오 | -      | 웹뷰에 주입할 커스텀 JavaScript (기본 스크립트와 함께 실행됨) |

그 외에도 `react-native-webview`의 `WebViewProps`에서 제공하는 모든 속성을 사용할 수 있습니다.
