<template>
  <div class="sidebar-body">
    <section class="m-info">
      <span class="m-name">成员</span>
      <span class="close-btn" @click="closeEvent">
        <i class="el-icon-close"></i>
      </span>
      <div>
        <el-avatar :src="admins.img_path" :size="80" class="member-admin-img"></el-avatar>
        <div class="m-title">{{admins.nick_name}}</div>
        <div class="m-title" style="color: gray;margin-bottom: 10px">{{admins.signature}}</div>
        <el-divider class="clearfix"></el-divider>
        <div class="group-m">群成员({{members.length}}/{{activeGroupInfo.max_number}})
          <div style="float: right">邀请好友</div>
        </div>
        <section class="m-list">
          <div v-for="(item,index) in members" :key="'member'+index"
               class="m-per">
            <el-avatar size="small" :src=item.img_path class="ava-img" @error=false>
              <el-avatar> {{item.nick_name[0]}}</el-avatar>
            </el-avatar>
            <div>{{item.nick_name}}</div>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'GroupMember',
    props: ['activeGroupInfo'],
    computed: {
      admins () {
        return this.activeGroupInfo.admins[0]
      },
      members () {
        return this.activeGroupInfo.members
      }
    },
    methods: {
      closeEvent () {
        this.$store.commit('setRightSide', 'null')
      }
    }
  }
</script>

<style scoped>
  .close-btn {
    margin-left: 17.6rem;
    cursor: pointer;
  }

  .m-info {
    height: 80px;
    font-size: 28px;
    padding-top: 15px;
    line-height: 60px;
    text-align: left;
    position: relative;
  }

  .m-name {
    position: absolute;
    left: 20px;
    width: 12.80rem;
  }

  .member-admin-img {
    margin: 10px auto;
    display: block;
  }

  .group-m {
    position: absolute;
    top: 213px;
    left: 12px;
    font-size: 14px;
    right: 12px;
  }

  .m-title {
    text-align: center;
    line-height: 20px;
    font-size: 18px;
    width: 330px;
    margin: 0 auto;
    display: block;
  }

  .m-list {
    position: absolute;
    margin-top: 2.0rem;
    width: 21.875rem;
    height: 80vh;
  }

  .m-per {
    height: 2.4375rem;
    line-height: 2.4375rem;
    padding: 0.75rem 0.75rem;
    position: relative;
    cursor: pointer;
  }
  .m-per div {
    position: absolute;
    left: 5rem;
    top: 7px;
    font-size: 16px;
  }
</style>
