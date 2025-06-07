// client/craco.config.js
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Only add the Workbox plugin in production builds
      if (env === 'production') {
        // Find the existing GenerateSW plugin added by Create React App
        const generateSwPlugin = webpackConfig.plugins.find(
          (plugin) => plugin.constructor.name === 'GenerateSW'
        );

        // If the default plugin exists, replace it with our custom InjectManifest
        if (generateSwPlugin) {
          webpackConfig.plugins.splice(
            webpackConfig.plugins.indexOf(generateSwPlugin),
            1,
            new WorkboxWebpackPlugin.InjectManifest({
              swSrc: path.resolve(__dirname, 'public', 'custom-service-worker.js'),
              swDest: 'service-worker.js',
            })
          );
        }
      }

      return webpackConfig;
    },
  },
};