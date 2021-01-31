import request from '../utils/request';

//获取所有状态信息，用于分类筛选
export function getAlertEventsState(params) {
    return request({
        url: './alertEventsState.json',
        method: 'get',
        params
    });
}

//根据条件分页展示报警事件信息
export function getAlertEventsQuery(data) {
    return request({
        url: './alertEventsQuery.json',
        method: 'get', //这个位置是post  等真实的请求来了记得更改
        data
    });
}
