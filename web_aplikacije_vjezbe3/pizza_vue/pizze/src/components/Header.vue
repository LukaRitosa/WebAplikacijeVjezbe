<template>
    <header class="w-full border-b border-slate-200 bg-slate-700 backdrop-blur-sm">
        <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
            <!-- Left: Brand -->
            <div class="flex items-center gap-2">
                <!-- Simple logo circle -->
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 shadow-sm">
                    <img
                        src="https://png.pngtree.com/png-clipart/20250703/original/pngtree-pizza-logo-transparent-image-free-for-online-download-png-image_21265162.png"
                        alt="Logo"
                        class="h-5 w-5 object-contain"
                    />
                </div>
                <div class="flex flex-col leading-tight">
                    <span class="text-sm font-semibold tracking-wide text-slate-200 uppercase"> Pizza app </span>
                    <span class="text-[11px] text-slate-200"> Fresh • Fast • Hot </span>
                </div>
            </div>

            <!-- Right: Address -->
            <div class="hidden text-right text-xs leading-snug text-slate-200 sm:block">
                <div class="font-medium text-slate-200">Negrijeva 6</div>
                <div class="text-[11px] text-slate-200">52100 Pula</div>
            </div>

            <div v-if="!korisnik">
                <RouterLink to="/registracija"
                    class="mb-4 inline-block bg-orange-500 px-4 py-2 rounded-xl hover:bg-orange-600 text-white">
                    Registracija
                </RouterLink>

                <RouterLink to="/prijava"
                    class="mb-4 inline-block bg-orange-500 px-4 py-2 rounded-xl hover:bg-orange-600 text-white">
                    Prijava
                </RouterLink>
            </div>
            <div v-else class="flex items-center gap-4 text-slate-200">
                <span class="font-semibold">👋 {{ korisnik }}</span>
                <RouterLink to="/narudzbe"
                    class="mb-4 inline-block bg-orange-500 px-4 py-2 rounded-xl hover:bg-orange-600 text-white">
                    Vaše narudžbe
                </RouterLink>
            </div>
        </div>
    </header>
</template>
<script setup>
    import { ref, onMounted } from 'vue'
    import axios from 'axios'

    const korisnik = ref(null)

    async function ucitajKorisnika() {
        try {
            const res = await axios.get('http://localhost:3000/user/ja')
            korisnik.value = res.data.ime
        } catch (err) {
            korisnik.value = null
        }
    }

    onMounted(ucitajKorisnika)
</script>