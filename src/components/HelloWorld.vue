<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="70px">Aside</el-aside>
        <el-aside width="350px">Aside</el-aside>
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
      background-color: #B3C0D1;
      color: #333;
      text-align: center;
      line-height: 60px;
    }
    .el-aside {
      background-color: #D3DCE6;
      color: #333;
      text-align: center;
      line-height: 100vh;
      margin-right: 0.8125rem;
    }
    .el-main {
      background-color: #E9EEF3;
      color: #333;
      text-align: center;
      line-height: 160px;
    }
</style>
