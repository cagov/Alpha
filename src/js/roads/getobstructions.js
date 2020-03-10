/*
    Mapbox directions to Caltrans routes translations:
      I-5 matches exactly to I-5
      CA 99 (mapbox) matches SR-99 (caltrans lcs)
      US 50 (mapbox) matches US-50 (caltrans lcs)
  */

export default async function getObstructions (stepMap, coords, callback) {
  const finalObstructions = [];
  const routeMap = new Map();
  const routeArr = [];

  stepMap.forEach(value => {
    // example: "Byron Highway CA 4 East" - which splits into three components
    const numParts = value.primary.components.length;
    const parts = value.primary.components;
    let filename = '';
    let direction = '';
    parts.forEach(part => {
      if (part.text.indexOf('US ') > -1 || part.text.indexOf('CA ') > -1 || part.text.indexOf('I-') > -1) {
        filename = part.text.replace('US ', 'US-').replace('CA ', 'SR-');
      }
    });
    if (numParts > 1) {
      direction = parts[numParts - 1].text;
    }
    routeMap.set(filename, direction);
    routeArr.push(filename);
  });

  let receivedJSON = 0;
  const targetJSON = routeArr.length; // + 2;

  /*
  // call CHPIncidents too
  getKML(`https://api.alpha.ca.gov/CHPIncidents?lat1=${coords.startCoords[1]}&lat2=${coords.endCoords[1]}&lon1=${coords.startCoords[0]}&lon2=${coords.endCoords[0]}`);
  // call full road closures too
  getKML(`https://api.alpha.ca.gov/RoadClosures?lat1=${coords.startCoords[1]}&lat2=${coords.endCoords[1]}&lon1=${coords.startCoords[0]}&lon2=${coords.endCoords[0]}`);
  */

  routeArr.forEach((route, index) => {
    const url = `https://api.alpha.ca.gov/LaneClosures/${route}?lat1=${coords.startCoords[1]}&lat2=${coords.endCoords[1]}&lon1=${coords.startCoords[0]}&lon2=${coords.endCoords[0]}&direction=${routeMap.get(routeArr[index])}`;
    window.fetch(url)
      .then(response => {
        return response.json();
      })
      .then(json => {
        json.route.forEach(issue => {
          finalObstructions.push(issue);
        });

        receivedJSON++;
        checkOut();
      })
      .catch(() => {
        receivedJSON++;
        checkOut();
      });
  });

  function checkOut () {
    if (receivedJSON === targetJSON) {
      callback(finalObstructions);
    }
  }

  // call checkout here in case we have 0 steps with highways
  checkOut();
  // reverted promise.all version which didn't include proper catch logic because sometimes routes can be missing
}
