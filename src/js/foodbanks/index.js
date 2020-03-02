import * as citiesJson from '../../json/just-cities.json';
import * as uniqueZipJson from '../../json/unique-zips-slim.json';
import GestureHandling from '@tilecloud/mbgl-gesture-handling';
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
if (window.location.pathname.indexOf('/es/') == 0) {
  translations = trStrings.es;
}

function getGeo () {
  var startPos;

  var geoSuccess = function (position) {
    // Do magic with location
    startPos = position;
    document.querySelector('.js-location-display').innerHTML = `<h2>${translations['Showing food banks near']} ${translations.you}</h2>`;
    reorient([position.coords.longitude, position.coords.latitude]);
  };
  var geoError = function (error) {
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
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.onload = function () {
    callback();
  };
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

function loadMap () {
  var st = document.createElement('link');
  st.href = 'https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.css';
  st.rel = 'stylesheet';
  document.head.appendChild(st);

  loadScript('https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js', function () {
    mapboxgl.accessToken = mapboxToken;

    window.map = new mapboxgl.Map({
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

    new GestureHandling(options).addTo(window.map);

    window.map.on('load', function () {
      mapInteractions();
    });
  });
}

if (document.querySelector('body.js-food-banks')) {
  getGeo();

  // get full geojson foodbanks
  fetch('https://api.alpha.ca.gov/FoodBanks')
    .then(function (resp) { return resp.json(); })
    .then(function (data) {
      window.foodLocations = data;
      loadMap();
    })
    .catch((e) => {
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
  window.map.loadImage('/img/marker.png', function (error, image) {
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
    window.map.on('click', 'foods', function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var item = e.features[0];
      var food = item.properties;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`${food.title}<br>
          ${food.address}<br>
            ${food.address2}<br>
          <a href="${food.website}" target="_self">${translations.Visit} ${food.title}'s ${translations.website}</a><br>
          ${food.phone}<br>
          <a href="geo:${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}" onclick="mapsSelector(${item.geometry.coordinates[1]},${item.geometry.coordinates[0]})" aria-label="${translations['directions to']} ${food.title}ß" target="_self"class="btn btn-primary">${translations['Get directions']}</a>`)
        .addTo(window.map);
    });

    // Change the cursor to a pointer when the mouse is over the foods layer.
    window.map.on('mouseenter', 'foods', function () {
      window.map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    window.map.on('mouseleave', 'foods', function () {
      window.map.getCanvas().style.cursor = '';
    });
  });
}

function displaySortedResults (coords) {
  if (!window.foodLocations) {
    setTimeout(function () {
      displaySortedResults(coords);
    }, 300);
  } else {
    fetch(`https://api.alpha.ca.gov/FoodBanks?lat=${coords[1]}&lon=${coords[0]}`)
      .then(function (resp) { return resp.json(); })
      .then(function (data) {
        const outputLocs = data;
        const html = `<ul class="pl-0 card-set">
        ${outputLocs.map(function (item, itemindx) {
          var food = item.properties;
          var displayClass = '';
          if (itemindx > 2) {
            displayClass = 'd-none';
          }
          var showMore = '';
          if (itemindx == 2) {
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
              <a class="action-link" href="geo:${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}" onclick="mapsSelector(${item.geometry.coordinates[1]},${item.geometry.coordinates[0]})" aria-label="${translations['directions to']} ${food.title}ß" target="_self"class="btn btn-sm">${translations['Get directions']}</a>
            </div>
          </li>${showMore}`;
        }).join(' ')}
      </ul>`;
        document.querySelector('.js-nearest-results').innerHTML = html;
      });
  }
}

function showAll () {
  event.preventDefault();
  document.querySelectorAll('.card-set li.d-none').forEach(function (item) {
    item.classList.remove('d-none');
  });
  document.querySelector('.js-expand-link').style.display = 'none';
}

function mapsSelector (lat, lon) {
  event.preventDefault();
  if ((navigator.platform.indexOf('iPhone') != -1) || (navigator.platform.indexOf('iPad') != -1) || (navigator.platform.indexOf('iPod') != -1)) {
    window.open(`maps://maps.apple.com/maps?daddr=${lat},${lon}`);
  } else {
    window.open(`https://maps.google.com/maps?daddr=${lat},${lon}`);
  }
}

if (document.querySelector('body.js-food-banks')) {
  // handle search autocomplete
  var cityNames = new Map();
  citiesJson.default.forEach(function (item) {
    cityNames.set(item.replace(', CA', '').toLowerCase(), item);
  });
  const awesompleteList = [...citiesJson.default, ...uniqueZipJson.default];

  new Awesomplete('input[data-multiple]', {
    list: awesompleteList,
    filter: function (text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
    },

    item: function (text, input) {
      document.querySelector('.invalid-feedback').style.display = 'none';
      return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
    },

    replace: function (text) {
      var before = this.input.value.match(/^.+,\s*|/)[0];
      var finalval = before + text;
      this.input.value = finalval;
      var cabb = '-124.409591,32.534156,-114.131211,42.009518';
      var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${finalval}.json?bbox=${cabb}&access_token=${mapboxToken}`;
      fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
          document.querySelector('.js-location-display').innerHTML = '<h2>Showing food banks near ' + finalval + '</h2>';
          reorient(data.features[0].center);
        });
    }
  });

  document.querySelector('.js-food-lookup').addEventListener('submit', function (event) {
    event.preventDefault();
    document.querySelector('.invalid-feedback').style.display = 'none';
    var val = this.querySelector('input').value;
    var cabb = '-124.409591,32.534156,-114.131211,42.009518';
    var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}.json?bbox=${cabb}&access_token=${mapboxToken}`;
    fetch(url)
      .then(function (resp) { return resp.json(); })
      .then(function (data) {
        document.querySelector('.js-location-display').innerHTML = `<h2>${translations['Showing food banks near']} ${val}</h2>`;
        if (data.features.length > 0) {
          reorient(data.features[0].center);
        } else {
          document.querySelector('.invalid-feedback').style.display = 'block';
        }
      });
  });
}

// these get triggered from the map
window.showAll = function () {
  event.preventDefault();
  document.querySelectorAll('.card-set li.d-none').forEach(function (item) {
    item.classList.remove('d-none');
  });
  document.querySelector('.js-expand-link').style.display = 'none';
};

window.mapsSelector = function (lat, lon) {
  event.preventDefault();
  if ((navigator.platform.indexOf('iPhone') != -1) || (navigator.platform.indexOf('iPad') != -1) || (navigator.platform.indexOf('iPod') != -1)) {
    window.open(`maps://maps.apple.com/maps?daddr=${lat},${lon}`);
  } else {
    window.open(`https://maps.google.com/maps?daddr=${lat},${lon}`);
  }
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
