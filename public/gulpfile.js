var gulp = require('gulp');

// app shell
gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = './';

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [
        rootDir + '/css/*.css',
        rootDir + '/img/*.{png,jpg,gif}',
        rootDir + '/js/**/*.js',
        rootDir + '/lib/**/*.{js,css}',
        rootDir + '/templates/*.html',
        rootDir + '/index.html',
        rootDir + '/manifest.json'
    ],
    stripPrefix: rootDir
  }, callback);
});
