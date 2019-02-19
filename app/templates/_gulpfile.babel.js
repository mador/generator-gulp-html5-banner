// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import { stream as wiredep } from 'wiredep';
import { _extend as extend } from 'util';
import lazypipe from 'lazypipe';

const fs = require('fs');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

let isAdformAd = false,
    isDcmAd = false;

gulp.task('styles', () => {<% if (includeSass) { %>
    return gulp.src('app/styles/*.{scss,css}')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        })
            .on('error', $.sass.logError)) <% } else { %>
        return gulp.src('app/styles/*.css')
        .pipe($.sourcemaps.init()) <% } %>
            .pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
                .pipe($.sourcemaps.write())
                .pipe(gulp.dest('.tmp/styles'))
                .pipe(reload({ stream: true }));
});

<% if (includeBabel) {
    -%>
        gulp.task('scripts', () => {
            return gulp.src(['app/scripts/**/*.js', '!app/scripts/timedani.js'])
                .pipe($.plumber())
                .pipe($.sourcemaps.init())
                .pipe($.babel())
                .pipe($.sourcemaps.write('.'))
                .pipe(gulp.dest('.tmp/scripts'))
                .pipe(reload({ stream: true }));
        });
<% } -%>

    function lint(files, options) {
        return () => {
            return gulp.src(files)
                .pipe(reload({ stream: true, once: true }))
                .pipe($.eslint(options))
                .pipe($.eslint.format())
                .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
        };
    }

const testLintOptions = {
    env: {
    <% if(testFramework === 'mocha') { -%>
    mocha: true
        <% } else if (testFramework === 'jasmine') {
            -%>
                jasmine: true
                    <% } -%>
    }
};

const jsBuild = lazypipe().pipe($.uglify).pipe($.rev),
    cssBuild = lazypipe().pipe($.cssnano).pipe($.rev);

gulp.task('lint', lint('app/scripts/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

<% if (includeBabel) {
    -%>
        gulp.task('html', ['styles', 'scripts'], () => {
<% } else { -%>
            gulp.task('html', ['styles'], () => {
<% } -%>
    return gulp.src('app/*.html')
        .pipe($.if(isDcmAd, $.stringReplace('core.js', 'core-dcm.js')))
        .pipe($.if(isDcmAd, $.stringReplace('<script type="text/javascript">\n            var clickTag = "";\n', '<script src="https://s0.2mdn.net/ads/studio/Enabler.js">')))
        .pipe($.if(isAdformAd, $.stringReplace('core.js', 'core-adform.js')))
        .pipe($.if(isAdformAd, $.stringReplace('var clickTag = "";', 'document.write(\'<script src="\'+ (window.API_URL || \'//s1.adform.net/banners/scripts/rmb/Adform.DHTML.js?bv=\'+(+new Date)) +\'"><\/scr\' + \'ipt>\');')))
        .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
        .pipe($.if('*.js', jsBuild()))
        .pipe($.if('*.css', cssBuild()))
        .pipe($.revReplace())
        .pipe($.if('*.html', $.htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
    return gulp.src(['app/images/**/*', '!app/images/**/*.orig.{jpg,png,svg}'])
        .pipe($.if($.if.isFile, $.cache($.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{ cleanupIDs: false }]
        }))
            .on('error', function (err) {
                console.log(err);
                this.end();
            }))
        )
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) { })
        .concat('app/fonts/**/*'))
        .pipe(gulp.dest('.tmp/fonts'))
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
    return gulp.src([
        'app/*.*',
        '!app/*.html'
    ],
        {
            dot: true
        }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

<% if (includeBabel) {
    -%>
        gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
<% } else { -%>
            gulp.task('serve', ['styles', 'fonts'], () => {
<% } -%>
                browserSync({
                    notify: false,
                    port: 9000,
                    server: {
                        baseDir: ['.tmp', 'app'],
                        routes: {
                            '/bower_components': 'bower_components'
                        }
                    }
                });

    gulp.watch([
        'app/*.html',
<% if (includeBabel) {
        -%>
            '.tmp/scripts/**/*.js',
<% } else {
        -%>
            'app/scripts/**/*.js',
<% } -%>
        'app/images/**/*',
        '.tmp/fonts/**/*'
]).on('change', reload);

    gulp.watch('app/styles/**/*.<%= includeSass ? 'scss' : 'css' %>', ['styles']);
<% if (includeBabel) {
        -%>
            gulp.watch('app/scripts/**/*.js', ['scripts']);
<% } -%>
        gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['dist']
        }
    });
});

<% if (includeBabel) {
    -%>
        gulp.task('serve:test', ['scripts'], () => {
<% } else { -%>
            gulp.task('serve:test', () => {
<% } -%>
                browserSync({
                    notify: false,
                    port: 9000,
                    ui: false,
                    server: {
                        baseDir: 'test',
                        routes: {
                <% if(includeBabel) {
                            -%>
                                '/scripts': '.tmp/scripts',
                <% } else { -%>
                            '/scripts': 'app/scripts',
                <% } -%>
                    '/bower_components': 'bower_components'
            }
        }
    });

<% if (includeBabel) {
    -%>
        gulp.watch('app/scripts/**/*.js', ['scripts']);
<% } -%>
    gulp.watch('test/spec/**/*.js').on('change', reload);
gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {<% if (includeSass) { %>
    gulp.src('app/styles/*.scss')
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)+/
        }))
        .pipe(gulp.dest('app/styles'));
    <% } %>
        gulp.src('app/*.html')
            .pipe(wiredep({
                exclude: [/jquery/, /velocity\.ui/],
                ignorePath: /^(\.\.\/)*\.\./
            }))
            .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
    return gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('build:adform', [], () => {
    const manifestFile = 'app/manifest.json',
        jsonFile = require('jsonfile');

    try {
        // check that app/manifest.json exists before continuing
        fs.accessSync(manifestFile, fs.F_OK);

        // check that a clickTAG exists and is neither empty or example.com
        const manifestData = jsonFile.readFileSync(manifestFile, { encoding: 'utf8', flag: 'r' }),
            clickTag = manifestData.clicktags.clickTAG;

        if (clickTag === '' || clickTag.match(/(example\.com)/)) {
            $.util.log('\n' + $.util.colors.red('No clickTAG set') + '!');

            process.exit(1);
        }

        isAdformAd = true;

        gulp.start('build');
    } catch (e) {
        // generate a template app/manifest.json
        const manifest = { "version": "1.0", "title": "", "description": "", "width": "", "height": "", "events": { "enabled": 1, "list": {} }, "clicktags": { "clickTAG": "http://example.com" }, "source": "index.html" };

        jsonFile.writeFileSync(manifestFile, manifest, { spaces: 4 }, function (err) {
            throw new Error(err);
        });

        $.util.log('\n' + $.util.colors.red('The required `' + manifestFile + '` file is missing.') + '\n\nIt was generated for you, so go ahead and ' + $.util.colors.green('customize it') + '.');

        process.exit(1);
    }
});

gulp.task('build:dcm', [], () => {
    isDcmAd = true;

    gulp.start('build');
});

gulp.task('default', ['clean'], () => {
    gulp.start('build');
});

gulp.task('check:dist', () => {
    try {
        fs.accessSync('./dist', fs.F_OK);
    } catch (e) {
        throw new Error('You need to build the application first!');
    }
});

gulp.task('zip', ['check:dist'], () => {
    let repoInfo = require('git-repo-info'),
        repo = repoInfo(),
        packageName = JSON.parse(fs.readFileSync('package.json')).name.replace(/\s/g, '').toLowerCase(), // extract the current name from package.json
        name = packageName;

    if (repo.branch !== 'master') {
        name += '-' + repo.branch;
    }
    name += '-' + repo.sha.substring(0, 7);

    require('child_process').exec('cp -r dist ' + name, (err, stdout, stderr) => {
        if (err) {
            console.log('Copy Failed: ' + stderr);
            return;
        }
        require('child_process').exec('COPYFILE_DISABLE=1 zip -r ' + name + '.zip ' + name, (err, stdout, stderr) => {
            if (err) {
                console.log('ZIP Failed: ' + stderr);
                return;
            }

            require('child_process').exec('rm -rf ' + name, (err, stdout, stderr) => {
                if (err) {
                    console.log('Remove Folder Failed: ' + stderr);
                    return;
                }
            });
        });
    });
});
