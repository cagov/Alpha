import analytes from "./analytes.js";
let analyteArray = new analytes();
let analyteDetails = new Map();
analyteArray.forEach(an => {
  analyteDetails.set(an.key, an);
});

function capitalizer(name) {
  let noCap = ['of','and','for','a'];
  let allCap = ['mud']
  let pieces = name.split(' ');
  let finalString = '';
  pieces.forEach( (piece) => {
    if(noCap.indexOf(piece.toLowerCase()) > -1) {
      finalString += piece.toLowerCase() + ' ';
    } else if(allCap.indexOf(piece.toLowerCase()) > -1) {
      finalString += piece.toUpperCase() + ' ';
    } else {
      finalString += piece[0].toUpperCase() + piece.substr(1,piece.length - 1).toLowerCase() + ' ';
    }
  })
  return finalString.trim();
}

export default function gotSystem(systemData) {
  let system = systemData[0];
  if (systemData.length > 0) {
    if (systemData.length > 1) {
      system = systemData[systemData.length - 1];
    }

    let systemId = system.properties.pwsid;
    let website_blurb = "";
    let website_blurb_1 = "";
    let resultsOutput = "";
    if (
      system.properties.systemData &&
      system.properties.systemData.meta &&
      system.properties.systemData.meta.website
    ) {
      let website = system.properties.systemData.meta.website;
      if (website.indexOf("http") < 0) {
        website_blurb = `<p class="mb-5"><a class="action-link" href="http://${website}">Visit your water system</a></p>`;
      }
      website_blurb_1 = ` Your water system has the most detailed information about your water quality. <a href="${website}" target="_self">Visit your water system</a>`;
    }
    
    document.querySelector(".system-info").style.display = 'block';
    history.pushState({systemId: systemId}, window.title, window.location.origin + window.location.pathname + '?systemId='+systemId)

    fetch(
      `https://api.alpha.ca.gov/WaterSystemHistory?systemId=${systemId}`
    )
      .then(response => {
        return response.json();
      })
      .then(history => {
        if (history.length == 0) {
          displaySafe(website_blurb, system);
          cleanup();
        } else {
          // create map of latest violation for
          let analyteMap = new Map();
          history.forEach(violation => {
            let lastMatch = analyteMap.get(violation.ANALYTE_NAME);
            if (lastMatch) {
              if (lastMatch.VIOL_END_DATE < violation.VIOL_END_DATE || (lastMatch.VIOL_END_DATE == violation.VIOL_END_DATE && violation.ENF_ACTION_TYPE_ISSUED == "RETURN TO COMPLIANCE")) {
                analyteMap.set(violation.ANALYTE_NAME, violation);
              }
            } else {
              analyteMap.set(violation.ANALYTE_NAME, violation);
            }
          });

          resultsOutput = `<h2>Your water quality</h2>
            <p>Your water did not meet <a href="https://mywaterquality.ca.gov/safe_to_drink/">California’s safety standards</a>. We found these contaminants in your water: </p>`;

          analyteMap.forEach(analyte => {
            if(analyte.ENF_ACTION_TYPE_ISSUED != 'RETURN TO COMPLIANCE') {
                resultsOutput += `<div class="card border-dark mb-3">
              <div class="card-body row">
                ${(function() {
                  if (
                    analyte.ANALYTE_NAME == "GROUNDWATER RULE" ||
                    analyte.ANALYTE_NAME == "SWTR"
                  ) {
                    return `<div class="col flex pr-3">
                      <div class="bold display-4 text-center">
                        <span class="ca-gov-icon-biohazard display-4" aria-hidden="true"></span>
                      </div>
                      <p class="font-weight-light text-center"></p>
                    </div>
                    <div class="water-label">
                      <h5 class="card-title display-5">Microbial pathogens</h5>
                      <div class="progress" style="height: 40px;">
                        <div class="progress-bar progress-bar-striped bg-warning progress-bar-animated w-100" aria-hidden="true"></div>
                      </div>
                    </div>`;
                  } else if (analyte.ANALYTE_NAME == "TURBIDITY") {
                    return `<div class="col flex pr-3">
                        <div class="bold display-4 text-center">
                          <span class="ca-gov-icon-biohazard display-4" aria-hidden="true"></span>
                        </div>
                        <p class="font-weight-light text-center"></p>
                      </div>
                      <div class="water-label">
                        <h5 class="card-title display-5">Particles that make the water look cloudy or hazy</h5>
                        <div class="progress" style="height: 40px;">                        
                          <div class="progress-bar progress-bar-striped bg-warning progress-bar-animated w-100" aria-hidden="true"></div>
                        </div>
                      </div>`;
                  } else {
                    return `<div class="col flex">
                      <div class="bold display-4 text-center">${(analyte.RESULT /
                        analyte.MCL_VALUE).toFixed(1) }x</div>
                      <p class="font-weight-light text-center">the legal limit</p>
                    </div>
                    <div class="water-label">
                      <h5 class="card-title display-5">${
                        analyte.ANALYTE_NAME
                      }</h5>
                      <div class="progress" style="height: 40px;">
                        <div class="progress-bar bg-dark" aria-hidden="true" aria-valuenow="10" style="width: ${(100 / (analyte.RESULT /
                            analyte.MCL_VALUE))}%"></div>
                        <div class="progress-bar  bg-white" aria-hidden="true" style="width: 1%;"><span class="limit">legal limit</span></div>
                        <div class="progress-bar progress-bar-striped bg-danger progress-bar-animated" aria-hidden="true" style="width: ${(((analyte.RESULT /
                              analyte.MCL_VALUE) *
                              100) - 100) / ((analyte.RESULT /
                                analyte.MCL_VALUE) *
                                100) * 100}%" ></div>
                      </div>
                    </div>`;
                  }
                })()}
              </div>
            </div>
            ${(function() {
              if (analyteDetails.get(analyte.ANALYTE_NAME)) {
                let analyteDets = analyteDetails.get(analyte.ANALYTE_NAME);
                return `<div class="col">
                  <h4>When ${analyteDets.name} was found</h4>
                  <p>On ${new Date(analyte.VIOL_BEGIN_DATE).toLocaleString('en-US', { year: 'numeric', month: 'long',  day: 'numeric'})}, your water system found ${analyteDets.name} in your water.</p>
                  <h4>Potential health effects from long-term exposure to ${analyteDets.name}</h4>
                  <p>${analyteDets.risk}</p>
                  <h4>Common sources of ${analyteDets.name}</h4>
                  <p>${analyteDets.source}</p>
                </div>`;
              } else {
                return ``;
              }
              })()}`;
            }
          });
          document.querySelector(
            ".system-status"
          ).innerHTML = resultsOutput + `${getSystemHTMLUnSafe(website_blurb, system)}`;
          cleanup();
        }
      })
      .catch(error => {
        displaySafe(website_blurb, system);
        cleanup();
      });
  } else {
    document.querySelector(
      ".system-status"
    ).innerHTML = `<div class="invalid-feedback error1 alert alert-warning" style="display: block;">Sorry, we couldn't find a water system for that location</div>`;
    document.querySelector(".system-info").innerHTML = "";
    cleanup();
  }
}


function displaySafe(website_blurb, system) {
  let html = `<h2>Your water quality</h2>
  <p>Your tap water met <a href="https://mywaterquality.ca.gov/safe_to_drink/">California safety standards</a> as of August 30, 2019. </p>
    ${getSystemHTMLSafe(website_blurb, system)}`;

  document.querySelector(".system-status").innerHTML = html;
}

function getSystemHTMLSafe(website_blurb, system) {
  return `<h3 class="card-title">Where your water comes from</h3>
    <p>Your water system is <strong>${capitalizer(system.properties.name)}</strong>.
    They test your water before it leaves their facilities. Your water system also has the most up-to-date and detailed information about your water. They publish a yearly report on your water quality called a <a href="https://www.epa.gov/ccr/ccr-information-consumers">Consumer Confidence Report</a>. ${website_blurb} </p>`;
}

function getSystemHTMLUnSafe(website_blurb, system) {
  return `<h3 class="card-title">Where your water comes from</h3>
    <p class="card-text">Your water system 
is <strong>${capitalizer(system.properties.name)}</strong>.
    They test your water before it leaves their facilities. Your water system also keeps the most up-to-date and detailed information about your water. They publish a yearly report on your water quality called a <a href="https://www.epa.gov/ccr/ccr-information-consumers">Consumer Confidence Report</a>. </p> 
    <p>Now that your water is not safe to drink, they will have advice about what to do. ${website_blurb}</p>`;
}

function cleanup() {
  let waterButton = document.querySelector(".js-water-lookup");
  waterButton.innerHTML = `Check your water`;
  document.querySelector(".system-data").style.display = "block";
}
