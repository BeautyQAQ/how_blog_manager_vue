import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/base/city',
    method: 'get',
    params
  })
}
