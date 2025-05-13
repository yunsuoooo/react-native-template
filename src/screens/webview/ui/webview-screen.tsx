import { useWebViewParams } from '@app/navigation/hooks/use-screen-params';
import { WebViewLayout } from '@shared/ui/webview';

export const WebViewScreen = () => {
  const { url } = useWebViewParams();

  return <WebViewLayout url={url} />;
};

export default WebViewScreen;
