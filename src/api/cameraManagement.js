import request from '../utils/request';

//检测模型类别查询接口
export function getDetectModelsTypes() {
  return request({
      url: './detectModelsTypes.json',
      method: 'get',
  });
}