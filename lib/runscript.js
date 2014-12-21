var page = require("webpage").create();
var fs = require("fs");

var configPath = phantom.args[0]
var fileData = JSON.parse(fs.read(phantom.args[0]));

fileData.files = [];

var idleTimeout = null;

function onIdle() {
    fs.write(configPath, JSON.stringify(fileData, null, "\t"), "w");
    page.close();
    phantom.exit();
}

page.onResourceRequested = function(requestData, networkRequest) {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(onIdle, 7000);

    var match = requestData.url.match(/k_kisekae2_swf\/([^\/]+)\.swf$/);
    if(match) {
        fileData.files.push(match[1]);
    }
};

page.open("http://pochi.lix.jp/k_kisekae2.html");
