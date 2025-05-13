import { useRoute } from '@react-navigation/native';
import { WebViewScreenRouteProp } from '../types';

// WebView 화면 파라미터 훅
export const useWebViewParams = () => {
  const route = useRoute<WebViewScreenRouteProp>();
  return {
    url: route.params?.url || '',
  };
};
