# Lookup: search form + autocomplete

This custom element renders a search form with autocomplete (using awesomplete) which calls the api endpoint defined in the element attribute. The example markup below calls the api.alpha.ca.gov endpoint to autocomplete California counties or zip codes.

Choosing an autocomplete option or submitting the form dispatches a custom event on the cwds-lookup custom element with the chosen value.

This is used in conjunction with scripts that listen for the event and act on the chosen result. An example use on <a href="https://covid19.ca.gov/telehealth">telehealth</a> listens for the search field event, then uses the value to display the set of telehealth providers in that county.

<img src="https://raw.githubusercontent.com/cagov/Alpha/master/components/lookup/lookup.png" />


## Sample markup

```
<cwds-lookup 
  data-search-api="https://api.alpha.ca.gov/CaZipCityCountyTypeAhead?citymode=false&countymode=true&q=" 
  data-label="Please enter city or zip code"
  data-button-label="Find health plan"
>
</cwds-lookup>
```
