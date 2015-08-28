var http = require('http'),
	fileSystem = require('fs'),
	path = require('path'),
	env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	config = require('../config/config'),
	pollingService = require('./pollingService'),
	port = config.hanaport, //8125,
	hostname = config.hanahost, //'localhost',
	webservicePath = config.hanapollingPath, //'/updatesKpis',
	configLogger = require("../config/services/configLogger"),
	parsedJSON = require('../monitor/fakeUpdatesRes.json');

var intervalInMilisec= config.intervalInSec * 1000;

configLogger();

var pollingServiceInstance = new pollingService(hostname,port,webservicePath,intervalInMilisec);
