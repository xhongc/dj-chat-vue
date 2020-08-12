<template>
  <div>
    {{msg}}
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
  li {
    list-style: none;
  }

  .sider-l {
    background-color: white;
  }
</style>
