function processPassedItem(linkOutgoingOrIncomming, nameAgencyOrService) {
  var passedName = nameAgencyOrService.toLowerCase();

  if (linkOutgoingOrIncomming === "Out") {
    passedName = passedName.replace(/^[ ]+|[ ]+$/g, "");
    passedName = passedName.replace("-", "dashline");
    passedName = encodeURIComponent(passedName);

    var i = 0,
      strPassedNameLengthOut = passedName.length;

    for (i; i < strPassedNameLengthOut; i++) {
      passedName = passedName.replace("%20", "-");
    }

    if (passedName.indexOf("'") !== -1) {
      passedName = passedName.replace("'", "%27");
    }

    //--- BEGIN --- Code Mod to support stange proccesing of job training links  ----
    passedName = passedName.replace("get-job-training-in-", "job-training-in-");
    //--- END --- Code Mod to support stange proccesing of job training links  ----
  } else {
    passedName = decodeURIComponent(passedName);
    var j = 0,
      strPassedNameLength = passedName.length;
    for (j; j < strPassedNameLength; j++) {
      passedName = passedName.replace("-", " ");
    }
    passedName = passedName.replace("dashline", "-");
  }
  return passedName;
}

function buildAlphaAllList(idOfDivToFill, lang, agencyLandingPage) {
  var alphaListingResults = [];

  if (lang === "") {
    lang = "en";
  }

  //var apiLocation = "https://as-go-alph-d-002.azurewebsites.net/";
  var apiLocation = "https://api.stateentityprofile.ca.gov/";

  var builtApiUrl =
    apiLocation + "api/Agencies/Get?page=0&pageSize=0&lang=" + lang;
  var loadFlag = false;
  var loadCount = 0;

  function loadResults() {
    if (loadCount === 0) {
      var putApiRequest = new XMLHttpRequest();
      putApiRequest.open("POST", builtApiUrl, true);
      putApiRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          alphaListingResults.push(this.responseText);
        }
        if (this.readyState === 4 && this.status === 404) {
          alphaListingResults.push("NONEXISTS");
        }
      };
      putApiRequest.setRequestHeader("Content-Type", "application/json");
      putApiRequest.withCredentials = false;
      putApiRequest.send(null);
    }
    loadCount += 1;
    if (loadFlag === false) {
      if (typeof alphaListingResults[0] !== "undefined") {
        if (alphaListingResults[0].length > 10) {
          loadFlag = true;
        }
      }
      if (loadCount >= 50) {
        loadFlag = true;
      }
      window.setTimeout(
        loadResults,
        100
      ); /* this checks the flag every 100 milliseconds*/
    } else {
      if (loadCount < 50) {
        var result = JSON.parse(alphaListingResults[0]).Data;
        var arrayLength = result.length;
        var displayText = "";
        var recordCount = 0;
        var previousNavCharacter = "A";
        var currentNavCharacter = "";
        var navText = "";
        var theOrgListArray = [];
        var theOrgListCount = 0;

        for (var i = 0; i < arrayLength; i++) {
          var currentNavCharacter = result[i].AgencyName.charAt(0);
          if (!(currentNavCharacter == previousNavCharacter)) {
            navText +=
              '<li class="page-item"><a class="page-link" href="#' +
              previousNavCharacter.toLowerCase() +
              '">' +
              previousNavCharacter +
              "</a></li>";
            displayText +=
              '<p class="h6 text-right"><a href="#" class="back-to-top">Back to top <span class="ca-gov-icon-arrow-fill-up"></span></a></p>';
            displayText +=
              '<a name="' +
              currentNavCharacter.toLowerCase() +
              '"><h3>' +
              currentNavCharacter +
              "</h3>";
            previousNavCharacter = currentNavCharacter;
          } else {
            if (recordCount < 1) {
              displayText +=
                '<a name="' +
                previousNavCharacter.toLowerCase() +
                '">&nbsp;</a><h3>' +
                previousNavCharacter +
                "</h3>";
              recordCount += 1;
            }
          }
          var agencyNameToPass = processPassedItem(
            "Out",
            result[i].FriendlyName
          );
          displayText +=
            '<p><a aria-label="View Contact Information for ' +
            result[i].FriendlyName +
            '" href="' +
            agencyLandingPage +
            "?item=" +
            agencyNameToPass +
            '">' +
            result[i].FriendlyName +
            "</a></p>";
          theOrgListArray[theOrgListCount] = result[i].FriendlyName;
          theOrgListCount += 1;
        }

        navText +=
          '<li class="page-item"><a class="page-link" href="#' +
          previousNavCharacter.toLowerCase() +
          '">' +
          previousNavCharacter +
          "</a></li>";
        displayText +=
          '<p class="h6 text-right"><a href="#" class="back-to-top">Back to top <span class="ca-gov-icon-arrow-fill-up"></span></a></p>';
        document.getElementById("agency-nav").innerHTML = navText;
        document.getElementById(idOfDivToFill).innerHTML = displayText;

        var input = document.getElementById("searchitem");
        new Awesomplete(input, {
          list: theOrgListArray
        });
      }
    }
  }

  loadResults();
}

if (
  window.location.href.indexOf("contact-us/") > -1 &&
  window.location.href.indexOf("contact-us/results/") == -1 &&
  window.location.href.indexOf("contact-us/home/") == -1
) {
  buildAlphaAllList("agency-group", "en", "home/");
}

function buildResultsList(
  termToSearchFor,
  idOfDivToFill,
  lang,
  agencyLandingPage
) {
  var alphaListingResults = [];
  if (lang === "") {
    lang = "en";
  }

  var data = JSON.stringify({
    lang: lang,
    name: termToSearchFor,
    page: 0,
    pageSize: 1000,
    sortDirection: "Ascending"
  });

  //var apiLocation = "https://as-go-alph-d-002.azurewebsites.net/";
  var apiLocation = "https://api.stateentityprofile.ca.gov/";

  var builtApiUrl = apiLocation + "api/Agencies/Query";
  var loadFlag = false;
  var loadCount = 0;

  function loadResults() {
    if (loadCount === 0) {
      var putApiRequest = new XMLHttpRequest();
      putApiRequest.open("POST", builtApiUrl, true);
      putApiRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          alphaListingResults.push(this.responseText);
        }
        if (this.readyState === 4 && this.status === 404) {
          alphaListingResults.push("NONEXISTS");
        }
      };
      putApiRequest.setRequestHeader("Content-Type", "application/json");
      putApiRequest.withCredentials = false;
      putApiRequest.send(data);
    }
    loadCount += 1;
    if (loadFlag === false) {
      if (typeof alphaListingResults[0] !== "undefined") {
        if (alphaListingResults[0].length > 10) {
          loadFlag = true;
        }
      }
      if (loadCount >= 50) {
        loadFlag = true;
      }
      window.setTimeout(
        loadResults,
        100
      ); /* this checks the flag every 100 milliseconds*/
    } else {
      if (loadCount < 50) {
        var theResults = JSON.parse(alphaListingResults[0]);
        var resultsArray = theResults.Results;

        var arrayLength = resultsArray.length;
        var displayText = "";
        var recordCount = 0;

        if (arrayLength === 0) {
          displayText =
            '<div class="alert alert-warning" role="alert">No results returned for information submitted.</div>';
        } else {
          for (var i = 0; i < arrayLength; i++) {
            var agencyNameToPass = processPassedItem(
              "Out",
              resultsArray[i].FriendlyName
            );
            displayText +=
              '<p><a aria-label="View Contact Information for ' +
              resultsArray[i].FriendlyName +
              '" href="' +
              agencyLandingPage +
              "?item=" +
              agencyNameToPass +
              '">' +
              resultsArray[i].FriendlyName +
              "</a></p>";
          }
        }
        document.getElementById(idOfDivToFill).innerHTML = displayText;
      }
    }
  }
  loadResults();
}

function cleanInputItem(itemSubmitted) {
  var punctuationless = decodeURIComponent(itemSubmitted).replace(
    /[.,\/#!$%\^"&\*;:{}=\-_`~()]/g,
    ""
  );
  itemSubmitted = punctuationless.replace(/\s{2,}/g, " ");
  var temp = document.createElement("div");
  temp.textContent = itemSubmitted;
  itemSubmitted = temp.innerHTML;
  itemSubmitted = itemSubmitted.split("+").join(" ");

  return itemSubmitted;
}

function getQueryStringValue(uri, key) {
  return decodeURIComponent(
    uri.replace(
      new RegExp(
        "^(?:.*[&\\?]" +
          encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") +
          "(?:\\=([^&]*))?)?.*$",
        "i"
      ),
      "$1"
    )
  );
}

if (window.location.href.indexOf("contact-us/results/") > -1) {
  var searchTerm = cleanInputItem(
    getQueryStringValue(window.location.href, "searchitem")
  );

  document.getElementById("search-term-holder").innerHTML = searchTerm;

  searchTerm = searchTerm.replace(/California /gi, "");
  searchTerm = searchTerm.replace(/Department of /gi, "");
  searchTerm = searchTerm.replace(/California/gi, "");
  searchTerm = searchTerm.replace(/Board of /gi, "");
  searchTerm = searchTerm.replace(/ board/gi, "");
  searchTerm = searchTerm.replace(/ commission/gi, "");
  searchTerm = searchTerm.replace(/commission /gi, "");
  searchTerm = searchTerm.replace(/Bureau of /gi, "");
  searchTerm = searchTerm.replace(/ Bureau/gi, "");
  buildResultsList(searchTerm, "agency-group", "en", "../home/");
}

function showAgencyDetails(searchvalue, lang) {
  var agencyDetailsResults = [];
  var agencyNamePassed = processPassedItem("In", searchvalue);

  if (lang === "") {
    lang = "en";
  }

  //var apiLocation = "https://as-go-alph-d-002.azurewebsites.net/";
  var apiLocation = "https://api.stateentityprofile.ca.gov/";

  var builtApiUrl =
    apiLocation +
    "api/Agencies/FindAgenciesByName/" +
    agencyNamePassed +
    "/" +
    lang;

  var loadFlag = false;
  var loadCount = 0;

  function loadResults() {
    if (loadCount === 0) {
      var getApiRequest = new XMLHttpRequest();
      getApiRequest.open("GET", builtApiUrl, true);
      getApiRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          agencyDetailsResults.push(this.responseText);
        }
        if (this.readyState === 4 && this.status === 404) {
          agencyDetailsResults.push("NONEXISTS");
        }
      };
      getApiRequest.setRequestHeader("Content-Type", "application/json");
      getApiRequest.withCredentials = false;
      getApiRequest.send();
    }
    loadCount += 1;
    if (loadFlag === false) {
      if (typeof agencyDetailsResults[0] !== "undefined") {
        if (agencyDetailsResults[0].length > 10) {
          loadFlag = true;
        }
      }
      if (loadCount >= 1000) {
        loadFlag = true;
      }
      window.setTimeout(
        loadResults,
        100
      ); /* this checks the flag every 100 milliseconds*/
    } else {
      if (loadCount < 1000) {
        var result = JSON.parse(agencyDetailsResults[0]);

        this.apiData = result;

        var r = 0;
        var agencyArrayLength = this.apiData.length;
        if (agencyArrayLength > 0) {
          document.getElementById("org-name-holder").innerHTML = this.apiData[
            r
          ].FriendlyName;

          document.title =
            "Agency Contact Information for " +
            this.apiData[r].FriendlyName +
            " - Alpha.CA.gov";

          document.getElementById(
            "org-description-holder"
          ).innerHTML = this.apiData[r].Description;
          var contactInfo = "";
          if (this.apiData[r].ContactPhone) {
            contactInfo +=
              '<li><strong>General Information: </strong> <a href="tel:' +
              this.apiData[r].ContactPhone +
              '">' +
              this.apiData[r].ContactPhone +
              "</a></li>";
          }
          if (this.apiData[r].HearingImpairedPhone) {
            contactInfo +=
              '<li><strong>Hearing Impaired: </strong> <a href="tel:' +
              this.apiData[r].HearingImpairedPhone +
              '">' +
              this.apiData[r].HearingImpairedPhone +
              "</a></li>";
          }
          if (this.apiData[r].PhoneHours) {
            contactInfo +=
              "<li><strong>Phone Hours of Availability: </strong>" +
              this.apiData[r].PhoneHours +
              "</li>";
          }
          contactInfo +=
            '<li><a href="' +
            this.apiData[r].ContactURL +
            '">Agency contact page</a></li>';
          contactInfo +=
            '<li><a href="' + this.apiData[r].WebsiteURL + '">Website</a></li>';

          document.getElementById("org-contact-info").innerHTML = contactInfo;

          if (
            this.apiData[r].TwitterAccount ||
            this.apiData[r].Facebook ||
            this.apiData[r].YouTube
          ) {
            var socialMediaInfo =
              '<h2>Connect</h2><div class="list-group-flush">';

            if (this.apiData[r].TwitterAccount) {
              var twitterItem = this.apiData[r].TwitterAccount;
              twitterItem = twitterItem.replace("https://", "");
              twitterItem = twitterItem.replace("http://", "");
              twitterItem = twitterItem.replace("www.twitter.com/", "");
              socialMediaInfo +=
                '<a href="https://twitter.com/' +
                twitterItem +
                '" class="list-group-item list-group-item-action border-0"><span class="ca-gov-icon-twitter"></span>&nbsp;&nbsp;Twitter</a>';
            }
            if (this.apiData[r].Facebook) {
              var facebookItem = this.apiData[r].Facebook;
              facebookItem = facebookItem.replace("https://", "");
              facebookItem = facebookItem.replace("http://", "");
              facebookItem = facebookItem.replace("www.facebook.com/", "");
              socialMediaInfo +=
                '<a href="https://www.facebook.com/' +
                facebookItem +
                '" class="list-group-item list-group-item-action border-0"><span class="ca-gov-icon-facebook"></span>&nbsp;&nbsp;Facebook</a>';
            }
            if (this.apiData[r].YouTube) {
              var youTubeItem = this.apiData[r].YouTube;
              youTubeItem = youTubeItem.replace("https://", "");
              youTubeItem = youTubeItem.replace("http://", "");
              youTubeItem = youTubeItem.replace("www.youtube.com/", "");
              socialMediaInfo +=
                '<a href="https://www.youtube.com/' +
                youTubeItem +
                '" class="list-group-item list-group-item-action border-0"><span class="ca-gov-icon-youtube"></span>&nbsp;&nbsp;YouTube</a>';
            }

            document.getElementById("org-social-media").innerHTML =
              socialMediaInfo + "</div>";
          }
        }
      }
    }
  }
  loadResults();
}

if (window.location.href.indexOf("contact-us/home/") > -1) {
  var agencyToGet = getQueryStringValue(window.location.href, "item");
  agencyToGet = agencyToGet.replace(/\s+$/, "");
  showAgencyDetails(agencyToGet, "");
}
