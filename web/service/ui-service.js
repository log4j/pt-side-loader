(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('UiService', UiService);

    /* @ngInject */
    function UiService($q, $http, $$http, API_CONFIG) {

        var service = this;

        this.toast = (message, type) => {

            jQuery.notify(
                {
                    icon: "fa fa-check",
                    message: message,
                    url: ''
                },
                {
                    element: 'body',
                    type: type ? type : "success",
                    allow_dismiss: true,
                    newest_on_top: true,
                    showProgressbar: false,
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    offset: 20,
                    spacing: 10,
                    z_index: 1033,
                    delay: 5000,
                    timer: 1000,
                    animate: {
                        enter: 'animated fadeIn',
                        exit: 'animated fadeOutDown'
                    }
                });

        }

        return this;
    }
})();

