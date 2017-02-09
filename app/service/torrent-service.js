(function () {
    'use strict';

    angular
        .module('app.torrent', [])
        .factory('torrentService', function ($CONFIG, $http) {
            console.log('torrent service init');

            var service = this;

            service.sessionId = '';


            service.updateUrl = () => {
                service.url = 'http://127.0.0.1:' + $CONFIG.port + '/transmission/rpc';
            }

            service.updateUrl();

            service.updatePort = (port) => {
                $CONFIG.port = port;
                service.updateUrl();
            }

            service.initSession = () => {
                return $http.post(service.url, {
                    method: 'session-get'
                }).then(res => {
                    service.sessionId = res.headers('X-Transmission-Session-Id');
                    return { result: !(!service.sessionId), data:service.sessionId }
                }, res => {
                    service.sessionId = res.headers('X-Transmission-Session-Id');
                    return { result: !(!service.sessionId), data:service.sessionId }
                })
            }

            service.getTorrentList = ()=>{
                return $http.post(service.url, {
                    method: 'torrent-get',
                    arguments: {
                        fields:[
                            'id','name','status','totalSize'
                        ]
                    }
                },{
                    headers: {
                        'X-Transmission-Session-Id': service.sessionId
                    }
                }).then(res => {
                    console.log(res);
                    return { result: true, data: res.data.arguments.torrents};
                }, res => {
                    return { result: false }
                })
            }

            return service;

        });
})();
