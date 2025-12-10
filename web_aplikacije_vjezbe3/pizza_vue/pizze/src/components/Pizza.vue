<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
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
            class="mb-4 inline-block bg-orange-500 px-4 py-2 rounded-xl hover:bg-orange-600">
            Natrag na popis
        </RouterLink>

        <div v-if="poruka" class="bg-red-600 p-3 rounded mb-4">
            {{ poruka }}
        </div>

        <div v-if="pizza" class="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6">

            <div class="w-full md:w-1/3 flex flex-col items-center md:items-start">

                <h2 class="text-3xl font-bold text-orange-400 mb-4 text-center md:text-left">
                    {{ pizza.naziv }}
                </h2>

                <div class="w-full h-52 md:h-64 rounded-lg overflow-hidden">
                    <img 
                        :src="pizza.slika_url" 
                        :alt="pizza.naziv" 
                        class="w-full h-full object-cover"
                    >
                </div>
            </div>

            <div class="flex-1">

                <h3 class="text-xl font-semibold mb-2">Sastojci:</h3>
                <ul class="list-disc ml-6 mb-6 text-gray-300">
                    <li v-for="s in pizza.sastojci" :key="s">{{ s }}</li>
                </ul>

                <h3 class="text-xl font-semibold mb-2">Cijene:</h3>
                <ul>
                    <li v-for="(cijena, velicina) in pizza.cijene" :key="velicina">
                        {{ velicina }} — {{ cijena }}€
                    </li>
                </ul>

            </div>
        </div>
    </div>
</template>
