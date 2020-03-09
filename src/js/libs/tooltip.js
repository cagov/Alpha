// Tooltip support
Array.prototype.forEach.call(document.querySelectorAll('.tooltip-button'), function (toggletip) {
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
  toggletip.addEventListener('click', function () {
    liveRegion.innerHTML = '';

    window.setTimeout(function () {
      liveRegion.innerHTML = '<span class="tooltip-bubble">' + message + '</span>';
    }, 100);
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (toggletip !== e.target) {
      liveRegion.innerHTML = '';
    }
  });

  // Remove toggletip on ESC
  toggletip.addEventListener('keydown', function (e) {
    if ((e.keyCode || e.which) === 27) { liveRegion.innerHTML = ''; }
  });

  // Remove on blur
  toggletip.addEventListener('blur', function (e) {
    liveRegion.innerHTML = '';
  });
});
