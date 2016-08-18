var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat'),
    iife = require("gulp-iife"),
    htmlreplace = require('gulp-html-replace');


gulp.task('default', function() {
    gulp.src('./js/*.js')
        .pipe(concat('trellis_crosstab.min.js'))
        .pipe(iife())
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
   
    gulp.src('./rsc/*.json')
        .pipe(gulp.dest('./public/rsc/'));
   
    gulp.src('./style/style.css')
        .pipe(gulp.dest('./public/style/'));   
   
    gulp.src('index.html')
        .pipe(htmlreplace({
            'js': 'js/trellis_crosstab.min.js'
        }))
        .pipe(gulp.dest('./public/'));   
});

