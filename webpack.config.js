const fs = require('fs');
const path = require('path');
const webpack = require('atool-build/lib/webpack');


/*eslint func-names: ["error", "never"]*/
module.exports = function (wpConfig, env) {
  const webpackConfig = wpConfig;

  webpackConfig.babel.presets = [
    require.resolve('babel-preset-es2016'),
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-stage-0'),
  ]

  webpackConfig.babel.plugins.push('transform-runtime');

  // Support hmr
 /* if (env === 'development') {
    webpackConfig.devtool = '#source-map';
    webpackConfig.babel.plugins.push('dva-hmr');
  } else {
    webpackConfig.babel.plugins.push('dev-expression');
  }*/
  if (env === 'development') {
    webpackConfig.devtool = '#eval';
    webpackConfig.babel.plugins.push(['dva-hmr', {
      entries: [
        './src/index.js',
      ],
    }]);
  } else {
    webpackConfig.babel.plugins.push('dev-expression');
  }
  // Support CSS Modules
  // Parse all less files as css module.
  webpackConfig.module.loaders.forEach((loader, index) => {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.test = /\.dont\.exist\.file/;
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.test = /\.less$/;
    }
  });

  /* ---custom --- */

  // 添加plugin,抽离commn和vendor
  // webpackConfig.plugins.shift();
  // webpackConfig.plugins.unshift(
  //   new webpack.optimize.CommonsChunkPlugin('common')
  // );

  // chunk 该名
  webpackConfig.output.chunkFilename = '[name].aoao-chunk.js';
  webpackConfig.output = Object.assign({}, webpackConfig.output, {
    publicPath: '/',
  });

  return webpackConfig;
};
