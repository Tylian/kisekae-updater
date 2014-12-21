var http = require('http')
  , fs = require('fs')
  , zlib = require('zlib')
  , path = require('path')
  , async = require('async')
  , mkdirp = require('mkdirp')
  , Zip = require('node-7z')
  , updateConfig = require('./lib/update-config');

var config = {};

var argv = require('minimist')(process.argv.slice(2));

var pathName = argv._[0] || "k_k.latest";
var basePath = path.join(process.cwd(), pathName);
var header = new Buffer(0);

async.waterfall([
	function(callback) {
		if(argv.skip_files) { return callback(null); }
		console.log('Updating list of files to download');
		updateConfig(path.join(__dirname, 'config.json'), callback);
	},
	function(callback) {
		config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
		callback(null);
	},
	function(callback) {
		console.log('Downloading files from the interwebs...');
		var files = {
			'k_kisekae2.html': 'k_kisekae2.html',
			'k_kisekae2.swf': 'k_kisekae2.swf',
			'ac_runactivecontent.js': 'ac_runactivecontent.js',
			'css/common.css': path.join('css', 'common.css')
		};

		for(var i = 0; i < config.files.length; i++) {
			var url = 'k_kisekae2_swf/' + config.files[i] + '.swf';
			files[url] = path.join('k_kisekae2_swf', config.files[i] + '.swf');
		}

		var q = async.queue(function(task, callback) {
			console.log('Downloading ' + task.url + ' ...');
			mkdirp(path.dirname(task.local), function() {
				var file = fs.createWriteStream(task.local);
				var req = http.get(task.url, function(res) {
					res.pipe(file);
					file.on('finish', function() {
						file.close(callback);
					});
				});
			});
		});

		q.drain = callback;

		for(var url in files) {
			q.push({ "url": config.baseUrl + url, "local": path.join(basePath, files[url]) });
		};
	}, function(callback) {
		console.log('Applying offline patch...');
		var file = path.join(basePath, 'k_kisekae2.swf');
		fs.readFile(file, callback);
	}, function(data, callback) {
		header = data.slice(0, 8);
		zlib.unzip(data.slice(8), callback);
	}, function(buffer, callback) {
		// Unset the "isNetwork" flag
		// This flag should always be at offset 0x17, and is the 1st bit.
		buffer[0x17 - 8] = (buffer[0x17 - 8] & ~0x01) >>> 0;

		// Remove the domain check. This uses a pattern search.
		var replaced = false;
		config.patterns.forEach(function(pattern) {
			if(replaced) return;
			var pos = bufferSearch(buffer, pattern.find);
			if(pos > -1) {
				console.log('Patching with pattern: ' + pattern.name);
				var buf = new Buffer(pattern.replace, "hex");
				buf.copy(buffer, pos);
				replaced = true;
			}
		});

		if(!replaced) {
			return callback(new Error('Could not find pattern inside decompressed SWF.'));
		} else {
			zlib.deflate(buffer, callback);
		}
	}, function(buffer, callback) {
		buffer = Buffer.concat([header, buffer]);
		fs.writeFile(path.join(basePath, 'k_kisekae2.swf'), buffer, callback);	
	}, function(callback) {
		var archive = new Zip();
		archive.add(path.join(basePath, pathName + '.7z'), path.join(basePath, '*'), {
			p: config.password
		}).done(function() {
			callback(null);
		}, function() {
			callback(new Error('Unable to compress 7z archive.'));
		});
	}
], function(err, result) {
	if(err) {
		console.log('Not finished, error detected!\n\n', err);
	} else {
		console.log("Finished, no errors detected.");
	}
});

function bufferSearch(source, pattern) {
	var pat_buff = new Buffer(pattern.replace(/\?\?/g, '00'), 'hex');
	var src_len = source.length - pat_buff.length;
	var pat_len = pat_buff.length;

	for(var i = 0; i <= src_len; i++) {
		for(var j = 0; j < pat_len; j++) {
			if(pattern[j*2] != '?' && (pat_buff[j] != source[i + j]))
				break;
			if(j == pat_len - 1)
				return i;
		}
	}
	return -1;
}