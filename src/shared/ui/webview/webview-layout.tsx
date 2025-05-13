import { useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView, WebViewProps, WebViewMessageEvent } from 'react-native-webview';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { useAppNavigation } from '../../../app/navigation/hooks/use-app-navigation';

interface WebViewLayoutProps extends Partial<WebViewProps> {
  url: string;
  handleNavigation?: (url: string) => void;
  useKeyboardAvoidingView?: boolean;
  injectedJavaScript?: string;
  onMessage?: (event: WebViewMessageEvent) => void;
}

export const WebViewLayout = ({
  url,
  handleNavigation,
  useKeyboardAvoidingView = true,
  injectedJavaScript,
  onMessage,
  ...webViewProps
}: WebViewLayoutProps) => {
  const { goToWebView } = useAppNavigation();

  const finalInjectedJavaScript = `
    // 네이티브 앱과 통신하기 위한 함수
    window.ReactNativeWebView.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    };
    
    // 웹 페이지의 링크 클릭 이벤트 감지
    document.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        const href = e.target.getAttribute('href');
        if (href && !href.startsWith('#')) {
          e.preventDefault();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'navigation',
            url: href
          }));
        }
      }
    });

    ${injectedJavaScript ? injectedJavaScript : ''}
    
    true;
  `;

  // WebView에서 메시지 수신 처리
  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      // 외부에서 전달된 메시지 핸들러가 있으면 먼저 실행
      if (onMessage) {
        onMessage(event);
      }

      try {
        const data = JSON.parse(event.nativeEvent.data);

        // 네비게이션 요청 처리
        if (data.type === 'navigation') {
          console.log('웹뷰 내부 네비게이션 요청:', data.url);

          if (handleNavigation) {
            // 커스텀 네비게이션 핸들러가 있으면 사용
            handleNavigation(data.url);
          } else {
            // 기본 네비게이션 처리: 새 웹뷰 화면 열기
            goToWebView(data.url);
          }
        }
      } catch (e) {
        console.error('WebView 메시지 처리 오류:', e);
      }
    },
    [handleNavigation, goToWebView, onMessage],
  );

  const webViewContent = (
    <WebView
      source={{ uri: url }}
      className="flex-1"
      injectedJavaScript={finalInjectedJavaScript}
      onMessage={handleWebViewMessage}
      startInLoadingState={true}
      hideKeyboardAccessoryView
      keyboardDisplayRequiresUserAction={false}
      webviewDebuggingEnabled
      useWebView2
      scrollEnabled={false}
      renderLoading={() => (
        <ActivityIndicator
          className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center"
          size="large"
        />
      )}
      {...webViewProps}
    />
  );

  if (useKeyboardAvoidingView) {
    return (
      <KeyboardAvoidingView behavior={'padding'} className="flex-1">
        {webViewContent}
      </KeyboardAvoidingView>
    );
  }

  return webViewContent;
};

export default WebViewLayout;
