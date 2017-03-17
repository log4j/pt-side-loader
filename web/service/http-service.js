(function () {
    'use strict';

    angular
        .module('app.services', [])
        .config(function ($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .factory('$$http', function (API_CONFIG, $http) {

            var $$http = this;

            var commonResponseHandler = function (res) {
                if (res.status >= 200 && res.status < 400 && res.data) {
                    if (res.data.result == false) {
                        return { result: false, err: res.data.err }
                    }
                    else if (res.data.result == true) {
                        return res.data;
                    }

                    if (res.data.success == false) {
                        return { result: false, err: res.data };
                    }

                    if (res.data.success == true) {
                        return { result: true, data: res.data };
                    }

                    return { result: true, data: res.data };
                } else {
                    return { result: false };
                }
            };
            var errResponseHandler = function (res) {
                return {
                    result: false,
                    err: 'Server error:' + res.status
                };
            };

            $$http.toUrl = (action, options) => {
                let url = ((options && options.endPoint) ? options.endPoint : API_CONFIG.host) + "/" + action;
                url = url.replace(/\/(\/)*/gi, "\/").replace(/:\//gi, ":\/\/");
                return url;
            }

            $$http.get = function (action, paraData, options) {
                let url = $$http.toUrl(action, options);
                if (paraData) {
                    var suffix = "";
                    for (var key in paraData) {
                        suffix += ((suffix === "") ? "?" : "&") + key + "=" + paraData[key];
                    }
                    url += suffix;
                }
                return $http.get(url, options).then(commonResponseHandler, errResponseHandler);
            };

            $$http.post = function (action, postData, options) {


                return $http.post($$http.toUrl(action, options), postData, options).then(commonResponseHandler, errResponseHandler);
            }

            $$http.put = function (action, postData, options) {


                return $http.put($$http.toUrl(action, options), postData, options).then(commonResponseHandler, errResponseHandler);
            }

            $$http.delete = function (action, postData, options) {
                return $http.delete($$http.toUrl(action, options), { data: postData }).then(commonResponseHandler, errResponseHandler);
            }

            $$http.postMultipartFormData = function (action, postData, options) {
                var data = new FormData();
                for (var i = 0; i < postData.length; i++) {
                    data.append(postData[i].key, postData[i].value);
                }
                return $http.post($$http.toUrl(action, options), data, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(commonResponseHandler, errResponseHandler);
            }

            $$http.postToDownload = function (action, postData, options) {
                return $http.post(
                    $$http.toUrl(action, options),
                    postData,
                    { responseType: 'arraybuffer' }
                ).then(function (response) {

                    var header = response.headers('Content-Disposition');
                    var fileName = 'test.docx';
                    if (header && header.indexOf('filename=') >= 0) {
                        fileName = header.substring(header.indexOf('filename=') + 9);
                    }
                    var blob = new Blob(
                        [response.data],
                        {
                            type: response.headers('Content-Type')
                        });


                    if (window.navigator.msSaveOrOpenBlob) { // For IE:
                        navigator.msSaveBlob(blob, fileName);
                    } else { // For other browsers:
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = fileName;
                        link.click();
                        window.URL.revokeObjectURL(link.href);
                    }

                    return { result: true };
                    // this.save();
                },
                    function (response) {
                    });

            }



            $$http.parseHtml = function (text, callback) {


                let html = text.replace(/>(\s|\r|\n)+</g, '><');
                let root = {};
                let current = root;
                let parent = root;
                let parser = new Parser.Parser({
                    onopentag: function (tagName, attribs) {
                        current = {
                            tagName: tagName,
                            parent: parent
                        };
                        for (let key in attribs)
                            current[key] = attribs[key];

                        if (!parent.children)
                            parent.children = [];
                        parent.children.push(current);

                        parent = current;

                    },
                    ontext: function (text) {
                        //console.log(text);
                        if (!current.text)
                            current.text = text;
                        else
                            current.text += ' ' + text;

                        if (!current.children)
                            current.children = [];
                        current.children.push({
                            tagName: 'text',
                            value: text
                        });
                    },
                    onclosetag: function (tagname) {
                        parent = current.parent;
                        current = parent;
                    },
                    onend: function () {
                        let removeParent = function (node) {
                            if (node.parent)
                                delete node.parent;
                            if (node.children) {
                                // node.children.forEach(child=>{
                                //   removeParent(child);
                                // })
                                let excludeMap = {
                                    'script': true,
                                    'link': true,
                                    'meta': true
                                }
                                for (let i = node.children.length - 1; i >= 0; i--) {
                                    //remove 'script', 'link', 'meta'
                                    if (excludeMap[node.children[i].tagName]) {
                                        node.children.splice(i, 1);
                                        continue;
                                    }
                                    removeParent(node.children[i]);
                                }
                            }
                        }
                        removeParent(root);
                        callback(root);
                    },
                    onerror: function () {
                        callback({});
                    }
                }, { decodeEntities: true });

                parser.write(html);
                parser.end();

            }

            $$http.findElement = (node, isThatOne) => {
                if (node) {
                    let list = [];
                    list.push(node);

                    while (list.length) {
                        let item = list.pop();
                        if (isThatOne(item)) {
                            return item;
                        }
                        //push every child into list
                        if (item.children) {
                            item.children.forEach(child => list.push(child));
                        }

                    }
                    return null;
                }
                return null;
            }

            $$http.getHtml = (action, options) => {
                let url = $$http.toUrl(action, options)
                return new Promise(resolve => {
                    $http.get(url, { withCredentials: true })
                        .then(
                        response => {
                            $$http.parseHtml(response.data, resolve)
                        },
                        error => {
                            // alert(error);
                            resolve(null);
                        });
                });

            }

            $$http.postHtml = (action, postBody, options) => {
                let url = $$http.toUrl(action, options)

                let body = new URLSearchParams();
                for (let key in postBody)
                    body.set(key, postBody[key]);

                let headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                return new Promise(resolve => {
                    // $http.post(url, body.toString(), { headers: headers, withCredentials: true })
                    $http({
                        method: 'POST',
                        url: url,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: postBody
                    })
                        .then(
                        response => {
                            $$http.parseHtml(response.data, resolve)
                        },
                        error => resolve(null)
                        );
                });
            };

            return $$http;

        })
        /**
         * service for track user session,
         * if user has no action for 10 minutes, pop up a modal to ask them if they need more time
         */
        .service('ServiceInterceptor', function () {
            var service = this;

            /**
             * intercept the response,
             * once a request is finished, we update the last call date
             * @param config
             * @returns {*}
             */
            service.response = function (config) {
                // var currentUser = UserService.getCurrentUser(),
                //     access_token = currentUser ? currentUser.access_token : null;
                //
                // if (access_token) {
                //     config.headers.authorization = access_token;
                // }

                // console.log('get response', config);

                //console.log(service.getLastTime());


                service.lastCall = new Date();


                return config;
            };


            service.responseError = function (response) {
                // if (response.status === 401) {
                //     $rootScope.$broadcast('unauthorized');
                // }
                // console.log(service.getLastTime());


                return response;
            };

            /**
             * calculate when the last call received
             * @returns {number}
             */
            service.getLastTime = function () {
                if (service.lastCall)
                    return ((new Date()).getTime() - service.lastCall.getTime());
                else
                    return 1000 * 60 * 30;
            };

            /**
             * update the last call time manually
             */
            service.keepMeIn = function () {
                //TODO: we should send a call to backend service to make sure that the session will keep alive in backend while we manually extends the session time on front end.
                service.lastCall = new Date();
            };

            return service;

        });
})();