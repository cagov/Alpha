'use strict';
// this is a file forked from https://github.com/geolonia/mbgl-gesture-handling/blob/master/mbgl-gesture-handling.js because legacy edge was freaking about ...optiosn on line 16
class GestureHandling {
  constructor (options) {
    this.fullscreen = false;
    this.id = `mbgl-gesture-handling-help-container-${GestureHandling.count}`;
    GestureHandling.count++;
    this.timer = null;

    this.settings = options;

    this.helpElement = document.querySelector(`#${this.id}`);

    if (this.helpElement === null) {
      this.helpElement = document.createElement('div');
      this.helpElement.id = this.id;
      this.helpElement.style.backgroundColor = this.settings.backgroundColor;
      this.helpElement.style.position = 'absolute';
      this.helpElement.style.display = 'none';
      this.helpElement.style.zIndex = 9999;
      this.helpElement.style.justifyContent = 'center';
      this.helpElement.style.alignItems = 'center';

      const textBox = document.createElement('div');
      textBox.style.textAlign = 'center';
      textBox.style.color = this.settings.textColor;
      textBox.innerText = '';

      this.helpElement.appendChild(textBox);
      document.body.appendChild(this.helpElement);
    }
  }

  showHelp (map, message) {
    const rect = map.getContainer().getBoundingClientRect();
    this.helpElement.style.top = `${rect.top + window.scrollY}px`;
    this.helpElement.style.left = `${rect.left + window.scrollX}px`;
    this.helpElement.style.width = `${rect.width}px`;
    this.helpElement.style.height = `${rect.height}px`;
    this.helpElement.style.display = 'flex';

    this.helpElement.querySelector('div').innerText = message;
  }

  hideHelp () {
    this.helpElement.style.display = 'none';
  }

  addTo (map) {
    map.scrollZoom.disable();

    this.helpElement.addEventListener('wheel', (event) => {
      if (event.altKey || this.fullscreen === true) {
        event.preventDefault();
        this.hideHelp();
      } else {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.hideHelp();
        }, this.settings.timeout);
      }
    });

    map.getContainer().addEventListener('wheel', (event) => {
      if (event.altKey || this.fullscreen === true) {
        event.preventDefault();
        if (!map.scrollZoom.isEnabled()) {
          map.scrollZoom.enable();
        }
      } else {
        map.scrollZoom.disable();
        this.showHelp(map, this.settings.textMessage);
        this.timer = setTimeout(() => {
          this.hideHelp();
        }, this.settings.timeout);
      }
    });

    this.helpElement.addEventListener('touchstart', (event) => {
      if (event.touches && (event.touches.length >= 2 || this.fullscreen === true)) {
        clearTimeout(this.timer);
        this.hideHelp();
        map.dragPan.enable();
        event.preventDefault();
      }
    });

    map.on('movestart', (event) => {
      if (event.originalEvent && 'touches' in event.originalEvent &&
              event.originalEvent.touches.length < 2 && this.fullscreen === false) {
        this.showHelp(map, this.settings.textMessageMobile);
        map.dragPan.disable();
        this.timer = setTimeout(() => {
          map.dragPan.enable();
          this.hideHelp();
        }, this.settings.timeout);
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        this.fullscreen = true;
      } else {
        this.fullscreen = false;
      }
    });
  }
}

GestureHandling.count = 0; // static

export default GestureHandling;
