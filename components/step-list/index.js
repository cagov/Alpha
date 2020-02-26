class CWDSStepList extends HTMLElement {
  connectedCallback() {
    this.expandTargets = this.querySelectorAll('.list-group-item-action');
    this.expandTargets.forEach( (item) => {
      let detailsEl = item.querySelector('.details');
      detailsEl.setAttribute('data-collapsed', 'true');
      detailsEl.style.height = '0px'
      item.addEventListener('click', this.listen)
    })
  }

  listen() {
    var section = this.querySelector('.details');
    var isCollapsed = section.getAttribute('data-collapsed') === 'true';
      
    if(isCollapsed) {
      expandSection(section)
      section.setAttribute('data-collapsed', 'false')
      this.classList.remove('list-open')
    } else {
      collapseSection(section)
      this.classList.add('list-open')
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
}

function expandSection(element) {
  var sectionHeight = element.scrollHeight;
  element.style.height = sectionHeight + 'px';
  element.setAttribute('data-collapsed', 'false');
}