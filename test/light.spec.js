const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

describe("homepage", () => {
  test("page has some links on it", async () => {

    async function launchChromeAndRunLighthouse(url, opts, config = null) {
      return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
        opts.port = chrome.port;
        return lighthouse(url, opts, config).then(results => {
          // use results.lhr for the JS-consumable output
          // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
          // use results.report for the HTML/JSON/CSV output as a string
          // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
          return chrome.kill().then(() => results.lhr)
        });
      });
    }
    
    const opts = {
      chromeFlags: ['--headless']
    };
    
    // Usage:
    let resultData = await launchChromeAndRunLighthouse('http://localhost:1338', opts).then(results => {
      return results;
    });

    let scores = [];
    let obj = {};
    obj.title = 'Performance';
    obj.score = resultData.categories['performance'].score;
    scores.push(obj)
    obj = {};
    obj.title = 'Accessibility';
    obj.score = resultData.categories['accessibility'].score;
    scores.push(obj)
    obj = {};
    obj.title = 'Best Practices';
    obj.score = resultData.categories['best-practices'].score;
    scores.push(obj)
    obj = {};
    obj.title = 'SEO';
    obj.score = resultData.categories['seo'].score;
    scores.push(obj)
    obj = {};
    obj.title = 'PWA';
    obj.score = resultData.categories['pwa'].score;
    scores.push(obj)

    // fs.writeFileSync('./junkscore.json',JSON.stringify(scores),'utf8');

    expect(resultData.categories['performance'].score).toBeGreaterThan(0.95)
    expect(resultData.categories['accessibility'].score).toBeGreaterThan(0.95)
        
  }, 16000)
})

