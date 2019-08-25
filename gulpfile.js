'use strict';
//3.9.1
// var gulp = require('gulp');
// var sass = require('gulp-sass');
// var uglifycss = require('gulp-uglifycss');
//
// sass.compiler = require('node-sass');
//
// gulp.task('sass', function () {
//     return gulp.src('./sass/*.sass')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(gulp.dest('./css'));
// });
//
// gulp.task('css', function () {
//     gulp.src('./css/*.css')
//         .pipe(uglifycss({
//             "maxLineLen": 80,
//             "uglyComments": true
//         }))
//         .pipe(gulp.dest('./dist/'));
// });
//
// gulp.task('run', ['sass', 'css']);
//
// gulp.task('watch', function(){
//     gulp.watch('./sass/*.sass', ['sass']);
//     gulp.watch('./css/*.css', ['css']);
// });
//
// gulp.task('default', ['run', 'watch']);

var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var uglify = require('gulp-uglifycss');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var browserSync = require('browser-sync').create();

var paths = {
    styles: {
        src: './sass/*.sass',
        dest: 'assets/css/',
    },
    scripts: {
        src: './js/*.js',
        dest: 'assets/js/'
    }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`,
    // for example if you are using del 2.0 or above, return its promise
    return del([ 'assets/css/' ]);
}


/*
 * Define our tasks using plain functions
 */
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass())
        .pipe(cleanCSS())
        // pass in options to the stream
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        // .pipe(gulp.dest(paths.styles.dest));
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
    browserSync.init({
        server: {
           baseDir: './'
        }
    });
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    // gulp.watch('./*.html').on('change', browserSync.reload);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;