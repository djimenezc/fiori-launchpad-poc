http = require('http'),
	fileSystem = require('fs'),
	path = require('path'),
	url = require('url'),
	sys = require('sys'),
	config = require('../config/config'),
	port = 8125,
	configLogger = require("../config/services/configLogger"),
	parsedUpdatesJSON = require('../monitor/fakeUpdatesRes.json'),
	defaultValue = 0;

function pollResponse (res) {
	
	sys.log('Received poll request');
	
    res.writeHead(200, {
        'Content-Type': 'text/json'
    });

    if(parsedUpdatesJSON) {
	    	parsedUpdatesJSON.forEach(function(entry, index) {
	    		entry.timestamp= (new Date()).getTime();
	    	});
    }
    
    console.log('Response: '+ parsedUpdatesJSON);
    res.write( JSON.stringify( parsedUpdatesJSON ));
    
    res.end();
}


function parsedKpisValuesResponse(res,applicationId, value) {

    res.writeHead(200, {
        'Content-Type': 'text/json'
    });

    var value = value ? value : Math.floor(Math.random() * 100) + 1;
    
    var parsedKpiJSON = {
    		
    		timestamp : (new Date()).getTime(),
    		id : applicationId,
    		value : value,
    		kpiSuffix : 'M'
    };
    
    sys.log('Response: '+ JSON.stringify(parsedKpiJSON));
    res.write( JSON.stringify( parsedKpiJSON ));
    
    res.end();
}
	
//TODO: check for update or kpi value requests and return appropriate JSON
http.createServer(function(req, res) {
	
	
	if(req.url=='/updatesKpis' ) {
	
		pollResponse(res);
	} else if(req.url.indexOf('/getKpi') != -1 ) {
		
		 var urlParts = url.parse(req.url, true);
		 var applicationId = urlParts.query.id;
		 var applicationDelay = urlParts.query.delay * 1000;
		 var cancelApplicationDelay = urlParts.query.cancelDelay;
		
		 sys.log('Received kpi request ' + applicationId + ' delay: '+ applicationDelay + 
				 " cancelApplicationDelay " + cancelApplicationDelay);
		 
		 if (!applicationDelay) {
			 sys.debug('Skiping delay');
			 
			 if(defaultValue > 100) {
				 defaultValue = 0;
			 }
			 parsedKpisValuesResponse(res,applicationId , defaultValue++);
		 } else {			 
			 sys.debug('Applying delay');
			 setTimeout(function() {
				 parsedKpisValuesResponse(res,applicationId);
				 }, applicationDelay);
		 }
		 
	} else {
		sys.error('Request not supported');
		
		res.writeHead(400, {
	        'Content-Type': 'text/json'
	    });
		res.write( 'Request not supported');
		res.end();
	}
	
}).listen(port);

configLogger();

sys.log('Server running at http://127.0.0.1:'+port);
sys.log('Default value: '+defaultValue);
