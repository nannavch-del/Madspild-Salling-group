import fs from "node:fs";

let rawData = fs.readFileSync('filteretlande.json', 'utf-8'); // Læser JSON-filen ind som en tekststreng
let data = JSON.parse(rawData); // Konverterer JSON-tekst til et JavaScript objekt/array

const filteredeLande = data.map(function (spefLand){ //går gennem hvert land i array og laver et nyt objekt med udvalgte felter. Map retunere et nyt arrat med kun de nødvendige oplysninger.
    return{
        Country: spefLand.Country,
        "Household estimate": spefLand["Household estimate"],
        "Retail estimate": spefLand["Retail estimate"],
        "Food service estimate": spefLand["Food service estimate"],
    };
});

let output = JSON.stringify(filteredeLande, null, 2);
fs.writeFileSync('specifikfilteretlande.json', output, 'utf-8');