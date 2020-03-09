import * as wageJsonData from './wage-data.json';
import * as citiesJson from '../../json/just-cities.json';
import * as uniqueZipJson from '../../json/unique-zips-slim.json';
import * as translationStrings from './strings.json';
import Awesomplete from 'awesomplete-es6';
import minWageHTML from './wage.js';
import findWageMatch from './find-wage-match.js';

if (document.querySelector('body.js-min-wage')) {
  let wageTranslations = translationStrings.default;
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
      var before = this.input.value.match(/^.+,\s*|/)[0];
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
    .map(function (date) {
      let label = '';
      let cityWages = '';
      for (var key in date) {
        label = key;
        cityWages = date[key];
      }
      var options = { year: 'numeric', month: 'long', day: 'numeric' };
      return minWageHTML(cityWages, options, label, wageTranslations);
    })
    .join(' ')}
`;
}
