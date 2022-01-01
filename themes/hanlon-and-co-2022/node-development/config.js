/* Project global configs */
const paths = {
	js: {
		dev: ['./dev/scripts/app.js'],
		build: ['./dev/scripts/temp/app-temp.js'],
		vendor: ['node_modules/flickity/dist/flickity.pkgd.min.js'],
		target: '../assets/scripts/app-concat.js'
	},
	css: '../assets/css/style.css',
	sass: {
		'input': './dev/sass/',
		'output': './dev/css/'
	},
	svgicons: {
		'src': './dev/media/svg/icons/',
		'output': '../assets/media/svg/icons/bc-svgs.svg'
	}
}
module.exports = paths;