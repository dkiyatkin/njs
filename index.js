var fs = require('fs');
var path = require('path');
var url = require('url');
var regNjs = new RegExp('(node(_|-)[^/]*/.*\\.)|(\\.n\\.{0,1})js$', 'i');
var regNcoffee = new RegExp('.+\\.n\\.coffee$', 'i');
require('coffee-script/register');

module.exports = function(options) {
	var root = options.publicDir;
	return function(req, res, next) {
		var urlpathname = url.parse(req.url).pathname;
		if (regNjs.test(urlpathname) || regNcoffee.test(urlpathname)) {
			var pathname = decodeURIComponent(path.join('/', urlpathname));
			var js = path.join(root, pathname);
			fs.exists(js, function(exists) {
				if (exists) {
					try {
						require(js).init(req, res, next, root);
					} catch(e) {
						console.error('error', e);
						res.writeHead(502);
						res.end('Bad Gateway');
					}
				} else {
					res.writeHead(404);
					res.end('Not Found');
				}
			});
		} else { next(); }
	};
};
