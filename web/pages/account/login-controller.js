
"use strict";



// Login Controller Content Controller
App.controller('LoginController',
    function ($scope, $state, $localStorage, $window, UserService, UiService) {
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
            password: '',
            checkcode: ''
        }

        $scope.helpers.uiLoader('show');


        $scope.prepareLogin = () => {
            UserService.prepareLogin().then(res => {
                if (res && res.result) {
                    $scope.siteData = res.data;
                    $scope.data.checkcode = res.data.checkcode

                }
                console.log(res, $scope.siteData);
                $scope.$apply();
            })
        }

        $scope.prepareLogin();

        $scope.submitLogin = () => {
            if ($scope.data.username && $scope.data.password && $scope.data.checkcode) {
                UserService.login($scope.data.username, $scope.data.password, $scope.data.checkcode).then(res => {
                    if (res && res.result) {
                        $state.go('layout.dashboard');
                    } else {
                        UiService.toast(res.err, 'danger');
                    }
                    console.log(res);
                });
            } else {
                UiService.toast('请填写登录信息!', 'info');
            }

        }


    }
);