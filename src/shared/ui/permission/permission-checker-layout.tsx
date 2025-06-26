import { View } from 'react-native';

export const PermissionCheckerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="absolute bottom-0 w-full h-full flex items-center justify-end">
      <View className="w-full h-full bg-black opacity-80" />
      <View className="flex items-center w-full bg-stone-100 py-10 px-4 border-t border-gray-300">
        {children}
      </View>
    </View>
  );
};
