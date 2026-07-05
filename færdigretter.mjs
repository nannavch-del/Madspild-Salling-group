import fs from "node:fs";

let rawData = fs.readFileSync('madspild8000.json', 'utf-8'); // Læser JSON-filen ind som en tekststreng
let data = JSON.parse(rawData); // Konverterer JSON-tekst til et JavaScript objekt/array

let ønskedeVarianter = [ //opretter et array med mine ønskede varianter
    "Middagsretter",
    "Måltidssalater",
    "Alternativer til kød",
    "Sandwiches & wraps",
    "Supper",
]
let faerdigretterCount = {}; // Opretter et tomt objekt til at gemme optællingen af færdigretter

ønskedeVarianter.forEach(function (variant) { // Går gennem hvert element i data-arrayet og siger den skal starte ved indexplads 0
    faerdigretterCount[variant] = 0;
});

data.forEach(function (allshops){ // går gennem hvert element i arrayet
    let filtereretfaerdigret = allshops.clearances.filter(function (ucat) { //finder de prisnedsættelser der kun har produkter hvor kategorierne inkludere "færdigretter på køl"
        return (
            ucat.product &&
            ucat.product.categories &&
            ucat.product.categories.da &&
            ucat.product.categories.da.includes("Færdigretter på køl")
            );
    });
        filtereretfaerdigret.forEach(function (ucat){ //løber gennem hvert filteret element
         let sti = ucat.product.categories.da; //henter stien til kategorier for det aktuelle produkt i da
         let opdel = sti.split(">"); //opdeler kategoristien i dele

         let bestemtUcat = null; //opstiller en variable til at gemme den specifikke kategori
         for (let i = 2; i < opdel.length; i++){ //starter en løkke fra det tredje element i opdelt sti(starter fra index 2)
             if (ønskedeVarianter.includes(opdel[i])){ //tjekker om de ønskede varianter inkludere den aktuelle del af kategoristien
                 bestemtUcat = opdel[i]; //gemmer den specifikke kategori
                 break; //stopper løkken, når den ønskede variant er fundet.
             }
         }
         if (bestemtUcat){ //tjekker om der blev fundet en specifik kategori
             faerdigretterCount[bestemtUcat]++; //øger tælleren for den specifikke kategori
         }
    })
})


console.log(faerdigretterCount);

let faerdigretvariant = JSON.stringify(faerdigretterCount, null, 2);
fs.writeFileSync('faerdigretvariant.json', faerdigretvariant, 'utf-8');

