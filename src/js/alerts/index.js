import getCounties from './counties.js';
import * as uniqueZipJson from '../../json/unique-zips-slim.json';
import Awesomplete from 'awesomplete-es6';
import templateHTML from './template.js';

if (document.querySelector('body.js-alerts')) {
  const counties = getCounties();
  const zips = uniqueZipJson.default;

  const countyNames = [];
  counties.forEach(county => {
    countyNames.push(county.name);
  });

  const awesompleteList = [...countyNames, ...zips];

  const awesompleteSettings = {
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
      let before = this.input.value.match(/^.+,\s*|/)[0];
      let finalval = before + text;
      this.input.value = finalval;
      templateHTML(finalval, counties);
    }
  };

  /* eslint-disable no-unused-vars */
  const awesomplete = new Awesomplete('input[data-multiple]', awesompleteSettings);
  /* eslint-enable no-unused-vars */

  document
    .querySelector('.js-alert-lookup')
    .addEventListener('submit', function (event) {
      event.preventDefault();
      document.querySelector('.invalid-feedback').style.display = 'none';
      document.querySelector('.city-search').classList.remove('is-invalid');
      let finalval = this.querySelector('input').value;
      templateHTML(finalval);
    });
}
