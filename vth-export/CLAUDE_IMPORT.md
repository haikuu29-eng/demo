# VTH Bouwtoezicht App — Import instructies voor Claude Code

## Wat is dit?

Een volledig werkende offline webapp voor gemeentelijk bouwtoezicht (VTH).
Gebouwd als single-file HTML/CSS/JS app, draait in elke browser zonder server.

---

## Bestandsstructuur

```
vth-export/
├── CLAUDE_IMPORT.md          ← dit bestand
├── index.html                ← de volledige app (258KB)
├── pdfjs.min.js              ← PDF.js library (313KB, voor vergunning import)
├── pdfjs.worker.min.js       ← PDF.js worker (1.1MB, voor vergunning import)
└── DATAMODEL.md              ← beschrijving van alle datastructuren
```

---

## Hoe importeren in Claude Code

1. Kopieer de map `vth-export/` naar je werkdirectory
2. Open `index.html` als startpunt
3. Alle logica zit in één bestand — zie sectie-commentaar voor navigatie

---

## Architectuur

- **Framework**: Vanilla JS (geen React/Vue), CSS variabelen, localStorage
- **Opslag**: localStorage (key: `vth_projecten`, `vth_fotos`, `vth_settings`)
- **PDF export**: `window.print()` met print CSS, bestandsnaam via `document.title`
- **PDF import**: PDF.js (pdfjs.min.js + pdfjs.worker.min.js)
- **Offline**: 100% — geen externe requests behalve initieel laden van de pagina

---

## Codestructuur in index.html

Het bestand is opgebouwd in duidelijke secties, elk met commentaar:

```
SECTIE                          REGELS (ca.)
─────────────────────────────────────────────
CSS Reset & Design tokens       1 - 100
Component CSS                   100 - 800
Print CSS                       800 - 900
HTML Schermen                   900 - 1500
  - screen-projectList
  - screen-projectForm
  - screen-projectDetail
  - screen-controleForm
  - screen-controleDetail
  - screen-printReport
  - screen-pdfImport
  - screen-settings
Modals & Popups                 1500 - 1600
  - onderwerpModal
  - pdfToewijzingPopup
JavaScript                      1600 - 4391
  - Constanten & keuzelijsten
  - BBL_ARTIKELEN dataset (79 artikelen)
  - Toetsniveaus (BWTinfo Cat. II)
  - State variabelen
  - Storage helpers
  - Navigatie
  - Project CRUD
  - Controle CRUD
  - Onderwerp logica
  - Foto logica
  - Bbl zoekfunctie
  - PDF tekstextractie (PDF.js)
  - Rapport generatie
  - Export/import
  - Helpers
```

---

## Datamodel

Zie `DATAMODEL.md` voor de volledige beschrijving.

Kort overzicht van localStorage keys:

| Key | Type | Beschrijving |
|-----|------|-------------|
| `vth_projecten` | Array | Alle projecten met controles genest |
| `vth_fotos` | Array | Foto's als base64 (gekoppeld aan controle/onderwerp) |
| `vth_settings` | Object | Gemeentenaam, toezichthouder, logo |

---

## Uitbreidingsmogelijkheden

- [ ] Meer Bbl-artikelen toevoegen aan `BBL_ARTIKELEN` array
- [ ] Synchronisatie met backoffice via REST API
- [ ] Kaartintegratie (coördinaten zijn al opgeslagen)
- [ ] Meerdere gebruikers/gemeenten
- [ ] iOS native app wrapper (WKWebView)
- [ ] Android native app wrapper (WebView in de Android skelet-app)
