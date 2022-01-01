module.exports = {
	base: './', 
	inline: true,
	html: undefined,
	src: '../index.html',	
	isDir: false,
	css: '../assets/css/style.css', 
	dest: '../index.html', 
	width: undefined, 
	height: undefined, 
	dimensions:  [{
			width: 360,
			height: 640
		 },
		 {
			width: 1366,
			height: 768
		 },
		{
			width: 1440,
			height: 900
		},
		{
			width: 1920,
			height: 1080
	}],
	extract: true,
	minify: false,
	timeout: 0,
	pathPrefix: undefined,
	ignore: undefined,
	ignoreOptions: {},
};