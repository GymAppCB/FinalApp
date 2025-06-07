// client/craco.config.js
const CracoWorkboxPlugin = require('craco-workbox');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new CracoWorkboxPlugin({
          // This is the key part: we explicitly tell it where to find the source service worker
          // and what to name the output file. This overrides the default behavior of
          // looking for a workbox.config.js file.
          swSrc: './public/custom-service-worker.js',
          swDest: 'service-worker.js',
        }),
      ],
    },
  },
};