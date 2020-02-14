  /*
    Mapbox directions to Caltrans routes translations:
      I-5 matches exactly to I-5
      CA 99 (mapbox) matches SR-99 (caltrans lcs)
      US 50 (mapbox) matches US-50 (caltrans lcs)
  */

  export default async function getObstructions(stepMap, coords, callback) {
  let finalObstructions = [];
  let routeMap = new Map();
  let routeArr = [];

  stepMap.forEach( (value, key, map) => {
    // example: "Byron Highway CA 4 East" - which splits into three components
    let numParts = value.primary.components.length;
    let parts = value.primary.components;
    let filename = '';
    let direction = '';
    parts.forEach( (part) => {
      if(part.text.indexOf('US ') > -1 || part.text.indexOf('CA ') > -1 || part.text.indexOf('I-') > -1) {
        filename = part.text.replace('US ','US-').replace('CA ','SR-');    
      }
    })
    if(numParts > 1) {
      direction = parts[numParts - 1].text;
    }
    routeMap.set(filename,direction);
    routeArr.push(filename);
  })

  let receivedJSON = 0;
  let targetJSON = routeArr.length; // + 2;

  /*
  // call CHPIncidents too
  getKML(`https://api.alpha.ca.gov/CHPIncidents?lat1=${coords.startCoords[1]}&lat2=${coords.endCoords[1]}&lon1=${coords.startCoords[0]}&lon2=${coords.endCoords[0]}`);
  // call full road closures too
  getKML(`https://api.alpha.ca.gov/RoadClosures?lat1=${coords.startCoords[1]}&lat2=${coords.endCoords[1]}&lon1=${coords.startCoords[0]}&lon2=${coords.endCoords[0]}`); 
  */

  routeArr.forEach( (route, index) => {
    let url = `https://api.alpha.ca.gov/LaneClosures/${route}?lat1=${coords.startCoords[1]}&lat2=${coords.endCoords[1]}&lon1=${coords.startCoords[0]}&lon2=${coords.endCoords[0]}&direction=${routeMap.get(routeArr[index])}`
    fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      
      json.route.forEach( (issue) => {
        finalObstructions.push(issue);
      })

      receivedJSON++;
      checkOut();
    })
    .catch(function(err) {
      receivedJSON++;
      //console.log(err.message); // some coding error in handling happened
      checkOut();
    });
  })

  function getKML(url) {
    fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      json.forEach( (issue) => {
        finalObstructions.push(issue);
      })
      receivedJSON++;
      checkOut();
    })
    .catch(function(err) {
      receivedJSON++;
      //console.log(err.message); // some coding error in handling happened
      checkOut();
    });
  }



  function checkOut() {
    if(receivedJSON == targetJSON) {
      callback(finalObstructions);
    } else {
    }
  }
  // reverted promise.all version which didn't include proper catch logic because sometimes routes can be missing
}

