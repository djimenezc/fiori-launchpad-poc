/**
 * Module dependencies.
 */
var express = require('express.io'),	
	redis = require('redis'),
	RedisStore = require('connect-redis')(express),
    flash = require('connect-flash'),
    config = require('./config'),
    configLogger = require("./services/configLogger"),
    lpService = require('./services/launchpadservice');

var lpServiceInstance;

module.exports = function(app) {
	
	/*express.logger('debug');
	app.use(express.logger());*/
	
	configLogger();
	lpServiceInstance = new lpService(app);
	
	app.set('showStackError', true);

    //Should be placed before express.static
    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    //Setting the fav icon 
    app.use(express.favicon());   
//    app.use('/lib', express.static(config.root + '/pubstatic/lib'));

    //Don't use logger for test env
   /* if (process.env.NODE_ENV !== 'test') {
        app.use(express.logger('dev'));
    }
*/
    //Set views path, template engine and default layout
    app.set('views', config.root + '/app/views');

    //Enable jsonp
    app.enable("jsonp callback");

    app.configure(function() {
        //cookieParser should be above session
        app.use(express.cookieParser('MEAN'));

        //bodyParser should be above methodOverride
        app.use(express.bodyParser());
        app.use(express.methodOverride());

        //express/redis session storage
        app.use(express.session({
            secret: 'MEAN',            
            store: new RedisStore({
                host: config.dbhost,
                port: config.dbport
            })
        	,cookie: { maxAge: 360000 }
        }));
        
        app.io.set('store', new express.io.RedisStore({
            redisPub: redis.createClient(config.dbport, config.dbhost),
            redisSub: redis.createClient(config.dbport, config.dbhost),
            redisClient: redis.createClient(config.dbport, config.dbhost),
        }));
        
        console.log("Connected to redis store : " + config.dbhost  + ":" + config.dbport);
        
       /* var redisclient = redis.createClient(config.dbport, config.dbhost);
        redisclient.set('1234Keys', 'store some stuff!');*/

        //connect flash for flash messages
        app.use(flash());

        app.use(express.static(config.root + '/' + config.static_path));
        //routes should be at the last
        app.use(app.router);
        //this is here to force routes to be used...

        //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
        app.use(function(err, req, res, next) {
            //Treat as 404
            if (~err.message.indexOf('not found')) return next();
            //Log it
            console.error(err.stack);
            //Error page
            res.status(500).sendfile(config.root + '/' + config.static_path + '/500.html');
        });

        //Assume 404 since no middleware responded
        app.use(function(req, res, next) {
            res.status(404).sendfile(config.root + '/' + config.static_path + '/404.html');
        });

    });
};
