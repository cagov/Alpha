class CWDSHolidays extends HTMLElement {
  connectedCallback() {
    document.querySelectorAll('a[href*="#credits"]').forEach(item => {
      item.addEventListener('click',function(event) {
        const height = document.querySelector('.js-credits .card-container').style.height
        if (!height || height == '0px')
          document.querySelector('.js-credits button.accordion-alpha').click()
      })
    })
  }
}
window.customElements.define('cwds-holidays', CWDSHolidays)

if(document.getElementById("current-holiday-date")) {
  fetch('https://api.alpha.ca.gov/StateHolidayCalendar/next')
    .then(response => response.json())
    .then(data => {
      document.getElementById("current-holiday-date").innerText=data.day_of_week+', '+data.month_name+' '+data.day_of_month
      document.getElementById("current-holiday-name").innerText=data.name
  })
}
