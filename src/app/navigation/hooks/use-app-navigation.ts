import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ROUTES, RouteKey } from '../routes';

import { RootStackParamList, DrawerParamList } from '../types';

// 네비게이션 타입 정의 - Drawer와 Stack 모두 지원
export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList> & DrawerNavigationProp<DrawerParamList>;

export const useAppNavigation = () => {
  const navigation = useNavigation<AppNavigationProp>();

  const navigate = <T extends RouteKey>(
    screen: T,
    params?: T extends keyof RootStackParamList ? RootStackParamList[T] : never,
  ) => {
    navigation.navigate(screen as any, params as any);
  };

  return {
    navigation,

    // 화면 이동 함수들 - 명시적 타입으로 정의
    goToHome: () => navigate(ROUTES.HOME),
    goToSettings: () => navigate(ROUTES.SETTINGS),
    goToWebView: (url: string) => navigate(ROUTES.WEBVIEW, { url } as RootStackParamList[typeof ROUTES.WEBVIEW]),
    goToLogin: () => navigate(ROUTES.LOGIN),

    // 기타 화면 - 동적 이동 (타입 안전)
    goTo: <T extends RouteKey>(
      screenName: T,
      params?: T extends keyof RootStackParamList ? RootStackParamList[T] : never,
    ) => navigate(screenName, params),

    // Drawer 액션 및 네비게이션
    openDrawer: () => navigation.dispatch(DrawerActions.openDrawer()),
    closeDrawer: () => navigation.dispatch(DrawerActions.closeDrawer()),
    toggleDrawer: () => navigation.dispatch(DrawerActions.toggleDrawer()),

    goBack: () => navigation.canGoBack() && navigation.goBack(),
  };
};
