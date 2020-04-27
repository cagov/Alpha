import { fixture, expect } from '@open-wc/testing';

import '../index.js';

function elementExists (selector) {
  return new Promise(resolve => {
    function checkForElement (selector, callback) {
      if (document.querySelector(selector)) {
        callback();
      } else {
        setTimeout(() => {
          checkForElement(selector, callback);
        }, 1000);
      }
    }

    checkForElement(selector, function () {
      resolve(true);
    });
  });
}

describe('renders', function () {
  it('an element', async () => {
    const el = await fixture(`<cwds-lookup 
    data-search-api="https://api.alpha.ca.gov/CaZipCityCountyTypeAhead?citymode=false&countymode=true&q=" 
    data-label="Please enter city or zip code"
    data-button-label="Find health plan"
  >
  </cwds-lookup>`);
    await elementExists('form');
    expect(el.querySelectorAll('form').length).to.be.above(0);
  });
});
