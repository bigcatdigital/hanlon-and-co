const fs = require('fs');

fs.watch('./app', {
		recursive: true	
	}, (eventType, filename) => {
		console.log(`${(new Date())} --watcher.js: ${eventType}`);	
		console.log(`--watcher.js: ${filename}`);
});