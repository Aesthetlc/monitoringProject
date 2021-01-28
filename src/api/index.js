import request from '../utils/request';

//获取实时监控
export function fetchData(params) {
    return request({
        url: './table.json',
        method: 'get',
        params
    });
}

//获取日数据
export function getAlertStatisticDaily() {
    return request({
        url: './alertStatisticDaily.json',
        method: 'get'
    });
}

//获取周数据
export function getAlertStatisticWeek() {
    return request({
        url: './alertStatisticWeekly.json',
        method: 'get'
    });
}

//获取月数据
export function getAlertStatisticMonth() {
    return request({
        url: './alertStatisticMonthly.json',
        method: 'get'
    });
}

//获取近7日数据
export function getAlertTrendingBySeven(params) {
    return request({
        url: './alertTrending.json',
        method: 'get',
        params
    });
}

//获取近7日数据
export function getAlertTrendingTop(params) {
  return request({
      url: './topRanking.json',
      method: 'get',
      params
  });
}

