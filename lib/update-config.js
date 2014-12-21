var child = require('child_process')
  , path = require('path');

function updateConfig(file, callback) {
	var file = path.resolve(file);
	var slimerjsPath = path.resolve(__dirname, 'slimerjs');
	child.exec('slimerjs ../runscript.js ' + file, { cwd: slimerjsPath }, function(err, stdout, stderr) {
		callback(err);
	});
}

module.exports = updateConfig;