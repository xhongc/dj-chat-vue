<template>
  <el-card class="user-card">
    <div class="user-card-info">
      <div style="flex: 1">
        <div class="user-name">{{userInfo.nick_name}}</div>
        <div class="user-uid">UID:{{userInfo.unicode_id}}</div>
      </div>
      <el-avatar :src="userInfo.img_path" class="user-img" shape="square"></el-avatar>
    </div>
    <el-divider></el-divider>
    <div class="user-card-detail">
      <div style="margin-bottom: 5px"><div class='user-card-slogn'>地区:</div>{{userInfo.city}}</div>
      <div style="margin-bottom: 5px"><div class='user-card-slogn'>QQ号码:</div>{{userInfo.qq_number}}</div>
      <div style="margin-bottom: 5px"><div class='user-card-slogn'>加入时间:</div>{{userInfo.date_created}}</div>
    </div>
    <div class="user-card-btn">
      <i class="el-icon-chat-dot-round"></i>
      <!--      <i class="el-icon-plus"></i>-->
    </div>
  </el-card>
</template>

<script>
  export default {
    name: 'UserCard',
    props: ['userInfo'],
    mounted () {
      console.log(this.userInfo)
    }
  }
</script>

<style scoped>
  .user-card-info {
    display: flex;
  }

  .user-card-detail {
    display: flex;
    flex-direction: column;
  }

  .user-card-btn {
    display: flex;
  }

  .user-card-btn i {
    font-size: 32px;
    flex: 1;
    text-align: right;
  }

  .user-name {
    font-size: 30px;
    line-height: 24px;
  }

  .user-img {
    width: 60px;
    height: 60px;
    background-color: white;
  }

  .user-uid {
    margin-top: 12px;
    font-size: 16px;
    line-height: 16px;
    color: gray;
    text-indent: 4px;
  }
  .user-card-slogn{
    color: gray;
    display: inline;
    padding-right: 10px;
  }
</style>
