module.exports = {
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/proxy':{
                target:'http://8.141.53.8:8081',
                changeOrigin:true,
                pathRewrite:{
                    '/proxy':''
                }
            }
        }
    }
}