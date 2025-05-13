import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../icon';
import { useAppNavigation } from '../../../app/navigation/hooks/use-app-navigation';

const Header = () => {
  const { goToHome, openDrawer } = useAppNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="w-full h-auto flex-row items-center justify-between px-4 py-3 bg-white shadow-sm"
    >
      <View className="flex-row w-full py-2 justify-between items-center">
        <TouchableOpacity onPress={openDrawer}>
          <Icon name="menu" size={24} className="text-zinc-600" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToHome}>
          <Text>home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Icon name="edit" size={20} className="text-zinc-600" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
