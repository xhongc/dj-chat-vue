<template>
  <div class="sidebar-body">
    <section class="user-info">
      <span class="nick-name">Hi {{ userInfo.nick_name }}</span>
      <span class="group-btn">
                <el-button type="info" size="small" plain><i class="el-icon-user-solid"></i></el-button>
                <el-button type="info" size="small" plain><i class="el-icon-user-solid"></i></el-button>
              </span>
      <el-input style="width: 320px;margin-top: 10px;" placeholder="搜索用户"></el-input>
    </section>
    <section class="user-list">
      <aplayer :audio="audio" :lrcType="3" />
    </section>
  </div>
</template>

<script>
  export default {
    name: 'ChatMusic',
    props: ['userInfo', 'groupInfo', 'activeIndex'],
    data () {
      return {
        audio: {
        name: '东西（Cover：林俊呈）',
        artist: '纳豆',
        url: 'https://cdn.moefe.org/music/mp3/thing.mp3',
        cover: 'https://p1.music.126.net/5zs7IvmLv7KahY3BFzUmrg==/109951163635241613.jpg?param=300y300', // prettier-ignore
        lrc: 'https://cdn.moefe.org/music/lrc/thing.lrc'
      }
      }
    },
    components: {
    }
  }
</script>

<style>
</style>
