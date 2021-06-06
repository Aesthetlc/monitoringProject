module.exports = {
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/proxy': {
                target: 'http://8.140.186.178:8081',
                changeOrigin: true,
                pathRewrite: {
                    '/proxy': ''
                }
            },
            '/imgProxy': {
                target: 'http://8.140.185.142:9999',
                changeOrigin: true,
                pathRewrite: {
                    '/imgProxy': ''
                }
            }
        }
    }
};
