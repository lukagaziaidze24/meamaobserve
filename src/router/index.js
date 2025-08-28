import { createRouter, createWebHashHistory } from 'vue-router'
import MainComponent from '@/components/MainComponent.vue'
import ObserveView from "@/views/ObserveView.vue";

const routes = [
  {
    path: '/',
    name: 'MainComponent',
    component: MainComponent,
    children: [
      {
        path: '/',
        component: ObserveView,
        name: ObserveView,
      }
    ],
  },

  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
