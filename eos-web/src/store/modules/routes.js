import {getBaseUrl} from "@/utils/auth";

const getDefaultState = () => {
  return {
    menus:[],
    baseUrl:"http://192.168.2.22:2666/eos",
    routes:{},
  }
}
const state = getDefaultState()

const mutations = {
  GET_ROUTES: (state) => {
    state.routes=JSON.parse(sessionStorage.getItem("routes")) || {};
  },
  // GET_CHILDREN:(menus,)
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
