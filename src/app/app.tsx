import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider className="w-full">
      <View className="p-20">
        <Text className="text-blue-500 text-center">Hello Wolrd!</Text>
      </View>
    </SafeAreaProvider>
  );
}

export default App;
