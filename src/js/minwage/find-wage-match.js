import doubleTemplate from './double-template.js';
const zipApiUrl = 'https://api.alpha.ca.gov/caziplookup/';

export default function findWageMatch (city, wageJson, zipMap, cityNames, wageTranslations) {
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
        wageData,
        wageTranslations
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
              html += doubleTemplate(aCity.name, wageData, wageTranslations);
            }
          });
          if (!match) {
            html += doubleTemplate(aCity.name, wageData, wageTranslations);
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
