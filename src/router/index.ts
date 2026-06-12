import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const ListView = () => import('@/views/ListView.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/lists/:id',
      name: 'list',
      component: ListView,
      props: true
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

