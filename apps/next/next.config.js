const { withExpo } = require('@expo/next-adapter')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reanimated (and thus, Moti) doesn't work with strict mode currently...
  // https://github.com/nandorojo/moti/issues/224
  // https://github.com/necolas/react-native-web/pull/2330
  // https://github.com/nandorojo/moti/issues/224
  // once that gets fixed, set this back to true
  reactStrictMode: false,
  transpilePackages: [
    'react-native',
    'react-native-web',
    '@react-native-picker/picker',
    'react-native-picker-select',
    'react-native-image-picker',
    'solito',
    'dripsy',
    '@dripsy/core',
    'moti',
    'app',
    'react-native-reanimated',
    'react-native-heroicons',
    'react-native-elements',
    '@expo/html-elements',
    'react-native-svg',
    'react-native-gesture-handler',
  ],
  images: {}
}

module.exports = withExpo(nextConfig)
