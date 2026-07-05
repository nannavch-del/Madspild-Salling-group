import fs from 'node:fs';

let kode = "SG_APIM_53GTEWBGJA1RABY3TSJMPK8QT3V2WV2MG7BGJ5GKW52ZEJ9AY7Y0";//min egen personlige api kode
let url = "https://api.sallinggroup.com/v1/food-waste/?zip=8000" //den url vi vil sende forespørgslen til


async function hentMadSpildData(){ //async funktion der arbejder med api-kald og venter på svar
let response = await fetch(url,{ // sender en http get-request til api´en ved hjælp af fetch. await= venter på at svaret(response) kommer tilbage
    headers:{
        authorization: `Bearer ${kode}`
    }
});

let data = await response.json(); //parser svaret til et javascript-objekt eller array fra json-format. await=venter på at hele body´en er færdiglæst og konverteret

let jsonData = JSON.stringify(data, null,2);
fs.writeFileSync('madspild8000.json',jsonData, 'utf-8');
console.log("madspildsdata er gemt i json-filen");
}
hentMadSpildData();
