import request from '../utils/request';

//报警统计 --0227
export function getAlertsTotal(data) {
    return request({
        url: 'proxy/api/statistic/alerts',
        method: 'post',
        data
    });
}

//报警分布 --0227
export function getAlertsDistribution(data) {
    return request({
        url: 'proxy/api/statistic/alerts/distribution',
        method: 'post',
        data
    });
}

//报警量top 指示灯 --0227
export function getTopRankingLight(data) {
    return request({
        url: `proxy/api/statistic/alerts/top-ranking`,
        method: 'post',
        data
    });
}

//报警量变化趋势  --0227    （有问题）
export function getTrendingTendency(data) {
    return request({
        url: `proxy/api/statistic/alerts/trending`,
        method: 'post',
        data
    });
}

//报警量top 安全帽  --0227
export function getTopRankingHelmet(data) {
    return request({
        url: `proxy/api/statistic/alerts/top-ranking`,
        method: 'post',
        data
    });
}

//报警量分类统计  --0227
export function getAlertsTypeStatistics(data) {
    return request({
        url: `proxy/api/statistic/alerts/type`,
        method: 'post',
        data
    });
}

//报警量top 静电服  --0227
export function getTopRankingAntiStatic(data) {
    return request({
        url: './topRankingAntiStatic.json',
        method: 'get', //这个位置是post  等真实的请求来了记得更改
        data
    });
}
