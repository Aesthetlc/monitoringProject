import request from '../utils/request';

//检测模型类别查询接口  --0227
export function getDetectModelsTypes() {
    return request({
        url: 'proxy/api/detect-models/types',
        method: 'get'
    });
}

//摄像头分页查询接口  --0227
export function getCamerasQuery(data) {
    return request({
        url: 'proxy/api/cameras/query',
        method: 'post',
        data
    });
}

//根据条件分页展示摄像头总数 --0227
export function getCamerasCount(data) {
    return request({
        url: 'proxy/api/cameras/count',
        method: 'post',
        data
    });
}

//根据摄像机IP查询模型信息接口  --0227
export function detectModelsCameraByIp(ip) {
    return request({
        url: `proxy/api/detect-models?cameras-ip=${ip}`,
        method: 'get'
    });
}

//添加需要图像识别的摄像头  --0227
export function addCameras(data) {
    return request({
        url: `proxy/api/cameras`,
        method: 'post',
        data
    });
}

//根据id删除指定摄像头  --0227
export function deleteCamerasById(id) {
    return request({
        url: `proxy/api/cameras/${id}`,
        method: 'delete'
    });
}

//根据id启动、停止指定摄像头  --0227
export function updateCamerasState(data, id) {
    return request({
        url: `proxy/api/cameras/${id}/state`,
        method: 'put',
        data
    });
}
