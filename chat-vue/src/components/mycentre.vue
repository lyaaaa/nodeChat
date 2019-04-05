<template>
<div>
    <div class="upBox" @click="chooseImg">修改头像</div><input type="file" id="upImg" @change="handleFile">
    <img :src="userInfo.headimg" alt="" class="headimg">
    个人中心
    <p>欢迎: {{userInfo.name}}</p>
    <p>用户id: {{userInfo._id}}</p>
    <input type="text" placeholder="请输入聊天室名称" v-model="roomName">
    <p @click="makeRoom">创建聊天室</p>

    <div class="chatRoom">
       <p>当前聊天室</p>
       <div class="roomItem" v-for="(item, index) in chatRooms" :key="index" @click="joinRoom(item.roomId)">
          <p>{{item.roomName}}</p>
          <p>人数: {{item.roomUsers.length}}</p>
       </div>
    </div>
</div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: "mycentre",
  data () {
    return {
      roomName: '',
      chatRooms: []
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  sockets: {
     newRoom: function(data){
       this.chatRooms.push(data)
     }
  },
  methods: {
    chooseImg() {
        this.$el.querySelector('#upImg').click()
      },
      handleFile(e) {
        let file = e.target.files[0];
        let param = new FormData(); //创建form对象
        param.append('file', file, file.name); //通过append向form对象添加数据
        this.$axios.post('/public/upimg', param).then(res => {
           this.$axios.post('/login/editHeadimg', {
              headimg: res.data.data
           }).then(apires => {
             let editUser = Object.assign({}, this.userInfo, {
               headimg: apires.data.headimg
             })
             this.setUserInfo(editUser)
           })
        })
      },
      sendMsg(){
        this.$socket.emit('receiveMsg', this.sendMsgTxt);
      },
      // 用户创建新的聊天室
      makeRoom(){
         if(!this.roomName){ alert('名称不能为空'); return }
         this.$socket.emit('addRoom', {
           roomName: this.roomName,
           user: {
             userName: this.userInfo.name,
             userId: this.userInfo._id,
             headimg: this.userInfo.headimg
           }
         })
      },
      // 加入聊天室
      joinRoom(roomId){
         this.$router.push({
           path: `/chatRoom/${roomId}`
         })
      },
      ...mapMutations({
        setUserInfo: 'SET_USER'
      })
  },
  created() {
    // 获取当前聊天室
    this.$axios.post('/chat/allRooms').then(res => {
      this.chatRooms = res.data
    })
  }
}
</script>
<style scoped>
.upBox {
    width: 80px;
    height: 80px;
    font-size: 20px;
    background: #ccc;
    text-align: center;
    line-height: 80px;
  }
  #upImg {
    display: none;
  }
  .headimg{
    width: 100px;
    height: 100px;
    display: block;
    margin: 0 auto;
  }
  .chatRoom{
    margin-top: 50px;
  }
  .roomItem{
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 14px;
  }
</style>