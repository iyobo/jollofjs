// var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
 var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin")
const _ = require('lodash');

let isProd = process.env.NODE_ENV === 'production';
_.each(process.argv, (arg) => {
	if (arg === '--prod') {
		console.log('Setting to Production Mode');
		isProd = true;
	}
})

const plugins = [];

//uglify in prod
if (isProd) {
	plugins.push(new webpack.optimize.UglifyJsPlugin());
}
plugins.push(new CommonsChunkPlugin("commons.chunk.js"));

plugins.push(function() {
    this.plugin('watch-run', function(watching, callback) {
        console.log('>>' + new Date());
        callback();
    })
});


module.exports = {
	entry: {
		//Old react app using admin-on-rest.
		//admin: "./lib/admin/oldRarClient/adminApp.jsx",

		//Brand new Admin app. Custom-built from start to finish with the beautiful Vue.js
		//admin: "./lib/admin/vueClient/adminApp.js",

		/**
		 * But you know what? Better start getting very comfortable with react because
		 * of react-native and future employability reasons.
		 */
		admin: "./lib/admin/rClient/adminApp.jsx"
	},
    //context: path.join(__dirname, 'lib/admin'),
    output: {
		path: "./jollofstatic/bundles/",
		filename: "[name].bundle.js"
	},
	devtool: "source-map",
    plugins,
	module: {
		loaders: [
			{ test: /\.html/, loader: "html-loader" },
			//{ test: /\.vue/, loader: "html-loader" },

			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{
				test: /\.js|jsx?$/,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					presets: [['es2015'], ['stage-2'], ['react']],
					plugins: ['transform-decorators-legacy', 'react-html-attrs', 'transform-class-properties']
				}
			},
			//{
			//	test: /\.vue$/,
			//	loader: 'vue-loader',
			//	options: {
			//		loaders: {
			//			// extract all <docs> content as raw text
			//			'docs': ExtractTextPlugin.extract('raw-loader')
			//		}
			//	}
			//},
            {
                test: require.resolve('tinymce/tinymce'),
                loaders: [
                    'imports?this=>window',
                    'exports?window.tinymce'
                ]
            },
            {
                test: /tinymce\/(themes|plugins)\//,
                loaders: [
                    'imports?this=>window'
                ]
            }
        ]
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.vue'],
		alias: {
			vue: 'vue/dist/vue.js',
            react: path.join(__dirname, 'node_modules', 'react')
		}
	}
};