const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: './heic-app.js',
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
    new HtmlWebpackPlugin({
      title: 'heic.app',
      base: '/',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        description:
          'Convert HEIC images to JPGs online fast via libheic in the browser. This site 100% browser-based with no download or upload required. Your photos are converted on your own computer.',
        keywords:
          'heic, jpg, jpeg, heic to jpg, heic conversion, libheic, libheic-js, serverless, netlify',
        'og:title': 'HEIC to JPG converter online',
        'twitter:title': 'Convert HEIC to JPG 100% in the browser via libheic',
        'twitter:description':
          'heic.app converts your HEIC images to JPGs. This is done without any server. Your images stay right on your computer.',
        copyright: `Copyright © ${new Date().getYear()} Rico Kahler`,
        author: 'Rico Kahler',
      },
      favicon: './favicon.ico',
    }),
  ],
};
