const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = {
    target:  path.resolve(__dirname, 'build'),
    index:   path.resolve(__dirname, 'index.js'),
    example: path.resolve(__dirname, './components'),
    src:     path.resolve(__dirname, '../src'),
    html:    path.resolve(__dirname, 'index.html'),
};

module.exports = {
    entry: [
        `webpack-dev-server/client?http://localhost:${ process.env.PORT || 3000 }`,
        paths.index,
    ],
    output: {
        path:          paths.target,
        filename:      '[name].js',
        chunkFilename: '[name].js',
        publicPath:    `http://localhost:${ process.env.PORT || 3000 }/`,
    },
    module: {
        rules: [
            {
                test:    /\.js?$/,
                include: [
                    paths.index,
                    paths.example,
                    paths.src,
                ],
                use: {
                    loader:  'babel-loader',
                    options: {
                        presets: [
                            [
                                'env',
                                {
                                    targets: [ 'last 2 versions' ],
                                },
                            ],
                            'react',
                            'stage-0',
                        ],
                        plugins: [
                            'syntax-dynamic-import',
                            'transform-class-properties',
                        ],
                    },
                },
            },
        ],
    },
    resolve: {
        alias: {
            '@kobalt/react-component-chunk': paths.src,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: paths.html,
            injecft:  'body',
            filename: 'index.html',
        }),
    ],
};
