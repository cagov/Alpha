import getLatLon from './getlatlon.js';
import getDirections from './getdirections.js';
import getSteps from './getsteps.js';
import getObstructions from './getobstructions.js';
import createHTML from './obstruction-html.js';

const roadStrings = {
  es: {
    key: 'es',
    "Sorry, we can't find that location. Please enter a valid location in California.": 'Lo sentimos, no podemos encontrar ese lugar. Por favor, introduzca una ubicación válida en California.',
    'Sorry, we can only show road conditions in California. Please enter a California location.': 'En este momento, sólo podemos mostrar condiciones de la carretera en California. Por favor, introduzca una ubicación de California.'
  },
  en: {
    key: 'en-US',
    "Sorry, we can't find that location. Please enter a valid location in California.": "Sorry, we can't find that location. Please enter a valid location in California.",
    'Sorry, we can only show road conditions in California. Please enter a California location.': 'Sorry, we can only show road conditions in California. Please enter a California location.'
  },
  zh: {
    key: 'zh',
    "Sorry, we can't find that location. Please enter a valid location in California.": '很抱歉，我们无法找到那个地方。请在加利福尼亚州输入有效的位置。',
    'Sorry, we can only show road conditions in California. Please enter a California location.': '在这个时候，我们只能显示在加利福尼亚州的道路状况。请进入加州的位置。'
  }
};
let roadTranslations = roadStrings.en;
if (window.location.pathname.indexOf('/es/') === 0) {
  roadTranslations = roadStrings.es;
}
if (window.location.pathname.indexOf('/zh/') === 0) {
  roadTranslations = roadStrings.es;
}

export default function addListeners () {
  document.querySelector('.destination-button').addEventListener('click', async function (event) {
    event.preventDefault();
    // deleted this button
  });

  document.querySelector('.start-button').addEventListener('click', async function (event) {
    event.preventDefault();
    // const findDest = await readDestination();
    const endPlace = document.querySelector('.js-geocoder-start input').value;
    const startCoords = await getLatLon(endPlace);
    const errorSelector = document.querySelector('.error2');
    if (startCoords.status != '200') {
      errorSelector.innerHTML = startCoords.message;
      errorSelector.style.display = 'block';
    } else {
      hideErrors();
      window.startCoords = startCoords.center;
      document.querySelector('.js-geocoder-start input').value = startCoords.place_name;
      if (!isThatInCali(window.startCoords)) {
        errorSelector.innerHTML = roadTranslations["Sorry, we can't find that location. Please enter a valid location in California."];
        errorSelector.style.display = 'block';
      }
    }
    displayObs();
  });
}

if (document.querySelector('.destination-button')) {
  addListeners();
}

function isThatInCali (coords) {
  const lat = coords[1];
  const lon = coords[0];
  const caliYMin = 32.534156;
  const caliYMax = 42.009518;
  const caliXMin = -124.409591;
  const caliXMax = -114.131211;
  if (lat > caliYMin && lat < caliYMax && lon > caliXMin && lon < caliXMax) {
    return true;
  } else {
    return false;
  }
}

async function readDestination () {
  const myPlace = document.querySelector('#geocoder input').value;
  const endCoords = await getLatLon(myPlace);
  const errorSelector = document.querySelector('.error1');
  errorSelector.style.display = 'none';
  if (endCoords.status != '200') {
    errorSelector.innerHTML = endCoords.message;
    errorSelector.style.display = 'block';
  } else {
    window.endCoords = endCoords.center;
    document.querySelector('#geocoder input').value = endCoords.place_name;
    if (!isThatInCali(window.endCoords)) {
      errorSelector.innerHTML = roadTranslations["Sorry, we can't find that location. Please enter a valid location in California."];
      errorSelector.style.display = 'block';
    }
  }
  return 'done';
}

function setupRoadConditions () {
  if (typeof (window.mapboxgl) !== 'undefined') {
    window.mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25oYW5zIiwiYSI6ImNqNGs4cms1ZzBocXkyd3FzZGs3a3VtamYifQ.HQjFfVzwwxwCmGr2nvnvSA';
    var map = new window.mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-79.4512, 43.6568],
      zoom: 13
    });

    window.geocoder = new MapboxGeocoder({
      accessToken: window.mapboxgl.accessToken,
      placeholder: ' ',
      // bbox: [-124.409591, 32.534156, -114.131211, 42.009518],
      bbox: [-124.7844079, 24.7433195, -66.9513812, 49.3457868],
      mapboxgl: window.mapboxgl
    }).on('result', async function (item) {
      window.endCoords = item.result.center;
      const errorSelector = document.querySelector('.error1');
      errorSelector.style.display = 'none';
      if (!isThatInCali(window.endCoords)) {
        errorSelector.innerHTML = roadTranslations['Sorry, we can only show road conditions in California. Please enter a California location.'];
        errorSelector.style.display = 'block';
      }
      if (window.startCoords) {
        displayObs();
      } else {
        window.geocoderStart.clear();
      }
    });

    document.getElementById('geocoder').appendChild(window.geocoder.onAdd(map));

    window.geocoderStart = new window.MapboxGeocoder({
      accessToken: window.mapboxgl.accessToken,
      placeholder: ' ',
      bbox: [-124.7844079, 24.7433195, -66.9513812, 49.3457868],
      mapboxgl: window.mapboxgl
    }).on('result', async function (item) {
      // const findDest = await readDestination();
      window.startCoords = item.result.center;
      const errorSelector = document.querySelector('.error2');
      errorSelector.style.display = 'none';
      if (!isThatInCali(window.startCoords)) {
        errorSelector.innerHTML = roadTranslations['Sorry, we can only show road conditions in California. Please enter a California location.'];
        errorSelector.style.display = 'block';
      }
      displayObs();
    });

    document.querySelector('.js-geocoder-start').appendChild(window.geocoderStart.onAdd(map));
  } else {
    setTimeout(setupRoadConditions, 500);
  }
}

if (document.querySelector('.destination-button')) {
  setupRoadConditions();
}

function displayObs () {
  if (window.endCoords && window.startCoords) {
    if (isThatInCali(window.startCoords) && isThatInCali(window.endCoords)) {
      getDirections(`coordinates=${window.startCoords};${window.endCoords}&steps=true&banner_instructions=true`)
        .then((data) => {
          const stepMap = getSteps(data);
          getObstructions(stepMap, { startCoords: window.startCoords, endCoords: window.endCoords }, function (myObstructions) {
            document.querySelector('.obstructions-major').innerHTML = createHTML(myObstructions, window.startCoords, window.endCoords);
          });
        });
    }
  }
}
