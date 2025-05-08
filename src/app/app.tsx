import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

import Navigation from './navigation';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider className="w-full">
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
