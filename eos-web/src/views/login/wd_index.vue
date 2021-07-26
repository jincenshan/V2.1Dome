<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
             label-position="left">

      <div class="title-container" style="width: 450px;height:70px;display: flex;flex-direction: row;justify-content: center">
        <!--        <img src="../../icons/background_text.png" class="backg_text">-->
        <h3>氧疗物联网网点云平台</h3>
      </div>

      <el-form-item prop="username" style="margin-bottom: 20px">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入账号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual style="margin-top: 10px">
        <el-form-item prop="password" style="margin-bottom: 20px">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
      </el-tooltip>
      <el-button :loading="loading" type="primary"
                 style="width:100%;margin-bottom:30px;background-color:#00608f;border-color:#00608f;"
                 @click.native.prevent="handleLogin">登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
  import store from '@/store'
  import {getInfo, getMenusTree} from "@/api/user";
  import {getToken} from "@/utils/auth";

  export default {
    name: 'wd_index',
    data() {
      return {
        loginForm: {
          username: '',
          password: '',
          type:"WD"
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', message: '请输入账号',}],
          password: [{required: true, trigger: 'blur', message: '请输入密码',}]
        },
        passwordType: 'password',
        capsTooltip: false,
        loading: false,
        redirect: undefined,
        otherQuery: {},
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          const query = route.query
          if (query) {
            this.redirect = query.redirect
            this.otherQuery = this.getOtherQuery(query)
          }
        },
        immediate: true
      }
    },
    mounted() {
      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
    },
    destroyed() {
      // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
      checkCapslock(e) {
        const {key} = e
        this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
                getInfo(getToken()).then(res => {
                  sessionStorage.setItem("user", JSON.stringify(res.data))
                  sessionStorage.setItem("productLine", res.data.productLine)
                  getMenusTree().then(res =>{
                    sessionStorage.setItem("menus",JSON.stringify(res.data));
                    this.$router.push({path: this.redirect || '/', query: this.otherQuery})
                    this.loading = false
                  })
                })
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            return false
          }
        })
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
      },
    }
  }
</script>

<style lang="scss">
  $bg: white;
  $light_gray: #fff;
  $cursor:black;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: black;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          // -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-radio__input.is-checked .el-radio__inner{
      background: #00608f;
      border-color: #00608f;
    }
    .el-radio{
      color: white;
    }
    .el-radio__input.is-checked+.el-radio__label{
      color: white;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: white;
      border-radius: 5px;
      color: black;
    }
    .el-form-item__error{
      margin-top: 4px;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #00CACA;
  $dark_gray: #889aa4;
  $light_gray: #454545;

  .login-container {
    min-height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(../../icons/background.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 20px 35px 0;
      margin: 0 auto;
      overflow: hidden;
      margin-top: 100px;
    }

    .backg_text {
      width: 450px;
      height: 200px;
    }

    .tips {
      font-size: 14px;
      color: #454545;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 18px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
        margin-bottom: 50px;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
