import papa from 'papaparse';
import fs from "node:fs";

// Læs CSV-filen som tekst
const fileContent = fs.readFileSync('Food Waste data and research - by country.csv', 'utf-8');

// Parse CSV til objekt-array med headers
const parsedData = papa.parse(fileContent, {
    header: true,
})

// Liste over lande vi vil filtrere på
let lande = ['Denmark', 'Norway', 'Sweden', 'Germany'];

// Filtrer kun de rækker hvor landet er i vores liste
let filtereretData = parsedData.data.filter(row => lande.includes(row.Country));

// Laver et nyt array med kun de felter vi vil bruge (og konverter til tal hvor nødvendigt)
let result = filtereretData.map(row => {
    return {
        Country: row.Country,
        'combined figures': Number(row['combined figures (kg/capita/year)']),
        'Household estimate': Number(row['Household estimate (kg/capita/year)']),
        'Household tonnes': Number(row['Household estimate (tonnes/year)']),
        'Retail estimate': Number(row['Retail estimate (kg/capita/year)']),
        'Retail tonnes': Number(row['Retail estimate (tonnes/year)']),
        'Food service estimate': Number(row['Food service estimate (kg/capita/year)']),
        'Food service tonnes': Number(row['Food service estimate (tonnes/year)']),

    };
});

// Skriv resultatet til en JSON-fil
fs.writeFileSync('filteretlande.json', JSON.stringify(result, null, 2));

