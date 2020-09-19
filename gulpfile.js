'use strict';

var gulp = require('gulp');

var express = require('express');
var app = express();

gulp.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  test:'test'
};

require('require-dir')('./gulp');

gulp.task('build', ['clean'],function () {
    gulp.start('buildapp');
});

gulp.task('deploy', ['build'],function () {
    
	app.use(express.static(__dirname));
	app.get('/', function(req, res) {
	    res.redirect('../dist/index.html');
	});

	var port = process.env.PORT || 3000
	app.listen(port,function(){
	    console.log('Server started and listening on %s port', port);
	});

});
