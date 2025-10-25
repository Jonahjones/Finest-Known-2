const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable new architecture support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configure for new architecture
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = config;
