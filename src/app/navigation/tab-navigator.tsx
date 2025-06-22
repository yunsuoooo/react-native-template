import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './types';
import { ROUTES } from './routes';
import { HomeScreen } from '@screens/home/ui';
import { TabBar } from '@shared/ui/layout';

const Tab = createBottomTabNavigator<TabParamList>();

// 탭 스크린들을 위한 임시 컴포넌트들 (나중에 실제 스크린으로 교체)
const RunScreen = () => <HomeScreen />;
const ProfileScreen = () => <HomeScreen />;

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name={ROUTES.TAB_HOME} component={HomeScreen}/>
      <Tab.Screen name={ROUTES.TAB_PROFILE} component={ProfileScreen} />
      <Tab.Screen name={ROUTES.TAB_RUN} component={RunScreen} />
    </Tab.Navigator>
  );
}; 