import { ROUTES } from './routes';
import { RouteProp } from '@react-navigation/native';

// 간소화된 파라미터 타입 구조
export type RootStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.WEBVIEW]: { url: string } | undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.REGISTER]: undefined;
  [ROUTES.FORGOT_PASSWORD]: undefined;
  [ROUTES.SPLASH]: undefined;
  [ROUTES.MAIN]: undefined;
  [ROUTES.HOME_SCREEN]: undefined;
  [ROUTES.WEBVIEW_SCREEN]: { url: string } | undefined;
};

// Drawer 네비게이션 타입 추가
export type DrawerParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.WEBVIEW]: undefined;
};

// 화면별 route 타입 별칭
export type WebViewScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.WEBVIEW_SCREEN>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.HOME_SCREEN>;
export type SettingsScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.SETTINGS>;
export type LoginScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.LOGIN>;
