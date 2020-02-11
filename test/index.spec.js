/**
 * @name get review basic page interactivity
 *
 * @desc Basic smoke tests for alpha site
 */
const puppeteer = require('puppeteer')

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

beforeAll(async () => {
  app.use('/', express.static('public', {}))
  server = app.listen(port, () => console.log(`Example app listening on...\n${hostname}`))
  
  browser = await puppeteer.launch({
    headless: true,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  })
  page = await browser.newPage()
  await page.setViewport({ width, height })
})

describe("homepage", () => {
  test("page has some links on it", async () => {
    await page.goto(hostname)
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

describe("state holidays", () => {
  test("state holidays", async () => {
    await page.goto(hostname+'/services/state-california-employee-holidays/');
    await page.click("cwds-accordion button");
    
    let answers = await page.$$eval('.card-body tr', answers => { return answers });
    expect(answers.length).toBeGreaterThan(0);
   
  }, 16000);

});


describe("language test", () => {
  test("spanish", async () => {
    await page.goto(hostname)
    await page.waitForSelector(".jumbotron")
    await page.click('#dropdown-menu-button')

    let answers = await page.$$eval('.dropdown a', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);

    await page.goto(hostname+'/es/')
    await page.waitForSelector(".jumbotron")
    
    const links = await page.$$eval('a', anchors => anchors )
    expect(links.length).toBeGreaterThan(4)

  }, 16000)

})

describe("Cal Grant", () => {
  test("Cal Grant", async () => {
    await page.goto(hostname+'/apply-for-cal-grant/')
    await page.click("cwds-step-list")
    
    let answers = await page.$$eval('.col-md-8 li', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);
   
  }, 16000)

})

describe("Disability", () => {
  test("Disability", async () => {
    await page.goto(hostname+'/apply-for-disability-insurance-benefits/')
    await page.click("cwds-step-list")
    
    let answers = await page.$$eval('.details li', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);
   
  }, 16000)

})

describe("licensed contractor", () => {
  test("licensed contractor", async () => {
    await page.goto(hostname+'/services/hire-licensed-contractor-home-improvements/')
    await page.click("cwds-step-list")
    
    let answers = await page.$$eval('.col-md-9 li', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);
   
  }, 16000)

})

describe("birth cert", () => {
  test("birth cert", async () => {
    await page.goto(hostname+'/services/request-birth-certificate/')
    
    let answers = await page.$$eval('.container ul', answers => { return answers })
    expect(answers.length).toBeGreaterThan(0);
   
  }, 16000)

})


describe("mobile", () => {
  test("fb mobile", async () => {
    await page.setViewport({ width:400, height:1200 })
    await page.goto(hostname+'/services/find-food-banks-near-you/')
    await page.waitForSelector(".city-search")
    await page.type(".city-search", '9582')

    await page.waitForSelector("#awesomplete_list_1 li")
    let listitems = await page.$$eval('#awesomplete_list_1 li', listitems => { return listitems });
    expect(listitems.length).toBeGreaterThan(1)

    await page.type(".city-search", '1')
    await page.click('button[type="submit"]')

    await page.waitForFunction(
      'document.querySelectorAll(".js-nearest-results li").length'
      )
    let answers = await page.$$eval('.js-nearest-results li', answers => { return answers });
    expect(answers.length).toBeGreaterThan(0);

  }, 16000);

})


describe("lane closures", () => {
  test("lane closures", async () => {
    await page.goto(hostname+'/check-lane-closures/')
    await page.waitForSelector("#geocoder")
    await page.type("#geocoder input", '95825')
    await page.click('.mapboxgl-ctrl-geocoder--suggestion-title')
    await page.type(".js-geocoder-start input", '95670')
    await page.click('.mapboxgl-ctrl-geocoder--suggestion-title')
    await page.waitForSelector("#geocoder")
    await page.waitForFunction(
      'document.querySelectorAll(".obstructions-major a").length'
      )
    let answers = await page.$$eval('.obstructions-major a', answers => { return answers });
    expect(answers.length).toBeGreaterThan(0);

    
  }, 16000)

})

afterAll(() => {
  browser.close()
  server.close()
})
