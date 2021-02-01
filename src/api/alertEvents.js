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

//报警事件总量查询接口
export function getAlertEventsCount(data) {
    return request({
        url: './alertEventsCount.json',
        method: 'get', //这个位置是post  等真实的请求来了记得更改
        data
    });
}

//报警事件单条删除
export function deleteAlertEventsById(id) {
    return request({
        // url: /api/alert-events/{id}
        url: './deleteAlertEventsById.json',
        method: 'get', //这个位置是delete  等真实的请求来了记得更改
    });
}

//单个报警事件关闭
export function closeAlertEventsById(data,id) {
  return request({
      // url:  /api/alert-events/{id}/state
      url: './closeAlertEventsById.json', 
      method: 'get', //这个位置是put  等真实的请求来了记得更改
      data
  });
}

