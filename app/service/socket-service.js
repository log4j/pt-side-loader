(function () {
    'use strict';

    const os = require('os');

    angular
        .module('app.socket', ['app.torrent', 'LocalStorageModule'])
        .factory('socketService', function ($CONFIG, $http, TorrentService, localStorageService) {
            console.log('torrent service init');

            var service = this;



            this.url = 'http://word.mangs.site:5000';

            this.configs = {
                deviceId: os.hostname(),
                username: 'yangmang',
                password: 'not used',
                folders: [{
                    label: 'Movie',
                    value: 'E:/download'
                }]
            };

            this.server = {
                state: '',
                id: ''
            }
            this.serverUpdated = null;


            this.loadConfigs = () => {
                let configs = localStorageService.get('configs');
                if (configs) {
                    this.configs = configs;
                }
            }

            this.saveConfigs = () => {
                localStorageService.set('configs', service.configs);
            }



            this.loadConfigs();

            const io = require('socket.io-client');
            this.socket = null;

            this.connectPtSideServer = ($scope) => {
                service.socket = io(service.url);
                service.server.state = 'connecting';

                service.socket.on('credentials_require', data => {
                    console.log(data);
                    service.socket.emit('credentials_verify', {
                        username: service.configs.username,
                        password: service.configs.password,
                        device: service.configs.deviceId,
                        folders: service.configs.folders
                    });
                });

                service.socket.on('credentials_confirmed', data => {
                    console.log(data);
                    if (data && data.result) {

                        service.server.state = 'connected';
                        service.server.id = data.data;
                        service.serverUpdated = new Date();
                        console.log('updated!!!!');
                        $scope.$apply();
                    }
                })
                service.socket.on('welcome', function (data) {
                    console.log(data);

                    // Respond with a message including this clients' id sent from the server
                    service.socket.emit('i am client', { data: 'foo!', id: data.id });
                });
                service.socket.on('time', function (data) {
                    console.log(data);
                });
                service.socket.on('error', data => {
                    console.log(data);
                });
                service.socket.on('message', data => {
                    console.log(data);
                });

                service.socket.on('fetch_torrents', (data, fn) => {
                    console.log(data);
                    // fn(['a','b']);

                    TorrentService.getTorrentList().then(res => {
                        fn(res.data);
                    });

                });

                service.socket.on('post_torrent', (data, fn) => {
                    console.log('post_torrent', data);
                    // fn(['a','b']);
                    TorrentService.postTorrent(data).then(res => {
                        fn(res.data);
                    });
                });



                service.socket.on('disconnect', function () {
                    console.log('user disconnected');
                    service.server.state = 'disconnect';
                    service.server.id = '';
                    // $scope.$apply();
                });
            }

            this.disconnectPtSideServer = () => {
                if (this.socket) {
                    this.socket.disconnect(true);
                }
            }

            return service;

        });
})();
