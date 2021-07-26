<template>
  <div :class="classObj" class="app-wrapper">
    <div class="hread_div">
      <div style="display: flex;flex-direction: row;align-items: center;height: 50px">
        <img src="../icons/logo_1.jpg" style="width: 100px;height: 40px">
        <label style="margin-left: 20px" v-if="user.type == 'PLATFORM'"> 氧疗平台系统管理</label>
        <label style="margin-left: 20px" v-if="user.type == 'OPT'"> 氧疗物联网运营商管理云平台</label>
        <label style="margin-left: 20px" v-if="user.type == 'NET'"> 氧疗物联网网点云平台</label>
        <span v-if="user.optName" style="margin-left: 20px">{{user.optName}}</span>
      </div>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper" style="display: flex;flex-direction: row;align-items: center;height: 50px">
            <div style="margin-right: 20px">{{name}}</div>
            <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="user-avatar" style="width: 40px;height: 40px;border-radius: 50%">
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item divided @click.native="logoutShow()">
              <span style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar/>
      </div>
      <app-main/>
    </div>
  </div>
</template>

<script>
  import {Navbar, Sidebar, AppMain} from './components'
  import ResizeMixin from './mixin/ResizeHandler'
  import {logout} from "@/api/user";

  export default {
    name: 'Layout',
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    data(){
      return{
        name:JSON.parse(sessionStorage.getItem("user")).name,
        user:JSON.parse(sessionStorage.getItem("user")),
        productLine:sessionStorage.getItem("productLine"),
      }
    },
    mixins: [ResizeMixin],
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      device() {
        return this.$store.state.app.device
      },
      fixedHeader() {
        return this.$store.state.settings.fixedHeader
      },
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    created() {
      this.user = JSON.parse(sessionStorage.getItem("user"))
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
      },
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      logoutShow() {
        logout({token:sessionStorage.getItem("token")})
      }
    },
    mounted() {
      this.user = JSON.parse(sessionStorage.getItem("user"))
    }
  }
</script>
<style lang="scss" scoped>
  .hread_div{
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    padding-right:10px;
    padding-left:10px;
    width: 100%;
    height: 50px;
    position: fixed;
    z-index: 100;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  }
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);

    .hamburger-container {
      display: flex;
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color:transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
          display: flex;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
