import router from './router/index.js';

// 全局前置守卫
router.beforeEach(function(to, from, next) {
    // to:即将进入的路由
    // from:正要离开的路由
    // next：一定要调用该方法来 resolve 这个钩子。执行效果依赖 `next` 方法的调用参数
    if (to.path.startsWith('/home')) {
        // 如果是'/home'==>继续判断token是否存在
        let token = window.sessionStorage.getItem('ms_username');
        token ? next() : next('/login');
    } else {
        // 不是'/home'就是'/login'
        // 因为一级路由只有'/home','/login'所以放行
        next();
    }
});
router.afterEach(() => {});
export default router;
