import gotSystem from './got-system.js';
import Awesomplete from 'awesomplete-es6';

if (document.querySelector('body.js-water')) {
  const fieldSelector = '.water-location-field';
  const awesompleteSettings = {
    autoFirst: true,
    filter: function (text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
    },

    item: function (text, input) {
      return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
    },

    replace: function (text) {
      let before = this.input.value.match(/^.+,\s*|/)[0];
      let finalval = before + text;
      this.input.value = finalval;
      answerChosen(finalval);
    }
  };

  const aplete = new Awesomplete(fieldSelector, awesompleteSettings)

  document.querySelector(fieldSelector).addEventListener('keyup', event => {
    const skipKeys = [13, 9, 27, 38, 40]; // do not reset suggestion list if using arrow keys, enter, tab
    if (event.target.value.length >= 2) {
      if (skipKeys.indexOf(event.keyCode) === -1) {
        queryLoc(event.target.value,aplete);
      }
    }
  });

  document
    .querySelector('.js-water-form')
    .addEventListener('submit', event => {
      event.preventDefault();
      document.querySelector('.invalid-feedback').style.display = 'none';
    });

  const systemid = new URLSearchParams(window.location.search).get('q');
  if (systemid) {
    const url = `https://api.alpha.ca.gov/WaterSystem?systemId=${systemid}`;
    window.fetch(url)
      .then(response => response.json())
      .then(systemData => {
        gotSystem(systemData);
        document.querySelector('.system-data').style.display = 'block';
      })
      .catch(() => {});
  }
}

function answerChosen (item) {
  const waterButton = document.querySelector('.js-water-lookup');

  const template = document.getElementById('loading');
  const node = template.content.cloneNode(true);

  waterButton.innerHTML = node.querySelector('div').innerHTML;
  document.querySelector('.system-data').style.display = 'none';

  // make call to endpoint to find system
  retrieveSystemData(item);
}

function queryLoc (q,aplete) {
  window.lookup = q;
  const url = `https://api.alpha.ca.gov/alphageotypeahead?onlyca=true&q=${q}`;
  window.fetch(url)
    .then(response => response.json())
    .then(data => {
      aplete.list = data.match.map(x=>x.address);
    })
    .catch(() => {
      resetForm();
    });
}

function resetForm () {
  document.querySelector('.js-water-lookup').innerHTML = 'Check your water';
  document.querySelector('.system-data').style.display = 'block';
}

function retrieveSystemData (item) {
  window.fetch(
    `https://api.alpha.ca.gov/WaterSystem?stringLoc=${item}`
  )
    .then(response => response.json())
    .then(systemData => {
      gotSystem(systemData);
    })
    .catch(() => {
      resetForm();
    });
}
