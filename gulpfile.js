var bowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    stylus = require('gulp-stylus'),
    gulp = require('gulp'),
    series = require('stream-series'),
    connect = require('gulp-connect-multi')(),
    angularFilesort = require('gulp-angular-filesort'),
    wiredep = require('wiredep');
//cores
var azul = '\x1b[1m\x1b[36m'
  , verde = '\x1b[32m'
  , branco = "\x1b[37m"
  , bgPreto =  "\x1b[40m"
  , vermelho = "\x1b[31m"
  , brilho = "\x1b[1m"
  , bgVerde="\x1b[42m"
  , nocolor = "\x1b[0m";


// gulp.task('bower', function(){
//   return gulp.src(bowerFiles())
//     .pipe(gulp.dest('./build/lib/vendor'))
//     .pipe(connect.reload());
// })

gulp.task('bowerjs', function () {
 return gulp.src(wiredep().js)
    .pipe(gulp.dest('build/vendor'));
});

gulp.task('bowercss', function () {
 return gulp.src(wiredep().css)
    .pipe(gulp.dest('build/vendor'));
});

gulp.task('index', ['bowerjs', 'lib', 'stylus', 'js'], function() {
  return gulp.src(['src/**/*.html', '!src/partials/**'])
    .pipe(wiredep.stream({
      fileTypes: {
        html: {
          replace: {
            js: function(filePath) {
              return '<script src="' + 'vendor/' + filePath.split('/').pop() + '"></script>';
            }
          }
        }
      }
    }))
    .pipe(inject(
      gulp.src(['build/src/**/**.js'], { read: false }), {
        addRootSlash: false,
        transform: function(filePath, file, i, length) {
          return '<script src="' + filePath.replace('build/', '') + '"></script>';
        }
      }))

    .pipe(inject(
      gulp.src(['build/**/**/**.css'], { read: false }), {
        addRootSlash: false,
        transform: function(filePath, file, i, length) {
          return '<link rel="stylesheet" href="' + filePath.replace('build/', '') + '"/>';
        }
      }))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload())
});

gulp.task('partials', function(){
  gulp.src(['./src/partials/**/**.html'])
    .pipe(gulp.dest('./build/partials'))
    .pipe(connect.reload())
});

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
  gulp.watch(['src/**/*.html', '!src/partials/**'], ['index']);
  gulp.watch(['src/partials/**/**.html'], ['partials']);
  gulp.watch(['src/js/**/**.js'], ['js']);
  gulp.watch(['src/lib/**/**'], ['lib']);
  gulp.watch(['bower_components/**/**'], ['bowerjs']);
  gulp.watch(['build/**/**/**'], ['index'])
  gulp.watch(['src/stylus/**.styl'], ['stylus', 'index']);
});

gulp.task('firstInject',['bower', 'lib', 'stylus', 'js', 'index', 'partials'], function(){
  console.log(bgVerde+vermelho+brilho+'---------------------------------------------------'+nocolor);
  console.log(bgVerde+vermelho+brilho+'----Wellcome home, professor. Have a nice work.----'+nocolor);
  console.log(bgVerde+vermelho+brilho+'If this is your first time, just re-save your HTML.'+nocolor);
  console.log(bgVerde+vermelho+brilho+'---------------------------------------------------'+nocolor);
  console.log(bgVerde+vermelho+brilho+'------------Seja bem vindo. Bom trabalho.----------'+nocolor);
  console.log(bgVerde+vermelho+brilho+'--Se esta for sua 1ª vez, salve novamente o HTML --'+nocolor);
  console.log(bgVerde+vermelho+brilho+'---------------------------------------------------'+nocolor);
})

gulp.task('default', ['firstInject', 'serve', 'watch']);