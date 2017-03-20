
"use strict";



// Login Controller Content Controller
App.controller('TransmissionController',
    function ($scope, $state, $localStorage, $window, UserService, TorrentService, $timeout, $uibModal) {



        $scope.refreshBlock = () => {
            $scope.helpers.uiBlocks('#block-stats', 'state_loading');
            $scope.fetchStatsData().then(res => {
                $scope.helpers.uiBlocks('#block-stats', 'state_normal');
            });
        }

        $scope.fetchStatsData = () => {

            return TorrentService.getTorrentList().then(res => {
                console.log(res);
                if (res.result) {
                    $scope.torrents = res.data;
                }
                return res;
            });
        }



        $scope.connectTransmission = () => {
            TorrentService.initSession().then(res => {
                if (res && res.result) {
                    //load torrent list
                    $scope.refreshBlock();
                }
            })
        }

        $scope.connectTransmission();

    }
);