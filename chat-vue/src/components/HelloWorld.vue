<template>
  <div class="hello">
    <div class="inline">
      <p>用户名</p>
      <input type="text" v-model="userName">
    </div>
    <div class="inline">
      <p>密码</p>
      <input type="password" v-model="userPwd">
    </div>
    <div class="btn">
      <div @click="login">登陆</div>
      <div @click="register">注册</div>
    </div>
    
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        userName: null,
        userPwd: null,
        imgUrl: ''
      }
    },
    methods: {
      login() {
        this.$axios.post('/login/login', {
          pwd: this.userPwd,
          name: this.userName
        }).then(res => {
          if(res.data.code == 0){
            window.localStorage.setItem('express_token', res.data.token)
            this.setUserInfo(res.data.data)
            this.$router.push({
              path: '/mycentre'
            })
          }
        }).catch(err => {
          console.log('err', err)
        })
      },
      register() {
        this.$axios.post('/login/register', {
          pwd: this.userPwd,
          name: this.userName
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      },
      ...mapMutations({
        setUserInfo: 'SET_USER'
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .api {
    width: 50px;
    height: 50px;
    background: #000;
  }

  .inline {
    display: flex;
    align-items: center;
  }

  .inline input {
    width: 200px;
    height: 20px;
    margin-left: 16px;
  }

  .btn {
    display: flex;
  }

  .btn div {
    width: 200px;
    height: 50px;
    text-align: center;
    line-height: 50px;
  }

</style>
