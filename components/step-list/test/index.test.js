import { fixture, expect } from '@open-wc/testing';

import '../index.js';

function resolveAfter2Seconds (x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 1000 * x);
  });
}

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
    const el = await fixture(`<cwds-step-list>
    <ul class="list-group list-group-flush">
      <li class="list-group-item lead unstyled list-group-item-action">
        <button type="button" class="step-description">
          <span class="list-number">1</span>
          <span class="bold">Decide what type of contractor you need</span>
        </button><span class="show">Show</span><span class="hide">Hide</span>
        <div class="details"><span class="step-interior">
            <br>
            <p><strong>General Engineering Contractors</strong> and <strong>General Building Contractors</strong>
              usually manage subcontractors for a job.</p>
            <p><strong>Specialty Contractors</strong> are often hired to do a single job, such as roofing or
              plumbing.</p>
            <p><a href="http://cslb.ca.gov/About_Us/Library/Licensing_Classifications/">Choose the type of
                contractor you need</a></p>
          </span></div>
      </li>
      <li class="list-group-item lead unstyled list-group-item-action">
        <button type="button" class="step-description">
          <span class="list-number">2</span>
          <span class="bold">Check if you need a building permit</span>
        </button><span class="show">Show</span><span class="hide">Hide</span>
        <div class="details"><span class="step-interior">
            <br>
    <p>You must get a building permit from your local building department for new construction, remodeling, or repairs.</p>
            <a
              href="https://www.cslb.ca.gov/Consumers/Hire_A_Contractor/Building_Permit_Requirements.aspx">Check
              with your local building department</a>
          </span>
        </div>
      </li>
    </ul>
  </cwds-step-list>`);
    const results = await elementExists('ul');
    expect(el.querySelectorAll('ul li').length).to.be.above(1);
  });
});
