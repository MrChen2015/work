'use strict';
// 载入外挂
var gulp = require('gulp'),
    config = require('./config.json'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),//添加浏览器标识的插件
    minifycss = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'), // 本地服务器
    coffee = require('gulp-coffee'),
    gulpSequence = require('gulp-sequence'),//控制执行顺序：[]内任务同时执行，()顺序执行
    zip  = require('gulp-zip'),
    plumber = require('gulp-plumber'),
    sftp = require('gulp-sftp'),
    changed = require('gulp-changed'),
    jade = require('gulp-jade');       

gulp.task('jade', function() {
    return gulp.src('src/jade/*.jade')
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'html task complete' }));
});

gulp.task('sass', function () {
    return sass('src/sass/*.scss')
        .on('error', sass.logError)
        .pipe(gulp.dest('src/css'));
});

gulp.task('css',['sass'], function() {
    return gulp.src('src/css/*.css')
        .pipe(changed('/dist/css'))
        .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
        }))
        .pipe(gulp.dest('src/css'))
        .pipe(concat('hello.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'css task complete' }));
});

gulp.task('coffee', function () {
    return gulp.src('src/coffee/*.coffee')
        .pipe(coffee())
        .pipe(gulp.dest('src/js'));
});

// 脚本
gulp.task('js',/*['coffee'],*/ function() {
    return gulp.src('src/js/*.js')
        .pipe(changed('/dist/js'))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'js task complete' }));
});

// 图片
gulp.task('img', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'img task complete' }));
});

// 清理
gulp.task('clean', function() {
    return gulp.src(['dist/css', 'dist/js', 'dist/images'], {read: false})
        .pipe(clean())
        .pipe(notify({ message: 'clean task complete' }));
});

// 注册任务
gulp.task('webserver', function() {
    gulp.src( './dist' ) // 服务器目录（./代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            livereload: true, // 启用LiveReload
            open: true // 服务器启动时自动打开网页
        }));
});

// 看守
gulp.task('watch', function() {

    // 看守所有.scss档
    gulp.watch('src/sass/*.scss', ['css']);

    // 看守所有.jade档
    gulp.watch('src/jade/*.jade', ['jade']);

    // 看守所有.js档
    gulp.watch('src/js/*.js', ['js']);

    // 看守所有图片档
    gulp.watch('src/images/**/*', ['img']);

    // // 建立即时重整伺服器
    // var server = livereload();
    //
    // // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
    // gulp.watch(['dist/**']).on('change', function(file) {
    //     livereload.changed(file.path);
    // });

});


gulp.task('work',gulpSequence(['css', 'js', 'img','jade'],'webserver','watch'));

//打包主体dist 文件夹并按照时间重命名
gulp.task('zip', function(){
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }

    var d=new Date();
    var year=d.getFullYear();
    var month=checkTime(d.getMonth() + 1);
    var day=checkTime(d.getDate());
    var hour=checkTime(d.getHours());
    var minute=checkTime(d.getMinutes());

    return gulp.src('./dist/**')
        .pipe(zip( config.project+'-'+year+month+day +hour+minute+'.zip'))
        .pipe(gulp.dest('./zip'));
});

//上传到远程服务器任务
// gulp.task('upload', function () {
//     return gulp.src('./dist/**')
//         .pipe(sftp({
//             host: config.sftp.host,
//             user: config.sftp.user,
//             port: config.sftp.port,
//             key: config.sftp.key,
//             remotePath: config.sftp.remotePath
//         }));
// });