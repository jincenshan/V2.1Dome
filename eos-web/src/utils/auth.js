import Cookies from 'js-cookie'
import request from "@/utils/request";

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return sessionStorage.getItem("token");
}

export function getBaseUrl(data) {
  let productLine=sessionStorage.getItem("productLine");
  // let token=sessionStorage.getItem("token");
    data['productLine']=productLine;
    // data['token']=token;
  return data
}

export function setToken(token) {
  sessionStorage.setItem("token",token);
}

export function removeToken() {
  let data={};
  data.token=sessionStorage.getItem("token");
  request({
    url: '/sys/user/loginOut',
    method: 'post',
    data: data,
  })
  return sessionStorage.removeItem("token");
}
