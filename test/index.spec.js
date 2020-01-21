/**
 * @name get review basic page interactivity
 *
 * @desc Basic smoke tests for alpha site
 */
const puppeteer = require('puppeteer');

const express = require('express')
const app = express()
const port = 1337
let server;

/*
More info for writing tests:

Ways to use expect with jest: https://jestjs.io/docs/en/expect

All the stuff you can do with puppeteer: https://github.com/puppeteer/puppeteer/blob/master/docs/api.md
*/

let page;
let browser;
// let hostname = 'https://staging.alpha.technology.ca.gov';
let hostname = 'http://localhost:1337';
const width = 1200;
const height = 800;

beforeAll(async () => {
  app.use('/', express.static('public', {}));
  server = app.listen(port, () => console.log(`Example app listening on...\nhttp://localhost:${port}`))
  
  browser = await puppeteer.launch({
    headless: true,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});

describe("homepage", () => {
  test("page has some links on it", async () => {
    await page.goto(hostname);
    await page.waitForSelector(".jumbotron");
    
    let links = await page.$$eval('a', anchors => { return anchors })
    expect(links.length).toBeGreaterThan(4);

  }, 16000);
});

describe("minimum wage", () => {
  test("autocomplete works", async () => {
    await page.goto(hostname+'/services/find-minimum-wage-your-city/');
    await page.waitForSelector(".city-search");
    await page.type(".city-search", '9454');

    await page.waitForSelector("#awesomplete_list_1 li");
    let listitems = await page.$$eval('#awesomplete_list_1 li', listitems => { return listitems });
    expect(listitems.length).toBeGreaterThan(1);

    await page.type(".city-search", '1');
    await page.click('#submit-form');

    await page.waitForFunction(
      'document.querySelector("#answer").innerText.includes("Hayward")'
    );

    
    let answers = await page.$$eval('#answer h4', answers => { return answers });
    expect(answers.length).toBeGreaterThan(0);

  }, 16000);
});

afterAll(() => {
  browser.close();
  server.close();
});