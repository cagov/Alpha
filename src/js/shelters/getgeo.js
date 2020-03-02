export default function getGeo () {
  var startPos;
  var geoSuccess = function (position) {
    // Do magic with location
    startPos = position;
    document.querySelector('.js-location-display').innerHTML = `<h2>${translations['Showing food banks near']} ${translations.you}</h2>`;
    displaySortedResults([position.coords.longitude, position.coords.latitude]);
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
