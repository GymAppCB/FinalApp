// client/craco.config.js
const { InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    plugins: {
      // We are REMOVING the default CRA service worker plugin...
      remove: ['GenerateSW'],
      // ...and ADDING our own custom one.
      add: [
        new InjectManifest({
          swSrc: path.join(__dirname, 'public', 'custom-service-worker.js'),
          swDest: 'service-worker.js',
        }),
      ],
    },
  },
};