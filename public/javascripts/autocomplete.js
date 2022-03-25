import debounce from './debounce.js';

class Autocomplete {
  wrapInput() {
    let wrapper = document.createElement('div');
    wrapper.classList.add('autocomplete-wrapper');
    this.input.parentNode.appendChild(wrapper);
    wrapper.appendChild(this.input);
  }

  createUI() {
    let listUI = document.createElement('ul');
    listUI.classList.add('autocomplete-ui');
    this.input.parentNode.appendChild(listUI);
    this.listUI = listUI;

    let overlay = document.createElement('div');
    overlay.classList.add('autocomplete-overlay');
    overlay.style.width = `${this.input.clientWidth}px`;

    this.input.parentNode.appendChild(overlay);
    this.overlay = overlay;
  }

  // bind event listener to our UI elements after the UI is built
  bindEvents() {
    // call executes the function - bind returns a new function (uncalled)
    // bind is necessary, as `this` loses context as it's passed as an argument to another function
    // Otherwise `this` defaults to event.currentTarget
    // Remove the binding of this.valueChanged since this.valueChanged is already assigned to a function that has its context set accordingly.
    this.input.addEventListener('input', this.valueChanged);
    this.input.addEventListener('keydown', this.handleKeydown.bind(this));
    this.listUI.addEventListener('mousedown', this.fillInput.bind(this));
  }

  draw() {
    // Remove all existing search autocompletes
    while (this.listUI.lastChild) {
      this.listUI.removeChild(this.listUI.lastChild);
    }

    if (!this.visible) {
      this.bestMatchIndex = 0;
      this.overlay.textContent = '';
      return;
    }

    // Populate the autosuggestion for the overlay
    if (this.bestMatchIndex !== null && this.matches.length !== 0) {
      let selected = this.matches[this.bestMatchIndex];
      // This ensures that there is no visual overlap between the suggestion and what is typed by the user due to casing
      this.overlay.textContent = this.generateOverlayContent(this.input.value, selected);
    } else {
      this.overlay.textContent = '';
    }

    // Repopulate the list with countries that match the search string
    this.matches.forEach((match, index) => {
      let li = document.createElement('li');
      li.classList.add('autocomplete-ui-choice');

      if (index === this.selectedIndex) {
        li.classList.add('selected');
        this.input.value = match.name;
      }

      li.textContent = match.name;
      this.listUI.appendChild(li);
    });
  }

  // Only the remaining letters of the suggested search result are concatenated with the input value
  generateOverlayContent(value, match) {
    let end = match.name.substr(value.length);
    return value + end;
  }

  // Importantly, this does not reset the value of the input box
  reset() {
    this.visible = false;
    this.matches = [];
    this.bestMatchIndex = null;
    this.selectedIndex = null;
    this.previousValue = null;
    // matches is empty, so no population of elements occurs in the UI
    this.draw();
  }

  fetchMatches(query, callback) {
    let request = new XMLHttpRequest();

    request.addEventListener('load', () => {
      callback(request.response);
    });

    request.open('GET', `${this.url}${encodeURIComponent(query)}`);
    request.responseType = 'json';
    // send() is asynchronous
    request.send();
  }

  valueChanged() {
    let value = this.input.value;
    this.previousValue = value;

    if (value.length > 0) {
      this.fetchMatches(value, matches => {
        this.visible = true;
        this.matches = matches;
        this.selectedIndex = null;
        // Suggest the first result for the overlay
        this.bestMatchIndex = 0;
        this.draw();
      });
    } else {
      this.reset();
    }
  }

  handleKeydown(event) {
    // event.key may not be supported by Microsoft browsers, or Safari
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (this.selectedIndex === null || this.selectedIndex === this.matches.length - 1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex += 1;
        }
        this.bestMatchIndex = null;
        this.draw();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.selectedIndex === null || this.selectedIndex === 0) {
          this.selectedIndex = this.matches.length - 1;
        } else {
          this.selectedIndex -= 1;
        }
        this.bestMatchIndex = null;
        this.draw();
        break;
      case 'Tab':
        if (this.bestMatchIndex !== null && this.matches.length !== 0) {
          this.input.value = this.matches[this.bestMatchIndex].name;
          event.preventDefault();
        }
        this.reset();
        break;
      case 'Enter':
        this.reset();
        break;
      case 'Escape': // escape
        this.input.value = this.previousValue;
        this.reset();
        break;
    }
  }

  fillInput(event) {
    this.input.value = event.target.textContent;
    this.reset();
  }

  constructor(url, text) {
    this.input = document.querySelector(text);
    this.url = url;

    // This is the list of options for autocompletion
    this.listUI = null;
    // This is an autocompleted term that appears in the input box
    this.overlay = null;
    // decides whether the overlay has any text in it
    this.visible = false;
    // holds the array of countries that we receive from the server
    this.matches = [];

    this.wrapInput();
    this.createUI();
    // Don't make XHR requests until there is a delay without typing
    this.valueChanged = debounce(this.valueChanged.bind(this), 300);
    this.bindEvents();
    this.reset();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  new Autocomplete('/countries?matching=', 'input');
});
