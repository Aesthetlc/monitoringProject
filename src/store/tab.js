export default {
    state: {
        isCollapse: false
    },
    mutations: {
        changeCollapse(state, val) {
            state.isCollapse = !state.isCollapse;
        }
    }
};
