# VTH Bouwtoezicht — Datamodel

Alle data wordt opgeslagen in `localStorage` van de browser.
Geen externe database, geen server.

---

## localStorage Keys

| Key | Beschrijving |
|-----|-------------|
| `vth_projecten` | Hoofdarray: alle projecten met geneste controles |
| `vth_fotos` | Array van alle foto's (base64) |
| `vth_settings` | App-instellingen (gemeente, toezichthouder) |
| `vth_logo` | Base64-string van het gemeentelogo |

---

## Project object

```javascript
{
  id: Number,                    // timestamp (Date.now())
  naam: String,                  // projectnaam
  zaaknummer: String,            // intern zaaknummer / vergunningnummer
  typeZaak: String,              // "Bouwvergunning" | "Melding handhaving" | "Handhavingsverzoek" | "Anders"
  straat: String,
  postcode: String,
  plaats: String,
  activiteiten: Array<String>,   // ["Technische bouwactiviteit", ...]
  gevolgklasse: String,          // "Gevolgklasse 1" | "2" | "3"
  initNaam: String,              // initiatiefnemer naam
  initContact: String,
  aannemerNaam: String,
  aannemerContact: String,
  status: String,                // "Open" | "In uitvoering" | "Opgeleverd" | "Afgehandeld"
  opmerkingen: String,
  voorschriften: Array<Voorschrift>,  // uit PDF-import
  controles: Array<Controle>,    // geneste controles
  aangemaakt: String             // ISO datum string
}
```

---

## Voorschrift object

```javascript
{
  tekst: String,       // tekst van het voorschrift (uit vergunning)
  afgevinkt: Boolean   // globaal afgevinkt in projectdetail
}
```

---

## Controle object

```javascript
{
  id: Number,                    // timestamp
  soort: String,                 // "Aanloopcontrole" | "Tussentijdse controle" | "Eindcontrole" |
                                 // "Controle n.a.v. melding" | "Hercontrole" | "Handhavingscontrole"
  datum: String,                 // "YYYY-MM-DD"
  tijd: String,                  // "HH:MM"
  toezichthouder: String,
  aanwezigheid: String,          // vrije tekst aanwezige partijen
  meldingsnummer: String,        // optioneel bij handhaving
  klachtOmschrijving: String,
  algemeenResultaat: String,     // "akkoord" | "akkoord-mits" | "niet-akkoord"
  samenvattingBevindingen: String,
  adviesAannemer: String,
  adviesHandhaving: String,
  onderwerpen: Array<Onderwerp>  // geneste onderwerpen/toetsmomenten
}
```

---

## Onderwerp object

```javascript
{
  onderwerpId: String,           // "o_" + timestamp (koppeling aan foto's)
  onderwerp: String,             // geselecteerde waarde uit dropdown
  naam: String,                  // weergavenaam (bij "Anders": vrij ingevuld)
  beschrijving: String,          // wat is gecontroleerd
  resultaat: String,             // "akkoord" | "akkoord-mits" | "niet-akkoord"
  afwijking: String,             // beschrijving afwijking (verplicht bij niet-akkoord)
  termijn: String,               // termijn voor herstel
  bblArtikelNr: String,          // bijv. "Art. 4.21 lid 1 Bbl"
  bblArtikelTekst: String,       // volledige wettekst van het geselecteerde lid
  toetsniveau: String,           // bijv. "C3" (uit BWTinfo toezichtprotocol)
  toetsniveauOmschrijving: String, // bijv. "Beoordeling hoofdlijnen en kenmerkende details"
  toetsniveauTijdstip: String,   // bijv. "Wachtpunt"
  voorschriftResultaten: Object  // { "0": "akkoord", "1": "niet-akkoord", ... }
                                 // index = index in project.voorschriften array
}
```

---

## Foto object (in `vth_fotos`)

```javascript
{
  id: String,           // timestamp als string
  controleId: String,   // koppeling aan controle.id
  onderwerpId: String,  // koppeling aan onderwerp.onderwerpId (optioneel)
  dataUrl: String,      // "data:image/jpeg;base64,..."
  toelichting: String,
  aangemaaktOp: Number  // timestamp
}
```

---

## Settings object (in `vth_settings`)

```javascript
{
  gemeentenaam: String,    // weergegeven op rapporten
  toezichthouder: String   // standaard toezichthouder naam
}
```

Logo wordt apart opgeslagen als `vth_logo` (base64 string).

---

## BBL_ARTIKELEN dataset

79 geverifieerde Bbl-artikelen (versie 2026-01-01), opgebouwd uit:
- Hoofdstuk 2: art. 2.1, 2.2, 2.17-2.19, 2.21, 2.25
- Hoofdstuk 3: art. 3.14-3.30 (geverifieerd door gebruiker)
- Hoofdstuk 4: art. 4.2-4.4, 4.11-4.14, 4.19-4.22, 4.25-4.27, 4.34,
               4.38-4.39, 4.44-4.46, 4.51-4.53, 4.57-4.58,
               4.64-4.71, 4.78-4.79, 4.83-4.84, 4.99-4.100,
               4.101-4.102, 4.121, 4.124, 4.130, 4.148-4.149, 4.158,
               4.208, 4.213, 4.215-4.217, 4.220, 4.240-4.241

Structuur per artikel:
```javascript
{
  artikel: "4.21",
  titel: "hoogte afscheiding",
  hoofdstuk: "4",
  afdeling: "4.2",
  paragraaf: "4.2.3",
  url: "https://wetten.overheid.nl/BWBR0041297/2026-01-01#...",
  tekst: String,         // volledige tekst artikel (of lid 1 als samenvatting)
  leden: [
    { lid: "1", tekst: String },
    { lid: "2", tekst: String },
    // subleden: { lid: "4a", tekst: String }
  ]
}
```

---

## TOETSNIVEAUS_WONEN_CAT2 dataset

28 toetsmomenten uit BWTinfo Toezichtprotocol (Wonen Cat. II, €100k-€1M):

```javascript
{
  1: { code: "A3", tijdstip: "Vooroverlegpunt", diepgang: 3,
       omschrijving: "Beoordeling hoofdlijnen en kenmerkende details",
       toetsmoment: "Oriënteringsgesprek" },
  5: { code: "C3", tijdstip: "Wachtpunt", diepgang: 3,
       omschrijving: "Beoordeling hoofdlijnen en kenmerkende details",
       toetsmoment: "Fundering op palen" },
  // ... etc
}
```

Mapping van standaard onderwerpen naar toetsmomentnummer:
```javascript
ONDERWERP_TOETSMOMENT_MAP = {
  "Fundering": 4,
  "Fundering op palen": 5,
  "Brandcompartimentering": 20,
  "Vluchtwegen/nooduitgangen": 21,
  // ... 30+ mappings
}
```
