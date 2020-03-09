import * as citiesJson from '../../json/just-cities.json';
import * as uniqueZipJson from '../../json/unique-zips-slim.json';
import GestureHandling from './gesture.js';
import Awesomplete from 'awesomplete-es6';
const mapboxToken = 'pk.eyJ1IjoiYWxwaGEtY2EtZ292IiwiYSI6ImNrNTZ5em1qMDA4ZWkzbG1yMDg4OXJyaDIifQ.GleKGsZsaOcmxfsYUR9bTg';

const trStrings = {
  es: {
    'Show more': 'Mostrar más',
    'Get directions': 'Obtener las direcciones',
    'Showing food banks near': 'Mostrando bancos de alimentos cerca',
    you: ' de usted',
    'miles away': 'millas de distancia',
    Visit: 'Visitar',
    website: 'sitio web',
    'directions to': 'direcciones a'
  },
  en: {
    'Show more': 'Show more',
    'Get directions': 'Get directions',
    'Showing food banks near': 'Showing food banks near',
    you: 'you',
    'miles away': 'miles away',
    Visit: 'Visit',
    website: 'website',
    'directions to': 'directions to'
  }
};

let translations = trStrings.en;
if (window.location.pathname.indexOf('/es/') === 0) {
  translations = trStrings.es;
}

function getGeo () {
  let geoSuccess = function (position) {
    // Do magic with location
    document.querySelector('.js-location-display').innerHTML = `<h2>${translations['Showing food banks near']} ${translations.you}</h2>`;
    reorient([position.coords.longitude, position.coords.latitude]);
  };
  let geoError = function (error) {
    switch (error.code) {
      case error.TIMEOUT:
        // The user didn't accept the callout
        // console.log('the use did not accept geolocate permission')
        break;
    }
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

function loadScript (url, callback) {
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.onload = function () {
    callback();
  };
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

function loadMap () {
  let st = document.createElement('link');
  st.href = 'https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.css';
  st.rel = 'stylesheet';
  document.head.appendChild(st);

  loadScript('https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js', () => {
    window.mapboxgl.accessToken = mapboxToken;

    window.map = new window.mapboxgl.Map({
      container: 'mapid',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-121.500665, 38.583843],
      zoom: 12,
      pitch: 58.5,
      bearing: -120.8
    });
    let scrollText = 'Use alt + scroll to zoom the map.';
    if (navigator.userAgent.indexOf('Mac OS') > -1) {
      scrollText = 'Use option + scroll to zoom the map.';
    }
    const options = {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textColor: '#ffffff',
      textMessage: scrollText,
      textMessageMobile: 'Use two fingers to move the map.',
      timeout: 2000
    };

    /* eslint-disable no-unused-vars */
    const stopAccidentalZoom = new GestureHandling(options).addTo(window.map);
    /* eslint-enable no-unused-vars */

    window.map.on('load', () => {
      mapInteractions();
    });
  });
}

if (document.querySelector('body.js-food-banks')) {
  getGeo();

  // get full geojson foodbanks
  window.fetch('https://api.alpha.ca.gov/FoodBanks')
    .then(resp => { return resp.json(); })
    .then(data => {
      window.foodLocations = data;
      loadMap();
    })
    .catch(e => {
      console.log('error occurred retrieving full set of food bank locations');
      console.log(e);
    });
}

function reorient (position) {
  if (window.map) {
    window.map.flyTo({
      center: position,
      essential: false // this animation is not considered essential with respect to prefers-reduced-motion
    });
  }
  displaySortedResults(position);
}

function mapInteractions () {
  if (!window.foodLocations) {
    setTimeout(mapInteractions, 300);
  } else {
    setupMapInteractions();
  }
}

function setupMapInteractions () {
  window.map.loadImage('/img/marker.png', (error, image) => {
    if (error) throw error;
    window.map.addImage('custom-marker', image);

    window.map.addLayer(
      {
        id: 'foods',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: window.foodLocations
        },
        layout: {
          'icon-image': 'custom-marker',
          'icon-size': 0.075,
          'icon-allow-overlap': true
        }
      }
    );
    // When a click event occurs on a feature in the foods layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    window.map.on('click', 'foods', e => {
      let coordinates = e.features[0].geometry.coordinates.slice();
      let item = e.features[0];
      let food = item.properties;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new window.mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`${food.title}<br>
          ${food.address}<br>
            ${food.address2}<br>
          <a target="_new" href="${food.website}" target="_self">${translations.Visit} ${food.title}'s ${translations.website}</a><br>
          ${food.phone}<br>
          <a href="maps://maps.apple.com/maps?daddr=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}">
            <a target="_new" href="https://maps.google.com/maps?daddr=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}" aria-label="${translations['directions to']} ${food.title}ß" target="_self"class="btn btn-primary">${translations['Get directions']}</a>
          </a>`)
        .addTo(window.map);
    });

    // Change the cursor to a pointer when the mouse is over the foods layer.
    window.map.on('mouseenter', 'foods', () => {
      window.map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    window.map.on('mouseleave', 'foods', () => {
      window.map.getCanvas().style.cursor = '';
    });
  });
}

function displaySortedResults (coords) {
  if (!window.foodLocations) {
    setTimeout(() => {
      displaySortedResults(coords);
    }, 300);
  } else {
    window.fetch(`https://api.alpha.ca.gov/FoodBanks?lat=${coords[1]}&lon=${coords[0]}`)
      .then(resp => { return resp.json(); })
      .then(data => {
        const outputLocs = data;
        const html = `<ul class="pl-0 card-set">
        ${outputLocs.map((item, itemindx) => {
          let food = item.properties;
          let displayClass = '';
          if (itemindx > 2) {
            displayClass = 'd-none';
          }
          let showMore = '';
          if (itemindx === 2) {
            showMore = `<li class="card mb-20 js-expand-link border-0">
              <div class="card-body">
                <p>
                  <a class="action-link" href="#" onclick="showAll()">${translations['Show more']} &raquo;</a>
                </p>
              </div>
            </li>`;
          }
          return `<li class="card mb-20 ${displayClass} border-0">
            <div class="card-body bg-light">
              <p>${food.distance.toFixed(2)} ${translations['miles away']}</p>
              <p class="bold">${food.title}</p>
              <p>${food.address}<br>
                ${food.address2}<br>
              <a href="${food.website}" target="_self">${translations.Visit} ${food.title}'s ${translations.website}</a><br>
              <p>${food.phone}</p>
              <a target="_new" href="maps://maps.apple.com/maps?daddr=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}">
                <a target="_new" class="action-link" href="https://maps.google.com/maps?daddr=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}" aria-label="${translations['directions to']} ${food.title}ß" target="_self"class="btn btn-sm">${translations['Get directions']}</a>
              </a>
            </div>
          </li>${showMore}`;
        }).join(' ')}
      </ul>`;
        document.querySelector('.js-nearest-results').innerHTML = html;
      });
  }
}

if (document.querySelector('body.js-food-banks')) {
  // handle search autocomplete
  let cityNames = new Map();
  citiesJson.default.forEach(item => {
    cityNames.set(item.replace(', CA', '').toLowerCase(), item);
  });

  const awesompleteSettings = {
    autoFirst: true,
    filter: function (text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
    },

    item: function (text, input) {
      document.querySelector('.invalid-feedback').style.display = 'none';
      return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
    },

    replace: function (text) {
      let before = this.input.value.match(/^.+,\s*|/)[0];
      let finalval = before + text;
      this.input.value = finalval;
      let cabb = '-124.409591,32.534156,-114.131211,42.009518';
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${finalval}.json?bbox=${cabb}&access_token=${mapboxToken}`;
      window.fetch(url)
        .then(resp => { return resp.json(); })
        .then(data => {
          document.querySelector('.js-location-display').innerHTML = '<h2>Showing food banks near ' + finalval + '</h2>';
          reorient(data.features[0].center);
        });
    }
  };

  new Awesomplete('input[data-multiple]', awesompleteSettings).list = [...citiesJson.default, ...uniqueZipJson.default];

  document.querySelector('.js-food-lookup').addEventListener('submit', function (event) {
    event.preventDefault();
    document.querySelector('.invalid-feedback').style.display = 'none';
    let val = this.querySelector('input').value;
    let cabb = '-124.409591,32.534156,-114.131211,42.009518';
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}.json?bbox=${cabb}&access_token=${mapboxToken}`;
    window.fetch(url)
      .then(resp => { return resp.json(); })
      .then(data => {
        document.querySelector('.js-location-display').innerHTML = `<h2>${translations['Showing food banks near']} ${val}</h2>`;
        if (data.features.length > 0) {
          reorient(data.features[0].center);
        } else {
          document.querySelector('.js-nearest-results').innerHTML = '';
          document.querySelector('.invalid-feedback').style.display = 'block';
        }
      });
  });
}

// these get triggered from the map
window.showAll = function (event) {
  event.preventDefault();
  document.querySelectorAll('.card-set li.d-none').forEach(item => {
    item.classList.remove('d-none');
  });
  document.querySelector('.js-expand-link').style.display = 'none';
};

// Change ARIA Label to Awesomeplete list
if (document.getElementById('awesomplete_list_1')) {
  document.getElementById('awesomplete_list_1').setAttribute('aria-hidden', true);
  document.getElementById('awesomplete_list_1').setAttribute('aria-label', 'autosuggest');
}
if (document.getElementById('city-input')) {
  document.getElementById('city-input').setAttribute('role', 'textbox');
  document.getElementById('city-input').removeAttribute('aria-controls');
  document.getElementById('city-input').removeAttribute('aria-expanded');
}
