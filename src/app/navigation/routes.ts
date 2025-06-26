// 단순화된 라우트 키 구조
export const ROUTES = {
  // 메인 화면들
  HOME: 'Home',
  SETTINGS: 'Settings',
  WEBVIEW: 'WebView',
  MAIN: 'Main',

  // 탭 네비게이터 (Bottom Tab이 필요한 스크린들)
  TAB_NAVIGATOR: 'TabNavigator',
  TAB_RUN: 'TabRun',
  TAB_HOME: 'TabHome',
  TAB_PROFILE: 'TabProfile',

  // 인증 관련 화면들
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',

  // 특수 화면 (Bottom Tab 없음)
  SPLASH: 'Splash',
  FULLSCREEN_WEBVIEW: 'FullscreenWebView',
  MODAL_SCREEN: 'ModalScreen',

  // 네비게이터 전용 라우트
  HOME_SCREEN: 'HomeScreen',
  WEBVIEW_SCREEN: 'WebViewScreen',
} as const;

// 타입 정의 - 더 간단한 접근 방식
export type RouteKey = (typeof ROUTES)[keyof typeof ROUTES];
