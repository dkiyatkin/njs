var njs = function() {
	return function(req, res, next) {
		if (reg_urls.njs.test(req.url_parse.pathname)) {
			var pathname = decodeURIComponent(path.join('/',req.url_parse.pathname));
			var js = path.join(__dirname, pathname);
			path.exists(js, function(exists) {
				if (exists) {
					try {
						require(js).init(req, res, next, __dirname);
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
