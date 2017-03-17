(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('UserService', UserService);


    function User(data) {
        //     this.name;
        // id: string;
        // url: string;

        // uploaded: string;
        // downloaded: string;
        // shareRate: number;

        // uploading: number;
        // downloading: number;

        // level: string;
        // accessable: boolean;

        // bonus: number;

        // logOutLink: string;

        // console.log(data);
        if (data && data.tagName == 'table') {
            this.name = data.children["0"].children["0"].children["0"].children["0"].children["0"].children["0"].text;
            this.url = data.children["0"].children["0"].children["0"].children["0"].children["0"].href;
            this.id = this.url.substring(19);

            this.level = data.children["0"].children["0"].children["0"].children[2].children["0"].children["0"].text;
            if (this.level)
                this.level = this.level.match(/(\d|\.|\s|\w)+/g)[0];

            let shareRate = data.children["0"].children["0"].children["0"].children[2].children[1].children["0"].text;
            if (shareRate)
                shareRate = shareRate.match(/(\d|\.|\s|\w)+/g)[0];
            this.shareRate = parseFloat(shareRate);

            this.uploaded = data.children["0"].children["0"].children["0"].children[2].children[2].children["0"].text;
            if (this.uploaded)
                this.uploaded = this.uploaded.match(/(\d|\.|\s|\w)+/g)[0];

            this.downloaded = data.children["0"].children["0"].children["0"].children[2].children[3].children["0"].text;
            if (this.downloaded)
                this.downloaded = this.downloaded.match(/(\d|\.|\s|\w)+/g)[0];


            let titles = data.children["0"].children[1].children;
            if (titles.length) {
                this.logOutLink = titles[titles.length - 1].children[0].href;
            }


            let bonus = data.children["0"].children[1].children;

            bonus.forEach(item => {
                if (item.children && item.children.length && item.children[0].href == '/mybonus.php') {
                    let value = item.children["0"].text;
                    this.bonus = parseInt(
                        value.substring(value.indexOf('(') + 1, value.indexOf(')')));
                    // console.log(value, value.substring(value.indexOf('(')+1, value.length-1), this.bonus);
                }
            });


        }

        return this;


    }

    /* @ngInject */
    function UserService($q, $http, $$http, API_CONFIG, uuid, PermissionService) {
        //RoleStore

        var service = this;


        service.currentUser = {
        };




        ///////////////

        service.getCurrentUser = function () {
            var deferred = $q.defer();
            if (service.currentUser && service.currentUser.id) {

                deferred.resolve({ result: true, data: service.currentUser });

            } else {

                $$http.getHtml('index.php', { endPoint: 'https://pt.sjtu.edu.cn/' }).then(res => {

                    let body = $$http.findElement(res, item => {
                        return item.tagName === 'table' && item.id === "userbar";
                    });
                    if (body) {
                        //login!!
                        service.currentUser = service.parseIndexPage(res);

                        deferred.resolve({ result: true, data: service.currentUser });
                    } else {
                        deferred.resolve({ result: false });
                    }
                });
            }

            return deferred.promise;

        }

        service.findUserByEmail = function (email) {
            return $$http.get('user?credentialType=email&credentialValue=' + email);
        }


        service.register = function (data) {
            return $$http.post('user', {
                name: data.name,
                email: data.email,
                password: data.password
            });
        }

        service.logout = function () {
            service.currentUser = null;
            PermissionService.clearPermissions();
            return $$http.get('logout');
        }

        service.testState = function () {
            return $$http.get('user');
        }

        service.getUsers = function () {
            return $http.get('app/services/permission/data/users.json');
        }

        service.hasPermission = function (permission) {
            var deferred = $q.defer();
            var hasPermission = false;

            // service
            service.getCurrentUser().then(function (res) {
                if (res && res.result) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })

            return deferred.promise;
        }




        service.hasPermission2 = function (permission) {
            let deferred = $q.defer();
            let hasPermission = false;

            $$http.getHtml('index.php', { endPoint: 'https://pt.sjtu.edu.cn/' }).then(res => {
                console.log(res);

                let body = $$http.findElement(res, item => {
                    return item.tagName === 'table' && item.id === "userbar";
                });
                console.log(body);
                if (body) {
                    //login!!
                    deferred.resolve();
                } else {
                    service.prepareLogin(body).then(loginRes => {
                        console.log(loginRes);
                    })
                    deferred.reject();
                }
            });

            return deferred.promise;
        }


        service.prepareLogin = (body) => {
            let process = (data) => {
                if (data) {
                    let checkcodeNeeded = false;
                    let checkcodeUrl = '';
                    let checkcodeValue = '';
                    let checkcode = $$http.findElement(data, item => {
                        return item.tagName === 'input' && item.name === 'checkcode';
                    });
                    if (checkcode && checkcode.value) {
                        //already has value, no check needed
                        checkcodeValue = checkcode.value;
                    } else {
                        //need checkcode!!!
                        let checkCodeImg = $$http.findElement(data, item => {
                            return item.tagName === 'img' && item.alt === '验证码';
                        });
                        if (checkCodeImg) {
                            checkcodeUrl = $$http.host + checkCodeImg.src;
                            checkcodeNeeded = true;
                        }
                    }

                    return {
                        result: true, data: {
                            checkcodeNeeded: checkcodeNeeded,
                            checkcodeUrl: checkcodeUrl,
                            checkcode: checkcodeValue
                        }
                    }
                } else {
                    return { result: false };
                }
            }
            if (body) {
                return new Promise(resolve => {
                    resolve(process(body));
                });
            } else {
                return $$http.getHtml('login.php', { endPoint: 'https://pt.sjtu.edu.cn/' }).then(process);
            }
        }

        service.login = function (username, password, checkcode) {

            let body = {
                'username': username,
                'password': password,
                'checkcode': checkcode
            }

            let url = 'takelogin.php';
            // let url = 'http://localhost:8080/https://pt.sjtu.edu.cn/takelogin.php';

            return $$http.postHtml(url, body, { endPoint: 'https://pt.sjtu.edu.cn/' }).then(data => {
                console.log(data);
                if (data) {
                    let errorWord = $$http.findElement(data, item => {
                        return item.text === '登录失败！';
                    })
                    console.log(errorWord);


                    if (errorWord && errorWord.tagName) {

                        let checkcodeError = $$http.findElement(data, item => {
                            return item.tagName === 'td' && item.text && item.text.indexOf('请输入正确的验证码') >= 0
                        });
                        console.log(checkcodeError);
                        if (checkcodeError && checkcodeError.tagName) {
                            return { user: null, error: '请输入正确的验证码!' };
                        } else {
                            return { user: null, error: '用户名或密码不正确!或者你还没有通过验证!' };
                        }

                    } else {
                        return service.parseIndexPage(data);
                    }
                } else {
                    return { user: null, error: '无法连接到葡萄服务器,请稍后尝试...' };
                }



            })


            // return $$http.post('login', {
            //     credentials: data.email + '@email',
            //     password: data.password
            // });
        }

        service.parseIndexPage = (data) => {
            let body = $$http.findElement(data, item => {
                return item.tagName === 'table' && item.id === "userbar";
            });
            return new User(body)
        }

        service.generateDocument = function (data) {
            return $$http.postToDownload('document', data);
        };

        service.createAccountByAdmin = function (data) {
            let body = {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                avatar: data.avatar,
                createAccount: true
            }

            if (data.createAccount) {
                body.credentialType = 'email';
            } else {
                body.credentialType = 'token';
                body.token = uuid.v4();
            }

            return $$http.post('user', body);

        }

        service.getAllUsers = () => {
            return $$http.get('admin/user');
        }

        service.roles = null;
        service.getRoles = () => {
            if (service.roles) {
                return new Promise(resolve => {
                    resolve({ result: true, data: service.roles });
                })
            } else {
                return $$http.get('role').then(res => {
                    if (res && res.result)
                        service.roles = res.data;
                    return res;
                })
            }
        }

        service.postUserRole = (user, role) => {
            return $$http.post('role/user', {
                user: user,
                role: role
            });
        }

        service.removeUser = () => {

        }

        service.getStats = () => {
            return $$http.get('stats');
        }

        return service;
    }
})();