import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingStackParamList } from './types';
import { SETTING_STACK_ROUTES } from './route-keys';
import SettingScreen from '../../screens/setting/ui/setting-screen';

const SettingStack = createNativeStackNavigator<SettingStackParamList>();

const SettingNavigator = () => {
  return (
    <SettingStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingStack.Screen name={SETTING_STACK_ROUTES.MAIN} component={SettingScreen} />
    </SettingStack.Navigator>
  );
};

export default SettingNavigator;
