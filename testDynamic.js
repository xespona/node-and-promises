const request = require('request');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const NUM_ELEMENTS = 300;

function getAccommodationSearchParameters(productSearchId, size, page) {
    let rand = Math.random();
    return {
        //url: 'http://api.dp.local.com/product_searches/' + productSearchId +
        url: 'https://api-dynamicpackaging.atrpm.com/product_searches/' + productSearchId +
        '/accommodations?view=lite&page=' + page + '&size=' + size + '&rand=' + rand,
        method: 'GET',
        json: true,
    };
}

let identity = 'c4525090-ad61-4064-8346-9e9576494e5e';
let start = new Date();

let parameters = getAccommodationSearchParameters(identity, 1, 1);
console.log(parameters.url);

request(parameters, function (error, response, body) {
    console.log(response.statusCode);

    if (response.statusCode === 200 || response.statusCode === 201) {
        // console.log(body);
        let now = new Date();
        console.log('1rst request was completed in ' + (now.getTime() - start.getTime()) + ' milliseconds');
        let totalElements = parseInt(body.results.pagination.total_elements);

        console.log('Total elements: ' + totalElements);

        let startPromises = new Date();
        let promises = [];
        let page = 1;
        while (totalElements > 0) {
            let p = new Promise(function (resolve) {
                console.log('Created promise ' + page);

                let parameters = getAccommodationSearchParameters(identity, NUM_ELEMENTS, page);

                request(parameters, function (error, response, body) {

                    let now = new Date();
                    let page = body.results.pagination.actual_page;
                    console.log('Received promise ' + page + ' in ' + (now.getTime() - startPromises.getTime()) +
                        ' milliseconds');
                    resolve(body.results.accommodations);
                });
            });
            promises.push(p);
            ++page;
            totalElements -= NUM_ELEMENTS;
        }

        Promise
            .all(promises)
            .then(function (results) {
                console.log('BIEN!!!');
                let accommodations = [];
                for (let i = 0; i < results.length; ++i) {
                    accommodations = accommodations.concat(results[i]);
                }
                console.log(accommodations.length);
                let now = new Date();
                console.log('Process completed in ' + (now.getTime() - start.getTime()) + ' milliseconds');

            })
            .catch(function (reason) {
                console.log('AYYY!!!');
                console.log(reason);
            });
    }
});