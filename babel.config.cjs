module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './src',
          '@app': './src/app',
          '@screens': './src/screens',
          '@shared': './src/shared',
        },
      },
    ],
  ],
};
