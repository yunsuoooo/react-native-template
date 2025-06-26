import { ViewProps } from 'react-native';
import { ReactNode } from 'react';

export interface ScreenLayoutProps extends ViewProps {
  children: ReactNode;
  withHeader?: boolean;
  withTabBar?: boolean;
  backgroundColor?: string;
  className?: string;
}
