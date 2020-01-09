class CWDSStepList extends HTMLElement {
  connectedCallback() {
    this.expandTargets = this.querySelectorAll('li');
    this.expandTargets.forEach( (item) => {
      item.addEventListener('click', this.listen)
    })
  }

  listen() {
    let detailsEl = this.querySelector('.details');
    if(this.classList.contains('list-open')) {
      this.classList.remove('list-open')
    } else {
      this.classList.add('list-open')
    }
    if(!detailsEl.style.height || detailsEl.style.height.indexOf('0px') == 0) {
      detailsEl.style.height = detailsEl.scrollHeight + 'px';
    } else {
      detailsEl.style.height = '0px';
    }
  }
}
window.customElements.define('cwds-step-list', CWDSStepList);