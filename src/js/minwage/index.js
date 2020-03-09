import * as wageJsonData from './wage-data.json';
import * as citiesJson from '../../json/just-cities.json';
import * as uniqueZipJson from '../../json/unique-zips-slim.json';
import Awesomplete from 'awesomplete-es6';
import minWageHTML from './wage.js';
import findWageMatch from './find-wage-match.js';

if (document.querySelector('body.js-min-wage')) {
  let template = document.querySelector('#wage-template')
  const wageNode = template.content.cloneNode(true);
  let wageTranslations = {};
  wageTranslations['trans-key'] = wageNode.querySelector('.trans-key').innerHTML;
  wageTranslations['trans-the-minimum-wage-in'] = wageNode.querySelector('.trans-the-minimum-wage-in').innerHTML;
  wageTranslations['trans-minimum-wage-rates-as-of'] = wageNode.querySelector('.trans-minimum-wage-rates-as-of').innerHTML;
  wageTranslations['trans-place'] = wageNode.querySelector('.trans-place').innerHTML;
  wageTranslations['trans-rate'] = wageNode.querySelector('.trans-rate').innerHTML;
  wageTranslations['trans-25-or-fewer'] = wageNode.querySelector('.trans-25-or-fewer').innerHTML;
  wageTranslations['trans-26-or-more'] = wageNode.querySelector('.trans-26-or-more').innerHTML;
  wageTranslations['trans-is'] = wageNode.querySelector('.trans-is').innerHTML;
  wageTranslations['trans-hour'] = wageNode.querySelector('.trans-hour').innerHTML;
  wageTranslations['trans-employees'] = wageNode.querySelector('.trans-employees').innerHTML;
  wageTranslations['trans-employers-with'] = wageNode.querySelector('.trans-employers-with').innerHTML;
  wageTranslations['trans-for-employers-with'] = wageNode.querySelector('.trans-for-employers-with').innerHTML;

  // display HTML of add city wages
  const wageJson = wageJsonData.MinimumWage[0]['2020-01-01T08:00:00'];
  const html = buildDisplay(wageJsonData.MinimumWage, wageTranslations);
  document.querySelector('.display-wage-by-city').innerHTML = html;

  // handle search autocomplete
  const zipMap = new Map();

  const cityNames = new Map();
  const cleanCities = [];
  citiesJson.default.forEach(item => {
    cityNames.set(item.replace(', CA', '').toLowerCase(), item);
    cleanCities.push(item.replace(', CA', ''));
  });

  const awesompleteList = [...cleanCities, ...uniqueZipJson.default];

  const awesompleteSettings = {
    list: awesompleteList,
    autoFirst: true,
    filter: function (text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
    },

    item: function (text, input) {
      document.querySelector(
        '.wage-city-search .invalid-feedback'
      ).style.display = 'none';
      return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
    },

    replace: function (text) {
      let before = this.input.value.match(/^.+,\s*|/)[0];
      const finalval = before + text;
      this.input.value = finalval;
      findWageMatch(finalval, wageJson, zipMap, cityNames, wageTranslations);
    }
  };

  /* eslint-disable no-unused-vars */
  const awesomplete = new Awesomplete('input[data-multiple]', awesompleteSettings);
  /* eslint-enable no-unused-vars */

  document.querySelector('.js-wage-lookup').addEventListener('click', event => {
    event.preventDefault();
    const location = document.getElementById('location-query').value;
    findWageMatch(location, wageJson, zipMap, cityNames, wageTranslations);
  });

  // Add ARIA Label to Awesomeplete list
  if (document.getElementById('awesomplete-list-1')) {
    document
      .getElementById('awesomplete-list-1')
      .setAttribute('aria-hidden', true);
    document
      .getElementById('awesomplete-list-1')
      .setAttribute('aria-label', 'autosuggest');
  }
}

function buildDisplay (wageJson, wageTranslations) {
  return `
  ${wageJson
    .map(date => {
      let label = '';
      let cityWages = '';
      for (let key in date) {
        label = key;
        cityWages = date[key];
      }
<<<<<<< HEAD
      var options = { year: 'numeric', month: 'long', day: 'numeric' };
      return minWageHTML(cityWages, options, label.replace(/ /g,'-'), wageTranslations);
=======
      let options = { year: 'numeric', month: 'long', day: 'numeric' };
      return `
    <cwds-accordion>
      <div class="card">
        <button class="card-header accordion-alpha" type="button" aria-expanded="false">
          <div class="accordion-title">${
            wageTranslations['Minimum wage rates as of']
          } ${new Date(label).toLocaleDateString('en-US', options)} </div>
        </button>
        <div class="card-container collapsed">
          <div class="card-body">
            <table class="table">
              <thead>
                  <th scope="col">${wageTranslations.Place}</th>
                  <th scope="col">${wageTranslations.Rate}</th>
                </tr>
              </thead>
              <tbody>
              ${cityWages
                .map(city => {
                  return ` <tr>
                  <td>${city.name}</td>
                  <td>
                    ${(function () {
                      const wageData = city.wage;
                      let output = '';
                      if (
                        city.wage[0].everybody &&
                        city.wage[0].everybody.match(/[a-zA-Z]+/g)
                      ) {
                        output = `<p>${city.wage[0].everybody}</p>`;
                      } else {
                        output = `<p>$${city.wage[0].everybody}/${wageTranslations.hour}</p>`;
                      }
                      if (wageData.length > 1) {
                        output = `
                          ${wageData
                            .map(wageitem => {
                              let label = '';
                              let value = '0';
                              for (let key in wageitem) {
                                value = wageitem[key];
                                label = key;
                              }
                              if (value.match(/[a-zA-Z]+/g)) {
                                return `<p>${value}</p>`;
                              } else {
                                return `<p>$${value}/${wageTranslations.hour} ${wageTranslations['for employers with']} ${wageTranslations[label]} ${wageTranslations.employees}</p>`;
                              }
                            })
                            .join(' ')}`;
                      }
                      return output;
                    })()}
                  </td>
                </tr>`;
                })
                .join(' ')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </cwds-accordion>`;
>>>>>>> master
    })
    .join(' ')}
`;
}
