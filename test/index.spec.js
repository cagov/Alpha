/**
 * @name get review basic page interactivity
 *
 * @desc Basic smoke tests for alpha site
 */
const puppeteer = require('puppeteer');

const express = require('express');
const app = express();
const port = 1338;
const timeout = 60000; // from from 16000, also used for individual tests
jest.setTimeout(timeout);
let server;

/*
More info for writing tests:

Ways to use expect with jest: https://jestjs.io/docs/en/expect

All the stuff you can do with puppeteer: https://github.com/puppeteer/puppeteer/blob/master/docs/api.md
*/

let page;
let browser;
// let hostname = 'https://staging.alpha.technology.ca.gov'
const hostname = `http://localhost:${port}`;
const width = 1200;
const height = 800;

beforeAll(async () => {
  app.use('/', express.static('public', {}));
  server = app.listen(port, () => console.log(`Example app listening on...\n${hostname}`));

  browser = await puppeteer.launch({
    headless: true,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});

describe('homepage', () => {
  test('page has some links on it', async () => {
    await page.goto(hostname);
    await page.waitForSelector('.jumbotron');

    const links = await page.$$eval('a', anchors => anchors);
    expect(links.length).toBeGreaterThan(4);
  }, timeout);
});

describe('minimum wage', () => {
  test('autocomplete works', async () => {
    await page.goto(hostname + '/find-minimum-wage-your-city/');
    await page.waitForSelector('.city-search');
    await page.type('.city-search', '9454');

    await page.waitForSelector('#awesomplete_list_1 li');
    const listitems = await page.$$eval('#awesomplete_list_1 li', listitems => listitems);
    expect(listitems.length).toBeGreaterThan(1);

    await page.type('.city-search', '1');
    await page.click('#submit-form');

    await page.waitForFunction(
      'document.querySelector("#answer").innerText.includes("Hayward")'
    );

    const answers = await page.$$eval('#answer h2', answers => answers);
    expect(answers.length).toBeGreaterThan(0);
  }, timeout);
});

describe('food banks', () => {
  test('fb autocomplete works', async () => {
    await page.goto(hostname + '/find-food-banks-near-you/');
    await page.waitForSelector('.city-search');
    await page.type('.city-search', '9582');

    await page.waitForSelector('#awesomplete_list_1 li');
    const listitems = await page.$$eval('#awesomplete_list_1 li', listitems => { return listitems; });
    expect(listitems.length).toBeGreaterThan(1);

    await page.type('.city-search', '1');
    await page.click('button[type="submit"]');

    await page.waitForFunction(
      'document.querySelectorAll(".js-nearest-results li").length'
    );
    const answers = await page.$$eval('.js-nearest-results li', answers => { return answers; });
    expect(answers.length).toBeGreaterThan(0);
  }, timeout);
});

describe('state holidays', () => {
  test('state holidays', async () => {
    await page.goto(hostname + '/state-california-employee-holidays/');

    const answers = await page.$$eval('.card-body tr', answers => { return answers; });
    expect(answers.length).toBeGreaterThan(0);
  }, timeout);
});

describe('language test', () => {
  test('spanish', async () => {
    await page.goto(hostname);
    await page.waitForSelector('.jumbotron');
    await page.click('#dropdown-menu-button');

    const answers = await page.$$eval('.dropdown a', answers => { return answers; });
    expect(answers.length).toBeGreaterThan(0);

    await page.goto(hostname + '/es/');
    await page.waitForSelector('.jumbotron');

    const links = await page.$$eval('a', anchors => anchors);
    expect(links.length).toBeGreaterThan(4);
  }, timeout);
});

describe('Cal Grant', () => {
  test('Cal Grant', async () => {
    await page.goto(hostname + '/apply-for-cal-grant/');
    await page.click('cwds-step-list');

    const answers = await page.$$eval('.col-md-8 li', answers => { return answers; });
    expect(answers.length).toBeGreaterThan(0);
  }, timeout);
});

describe('Disability', () => {
  test('Disability', async () => {
    await page.goto(hostname + '/apply-for-disability-insurance-benefits/');
    await page.click('cwds-step-list');

    const answers = await page.$$eval('.details li', answers => { return answers; });
    expect(answers.length).toBeGreaterThan(0);
  }, timeout);
});

describe('licensed contractor', () => {
  test('licensed contractor', async () => {
    await page.goto(hostname + '/hire-licensed-contractor-home-improvements/');
    await page.click('cwds-step-list');

    const answers = await page.$$eval('.col-md-9 li', answers => { return answers; });
    expect(answers.length).toBeGreaterThan(0);
  }, timeout);
});

describe('birth cert', () => {
  test('birth cert', async () => {
    await page.goto(hostname + '/request-birth-certificate/');

    const answers = await page.$$eval('.container ul', answers => { return answers; });
    expect(answers.length).toBeGreaterThan(0);
  }, timeout);
});

describe('mobile', () => {
  test('fb mobile', async () => {
    await page.setViewport({ width: 400, height: 1200 });
    await page.goto(hostname + '/find-food-banks-near-you/');
    await page.waitForSelector('.city-search');
    await page.type('.city-search', '9582');

    await page.waitForSelector('#awesomplete_list_1 li');
    const listitems = await page.$$eval('#awesomplete_list_1 li', listitems => { return listitems; });
    expect(listitems.length).toBeGreaterThan(1);

    await page.type('.city-search', '1');
    await page.click('button[type="submit"]');

    await page.waitForFunction(
      'document.querySelectorAll(".js-nearest-results li").length'
    );
    const answers = await page.$$eval('.js-nearest-results li', answers => { return answers; });
    expect(answers.length).toBeGreaterThan(0);
  }, timeout);
});
/*
describe("lane closures", () => {
  test("lane closures", async () => {
    await page.goto(hostname+'/check-lane-closures/')
    await page.waitForSelector("#geocoder")
    await page.type("#geocoder input", '95825')
    await page.click('.mapboxgl-ctrl-geocoder--suggestion-title')
    await page.type(".js-geocoder-start input", '95670')
    await page.click('.mapboxgl-ctrl-geocoder--suggestion-title')[2]
    await page.waitForSelector("#geocoder")
    await page.waitForFunction(
      'document.querySelectorAll(".obstructions-major a").length'
      )
    let answers = await page.$$eval('.obstructions-major a', answers => { return answers });
    expect(answers.length).toBeGreaterThan(0);

  }, timeout)

})
*/

describe('contact us', () => {
  test('contact us', async () => {
    await page.goto(hostname + '/contact-us/');
    await page.waitForFunction(
      'document.querySelectorAll("#agency-group p").length'
    );
    const answers = await page.$$eval('#agency-group p', answers => { return answers; });
    expect(answers.length).toBeGreaterThan(200);
  }, timeout);
});

describe('local emergency alerts', () => {
  test('local emergency alerts', async () => {
    await page.goto(hostname + '/sign-up-for-local-emergency-alerts/');
    await page.waitForSelector('.city-search');
    await page.type('.city-search', '9582');

    await page.waitForSelector('#awesomplete_list_1 li');
    const listitems = await page.$$eval('#awesomplete_list_1 li', listitems => listitems);
    expect(listitems.length).toBeGreaterThan(1);

    await page.type('.city-search', '1');
    await page.click('button[type="submit"]');

    await page.waitForFunction(
      'document.querySelectorAll(".card-body a").length'
    );
    const answers = await page.$$eval('.card-body a', answers => { return answers; });
    expect(answers.length).toBeGreaterThan(0);
  }, timeout);
});

describe('water-quality', () => {
  test('water-quality', async () => {
    await page.goto(hostname + '/check-your-tap-water-quality/');
    await page.type('.water-location-field', '1425 14th St, Sac');
    await page.click('button[type="submit"]');
  }, timeout);
});

describe('Apply or renew online for a discounted phone service', () => {
  test('Apply or renew online for a discounted phone service', async () => {
    await page.goto(hostname + '/apply-online-discounted-phone-service/');
    await page.click('.action-link');
  }, timeout);
});

describe('find-shelter', () => {
  test('find-shelter', async () => {
    await page.goto(hostname + '/find-shelters-near-you/');
    await page.type('.city-search', '95825');
    await page.click('button[type="submit"]');
    await page.waitForFunction(
      'document.querySelectorAll(".js-nearest-results li").length'
    );
    const answers = await page.$$eval('.js-nearest-results li', answers => { return answers; });
    expect(answers.length).toBeGreaterThan(0);
  }, timeout);
});

describe("apply-for-unemployment-insurance", () => {
  test("UI - who can apply", async () => {

    await page.goto(hostname+'/apply-for-unemployment-insurance/')
    let answers = await page.$$eval('.col-lg-8 li', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);
   
  }, timeout)

})

describe("apply-for-unemployment-insurance-when-to-apply", () => {
  test("UI - when to apply", async () => {

    await page.goto(hostname+'/apply-for-unemployment-insurance/when-to-apply/')
    let answers = await page.$$eval('.col-lg-8 p', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);
   
  }, timeout)

})


describe("apply-for-unemployment-insurance-what-you-need-before-you-apply", () => {
  test("UI - what you need before", async () => {

    await page.goto(hostname+'/apply-for-unemployment-insurance/what-you-need-before-you-apply/')
    let answers = await page.$$eval('.col-lg-8 h3', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);
   
  }, timeout)

})


describe("apply-for-unemployment-insurance-how-to-apply", () => {
  test("UI - how to apply", async () => {

    await page.goto(hostname+'/apply-for-unemployment-insurance/how-to-apply/')
    let answers = await page.$$eval('.col-lg-8 cwds-accordion', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);
   
  }, timeout)

})

describe("apply-for-unemployment-insurance-after-you-apply", () => {
  test("UI - after-you-apply", async () => {

    await page.goto(hostname+'/apply-for-unemployment-insurance/after-you-apply/')
    let answers = await page.$$eval('.col-lg-8 li', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);
   
  }, timeout)

})

describe("apply-for-unemployment-insurance-update-us-every-two-weeks", () => {
  test("UI - update-us-every-two-weeks", async () => {

    await page.goto(hostname+'/apply-for-unemployment-insurance/update-us-every-two-weeks/')
    let answers = await page.$$eval('.col-lg-8 p', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);
   
  }, timeout)

})


describe("prepare-for-wildfire", () => {
  test("prepare-for-wildfire", async () => {
    await page.goto(hostname+'/prepare-for-wildfire/')

    let answers = await page.$$eval('.col-lg-8 cwds-step-list', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);

    let answers2 = await page.$$eval('.col-md-12 p', answers2 => { return answers2 })
    expect(answers2.length).toBeGreaterThan(0);
   
  }, timeout)

})


describe("considerations-after-wildfire", () => {
  test("considerations-after-wildfire", async () => {
    await page.goto(hostname+'/considerations-after-wildfire/')

    let answers = await page.$$eval('.col-lg-8 cwds-step-list', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);

    let answers2 = await page.$$eval('.col-lg-8 p', answers2 => { return answers2 })
    expect(answers2.length).toBeGreaterThan(0);
   
  }, timeout)

})


afterAll(() => {
  browser.close();
  server.close();
});
