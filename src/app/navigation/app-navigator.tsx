import { useCallback, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { ROUTES } from './routes';

import { SettingScreen } from '@screens/setting/ui';
import { SplashScreen } from '@screens/splash/ui';
import { WebViewScreen } from '@screens/webview/ui';
import { TabNavigator } from './tab-navigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const initialized = true;
  const checkSession = useCallback(() => {}, []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      await checkSession();
      setIsLoading(false);
    };

    initApp();
  }, [checkSession]);

  if (!initialized || isLoading) {
    // 초기 로드 화면용 스플래시 스크린
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 탭 네비게이터 - Bottom Tab이 있는 메인 화면들 */}
      <Stack.Screen name={ROUTES.TAB_NAVIGATOR} component={TabNavigator} />
      
      {/* 전체화면 스크린들 - Bottom Tab 없음 */}
      <Stack.Screen 
        name={ROUTES.SETTINGS} 
        component={SettingScreen} 
        options={{ presentation: 'modal' }} 
      />
      <Stack.Screen 
        name={ROUTES.FULLSCREEN_WEBVIEW} 
        component={WebViewScreen} 
        options={{ 
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom' 
        }} 
      />
    </Stack.Navigator>
  );
};
