var fs = require('fs'),
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    copy = require('gulp-copy'),
    rename = require("gulp-rename"),
    csscomb = require('gulp-csscomb'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('clean-js', function() {
    return gulp.src('./dist/js/*', { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('clean-css', function() {
    return gulp.src('./dist/css', { read: false })
        .pipe(clean({ force: true }));
});

//合并js
gulp.task('build-basejs', function() {
    return gulp.src([
            './src/js/intro.js',
            './src/js/device.js',
            './src/js/util.js',
            './src/js/detect.js',
            './src/js/zepto-adapter.js',
            './src/js/fastclick.js',
            './src/js/template7.js',
            './src/js/page.js',
            './src/js/tabs.js',
            './src/js/bar-tab.js',
            './src/js/modal.js',
            './src/js/calendar.js',
            './src/js/picker.js',
            './src/js/datetime-picker.js',
            './src/js/pull-to-refresh-js-scroll.js',
            './src/js/pull-to-refresh.js',
            './src/js/infinite-scroll.js',
            './src/js/notification.js',
            './src/js/index.js',
            './src/js/searchbar.js',
            './src/js/panels.js',
            './src/js/router.js',
            './src/js/init.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('ui.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'))
        .on('finish', function() {
            gulp.start('min-uijs');
        });
});

gulp.task('min-uijs', function() {
    return gulp.src([
        './dist/js/ui.js'
    ])
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('build-swiperjs', function() {
    return gulp.src([
            './src/js/swiper.js',
            './src/js/swiper-init.js',
            './src/js/photo-browser.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('ui.swiper.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('build-cityPickerjs', function() {
    return gulp.src([
            './src/js/city-data.js',
            './src/js/city-picker.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('ui.cityPicker.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('build-swipeoutjs', function() {
    return gulp.src([
            './src/js/swipeout.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('ui.swipeout.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('build-i18njs', function() {
    return gulp.src([
            './src/js/i18n/cn.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('ui.i18n.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy-libs', function() {
    return gulp.src('./src/js/libs/*')
        .pipe(copy('./dist/js/', { prefix: 2 }));
});

gulp.task('build-js', ['clean-js'], function() {
    gulp.start('copy-libs');
    gulp.start(['build-basejs', 'build-swiperjs', 'build-cityPickerjs', 'build-swipeoutjs', 'build-i18njs']);
});

var combConfig = JSON.parse(fs.readFileSync('./src/less/.csscomb.json','utf-8'));

//合并less
gulp.task('build-less', function() {
    return gulp.src('./src/css/global.css')
        .pipe(rename('global.less'))
        .pipe(gulp.dest('./src/less'))
        .on('finish', function() {
            return gulp.src([
                    './src/less/light7.less',
                    './src/less/light7-swiper.less',
                    './src/less/global.less'
                ])
                .pipe(concat('ui.less'))
                .pipe(less('ui.css'))
                .pipe(autoprefixer({
                    browsers: [
                        'Android >= 4',
                        'Chrome >= 20',
                        'Firefox >= 24', // Firefox 24 is the latest ESR
                        'Explorer >= 9',
                        'iOS >= 6',
                        'Opera >= 12',
                        'Safari >= 6'
                    ]
                }))
                .pipe(csscomb(combConfig))
                .pipe(gulp.dest('./dist/css'))
                .pipe(rename({ suffix: '.min' }))
                .pipe(csso())
                .pipe(gulp.dest('./dist/css'));
        });

});

gulp.task('build-css', ['clean-css', 'build-less']);

gulp.task('build-all', ['build-js', 'build-css']);

//动态合成

gulp.task('watch', function() {
    var watchjs = gulp.watch('./src/js/*.js', ['build-js', 'build-extendjs']);
    watchjs.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running task build js...');
    });
    var watchless = gulp.watch('./src/less/*.less', ['build-less']);
    watchless.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running task build less...');
    });
});
