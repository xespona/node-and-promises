'use strict';

let App = {

	host: function() {
		return 'api.openweathermap.org';
	},

	path: function(item) {
		return '/data/2.5/weather?q='+ item +'&units=metric&APPID=56113ea64fd73fb989bcfdd636c050f0';
	},

    pinta: function (something) {
        console.log(something);
    },

    cabron: function() {
    	console.log('cabron');
    },

    ordena: function(toSort) {
    	return toSort.sort(this.sortMe);
    },

    sortMe: function(cityOne, cityTwo) {
	    if (cityOne.temp < cityTwo.temp ) {
	        return -1;
	    }

	    if (cityOne.temp > cityTwo.temp) {
	        return 1;
	    }

	    return 0;
	} 
};

module.exports = App;

