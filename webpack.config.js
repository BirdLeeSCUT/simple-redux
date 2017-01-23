var webpack = require('webpack');

module.exports = {
	entry: './src/simple-redux.js',
	output: {
		path: __dirname + '/dist',
		filename: 'simple-redux.js'
	},
	module: {
		loaders: [
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader'
			}
		]
	}
}