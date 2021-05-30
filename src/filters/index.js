const formatEmpty = function(val) {
    if (val == '' || val == undefined || val == null || val == 'null') {
        return '--';
    } else {
        return val;
    }
};

export { formatEmpty };
