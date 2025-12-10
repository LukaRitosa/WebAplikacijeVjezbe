import { createRouter, createWebHistory } from 'vue-router'
import PizzaList from '@/components/PizzaList.vue'
import Pizza from '@/components/Pizza.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        name: 'PizzaList',
        component: PizzaList
    },
    {
        path: '/:naziv',
        name: 'Pizza',
        component: Pizza
    }
  ],
})

export default router
