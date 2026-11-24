// babel.config.js – konfiguracja kompilatora Babel
// Expo używa własnego presetu który obsługuje wszystkie transformacje
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
