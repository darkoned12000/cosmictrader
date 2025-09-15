// Webpack configuration for Cosmic Trader
// This is an example of how to bundle ES6 modules for production

const path = require('path');

module.exports = {
  // Entry point - your main module
  entry: './core/main.js',

  // Output configuration
  output: {
    filename: 'cosmic-trader.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean dist folder before build
  },

  // Module resolution
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(mp3|wav)$/,
        type: 'asset/resource',
        generator: {
          filename: 'audio/[name][ext]'
        }
      }
    ]
  },

  // Development server
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
    open: true
  },

  // Optimization
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  // Source maps for debugging
  devtool: 'source-map',

  // Mode
  mode: 'development', // Change to 'production' for minified build
};