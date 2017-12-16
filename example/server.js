const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config');

const server = new WebpackDevServer(webpack(config), {
    inline: true,
});

server.listen(process.env.PORT || 3000, 'localhost', () => {
    console.info(`Devserver ready at http://localhost:${ process.env.PORT || 3000 }/`);
});
