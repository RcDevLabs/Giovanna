var bowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    stylus = require('gulp-stylus'),
    gulp = require('gulp'),
    series = require('stream-series'),
    connect = require('gulp-connect-multi')(),
    angularFilesort = require('gulp-angular-filesort');
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
  return gulp.src('./src/lib/**/*.*', { vendor: './src'})
    .pipe(gulp.dest('./build/lib'))
    connect.reload();
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
  gulp.watch(['src/**/*.html', '!src/partials/**'], ['inject']);
  gulp.watch(['src/partials/**/**.html'], ['partials']);
  gulp.watch(['src/js/**.js'], ['js']);
  gulp.watch(['src/lib/**/**'], ['lib', 'inject']);
  gulp.watch([bowerFiles()], ['bower','js']);
  gulp.watch(['src/stylus/**.styl'], ['stylus']);
});

gulp.task('inject', function(){
  var bowerz = gulp.src('./build/lib/vendor/**').pipe(angularFilesort());
  var lib = gulp.src(['./build/lib/**/*.*', '!./build/lib/vendor/**']);
  var customCSS = gulp.src('./build/css/**.css');
  var customJs = gulp.src('./build/js/**.js');
  var sources = series(customCSS, customJs)
  gulp.src(['./src/**.html', '!./src/partials'])
    .pipe(inject(bowerz, { relative: true, ignorePath: '../build', starttag: '<!-- bower:{{ext}} -->'  }))
    .pipe(inject(lib, { relative: true, ignorePath: '../build', starttag: '<!-- libs:{{ext}} -->'  }))
    .pipe(inject(sources, { relative: true, ignorePath: '../build/' }))
    .pipe(gulp.dest('./build'))
    .pipe(connect.reload());
})
gulp.task('partials', function(){
  gulp.src(['./src/partials/**/**.html'])
    .pipe(gulp.dest('./build/partials'))
    .pipe(connect.reload())
});

gulp.task('firstInject',['bower', 'lib', 'stylus', 'js', 'inject', 'partials'], function(){
  console.log(bgVerde+vermelho+brilho+'---------------------------------------------------'+nocolor);
  console.log(bgVerde+vermelho+brilho+'----Wellcome home, professor. Have a nice work.----'+nocolor);
  console.log(bgVerde+vermelho+brilho+'If this is your first time, just re-save your HTML.'+nocolor);
  console.log(bgVerde+vermelho+brilho+'---------------------------------------------------'+nocolor);
  console.log(bgVerde+vermelho+brilho+'------------Seja bem vindo. Bom trabalho.----------'+nocolor);
  console.log(bgVerde+vermelho+brilho+'--Se esta for sua 1ª vez, salve novamente o HTML --'+nocolor);
  console.log(bgVerde+vermelho+brilho+'---------------------------------------------------'+nocolor);
})

gulp.task('default', ['firstInject', 'serve', 'watch']);