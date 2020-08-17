import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '../views/login/login'
import AplayerCom from '@/components/Aplayer'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login/',
      name: 'login',
      component: login
    },
    {
      path: '/ap/',
      name: 'ap',
      component: AplayerCom
    }
  ]
})
