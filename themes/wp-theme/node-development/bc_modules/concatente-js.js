let debug = false	 ;
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const messagePrefix = '[concatenate-js]';

const argv = yargs.option('debug', {
	alias: 'd',
	description: 'Run in debug mode',
	type: 'boolean',
	default: false
}).usage(messagePrefix + ' Indicate to run in debug mode the command line').argv;

/* Must have concatenate config */
if (!fs.statSync('./concatenate-js.config.js').isFile()) {
	throw new Error(messagePrefix + ' Provide concatenate-js.config.js at the project root.');
}
const config = require('../concatenate-js.config.js');
/* Debug? */
debug = (argv.debug) ? arvg.debug : debug;
if (debug) {
	console.log(`${messagePrefix}: ** concatenate-js.js debug **`);	
}

/* Get the source files */
const filesToConcat = (config.files) ? config.files : Error(messagePrefix + ' Provide source files in concatenate-js.config.js at the project root.');
/* Get the target */
const targetFile = (config.target) ? config.target : Error(messagePrefix + ' Provide target file in concatenate-js.config.js at the project root.');
if (debug) {
	console.log(`${messagePrefix}:  Target file: ${targetFile}`);	
}
if (filesToConcat.length) {
	if (debug) {
		console.log(``);	
		console.log(`${messagePrefix}: * Process files *`);	
	}
	try {
		/* Remove target file if it exists already */
		if (fs.existsSync(targetFile) && fs.lstatSync(targetFile).isFile()) {
			if (debug) {
				console.log(`${messagePrefix}: Delete existing file ${targetFile}`);	
			}
			fs.unlinkSync(targetFile);
		}
		/* Open a new target file */
		if (debug === true) {
			console.log(`${messagePrefix}: Open target file: ${targetFile}`);	
		}
		const targetFD = fs.openSync(targetFile, 'a+');
		
		/* Get the file data for each source file */ 
		let inputFileData = '';
		for (file of filesToConcat) {
			if (debug === true) {
				console.log(`${messagePrefix}: Read source file: ${file}`);	
			}
			inputFileData += fs.readFileSync(file, 'utf-8') + '\n';
		}
		/* append that to the target file */ 
		if (debug === true) {
			console.log(`Read file: ${targetFD}`);	
		}
		fs.appendFileSync(targetFD, inputFileData);
		fs.closeSync(targetFD);
	} catch (err) {
		console.log(`${messagePrefix}: ${err.message}`);
		if (debug) {
			console.log(`${err.stack}`);	
		}
		return console.log(`${messagePrefix}: Exit...`);
	}
	
} else {
	return console.log(messagePrefix + ' No findable files in concatenate-js.config.js');
}
