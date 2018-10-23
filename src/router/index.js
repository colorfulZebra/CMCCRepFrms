import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import MainPage from '@/components/MainPage'
import RepFrms from '@/components/RepFrms'
import RepFrmsAdmin from '@/components/RepFrmsAdmin'
import RepFrmsAdminInfo from '@/components/RepFrmsAdminInfo'
import RepFrmsAdminNew from '@/components/RepFrmsAdminNew'

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
          component: RepFrmsAdmin,
          children: [
            {
              path: '',
              component: RepFrmsAdminInfo
            },
            {
              path: 'new/:tableset',
              component: RepFrmsAdminNew,
              props: true
            }
          ]
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
