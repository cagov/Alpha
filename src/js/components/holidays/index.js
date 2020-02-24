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

      document.getElementById("current-holiday-date").innerText=fulldate
      document.getElementById("current-holiday-name").innerText=nextrow.name


      const template = document.getElementById("js-template")
      //const results = document.getElementById("js-tbody-template-2020-results")

      //<td><span class="data-holiday-date">Date</span><span class="d-none data-holiday-credit-link">(<a href="#credits">holiday credit</a>)</span></td>
      //<td class="data-holiday-day-of-week">day of week</td>
      //<td class="data-holiday-name">name</td>

      const addrows = (targetcontainer,year) => {
        for (const row of data.filter(x=>x.dateobject.getFullYear()===year)) {
          const node = template.content.cloneNode(true)
          node.querySelector(".data-holiday-date").innerText=row.dateobject.toLocaleDateString(locales, { month: 'long', day: 'numeric' })
          node.querySelector(".data-holiday-day-of-week").innerText=row.dateobject.toLocaleDateString(locales, { weekday: 'long' })
          node.querySelector(".data-holiday-name").innerText=row.name

          if(row.dateobject.getDay()===0 || row.dateobject.getDay()===6)
            node.querySelector(".data-holiday-credit-link").classList.remove('d-none');
          
  
          targetcontainer.appendChild(node)
        }
      }

      addrows(document.getElementById("js-tbody-template-2020-results"),2020)
      addrows(document.getElementById("js-tbody-template-2021-results"),2021)
    })
  }
}
window.customElements.define('cwds-holidays', CWDSHolidays)