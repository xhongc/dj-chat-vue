<template>
  <div class="sidebar-body">
    <section class="user-info">
      <span class="music-title">音乐</span>
      <span class="music-btn">
        <el-dropdown @command="handleCommand">
              <el-button>
                {{musicSource}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="网易云音乐">网易云音乐</el-dropdown-item>
                <el-dropdown-item command="QQ音乐">QQ音乐</el-dropdown-item>
              </el-dropdown-menu>
      </el-dropdown>
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
      this.$store.commit('setRefAp', this.$refs.aplayer)
    },
    data () {
      return {
        current_sign: 0
      }
    },
    computed: {
      ...mapGetters({
        audio: 'audiosListGetter',
        musicSource: 'musicSourceGetter'
      })
    },
    methods: {
      endedEvent (e) {
        this.$refs.aplayer.seek(this.$refs.aplayer.currentMusic.song_process)
        let lastSongIndex = this.$refs.aplayer.currentIndex - 1
        console.log(lastSongIndex)
        if (lastSongIndex >= 0) {
          let lastSongId = this.$refs.aplayer.dataSource[lastSongIndex].id
          console.log(lastSongId)
          this.$store.dispatch('websocketBaseSend',
            {
              'action': 'chat_message#remove_song',
              'last_song_id': lastSongId
            })
          this.$store.commit('deleteAudiosList', lastSongIndex)
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
          this.$store.dispatch('websocketBaseSend', {'action': 'chat_message#update_song_time', 'current_time': currTime})
        }
      },
      handleCommand (command) {
        this.$message('切换至' + command)
        this.$store.commit('setMusicSource', command)
      }
    }
  }
</script>

<style>
  .music-title{
   position: absolute;
    left: 0;
    width: 12.80rem;
  }
  .music-btn {
    margin-left: 11.2rem;
  }
</style>
