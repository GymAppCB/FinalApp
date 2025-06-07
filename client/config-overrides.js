// client/config-overrides.js
const { override, addWebpackPlugin } = require('customize-cra');
const { InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = override(
  addWebpackPlugin(
    new InjectManifest({
      swSrc: path.join(__dirname, 'public', 'custom-service-worker.js'),
      swDest: 'service-worker.js',
    })
  )
);