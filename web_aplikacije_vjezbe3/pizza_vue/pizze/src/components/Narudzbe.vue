<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const narudzbe = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
    try {
        const res = await axios.get('http://localhost:3000/narudzbe')
        narudzbe.value = res.data
    } catch (err) {
        error.value = 'Ne mogu dohvatiti narudžbe'
        console.error(err)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="min-h-screen bg-slate-900 text-white max-w-3xl mx-auto p-6">
        <RouterLink
            to="/"
            class="mb-4 inline-block bg-slate-800 px-4 py-2 rounded-xl hover:bg-slate-600 text-gray-300"
        >
            Natrag
        </RouterLink>
        <h1 class="text-2xl font-bold mb-4 text-orange-400">
            Moje narudžbe
        </h1>

        <div v-if="loading">
            Učitavanje...
        </div>

        <div v-else-if="error">
            {{ error }}
        </div>

        <div v-else-if="narudzbe.length === 0">
            Nemaš još nijednu narudžbu 🍕
        </div>

        <div v-else class="space-y-4">
            <div
                v-for="narudzba in narudzbe"
                :key="narudzba._id"
                class="border border-slate-600 rounded-lg p-4 bg-slate-800/70"
            >
                <p class="text-sm text-slate-400">
                    ID: {{ narudzba._id }}
                </p>

                <p class="font-semibold text-orange-300 mt-1">
                    Ukupno: {{ narudzba.ukupna_cijena }} €
                </p>

                <h3 class="mt-3 font-semibold">Stavke:</h3>
                <ul class="list-disc list-inside">
                    <li
                        v-for="(p, i) in narudzba.narucene_pizze"
                        :key="i"
                    >
                        {{ p.naziv }} – {{ p.velicina }} × {{ p.kolicina }}
                    </li>
                </ul>

                <div class="mt-3 text-sm text-slate-300">
                    Dostava: {{ narudzba.podaci_dostava.adresa }}  
                    ({{ narudzba.podaci_dostava.telefon }})
                </div>
            </div>
        </div>
    </div>
</template>
