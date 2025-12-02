<script setup>
    // app/pizza-vue/src/components/PizzaList.vue
    import { ref, onMounted } from 'vue';
    import axios from 'axios';

    const odabrana_pizza = ref(null); // reaktivna varijabla za pohranu naziva odabrane pizze

    function odaberiPizzu(pizza_naziv) {
        odabrana_pizza.value = pizza_naziv; // postavljanje naziva odabrane pizze
        console.log('Odabrana pizza:', odabrana_pizza.value); // ispis u konzolu
    }

    const myPromise = new Promise((resolve, reject) => {
        // asinhroni kod koji će na kraju pozvati resolve() ili reject() ovisno o ishodu
        let success = true; // primjer uvjeta
        if (success) {
            resolve('Uspjeh!'); // poziva se ako je operacija uspješna
        } else {
            reject('Greška!'); // poziva se ako je došlo do greške
        }
    });

    const pizze = ref([]); // reaktivna varijabla za pohranu podataka o pizzama

    onMounted(() => {
        axios
            .get('http://localhost:3000/pizze')
            .then(response => {
                pizze.value = response.data; // pohrana podataka o pizzama u reaktivnu varijablu
            })
            .catch(error => {
                console.error('Greška pri dohvaćanju podataka o pizzama:', error);
            });
    });
    console.log(pizze.value); 

    async function fetchPizze() {
        try {
            const response = await axios.get('http://localhost:3000/pizze'); // dodajemo await kako bi sačekali odgovor asiknrone funkcije
            pizze.value = response.data; // pohrana podataka o pizzama u reaktivnu varijablu
            console.log(pizze.value); // ispisuje podatke o pizzama nakon dohvaćanja HTTP odgovora
        } catch (error) {
            console.error('Greška pri dohvaćanju podataka o pizzama:', error);
        }
    }
    // u ovom slučaju onMounted ne treba biti async zato što ne koristimo await direktno unutar njega
    onMounted(() => {
        fetchPizze(); // pozivanje funkcije za dohvaćanje podataka o pizzama
    });
</script>

<template>
    <div class="mx-auto bg-linear-to-br min-h-screen p-8  bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="pizza in pizze"
    :key="pizza.id"
    @click="odaberiPizzu(pizza.naziv)"
    :class="[
          'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
          odabrana_pizza === pizza.naziv
            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
            : 'hover:scale-[1.01]',
        ]">
                <div class="w-full h-48 flex items-center justify-center bg-inherit">
                    <img src="https://www.freeiconspng.com/uploads/pizza-png-1.png" alt="Pizza Image 3" class="w-full h-full object-contain" />
                </div>

                <div class="p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <h2 class="text-lg font-bold text-orange-500 tracking-wide">{{pizza.naziv}}</h2>

                        <div class="flex space-x-2">
                            <div v-for="sastojak in pizze.sastojci" :key="sastojak" class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">{{ sastojak }}</div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Mala</span>
                            <span>{{pizza.cijene.mala}}</span>
                        </div>

                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Srednja</span>
                            <span>{{pizza.cijene.srednja}}</span>
                        </div>

                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Jumbo</span>
                            <span>{{pizza.cijene.jumbo}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>