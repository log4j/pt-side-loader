
"use strict";



// Login Controller Content Controller
App.controller('DashboardController',
    function ($scope, $state, $localStorage, $window, UserService, FormService, SocketService, TorrentService, $timeout, $uibModal) {



        $scope.refreshStatsBlock = () => {
            $scope.helpers.uiBlocks('#block-stats', 'state_loading');
            $scope.fetchStatsData().then(res => {
                $scope.helpers.uiBlocks('#block-stats', 'state_normal');
            });
        }

        $scope.fetchStatsData = () => {

            return UserService.getCurrentUser().then(res => {
                return res;
            });
        }

        $scope.refreshStatsBlock();


        $scope.initPTServer = () => {
            SocketService.connectPtSideServer($scope);
        }

        if (SocketService.server.state == 'disconnect') {
            $scope.initPTServer();
        }

        $scope.clickPTServer = () => {
            // initPTServer
            if (SocketService.server.state === 'disconnect') {
                $scope.initPTServer();
            } else {
                $scope.go("layout.user");
            }

        }

        $scope.$watch(function () {
            return SocketService.server.state;
        }, function () {
            console.log(SocketService.server.state);
            $scope.ptState = SocketService.server.state;
        })


        $scope.initTransmission = () => {
            $scope.transmissionState = 'connecting';
            TorrentService.initSession().then(res => {
                console.log(res);

                if (res && res.result) {
                    $scope.transmissionState = 'connected';
                } else {
                    $scope.transmissionState = 'disconnect';
                }
            });
        }

        $scope.clickTransmission = () => {
            // ui-sref="layout.transmission"
            if ($scope.transmissionState === 'disconnect') {
                $scope.initTransmission();
            } else {
                $state.go("layout.transmission");
            }
        }

        if (!TorrentService.sessionId) {

            $scope.initTransmission();
        } else {
            console.log(TorrentService.sessionId);
            $scope.transmissionState = 'connected';
        }


    }
);