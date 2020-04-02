const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env;
const pkg = require('./package.json');
const autoprefixer = require('autoprefixer');
const svgo = require('svgo-loader');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
let mode, outputJS, outputCSS;
let fileName = 'exploratory-map-public';

if (env === 'build') {
	mode = 'production';
	outputJS = fileName + '.min.js';
	outputCSS = fileName + '.min.css';
} else {
	mode = 'development';
	outputJS = fileName + '.js';
	outputCSS = fileName + '.css';
}

const config = {
	mode: mode,
	entry: [__dirname + '/asset/src/exploratory-map-public.js'],
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
			filename: outputCSS,
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