import fs from "node:fs";
let rawData = fs.readFileSync('madspild8000.json','utf-8'); // læser json-filen ind som en tekststreng
let data = JSON.parse(rawData); //konvertere json-tekst til et javascript objekt/array

let underkategori = [ // laver en liste over de kategorier jeg er interesseret i at analyser
    "Færdigretter på køl",
    "Kartoffeltilbehør",
    "Ost",
    "Yoghurt & syrnede mælkeprodukter",
    "Saucer & dressinger",
    "Smør & fedtstof",
    "Fløde & flødeskum",
    "Pølser",
    "Kolde kaffedrikke & kakao",
    "Pålægssalater",
    "Tapas & specialiteter",
    "Æg & gær",
    "Mælk",
    "Dessert & snacks",
    "Frisk pasta",
    "Fersk dej & pandekager",
]

let underkategoriCount = {}; //oprettet et tomt objekt, som jeg vil bruge til at tælle, hvor mange produkter der findes i hver underkategori.

underkategori.forEach(function (variant){
    underkategoriCount[variant] = 0; // hver underkategori starter på 0
})

data.forEach(function (allshops){ // går gennem hvor butik i datasættet, allshops repræsentere en butik
    let filteretUnderkategori = allshops.clearances.filter(function (ucat){ // filterere butikkens vare, så vi kun finder dem med kategorien mejeri og køl
        return (
            ucat.product && // sikre at der er et produkt
            ucat.product.categories && // sikre at der er kategorier
            ucat.product.categories.da && //sikre at den danske kategori findes
            ucat.product.categories.da.startsWith("Mejeri & køl") // sikre den starter med mejeri og køl
        );
    });

    filteretUnderkategori.forEach(function (ucat) { // går igennem de filterede underkategorier
        let underkategoriPath = ucat.product.categories.da; // henter hele kategori-stien som en tekststreng
        let opdel = underkategoriPath.split(">"); // splitter kategori-stien op i en liste basere på >

        let bestemtUcat = null;
        for (let i = 1; i < opdel.length; i++) {  // start fra index plads 1 fordi 0 er "Mejeri & køl"
            if (underkategori.includes(opdel[i])) { // hvis den aktuelle underkategori findes i vores liste, gemmer vi den
                bestemtUcat = opdel[i];
                break;  // stop ved første match
            }
        }
        if (bestemtUcat) { // hvis vi har fundet en bestemt underkategori, så lægger vi en til tælleren
            underkategoriCount[bestemtUcat]++;
        }
    })
});

let mejeriogkølspefvariant = JSON.stringify(underkategoriCount, null, 2);
fs.writeFileSync('mejeriogkølvariant.json', mejeriogkølspefvariant, 'utf-8');
