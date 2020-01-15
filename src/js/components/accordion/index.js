class CWDSAccordion extends HTMLElement {
  connectedCallback() {
    this.expandTarget = this.querySelector('.card-container');
    this.expandButton = this.querySelector('.card-header');
    this.expandButton.addEventListener('click', this.listen.bind(this))
  }

  listen() {
    let cardBodyHeight = this.parentNode.querySelector('.card-body').clientHeight;
    if(this.style.display == 'none' || this.expandTarget.clientHeight > 0) {
      this.expandTarget.style.height = '0px';
      this.querySelector('.card-header').classList.remove('accordion-alpha-open');
      let expando = this.expandTarget;
      setTimeout(function() {
        // expando.style.display = "none";
      }, 300)
    } else {
      // this.expandTarget.style.display = "block";
      this.expandTarget.style.height = cardBodyHeight+'px';
      this.querySelector('.card-header').classList.add('accordion-alpha-open');
    }
  }
}
window.customElements.define('cwds-accordion', CWDSAccordion);