/* Project global configs */
const paths = {
	js: {
		'source': ['node_modules/gsap/dist/gsap.js', 'node_modules/gsap/dist/ScrollToPlugin.min.js', 'node_modules/flickity/dist/flickity.pkgd.js', './dev/scripts/app.js' ],
		'target': '../assets/scripts/app-concat.js'
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