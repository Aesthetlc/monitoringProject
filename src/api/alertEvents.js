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

//单个报警事件关闭  --0227(摄像头关闭了重新刷新 还是没关闭状态)
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