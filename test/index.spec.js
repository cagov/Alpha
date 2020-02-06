/**
 * @name get review basic page interactivity
 *
 * @desc Basic smoke tests for alpha site
 */
const puppeteer = require('puppeteer')
const lighthouse = require('lighthouse');

const express = require('express')
const app = express()
const port = 1338
let server

/*
More info for writing tests:

Ways to use expect with jest: https://jestjs.io/docs/en/expect

All the stuff you can do with puppeteer: https://github.com/puppeteer/puppeteer/blob/master/docs/api.md
*/

let page
let browser
// let hostname = 'https://staging.alpha.technology.ca.gov'
const hostname = `http://localhost:${port}`
const width = 1200
const height = 800

const CHROME_DEBUG_PORT = 1339;

jest.setTimeout(30000);

// Provide a nice way to assert a score for a category.
// Note, you could just use `expect(lhr.categories.seo.score).toBeGreaterThanOrEqual(0.9)`,
// but by using a custom matcher a better error report is generated.
expect.extend({
  toHaveLighthouseScoreGreaterThanOrEqual(lhr, category, threshold) {
    const score = lhr.categories[category].score;
    const auditsRefsByWeight = [...lhr.categories[category].auditRefs]
      .filter((auditRef) => auditRef.weight > 0)
      .sort((a, b) => b.weight - a.weight);
    const report = auditsRefsByWeight.map((auditRef) => {
      const audit = lhr.audits[auditRef.id];
      const status = audit.score === 1 ?
        this.utils.EXPECTED_COLOR('○') :
        this.utils.RECEIVED_COLOR('✕');
      const weight = this.utils.DIM_COLOR(`[weight: ${auditRef.weight}]`);
      return `\t${status} ${weight} ${audit.id}`;
    }).join('\n');

    if (score >= threshold) {
      return {
        pass: true,
        message: () =>
          `expected category ${category} to be < ${threshold}, but got ${score}\n${report}`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `expected category ${category} to be >= ${threshold}, but got ${score}\n${report}`,
      };
    }
  },
});

async function runLighthouse(url) {
  const result = await lighthouse(url, {
    port: CHROME_DEBUG_PORT,
    disableStorageReset: true,
    onlyCategories: ['seo'],
  });
  console.log('ran lighthouse')
  return result.lhr;
}

beforeAll(async () => {
  app.use('/', express.static('public', {}))
  server = app.listen(port, () => console.log(`Example app listening on...\n${hostname}`))
  
  browser = await puppeteer.launch({
    headless: true,
    slowMo: 80,
    args: [`--window-size=${width},${height} --remote-debugging-port=${CHROME_DEBUG_PORT}`],
    slowMo: process.env.DEBUG ? 50 : undefined
  })

  page = await browser.newPage()
  await page.setViewport({ width, height })
})

describe("homepage", () => {  
  test("page has some links on it", async () => {
    await page.goto(hostname)
    console.log('going to call run lighthouse')
    await page.waitForSelector(".jumbotron")
    
    const links = await page.$$eval('a', anchors => anchors )
    expect(links.length).toBeGreaterThan(4)

  }, 16000)
})

describe("minimum wage", () => {
  test("autocomplete works", async () => {
    await page.goto(hostname+'/services/find-minimum-wage-your-city/')
    await page.waitForSelector(".city-search")
    await page.type(".city-search", '9454')

    await page.waitForSelector("#awesomplete_list_1 li")
    const listitems = await page.$$eval('#awesomplete_list_1 li', listitems => listitems )
    expect(listitems.length).toBeGreaterThan(1)

    await page.type(".city-search", '1')
    await page.click('#submit-form')

    await page.waitForFunction(
      'document.querySelector("#answer").innerText.includes("Hayward")'
    )
    
    const answers = await page.$$eval('#answer h4', answers => answers )
    expect(answers.length).toBeGreaterThan(0)

  }, 16000)
})

describe("food banks", () => {
  test("fb autocomplete works", async () => {
    await page.goto(hostname+'/services/find-food-banks-near-you/');
    await page.waitForSelector(".city-search");
    await page.type(".city-search", '9582');

    await page.waitForSelector("#awesomplete_list_1 li");
    let listitems = await page.$$eval('#awesomplete_list_1 li', listitems => { return listitems });
    expect(listitems.length).toBeGreaterThan(1);

    await page.type(".city-search", '1');
    await page.click('button[type="submit"]');

    await page.waitForFunction(
      'document.querySelectorAll(".js-nearest-results li").length'
      );
    let answers = await page.$$eval('.js-nearest-results li', answers => { return answers });
    expect(answers.length).toBeGreaterThan(0);

  }, 16000);

});

afterAll(async () => {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
});
