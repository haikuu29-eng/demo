const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const URL = 'http://localhost:8765/';
const OUT = '/home/user/demo/screenshots';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

// Realistische testdata
const testData = {
  projects: [
    {
      id: 'p1', naam: 'het plaatsen van een dakkapel', zaaknummer: '1088724',
      typeZaak: 'Bouwvergunning', status: 'Open',
      straat: 'Johann Strausslaan 24', postcode: '5583XX', plaats: 'Waalre',
      aangemaakt: '2025-10-09',
      lat: 51.398, lng: 5.464,
      voorschriften: [
        { tekst: 'Bouwhoogte maximaal 3,5 meter', afgevinkt: true },
        { tekst: 'Gebruik brandwerend materiaal voor de dakbedekking', afgevinkt: false },
        { tekst: 'Minimale afstand tot zijgevel 1 meter', afgevinkt: false }
      ],
      controles: [
        { id: 'c1', datum: '2025-11-15', type: 'Eerste opname', inspecteur: 'C. Krielen', resultaat: 'Akkoord',
          onderwerpen: [
            { naam: 'Fundering', beschrijving: 'Fundering conform tekening', resultaat: 'Akkoord', voorschriftResultaten: {} }
          ], opmerkingen: 'Bouwstart conform planning.' }
      ]
    },
    {
      id: 'p2', naam: 'het isoleren van een woonhuis', zaaknummer: '1077902',
      typeZaak: 'Bouwvergunning', status: 'In uitvoering',
      straat: 'De Kranssen 36', postcode: '5581AG', plaats: 'Waalre',
      aangemaakt: '2025-09-12',
      lat: 51.402, lng: 5.459,
      voorschriften: [
        { tekst: 'Rc-waarde minimaal 3,5 m²K/W', afgevinkt: true },
        { tekst: 'Dampscherm correct aanbrengen', afgevinkt: true }
      ],
      controles: [
        { id: 'c2', datum: '2025-10-20', type: 'Tussentijdse controle', inspecteur: 'C. Krielen', resultaat: 'Akkoord',
          onderwerpen: [
            { naam: 'Isolatiemateriaal', beschrijving: 'PIR-platen 120mm aanwezig', resultaat: 'Akkoord', voorschriftResultaten: {} }
          ], opmerkingen: '' },
        { id: 'c3', datum: '2025-11-28', type: 'Eindopname', inspecteur: 'C. Krielen', resultaat: 'Onder voorbehoud',
          onderwerpen: [
            { naam: 'Ventilatie', beschrijving: 'Ventilatieroosters ontbreken in 2 slaapkamers', resultaat: 'Niet akkoord', voorschriftResultaten: {} }
          ], opmerkingen: 'Herstel vereist binnen 4 weken.' }
      ]
    },
    {
      id: 'p3', naam: 'het verbouwen en uitbreiden van een woonhuis', zaaknummer: '977548',
      typeZaak: 'Bouwvergunning', status: 'Opgeleverd',
      straat: 'Valkenswaardseweg 15', postcode: '5582VA', plaats: 'Waalre',
      aangemaakt: '2025-01-17',
      lat: 51.394, lng: 5.471,
      voorschriften: [
        { tekst: 'Uitbouw maximaal 4 meter achterwaarts', afgevinkt: true },
        { tekst: 'Constructieberekening aanwezig', afgevinkt: true }
      ],
      controles: [
        { id: 'c4', datum: '2025-03-10', type: 'Eerste opname', inspecteur: 'C. Krielen', resultaat: 'Akkoord', onderwerpen: [], opmerkingen: '' },
        { id: 'c5', datum: '2025-06-22', type: 'Eindopname', inspecteur: 'C. Krielen', resultaat: 'Akkoord', onderwerpen: [], opmerkingen: 'Alles conform vergunning.' }
      ]
    },
    {
      id: 'p4', naam: 'het tijdelijk plaatsen van een woonunit', zaaknummer: '1026092',
      typeZaak: 'Bouwvergunning', status: 'Open',
      straat: 'Willibrorduslaan 112', postcode: '5581GH', plaats: 'Waalre',
      aangemaakt: '2025-04-08',
      lat: 51.408, lng: 5.456,
      voorschriften: [
        { tekst: 'Plaatsing maximaal 2 jaar toegestaan', afgevinkt: false },
        { tekst: 'Aansluiting nuts conform NEN-normen', afgevinkt: false }
      ],
      controles: []
    },
    {
      id: 'p5', naam: 'het wijzigen van een bestaande inrit', zaaknummer: '1040050',
      typeZaak: 'Bouwvergunning', status: 'Afgehandeld',
      straat: 'Ekenrooisestraat 16', postcode: '5583TG', plaats: 'Waalre',
      aangemaakt: '2025-06-05',
      lat: 51.396, lng: 5.467,
      voorschriften: [],
      controles: [
        { id: 'c6', datum: '2025-07-14', type: 'Eindopname', inspecteur: 'C. Krielen', resultaat: 'Akkoord', onderwerpen: [], opmerkingen: 'Inrit conform vergunning aangelegd.' }
      ]
    }
  ]
};

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function screenshot(page, name, selector) {
  const file = path.join(OUT, name + '.png');
  if (selector) {
    const el = await page.$(selector);
    if (el) { await el.screenshot({ path: file }); return file; }
  }
  await page.screenshot({ path: file, fullPage: false });
  console.log('📸 ' + name);
  return file;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); // iPhone formaat
  const page = await context.newPage();

  await page.goto(URL);
  await sleep(1500);

  // Inject testdata
  await page.evaluate((data) => {
    localStorage.setItem('vth_projects', JSON.stringify(data.projects));
    localStorage.setItem('vth_settings', JSON.stringify({ gemeente: 'Gemeente Waalre', inspecteur: 'C. Krielen' }));
  }, testData);

  await page.reload();
  await sleep(1500);

  // 1. Projectlijst
  await screenshot(page, '01_projectlijst');

  // 2. Projectlijst - filter Open
  await page.click('[data-filter="status-Open"]');
  await sleep(400);
  await screenshot(page, '02_projectlijst_filter_open');

  // Reset filter
  await page.click('[data-filter="all"]');
  await sleep(300);

  // 3. Kaartweergave
  await page.click('#btnKaart');
  await sleep(2000); // wacht op kaart tiles
  await screenshot(page, '03_kaartweergave');

  // Terug naar lijst
  await page.click('#btnLijst');
  await sleep(300);

  // 4. Project detail - klik op eerste project
  await page.click('.project-card:first-child');
  await sleep(600);
  await screenshot(page, '04_project_detail_basis');

  // 5. Tab Controles
  const tabs = await page.$$('.tab-btn');
  if (tabs.length > 1) {
    await tabs[1].click();
    await sleep(400);
    await screenshot(page, '05_project_controles');
  }

  // 6. Tab Voortgang
  if (tabs.length > 2) {
    await tabs[2].click();
    await sleep(400);
    await screenshot(page, '06_project_voortgang');
  }

  // 7. Terug, klik tweede project (In uitvoering) voor controle detail
  await page.click('#backBtn');
  await sleep(400);
  await page.click('.project-card:nth-child(2)');
  await sleep(600);
  await screenshot(page, '07_project_detail_inuitvoering');

  // Tab controles
  const tabs2 = await page.$$('.tab-btn');
  if (tabs2.length > 1) {
    await tabs2[1].click();
    await sleep(400);
    await screenshot(page, '08_controles_lijst');
  }

  // 8. Open controle detail
  const controleKaart = await page.$('.controle-card');
  if (controleKaart) {
    await controleKaart.click();
    await sleep(500);
    await screenshot(page, '09_controle_detail');
  }

  // 9. Terug naar lijst, open XLS import modal
  await page.goto(URL);
  await sleep(1500);
  await page.evaluate((data) => {
    localStorage.setItem('vth_projects', JSON.stringify(data.projects));
  }, testData);
  await page.reload();
  await sleep(1200);

  await page.click('#fabImport');
  await sleep(600);
  await screenshot(page, '10_xls_import_leeg');

  // 10. Instellingen
  await page.keyboard.press('Escape');
  await page.click('[onclick="showScreen(\'settings\')"]');
  await sleep(400);
  await screenshot(page, '11_instellingen');

  // Desktop-brede screenshots (voor presentatie)
  await context.close();
  const contextDesktop = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pageD = await contextDesktop.newPage();
  await pageD.goto(URL);
  await sleep(1500);
  await pageD.evaluate((data) => {
    localStorage.setItem('vth_projects', JSON.stringify(data.projects));
    localStorage.setItem('vth_settings', JSON.stringify({ gemeente: 'Gemeente Waalre', inspecteur: 'C. Krielen' }));
  }, testData);
  await pageD.reload();
  await sleep(1500);

  await screenshot(pageD, 'desktop_01_projectlijst');

  await pageD.click('#btnKaart');
  await sleep(2500);
  await screenshot(pageD, 'desktop_02_kaart');

  await pageD.click('#btnLijst');
  await sleep(300);
  await pageD.click('.project-card:nth-child(2)');
  await sleep(600);
  await screenshot(pageD, 'desktop_03_detail_basis');

  const tabsD = await pageD.$$('.tab-btn');
  if (tabsD.length > 1) { await tabsD[1].click(); await sleep(400); await screenshot(pageD, 'desktop_04_controles'); }
  if (tabsD.length > 2) { await tabsD[2].click(); await sleep(400); await screenshot(pageD, 'desktop_05_voortgang'); }

  await pageD.click('#backBtn');
  await sleep(300);
  await pageD.click('#fabImport');
  await sleep(600);
  await screenshot(pageD, 'desktop_06_xls_import');

  await contextDesktop.close();
  await browser.close();
  console.log('\n✅ Alle screenshots opgeslagen in', OUT);
})();
