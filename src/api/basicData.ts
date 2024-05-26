import request from '~/utils/http/axios'

export default {
  // 获取客户列表数据
  getHomeMapDataApi(params: {}) {
    return request({
      url: 'getProvinceMapData',

      params
    })
  }
}
