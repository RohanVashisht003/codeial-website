const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssNano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');


function css(done){
    console.log("minifying css");
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssNano())
    .pipe(gulp.dest('./assets.css'));
    
    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
}


function js(done){
    console.log("minifying js");
    gulp.src('/assets/js/*.js')
    .pipe(uglify())
    .pipe(rev())

    return gulp.src('./assets/**/*.js')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
}

function images(done){
    console.log("minifying images");
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    // .pipe(gulp.dest('./public/assets'))

    return gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    // .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
}

// empty the public/assets directory
function clean_assets(done){
    del.sync('./public/assets');
    done();
}


gulp.task('css',css);
gulp.task('js',js)
gulp.task('images',images)
gulp.task('clean_assets',clean_assets)

// build the public folder
gulp.task('build', gulp.series('clean_assets','css','js','images'), function(done){
    console.log('Building assets');
    done();
})

