import Awesomplete from 'awesomplete-es6';
import lookupFrom from './form.js';

class CWDSLookup extends window.HTMLElement {
  connectedCallback () {
    /*
      search component
      - retrieves data from api
      - when it gets results it emits event
    */
   const endpoint = this.dataset.searchApi; // 'https://api.alpha.ca.gov/CaZipCityCountyTypeAhead?citymode=false&countymode=true&q=';
   let html = lookupFrom('Please enter your county or zip code','Find health plan');
   this.innerHTML = html;

   const fieldSelector = 'input[data-multiple]';
   let component = this;
   const awesompleteSettings = {
     autoFirst: true,
     filter: function (text, input) {
       return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
     },
 
     item: function (text, input) {
       document.querySelector('.invalid-feedback').style.display = 'none';
       document.querySelector('.city-search').classList.remove('is-invalid');
       return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
     },
 
     replace: function (text) {
       let before = this.input.value.match(/^.+,\s*|/)[0];
       let finalval = before + text;
       this.input.value = finalval;
       component.dispatchEvent(new CustomEvent("showResults", {
        detail: finalval
      }));
     }
   };
 
   const aplete = new Awesomplete(fieldSelector, awesompleteSettings)
 
   document.querySelector(fieldSelector).addEventListener('keyup', event => {
     const skipKeys = [13, 9, 27, 38, 40]; // do not reset suggestion list if using arrow keys, enter, tab
     if (event.target.value.length >= 2) {
       if (skipKeys.indexOf(event.keyCode) === -1) {
         let q = event.target.value;
         window.lookup = q;
         // todo: what is this for ^^^???
         const url = `${endpoint}${q}`;
         window.fetch(url)
           .then(response => response.json())
           .then(data => {
               aplete.list = data.match.map(x=>x);
           })
           .catch(() => {
             //resetForm();
           });       
       }
     }
   });
 
   document
     .querySelector('.js-cagov-lookup')
     .addEventListener('submit', (event) => {
       event.preventDefault();
       document.querySelector('.invalid-feedback').style.display = 'none';
       document.querySelector('.city-search').classList.remove('is-invalid');
       let finalval = this.querySelector('input').value;
       this.dispatchEvent(new CustomEvent("showResults", {
        detail: finalval
      }));
     });
 
  }
}
window.customElements.define('cwds-lookup', CWDSLookup);