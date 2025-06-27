import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Icon } from '@shared/ui/icon';
import { ROUTES } from '@/app/navigation/routes';

export interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const TabBar = ({ state, navigation }: TabBarProps) => {
  const isRunScreen = state.routes[state.index].name === ROUTES.TAB_RUN;

  const leftMenuBottomPosition = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.timing(leftMenuBottomPosition, {
      toValue: isRunScreen ? -100 : 24,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // bottom 속성은 layout 관련이므로 false
    }).start();
  }, [isRunScreen, leftMenuBottomPosition]);

  return (
    <Animated.View
      className="absolute left-0 right-0"
      style={[{ bottom: leftMenuBottomPosition }]}
    >
      <View className="relative">
        <View
          className="absolute left-6 bottom-0"
        >
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

        <View className="absolute right-6 bottom-0">
          <TouchableOpacity
            className="bg-black rounded-full"
            onPress={() => navigation.navigate(ROUTES.TAB_RUN)}
            activeOpacity={0.7}
          >
            <View className="w-24 h-24 items-center justify-center">
              <Text className="text-white text-2xl font-bold">RUN</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};
