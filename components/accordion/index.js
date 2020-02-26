class CWDSAccordion extends HTMLElement {
  connectedCallback() {
    this.expandTarget = this.querySelector('.card-container');
    this.expandButton = this.querySelector('.card-header');
    this.expandButton.addEventListener('click', this.listen.bind(this))
  }

  listen() {
    if(!this.cardBodyHeight) {
      this.cardBodyHeight = this.querySelector('.card-body').clientHeight;
    }
    if(this.expandTarget.clientHeight > 0) {
      this.expandTarget.style.height = '0px';
      this.expandTarget.setAttribute('aria-hidden','true')
      this.querySelector('.card-header').classList.remove('accordion-alpha-open');
      let expando = this.expandTarget;
      setTimeout(function() {
        expando.style.display = "none";
      }, 300)
    } else {
      this.expandTarget.style.display = "block";
      this.expandTarget.style.height = this.cardBodyHeight+'px';
      this.expandTarget.setAttribute('aria-hidden','false')
      this.querySelector('.card-header').classList.add('accordion-alpha-open');
      this.querySelector('.card-container').classList.remove('collapsed');
    }
  }
}
window.customElements.define('cwds-accordion', CWDSAccordion);