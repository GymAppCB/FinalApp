// client/craco.config.js

// THE FIX: The plugin is the default export, not a named export.
const CracoWorkboxPlugin = require('craco-workbox');

module.exports = {
  // The webpack configuration is not needed for the default setup.
  // The plugins array at the top level is the correct structure for craco.
  plugins: [
    {
      plugin: CracoWorkboxPlugin,
      // We don't need to pass options if we are using the default file names:
      // swSrc: 'src/custom-service-worker.js' (or public/)
      // swDest: 'service-worker.js'
      // craco-workbox is smart enough to find these.
    },
  ],
};