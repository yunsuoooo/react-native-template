import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import './global.css';

import { useDeepLinking } from '@/shared/hooks';
import Navigation from './navigation';

function App(): React.JSX.Element {
  useDeepLinking();

  return (
    <KeyboardProvider>
      <SafeAreaProvider className="flex-1">
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          // Android에서는 translucent를 true로 설정해야 StatusBar 아래로 콘텐츠가 표시됨
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
        )}

        <Navigation />
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}

export default App;
