import axios from '@/libs/api.request'

export const getTableData = (formData) => {
  return axios.request({
    url: '/sysUser/getSysUserPageList',
    data: formData,
    method: 'post'
  })
}

export const saveSysUser = (formData) => {
  return axios.request({
    url: '/sysUser/saveSysUser',
    data: formData,
    method: 'post'
  })
}

export const deleteSysUser = (formData) => {
  return axios.request({
    url: '/sysUser/deleteSysUser',
    data: formData,
    method: 'post'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}
