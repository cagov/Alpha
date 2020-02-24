class CWDSHolidays extends HTMLElement {
  connectedCallback() {
    document.querySelectorAll('a[href*="#credits"]').forEach(item => {
      item.addEventListener('click',function(event) {
        const height = document.querySelector('.js-credits .card-container').style.height
        if (!height || height == '0px')
          document.querySelector('.js-credits button.accordion-alpha').click()
      })
    })

    const htmllang = document.querySelector("html").attributes["lang"].value
    const langquery = htmllang==="en"?"":`?lang=${htmllang}`

    fetch(`https://api.alpha.ca.gov/StateHolidayCalendar/all${langquery}`)
    .then(response => response.json())
    .then(data => {

      data.forEach(x => x["dateobject"]=new Date(x.date))

      const now = new Date()
      const nextrow = data.filter(x=>x.dateobject>now)[0]
      const locales = htmllang

      const fulldate = nextrow.dateobject.toLocaleDateString(locales, { weekday: 'long', month: 'long', day: 'numeric' })


      document.getElementById("current-holiday-date").innerText=fulldate //day_of_week+', '+month_name+' '+day_of_month
      document.getElementById("current-holiday-name").innerText=nextrow.name
    })








  }
}
window.customElements.define('cwds-holidays', CWDSHolidays)