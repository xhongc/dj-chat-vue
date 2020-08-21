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
      <aplayer ref="aplayer" :audio="audio"
               :lrcType="1"
               @play="endedEvent"
               @error="errorEvent"
               @timeupdate="timeupdateEvent"
      />
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
        current_sign: 0
      }
    },
    computed: {
      ...mapGetters({
        audio: 'audiosListGetter'
      })
    },
    methods: {
      endedEvent (e) {
        let lastSongIndex = this.$refs.aplayer.currentIndex - 1
        if (lastSongIndex >= 0) {
          let lastSongId = this.$refs.aplayer.dataSource[lastSongIndex].id
          this.$store.commit('deleteAudiosList', lastSongIndex)
          this.$store.dispatch('websocketBaseSend',
            {
              'action': 'chat_message#remove_song',
              'now_song_id': lastSongId
            })
        }
      },
      errorEvent (e) {
        console.log('errer', e)
        this.$store.dispatch('websocketSend', 'chat_message#reload_song_url')
      },
      timeupdateEvent () {
        let currTime = parseInt(this.$refs.aplayer.currentSettings.currentTime)
        if (currTime % 5 === 0 && currTime !== this.current_sign) {
          this.current_sign = currTime
          console.log(currTime)
          this.$store.dispatch('websocketBaseSend', {'action': 'chat_message#update_song_time', 'current_time': currTime})
        }
      }
    }
  }
</script>

<style>
</style>
