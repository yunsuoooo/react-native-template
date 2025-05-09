import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainDrawerParamList } from '../../../app/navigation/types';
import { Icon } from '../icon';

const Header = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainDrawerParamList>>();
  const insets = useSafeAreaInsets();

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="w-full h-auto flex-row items-center justify-between px-4 py-3 bg-white shadow-sm"
    >
      <View className="flex-row w-full py-2 justify-between items-center">
        <TouchableOpacity onPress={handleOpenDrawer}>
          <Icon name="menu" size={24} className="text-zinc-600" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomeDrawer')}>
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
