import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStackParamList } from './types';
import { ROUTES } from './routes';
import LoginScreen from '../../screens/auth/login/ui/login-screen';
import RegisterScreen from '../../screens/auth/register/ui/register-screen';
import ForgotPasswordScreen from '../../screens/auth/forgot-password/ui/forgot-password-screen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.AUTH.LOGIN} component={LoginScreen} options={{ title: '로그인' }} />
      <Stack.Screen name={ROUTES.AUTH.REGISTER} component={RegisterScreen} options={{ title: '회원가입' }} />
      <Stack.Screen
        name={ROUTES.AUTH.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{ title: '비밀번호 찾기' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
