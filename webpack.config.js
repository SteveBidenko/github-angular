var webpack = require("webpack"),
    production = JSON.parse(process.env.PRODUCTION || false);

module.exports = {
    entry: {
        bundle: ['./site/app/app.js', './site/app/controllers.js', './site/app/factory-resources.js', './site/app/service-github.js']
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
