import gotSystem from './got-system.js';
import getParameterByName from './getparams.js';
import Awesomplete from 'awesomplete-es6';

if (document.querySelector('body.js-water')) {
  const fieldSelector = '#testauto';
  window.waterPlete = new Awesomplete(fieldSelector, {
    list: [],
    autoFirst: true,
    filter: function (text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
    },

    item: function (text, input) {
      return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
    },

    replace: function (text) {
      var before = this.input.value.match(/^.+,\s*|/)[0];
      var finalval = before + text;
      this.input.value = finalval;
      answerChosen(finalval);
    }
  });

  function queryLoc (q) {
    window.lookup = q;
    const url = `https://api.alpha.ca.gov/alphageotypeahead?onlyca=true&q=${q}`;
    window.fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const list = [];
        data.match.forEach((item) => {
          list.push(item.address);
        });
        window.waterPlete.list = list;
      })
      .catch(error => {
        resetForm();
      });
  }

  document.querySelector(fieldSelector).addEventListener('keydown', event => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    let skipKeys = [13, 9, 27, 38, 40]
    if (event.target.value.length >= 2) {
      if(skipKeys.indexOf(event.keyCode) === -1) {
        queryLoc(event.target.value);
      }
    }
  });

  function resetForm () {
    document.querySelector('.js-water-lookup').innerHTML = 'Check your water';
    document.querySelector('.system-data').style.display = 'block';
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

  document
    .querySelector('.js-water-form')
    .addEventListener('submit', function (event) {
      event.preventDefault();
      document.querySelector('.invalid-feedback').style.display = 'none';
    });

  function retrieveSystemData (item) {
    window.fetch(
      `https://api.alpha.ca.gov/WaterSystem?stringLoc=${item}`
    )
      .then(response => {
        return response.json();
      })
      .then(systemData => {
        gotSystem(systemData);
      })
      .catch(error => {
        resetForm();
      });
  }

  if (getParameterByName('systemId')) {
    const url = `https://api.alpha.ca.gov/WaterSystem?systemId=${getParameterByName(
      'systemId'
    )}`;
    window.fetch(url)
      .then(response => {
        return response.json();
      })
      .then(systemData => {
        gotSystem(systemData);
        document.querySelector('.system-data').style.display = 'block';
      })
      .catch(error => {});
  }
}
