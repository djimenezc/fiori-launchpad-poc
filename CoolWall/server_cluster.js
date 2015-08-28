/**
 * Module dependencies.
 */

var cluster = require('cluster');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config')/*,
    mongoose = require('mongoose');*/
    
//Node Monitor
//var Monitor = require('monitor').start();

if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    console.log(cpuCount + ": cores found");
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
        console.log("Forked server worker : " + i);
    }

// Code to run if we're in a worker process
} else {	
	
	var express = require('express.io'),
		fs = require('fs');
	
	var app = express();
	
	app.http().io(); 
	
	//express settings
	require('./config/express')(app);
	
	//Bootstrap routes
	require('./config/routes')(app);
	
	//Start the app by listening on <port>
	var port = config.port;
	app.listen(port);
	console.log('Express app started on port ' + port);
	console.log("Running env : " + env);
	
	//expose app
	exports = module.exports = app;
}
