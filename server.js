import express from 'express' //Importerer Express-frameworket, som bruges til at oprette en HTTP-server og håndtere routing.

import fs from 'node:fs' //Importerer Node.js' fs-modul til at læse og skrive filer (file system).

const app = express() /// laver en ny express-applikation og gemmer den i app
app.use(express.json()); //middelware til at parse JSON ved post-forespørgelser
app.use(express.static('public')); //gør mappen public tilgængelig for statiske filer, så de kan tilgåes direkte via url

app.set('views', 'views') //fortæller expres, at ejs-skabloner ligger i mappen views.
app.set('view engine', 'ejs')

const categorygennemsnit = fs.readFileSync('gennemsnitsrabatter.json', 'utf-8');
const parsedCategoryGennemsnit = JSON.parse(categorygennemsnit); //parser til et javascript-objekt

const underkategoriData = fs.readFileSync('mejeriogkølvariant.json', 'utf-8');
const parsedUnderkategoriData = JSON.parse(underkategoriData); //parser til et javascript-objekt

const faerdigretVariant = fs.readFileSync('faerdigretvariant.json', 'utf-8');
const parsedFaerdigretVariant = JSON.parse(faerdigretVariant); //parser til et javascript-objekt

const specifikFilteretLande = fs.readFileSync('specifikfilteretlande.json', 'utf-8');
const parsedspecifikFilteretLande = JSON.parse(specifikFilteretLande);//parser til et javascript-objekt

//definere en get-route til forsiden
app.get('/',(req, res)=>{
    res.render('index',{ //render index filen og sender de parsed json-data med
        categoryGennemsnit: parsedCategoryGennemsnit,
        underkategoriData: parsedUnderkategoriData,
        faerdigretVariant: parsedFaerdigretVariant,

    });
});

//get-route til /sammenligning
app.get('/Sammenligning',(req, res)=>{
    res.render('index2',{
        specifikFilteretLande: parsedspecifikFilteretLande,
    });
});

app.get('/Tekniskinfrastruktur',(req, res)=>{
    res.render('indextek',{
    });
});

//post-route, request handler. bruges til at modtage data fra frontend(fetch-request)
app.post('/',(req, res)=> {
    let dataset = req.body.dataset; //henter værdien af dataset fra request-body

    let bestemtFilNavn = ''; //oprettes tom variabel, som senere indeholder navnet på den json-fil der skal læses
    if (dataset === 'Mejeri og køl') {
        bestemtFilNavn = 'mejeriogkølvariant.json';
    } else if (dataset === 'Kød og fisk') {
        bestemtFilNavn = 'kødogfiskvariant.json';
    } else {
        return res.status(400).json({error: 'Ukendt dataset'}); //hvis dataset ikke matcher nogle af de to forventede værdier, sendes der et svar tilbage til klienten med HTTP-statuskode 400
    }

    let kombineretData = fs.readFileSync(bestemtFilNavn, 'utf-8');
    let parsedKombineretData = JSON.parse(kombineretData);

    res.json(parsedKombineretData); //serveren sender nu det parsede data tilbage til klienten i JSON-format
});


app.listen(8000);