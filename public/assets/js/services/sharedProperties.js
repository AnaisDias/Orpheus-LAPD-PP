angular.module('app.controllers', [])
    .service('sharedProperties', function() {
        var property = new Date();

        return {
            getProperty: function() {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    });
