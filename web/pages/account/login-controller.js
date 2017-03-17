
"use strict";



// Login Controller Content Controller
App.controller('LoginController',
    function ($scope, $state, $localStorage, $window, UserService) {
        // ('login');
        // UserService.getCurrentUser().then(res => {
        //     if (res && res.result) {
        //         $state.go('layout.dashboard');
        //     } else {
        //         $scope.helpers.uiLoader('hide');
        //     }
        // });

        $scope.data = {
            username: '',
            password: ''
        }

        $scope.helpers.uiLoader('show');
        UserService.prepareLogin().then(res => {
            if (res && res.result) {
                $scope.siteData = res.data;
                $scope.data.checkcode = res.data.checkcode
            }
            console.log(res);
        })

        $scope.submitLogin = () => {
            UserService.login($scope.data.username, $scope.data.password, $scope.data.checkcode).then(res => {
                if (res && res.result) {
                    $state.go('layout.dashboard');
                }
            });
        }


    }
);