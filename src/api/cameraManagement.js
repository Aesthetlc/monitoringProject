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

//获取全部等级（重要度）  --0227
export function getImportanceLevel() {
    return request({
        url: `proxy/api/importance`,
        method: 'get'
    });
}

//修改等级（重要度）  --0227
export function updateImportanceLevel(data) {
    return request({
        url: `proxy/api/importance`,
        method: 'put',
        data
    });
}

//编辑摄像头 --0227
export function updateCameras(data) {
    return request({
        url: `proxy/api/cameras/${data.id}`,
        method: 'put',
        data: {
            ip: data.ip,
            position: data.position,
            detectModelId: -1, //  这个字段算便写 编辑的时候  后台不会读取这个字段
            importanceId: data.importanceId,
            coord:data.coord,
            currentNum:data.currentNum,
            fps:data.fps,
            pic:data.pic,
            url:data.url
        }
    });
}

//获取编辑图片的url --0227
export function getSrcFromCanvas(cameraIp, modelType, cameraUrl) {
    return request({
        url: `proxy/api/cameras/pic`,
        method: 'post',
        data: {
            ip: cameraIp,
            type: modelType,
            url: cameraUrl
        }
    });
}
