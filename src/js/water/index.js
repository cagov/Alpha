import gotSystem from "./got-system.js";
import getParameterByName from "./getparams.js";

if(document.querySelector('body.js-water')) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWFyb25oYW5zIiwiYSI6ImNqNGs4cms1ZzBocXkyd3FzZGs3a3VtamYifQ.HQjFfVzwwxwCmGr2nvnvSA";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-79.4512, 43.6568],
    zoom: 13
  });

  // look for pwsid in url, should also have location

  console.log('what the fuck');
  
  window.geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: " ",
    bbox: [-124.409591, 32.534156, -114.131211, 42.009518],
    mapboxgl: mapboxgl
  }).on("result", async function(item) {
    window.waterPoint = item;
    let waterButton = document.querySelector(".js-water-lookup");

    waterButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...`;
    document.querySelector(".system-data").style.display = "none";

    // make call to endpoint to find system
    retrieveSystemData(item, waterButton);
  });

  document
    .querySelector(".js-water-form")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      document.querySelector(".invalid-feedback").style.display = "none";
      if (item.waterPoint) {

      }
    });

  function retrieveSystemData(item, waterButton) {
    fetch(
      `https://api.alpha.ca.gov/WaterSystem?lat=${item.result.center[1]}&lon=${item.result.center[0]}`
    )
      .then(response => {
        return response.json();
      })
      .then(systemData => {
        gotSystem(systemData);
      })
      .catch(error => {
        waterButton.innerHTML = `Check your water`;
        document.querySelector(".system-data").style.display = "block";
      });
  }

  if (getParameterByName("systemId")) {
    let url = `https://api.alpha.ca.gov/WaterSystem?systemId=${getParameterByName(
      "systemId"
    )}`;
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(systemData => {
        gotSystem(systemData);
        document.querySelector(".system-data").style.display = "block";
      })
      .catch(error => {});
  }

  document.getElementById("geocoder").appendChild(window.geocoder.onAdd(map));
}