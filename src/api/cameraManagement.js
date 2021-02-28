import request from '../utils/request';

//检测模型类别查询接口  --0227
export function getDetectModelsTypes() {
    return request({
        url: 'proxy/api/detect-models/types',
        method: 'get'
    });
}

//摄像头分页查询接口
export function getCamerasQuery(data) {
    return request({
        url: './camerasQuery.json',
        method: 'get', //这个位置是post  等真实的请求来了记得更改
        data
    });
}

//根据条件分页展示摄像头总数
export function getCamerasCount(data) {
    return request({
        url: './camerasCount.json',
        method: 'get', //这个位置是post  等真实的请求来了记得更改
        data
    });
}

//根据id删除指定摄像头
export function deleteCamerasById(id) {
    return request({
        // url: /api/cameras/{id}
        url: './deleteAlertEventsById.json',
        method: 'get' //这个位置是delete  等真实的请求来了记得更改
    });
}

//根据id启动、停止指定摄像头
export function updateCamerasState(data, id) {
    return request({
        // url: /api/cameras/{id}/state
        url: './camerasState.json',
        method: 'get', //这个位置是put  等真实的请求来了记得更改
        data
    });
}

//添加需要图像识别的摄像头
export function addCameras(data) {
    return request({
        url: './cameras.json',
        method: 'get', //这个位置是post  等真实的请求来了记得更改
        data
    });
}

//根据摄像机IP查询模型信息接口
export function detectModelsCameraByIp() {
    return request({
        // url: /api/detect-models?cameras-ip=ip
        url: './detectModelsCameraByIp.json',
        method: 'get'
    });
}
