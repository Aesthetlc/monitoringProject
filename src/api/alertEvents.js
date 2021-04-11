import request from '../utils/request';

//获取所有状态信息，用于分类筛选   --0227
export function getAlertEventsState(params) {
    return request({
        url: 'proxy/api/alert-events/state',
        method: 'get',
        params
    });
}

//根据条件分页展示报警事件信息  --0227
export function getAlertEventsQuery(data) {
    return request({
        url: 'proxy/api/alert-events/query',
        method: 'post',
        data
    });
}

//单个报警事件关闭  --0227
export function closeAlertEventsById(data, id) {
    return request({
        url: `proxy/api/alert-events/${id}/state`,
        method: 'put',
        data
    });
}

//报警事件单条删除  --0227
export function deleteAlertEventsById(id) {
    return request({
        url: `proxy/api/alert-events/${id}`,
        method: 'delete'
    });
}

//报警事件批量删除  --0227
export function deleteAlertEventsByArr(data) {
    return request({
        url: `proxy/api/alert-events/batchDelAlertEvent`,
        method: 'post',
        data
    });
}

//设置刷新时间  --0227
export function setRefreshBlank(data) {
    return request({
        url: `proxy/api/alert-events-settings/setRefreshBlank`,
        method: 'post',
        data
    });
}

//添加静音时段  --0227
export function setMuteInterval(data) {
    return request({
        url: `proxy/api/alert-events-settings/setMuteInterval`,
        method: 'post',
        data
    });
}

//获取静音时间段  --0227
export function getMuteInterval(data) {
    return request({
        url: `proxy/api/alert-events-settings/getMuteInterval`,
        method: 'post',
        data
    });
}

//获取刷新时间  --0227
export function getRefreshBlank(data) {
    return request({
        url: `proxy/api/alert-events-settings/getRefreshBlank`,
        method: 'post',
        data
    });
}

//获取symbolSize图表  --0227
export function querySymbolSize(data) {
    return request({
        url: `proxy/api/alert-events/querySymbolSize`,
        method: 'post',
        data
    });
}
