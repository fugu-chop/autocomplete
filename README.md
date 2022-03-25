# `autocomplete`
A repo to house a toy project practicing making AJAX requests through `XMLHttpRequest`.

## Basic Overview
This is a basic toy project used to practice simulating a single page application through the `XMLHttpRequest` API.

On load in browser, a blank search box appears. Users are able to search for a country, which will trigger an `XHRHttpRequest` after a 300ms delay (using `setTimeout` to avoid making excess requests. The input box will display the best match based on text entered by the user, as well as a list of other possible countries that match the input string.

In respect of functionality, users can:
1. Press the `up` and `down` arrow keys to scroll through the listed options. Reaching the top or bottom of the list will simply cause the cursor to start at the bottom or the top of the list, respectively.
2. Press the `esc` key to stop autocomplete suggestions from showing.
3. Press the `enter` key to either autocomplete the input string, based on the selected autocomplete option, or if an autocomplete options is _not_ selected, stop the suggestions from being displayed.

## How to run
1. Clone the repo locally
2. Navigate to the folder.
3. Run `npm install` in your CLI
4. Run `npm run` in your CLI
5. Visit http://localhost:3000 in your web browser

## Design Choices
Not much to say here, other than a delay of 300ms was selected to avoid making a request every time a user types another letter into the input box. Code comments are present where appropriate.
