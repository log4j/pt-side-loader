(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('DemoService', DemoService);

    /* @ngInject */
    function DemoService($q, $http, $$http, API_CONFIG) {

        var service = this;

        return service;

    }
})();