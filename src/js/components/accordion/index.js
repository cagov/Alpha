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
    } else {
     this.expandTarget.style.height = cardBodyHeight+'px';
    }
  }
}
window.customElements.define('cwds-accordion', CWDSAccordion);