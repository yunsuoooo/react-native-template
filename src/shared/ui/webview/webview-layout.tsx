import { useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView, WebViewProps, WebViewMessageEvent } from 'react-native-webview';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { useAppNavigation } from '@app/navigation/hooks/use-app-navigation';
import { getInjectedJavaScript } from './webview-injected-scripts';

interface WebViewLayoutProps extends Partial<WebViewProps> {
  ref: React.RefObject<WebView>;
  url: string;
  initializeWebView?: () => void;
  handleNavigation?: (url: string) => void;
  useKeyboardAvoidingView?: boolean;
}

export const WebViewLayout = ({
  ref,
  url,
  initializeWebView,
  handleNavigation,
  useKeyboardAvoidingView = true,
  injectedJavaScript,
  onLoadEnd,
  onMessage,
  ...webViewProps
}: WebViewLayoutProps) => {
  const { goToWebView } = useAppNavigation();

  // WebView에서 메시지 수신 처리
  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      // 외부에서 전달된 메시지 핸들러가 있으면 먼저 실행
      if (onMessage) {
        onMessage(event);
      }

      try {
        const { type, data, url } = JSON.parse(event.nativeEvent.data) as {
          type: 'log' | 'warn' | 'error' | 'info' | 'debug' | 'navigation';
          data: any[];
          url?: string;
        };
        // 콘솔 로그 처리
        switch (type) {
          case 'log':
            console.log('WebView Console [LOG]:', ...data);
            break;
          case 'warn':
            console.warn('WebView Console [WARN]:', ...data);
            break;
          case 'error':
            console.error('WebView Console [ERROR]:', ...data);
            break;
          case 'info':
            console.info('WebView Console [INFO]:', ...data);
            break;
          case 'debug':
            console.debug('WebView Console [DEBUG]:', ...data);
            break;
          case 'navigation':
            if (!url) return;

            console.log('웹뷰 내부 네비게이션 요청:', url);
            if (handleNavigation) {
              handleNavigation(url);
            } else {
              goToWebView(url);
            }
            break;
          default:
            if (onMessage) break;
            console.log('WebView Message:', event.nativeEvent.data);
        }
      } catch (e) {
        console.error('WebView 메시지 처리 오류:', e);
      }
    },
    [handleNavigation, goToWebView, onMessage],
  );

  const handleLoadEnd = useCallback(() => {
    if (ref.current) {
      initializeWebView?.();
    }
  }, [initializeWebView]);

  const webViewContent = (
    <WebView
      ref={ref}
      source={{ uri: url }}
      className="flex-1"
      onLoadEnd={handleLoadEnd}
      onMessage={handleWebViewMessage}
      startInLoadingState={true}
      hideKeyboardAccessoryView
      keyboardDisplayRequiresUserAction={false}
      injectedJavaScript={getInjectedJavaScript(injectedJavaScript)}
      webviewDebuggingEnabled
      useWebView2
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowFileAccess={true}
      allowFileAccessFromFileURLs={true}
      allowUniversalAccessFromFileURLs={true}
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
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        {webViewContent}
      </KeyboardAvoidingView>
    );
  }

  return webViewContent;
};

export default WebViewLayout;
