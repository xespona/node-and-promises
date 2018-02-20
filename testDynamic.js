const request = require('request');

function getAccommodationSearchParameters(productSearchId)
{
    return {
        // url: 'https://api-dynamicpackaging.atrpm.com/product_searches/' + productSearchId + '/accommodations',
        url: 'http://api.dp.local.com/product_searches/' + productSearchId + '/accommodations',
        method: 'GET',
        json: true,
        body: {
            size: 10,
            page: 1
        }
    }
}


let identity = '3423a271-1793-4dbe-85e9-861598bd113f';

let parameters = getAccommodationSearchParameters(identity);
console.log(parameters.url);

test = request(parameters, function (error, response, body) {
    console.log(response.statusCode);

    if (response.statusCode === 201 || response.statusCode === 201) {
        console.log(body);
    }
});
