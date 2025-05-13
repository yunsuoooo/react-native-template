import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import { RootStackParamList, DrawerParamList } from './types';
import { Header } from '@shared/ui/layout';
import { MainDrawerContent } from '@shared/ui/navigation';
import { HomeScreen } from '@screens/home/ui';
import { WebViewScreen } from '@screens/webview/ui';

// 홈 스택 네비게이터
const HomeStack = createNativeStackNavigator<RootStackParamList>();
const HomeNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      header: () => <Header />,
    }}
  >
    <HomeStack.Screen name={ROUTES.HOME_SCREEN} component={HomeScreen} />
  </HomeStack.Navigator>
);

// 웹뷰 스택 네비게이터
const WebViewStack = createNativeStackNavigator<RootStackParamList>();
const WebViewNavigator = () => {
  return (
    <WebViewStack.Navigator
      screenOptions={{
        header: () => <Header />,
      }}
    >
      <WebViewStack.Screen
        name={ROUTES.WEBVIEW_SCREEN}
        component={WebViewScreen}
        initialParams={{ url: 'https://chatgpt.com' }}
      />
    </WebViewStack.Navigator>
  );
};

// 메인 드로어 네비게이터
const Drawer = createDrawerNavigator<DrawerParamList>();

export const MainNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        swipeEnabled: true, // 드로어 스와이프 가능
        drawerType: 'slide', // iOS/Android 모두 slide 방식
        drawerStyle: { width: '85%' }, // 드로어 폭
      }}
      drawerContent={(props) => <MainDrawerContent {...props} />}
    >
      <Drawer.Screen name={ROUTES.HOME} component={HomeNavigator} />
      <Drawer.Screen name={ROUTES.WEBVIEW} component={WebViewNavigator} />
    </Drawer.Navigator>
  );
};
