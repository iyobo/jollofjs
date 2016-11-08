// var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
// var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const _ = require('lodash');

let isProd = false;
_.each(process.argv,(arg)=>{
	if(arg === '--prod') {
		console.log('Setting to Production Mode');
		isProd = true;
	}
})

// const plugins = [
// 	new CommonsChunkPlugin("commons.chunk.js"),
//
// ];

//uglify in prod
if(isProd)
	plugins.push(new webpack.optimize.UglifyJsPlugin());


module.exports = {
	entry: {
		admin: "./lib/admin/client/adminApp.jsx",
	},
	output: {
		path: "./static/",
		filename: "[name].bundle.js"
	},
	// plugins: plugins,
	module: {
		loaders: [
			{test: /\.html/, loader: "html-loader"},
			{test: /\.css$/, loader: "style-loader!css-loader"},
			{
				test: /\.jsx?$/,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					presets: [ 'es2015', 'stage-0','react' ],
					plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
				}
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
};