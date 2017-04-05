
"use strict";



// Login Controller Content Controller
App.controller('SettingController',
    function ($scope, $state, $localStorage, $window, API_CONFIG, UserService, SocketService, TorrentService, $timeout, $uibModal) {


        var app = require('electron').remote;
        var dialog = app.dialog;

        $scope.configEditMode = false;
        $scope.enableConfigEdit = () => {
            $scope.configEditMode = true;
        }

        $scope.configs = SocketService.loadConfigs();
        $scope.transmissionConfigs = {
            port: API_CONFIG.transmissionPort
        }
        UserService.getCurrentUser().then(res => {
            console.log(res);
            if (res && res.result) {
                $scope.configs.username = res.data.name;
            }
        });

        console.log($scope.configs);


        $scope.startUpdate = () => {
            $scope.configEditMode = true;
        };

        $scope.cancelUpdate = () => {
            $scope.configEditMode = false;
            $scope.configs = SocketService.loadConfigs();
            $scope.transmissionConfigs.port = API_CONFIG.transmissionPort;
        }

        $scope.saveConfigs = () => {


            //validate folders;
            for (let i = $scope.configs.folders.length - 1; i >= 0; i--) {
                if (!$scope.configs.folders[i].label || !$scope.configs.folders[i].value)
                    $scope.configs.folders.splice(i, 1);
            }

            if ($scope.configs.deviceId && $scope.configs.username) {
                $scope.configEditMode = false;
                SocketService.disconnectPtSideServer();
                SocketService.connectPtSideServer($scope);
                SocketService.saveConfigs();
            }
        }

        $scope.addFolder = () => {
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }, folder => {
                console.log(folder);
                if (folder && folder.length) {
                    $scope.configs.folders.push({ label: '', value: folder[0] });
                    $scope.$apply();
                }
            });

        }

        $scope.updateFolder = (f) => {
            console.log(f);

            dialog.showOpenDialog({
                properties: ['openDirectory']
            }, folder => {
                console.log(folder);
                if (folder && folder.length) {
                    f.value = folder[0];
                    $scope.$apply();
                }
            });
        }


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