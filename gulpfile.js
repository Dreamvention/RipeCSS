var path = require("path");
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var concat = require("gulp-concat");
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");
var autoprefixer = require('autoprefixer');
var postcssSass = require('@csstools/postcss-sass');
var browserSync = require('browser-sync');
var postcssPresetEnv = require('postcss-preset-env');
var rtlcss = require('rtlcss');

var baseDir = path.join(__dirname, '/');

if (typeof process.env.HOST === "undefined") {
    process.env.HOST = 'localhost/ripecss/docs';
}

gulp.task('css', function() {
    var processors = [
        postcssSass(), autoprefixer(), postcssPresetEnv({ stage: 2 })
    ];

    return gulp.src(path.join(baseDir, 'src/css/ripe.scss'))
        .pipe(sourcemaps.init())
        .pipe(concat('ripe.css'))
        .pipe(postcss(processors)).on('error', (e) => console.log(e.message))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(baseDir, 'dist/css/')))
        .pipe(gulp.dest(path.join(baseDir, 'docs/css/')))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('rtl', function() {
    var processors = [
        postcssSass(), autoprefixer(), postcssPresetEnv({ stage: 2 }), rtlcss()
    ];
    return gulp.src(path.join(baseDir, 'src/css/ripe.scss'))
        .pipe(sourcemaps.init())
        .pipe(postcss(processors)).on('error', (e) => console.log(e.message))
        .pipe(rename({ suffix: '.rtl', extname: '.css' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(baseDir, 'dist/css/')))

    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('watch:css', function() {
    var cssFiles = [];
    cssFiles.push(path.join(baseDir, '/src/css/scss/', '*.*css'));
    cssFiles.push(path.join(baseDir, '/src/css/scss/', '*/*.*css'));
    gulp.watch([cssFiles], ['css', 'rtl']);
});

gulp.task("serve", function() {
    if (typeof process.env.HOST !== "undefined") {
        browserSync({
            proxy: process.env.HOST
        });
    }
});

gulp.task('default', ["serve"], function() {
    gulp.start(["watch:css"]);
});