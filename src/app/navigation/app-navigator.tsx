import { useCallback, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { ROUTES } from './routes';

import { SettingScreen } from '@screens/setting/ui';
import { SplashScreen } from '@screens/splash/ui';
import { MainNavigator } from './main-navigator';

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
      <Stack.Screen name={ROUTES.MAIN} component={MainNavigator} />
      <Stack.Screen name={ROUTES.SETTINGS} component={SettingScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
};
