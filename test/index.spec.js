/**
 * @name get review basic page interactivity
 *
 * @desc Basic smoke tests for alpha site
 */
const puppeteer = require('puppeteer');

/*
snippets:

const stories = await page.$$eval('a.storylink', anchors => { return anchors.map(anchor => anchor.textContent).slice(0, 10) })

const title = await page.title();
expect(title).toBe(
  "Welcome to Alpha.CA.gov"
);
*/

let page;
let browser;
let hostname = 'https://staging.alpha.technology.ca.gov';
const width = 1920;
const height = 1080;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
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
});