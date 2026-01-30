import { createRouter, createWebHistory } from 'vue-router'
import PizzaList from '@/components/PizzaList.vue'
import Pizza from '@/components/Pizza.vue'
import Registracija from '@/components/registracija.vue'
import Prijava from '@/components/prijava.vue'
import Narudzbe from '@/components/Narudzbe.vue'


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
    },
    {
      path: '/registracija',
      name: 'registracija',
      component: Registracija
    },
    {
      path: '/prijava',
      name: 'prijava',
      component: Prijava
    },
    {
      path: '/narudzbe',
      name: 'narudzbe',
      component: Narudzbe
    }
  ],
})

export default router
