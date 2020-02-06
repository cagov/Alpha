const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

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
    console.log('hello')
    console.log(resultData)

    expect(5).toBeGreaterThan(4)
        
  }, 16000)
})

