import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AppNavigator } from './app-navigator';

export const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
