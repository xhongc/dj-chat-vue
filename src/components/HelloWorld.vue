<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="70px" style="background-color: white;">
          <div>
            <i class="el-icon-chat-dot-round nav-first"></i>
          </div>
          <div>
            <i class="el-icon-chat-line-square nav"></i>
          </div>
          <div>
            <i class="el-icon-user nav"></i>
          </div>
          <div style="height: 420px">
            <i class="el-icon-star-off nav"></i>
          </div>
          <div>
            <i class="el-icon-edit nav"></i>
          </div>
          <div>
            <i class="el-icon-setting nav"></i>
          </div>
          <div>
            <i class="el-icon-switch-button nav"></i>
          </div>
        </el-aside>
        <el-aside width="350px">
          <div class="sidebar-body">
            <div class="user-info">
              <span>Hi {{nickName}}</span>
              <el-button><i class="el-icon-user"></i></el-button>
              <el-button><i class="el-icon-user"></i></el-button>
              <el-input style="width: 320px" placeholder="搜索用户"></el-input>
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-main>Main</el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>import axios from 'axios'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'title',
      nickName: 'charlesss',
      isCollapsed: false,
      message: ''
    }
  },
  mounted () {
    axios
      .get('http://127.0.0.1:8099/api/friends/')
      .then(response => (this.msg = response))
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
  },
  methods: {
    sendon (event) {
      console.log(event.currentTarget.value)
      this.message = event.currentTarget.value
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header, .el-footer {
      background-color: #E9EEF3;
      color: #333;
      text-align: center;
      line-height: 60px;
    }
    .el-aside {
      /*background-color: white;*/
      color: #333;
      text-align: center;
      line-height: 100vh;
      margin-right: 1rem;
    }
    .el-main {
      background-color: #E9EEF3;
      color: #333;
      text-align: center;
      line-height: 160px;
    }
    .nav-first {
      width: 70px;
      height: 60px;
      font-size: 38px;
      display: block;
      margin-bottom:17px;
      padding-top: 17px;
      background-color: #67C23A;
      color: white;
    }
    .nav {
      margin-bottom:5px;
      width: 70px;
      height: 60px;
      font-size: 22px;
      display: block;
      cursor: pointer;
    }
    .sidebar-body {
      background-color: white;
      border-radius: 10px;
      height: 94%;
      width: 100%;
      top: 30px;
      position: relative;
      overflow: hidden;
    }
    .user-info {
      height: 80px;
      font-size: 28px;
      padding-top: 8px;
      margin-left: 20px;
      line-height: 60px;
      text-align: left;
    }
</style>
