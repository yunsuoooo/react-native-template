import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { useWebViewParams } from '../../../app/navigation/hooks/use-screen-params';

export const WebViewScreen = () => {
  const { url } = useWebViewParams();

  // WebView와 네이티브 앱 간의 통신을 위한 JavaScript 코드
  const injectedJavaScript = `
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
    
    true;
  `;

  // WebView에서 메시지 수신 처리
  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // 네비게이션 요청 처리
      if (data.type === 'navigation') {
        console.log('웹뷰 내부 네비게이션 요청:', data.url);
        // 여기서 필요한 네비게이션 로직 구현
      }
    } catch (e) {
      console.error('WebView 메시지 처리 오류:', e);
    }
  };

  return (
    <KeyboardAvoidingView behavior={'padding'} className="flex-1">
      <WebView
        source={{ uri: url }}
        className="flex-1"
        injectedJavaScript={injectedJavaScript}
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
      />
    </KeyboardAvoidingView>
  );
};

export default WebViewScreen;
