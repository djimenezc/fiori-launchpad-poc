var async = require('async'), 
	config = require('./config'), 
	redisclient = require('redis').createClient(config.dbport, config.dbhost);
var hdb = require('hdb');

module.exports = function(app,lpServiceInstance) {

	var lpServiceInstance = require('./services/launchpadservice.js');

    //Home route
    //var index = require('../app/scripts/controllers/main');
	
    app.get('/', function(req, res){
	  res.redirect('/logon');
	});

    app.get('/logon', function(req, res){
    	res.sendfile(config.static_path +  '/logon.html');
    });
    
    app.post('/logon', function(req, res){
        this.connectionOK = false;
    	console.log(req.body.username);
        console.log(req.body.password);

        if(req.body.username != '' && req.body.password !='') {
        	//res.redirect('/home');
        	//logged on : temp store uname against session id
        	 redisclient.set('namedsess:' + req.sessionID, '{ "user" : "' + req.body.username + '",' +
        			 									      '"password": "' + req.body.password + '" }');
        	 //example of how to retrieve the uname
        	 redisclient.get('namedsess:' + req.sessionID, function (err, reply) { // get entire file
        	        if (err) {
        	            console.log("Get error: " + err);
        	        } else {
        	           console.log("User : " + JSON.parse(reply).user);
        	           console.log("hdb.createClient for : " +  config.hanahost +":"+ config.hanaport +":"+ JSON.parse(reply).user );
        	           var client = hdb.createClient( {

                            host     :  config.hanahost,
                            port     : config.hanaport,
                            user     :  JSON.parse(reply).user,
                            password :  JSON.parse(reply).password
                           });

        	           console.log("Connecting to HANA to verify credentials " + JSON.parse(reply).user);

                        client.connect(function (err) {
                            if (err) {
                                console.error('Connect error', err);
                                var message = encodeURIComponent('Username or password incorrect, please try it again.');
                                console.error(message);
                                res.redirect('/logon?valid=' + message);
                            }
                            client.exec('select current_user from DUMMY', function (err, rows) {
                                client.end();
                                if (err) {
                                     console.error('Execute error:', err);
                                    var message = encodeURIComponent('Username or password incorrect, please try it again.');
                                    console.error(message);
                                    res.redirect('/logon?valid=' + message);

                                }
                                console.log('Results:', rows);
                                console.log("Connecting to HANA worked"+JSON.stringify(rows));
                                res.redirect('/home');
                            });
                        });
                    }
             })

        } else {
        	var message = encodeURIComponent('Username or password incorrect, please try it again.');
        	console.log(message);
        	res.redirect('/logon?valid=' + message);
        }
        
    });
    
    app.get('/services/getTiles', function(req, res){
    	console.log('getTiles');
    	res.json(lpServiceInstance.getTiles());
    });
    
    app.get('/home', function(req, res){
    	console.log("Load home resources : " + config.static_path +  '/main.html');
    	res.sendfile(config.static_path +  '/main.html');
    });
    
    // Setup a route for the ready event, and add session data.
   /* app.io.route('ready', function(req) {
        req.session.name = req.data
        req.session.save(function() {
            req.io.emit('get-feelings')
        })
    })*/
   
};