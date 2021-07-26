import {login, getMenusTree, getInfo, wd_login, pt_login} from '@/api/user'
import { getToken, setToken, removeToken} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  // if(sessionStorage.getItem('user_data')){
  //   return JSON.parse(sessionStorage.getItem('user_data'));
  // }
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userInfo:"",
    menus:[],
    productLine:'',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER_INFO:(state,info)=>{
    sessionStorage.setItem("menus",JSON.stringify(info.menus));
    if(info.menus){
      delete info.menus;
    }
    sessionStorage.setItem("user",JSON.stringify(info));
  },
  GET_USERINFO:(state)=>{
    state.userInfo=JSON.parse(sessionStorage.getItem("user")) || {}
  },
  GET_MENUS:(state)=>{
    if(sessionStorage.getItem("menus")){
      state.menus=JSON.parse(sessionStorage.getItem("menus"));
    }else{
      state.menus=[];
    }
  },
  GET_PRODUCTLINE:(state,productLine)=>{
    state.productLine =productLine
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password} = userInfo
    return new Promise((resolve, reject) => {
      if(userInfo.type == "PT"){
        login({ username: username.trim(), password: password}).then(response => {
          // const { data } = response;
          if (response.data) {
            commit('SET_TOKEN', response.data);
            setToken(response.data)
          }else {

          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      }else if(userInfo.type == "OPT"){
        pt_login({ username: username.trim(), password: password}).then(response => {
          // const { data } = response;
          if (response.data) {
            commit('SET_TOKEN', response.data);
            setToken(response.data)
          }else {

          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      }else if(userInfo.type == "WD"){
        wd_login({ username: username.trim(), password: password}).then(response => {
          // const { data } = response;
          if (response.data) {
            commit('SET_TOKEN', response.data);
            setToken(response.data)
          }else {

          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      }
    })
  },
  // get user info
  getInfo({ commit, state }) {
    var user = sessionStorage.getItem("user");
    return JSON.stringify(user)||{};
  },

  // user logout
  logout({ commit, state }) {
    removeToken();
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

