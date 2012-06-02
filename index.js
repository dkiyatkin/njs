var path = require('path');
var infrajs = require('infrajs');
var reg_njs = new RegExp(infrajs.regExpStr_njs, 'i');

module.exports = function(options) {
	var root = options.root;
	return function(req, res, next) {
		if (reg_njs.test(req.url_parse.pathname)) {
			var pathname = decodeURIComponent(path.join('/',req.url_parse.pathname));
			var js = path.join(root, pathname);
			path.exists(js, function(exists) {
				if (exists) {
					try {
						require(js).init(req, res, next, root);
					} catch(e) {
						console.log('error', e);
						res.writeHead(502); res.end('Bad Gateway');
					}
				} else {
					res.writeHead(404); res.end('Not Found');
				}
			});
		} else { next(); }
	};
};
