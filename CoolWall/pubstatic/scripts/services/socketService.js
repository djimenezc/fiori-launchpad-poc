/*
* iain.o-farrell@sap.com socket service for angular
*/

'use strict';

angular.module('coolWallApp').factory('socketservice', function ($rootScope, $timeout) {
	
	//var createNew = {'force new connection' : true } 
	console.log("WS connection attempt to : " + window.location.hostname + ':' + window.location.port );
    var socket = io.connect('http://' + window.location.hostname + ':' + window.location.port + '/', {'connect timeout': 10});
    
    var socketService = {
      on: function (eventName, callback) {    	
    	  socket.on(eventName, function () {  
	          var args = arguments;
	          $rootScope.$apply(function () {
	            callback.apply(socket, args);
	          });
    	  });
      },
      emit: function (eventName, data, callback) {
    	  socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });	
        });
      },
      reconnect : function (callback){
    	  console.log("WS reconnection attempt to : " + window.location.hostname + ':' + window.location.port );
    	  socket = io.connect('http://' + window.location.hostname + ':' + window.location.port + '/');
      }
    };
    
    window.onbeforeunload = function() {
    	
    	console.log('Disconnecting socket');
    	socketService.emit('disconnect');   
    	
    	socket.onclose = function () {}; // disable onclose handler first
    	socket.disconnect();
    	
    	if(socket.socket) {
    		socket.socket.disconnect();
    	}
    	console.log('Session disconnected');
    	
    };
    
    return socketService;
  });
