const webpack = require('webpack'),
			path = require('path'),
			env = require('yargs').argv.env,
			pkg = require('./package.json'),
			autoprefixer = require('autoprefixer'),
			svgo = require('svgo-loader'),
			TerserPlugin = require('terser-webpack-plugin'),
			MiniCssExtractPlugin = require('mini-css-extract-plugin'),
			OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
let mode, outputJS, fileName = 'exploratory-map';

if (env === 'build') {
	mode = 'production';
	outputJS = fileName + '.min.js';
} else {
	mode = 'development';
	outputJS = fileName + '.js';
}

const config = {
	mode: mode,
	entry: [__dirname + '/asset/src/exploratory-map.js'],
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname + '/asset/'),
		filename: outputJS,
		library: 'ExploratoryMap',
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/
			},
			{
				test: /(\.jsx|\.js)$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			},
			{
				test: /(\.scss|\.sass)$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.svg/,
				use: [
					{
						loader: 'svg-url-loader'
					}
				]
			}
		]
	},
	resolve: {
		modules: [path.resolve('./node_modules'), path.resolve('./src')],
		extensions: ['.json', '.js']
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: env === 'build' ? fileName + '.min.css' : fileName + '.css',
			chunkFilename: '[id].css'
		})
	],
	optimization: {
		minimize: true,
		minimizer: [
			new OptimizeCSSAssetsPlugin({}),
			new TerserPlugin()
		]
	}
};

module.exports = config;