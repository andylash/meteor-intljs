"use strict";

var packageName = "andylash:intljs";

Npm.depends({
 "intl": "0.1.4"
});

var packageDir = 'meteor-intljs';
Package.describe({
  summary: "Meteor wrapper around Intl.js polyfill with some sugar around loading locale files",
  version: "0.1.0",
  name: packageName,
  git: "https://github.com/andylash/" + packageDir + ".git"
});

//stole this from http://stackoverflow.com/questions/20793505/meteor-package-api-add-files-add-entire-folder
function getFilesFromFolder(packageName, folder) {
  // local imports
  var _ = Npm.require("underscore");
  var fs = Npm.require("fs");
  var path = Npm.require("path");
  // helper function, walks recursively inside nested folders and return absolute filenames
  function walk(folder) {
    var filenames = [];
    // get relative filenames from folder
    var folderContent = fs.readdirSync(folder);
    // iterate over the folder content to handle nested folders
    _.each(folderContent, function(filename) {
      // build absolute filename
      var absoluteFilename = folder + path.sep + filename;
      // get file stats
      var stat = fs.statSync(absoluteFilename);
      if (stat.isDirectory()) {
        // directory case => add filenames fetched from recursive call
        filenames = filenames.concat(walk(absoluteFilename));
      } else {
        // file case => simply add it
        filenames.push(absoluteFilename);
      }
    });
    return filenames;
  }

  // save current working directory (something like "/home/user/projects/my-project")
  var cwd = process.cwd();

  var dir = 'packages/' + packageDir;
  // console.log(packageName + ": Loading locale files from " + cwd + "/" + dir);

  // chdir to our package directory
  process.chdir(dir);
  // launch initial walk
  var result = walk(folder);
  // restore previous cwd
  process.chdir(cwd);
  return result;
}

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.4');
  api.use('http', 'client');

  //on the server load the complete that has all locales
  api.addFiles('src/npmIntl.js', 'server');

  //on the client load the minimum, locales load on demand
  api.addFiles('Intl.js/dist/Intl.js', 'client');

  //here we're exporting the variables
  api.addFiles('src/export.js', 'client');

  //here's the on demand loading part
  api.addFiles('src/loader.js', 'client');

  var localeFiles = getFilesFromFolder(packageName, "Intl.js/locale-data/json");

  // console.log("Adding files: " + localeFiles);
  api.addFiles(localeFiles, ['client'], {
    isAsset: true
  });

  //let's have at least something available on load
  api.addFiles('Intl.js/locale-data/jsonp/en-US.js', 'client');

  api.export(['Intl', 'IntlPolyfill']);
});
