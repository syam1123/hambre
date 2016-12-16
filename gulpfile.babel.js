import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
var ghPages = require('gulp-gh-pages');
import {
  stream as wiredep
}
from 'wiredep';
var historyApiFallback = require('connect-history-api-fallback')
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// since we are using scss, we need to wrap them in a css file before rendering

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 1 version']
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({
      stream: true
    }));
});

// to test the quality of js file just run gulp lint  (probably have lot of warnings like semicolun, string must have " etc.)

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({
        stream: true,
        once: true
      }))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}


gulp.task('lint', lint('app/scripts/**/*.js'));

gulp.task('html', ['styles'], () => {
  const assets = $.useref.assets({
    searchPath: ['.tmp', 'app', '.']
  });

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({
      compatibility: '*'
    })))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({
      conditionals: true,
      loose: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
        optimizationLevel: 4,
        progressive: true,
        interlaced: true,
        multipass: true,
        svgoPlugins: [{
          cleanupIDs: false
        }]
      }))
      .on('error', function (err) {
        console.log(err);
        this.end();
      })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')({
      filter: '**/*.{eot,svg,ttf,woff,woff2}'
    }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

// revision all the files otherthan favicon and index.html (to avoid cashing problem)

gulp.task('rev', () => {
  var revAll = require('gulp-rev-all'),
      rev = new revAll({dontRenameFile: [/^\/favicon.ico$/g, /^\/index.html/g]}),
      revision = require('gulp-rev');
  return gulp.src('dist/**')
    .pipe(rev.revision())
    .pipe(gulp.dest('www'))
    .pipe(revision.manifest())
    .pipe(gulp.dest('manifest'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    'app/views/*.html',
    '!app/*.html'
  ], {
    dot: true,
    base: 'app/'
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist', 'www']));

gulp.task('serve', ['styles', 'setenv:local'], () => {
  browserSync({
    notify: false,
    port: 9001,
    server: {
      baseDir: ['.tmp', 'app'],
      middleware: [historyApiFallback()],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/views/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9001,
    server: {
      baseDir: ['dist'],
      middleware: [historyApiFallback()]
    }
  });
});

gulp.task('serve:www', () => {
  browserSync({
    notify: false,
    port: 9001,
    server: {
      baseDir: ['www'],
      middleware: [historyApiFallback()]
    }
  });
});

gulp.task('zip', () => {
  return gulp.src('www/**/**')
    .pipe($.zip('dist.zip'))
    .pipe(gulp.dest('.'));
});


gulp.task('setenv:local', () => {
  return gulp.src('hambreEnv.svc.json')
    .pipe($.ngConfig('hambreApp', {
      environment: 'local',
      createModule: false,
      wrap: true
    }))
    .pipe($.useref())
    .pipe(gulp.dest('app/scripts/services'))
});

gulp.task('setenv:dev', () => {
  return gulp.src('hambreEnv.svc.json')
    .pipe($.ngConfig('hambreApp', {
      environment: 'dev',
      createModule: false,
      wrap: true
    }))
    .pipe($.useref())
    .pipe(gulp.dest('app/scripts/services'))
});

gulp.task('setenv:prod', () => {
  return gulp.src('hambreEnv.svc.json')
    .pipe($.ngConfig('hambreApp', {
      environment: 'prod',
      createModule: false,
      wrap: true
    }))
    .pipe($.useref())
    .pipe(gulp.dest('app/scripts/services'))
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['setenv:prod', 'html', 'images', 'fonts', 'extras', 'rev'], () => {
  return gulp.src('dist/**/*').pipe($.size({
    title: 'build',
    gzip: true
  }));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});

// deployee minified file to staging

gulp.task('deploy:dev', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

// to deploy revisioned file to production

gulp.task('deploy:prod', function(){
  return gulp.src('./www/**/*')
    .pipe(ghPages());
})