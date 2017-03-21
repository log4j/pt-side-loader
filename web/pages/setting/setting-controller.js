
"use strict";



// Login Controller Content Controller
App.controller('SettingController',
    function ($scope, $state, $localStorage, $window, UserService, SocketService, TorrentService, $timeout, $uibModal) {



        $scope.configEditMode = false;
        $scope.enableConfigEdit = () => {
            $scope.configEditMode = true;
        }

        $scope.configs = SocketService.loadConfigs();

        UserService.getCurrentUser().then(res => {
            console.log(res);
            if (res && res.result) {
                $scope.configs.username = res.data.name;
            }
        });

        console.log($scope.configs);
        $scope.saveConfigs = () => {

            SocketService.saveConfigs();
            //validate folders;
            for (let i = $scope.folders.length - 1; i >= 0; i--) {
                if (!$scope.folders[i].label || !$scope.folders[i].value)
                    $scope.folders.splice(i, 1);
            }

            if ($scope.configs.deviceId && $scope.configs.username) {
                $scope.configEditMode = false;
                SocketService.disconnectPtSideServer();
                SocketService.connectPtSideServer($scope);
            }
        }

        $scope.addFolder = () => {
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }, folder => {
                console.log(folder);
                if (folder && folder.length) {
                    $scope.folders.push({ label: '', value: folder[0] });
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