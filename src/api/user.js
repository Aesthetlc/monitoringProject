import request from '../utils/request';

//获取用户列表
export function getUserAll(data) {
    return request({
        url: './user.json',
        method: 'get', //这个位置是post  等真实的请求来了记得更改
        data
    });
}

//获取用户列表总数
export function getUserCount(data) {
    return request({
        url: './userCount.json',
        method: 'get', //这个位置是post  等真实的请求来了记得更改
        data
    });
}

//根据id删除指定用户
export function deleteUserById(id) {
    return request({
        // url
        url: './deleteUserById.json',
        method: 'get' //这个位置是delete  等真实的请求来了记得更改
    });
}

//添加用户
export function addUser(data) {
  return request({
      url: './addUser.json',
      method: 'get', //这个位置是post  等真实的请求来了记得更改
      data
  });
}
