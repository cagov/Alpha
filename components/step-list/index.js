class CWDSStepList extends HTMLElement {
  connectedCallback() {
    this.expandTargets = this.querySelectorAll('.list-group-item-action');
    this.expandTargets.forEach( (item) => {
      let detailsEl = item.querySelector('.details');
      detailsEl.setAttribute('data-collapsed', 'true');
      detailsEl.style.height = '0px'
      detailsEl.setAttribute('aria-hidden','true')
      item.addEventListener('click', this.listen)
    })
  }

  listen() {
    let section = this.querySelector('.details');
    let activeButton = this.querySelector('.step-description');

    let isCollapsed = section.getAttribute('data-collapsed') === 'true';
      
    if(isCollapsed) {
      expandSection(section)
      section.setAttribute('data-collapsed', 'false')
      activeButton.setAttribute('aria-expanded','true');
      section.setAttribute('aria-hidden', 'false')
      this.classList.add('list-open')      
    } else {
      collapseSection(section)
      this.classList.remove('list-open')
      activeButton.setAttribute('aria-expanded','false');
    }
  }
}

window.customElements.define('cwds-step-list', CWDSStepList);

/* expand, collapse thanks to: https://css-tricks.com/using-css-transitions-auto-dimensions/ */
function collapseSection(element) {
  var sectionHeight = element.scrollHeight;

  requestAnimationFrame(function() {
    element.style.height = sectionHeight + 'px';
    
    requestAnimationFrame(function() {
      element.style.height = 0 + 'px';
    });
  });
  
  element.setAttribute('data-collapsed', 'true');
  element.setAttribute('aria-hidden', 'true');
}

function expandSection(element) {
  var sectionHeight = element.scrollHeight;
  element.style.height = sectionHeight + 'px';
  element.setAttribute('data-collapsed', 'false');
}