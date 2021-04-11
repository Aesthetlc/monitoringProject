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
export function getUserRoles() {
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

//根据id编辑指定用户   --0227
export function updateUser(data) {
    return request({
        url: `proxy/api/user/updateUser`,
        method: 'post',
        data
    });
}

//登录   --0227
export function login(data) {
  return request({
      url: `proxy/api/user/login`,
      method: 'post',
      data
  });
}
