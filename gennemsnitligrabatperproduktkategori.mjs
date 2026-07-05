import fs from "node:fs";
let rawData = fs.readFileSync('madspild8000.json','utf-8'); // læser json-filen ind som en tekststreng
let data = JSON.parse(rawData); //konvertere json-tekst til et javascript objekt/array


let categoriesOfInterest = [ // laver en liste over de kategorier jeg er interesseret i at analyser
    "Mejeri & køl",
    "Brød & kager",
    "Kød & fisk",
    "Drikkevarer",
]

let categoryDiscounts = {}; //oprettet et tom objekt
categoriesOfInterest.forEach(function (cat){ // for hver kategori i categoriesOfInterest opretter den et objekt i categoryDiscounts med to felter totalDiscount og itemCount
    categoryDiscounts[cat] = {totalDiscount: 0, itemCount: 0}; //bruges til at samle rabatdata og antal vare pr kategori.
})

data.forEach(function(allshops) { // går gennem alle butikkers data
    let filteredItems = allshops.clearances.filter(function(item) { // filterer produkterne fra hver butik, så jeg kun får de produkter der er relevante
        return ( // betingelserne sikre at item har en produktkategori, at kategorien er på dansk og den er i en af de kategorier vi er interesseret i.
            item.product &&
            item.product.categories &&
            item.product.categories.da &&
            categoriesOfInterest.some(cat => item.product.categories.da.includes(cat)) //jeg bruger some til at tjekke om en given produktkategori indeholder mindst én af de kategorier, jeg er interesseret i.
        );
    });

    // 5. Beregn rabatter for de filtrerede varer
    filteredItems.forEach(function (item) { // gennemgår kun de filterede produkter
        let category = item.product.categories.da; //gemmer den danske kategori tekst i en variabel
        let discount = item.offer.percentDiscount; // henter procent.rabatten på det aktuelle produkt.


        let matchedCategory = categoriesOfInterest.find(cat => category.includes(cat) // // finder ud af præcis hvilken kategori fra listen som produktets kategori matcher. jeg bruger den til at tjekke om teksten indeholder et bestemt ord eller delstreng.
        );

        // Læg rabatten til totaldiscount og tæller én vare mere i itemcount
        categoryDiscounts[matchedCategory].totalDiscount += discount;
        categoryDiscounts[matchedCategory].itemCount++;
        console.log("Kategori:", category, "Rabat:", discount);
    });
});

let categoryGennemsnit = {}; //opretter et nyt objekt
categoriesOfInterest.forEach(function(cat){ // for hver kategori beregner den gennemsnitsrabatten ved at dividere totalDiscount med Itemcount
if (categoryDiscounts[cat].itemCount > 0){ // hvis der ikke er nogen vare i kategorien, sættes værdien til null
    categoryGennemsnit[cat] = (categoryDiscounts[cat].totalDiscount/categoryDiscounts[cat].itemCount).toFixed(2); // tofixed: den retunere en string med tallet i det ønskede format. 2 betyder at der er to decimaler med.
} else {
    categoryGennemsnit[cat] = null;
}

});
console.log(categoryGennemsnit)

let gennemsnitligrabatperperoduktkategori = JSON.stringify(categoryGennemsnit, null, 2);
fs.writeFileSync('gennemsnitsrabatter.json',gennemsnitligrabatperperoduktkategori, 'utf-8');

/*
jeg bruger forEach til at gennemløbe arrayet og bruge den til at tælle varer, summere rabatter og beregne gennemsnit, uden at skulle lave et nyt array.
foreach: En metode, som kører en funktion for hvert element i et array. Den ændrer ikke arrayet og returnerer ikke noget.

filter er en metode, der laver et nyt array med kun de elementer, som opfylder en bestemt betingelse.
For at finde de produkter i data, som tilhører de kategorier, jeg er interesseret i. Filter fjerner alt, der ikke matcher dine kriterier

filter bruges til at skabe et nyt array med kun de elementer, du vil arbejde videre med (fx produkter inden for bestemte kategorier).
forEach bruges derefter til at gennemløbe disse valgte elementer og udføre handlinger, som at tælle rabatter og antal.


some: En metode, der returnerer true hvis mindst ét element i arrayet opfylder en betingelse.
jeg bruger some til at tjekke om en given produktkategori indeholder mindst én af de kategorier, jeg er interesseret i.

includes: En metode der tjekker, om en string (eller et array) indeholder en bestemt substring (eller element). Returnerer true eller false.
jeg bruger den til at tjekke om teksten indeholder et bestemt ord eller delstreng.

find: Returnerer det første element i et array, der opfylder en bestemt betingelse, ellers undefined.
jeg bruger den for at finde den første kategori i categoriesOfInterest-liste, som passer til produktets kategori.
 */