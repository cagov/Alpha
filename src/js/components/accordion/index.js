class CWDSAccordion extends HTMLElement {
  connectedCallback() {
    this.expandTarget = this.querySelector('.card-container');
    this.expandButton = this.querySelector('.card-header');
    this.expandButton.addEventListener('click', this.listen.bind(this))
  }

  listen() {
    let cardBodyHeight = this.parentNode.querySelector('.card-body').clientHeight;
    if(this.expandTarget.clientHeight > 0) {
      this.expandTarget.style.height = '0px';
	  this.parentNode.querySelector('.card-header').classList.remove('accordion-alpha-open');
    } else {
      this.expandTarget.style.height = cardBodyHeight+'px';
	  this.parentNode.querySelector('.card-header').classList.add('accordion-alpha-open');
    }
  }
}
window.customElements.define('cwds-accordion', CWDSAccordion);

