var config = require('.././config'),
	redis = require("redis"), kpiUpdatedClient = redis.createClient(config.dbport, config.dbhost);
	http = require('http'),
	querystring = require('querystring'),
	fileSystem = require('fs'),
	path = require('path'),
	sys = require('util'),
	url = require('url');

var tilesData = require("./tiles.json");

var suffixes = ['B', 'M', '%'];
//TODO: get from session
var currentUser = 'Joan Baez';
var socketsByUser = [];
var applicationTimestamps =[];
var onlineSessions = 0;
var tileDelayMap = {};

/**
 * Contructor, 
 * get the tiles data and configure the listener for the suscribers.
 */
var LaunchpadService = function(app) {
	
	//build tile delay map
	var tileData = LaunchpadService.getTiles(currentUser); 		
	
	for ( var i = 0; i < tileData.length; i++) {
		for ( var j = 0; j < tileData[i].items.length; j++) {				
			tileDelayMap[ tileData[i].items[j].id ] =  tileData[i].items[j].delay;
		}
	}		
	
	app.io.route('ready', function(req){
		
		//console.log("Client is ready, generating data");
		
		//req.io.emit('tiles', { message : 'Connected to socket server with client id : ' + req.sessionID, tiles : tilesData.users['David Jones']});
		//req.io.emit('tiles', { tiles : tilesData.users[currentUser]});
		
		//TODO remove
		//var kpiVals = generateKpis(currentUser);
		//return the tiles for this user
		//req.io.emit('kpis', { kpis : kpiVals });
	});
	
	kpiUpdatedClient.on("punsubscribe", function (pattern, count) {
		sys.debug("kpiUpdatedClient punsubscribed from " + pattern + ", " + count + " total subscriptions");
	    kpiUpdatedClient.end();
	});
	    
	kpiUpdatedClient.on("psubscribe", function (pattern, count) {
		sys.debug("kpiUpdatedClient psubscribed to " + pattern + ", " + count + " total subscriptions");		   
	});
	
	kpiUpdatedClient.on("pmessage", function (pattern, channel, message) {
	    sys.log("("+ pattern +")" + " kpiUpdatedClient received message on " + channel + ": " + message);	
	    if(channel === 'updates'){
	    	//TODO when a update is received from the monitorService, try to get the KPI
	    	checkTimestamp(applicationTimestamps, currentUser, JSON.parse(message));
	    }
	   
	});
	
	kpiUpdatedClient.psubscribe('updates');
	
	app.io.on('disconnect', function(socket){
		
		sys.log('disconnect');
	});
	
	/**
	 * Execute each time that one client is connected.
	 */
	app.io.on('connection', function(socket){	
		
		sys.log('Client connected : ' + socket.id);	
		onlineSessions++;
		sys.log('Sessions online : ' + onlineSessions);
		
		/**
		 * Clean the session when the client is disconnected
		 */
		socket.on('disconnect', function () {
			sys.log('DISCONNECT!!! Session id: ' +socket.id + onlineSessions-- + " session still online." );
			
			delete  socketsByUser[currentUser].sockets[socket.id];
		});	
		
		if(socketsByUser[currentUser]) {

			socketsByUser[currentUser].sockets[socket.id] = socket;
		} else {
			socketsByUser[currentUser] = {
					sockets : []
			};
			socketsByUser[currentUser].sockets[socket.id] = socket;
		}
		
		LaunchpadService.getKpis('localhost',8125,applicationTimestamps);
		
	});

};

/**
 * Return the delay time for a specific tile
 * @param id
 * @returns
 */
LaunchpadService.getTileDelayForTile = function(id) {
	return tileDelayMap[id];		
};


/**
 * Return an array of tiles ids
 * @param username
 * @returns {Array}
 */
LaunchpadService.getTilesIds = function(username) {
	
	sys.debug('Username ' +username);
	
	var tilesData = LaunchpadService.getTiles(username);
	var tilesIds = [];
	
	for ( var i = 0; i < tilesData.length; i++) {
		for ( var j = 0; j < tilesData[i].items.length; j++) {
			
			tilesIds.push({'id': tilesData[i].items[j].id, 'timestamp' : 0 } );
		}
	}
	
	sys.log('getTilesIds for '+username+': '+JSON.stringify(tilesIds));
	
	return tilesIds;
};

/**
 * Method to check if the timestamp for a tile has changed since the last checking. If it is different will get the
 * kpi value form the KPI server
 */
var checkTimestamp = function(applicationTimestamps, user, tileUpdateMessage) {

	for ( var tileUpdateIdx in tileUpdateMessage) {

		if(applicationTimestamps[currentUser] && applicationTimestamps[currentUser].timestamps && 
		 applicationTimestamps[currentUser].timestamps[tileUpdateMessage[tileUpdateIdx].id] 
		 && applicationTimestamps[currentUser].timestamps[tileUpdateMessage[tileUpdateIdx].id].timestamp 
		 	- tileUpdateMessage[tileUpdateIdx].timestamp !=0) {
			
			LaunchpadService.getKpis('localhost',8125,applicationTimestamps,
					[applicationTimestamps[currentUser].timestamps[tileUpdateMessage[tileUpdateIdx].id]]);
		}
	}
};

/**
 * Update the timestamp list
 * 
 * @param applicationTimestamps
 * @param currentUser
 * @param kpiValue
 * @param msg
 */
LaunchpadService.updateTimestampItem = function(applicationTimestamps, currentUser,kpiValue,msg) {
	
	applicationTimestamps[currentUser].timestamps[kpiValue.id].timestamp = kpiValue.timestamp;
	applicationTimestamps[currentUser].timestamps[kpiValue.id].id = kpiValue.id;
	applicationTimestamps[currentUser].timestamps[kpiValue.id].kpiSuffix = kpiValue.kpiSuffix;
	
	for(socketIdx in  socketsByUser[currentUser].sockets) {
		sys.debug('Socket '+socketsByUser[currentUser].sockets[socketIdx].id+' Broadcasting '+msg);
		
		socketsByUser[currentUser].sockets[socketIdx].emit('kpis', {kpis : [JSON.parse(msg)] });
	}
};

/**
 * Get the kpi's for a list of tiles from the kpi server
 * @param hostname
 * @param port
 * @param applicationTimestamps
 * @param kpisUpdated
 * @returns {String}
 */
LaunchpadService.getKpis = function getKpis(hostname, port, applicationTimestamps, kpisUpdated) {
	
	kpisUpdated = kpisUpdated ? kpisUpdated : LaunchpadService.getTilesIds(currentUser);
	
	for ( var i = 0; i < kpisUpdated.length; i++) {
		
		var query = querystring.stringify({
			id:kpisUpdated[i].id, 
			delay: LaunchpadService.getTileDelayForTile(kpisUpdated[i].id),
			cancelDelay : false}
		);
		
		var options = {
				host : hostname,
				port : port,
				path : '/getKpi'+'?'+query,
				method : 'GET',
				headers : {
					'Content-Type' : 'application/json; charset=utf-8'
				}
		};
		sys.log('Getting kpi for application: '+options.path + ' hostname: ' + options.host +
				' port ' + options.port);
		
		var req = http.request(options, function(res) {
			
			var msg = '';
			sys.debug('STATUS: ' + res.statusCode);
			//console.log('HEADERS: ' + JSON.stringify(res.headers));

			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				msg += chunk;
				//console.log('Data: Updated received Kpi: ' + msg);
			});
			res.on('end', function() {
				sys.log('End: Updated received from Hana, Kpi: ' + msg);
				
				var kpiValue = JSON.parse(msg);
				
				//Update the applicationTimestamps with the kpi if the timestamp is newer 
				if(!applicationTimestamps[currentUser]) {
					applicationTimestamps[currentUser] = {timestamps : []};
				}
				 
				if(!applicationTimestamps[currentUser].timestamps[kpiValue.id]) {
					applicationTimestamps[currentUser].timestamps[kpiValue.id] = {};
					
					LaunchpadService.updateTimestampItem(applicationTimestamps, currentUser,kpiValue, msg);
				}
				
				//if the timestamp is newer send kpi to the ui client
				if(applicationTimestamps[currentUser].timestamps[kpiValue.id].timestamp - kpiValue.timestamp != 0)
				{
					LaunchpadService.updateTimestampItem(applicationTimestamps, currentUser,kpiValue, msg);
				}
			});
			
		}).on('error', function(err) {
	        sys.debug('unable to connect to ' + JSON.stringify(options));
	    }).on('response', function (response) {
	    	sys.debug('response code' + response);
		});
		
		req.end();
	}
	
	return '{"status": "Ok"}';
};

//TODO remove me
LaunchpadService.getTiles = function(username) {
	return  tilesData.users['Joan Baez'];
};

module.exports = LaunchpadService;
