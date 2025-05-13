import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from './routes';
import { RootStackParamList } from './types';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '../../screens/auth/ui';

// 인증 스택 전용 파라미터 타입
export type AuthStackParamList = Pick<
  RootStackParamList,
  typeof ROUTES.LOGIN | typeof ROUTES.REGISTER | typeof ROUTES.FORGOT_PASSWORD
>;

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} options={{ title: '로그인' }} />
      <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} options={{ title: '회원가입' }} />
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{ title: '비밀번호 찾기' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
