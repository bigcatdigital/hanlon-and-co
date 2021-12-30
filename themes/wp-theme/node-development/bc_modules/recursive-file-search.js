	/* 
		**	Recursively search for files by extension
		**	sourcePath is an absolute file path, extn is a file extension
		** 	Returns an array of absoulte file paths
		** 	@param sourcePath is the root of a file system brach
		**	@param extn is a file extension to get
	*/
	function recursiveFileSearch(sourcePath, extn) {
		let filesArray = [];
		recursiveReadDirs(sourcePath);
		
		/* Does the recursive search */
		function recursiveReadDirs(sourcePath) {
			let subdirs = [];
			let files = fs.readdirSync(sourcePath);
			let $i = 0;			
			for (file of files) {		
				file = path.normalize(sourcePath + '/' + file);
				if (fs.statSync(file).isDirectory()) {
					subdirs.push(file);
				} else if (fs.statSync(file).isFile() && path.extname(file) === extn) {
					filesArray.push(file);
				}
			}
			if (subdirs.length) {
				for (subdir of subdirs) {
					recursiveReadDirs(path.normalize(subdir));
				}
			}
			return true;
		}
		return (filesArray.length) ? filesArray : false;
	}

module.exports = recursiveFileSearch;