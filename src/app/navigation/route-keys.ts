// HomeStack 라우트 키 정의
export const HOME_STACK_ROUTES = {
  MAIN: 'HomeMain',
  DETAIL: 'HomeDetail',
} as const;

// AuthStack 라우트 키 정의
export const AUTH_ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
} as const;

// WebViewStack 라우트 키 정의
export const WEBVIEW_STACK_ROUTES = {
  MAIN: 'WebViewMain',
  BOOKMARKS: 'WebViewBookmarks',
} as const;

// 탭 네비게이터 키 정의
export const TAB_ROUTES = {
  HOME: 'HomeTab',
  WEBVIEW: 'WebViewTab',
} as const;

// 루트 스택 키 정의
export const ROOT_ROUTES = {
  MAIN: 'Main',
  AUTH: 'Auth',
  SPLASH: 'Splash',
} as const;

// 타입 추출 (객체의 값 타입을 추출)
export type HomeStackRouteKey = (typeof HOME_STACK_ROUTES)[keyof typeof HOME_STACK_ROUTES];
export type AuthStackRouteKey = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type WebViewStackRouteKey = (typeof WEBVIEW_STACK_ROUTES)[keyof typeof WEBVIEW_STACK_ROUTES];
export type TabRouteKey = (typeof TAB_ROUTES)[keyof typeof TAB_ROUTES];
export type RootRouteKey = (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES];

// 모든 라우트 키를 포함하는 타입
export type RouteKey = HomeStackRouteKey | AuthStackRouteKey | WebViewStackRouteKey | TabRouteKey | RootRouteKey;
