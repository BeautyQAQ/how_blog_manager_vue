import request from '@/utils/request'

export function login(loginname, password) {
  return request({
    url: '/user/admin/login',
    method: 'post',
    data: {
      loginname,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/admin/info',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/admin/logout',
    method: 'post'
  })
}
