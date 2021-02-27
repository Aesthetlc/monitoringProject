import request from '../utils/request';

//获取日数据  --0227
export function getAlertStatisticDaily() {
    return request({
        url: 'proxy/api/home-page/alert-statistic/daily',
        method: 'get'
    });
}

//获取周数据  --0227
export function getAlertStatisticWeek() {
    return request({
        url: 'proxy/api/home-page/alert-statistic/weekly',
        method: 'get'
    });
}

//获取月数据  --0227
export function getAlertStatisticMonth() {
    return request({
        url: 'proxy/api/home-page/alert-statistic/monthly',
        method: 'get'
    });
}

//获取近7日数据  --0227  （没有返回数据）
export function getAlertTrendingBySeven(params) {
    return request({
        url: './alertTrending.json',
        method: 'get',
        params
    });
}

//获取近7日数据    --0227  （没有返回数据）
export function getAlertTrendingTop(params) {
    return request({
        url: './topRanking.json',
        method: 'get',
        params
    });
}

//获取实时监控
export function fetchData(params) {
    return request({
        url: './table.json',
        method: 'get',
        params
    });
}
