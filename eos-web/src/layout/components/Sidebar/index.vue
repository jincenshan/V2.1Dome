<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import Layout from '@/layout'
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      //this.$router.options.routes
      return this.getUserMenus();
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data(){
    return {
      menus:[],
      user:JSON.parse(sessionStorage.getItem("user")),
      buttonArray:[],
      netMenus:[{description: "首页报表",
        enname: "dashboard",
        id: "1285456907741429760",
        name: "首页",
        parentId: "0",
        sort: 100,
        type: "directory",
        uri: "/eos-system/sys/user/indexReport"},{
        description: "",
        enname: "main_controller_n",
        icon: "",
        id: "1285510721349615616",
        name: "控制器-按钮",
        parentId: "1285456907741429760",
        sort: 0,
        type: "button",
        uri: ""
      },{
        description: "",
        enname: "main_oxy_n",
        icon: "",
        id: "1285510871237263360",
        name: "制氧机-按钮",
        parentId: "1285456907741429760",
        sort: 0,
        type: "button",
        uri: ""
      },{
        description: "",
        enname: "main_maintain_n",
        icon: "",
        id: "1285731464859615232",
        name: "保养计划-按钮",
        parentId: "1285456907741429760",
        sort: 0,
        type: "button",
        uri: ""
      },{
        description: "",
        enname: "main_network_n",
        icon: "",
        id: "1285731869479927808",
        name: "入驻网点-按钮",
        parentId: "1285456907741429760",
        sort: 0,
        type: "button",
        uri: ""
      },{
        description: "",
        enname: "main_oxy_operate_n",
        icon: "",
        id: "1285733635449683968",
        name: "制氧机运营-按钮",
        parentId: "1285456907741429760",
        sort: 0,
        type: "button",
        uri: ""
      },{
        description: "",
        enname: "main_c_operate_n",
        icon: "",
        id: "1285733748033191936",
        name: "控制器运营-按钮",
        parentId: "1285456907741429760",
        sort: 0,
        type: "button",
        uri: ""
      },{description: "",
        enname: "network",
        icon: "network",
        id: "1295262601399238656",
        name: "网点管理",
        parentId: "0",
        sort: 10,
        type: "directory",
        uri: "",},{
        description: "",
        enname: "network_index",
        icon: "list_1",
        id: "1295262883327770624",
        name: "入户终端供氧模板列表",
        parentId: "1295262601399238656",
        sort: 0,
        type: "menu",
        uri: "/eos-system/sys/netoxytemplate/list",
      },{
        description: "",
        enname: "add_formwork",
        icon: "",
        id: "1295265796024434688",
        name: "新增",
        parentId: "1295262883327770624",
        sort: 0,
        type: "button",
        uri: "/eos-system/sys/netoxytemplate/add",
      },{
        description: "",
        enname: "formwork_detail",
        icon: "",
        id: "1295266076011003904",
        name: "详情",
        parentId: "1295262883327770624",
        sort: 0,
        type: "button",
        uri: "/eos-system/sys/netoxytemplate/info/{templateId}",
      },{
        description: "",
        enname: "formwork_select",
        icon: "",
        id: "1295266692997316608",
        name: "选择此模板",
        parentId: "1295262883327770624",
        sort: 0,
        type: "button",
        uri: "/eos-system/sys/netoxytemplate/update/{templateId}/{status}",
      },{
        description: "",
        enname: "network_on",
        icon: "list_1",
        id: "1295263075212984320",
        name: "入户终端设备运行监控",
        parentId: "1295262601399238656",
        sort: 0,
        type: "menu",
        uri: ""
      },{
        description: "",
        enname: "network_up_hs_n",
        icon: "",
        id: "1295263918796570624",
        name: "历史记录",
        parentId: "1295263075212984320",
        sort: 0,
        type: "button",
        uri: "",
      },{
        description: "",
        enname: "maintain_formwork",
        icon: "",
        id: "1295264496834576384",
        name: "维护供氧模板",
        parentId: "1295263075212984320",
        sort: 0,
        type: "button",
        uri: "",
      },{
        description: "",
        enname: "network_home",
        icon: "list_1",
        id: "1295263209938223104",
        name: "房间分控终端运行监控",
        parentId: "1295262601399238656",
        sort: 0,
        type: "menu",
        uri: "",
      },{
        description: "",
        enname: "network_hs_n",
        icon: "",
        id: "1295264611041280000",
        name: "历史记录",
        parentId: "1295263209938223104",
        sort: 0,
        type: "button",
        uri: ""
      }]
    }
  },
  methods:{
    getUserMenus(){
      this.$store.commit("user/GET_MENUS");
      // let menus=this.$store.getters.menus;
      let menus = '';
      if(this.user.type == 'NET'){
        menus=this.netMenus;
      }else {
        menus=this.$store.getters.menus;
      }
      let rtMenus=[];
      let buttonArray = this.buttonArray
      for(let i=0;i<menus.length; i++){
        if(!menus[i]){
          menus.splice(i,1);
          i--;
          continue;
        }
        if((!menus[i].parentId || menus[i].parentId==0) && menus[i].type=='directory'){
          let mn=menus[i];
          rtMenus.push({
            path:mn.enname,
            component:Layout,
            redirect: mn.redirect,
            children:[],
            id:mn.id,
            name:mn.name,
            meta: {
              title: mn.name,
              icon:  mn.icon
            }});
          menus.splice(i,1);
          i--;
        }
      }
      this.generator(menus,rtMenus,buttonArray);
      sessionStorage.setItem("routes",JSON.stringify(menus));
      sessionStorage.setItem("buttonArray",JSON.stringify(buttonArray));
      return rtMenus;
    },
    generator(menus,parents,buttonArray){
      if(menus.length>0){
        parents.map(p=>{
          for(let i=0;i<menus.length; i++){
            let mn=menus[i];
            if(mn.parentId && mn.parentId==p.id && mn.type=='menu'){
              p.children.push({
                path:mn.enname,
                component:() => import('@/views'+mn.redirect),meta:{title:mn.name,icon:mn.icon},
                children:[],
                id:mn.id
              });
              menus.splice(i,1);
              i--;
            }else if(mn && mn.type=='button'){
              if(!buttonArray.includes(mn.enname)){
                buttonArray.push(mn.enname)
                menus.splice(i,1);
                i--;
              }
            }

          }
          if(p.children.length>0){
            this.generator(menus,p.children,buttonArray);
          }
        })
      }
    }
  },
  mounted() {
    //this.getUserMenus();
  }
}
</script>
