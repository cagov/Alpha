class CWDSLanguageSelect extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="dropdown">
      <button class="btn btn-light btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        Select language
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        ${(function() {
          if(window.location.pathname.indexOf('/es/') != 0) {
            return `<a class="dropdown-item" href="/es/">Español</a>`
          } else {
            return `<a class="dropdown-item" href="/en/">English</a>`
          }
        })()}
      </div>
    </div>`;

    this.listen();

  }

  listen() {
    this.querySelector('.dropdown-toggle').addEventListener('click',function(event) {
      event.preventDefault();
      this.parentNode.querySelector('.dropdown-menu').classList.toggle('show');
    })
    this.querySelectorAll('.dropdown-item').forEach( (item) => {
      item.addEventListener('click', function(event) {
        event.preventDefault();
        if(window.location.pathname.indexOf('/es/') != 0) {
          window.location = window.location.pathname.replace('/en/',this.href);
        } else {
          window.location = window.location.pathname.replace('/es/',this.href);
        }
      })
    })
  }
}
window.customElements.define('cwds-language-select', CWDSLanguageSelect);