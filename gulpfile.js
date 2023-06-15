const { src, dest, watch, series, parallel } = require('gulp');

//CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

//Imagenes
const imagenmin = require('gulp-imagemin');
const cache = require('gulp-cache');
const webp = require('gulp-webp');
const avif = require('gulp-avif');


//Paths/Rutas
const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
}

function css(done) {
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));

    done();
}

function imagenes() {
    return src('src/img/**/*')
        .pipe(imagenmin({ optimizationLevel: 3 }))
        .pipe(dest('build/img'))
}

function versionWebp(done) {
    const calidad = {
        quality: 50
    };

    src(paths.imagenes, '.{png,jpg}')
        .pipe(webp(calidad))
        .pipe(dest('build/img'))

    done();
}

function versionAvif(done) {
    const calidad = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe(avif(calidad))
        .pipe(dest('build/img'))

    done();
}

function dev() {
    watch(paths.scss, css);
    watch(paths.imagenes, imagenes);
    watch(paths.imagenes, versionWebp);
    watch(paths.imagenes, versionAvif);
}

//series Inicia una tarea y cuando finaliza inicia la siguiente en la linea
//parallel Inicia todas las tareas al mismo tiempo

exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.css = css;
exports.dev = dev;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);