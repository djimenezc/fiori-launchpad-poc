'use strict';

angular.module('coolWallApp')
    .controller('TilesCtrl', ['$scope', 'socketservice','$http', function ($scope, socketservice,$http) {
    	
    	var tiles = undefined;
        var tilesById = undefined;
    	
    	var updateKPIs = function (tiles,kpis) {
        	//should use associative arrays
            var count = 0;
            if (!tilesById) {
                tilesById = {};
                for (var i=0; i < tiles.length; i++){
                    var group = tiles[i];
                    for (var j=0; j < group.items.length; j++){
                        var tile = group.items[j];
                        tilesById[tile.id] = tile;
                    }
                }
            }

            for (var kpiIdx in kpis) {
            	var kpi = kpis[kpiIdx];
            	for(var group in tiles){
            		for(var tileIdx in tiles[group].items){
	            		if(tiles[group].items[tileIdx].id === kpi.id){
	            			tiles[group].items[tileIdx].kpi = kpi.value;
	            			tiles[group].items[tileIdx].kpiSuffix = kpi.kpiSuffix;
	            			break;
	            		}
            		}
            	}
            }
            $scope.tiles = tiles;
        };
    	

        $http({method: 'GET', url: '/services/getTiles'}).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
        	
        	console.log('Data getTiles: '+ data);
        	tiles = data;
   	        $scope.tiles = data;

	   	     socketservice.on('kpis', function (data) {
	     	      $scope.message = data.message;
	     	      console.log("Kpis: " + data.kpis);
	     	      updateKPIs(tiles, data.kpis);
	     	    });
	       	
	       	socketservice.emit('ready');   	
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    	
    }]);


