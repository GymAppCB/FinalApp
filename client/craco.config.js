// client/craco.config.js
const CracoWorkboxPlugin = require('craco-workbox'); // Corrected package name

module.exports = {
  plugins: [
    {
      plugin: CracoWorkboxPlugin,
      // No options are needed for the default behavior,
      // it will automatically find your custom-service-worker.js
    },
  ],
};