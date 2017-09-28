var http = require('http');
var myModule = require('./moduloPinta');


var cities = process.argv.slice(2);
var promises = [];
if (cities.length <= 0) {
    console.log('city is mandatory!!');
    return;
}

var length = cities.length;
var count = 0;



var responses = [];
callback = function(response) {
    count++
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        var myJson = JSON.parse(str);
        // put the responses in an array
        responses.push({ temp: myJson.main.temp, name: myJson.name });

        // if (count == length) {
        //     var sortedData = myModule.ordena(responses)
        //     myModule.pinta(sortedData);
        // }
    });
}

cities.forEach(function (item, idx, array) {
    var options = {
        host: myModule.host(),
        path: myModule.path(item),
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
          console.log('No more data in response.');
        });
    });

    promises.push(new Promise(resolve, reject) => {
        http.request(options, callback).end();
    });
});
