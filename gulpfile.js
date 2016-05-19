'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    mainBowerFiles = require('main-bower-files'),
    watch = require('gulp-watch'),
    clean = require('gulp-clean');

gulp.task('default', function() {
    gulp.start('sass').start('bower-files');
});
/**
 * Clean all the automatic installed files
 */
gulp.task('clean', function() {
    gulp.src(['./site/+(lib|css)/*.+(js|css)']).pipe(clean());
});

gulp.task('sass', function() {
    gulp.src('./sass/*.scss').pipe(sass({
        errLogToConsole: true
    })).pipe(gulp.dest('./site/css/'));
});

gulp.task('watch', function() {
    watch(['./sass/*.scss'], function() {
        gulp.start('sass');
    });
});
/**
 * Add the Angular and related packages
 **/
gulp.task('bower-files', function() {
    gulp.src(mainBowerFiles({
        overrides: {
            'angular': {
                main: 'angular.min.js'
            },
            'angular-route': {
                main: 'angular-route.min.js'
            },
            'angular-animate': {
                main: 'angular-animate.min.js'
            },
            'angular-aria': {
                main: 'angular-aria.min.js'
            },
            'angular-sanitize': {
                main: 'angular-sanitize.min.js'
            },
            'angular-messages': {
                main: 'angular-messages.min.js'
            },
            'angular-material': {
                main: [
                    'angular-material.min.js',
                    'angular-material.min.css'
                ]
            }
        }
    })).pipe(gulp.dest('./site/libs'));
});
