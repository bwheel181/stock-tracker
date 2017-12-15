const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: './src/App.jsx',
    vendor: ['react', 'react-dom', 'whatwg-fetch', 'react-router-dom', 'react-bootstrap', 'react-router-bootstrap'],
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'app.bundle.js',
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    host: '0.0.0.0',
    port: 8081,
    public: 'stock-lister-bjw181.c9users.io',
    contentBase: 'static',
    proxy: {
      '/api': {
        target: {
          host: '0.0.0.0',
          port: 8080,
          public: 'stock-lister-bjw181.c9users.io',
        },
      },
      '/login': {
        target: {
          host: '0.0.0.0',
          port: 8080,
          public: 'stock-lister-bjw181.c9users.io',
        }
      },
      '/signup': {
        target: {
          host: '0.0.0.0',
          port: 8080,
          public: 'stock-lister-bjw181.c9users.io',
        }
      }
    },
    historyApiFallback: true,
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: { presets: ['react', 'es2015'] },

      },
    ],
  },
}
