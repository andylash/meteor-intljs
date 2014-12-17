/* global IntlPolyfill, Intl */
"use strict";

var packageName = "andylash:intljs";


var loadedLocales = { 'en-US': true };

/**
 * Dynamically load locale data from the server
 * @param  {String} locale name of locale to load
 * @param {Function} callback call this function when the load is complete with standard (error) params
 */
IntlPolyfill.__loadLocaleData = function(locale, callback) {
  //Safai doesn't capitalize the country part.  UGH, so normalizing that here
  var parts = locale.match(/(.+-)([a-zA-Z]+)$/);
  if (parts && parts.length > 2) {
    locale = parts[1] + parts[2].toUpperCase();
  }

  if (loadedLocales[locale]) {
    //already loaded, exit happily
    callback && callback(undefined);
    return;
  }
  var fixedPackageName = packageName.replace(/:/, '_');

  var url = Meteor.absoluteUrl();
  var localeUrl = url + 'packages/' + fixedPackageName + '/Intl.js/locale-data/json/' + locale + '.json';
  console.log(packageName + ": loading locale from: " + localeUrl);
  HTTP.get(localeUrl, function(error, results) {
    if (error) {
      console.error(packageName + ": failed to load locale: " + locale, error);
      callback && callback(error);
    } else {
      var data = EJSON.parse(results.content);
      console.log(packageName + ": succeeeded in loading locale: " + locale);
      IntlPolyfill.__addLocaleData(data);
      loadedLocales[locale] = true;
      callback && callback(undefined);
    }

  });
};

if (!Intl.__loadLocaleData) {
  //if the method does not appear, that means the polyfill is NOT being used, let's create a dummy function
  Intl.__loadLocaleData = function() {};
}
