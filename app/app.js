(function () {
    'use strict';

    angular.module('ptApp', [
        'app.torrent'
    ])
        .constant('$CONFIG', {
            port: 9091
        })
        .controller('AppController', function ($scope, $http, $CONFIG, torrentService) {
            console.log('init');
            $scope.name = 'ziting';

            $scope.client = {
                sessionId: '',
                state: 'disconnect',
                torrents: []
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

            $scope.connectPtSideServer = () => {
                $scope.ptServer.state = 'connecting';
                socket = io('http://localhost:4000');

                socket.on('credentials_require', data => {
                    console.log(data);
                    socket.emit('credentials_verify', {
                        username: 'ziting',
                        password: '1234'
                    });
                });

                socket.on('credentials_confirmed', data => {
                    console.log(data);
                    if (data && data.result) {
                        $scope.ptServer.state = 'connected';
                        $scope.ptServer.id = data.data;
                        $scope.$apply();
                    }
                })
                socket.on('welcome', function (data) {
                    console.log(data);

                    // Respond with a message including this clients' id sent from the server
                    socket.emit('i am client', { data: 'foo!', id: data.id });
                });
                socket.on('time', function (data) {
                    console.log(data);
                });
                socket.on('error', data => {
                    console.log(data);
                });
                socket.on('message', data => {
                    console.log(data);
                });

                socket.on('fetch_torrents',(data, fn)=>{
                    console.log(data);
                    // fn(['a','b']);

                    torrentService.getTorrentList().then(res=>{
                        fn(res.data);
                    });

                });

                socket.on('disconnect', function () {
                    console.log('user disconnected');
                    $scope.ptServer.state = 'disconnect';
                    $scope.ptServer.id = '';
                    $scope.$apply();
                });
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