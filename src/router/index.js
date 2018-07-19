import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import MainPage from '@/components/MainPage'
import RepFrms from '@/components/RepFrms'
import RepFrmsAdmin from '@/components/RepFrmsAdmin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      component: MainPage,
      children: [
        {
          path: '',
          component: RepFrms
        },
        {
          path: 'repadmin',
          component: RepFrmsAdmin
        }
      ]
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
