const paths = require('./config.js');
module.exports = {
	src: {
		icons: paths.svgicons.src
	},
	output: {
		icons: paths.svgicons.output
	},
	cleanDefs: true,
	cleanSymbols: true,
	svgAttrs: false,
	symbolAttrs: {
		viewBox: '0 0 100 100'
	},
	copyAttrs: false,
	renameDefs: false
}