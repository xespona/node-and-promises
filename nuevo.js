var http = require('http');
var myModule = require('./moduloPinta');
require('promise-first')

var cities = process.argv.slice(2);
var length = cities.length;
var count = 0;

if (length <= 0) {
    console.log('city is mandatory!!');
    return;
}

const temperatureNotFound = 'not found';

const getTemperatura = function (options, cityName) {
    return new Promise((resolve, reject) => {

        // setTimeout(() => resolve({ temp: '4000', name: 'Atrapalo is HOT' }), 2000);

        let req = http.request(options, (response) => {
            // handle http errors
            if (response.statusCode < 200 || response.statusCode > 299) {
                resolve({ temp: temperatureNotFound, name: cityName });
            }

            // temporary data holder
            let str = '';
            // on every content chunk, push it to the data array
            response.on('data', (partialData) =>  {
                str += partialData;
            });

            // we are done, resolve promise with those joined chunks
            response.on('end', () => {
                try {
                    var myJson = JSON.parse(str);
                    // put the responses in an array
                    resolve({ temp: myJson.main.temp, name: myJson.name });
                } catch(e) {
                    resolve({ temp: temperatureNotFound, name: myJson.name });
                }
            });
        });

        // handle connection errors of the request
        req.on('error', (err) => resolve({ temp: temperatureNotFound, name: myJson.name }))
        req.end();
    });
}

var promises = [];
cities.forEach(function (item, idx, array) {
    var options = {
        host: myModule.host(),
        path: myModule.path(item),
    };

    promises.push(getTemperatura(options, item));
});


// Promise.all(promises)
// .then(values => { 
//     var values = myModule.ordena(values);
//     myModule.pinta(values);
// }).catch(reason => { 
//     console.log("he cascao por: "+reason);
// });

Promise.first(promises, 3)
.then(values => { 
    var values = myModule.ordena(values);
    myModule.pinta(values);
}).catch(reason => { 
    console.log("he cascao por: "+reason);
});


