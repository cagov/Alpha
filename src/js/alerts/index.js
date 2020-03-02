import getCounties from './counties.js';
import * as uniqueZipJson from '../../json/unique-zips-slim.json';

if (document.querySelector('body.js-alerts')) {
  const counties = getCounties();
  const zips = uniqueZipJson.default;

  const countyNames = [];
  counties.forEach(county => {
    countyNames.push(county.name);
  });

  const awesompleteList = [...countyNames, ...zips];

  new Awesomplete('input[data-multiple]', {
    list: awesompleteList,
    filter: function (text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
    },

    item: function (text, input) {
      document.querySelector('.invalid-feedback').style.display = 'none';
      document.querySelector('.city-search').classList.remove('is-invalid');
      return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
    },

    replace: function (text) {
      var before = this.input.value.match(/^.+,\s*|/)[0];
      var finalval = before + text;
      this.input.value = finalval;
      templateHTML(finalval);
    }
  });

  document
    .querySelector('.js-alert-lookup')
    .addEventListener('submit', function (event) {
      event.preventDefault();
      document.querySelector('.invalid-feedback').style.display = 'none';
      document.querySelector('.city-search').classList.remove('is-invalid');
      var finalval = this.querySelector('input').value;
      templateHTML(finalval);
    });

  function templateHTML (inputval) {
    let isZip = false;
    if (inputval.match(/^\d+$/)) {
      // we are dealing with a zip code
      isZip = true;
      fetch('https://api.alpha.ca.gov/countyfromzip/' + inputval)
        .then(response => {
          return response.json();
        })
        .then(myzip => {
          lookupSuccess(myzip.county, inputval, isZip);
        })
        .catch(e => {
          lookupFail();
        });
    } else {
      lookupSuccess(inputval, inputval, isZip);
    }
  }

  function lookupSuccess (inputCounty, inputval, isZip) {
    let chosenCounty;
    counties.forEach(county => {
      if (county.name.toLowerCase() == inputCounty.toLowerCase()) {
        chosenCounty = county;
      }
    });
    if (!chosenCounty) {
      lookupFail();
    } else {
      const county = chosenCounty.name;
      const url = chosenCounty.url;
      document.querySelector(
        '.js-county-alert'
      ).innerHTML = `<li class="card mb-20  border-0">
    <h2>Alerts for ${inputval}</h2>
    ${(function () {
      if (isZip) {
        return `<p>Your zip code, ${inputval}, is in ${
          county.toLowerCase().indexOf('county') > -1
            ? county
            : county + ' County'
        }.</p>`;
      } else {
        return '';
      }
    })()}
      <div class="card-body bg-light">
        <a class="action-link" href="${url}">
          Sign up for ${
            county.toLowerCase().indexOf('county') > -1
              ? county
              : county + ' County'
          } alerts
        </a>
      </div>
    </li>`;
    }
  }

  function lookupFail () {
    document.querySelector('.invalid-feedback').style.display = 'block';
  }
}
