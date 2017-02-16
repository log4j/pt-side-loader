(function () {
    'use strict';

    const os = require('os');

    var app = require('electron').remote;
    var dialog = app.dialog;

    angular.module('ptApp', [
        'LocalStorageModule',
        'app.torrent',
        'app.socket'
    ])
        .constant('$CONFIG', {
            port: 9091
        })
        .filter('serverStatus', function () {

            // In the return function, we must pass in a single parameter which will be the data we will work on.
            // We have the ability to support multiple other parameters that can be passed into the filter optionally
            return function (input, optional1, optional2) {

                switch (input) {
                    case ('connecting'):
                        return '正在连接';
                    case ('connected'):
                        return '已连接';
                    case ('disconnect'):
                        return '已断开';
                    default:
                        return '未知';
                }

            }

        })
        .filter('sizeFormat', function () {

            // In the return function, we must pass in a single parameter which will be the data we will work on.
            // We have the ability to support multiple other parameters that can be passed into the filter optionally
            return function (input, optional1, optional2) {
                let unit = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
                let index = 0;

                var size = parseInt(input);

                while (size > 1024) {
                    size = size / 1024;
                    index++;
                }

                return size.toFixed(2) + unit[index];
            }

        })
        .controller('AppController', function ($scope, $http, $CONFIG, torrentService, socketService) {
            console.log('init');
            $scope.name = 'ziting';

            $scope.client = {
                sessionId: '',
                state: 'disconnect',
                deviceId: os.hostname(),
                torrents: []
            }

            $scope.folders = socketService.configs.folders;

            $scope.configEditMode = false;
            $scope.enableConfigEdit = () => {
                $scope.configEditMode = true;
            }

            $scope.saveConfigs = () => {

                socketService.saveConfigs();
                //validate folders;
                for(let i=$scope.folders.length-1;i>=0;i--){
                    if(!$scope.folders[i].label || !$scope.folders[i].value)
                        $scope.folders.splice(i,1);
                }

                if ($scope.configs.deviceId && $scope.configs.username) {
                    $scope.configEditMode = false;
                    socketService.disconnectPtSideServer();
                    socketService.connectPtSideServer($scope);
                }
            }

            $scope.addFolder = () => {
                dialog.showOpenDialog( {
                    properties: ['openDirectory']
                }, folder=>{
                    console.log(folder);
                    if(folder && folder.length){
                        $scope.folders.push({label:'',value:folder[0]});
                        $scope.$apply();
                    }
                });
                
            }

            $scope.updateFolder = (f) => {
                console.log(f);

                dialog.showOpenDialog( {
                    properties: ['openDirectory']
                }, folder=>{
                    console.log(folder);
                    if(folder && folder.length){
                        f.value = folder[0];
                        $scope.$apply();
                    }
                });
            }

            $scope.connectTransmission = () => {
                $scope.client.state = 'connecting';
                torrentService.initSession().then(res => {
                    console.log(res);

                    if (res && res.result) {
                        $scope.client.sessionId = res.data;
                        $scope.client.state = 'connected';

                        //load torrent list
                        torrentService.getTorrentList().then(tRes => {
                            console.log(tRes);
                            if (tRes.result) {
                                $scope.client.torrents = tRes.data;
                            }
                        })

                    } else {
                        $scope.client.sessionId = '';
                        $scope.client.state = 'disconnect';
                    }
                })
            }


            const io = require('socket.io-client')
            var socket = null;

            $scope.ptServer = {
                id: '',
                state: 'disconnect',
            }


            $scope.$watch(function () {
                return socketService.serverUpdated;
            }, function () {
                console.log(socketService.server.state);
                $scope.ptServer.state = socketService.server.state;
                // $scope.$apply();
            })

            $scope.$watch(function () {
                return socketService.configsUpdated;
            }, function () {
                $scope.configs = socketService.configs;
            })

            $scope.connectPtSideServer = () => {
                socketService.connectPtSideServer($scope);
            }

            $scope.connectPtSideServer();

            $scope.connectTransmission();

            $scope.startServer = () => {

                socket = io('http://localhost:4000');

                // server.listen(3000, () => {
                //     console.log('starting !!!!');
                // })
                // console.log('trying to connect');
                // socket = io('http://localhost:4000');
                // console.log('tried');

                // socket.on('welcome', function (data) {
                //     console.log(data);

                //     // Respond with a message including this clients' id sent from the server
                //     socket.emit('i am client', { data: 'foo!', id: data.id });
                // });
                // socket.on('time', function (data) {
                //     console.log(data);
                // });
                // socket.on('error', data => {
                //     console.log(data);
                // });
                // socket.on('message', data => {
                //     console.log(data);
                // });


            }

            $scope.message = () => {
                if (socket) {
                    socket.emit('ferret', 'tobi', function (data) {
                        console.log(data); // data will be 'woot'
                    });
                }

            }

            $scope.getTorrentList = () => {

            }
        })
        .run(function () {
            console.log('runnn');
        });

})();