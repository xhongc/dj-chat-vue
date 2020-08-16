<template>
  <div class="main">
    <div class="login-logo">
      <a href="#"><b>Charles</b>LTE</a>
    </div>
  <el-card class="box-card">
      <div class="clearfix" style="margin-top:10px;">
        <div class="fr form-box">
          <h2>帐号登录</h2>
          <el-divider></el-divider>
          <form id="jsLoginForm" autocomplete="off">
            <div class="form-group">
              <el-input placeholder="账号" v-model="userName" clearable></el-input>
            </div>
            <br/>
            <p class="error-text" v-show="userNameError">{{userNameError}}</p>
            <div class="form-group">
              <el-input prefix="md-finger-print" name="password_l" id="password_l" type="password" v-model="parseWord" @focus="errorUnshow"
                     placeholder="密码" show-password />
            </div>
            <p class="error-text" v-show="parseWordError">{{parseWordError}}</p>
            <!--        <div class="error btns login-form-tips" id="jsLoginTips" v-show="error"><p>用户名或密码错误</p></div> -->
            <div class="auto-box marb38">
            </div>
            <p class="error-text" v-show="error">{{error}}</p>
            <br/>
            <div style="text-align: right;">
              <el-button type="text" style="float: left;">注册</el-button>
              <el-button type="primary" id="jsLoginBtn" @click="login" value="立即登录">登录</el-button>
            </div>
          </form>
        </div>
      </div>
  </el-card>
  </div>
</template>

<script>
import cookie from '../../store/cookie'
import {login} from '../../api/api'
export default {
  name: 'login',
  data () {
    return {
      userName: '',
      parseWord: '',
      autoLogin: false,
      error: false,
      userNameError: '',
      parseWordError: ''
    }
  },
  methods: {
    login () {
      // if(this.userName==''||this.parseWord==''){
      //   this.error = true;
      //   return
      // }
      var that = this
      login({
        username: this.userName, // 当前页码
        password: this.parseWord
      }).then((response) => {
        // 本地存储用户信息
        cookie.setCookie('token', response.data.token, 7)
        // 存储在store
        // 更新store数据
        that.$store.commit('setUserInfo', response.data.token)
        // 跳转到首页页面
        this.$router.push({name: 'HelloWorld'})
      })
        .catch(function (error) {
          if ('non_field_errors' in error) {
            that.error = error.non_field_errors[0]
          }
          if ('username' in error) {
            that.userNameError = error.username[0]
          }
          if ('password' in error) {
            that.parseWordError = error.password[0]
          }
        })
    },
    errorUnshow () {
      this.error = false
    }
  }
}
</script>

<style scoped>
  .main{
    width: 25rem;
    padding: 20px;
    position: absolute;
    top: 20%;
    left: 45%;
    margin: -70px 0 0 -170px;
    }
  .login-logo{
    font-size: 35px;
    text-align: center;
    margin-bottom: 25px;
    font-weight: 300
  }
  .login-logo a {
    color:#444;
    text-decoration:none;
  }
</style>
