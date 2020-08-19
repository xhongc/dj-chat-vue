<template>
  <div class="sidebar-body">
    <section class="user-info">
      <span class="nick-name">音乐点播</span>
      <span class="group-btn">
                <el-button type="info" size="small" plain><i class="el-icon-user-solid"></i></el-button>
                <el-button type="info" size="small" plain><i class="el-icon-user-solid"></i></el-button>
              </span>
      <el-input style="width: 320px;margin-top: 10px;" placeholder="搜索用户"></el-input>
    </section>
    <section class="user-list">
      <aplayer ref="aplayer" :audio="audio" :lrcType="1" />
    </section>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

  export default {
    name: 'ChatMusic',
    mounted () {
      console.log(this.$refs.aplayer)
      this.$store.commit('setRefAp', this.$refs.aplayer)
    },
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters({
          audio: 'audiosListGetter'
      })
    }
  }
</script>

<style>
</style>
