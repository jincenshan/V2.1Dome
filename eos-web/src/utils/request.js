import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken, removeToken} from '@/utils/auth'
import {logout} from '@/api/user'

const service = axios.create({
  // baseURL: 'http://192.168.2.206:8088',
  baseURL: 'http://192.168.2.22:8088',
  timeout: 10000,
})
// 拦截器处理 config
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] =getToken()
    }
    config.baseURL = store.state.routes.baseUrl
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 拦截器处理返回Data
service.interceptors.response.use(
  response => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    const headers = response.headers
    if (headers['content-type'] === 'application/vnd.ms-excel;charset=utf-8') {
      return response.data
    }
    if (res.code != 1) {
      Message({
        message: res.info || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code == 1003) {
        removeToken()
      }
    } else {
      return res

    }
  },
  //公共返回提示语
  error => {
    if(error == "Error: timeout of 5000ms exceeded"){
      Message({
        message: "服务器响应超时",
        type: 'error',
        duration: 5 * 1000
      })
      return
    }
    Message({
      message: error.response.data.message,
      type: 'error',
      duration: 5 * 1000
    })
    if(error.response.data.message == '此会话失效请重新登录'){
      let params={};
      params.token=sessionStorage.getItem("token");
      logout(params)
    }
    return Promise.reject(error)
  },
)

export default service
