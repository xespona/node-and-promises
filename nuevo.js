const http = require('http');
const myModule = require('./moduloPinta');
require('promise-first');

const cities = process.argv.slice(2);
const length = cities.length;


if (length <= 0) {
    console.log('city is mandatory!!');
    return;
}

const temperatureNotFound = 'not found';

const getTemperatura = function (options, cityName) {
    console.log(options);
    return new Promise((resolve) => {

        // setTimeout(() => resolve({ temp: '4000', name: 'Atrapalo is HOT' }), 2000);
        let myJson = {};
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
                myJson = JSON.parse(str);
                try {
                    // put the responses in an array
                    resolve({ temp: myJson.main.temp, name: myJson.name });
                } catch(e) {
                    resolve({ temp: temperatureNotFound, name: myJson.name });
                }
            });
        });

        // handle connection errors of the request
        req.on('error', () => resolve({ temp: temperatureNotFound, name: myJson.name }));
        req.end();
    });
};

const promises = [];
cities.forEach(function (item) {
    const options = {
        units: 'metric',
        host: myModule.host(),
        path: myModule.path(item),
    };

    promises.push(getTemperatura(options, item));
});


Promise.all(promises)
.then(values => {
    let myValues = myModule.ordena(values);
    myModule.pinta(myValues);
}).catch(reason => {
    console.log("he cascao por: "+reason);
});

// Promise.first(promises, 3)
// .then(values => {
//     var values = myModule.ordena(values);
//     myModule.pinta(values);
// }).catch(reason => {
//     console.log("he cascao por: "+reason);
// });


