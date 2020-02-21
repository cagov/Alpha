import getCounties from "./counties.js";
import getZips from "./zips.js";

const counties = getCounties();
const zips = getZips();

let countyNames = [];
counties.forEach(county => {
  countyNames.push(county.name);
});

let awesompleteList = [...countyNames, ...zips];

new Awesomplete("input[data-multiple]", {
  list: awesompleteList,
  filter: function(text, input) {
    return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
  },

  item: function(text, input) {
    document.querySelector(".invalid-feedback").style.display = "none";
    document.querySelector(".city-search").classList.remove("is-invalid");
    return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
  },

  replace: function(text) {
    var before = this.input.value.match(/^.+,\s*|/)[0];
    var finalval = before + text;
    this.input.value = finalval;
    templateHTML(finalval);
  }
});

document
  .querySelector(".js-alert-lookup")
  .addEventListener("submit", function(event) {
    event.preventDefault();
    document.querySelector(".invalid-feedback").style.display = "none";
    document.querySelector(".city-search").classList.remove("is-invalid");
    var finalval = this.querySelector("input").value;
    templateHTML(finalval);
  });

function templateHTML(inputval) {
  if (inputval.match(/^\d+$/)) {
    // we are dealing with a zip code
    fetch("https://api.alpha.ca.gov/countyfromzip/" + inputval)
      .then(response => {
        return response.json();
      })
      .then(myzip => {
        lookupSuccess(myzip.county);
      })
      .catch(e => {
        lookupFail();
      });
  } else {
    lookupSuccess(inputval);
  }
}

function lookupSuccess(inputval) {
  let chosenCounty;
  counties.forEach(county => {
    if (county.name.toLowerCase() == inputval.toLowerCase()) {
      chosenCounty = county;
    }
  });
  if (!chosenCounty) {
    lookupFail();
  } else {
    let county = chosenCounty.name;
    let url = chosenCounty.url;
    document.querySelector(
      ".js-county-alert"
    ).innerHTML = `<li class="card mb-20  border-0">
    <h2>Alerts for ${inputval}</h2>
      <div class="card-body bg-light">
        <a class="action-link" href="${url}">
          Sign up for ${(county.toLowerCase().indexOf('county') > -1) ? county : county + ' County'} alerts
        </a>
      </div>
    </li>`;
  }
}

function lookupFail() {
  document.querySelector(".invalid-feedback").style.display = "block";
}