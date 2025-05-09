import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { RouteProp, useRoute } from '@react-navigation/native';
import { WebViewStackParamList } from '../../../app/navigation/types';
import { WEBVIEW_STACK_ROUTES } from '../../../app/navigation/route-keys';

type WebViewScreenRouteProp = RouteProp<WebViewStackParamList, typeof WEBVIEW_STACK_ROUTES.MAIN>;

export const WebViewScreen = () => {
  const route = useRoute<WebViewScreenRouteProp>();
  const { url } = route.params;

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
    <View className="flex-1">
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleWebViewMessage}
        startInLoadingState={true}
        hideKeyboardAccessoryView
        keyboardDisplayRequiresUserAction={false}
        useWebView2
        renderLoading={() => (
          <ActivityIndicator
            className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center"
            size="large"
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});

export default WebViewScreen;
