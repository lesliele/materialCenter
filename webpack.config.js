const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');


const config = {
    target: 'web',
    entry: {
        bundle: path.join(__dirname, 'client/main.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader','css-loader']
            },
            {
                test: /\.less$/,
                use: [
                    process.env.NODE_ENV !== 'production' ?
                    'vue-style-loader' :
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    process.env.NODE_ENV !== 'production'
                    ? 'vue-style-loader'
                    : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    'stylus-loader'
                ]
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name]-test.[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new CleanWebpackPlugin()
    ],
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            '@': path.join(__dirname, 'src')
        }
    },
    optimization: {
        minimize: false,
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /node_modules/,
					chunks: "initial",
					name: "vendor",
					priority: 10,
					enforce: true
				}
            }
        },
        runtimeChunk: true
	},
}
if (isDev) {
    config.devtool = '#cheap-module-eval-source-map';
    config.devServer = {
        port: 8088,
        // 方便内网的调试
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        hot: true
    };
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else {
    // 开发环境使用hash(不能使用chunkhash,会报错),线上环境使用chunkhash
    config.output.filename = '[name].[chunkhash:8].js';
    config.plugins.push(new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css'
    }))
}

module.exports = config;