import getGeo from './getgeo.js';
import getParameterByName from './getparams.js';

function displaySortedResults(query) {
  fetch(`https://api.alpha.ca.gov/HomelessShelters/?q=${query}`)
    .then(response => response.json())
    .then(data => {
      
      const results = document.querySelector(".js-nearest-results")
      results.innerHTML = '';
      const template = document.getElementById("result-template")

      document.querySelector(".data-match").innerHTML=data.match.match
      document.querySelector(".js-location-display").classList.remove('d-none');

      history.pushState({query}, window.title, window.location.origin + window.location.pathname + '?q='+query)

      
      for (const row of data.results) {
        const addresscombo = `${row.address}, ${row.city}, ${row.state} ${row.zipcode}`
        const node = template.content.cloneNode(true)
        node.querySelector(".data-name").innerHTML=row.name
        node.querySelector(".data-address").innerHTML=addresscombo
        let displayDesc = row.description.substr(0,250);
        if(row.description.length > 250) {
          displayDesc += '...';
        }
        node.querySelector(".data-description").innerHTML=displayDesc;
        const phone = node.querySelector(".data-phone")
        phone.href=`tel:${row.phone}`
        phone.innerText=row.phone
        node.querySelector(".data-more").href=row.url
        node.querySelector(".data-map-google").href = `https://maps.google.com/?q=${addresscombo}`
        node.querySelector(".data-map-apple").href = `https://maps.apple.com/?q=${addresscombo}`
        node.querySelector(".data-map-apple").setAttribute('alt', 'Directions to '+row.name);
        node.querySelector(".data-distance").innerHTML=row.location.distance 

        results.appendChild(node)
      }
  })
  .catch((e) => {
    document.getElementById("div-fail").classList.remove("d-none")
  })  
}

let query = getParameterByName("q");
if(query) {
  displaySortedResults(query);
}

if(document.querySelector('.shelters')) {
  document.querySelector('.js-lookup').addEventListener('submit',function(event) {
    event.preventDefault();
    document.querySelector('.invalid-feedback').style.display = 'none';
    var val = this.querySelector('input').value;
    displaySortedResults(val);
  })

  window.addEventListener('popstate', function(event) {
    let query = getParameterByName("q");
    if(query) {
      displaySortedResults(query);
    } else {
      document.querySelector(".js-location-display").classList.add('d-none');
      document.querySelector(".js-nearest-results").innerHTML = '';
    }
  });
}