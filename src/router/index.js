import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import MainPage from '@/components/MainPage'
import RepFrms from '@/components/RepFrms'
import RepFrmsAdmin from '@/components/RepFrmsAdmin'
import RepFrmsAdminInfo from '@/components/RepFrmsAdminInfo'
import RepFrmsAdminNew from '@/components/RepFrmsAdminNew'
import RepFrmsAdminEdit from '@/components/RepFrmsAdminEdit'

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
            },
            {
              path: 'edit/:tableset/:tablename',
              component: RepFrmsAdminEdit,
              props: true
            }
          ]
        }
      ]
    }
  ]
})
