import request from '../utils/request';

//报警统计
export function getAlertsTotal(data) {
    return request({
        url: './alertsTotal.json',
        method: 'get',  //这个位置是post  等真实的请求来了记得更改
        data
    });
}

//报警分布
export function getAlertsDistribution(data) {
  return request({
      url: './alertsDistribution.json',
      method: 'get',  //这个位置是post  等真实的请求来了记得更改
      data
  });
}

//报警量top 指示灯
export function getTopRankingLight(data) {
  return request({
      url: './topRankingLight.json',
      method: 'get',  //这个位置是post  等真实的请求来了记得更改
      data
  });
}

//报警量top 安全帽
export function getTopRankingHelmet(data) {
  return request({
      url: './topRankinghelmet.json',
      method: 'get',  //这个位置是post  等真实的请求来了记得更改
      data
  });
}

//报警量top 静电服
export function getTopRankingAntiStatic(data) {
  return request({
      url: './topRankingAntiStatic.json',
      method: 'get',  //这个位置是post  等真实的请求来了记得更改
      data
  });
}

//报警量变化趋势
export function getTrendingTendency(data) {
  return request({
      url: './trendingTendency.json',
      method: 'get',  //这个位置是post  等真实的请求来了记得更改
      data
  });
}

//报警量分类统计
export function getAlertsTypeStatistics(data) {
  return request({
      url: './alertsTypeStatistics.json',
      method: 'get',  //这个位置是post  等真实的请求来了记得更改
      data
  });
}


