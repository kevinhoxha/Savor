// const path = require('path')

module.exports = function (api) {
  api.cache(true)

  // const envPath = path.resolve(__dirname, '../../', '.env')

  // require('dotenv').config({ path: envPath })

  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      'react-native-reanimated/plugin',
      'expo-router/babel',
      // ['inline-dotenv', { path: envPath }],
    ],
  }
}
