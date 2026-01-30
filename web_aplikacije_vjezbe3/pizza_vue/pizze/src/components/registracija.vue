<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const ime = ref('')
const password = ref('')
const poruka = ref('')
const uspjeh = ref('')

async function registracija() {
    try {
        poruka.value = ''
        uspjeh.value = ''

        const odgovor = await axios.post('http://localhost:3000/user/register', {
            ime: ime.value,
            password: password.value
        })

        console.log('Narudžba uspješno poslana:', odgovor.data);
        uspjeh.value = odgovor.data.message
        ime.value = ''
        password.value = ''
    } catch (error) {
        poruka.value =
            error.response?.data?.greska ||
            error.response?.data?.message ||
            'Došlo je do greške'
        
    }
}
</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center text-white, bg-slate-600"
        :style="{
            backgroundImage: 'url(/background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }"
    >
        <div class="p-6 max-w-md w-full">

            <RouterLink
                to="/"
                class="mb-4 inline-block bg-orange-500 px-4 py-2 rounded-xl hover:bg-orange-600"
            >
                Natrag
            </RouterLink>

            <div v-if="poruka" class="bg-red-600 p-3 rounded mb-4">
                {{ poruka }}
            </div>

            <div v-if="uspjeh" class="bg-green-600 p-3 rounded mb-4">
                {{ uspjeh }}
            </div>

            <div class="bg-slate-800/90 p-6 rounded-lg shadow-lg">
                <h2 class="text-3xl font-bold text-orange-400 mb-6 text-center">
                    Registracija
                </h2>

                <form @submit.prevent="registracija" class="flex flex-col gap-4">

                    <div>
                        <label class="block mb-1 text-gray-300">Korisničko ime</label>
                        <input
                            v-model="ime"
                            type="text"
                            required
                            class="w-full p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label class="block mb-1 text-gray-300">Lozinka</label>
                        <input
                            v-model="password"
                            type="password"
                            required
                            class="w-full p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <button
                        type="submit"
                        class="mt-4 bg-orange-500 hover:bg-orange-600 py-2 rounded-xl font-semibold"
                    >
                        Registriraj se
                    </button>

                </form>
            </div>
        </div>
    </div>
</template>
