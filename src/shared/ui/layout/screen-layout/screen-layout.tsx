import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenLayoutProps } from './screen-layout.types';

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ 
  children, 
  withHeader = true,
  withTabBar = true,
  backgroundColor = 'bg-white',
  className = '',
  ...props 
}) => {
  const insets = useSafeAreaInsets();

  
  return (
    <View 
      className={`flex-1 ${backgroundColor} ${className}`}
      style={{
        paddingTop: insets.top,
        ...(props.style as any),
      }}
      {...props}
    >
      {children}
    </View>
  );
}; 