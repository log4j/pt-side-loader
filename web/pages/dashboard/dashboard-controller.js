
"use strict";



// Login Controller Content Controller
App.controller('DashboardController',
    function ($scope, $state, $localStorage, $window, UserService, FormService, SocketService, $timeout, $uibModal) {



        $scope.refreshStatsBlock = () => {
            $scope.helpers.uiBlocks('#block-stats', 'state_loading');
            $scope.fetchStatsData().then(res => {
                $scope.helpers.uiBlocks('#block-stats', 'state_normal');
            });
        }

        $scope.fetchStatsData = () => {

            return UserService.getCurrentUser().then(res => {
                console.log(res);
                return res;
            });
        }

        $scope.refreshStatsBlock();


        SocketService.connectPtSideServer($scope);

    }
);