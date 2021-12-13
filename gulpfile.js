const { src, dest, watch, parallel } = require('gulp');

const scss 				= require('gulp-sass')(require('sass'));
const concat 			= require('gulp-concat');
const browserSync 	    = require('browser-sync').create();
const autoprefixer	    = require('gulp-autoprefixer');
const imagemin			= require('gulp-imagemin');
// const uglify            = require('gulp-uglify-es').default; // Для JS

function browsersync() {
	browserSync.init({
		server : {
			baseDir: 'app/'
		},
		port: 8080
	});
}

// function scripts() {
// 	return src([
// 		// 'node_modules/jquery/dist/jquery.js', 
// 		//(сюда можно тыкать любой скаченный плагин через npm, в конце обязательно должен быть свой js)
// 		'app/js/main.js'
// 	])
// 	.pipe(concat('main.js'))
// 	.pipe(uglify())
// 	.pipe(dest('app/js'))
// 	.pipe(browserSync.stream())
// }



function images() {
	return src('app/images/**/*')
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({quality: 75, progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
			]
		})
	]))
	.pipe(dest('dist/images'))
}

function styles() {
	return src('app/scss/style.scss')
		.pipe(scss({outputStyle: 'compressed'}))
		// expanded(стандартный css), compressed(минифицированный файл)
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 version'],
			grid: true
		}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}


function build() {
	return src([
		'app/css/style.min.css',
		'app/fonts/**/*',
		'app/js/main.js',
		'app/*.html'
	], {base: 'app'})
	.pipe(dest('dist'))
}


function watching() {
	watch(['app/scss/**/*.scss'], styles);
	// watch(['app/js/main.js', '!app/js/main.min.js'], scripts);
	watch(['app/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.build = build;
exports.images = images;
// exports.scripts = scripts;

exports.default = parallel(styles, browsersync, watching); // +scripts
