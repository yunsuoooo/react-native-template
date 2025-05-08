import { View, Text } from 'react-native';

import { RouteProp, useRoute } from '@react-navigation/native';
import { WebViewStackParamList } from '../../../app/navigation/types';
import { WEBVIEW_STACK_ROUTES } from '../../../app/navigation/route-keys';

type WebViewScreenRouteProp = RouteProp<WebViewStackParamList, typeof WEBVIEW_STACK_ROUTES.MAIN>;

export const WebViewScreen = () => {
  const route = useRoute<WebViewScreenRouteProp>();

  const { url } = route.params;
  return (
    <View>
      <Text>웹뷰: {url}</Text>
    </View>
  );
};

export default WebViewScreen;
