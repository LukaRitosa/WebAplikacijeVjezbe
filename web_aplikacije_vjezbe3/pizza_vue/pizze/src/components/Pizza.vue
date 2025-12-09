<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const naziv = route.params.naziv

const pizza = ref(null)
const poruka = ref("")

async function ucitajPizzu() {
    try {
        const odgovor = await axios.get(`http://localhost:3000/pizze/${naziv}`)
        pizza.value = odgovor.data
    } catch (error) {
        poruka.value = error.response.data.message 
    }
}

onMounted(ucitajPizzu)


</script>

<template>
    <div class="p-6 text-white">

        <RouterLink to="/"
            class="mb-4 bg-orange-500 px-4 py-2 rounded-xl hover:bg-orange-600">
            Natrag na popis
        </RouterLink>

        <div v-if="poruka" class="bg-red-600 p-3 rounded">
            {{ poruka }}
        </div>

        <div v-if="pizza" class="bg-slate-800 p-6 rounded-lg shadow-lg">

            <h2 class="text-3xl font-bold text-orange-400 mb-4">
                {{ pizza.naziv }}
            </h2>

            

            <h3 class="text-xl font-semibold">Cijene:</h3>
            <ul class="mt-2">
                <li v-for="(cijena, velicina) in pizza.cijene" :key="velicina">
                    {{ velicina }} — {{ cijena }}€
                </li>
            </ul>

        </div>
    </div>
</template>
