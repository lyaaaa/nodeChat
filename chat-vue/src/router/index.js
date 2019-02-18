import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import mycentre from '@/components/mycentre'
import chatRoom from '@/components/chatRoom'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path: '/mycentre',
      name: 'mycentre',
      component: mycentre
    },{
      path: '/chatRoom/:id',
      name: 'chatRoom',
      component: chatRoom
    }
  ]
})
