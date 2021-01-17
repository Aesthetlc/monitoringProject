import request from '../utils/request';

//获取实时监控
export function fetchData (params)  {
    return request({
        url: './table.json',
        method: 'get',
        params
    });
};