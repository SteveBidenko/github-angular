var webpack = require("webpack"),
    production = JSON.parse(process.env.PRODUCTION || false);

module.exports = {
    entry: {
        bundle: ['./app/app.js', './app/controllers.js', './app/factory-resources.js', './app/service-github.js']
    },
    devtool: production ? '' : 'source-map',
    output: {
        path: 'site/js',
        filename: production ? 'bundle.min.js' : 'bundle.js'
    },
    plugins: production ? [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ] : []
};
