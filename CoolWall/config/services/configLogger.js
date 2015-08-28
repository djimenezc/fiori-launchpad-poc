var config = require('../config');
var sys = require('util');

module.exports = function() {
	
	var DEBUG = config.debug;
	if(!DEBUG){
		console.log('Log debug disable');
	    if(!console) console = {};
	    var methods = ["debug", "warn"];
	    for(var i=0;i<methods.length;i++){
	    	console[methods[i]] = function(){};
	    	sys[methods[i]] = function(){};
	    }
	} else {
		console.log('Starting app in debug mode');
	}
	
};