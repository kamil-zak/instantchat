const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const { HotModuleReplacementPlugin, DefinePlugin } = require('webpack')

const isProd = process.env.NODE_ENV !== 'development'

const graphqlUrl = process.env.GRAPHQL_URL || 'http://localhost:3434/graphql'
const wsUrl = process.env.WS_URL || 'ws://localhost:3434/graphql'

const config = {
    mode: isProd ? 'production' : 'development',
    entry: {
        client: ['./src/resources/client/client.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public'),
        assetModuleFilename: 'assets/[hash][ext][query]',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|eot|woff)$/i,
                type: 'asset',
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false,
                },
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        targets: 'last 1 chrome version',
                    },
                },
            },
        ],
    },
    plugins: [
        new DefinePlugin({
            'process.env.GRAPHQL_URL': `"${graphqlUrl}"`,
            'process.env.WS_URL': `"${wsUrl}"`,
        }),
    ],
}

if (!isProd) {
    config.devtool = 'inline-source-map'
    config.entry.client.push('webpack-hot-middleware/client')
    config.plugins.push(new HotModuleReplacementPlugin())
}

module.exports = config
