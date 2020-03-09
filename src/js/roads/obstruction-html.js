export default function createHTML (myObstructions) {
  const roadStrings = {
    es: {
      key: 'es',
      'Get directions': 'Obtener las direcciones',
      'Road conditions for your trip': 'condiciones de la carretera para su viaje',
      'Road condition': 'Condiciones del camino',
      Landmark: 'Punto de referencia',
      Description: 'Descripción'
    },
    en: {
      key: 'en-US',
      'Get directions': 'Get directions',
      'Road conditions for your trip': 'Road conditions for your trip',
      'Road condition': 'Road condition',
      Landmark: 'Landmark',
      Description: 'Description'
    },
    zh: {
      key: 'zh',
      'Get directions': '行车路线',
      'Road conditions for your trip': '道路状况为您的行程',
      'Road condition': '道路状况',
      Landmark: '基准',
      Description: '描述'
    }
  };

  let roadTranslations = roadStrings.en;
  if (window.location.pathname.indexOf('/es/') === 0) {
    roadTranslations = roadStrings.es;
  }
  if (window.location.pathname.indexOf('/zh/') === 0) {
    roadTranslations = roadStrings.es;
  }

  const obstructionMap = new Map();
  const incidentMap = new Map();
  myObstructions.forEach(obs => {
    if (obs.name && (obs.name.indexOf('CHP Incident') > -1 || obs.name === 'Caltrans Highway Information')) {
      incidentMap.set(`${obs.lat},${obs.lon}`, obs);
    } else {
      const obsKey = `${obs.lcs.location.begin.beginRoute} affecting flow ${obs.lcs.location.travelFlowDirection}`;
      if (obstructionMap.get(obsKey)) {
        const theseObstructions = obstructionMap.get(obsKey);
        theseObstructions.push(obs);
        obstructionMap.set(obsKey, theseObstructions);
      } else {
        obstructionMap.set(obsKey, [obs]);
      }
    }
  });

  let majorhtml = `<hr><h2 class="mt-20">${roadTranslations['Road conditions for your trip']}</h2>`;
  let foundMajor = false;
  obstructionMap.forEach((obstructionArray, key) => {
    let internalHTML = '';
    const uniqueObsMap = new Map();
    obstructionArray.forEach(obs => {
      if (!uniqueObsMap.get(obs.lcs.closure.closureID)) {
        uniqueObsMap.set(obs.lcs.closure.closureID, 'here');
        if (obs.lcs.closure.isCHINReportable === 'true') {
          // remove duplicates
          internalHTML += `<tr>
            <td>${obs.lcs.closure.typeOfWork}</td>
            <td>near ${obs.lcs.location.begin.beginNearbyPlace}</td>
            <td>Lanes closed: ${obs.lcs.closure.lanesClosed}</td>
          </tr>`;
          foundMajor = true;
        } else {
          // skip these non chin reportable ones
        }
      }
    });

    if (internalHTML !== '') {
      majorhtml += `<h3>${key}</h3>
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th>${roadTranslations['Road condition']}</th><th>${roadTranslations.Landmark}</th><th>${roadTranslations.Description}</th>
          </tr>
        </thead>
        ${internalHTML}
      </table>`;
    }
  });
  if (incidentMap.length > 0) {
    majorhtml += '<h2>Incidents in the area</h2>';
  }
  incidentMap.forEach(item => {
    majorhtml += item.description;
  });

  if (!foundMajor || myObstructions.length === 0) {
    majorhtml += '<p>No major obstructions on your route</p>';
  }

  function mapsSelector (start, end) {
    if (navigator.platform.indexOf('iPhone') !== -1 ||
       navigator.platform.indexOf('iPad') !== -1 ||
       navigator.platform.indexOf('iPod') !== -1) {
      return `http://maps.apple.com/?saddr=${start}&daddr=${end}&dirflg=d`;
    } else {
      return `https://maps.google.com/maps/dir/?api=1&origin=${start}&destination=${end}`;
    }
  }

  const directionsUrl = mapsSelector(document.querySelector('.js-geocoder-start input').value, document.querySelector('#geocoder input').value);
  majorhtml += `<p>
    <a href="${directionsUrl}" target="_new" class="btn btn-primary">${roadTranslations['Get directions']}</a>
  </p>`;
  return majorhtml;
}
