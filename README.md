# Meteor Intl.js Polyfill

Intl.NumberFormat and Intl.DateFormat are really sweet, but not supported in Safari or most mobile platforms.  This is a wrapper on top of Andy Earnshaw's Intl.js polyfill, but it also adds nice meteor support for loading locale files on demand.

More info on Intl.js: https://github.com/andyearnshaw/Intl.js

**Table of Contents**

- [Quick Start](#start)
- [History](#history)

## Start

To load locale files, simply pass the locale to IntlPolyfill.__loadLocaleData or Intl.__loadLocaleData.  This will download from your app server via HTTP GET and then load the download json files.

By default it loads 'en-US', but I suppose that should be more elegant and default to the browser.  It's safe to call this many times, it'll only load it once.

```javascript
//Hello Germany!
IntlPolyfill.__loadLocaleData('de-DE', function(error) {
  console.log("Locale load complete.");
  error && console.error("Got error: ", error);
});
````

## History
**Latest Version:** 0.1.0

**Version:** 0.1.0

- Initial Release

