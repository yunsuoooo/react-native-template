import React from 'react';
import { Text } from 'react-native';
import { ROUTES } from '../../../app/navigation/routes';

type TabBarIconProps = {
  route: string;
  color: string;
  size: number;
};

export const TabBarIcon: React.FC<TabBarIconProps> = ({ route, color, size }) => {
  // 실제 앱에서는 아이콘 라이브러리 사용 (예: react-native-vector-icons)
  // 여기서는 간단하게 텍스트로 대체
  let iconText = '';

  switch (route) {
    case ROUTES.TABS.HOME:
      iconText = '🏠';
      break;
    case ROUTES.TABS.WEBVIEW:
      iconText = '🌐';
      break;
    default:
      iconText = '📱';
  }

  return <Text style={{ color, fontSize: size }}>{iconText}</Text>;
};

export default TabBarIcon;
