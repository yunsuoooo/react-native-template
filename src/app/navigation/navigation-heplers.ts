import { NavigationProp } from '@react-navigation/native';
import type { NavigatorParamList } from './types';
import { HOME_STACK_ROUTES, WEBVIEW_STACK_ROUTES, TAB_ROUTES } from './route-keys';

// 중첩 네비게이션을 위한 타입 안전 함수
export const navigateToNestedScreen = <T extends keyof NavigatorParamList>(
  navigation: NavigationProp<NavigatorParamList>,
  screen: T,
  params?: NavigatorParamList[T],
) => {
  if (params) {
    navigation.navigate(screen as any, params as any);
  } else {
    navigation.navigate(screen as any);
  }
};

// 웹뷰 탭으로 탐색하는 타입 안전 함수
export const navigateToWebView = (navigation: NavigationProp<NavigatorParamList>, url: string) => {
  navigation.navigate(TAB_ROUTES.WEBVIEW, {
    screen: WEBVIEW_STACK_ROUTES.MAIN,
    params: { url },
  } as any);
};

// 홈 상세 화면으로 탐색하는 타입 안전 함수
export const navigateToHomeDetail = (navigation: NavigationProp<NavigatorParamList>, id: string) => {
  navigation.navigate(TAB_ROUTES.HOME, {
    screen: HOME_STACK_ROUTES.DETAIL,
    params: { id },
  } as any);
};
