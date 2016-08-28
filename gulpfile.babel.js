import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import exorcist from 'exorcist';
import browserSync from 'browser-sync';
import watchify from 'watchify';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import ifElse from 'gulp-if-else';
import mocha from 'gulp-mocha';
import gutil from 'gulp-util';
import env from 'gulp-env';
import sass from 'gulp-sass';

watchify.args.debug = true;

const sync = browserSync.create();

// Input file.
watchify.args.debug = true;
var bundler = browserify('src/index.js', watchify.args);

// Babel transform
bundler.transform(babelify.configure({
  sourceMapRelative: 'src'
}));

// On updates recompile
bundler.on('update', bundle);

function bundle() {
  return bundler.bundle()
    .on('error', function(error){
      console.error( '\nError: ', error.message, '\n');
      this.emit('end');
    })
    .pipe(exorcist('public/assets/js/bundle.js.map'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(ifElse(process.env.NODE_ENV === 'production', uglify))
    .pipe(gulp.dest('public/assets/js'));
}

gulp.task('default', ['transpile']);

gulp.task('transpile', ['lint'], () => bundle());

gulp.task('lint', () => {
    return gulp.src(['src/**/*.js', 'gulpfile.babel.js'])
      .pipe(eslint())
      .pipe(eslint.format())
});

gulp.task('serve', ['transpile'], () => sync.init({
  server: 'public',
  port: process.env.PORT || 8000,
  host: process.env.IP || 'localhost'
}));

gulp.task('js-watch', ['transpile'], () => sync.reload());

gulp.task('watch', ['serve'], () => {
  gulp.watch('src/**/*', ['js-watch'])
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('public/index.html', sync.reload)
});

gulp.task('test:watch', () => {
  gulp.watch(['src/**', 'test/**'], ['mocha']);
});

gulp.task('mocha', function() {
    const envs = env.set({ NODE_ENV: 'production' }); // To stop React PropTypes Warnings
    return gulp.src(['test/*.js'], { read: false })
        .pipe(envs)
        .pipe(mocha({ reporter: 'nyan' }))
        .on('error', gutil.log);
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(sync.stream());

});
