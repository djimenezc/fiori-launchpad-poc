var http = require('http'),
	config = require('../config/config'),
	sys = require('sys'),
	redis = require("redis"), 
	pubsubClient = redis.createClient(config.dbport, config.dbhost);

module.exports = function(hostname,port,webservicePath, intervalInMilisec) {

	sys.log('Polling http://'+hostname+':'+port+webservicePath);
	
	
	var username = 'system';
	var password = 'Manager01';
	var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
	
	var options = {
		host : hostname,
		port : port,
		path : webservicePath,
		method : 'GET',
		'proxy' : 'http://proxy:8000',
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Authorization' : auth
		}
	};
	
	/**
	 * Call the KPI server in an interval of intervalInMilisec
	 */
	setInterval(function() {

		sys.log('Polling webservice');
		
		var timestamp = (new Date).getTime();
		
		var data = JSON.stringify({
			'timestamp' : timestamp 
		});
		
		sys.debug('Current timestamp polling service: '+timestamp);
		options.headers['Content-Length']= data.length;
		
		//TODO: request kpi values when an update is received. Do we store and check timestamps or just expect only updated app/tile ids
		
		var req = http.request(options, function(res) {
			var msg = '';

			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				msg += chunk;
				sys.debug('Data: Updated received : ' + msg);
			});
			res.on('end', function() {
				sys.log('End: Updated received : ' + msg);
				pubsubClient.publish('updates', msg);
			});
			
		}).on('error', function(err) {
	        sys.debug('unable to connect to ' + JSON.stringify(options)+ ' Error: '+err.stack);
	    }).on('response', function (response) {
			
		});

		req.write(data);
		req.end();
	}
	, intervalInMilisec);

	sys.log('Polling service started with interval: '+intervalInMilisec+' ms');
};