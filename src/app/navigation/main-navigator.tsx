import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import { RootStackParamList, DrawerParamList } from './types';
import Header from '../../shared/ui/layout/header';
import HomeScreen from '../../screens/home/ui/home-screen';
import WebViewScreen from '../../screens/web-view/ui/web-view-screen';
import CustomDrawerContent from '../../shared/ui/navigation/custom-drawer-content';

// 홈 스택 네비게이터
const HomeStack = createNativeStackNavigator<RootStackParamList>();
const HomeNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      header: () => <Header />,
    }}
  >
    <HomeStack.Screen name={ROUTES.HOME} component={HomeScreen} />
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
        name={ROUTES.WEBVIEW}
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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name={ROUTES.HOME} component={HomeNavigator} />
      <Drawer.Screen name={ROUTES.WEBVIEW} component={WebViewNavigator} />
    </Drawer.Navigator>
  );
};

export default MainNavigator;
