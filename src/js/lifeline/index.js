if (window.location.href.endsWith('#2')) {
  document.querySelectorAll('.list-group-item-action').forEach((x, i) => {
    if (i === 1) setTimeout(() => x.click(), 500);
  });
}

if (window.location.href.endsWith('#4')) {
  document.querySelectorAll('.list-group-item-action').forEach((x, i) => {
    if (i === 3) setTimeout(() => x.click(), 500);
  });
}

// for /qualified
const ulPrograms = document.getElementById('ul-programs');

if (ulPrograms) {
  const programs = new URLSearchParams(window.location.search).getAll('programs');

  while (ulPrograms.firstChild) {
    ulPrograms.removeChild(ulPrograms.firstChild);
  }

  programs.forEach(x => {
    const li = document.createElement('li');
    li.innerText = x;
    ulPrograms.appendChild(li);
  });
}

// Setup the list
const checklabels = document.querySelectorAll('.form-group .custom-control-label');
checklabels.forEach(x => {
  const checkbox = document.getElementById(x.htmlFor);
  checkbox.name = 'programs';
  checkbox.value = x.innerHTML;
});

// Count of programs selected
const programs = new URLSearchParams(window.location.search).get('programs');
if (programs) {
  const btnNotQualified = document.getElementById('btn-not-qualified');
  const btnNotSureQualified = document.getElementById('btn-not-sure-qualified');

  if (btnNotQualified && btnNotSureQualified) {
    if (programs === 'no') { btnNotSureQualified.classList.toggle('d-none'); } else { btnNotQualified.classList.toggle('d-none'); }
  }

  const programsBox = document.getElementById('programs');
  if (programsBox) programsBox.value = programs;
}

const household = new URLSearchParams(window.location.search).get('household');
if (household) {
  const people = Number(household);

  let bucks = 0;
  switch (people) {
    case 1:
    case 2:
      bucks = 27500;
      break;
    case 3:
      bucks = 31900;
      break;
    default:
      bucks = 38800 + 6900 * (people - 3);
  }

  document.getElementById('js-spn-income-cap').innerText = bucks.toLocaleString();
}

function itemclick (o) {
  o.addEventListener('click', function () {
    this.parentNode.classList.toggle('active');

    // X-able the next button based on selections
    const button = document.querySelector('#btn-next');
    if (document.querySelector('.list-group li.active')) {
      button.setAttribute('aria-disabled', 'false');
      button.removeAttribute('disabled');
    } else {
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('disabled', '');
    }
  });
}

// Add click event to every checkbox listitem
Array.prototype.forEach.call(
  document.querySelectorAll('.list-group-item input'),
  itemclick
);

// Tooltip support
Array.prototype.forEach.call(
  document.querySelectorAll('.tooltip-button'),
  toggletip => {
    toggletip.setAttribute('type', 'button');
    toggletip.setAttribute('aria-label', 'Word Definition');

    // wrap a container around the button
    let container = document.createElement('span');
    container.setAttribute('class', 'tooltip-container');
    toggletip.parentNode.insertBefore(container, toggletip);
    container.appendChild(toggletip);

    // Create the live region
    let liveRegion = document.createElement('span');
    liveRegion.setAttribute('role', 'status');

    // Place the live region in the container
    container.appendChild(liveRegion);

    // Get the message from the data-content element
    let message = toggletip.getAttribute('data-tooltip-content');

    // Toggle the message
    toggletip.addEventListener('click', () => {
      liveRegion.innerHTML = '';
      window.setTimeout(() => {
        liveRegion.innerHTML =
          '<span class="tooltip-bubble">' + message + '</span>';
      }, 100);
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (toggletip !== e.target) {
        liveRegion.innerHTML = '';
      }
    });

    // Remove toggletip on ESC
    toggletip.addEventListener('keydown', e => {
      if ((e.keyCode || e.which) === 27) liveRegion.innerHTML = '';
    });

    // Remove on blur
    toggletip.addEventListener('blur', () => {
      liveRegion.innerHTML = '';
    });
  }
);
// }
