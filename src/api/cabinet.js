import request from '../utils/request';

//获取所有柜机信息 --0227
export function getCabinet() {
    return request({
        url: './allCabinet.json',
        // url: 'proxy/api/racks',
        method: 'get',
    });
}

//编辑机柜信息 --0227
export function editCabinet() {
    return request({
        url: './editCabinet.json',
        // url: 'proxy/api/racks/{rack-id}/objs',
        method: 'get',
    });
}

//上架接口 --0227
export function putawayCabinetApi() {
    return request({
        url: './common.json',
        // url: '/api/racks/{rack-id}/objs/{obj-id}',
        method: 'get',
        // method: 'put',
    });
}

//下架接口 --0227
export function outCabinetApi() {
    return request({
        url: './common.json',
        // url: '/api/racks/{rack-id}/objs/{obj-id}',
        method: 'get',
        // method: 'delete',
    });
}

//下架接口 --0227
export function outBatchCabinetApi() {
    return request({
        url: './common.json',
        // url: '/api/racks/{rack-id}/objs',
        method: 'get',
        // method: 'delete',
    });
}