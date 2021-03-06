var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var commonConfig = require('./common.config');
var commonLoaders = commonConfig.commonLoaders;
var assetsPath = commonConfig.output.assetsPath;
var publicPath = commonConfig.output.publicPath;

module.exports = {
  // The configuration for the client
  name: 'browser',
    /* The entry point of the bundle
     * Entry points for multi page app could be more complex
     * A good example of entry points would be:
     * entry: {
     *   pageA: "./pageA",
     *   pageB: "./pageB",
     *   pageC: "./pageC",
     *   adminPageA: "./adminPageA",
     *   adminPageB: "./adminPageB",
     *   adminPageC: "./adminPageC"
     * }
     *
     * We can then proceed to optimize what are the common chunks
     * plugins: [
     *  new CommonsChunkPlugin("admin-commons.js", ["adminPageA", "adminPageB"]),
     *  new CommonsChunkPlugin("common.js", ["pageA", "pageB", "admin-commons.js"], 2),
     *  new CommonsChunkPlugin("c-commons.js", ["pageC", "adminPageC"]);
     * ]
     */
    // SourceMap without column-mappings
    devtool: 'cheap-module-source-map',
  context: path.join(__dirname, '..', 'app'),
  entry: {
    app: ['babel-polyfill', './client']
  },
  output: {
    // The output directory as absolute path
    path: assetsPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: '[name].js',
      // The output path from the view of the Javascript
      publicPath: publicPath

  },
  module: {
    loaders: commonLoaders.concat(
      {
        test: /\.scss$/i,
        loader: ExtractTextPlugin.extract(['css','sass','import-glob'])
      }
    )
  },
  resolve: {
    root: [path.join(__dirname, '..', 'app')],
      extensions: ['', '.js', '.jsx', '.css']
  },
  plugins: [
    // extract inline css from modules into separate files
    new ExtractTextPlugin('/css/styles.css', { allChunks: true }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ],
}
