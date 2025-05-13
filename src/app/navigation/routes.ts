// 단순화된 라우트 키 구조
export const ROUTES = {
  // 메인 화면들
  HOME: 'Home',
  SETTINGS: 'Settings',
  WEBVIEW: 'WebView',
  MAIN: 'Main',

  // 인증 관련 화면들
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',

  // 특수 화면
  SPLASH: 'Splash',
} as const;

// 타입 정의 - 더 간단한 접근 방식
export type RouteKey = (typeof ROUTES)[keyof typeof ROUTES];
