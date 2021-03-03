import request from '../utils/request';

//获取用户列表  --0227
export function getUserAll(data) {
    return request({
        url: 'proxy/api/user/queryUser',
        method: 'post',
        data
    });
}

//用户角色列表  --0227
export function getUserRoles(data) {
    return request({
        url: 'proxy/api/user/userRoles',
        method: 'get'
    });
}

//添加用户  --0227
export function addUser(data) {
    return request({
        url: 'proxy/api/user/addUser',
        method: 'post',
        data
    });
}

//根据id删除指定用户   --0227
export function deleteUserById(id) {
    return request({
        url: `proxy/api/user/delete/${id}`,
        method: 'delete'
    });
}
