app.factory('BackendConfig', ['$resource', 'requests', function($resource, requests) {
    return requests.adapt($resource('/config.jso'));
}]);

app.factory('ClientConfig', ['$resource', 'requests', function($resource, requests) {
    var resource = $resource('/client.jso'),
        proxy = requests.adapt(resource),
        unsafeGet = proxy.get;

    //when config doen't exists, create new empty resource instead
    proxy.get = function() {
        return unsafeGet.apply(this, arguments).catch(function() {
            return new resource();
        });
    };
    return proxy;
}]);

app.factory('sensorResourceFactory', ['$resource', 'requests', '$http', 'utils', function($resource, requests, $http, utils) {
    return function(name, mapFn) {
        var transformers = $http.defaults.transformResponse.concat([function(data, headersGetter) {
            ['day', 'h', 'min'].forEach(function(key) {
                if ($.isArray(data[key])) {
                    d = data[key];
                    //invalid backend data temporary fix
                    // d = data[key].map(function(item) {
                    //     if (item && item > 25000) return item - 32768;
                    //     return item;
                    // });
                    //end of fix
                    d = utils.fixNull(d);
                    data[key] = mapFn ? mapFn(d) : d;
                }
            });
            return data;
        }]);
        return $resource('/sensors/'+name+'.jso', {}, {
            get: {
                method: 'GET',
                transformResponse: transformers
            },
            getMonth: {
                method: 'GET',
                url: '/DATA/'+name.toUpperCase()+'/:year/:month.JSO',
                transformResponse: transformers
            },
            getDay: {
                method: 'GET',
                url: '/DATA/'+name.toUpperCase()+'/:year/:month/:day.JSO',
                transformResponse: transformers
            },
            getHour: {
                method: 'GET',
                url: '/DATA/'+name.toUpperCase()+'/:year/:month/:day/:hour.JSO',
                transformResponse: transformers
            }
        });
    };
}]);

app.factory('SensorHistory', ['$q', 'sensorResourceFactory', 'divisors', 'settings', 'requests', function($q, sensorResourceFactory, divisors, settings, requests) {
    var sensorResources = [];

    settings.sensors.forEach(function(sensor) {
        sensorResources.push({
            name: sensor.resource,
            resource: sensorResourceFactory(sensor.resource, divisors.get(sensor.divisor))
        });
    });

    function load(resourceMethod, queryArgs, callback) {
        sensorResources.forEach(function(sensor) {
            requests.push(function() {
                return sensor.resource[resourceMethod](queryArgs, function(data) {
                    callback(sensor.name, data);
                }).$promise;
            });
        });

    }

    return {
        get: function(queryArgs, callback) {
            return load('get', queryArgs, callback);
        },
        getMonth: function(queryArgs, callback) {
            return load('getMonth', queryArgs, callback);
        },
        getDay: function(queryArgs, callback) {
            return load('getDay', queryArgs, callback);
        },
        getHour: function(queryArgs, callback) {
            return load('getHour', queryArgs, callback);
        }
    };
}]);

app.factory('Relay', ['$resource', '$http', 'settings', 'requests', function($resource, $http, settings, requests) {
    var transformers = $http.defaults.transformResponse.concat([function(data, headersGetter) {
        var history = [];
        for (var ts in data.state) {
            history.push({
                when: moment.unix(ts).zone(settings.tzOffset),
                state: data.state[ts]
            });
        }
        history.sort(function(a, b) { return b.when.valueOf() - a.when.valueOf();});
        data.currentState = history.length === 0 ? 0 : history[0].state;
        data.history = history;
        return data;
    }]);
    return requests.adapt($resource('/sensors/outputs.jso', {}, {
        get: {
            method: 'GET',
            transformResponse: transformers
        },
    }));
}]);