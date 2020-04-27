export default function(formLabel, buttonLabel) {
  return `<form class="form-inline form-inline-left js-cagov-lookup">
  <div class="form-group">
    <label for="location-query"
      >${formLabel}:</label
    >
    <div class="awesomplete">
      <div class="awesomplete">
        <input
          aria-expanded="false"
          aria-owns="awesomplete_list_1"
          autocomplete="off"
          class="city-search form-control"
          data-list=""
          data-multiple=""
          id="location-query"
          role="combobox"
          type="text"
        />
        <ul hidden="" role="listbox" id="awesomplete_list_1"></ul>
        <span
          class="visually-hidden"
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          >Type 2 or more characters for results.</span
        >
      </div>
      <ul hidden="" id="awesomplete-list-1" role="listbox"></ul>
      <span
        class="visually-hidden"
        aria-atomic="true"
        aria-live="assertive"
        role="status"
        >Type 2 or more characters for results.</span
      >
    </div>
    <button class="btn btn-primary" type="submit">${buttonLabel}</button>
    <div class="invalid-feedback">
      Please enter a county or zip code in California.
    </div>
  </div>
  </form>`
}