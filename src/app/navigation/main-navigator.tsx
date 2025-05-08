import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { MainTabParamList, HomeStackParamList, WebViewStackParamList } from './types';
import { HOME_STACK_ROUTES, WEBVIEW_STACK_ROUTES, TAB_ROUTES } from './route-keys';
import HomeScreen from '../../screens/home/ui/home-screen';
import WebViewScreen from '../../screens/web-view/ui/web-view-screen';
import TabBarIcon from '../../shared/ui/navigation/tab-bar-icon';

// 스택 네비게이터 정의
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const WebViewStack = createNativeStackNavigator<WebViewStackParamList>();

// 홈 스택 네비게이터
const HomeNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name={HOME_STACK_ROUTES.MAIN} component={HomeScreen} options={{ headerShown: false }} />
  </HomeStack.Navigator>
);

// 웹뷰 스택 네비게이터
const WebViewNavigator = () => {
  const route = useRoute();
  const params = (route.params as { url?: string }) || {};

  return (
    <WebViewStack.Navigator>
      <WebViewStack.Screen
        name={WEBVIEW_STACK_ROUTES.MAIN}
        component={WebViewScreen}
        options={{ headerShown: false }}
        initialParams={params}
      />
    </WebViewStack.Navigator>
  );
};

// 메인 탭 네비게이터
const Tab = createBottomTabNavigator<MainTabParamList>();

// TabBarIcon renderer function outside of component
const getTabBarIcon = (route: string, color: string, size: number) => (
  <TabBarIcon route={route} color={color} size={size} />
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, size),
      })}
    >
      <Tab.Screen
        name={TAB_ROUTES.HOME}
        component={HomeNavigator}
        options={{
          title: '홈',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.WEBVIEW}
        component={WebViewNavigator}
        options={{
          title: '웹 콘텐츠',
          headerShown: false,
        }}
        initialParams={{ url: 'https://chatgpt.com' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
