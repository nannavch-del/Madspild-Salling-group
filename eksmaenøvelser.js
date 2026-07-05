async function hentMadspildData() {
    const response = await fetch(url);
    const data = await response.json();
    fs.writeFileSync('madspild.json', JSON.stringify(data));
}

async function hentMadspildData() {
    try{
        const response = await fetch(url);
        if (!response.ok){
            console.warn("api kaldet virker ikke", response.status)
            return;
        }
        const data = await response.json();
        fs.writeFileSync('madspild.json', JSON.stringify(data));
    } catch (error){
        console.log("det virker ikke")
    }
}













/* Funktionen er asynkron, hvilket betyder, at den kan bruge await til at vente på, at asynkrone operationer (f.eks. netværkskald) afsluttes.
Her foretages et HTTP-kald til den angivne url, og funktionen venter (await) på svar fra serveren.
fetch returnerer et Response-objekt.
! er den logiske NOT-operator i JavaScript. Den vender værdien om: Hvis noget er true, bliver det false. Hvis noget er false, bliver det true
Her tjekkes, om serveren har returneret et gyldigt svar (statuskode 200–299).
Hvis ikke, logges en advarsel i konsollen med statuskoden, og funktionen afsluttes.
catch (error) { console.log("noget gik galt") }
Hvis der opstår en fejl i fetch, i parsing eller ved skrivning af filen, fanges den her.
Der logges en simpel fejlmeddelelse i konsollen.

 */














