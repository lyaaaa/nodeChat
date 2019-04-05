<template>
<div class="box">
    <div class="room-top">
        <div @click="outChatRoom()">
            退出聊天室
        </div>
        <div>
            删除聊天室记录
        </div>
    </div>
    <div class="chat-box">
        <div v-for="(item, index) in chatArr" :key="index">
            <div class="mysay" v-if="item.userInfo.name == userInfo.name">
             <div class="headimg">
                <img :src="userInfo.headimg" alt="">
            </div>
            <div class="sayContent">
                {{item.msgInfo}}
            </div>
         </div>
           <div class="ortherSay" v-else>
            <div class="headimg">
                <img :src="item.userInfo.headimg" alt="">
            </div>
            <div class="sayContent">
                {{item.msgInfo}}
            </div>
         </div>
        </div>
    </div>
    <div class="send-box">
        <input type="text" v-model="sendTxt"> 
        <div class="send-btn" @click="sendMsg">发送</div>
    </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: "component_name",
  data () {
    return {
       roomId: this.$route.params.id,   //聊天室id
       sendTxt: '',      // 发送内容
       userToken: window.localStorage.getItem('express_token'),    // 用户token
       chatArr: []
    };
  },
  sockets:{
     receiveMsg: function (data) {
        this.chatArr.push(data)
     }
  },
  computed: {
    ...mapGetters([
        'userInfo'
    ])  
  },
  methods: {
       // 发送消息   
      sendMsg(){
          let sendMsg = {
              userToken: this.userToken,
              sendTxt: this.sendTxt,
              roomId: this.roomId
          }
          let chatInfo = {
              msgInfo: this.sendTxt,
              userInfo: { 
                  headimg: this.userInfo.headimg,
                  name: this.userInfo.name
              }
          }
          this.chatArr.push(chatInfo)
          this.$socket.emit('sendMsg', sendMsg)
          this.sendTxt = ''
      },
      outChatRoom(){ 
          this.$axios.post('/chat/outChatRoom', {
              roomId: this.roomId,
              userToken: this.userToken
          }).then(res => {
              console.log('res', res)
              if(res.data.code == 0){
                  alert('退出成功')
                  setTimeout(() => {
                      this.$router.go(-1);
                  }, 1000)
              }
          })
      }
  },
  created() {
     // 获取聊天室聊天记录
     this.$axios.post('/chat/chatRecord', {
         roomId: this.roomId
     }).then(res => {
         this.chatArr = res.data.data
     })
     this.$socket.emit('joinRoom', {
         roomId: this.roomId,
         userToken: this.userToken
     })
  }
}
</script>
<style scoped>

.box{
    width: 100%;
    min-height: 100%;
    background: #eee;
    padding: 10px 0;
    padding-bottom: 80px;
    padding-top: 40px;
    box-sizing: border-box;
}
.room-top{
    height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    background: #fff;
}
.room-top div{
    width: 120px;
    text-align: center;
    height: 40px;
    line-height: 40px;
}
.ortherSay, .mysay{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.mysay{
    flex-direction: row-reverse;
}
.headimg{
    width: 44px;
    height: 44px;
    border-radius: 44px;
    margin: 0 10px;
}
.headimg img{
    width: 44px;
    height: 44px;
    border-radius: 44px;
}
.sayContent{
    background: #fff;
    border-radius: 4px;
    font-size: 32rpx;
    text-align: left;
    padding: 10px 10px;
}
.send-box{
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    justify-content: center;
    border-top: 1px solid #ccc;
    background: #fff;
}
.send-box input{
    width: 55%;
}
.send-box .send-btn{
    width: 80px;
    height: 25px;
    font-size: 15px;
    color: #fff;
    background: #2877EC;
    text-align: center;
    line-height: 25px;
    border-radius: 4px;
    margin-left: 20px;
}
</style>