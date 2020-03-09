import * as wageJsonData from './wage-data.json';
import * as citiesJson from '../../json/just-cities.json';
import * as uniqueZipJson from '../../json/unique-zips-slim.json';
import Awesomplete from 'awesomplete-es6';

const zipApiUrl = 'https://api.alpha.ca.gov/caziplookup/';

const wageTrStrings = {
  es: {
    key: 'es',
    'The minimum wage in': 'Mostrar bancos de alimentos cerca de',
    'Minimum wage rates as of': 'Aumento de salario mínimo a partir del',
    Place: 'Ubicación',
    Rate: 'Tasa',
    '25 or fewer': '25 o menos',
    '26 or more': '26 o más',
    is: 'es',
    hour: 'hora',
    employees: 'empleados',
    'Employers with': 'Empleadores con',
    'for employers with': 'para empleadores con'
  },
  en: {
    key: 'en-US',
    'The minimum wage in': 'The minimum wage in',
    'Minimum wage rates as of': 'Minimum wage rates as of',
    Place: 'Place',
    Rate: 'Rate',
    '25 or fewer': '25 or fewer',
    '26 or more': '26 or more',
    is: 'is',
    hour: 'hour',
    employees: 'employees',
    'Employers with': 'Employers with',
    'for employers with': 'for employers with'
  }
};

let wageTranslations = wageTrStrings.en;
if (window.location.pathname.indexOf('/es/') === 0) {
  wageTranslations = wageTrStrings.es;
}

if (document.querySelector('body.js-min-wage')) {
  // display HTML of add city wages
  const wageJson = wageJsonData.MinimumWage[0]['2020-01-01T08:00:00'];
  const html = buildDisplay(wageJsonData.MinimumWage);
  document.querySelector('.display-wage-by-city').innerHTML = html;

  // handle search autocomplete
  const zipMap = new Map();

  const cityNames = new Map();
  const cleanCities = [];
  citiesJson.default.forEach(item => {
    cityNames.set(item.replace(', CA', '').toLowerCase(), item);
    cleanCities.push(item.replace(', CA', ''));
  });

  // let awesompleteList = [...cleanCities, ...uniqueZipArray];
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
      findWageMatch(finalval, wageJson, zipMap, cityNames);
    }
  };

  /* eslint-disable no-unused-vars */
  const awesomplete = new Awesomplete('input[data-multiple]', awesompleteSettings);
  /* eslint-enable no-unused-vars */

  document.querySelector('.js-wage-lookup').addEventListener('click', event => {
    event.preventDefault();
    const location = document.getElementById('location-query').value;
    findWageMatch(location, wageJson, zipMap, cityNames);
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

function findWageMatch (city, wageJson, zipMap, cityNames) {
  // if there are any letters this is not a zip code
  let wageData = [{ '25 or fewer': '12' }, { '26 or more': '13' }];
  if (city.match(/[a-zA-Z]+/g)) {
    wageJson.forEach(item => {
      if (item.name === city) {
        wageData = item.wage;
      }
    });

    // try match in cityNames
    const foundCity = cityNames.get(city.toLowerCase());
    if (foundCity) {
      document.getElementById('answer').innerHTML = doubleTemplate(
        foundCity.replace(', CA', ''),
        wageData
      );
    } else {
      document.querySelector(
        '.wage-city-search .invalid-feedback'
      ).style.display = 'block';
    }
  } else {
    // no letters, try to find a match in zipMap
    window.fetch(zipApiUrl + `${city}`)
      .then(response => {
        return response.json();
      })
      .then(foundZip => {
        let html = '';
        foundZip.cities.forEach(aCity => {
          wageData = [{ '25 or fewer': '12' }, { '26 or more': '13' }];
          let match = false;
          wageJson.forEach(item => {
            if (item.name === aCity.name) {
              wageData = item.wage;
              match = true;
              // creating multiple rows of html results if zip code crosses multiple cities
              html += doubleTemplate(aCity.name, wageData);
            }
          });
          if (!match) {
            html += doubleTemplate(aCity.name, wageData);
          }
        });
        document.getElementById('answer').innerHTML = html;
      })
      .catch(() => {
        document.querySelector(
          '.wage-city-search .invalid-feedback'
        ).style.display = 'block';
      });
  }
}

function doubleTemplate (location, wageData) {
  return `
  <h2>${wageTranslations['The minimum wage in']} ${location}, CA ${
    wageTranslations.is
  }</h2>
  <table class="table">
    <thead>
      <tr>
        ${(function () {
          let output = '';
          if (wageData.length > 1) {
            output = `
              ${wageData
                .map(wageitem => {
                  let label = '';
                  for (let key in wageitem) {
                    label = key;
                  }
                  return `<th class="text-left bold" scope="col">${wageTranslations['Employers with']} ${wageTranslations[label]} ${wageTranslations.employees}</th>`;
                })
                .join(' ')}`;
          }
          return output;
        })()}
      </tr>
    </thead>
    <tbody>
      <tr>
        ${wageData
          .map(wageitem => {
            let wageVal = '';
            for (let key in wageitem) {
              wageVal = wageitem[key];
            }
            return `<td>$${wageVal}/${wageTranslations.hour}</td>`;
          })
          .join(' ')}
      </tr>
    </tbody>
  </table>`;
}

function buildDisplay (wageJson) {
  return `
  ${wageJson
    .map(date => {
      let label = '';
      let cityWages = '';
      for (let key in date) {
        label = key;
        cityWages = date[key];
      }
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
    })
    .join(' ')}
`;
}
