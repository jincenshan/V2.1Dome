import request from '@/utils/request'
import router from "@/router";
import { removeToken } from '@/utils/auth'
import da from "element-ui/src/locale/lang/da";

export function login(data) {
  return request({
    url: '/eos-auth/jwt/ptLogin',
    method: 'post',
    data
  })
}

export function pt_login(data) {
  return request({
    url: '/eos-auth/jwt/yysLogin',
    method: 'post',
    data
  })
}

export function wd_login(data) {
  return request({
    url: '/eos-auth/jwt/wdLogin',
    method: 'post',
    data
  })
}


export function getInfo(token) {
  return request({
    url: '/eos-auth/jwt/userinfo',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return request({
    url: '/eos-auth/jwt/loginOut',
    method: 'post',
    data,
  }).then(res =>{
    sessionStorage.removeItem("token");
    if(JSON.parse(sessionStorage.getItem("user")).type == "PLATFORM"){
      router.push('/login')
    }else if(JSON.parse(sessionStorage.getItem("user")).type == "OPT"){
      router.push('/opt_index')
    }else if(JSON.parse(sessionStorage.getItem("user")).type == "NET"){
      router.push('/wd_index');
    }
  })
}
//获取权限目录
export function getMenusTree(data) {
  return request({
    url: '/eos-system/sys/user/getUserPermission',
    method: 'get',
    params: { data }
  })
}
//获取菜单
export function getMenus(data) {
  return request({
    url: '/eos-system/sys/user/allPermissions',
    method: 'post',
    data
  })
}
//添加菜单
export function addMenus(data) {
  return request({
    url: '/eos-system/sys/user/addMenus',
    method: 'post',
    data
  })
}
//编辑菜单
export function editMenus(data) {
  return request({
    url: '/eos-system/sys/permission/edit',
    method: 'post',
    data
  })
}
//删除菜单
export function deleteMenus(data) {
  return request({
    url:'/eos-system/sys/permission/delete',
    method:'post',
    data
  })
}
//查询运营商
export function permissionByCode(data) {
  return request({
    url:'/eos-system/sys/permission/getPerssmissionByCode',
    method:'post',
    data
  })
}

//修改权限运营商网点
export function permissionByCodeUpdate(data) {
  return request({
    url:'/eos-system/sys/permission/orgOptPermissions',
    method:'post',
    data
  })
}

//首页报表数据
export function mainTable(data) {
  return request({
    url:'/eos-system/sys/user/indexReport',
    method:'post',
    data
  })
}

//员工列表
export function userList(data) {
  return request({
    url:'/eos-system/sys/user/list',
    method:'post',
    data
  })
}

//员工添加
export function userAdd(data) {
  return request({
    url:'/eos-system/sys/user/add',
    method:'post',
    data
  })
}

//设置角色
export function userSetting(data) {
  return request({
    url:'/eos-system/sys/user/setRole',
    method:'post',
    data
  })
}

//删除员工
export function userDelete(data) {
  return request({
    url:'/eos-system/sys/user/delete',
    method:'post',
    data
  })
}


