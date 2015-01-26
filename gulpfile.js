var bowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    stylus = require('gulp-stylus'),
    gulp = require('gulp'),
    series = require('stream-series'),
    connect = require('gulp-connect-multi')();

//cores
var azul = '\x1b[1m\x1b[36m'
  , verde = '\x1b[32m'
  , branco = "\x1b[37m"
  , bgPreto =  "\x1b[40m"
  , vermelho = "\x1b[31m"
  , brilho = "\x1b[1m"
  , bgVerde="\x1b[42m"
  , nocolor = "\x1b[0m";


gulp.task('bower', function(){
  return gulp.src(bowerFiles())
    .pipe(gulp.dest('./build/lib/vendor'))
    .pipe(connect.reload());
})
gulp.task('lib', function(){
  return gulp.src('./src/lib/**/*.*', { vendor: './src/'})
    .pipe(gulp.dest('./build'))
})
gulp.task('stylus',function(){
  gulp.src('./src/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./build/css'))
    .pipe(connect.reload());
});
gulp.task('js',function(){
  gulp.src('./src/js/**.js')
    .pipe(gulp.dest('./build/js'))
    .pipe(connect.reload());
});
gulp.task('serve', connect.server({
  root: ['build'],
  port: 1337,
  livereload: true,
  open: {
    browser: 'chrome' //OS X browser: 'Google Chrome'
  }
}));

gulp.task('watch', function () {
  gulp.watch(['./src/**.html'], ['inject']);
  gulp.watch(['./src/js/**.js'], ['js']);
  gulp.watch(['./src/lib/**/*.*'], ['lib']);
  gulp.watch([bowerFiles()], ['bower','js']);
  gulp.watch(['./src/stylus/**.styl'], ['stylus']);
});

gulp.task('inject', function(){
  var bowerz = gulp.src('./build/lib/vendor/**');
  var lib = gulp.src('./build/lib/**/*.*');
  var customCSS = gulp.src('./build/css/**.css');
  var customJs = gulp.src('./build/js/**.js');
  var sources = series(customCSS, customJs)
  gulp.src('./src/**.html')
    .pipe(inject(bowerz, { relative: true, ignorePath: '../build', starttag: '<!-- bower:{{ext}} -->'  }))
    .pipe(inject(lib, { relative: true, ignorePath: '../build', starttag: '<!-- libs:{{ext}} -->'  }))
    .pipe(inject(sources, { relative: true, ignorePath: '../build/' }))
    .pipe(gulp.dest('./build'))
    .pipe(connect.reload());
})

gulp.task('firstInject',['bower', 'lib', 'stylus', 'js', 'inject'], function(){
  console.log(bgVerde+vermelho+brilho+'Wellcome home, professor. Have a nice work.'+nocolor);
  console.log(bgVerde+vermelho+brilho+'Seja bem vindo. Bom trabalho.'+nocolor);
})
gulp.task('default', ['firstInject', 'serve', 'watch']);