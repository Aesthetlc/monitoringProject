import Vue from 'vue';

Vue.directive('has', {
    bind: function(el, binding) {
        //需要在DOM更新完成以后再执行以下代码，不然通过 el.parentNode 获取不到父节点，因为此时还没有绑定到
        Vue.nextTick(function() {
            var role = binding.value.role;
            if (!Vue.prototype.$_has(role)) {
                el.parentNode.removeChild(el);
            }
        });
    }
});
Vue.prototype.$_has = function(role) {
    //当前角色可以从cookie中获取
    var currentRole = ['admin'];
    if (Array.isArray(role)) {
        return currentRole.some(function(ele) {
            return role.indexOf(ele) >= 0;
        });
    } else {
        return currentRole.indexOf(role) >= 0;
    }
};
