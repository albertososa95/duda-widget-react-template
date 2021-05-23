class DudaConfig {

    /**
     * Transforms default CRA Webpack config to disable code splitting and bundles JS and CSS files in a single JS file.
     * @param config
     * @returns {*}
     */
    static transformWebpack(config) {
        DudaConfig._transformOutput(config.output);
        DudaConfig._transformOptimization(config.optimization);
        DudaConfig._transformRules(config.module.rules[1]);

        return config
    }

    static _transformOutput(output) {
        const pkg = require('./package.json');

        output.filename = 'static/js/duda-widget.js';
        output.library = pkg.name;
        output.libraryTarget = 'umd';
    }

    static _transformOptimization(optimization) {
        optimization.runtimeChunk = false;
        optimization.splitChunks = {
            cacheGroups: {
                default: false,
            },
        };
    }

    static _transformRules(rules) {
        const styleLoader = require.resolve('style-loader');
        const styleFiles = ['scss', 'sass', 'css'];

        rules.oneOf.forEach(loader => {
            const loaderIsForStyles =
                loader.use &&
                loader.test &&
                styleFiles.some(fileType => loader.test.toString().includes(fileType));

            if (!loaderIsForStyles) {
                return;
            }

            loader.use = [{loader: styleLoader}, ...loader.use].filter(subLoader => {
                if (!subLoader.loader) {
                    return true;
                }
                return !(
                    subLoader.loader.includes('mini-css') ||
                    subLoader.loader.includes('postcss')
                );
            });
        })
    }
}

module.exports = DudaConfig;
