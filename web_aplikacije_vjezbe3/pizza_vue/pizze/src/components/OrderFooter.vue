<script setup>
    import { ref, onMounted  } from 'vue';
    import { computed } from 'vue';
    import axios from 'axios';


    const imeKorisnika = ref('')

    const statusUspijeh = ref("")
    const statusError = ref("")

    async function posaljiNarudzbu() {
        try {

            statusUspijeh.value = ""
            statusError.value = ""

            const podaciZaDostavu = {
                prezime: prezime.value,
                adresa: adresa.value,
                telefon: telefon.value
            };

            const odgovor = await axios.post('http://localhost:3000/narudzbe', {
                narucene_pizze: narucene_pizze.value,
                podaci_dostava: podaciZaDostavu
            });

            console.log('Narudžba uspješno poslana:', odgovor.data);
            statusUspijeh.value = odgovor.data.message;

            // Resetiraj narudžbu nakon slanja
            narucene_pizze.value = [];
        } catch (error) {
            console.error('Greška pri slanju narudžbe:', error);
            statusError.value = error.response.data.message;
        }
    }

    const ukupna_cijena_stavke = computed(() => {
        const cijenaPoKomadu = props.odabranaPizza.cijene[odabranaVelicina.value];
        return (cijenaPoKomadu * kolicina.value).toFixed(2);
    });

    const props = defineProps({
        odabranaPizza: {
            type: Object,
            required: true 
        }
    });

    const emit = defineEmits(['close']);

    const odabranaVelicina = ref('mala'); 
    const kolicina = ref(1); 


    const narucene_pizze = ref([]);
    
    function dodajUNarudzbu() {
        const novaStavka = {
            naziv: props.odabranaPizza.naziv,
            velicina: odabranaVelicina.value,
            kolicina: kolicina.value
        };
        narucene_pizze.value.push(novaStavka); 
        console.log('Naručene pizze:', narucene_pizze.value);
    }

    const prezime=ref('')
    const adresa=ref('')
    const telefon=ref('')
    
    const temp_prezime=ref('')
    const temp_adresa=ref('')
    const temp_telefon=ref('')

    const uredi=ref(false)

    function spremiAdresu() {
        if ((!temp_prezime.value && imeKorisnika.value.length===0) || !temp_adresa.value || !temp_telefon.value) {
            alert("Molimo ispunite sva polja.");
            return;
        }

        if(imeKorisnika.value.length==0){
            prezime.value = temp_prezime.value;
        }
        else{
            prezime.value = imeKorisnika.value;
        }
        adresa.value = temp_adresa.value;
        telefon.value = temp_telefon.value;

        uredi.value = false;
    }

    function ukloniStavku(index){
        narucene_pizze.value.splice(index, 1)
    }

    onMounted(async () => {
        try {
            const res = await axios.get('http://localhost:3000/user/ja')
            imeKorisnika.value = res.data.ime
        } catch (err) {
            console.log('Korisnik nije prijavljen')
        }
    })


</script>

<template>
    <footer class="fixed bottom-0 left-0 w-full border-t border-slate-600 bg-slate-800/90 backdrop-blur-lg">
        <button class="absolute top-2 right-2 text-slate-300 hover:text-white text-xl font-bold cursor-pointer" @click="emit('close')">×</button>
        
        <div class="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 md:px-6 sm:flex-row sm:items-center sm:justify-between">
            <img :src="odabranaPizza.slika_url" :alt="odabranaPizza.naziv" class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md shadow-black/40" />

            <h3 class="font-bold tracking-wide text-base sm:text-lg text-orange-400">{{ odabranaPizza.naziv }}</h3>


            <div class="flex items-center justify-center sm:justify-start flex-wrap gap-2 w-full sm:w-auto text-white">
                <button @click="odabranaVelicina = velicina"
                    v-for="(cijena, velicina) in odabranaPizza.cijene"
                    :key="velicina"
                    :class="[
                            'px-3 py-1 rounded-lg border border-slate-500 text-sm sm:text-base hover:bg-orange-500 hover:text-white transition-all cursor-pointer',
                            odabranaVelicina === velicina
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-600/40 text-white',
                        ]"
                >
                    {{ velicina }} – {{ cijena }}€
                </button>
            </div>

            <button
                @click="kolicina ? kolicina-- : kolicina = 1"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
            >
                -
            </button>

            <div class="px-3 py-1 rounded border border-slate-500 bg-slate-600/40 text-white">
                {{ kolicina }}
            </div>
            <button
                @click="kolicina ? kolicina++ : (kolicina = 1)"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
            >
                +
            </button>

            <div class="w-full sm:w-auto text-center font-semibold text-lg text-orange-400 tracking-wide">Ukupno: {{ ukupna_cijena_stavke || '0.00' }}€</div>

            <div class="flex items-center justify-center sm:justify-start flex-wrap gap-2 w-full sm:w-auto text-white">
                <button
                    @click="dodajUNarudzbu"
                    class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
                >
                    Dodaj u košaricu
                </button>
            </div>
            <button
                @click="uredi=true"
                class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
            >
                Dodaj/uredi adresu
            </button>
            <button v-if="prezime && adresa && telefon" 
                @click="posaljiNarudzbu"
                class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
            >
                Naruči
            </button>
        </div>
        
        <div v-if="narucene_pizze.length"
            class="mt-4 max-w-2xl mx-auto max-h-40 overflow-y-auto bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-600"
            >
            <h4 class="font-semibold text-lg text-white mb-2">Stavke u košarici:</h4>
            <ul class="space-y-2">
                <li
                    v-for="(stavka, index) in narucene_pizze"
                    :key="index"
                    class="flex items-center justify-between bg-slate-700/50 rounded-md p-2"
                    >
                    <div class="text-white">
                        {{ stavka.naziv }} ({{ stavka.velicina }}) x{{ stavka.kolicina }}
                    </div>
                    <div class="text-orange-400 font-semibold">
                        {{ (props.odabranaPizza.cijene[stavka.velicina] * stavka.kolicina).toFixed(2) }}€
                    </div>
                    <button @click="ukloniStavku(index)"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-800 transition-all cursor-pointer"
                    >
                        -
                    </button>
                </li>
            </ul>
        </div>

        <div v-if="statusUspijeh" class="p-2 rounded bg-green-600 text-white text-sm">
            {{ statusUspijeh }}
        </div>

        <div v-if="statusError" class="p-2 rounded bg-red-600 text-white text-sm">
            {{ statusError }}
        </div>

        <div v-if="uredi"
            class="max-w-xl mx-auto mt-4 bg-slate-800/60 p-4 rounded-lg border border-slate-600 backdrop-blur-sm">

            <h4 class="text-lg font-semibold text-white mb-3">Podaci za dostavu</h4>

            <div class="flex flex-col gap-3">

                <div v-if="imeKorisnika.length==0">
                    <input
                        v-model="temp_prezime"
                        type="text"
                        placeholder="Prezime"
                        class="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <div v-else class="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500">
                    {{ imeKorisnika }}
                </div>
                <input
                    v-model="temp_adresa"
                    type="text"
                    placeholder="Adresa"
                    class="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500"
                />

                <input
                    v-model="temp_telefon"
                    type="text"
                    placeholder="Telefon"
                    class="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500"
                />
            </div>

            <button @click="spremiAdresu"
                class="mt-4 bg-orange-500 w-full text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-orange-600 transition-all">
                Spremi adresu
            </button>
        </div>

    </footer>
</template>
