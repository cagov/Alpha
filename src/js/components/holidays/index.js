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