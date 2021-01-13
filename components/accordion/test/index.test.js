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
    const el = await fixture(`<cagov-accordion>
      <div class="card">
        <div class="card-header py-20" id="heading-one">
          <button class="btn btn-link" type="button" aria-expanded="false">
            Learners
          </button>
        </div>
        <div class="card-container collapse" aria-labelledby="heading-one">
          <div class="card-body">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
          </div>
        </div>
      </div>
    </cagov-accordion>`);
    await elementExists('.card-body');
    expect(el.querySelectorAll('.card-body').length).to.be.above(0);
  });
});
