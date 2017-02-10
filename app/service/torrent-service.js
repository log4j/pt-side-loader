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

            service.recheckSession = function(res){
                if(res.status===409){
                    service.sessionId = res.headers('X-Transmission-Session-Id');
                    if(service.sessionId)
                        return true;
                    else
                        return false;
                }
                return false;
            }

            service.initSession = () => {
                return $http.post(service.url, {
                    method: 'session-get'
                }).then(res => {
                    service.sessionId = res.headers('X-Transmission-Session-Id');
                    return { result: !(!service.sessionId), data:service.sessionId }
                }, res => {
                    console.log(res);
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
                    if(service.recheckSession(res))
                        return service.getTorrentList();
                    else
                        return { result: false }
                })
            }

            service.postTorrent = (data)=>{
                return $http.post(service.url, {
                    method: 'torrent-add',
                    arguments: {
                        metainfo:data.torrent
                    }
                },{
                    headers: {
                        'X-Transmission-Session-Id': service.sessionId
                    }
                }).then(res => {
                    console.log(res);
                    return { result: true, data: res.data};
                }, res => {
                    if(service.recheckSession(res))
                        return service.postTorrent(data);
                    else
                        return { result: false }
                })
            }

            return service;

        });
})();
