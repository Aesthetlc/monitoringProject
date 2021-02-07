import router from './router/index.js';
import Cookies from 'js-cookie';

const whiteList = ['/login']; // no redirect whitelist
// 全局前置守卫
router.beforeEach(function(to, from, next) {
    // to:即将进入的路由
    // from:正要离开的路由
    // next：一定要调用该方法来 resolve 这个钩子。执行效果依赖 `next` 方法的调用参数

    let hasToken = Cookies.get('token');
    if (hasToken) {
        if (to.path === '/login') {
            next({
                path: '/'
            });
        } else {
            next();
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next(`/login?redirect=${to.path}`);
        }
    }
});
router.afterEach(() => {});
export default router;
