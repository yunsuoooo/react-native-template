import { useEffect, useRef, useCallback } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

import { useWebViewParams } from '@app/navigation/hooks/use-screen-params';
import { WebViewLayout } from '@shared/ui/webview';

export const WebViewScreen = () => {
  const { url } = useWebViewParams();
  const webviewRef = useRef<WebView>(null!);

  // 웹뷰에서 메시지 수신 시 처리
  const handleMessage = useCallback(async (event: WebViewMessageEvent) => {
    const { type, data } = JSON.parse(event.nativeEvent.data) as {
      type: string;
      data: string;
    };

    console.log('WebViewMessageEvent', type, data);
  }, []);

  const initializeWebView = useCallback(() => {
    webviewRef.current.postMessage(
      JSON.stringify({
        type: 'session',
        data: 'Hello from React Native',
      }),
    );
  }, []);

  useEffect(() => {
    initializeWebView();
  }, [initializeWebView]);

  return <WebViewLayout ref={webviewRef} url={url} initializeWebView={initializeWebView} onMessage={handleMessage} />;
};

export default WebViewScreen;
