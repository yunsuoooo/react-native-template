import { HOME_STACK_ROUTES, AUTH_ROUTES, WEBVIEW_STACK_ROUTES, TAB_ROUTES, ROOT_ROUTES } from './route-keys';

// 홈 스택 파라미터 타입
export type HomeStackParamList = {
  [HOME_STACK_ROUTES.MAIN]: undefined;
  [HOME_STACK_ROUTES.DETAIL]?: { id: string };
};

// 인증 스택 파라미터 타입
export type AuthStackParamList = {
  [AUTH_ROUTES.LOGIN]: undefined;
  [AUTH_ROUTES.REGISTER]: undefined;
  [AUTH_ROUTES.FORGOT_PASSWORD]: undefined;
};

// 웹뷰 스택 파라미터 타입
export type WebViewStackParamList = {
  [WEBVIEW_STACK_ROUTES.MAIN]: { url: string };
};

// 탭 네비게이터 파라미터 타입
export type MainTabParamList = {
  [TAB_ROUTES.HOME]: undefined;
  [TAB_ROUTES.WEBVIEW]: { url: string };
};

// 루트 스택 파라미터 타입
export type RootStackParamList = {
  [ROOT_ROUTES.MAIN]: undefined;
  [ROOT_ROUTES.AUTH]: undefined;
  [ROOT_ROUTES.SPLASH]?: undefined;
};

// 중첩 네비게이션을 위한 통합 파라미터 타입
export type NavigatorParamList = RootStackParamList & {
  [TAB_ROUTES.HOME]: undefined;
  [TAB_ROUTES.WEBVIEW]: undefined;
} & HomeStackParamList &
  WebViewStackParamList;
