import { useCallback, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from './routes';
import { RootStackParamList } from './types';
import MainNavigator from './main-navigator';
import SplashScreen from '../../screens/splash/ui/splash-screen';
import SettingNavigator from './setting-navigator';

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
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.ROOT.MAIN} component={MainNavigator} />
      <Stack.Screen name={ROUTES.ROOT.SETTING} component={SettingNavigator} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
