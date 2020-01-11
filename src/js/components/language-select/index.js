class CWDSLanguageSelect extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="dropdown">
      <button class="btn btn-light btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        Select language
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="/">English</a>
        <a class="dropdown-item" href="/es/">Spanish</a>
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
        window.location = window.location.pathname.replace('/',this.href);
      })
    })
  }
}
window.customElements.define('cwds-language-select', CWDSLanguageSelect);