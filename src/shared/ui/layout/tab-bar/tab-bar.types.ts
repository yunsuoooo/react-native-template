import { FeatherIconName } from '@shared/ui/icon/icon.types';

export interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export interface TabConfig {
  name: string;
  icon: FeatherIconName;
  label: string;
} 
