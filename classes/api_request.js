exports.do = function (url, path, datas, callback) {
			var options = {
			  host: url,
			  port: 80,
			  path: '/resource?id=foo&bar=baz',
			  method: 'POST'
			};

			http.request(options, function(res) {
			  //console.log('STATUS: ' + res.statusCode);
			  //console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.setEncoding('utf8');
			  var data = "";
			  res.on('data', function (chunk) {
				  data = data + chunk;
			  });
			  res.on('end', function (chunk) {
				  try {
				        var data_js = JSON.parse(data);
				        return callback(data_js);
				  } catch (ex) {
				    	return callback(null);
				  }				  
			  });
			}).end();
}