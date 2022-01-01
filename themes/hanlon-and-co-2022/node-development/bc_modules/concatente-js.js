let debug = false	 ;
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const messagePrefix = '[concatenate-js]';

/* Args - mode [dev, build] */
const argv = yargs.option('debug', {
	alias: 'd',
	description: 'Run in debug mode',
	type: 'boolean',
	default: false
}).option('buildMode', {
	alias: 'm',
	description: 'Build mode',
	type: 'string',
	default: 'dev'
}).argv;

/* Must have config.js for file paths */
if (!fs.statSync('./config.js').isFile()) {
	throw new Error(messagePrefix + ' Provide config.js at the project root.');
}
const filePaths = require('../config.js');
/* Debug? */
debug = (argv.debug) ? true : false;
if (debug) {
	console.log(`${messagePrefix}: ** concatenate-js.js debug **`);	
}
/* Build mode */
const buildMode = argv.buildMode;
if (debug) {
	console.log(`${messagePrefix} build mode: ** ${buildMode} **`);	
}
/* Get the source files */
const filesToConcat = [];
/* Vendor files */
filePaths.js.vendor.forEach(filePath => {
	filesToConcat.push(filePath);
});
/* App files ? dev or build mode */
if (argv.buildMode == 'build') {
	filePaths.js.build.forEach(filePath => {
		filesToConcat.push(filePath);
	});
} else {
	filePaths.js.dev.forEach(filePath => {
		filesToConcat.push(filePath);
	});
}
/* Get the target */
const targetFile = (filePaths.js.target) ;
console.log(`${messagePrefix} Starting..`);	
console.log(`${messagePrefix} Source files: ${filesToConcat}`);	
console.log(`${messagePrefix} Target: ${targetFile}`);	

if (filesToConcat.length > 0) {
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
			console.log(`${messagePrefix} Open target file: ${targetFile}`);	
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
			console.log(`${messagePrefix} Read file FD: ${targetFD}`);	
		}
		fs.appendFileSync(targetFD, inputFileData);
		fs.closeSync(targetFD);
		console.log(`${messagePrefix} File written: ${targetFile}`);	
	} catch (err) {
		console.log(`${messagePrefix} Error: ${err.message}`);
		if (debug) {
			console.log(`${err.stack}`);	
		}
		return console.log(`${messagePrefix} Exit...`);
	}
} else {
	return console.log(messagePrefix + ' No findable files in ../config.js');
}
