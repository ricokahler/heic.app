const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    'heic-app': './src/index.js',
  },
  output: {
    filename: './[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  node: {
    fs: 'empty',
  },
  plugins: [
    new WorkboxPlugin.GenerateSW({
      maximumFileSizeToCacheInBytes: 5 * 1000 * 1000,
    }),
  ],
};
