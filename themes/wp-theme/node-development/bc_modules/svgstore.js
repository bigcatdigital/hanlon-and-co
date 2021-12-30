(function bcSvgStore() {
	/* 
	Wrapper for npm svgstore 
	https://www.npmjs.com/package/svgstore
	*/
	let debug = false;
	
	const fs = require('fs');
	const path = require('path');
	const svgstore = require('svgstore');
	const yargs = require('yargs');
	const messagePrefix = '[bc-svgstore]';
	
	//Must have the SVGStore config
	if (!fs.statSync('./svgstore.config.js').isFile()) {
		throw new Error(`${messagePrefix} Provide svgstore.config.js at the project root`);
	}
	//Command line arguments
	const argv = yargs.option('icons', {
		alias: 'i',
		description: 'Do SVG icons',
		type: 'boolean'
	}).option('images', {
		alias: 'm',
		description: 'Do SVG images',
		type: 'boolean'
	}).option('debug', {
		alias: 'd',
		description: 'Run in debug mode',
		default: false,
		type: 'boolean'
	}).usage(messagePrefix + ' Indicate SVG Icons or images at the command line').argv;
	
	const options = require('../svgstore.config.js');
	
	debug = (argv.debug) ? argv.debug : debug;
	if (debug) {
		console.log(options)
	}
	
	const srcDir = (argv.images) ? options.src.images : options.src.icons;
	const srcSvgs = (argv.images) ? fs.readdirSync(options.src.images) : fs.readdirSync(options.src.icons);
	const outputDir = (argv.images) ? options.output.images : options.output.icons;
	try {
		//Create the sprite
		let sprite = svgstore(options);
		if (srcSvgs.length) {
			for (svg in srcSvgs) {	
				let thisSvgPath = path.normalize(`${srcDir}/${srcSvgs[svg]}`);
				if (path.extname(`${srcDir}/${srcSvgs[svg]}`) === '.svg') {
					let thisSvg = fs.readFileSync(thisSvgPath);
					sprite.add(srcSvgs[svg].substring(0, srcSvgs[svg].indexOf('.svg')), thisSvg);
				} else {
					continue;
				}
			}
			fs.open(outputDir, 'w+', (err, outputFD) => {
				if (err) {
					console.log(`${messagePrefix}: ${err.message}`);
					if (debug) {
						console.log(`${messagePrefix}: ${err.stack}`);	
					}			
				}
				fs.write(outputFD, sprite, (err, data) => {
					if (err) {
						console.log(`${messagePrefix}: ${err.message}`);
						if (debug) {
							console.log(`${messagePrefix}: ${err.stack}`);	
						}			
					}
					console.log(`${messagePrefix}: Success! Wrote ${outputDir}`)
				});	
			});		
		} else {
			return console.log(`${messagePrefix}: No svgs in ${srcDir}`);
		}
	} catch (err) {
		console.log(`${messagePrefix}: ${err.message}`);
		if (debug) {
			console.log(`${err.stack}`);	
		}
		return console.log(`${messagePrefix}: Exit...`);
	}
})();


