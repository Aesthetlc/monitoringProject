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
            },
            '/customer/websocket/':{
                target:'ws://8.141.53.8:8081',
                ws:true,
                secure:false,
            }
        }
    }
}