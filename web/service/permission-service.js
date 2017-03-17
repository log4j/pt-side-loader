(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('PermissionService', PermissionService);

    /* @ngInject */
    function PermissionService($q, $http, $timeout, $$http, API_CONFIG) {
        //RoleStore

        var service = this;


        service.permissions = null;

        service.fetchPermissions = () => {
            if (service.permissions) {
                return $timeout(() => {
                    return { result: true, data: service.permissions };
                })
            } else {

                return $$http.get('permission').then(res => {
                    if (res.result) {
                        service.permissions = res.data;
                    }
                    return res;
                })
            }
        }



        service.login = function (data) {

            return $$http.post('login', {
                credentials: data.email + '@email',
                password: data.password
            });
        }


        service.generateDocument = function (data) {
            return $$http.postToDownload('document', data);
        };


        service.clearPermissions = function () {
            service.permissions = null;
        }

        return service;
    }
})();