class CWDSStepList extends HTMLElement {
  connectedCallback() {
    this.expandTargets = this.querySelectorAll('li');
    this.expandTargets.forEach( (item) => {
      item.addEventListener('click', this.listen)
      let detailsEl = item.querySelector('.details');
      if(detailsEl) {
        setTimeout(function() {
          detailsEl.detailsHeight = detailsEl.scrollHeight;
          detailsEl.style.display = "none";
        }, 30)
      }
    })
  }

  listen() {
    let detailsEl = this.querySelector('.details');
    let detailsHeight = detailsEl.detailsHeight

    if(this.classList.contains('list-open')) {
      this.classList.remove('list-open')
    } else {
      this.classList.add('list-open')
    }
    if(!detailsEl.style.height || detailsEl.style.height.indexOf('0px') == 0) {
      detailsEl.style.display = "block";
      // need to timeout here to prevent the browser from grouping these two statements and killing the animation
      setTimeout(function() {
        detailsEl.style.height = detailsHeight + 'px';
      }, 30)
    } else {
      detailsEl.style.height = 0;
      // timeout here to give animation time to complete before hide
      setTimeout(function() {
        detailsEl.style.display = "none";
      }, 300)

    }
  }
}
window.customElements.define('cwds-step-list', CWDSStepList);