import axios from 'axios'

let host = 'http://127.0.0.1:8099'
// 登录
export const login = params => {
  return axios.post(`${host}/api-token-auth/`, params)
}
export const firstInit = params => {
  return axios.get(`${host}/api/first_init/`, params)
}
export const getChatLog = params => {
  console.log('[aaparms', params)
  return axios.get(`${host}/api/chat_log/`, {'params': params})
}
