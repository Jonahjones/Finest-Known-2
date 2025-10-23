module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Exclude reanimated plugin to avoid worklets dependency
    ],
  };
};
