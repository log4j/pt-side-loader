(function () {
    'use strict';

    angular
        .module('app.filters')
        .filter('name', function () {
            return function (item, type) {

                let name = '';

                if (item) {
                    if (item.first_name || item.last_name) {
                        name = (item.first_name ? item.first_name : '') + ' ' + (item.last_name ? item.last_name : '');
                    }
                    if (item.firstName || item.lastName) {
                        name = (item.firstName ? item.firstName : '') + ' ' + (item.lastName ? item.lastName : '');
                    }
                    if (item.name && item.name.trim())
                        name = item.name;
                }

                if (type === 'email' && item.email) {
                    name += ' (' + item.email + ')'
                }
                return name;
            };
        })
        .filter('acceptFile', function () {
            return function (item) {

                switch (item) {
                    case ('pdf'):
                        return '.pdf';
                    case ('image'):
                        return 'image/*';
                    case ('audio'):
                        return 'audio/*';
                    case ('video'):
                        return 'video/*';
                    case ('document'):
                        return '.doc,.docx';
                    default:

                        return '.' + item;
                }
                return '.' + item;
            };
        })
})();