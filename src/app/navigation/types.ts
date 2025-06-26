import { ROUTES } from './routes';
import { RouteProp } from '@react-navigation/native';

// 간소화된 파라미터 타입 구조
export type RootStackParamList = {
  // 메인 네비게이터들
  [ROUTES.MAIN]: undefined;
  [ROUTES.TAB_NAVIGATOR]: undefined;

  // 개별 스크린들
  [ROUTES.HOME]: undefined;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.WEBVIEW]: { url: string } | undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.REGISTER]: undefined;
  [ROUTES.FORGOT_PASSWORD]: undefined;
  [ROUTES.SPLASH]: undefined;
  [ROUTES.HOME_SCREEN]: undefined;
  [ROUTES.WEBVIEW_SCREEN]: { url: string } | undefined;
  [ROUTES.FULLSCREEN_WEBVIEW]: { url: string };
  [ROUTES.MODAL_SCREEN]: undefined;
};

// 탭 네비게이터 타입 정의
export type TabParamList = {
  [ROUTES.TAB_HOME]: undefined;
  [ROUTES.TAB_RUN]: undefined;
  [ROUTES.TAB_PROFILE]: undefined;
};

// 화면별 route 타입 별칭
export type WebViewScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.WEBVIEW_SCREEN>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.HOME_SCREEN>;
export type SettingsScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.SETTINGS>;
export type LoginScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.LOGIN>;
