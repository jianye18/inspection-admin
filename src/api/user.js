import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  return axios.request({
    url: '/login/loginIn',
    data: {
      loginName: userName,
      password: password
    },
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/login/loginOut',
    method: 'post'
  })
}
