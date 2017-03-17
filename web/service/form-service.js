(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('FormService', FormService);

    /* @ngInject */
    function FormService($q, $http, $$http, API_CONFIG) {

        var service = this;

        service.getForms = () => {
            return $$http.get('form/template');
        }

        service.getAssignmentsByForm = (formId) => {
            return $$http.get('form/assignment?form=' + formId);
        }

        service.postAssignment = (userId, formId) => {
            return $$http.post('form/assignment', {
                target: userId,
                formId: formId
            });
        }


        service.getFormTemplate = (formId) => {
            return $$http.get('form/template/' + formId);
        }

        service.updateAssignmentStatus = (assignment, status) => {
            return $$http.post('form/assignment/' + assignment + '/status', {
                status: status
            });
        }

        return service;

    }
})();