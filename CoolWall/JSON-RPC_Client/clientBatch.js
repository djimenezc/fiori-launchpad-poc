/**
 * Created by I058153 on 11/12/13.
 */
var jayson = require('jayson');
var https = require('https');
var fs = require('fs');
var username = 'anzeiger';
var passw = 'display';

var xsrfoptions = {
    host: 'coeportal167.saphosting.de', //
    //  port: 443,
    path: '/sap/bc/jsonrpc/~session',
    method: 'POST',
    //auth: username+':'+passw,
// authentication headers
    headers: {
        'Authorization': 'Basic ' + new Buffer(username + ':' + passw).toString('base64'),
        'X-Requested-With':'XMLHttpRequest'
    },
    agent: false, // or you can supply your own agent, but if you don't you must set to false
    rejectUnauthorized: true,
    ca: [ fs.readFileSync('certs/PCA-3G5.pem') ]
};

// create a client
var xsrf_req = https.request(xsrfoptions,function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            console.log('XSRF: ' +JSON.parse(chunk).headers["X-CSRF-Token"]);
            console.log('Cookie: ' + res.headers["set-cookie"]);
                console.log('Start of rpcCall');
            rpcCall(JSON.parse(chunk).headers["X-CSRF-Token"],res.headers["set-cookie"] );

        });
    });


xsrf_req.write('');
xsrf_req.end();

//console.log('XSRF Client created', xsrf_req);


//get XSRF token
//https://coeportal167.saphosting.de/sap/bc/jsonrpc/~session
//Request header:
//X-Requested-With:XMLHttpRequest
//Response Header
//set-cookie:sap-XSRF_I64_800=YHQjDC74eiR66sUudCXTfQ%3d%3d20131212161527Gg8hz6sFFRylTihzTdtIwtAqgNSnqZ1Yf3MqgWtDrRo%3d; path=/; HttpOnly


//Add to RPC request
//Cookie:sap-contextid=SID%3aANON%3aanvm108_I64_00%3acJ24VuQQ9whsOkkCT3OahPOkObDFdR_Tc4GK_Asn-ATT; sap-XSRF_I64_800=YHQjDC74eiR66sUudCXTfQ%3d%3d20131212161527Gg8hz6sFFRylTihzTdtIwtAqgNSnqZ1Yf3MqgWtDrRo%3d



 function rpcCall( xsrfToken, cookie){
var options = {
    host: 'coeportal167.saphosting.de', //
    //  port: 443,
    path: '/sap/bc/jsonrpc',

// authentication headers
    auth: username+':'+passw,
    headers: {
       // 'Authorization': 'Basic ' + new Buffer(username + ':' + passw).toString('base64'),
        'X-CSRF-Token': xsrfToken,
        'X-Requested-With':'XMLHttpRequest',
        cookie: cookie
    },
    agent: false, // or you can supply your own agent, but if you don't you must set to false
    rejectUnauthorized: true,
    ca: [ fs.readFileSync('certs/PCA-3G5.pem') ]
};

     console.log('XSRF again: ' + xsrfToken);
// create a client
var client = jayson.client.https(options);

console.log('RPC Client created');

     var batch = [
         client.request('BAPI_USER_GET_DETAIL', { "CACHE_RESULTS": 'X', "USERNAME": 'DDIC'  }),
         client.request('BAPI_USER_GET_DETAIL', {"CACHE_RESULTS": 'X', "USERNAME": 'SAP*'  }),
         client.request('BAPI_USER_GET_DETAIL', {}) // a notification
     ];

// invoke "BAPI_USER_GET_DETAIL"
     var request =
client.request(batch, function(err, error, response) {
    if(err) throw err; {

    console.log("Error Response",response); // 2!
        }
        console.log(error);
        console.log(err);
}

);

     console.log('Request:',request);

}