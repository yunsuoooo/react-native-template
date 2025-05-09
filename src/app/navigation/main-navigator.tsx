import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList, WebViewStackParamList } from './types';
import { HOME_STACK_ROUTES, WEBVIEW_STACK_ROUTES } from './route-keys';
import { ROUTES } from './routes';
import Header from '../../shared/ui/layout/header';
import HomeScreen from '../../screens/home/ui/home-screen';
import WebViewScreen from '../../screens/web-view/ui/web-view-screen';
import CustomDrawerContent from '../../shared/ui/navigation/custom-drawer-content';

// 스택 네비게이터 정의
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const WebViewStack = createNativeStackNavigator<WebViewStackParamList>();

// 홈 스택 네비게이터
const HomeNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      header: () => {
        return <Header />;
      },
    }}
  >
    <HomeStack.Screen name={HOME_STACK_ROUTES.MAIN} component={HomeScreen} />
  </HomeStack.Navigator>
);

// 웹뷰 스택 네비게이터
const WebViewNavigator = () => {
  return (
    <WebViewStack.Navigator
      screenOptions={{
        header: () => {
          return <Header />;
        },
      }}
    >
      <WebViewStack.Screen
        name={WEBVIEW_STACK_ROUTES.MAIN}
        component={WebViewScreen}
        initialParams={{ url: 'https://chatgpt.com' }}
      />
    </WebViewStack.Navigator>
  );
};

// 메인 드로어 네비게이터
const Drawer = createDrawerNavigator();

export const MainNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        swipeEnabled: true, // 드로어 스와이프 가능
        drawerType: 'slide', // iOS/Android 모두 slide 방식
        drawerStyle: { width: '85%' }, // 드로어 폭
      }}
      drawerContent={CustomDrawerContent}
    >
      <Drawer.Screen name={ROUTES.DRAWER.HOME} component={HomeNavigator} />
      <Drawer.Screen name={ROUTES.DRAWER.WEBVIEW} component={WebViewNavigator} />
    </Drawer.Navigator>
  );
};

export default MainNavigator;
