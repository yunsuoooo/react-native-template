import React from 'react';
import { View,Text, TouchableOpacity } from 'react-native';
import { Icon } from '@shared/ui/icon';
import { ROUTES } from '@/app/navigation/routes';

export interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const TabBar: React.FC<TabBarProps> = ({ state, navigation }) => {
  return (
    <>
      <View className="absolute bottom-6 left-6">
        <View className="flex-row gap-4 p-3 bg-black rounded-full w-min">
          {state.routes.slice(0, -1).map((route: any, index: number) => {
            const iconName = route.name === 'TabHome' ? 'shapes' : 'user';
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={index}
                className={`items-center justify-center p-2 rounded-full ${
                  isFocused ? 'bg-white' : 'bg-stone-700'
                }`}
                onPress={onPress}
                activeOpacity={0.7}
              >
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center"
                >
                  <Icon 
                    name={iconName} 
                    size={24} 
                    className={isFocused ? 'text-stone-700' : 'text-white'}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className='bg-black rounded-full'
          onPress={() => navigation.navigate(ROUTES.TAB_RUN)}
          activeOpacity={0.7}
        >
          <View className="w-24 h-24 items-center justify-center">
            <Text className='text-white text-2xl font-bold'>RUN</Text>
          </View>
        </TouchableOpacity>     
      </View>
    </>
  );
}; 