import { useCallback, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { ROUTES } from './routes';

// 스크린 임포트
import SettingScreen from '../../screens/setting/ui/setting-screen';
import SplashScreen from '../../screens/splash/ui/splash-screen';
import MainNavigator from './main-navigator';

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

export default AppNavigator;
