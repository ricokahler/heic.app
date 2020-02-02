module.exports = {
  entry: {
    'heic-app': './src/index.js',
    'service-worker': './src/serviceWorker.js',
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
  plugins: [],
};
