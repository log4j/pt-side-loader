
"use strict";



// Login Controller Content Controller
App.controller('UserController',
    function ($scope, $state, $localStorage, $window, UserService, FormService, ReportService, $timeout, $uibModal, uuid) {

        $scope.fetchAllUsers = () => {
            return UserService.getAllUsers().then(res => {
                if (res && res.result) {
                    $scope.users = res.data;
                } else {
                    $scope.users = [];
                }
                $scope.page.total = $scope.users.length;
                return res;
            })
        }

        $scope.refreshUserListBlock = () => {
            $scope.helpers.uiBlocks('#block-user-list', 'state_loading');
            $scope.fetchAllUsers().then(res => {
                $scope.helpers.uiBlocks('#block-user-list', 'state_normal');
            });

        }

        $scope.refreshUserListBlock();

        $scope.page = {
            total: 0,
            current: 1,
            perPage: 10,
            change: () => {
            }
        }

        $scope.newUser = {
            type: 'Reporter',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            self: this,
            reset: () => {
                self.type = 'Reporter';
                self.firstName = '';
                self.lastName = '';
                self.email = '';
                self.password = '';
            }
        }

        UserService.getRoles().then(rolesRes => {


        })

        $scope.createNewUer = () => {
            //validate first 

            $scope.helpers.uiBlocks('#block-create-user', 'state_loading');


            UserService.createAccountByAdmin({
                email: $scope.newUser.email,
                password: $scope.newUser.password,
                firstName: $scope.newUser.firstName,
                lastName: $scope.newUser.lastName,
                phone: $scope.newUser.phone,
                createAccount: true
                // avatar: data.avatar,
            }).then(res => {

                if (res && res.result) {
                    UserService.getRoles().then(rolesRes => {

                        let roleId;
                        for (let i = 0; i < rolesRes.data.length; i++) {
                            if (rolesRes.data[i].name === $scope.newUser.type) {
                                roleId = rolesRes.data[i].id;
                            }
                        }

                        if (roleId) {

                            UserService.postUserRole(res.data.user, roleId).then(urRes => {
                                $scope.helpers.uiBlocks('#block-create-user', 'state_normal');
                                $scope.refreshUserListBlock();
                            });

                        } else {
                            $scope.helpers.uiBlocks('#block-create-user', 'state_normal');
                        }

                        $scope.newUser.type = 'Reporter';
                        $scope.newUser.firstName = '';
                        $scope.newUser.lastName = '';
                        $scope.newUser.email = '';
                        $scope.newUser.password = '';
                    });



                } else {
                    $scope.helpers.uiBlocks('#block-create-user', 'state_normal');
                }


                //post relations




            })




            return false;
        }



        jQuery('.js-validation-bootstrap').validate({
            ignore: [],
            errorClass: 'help-block animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function (error, e) {
                jQuery(e).parents('.form-group > div').append(error);
            },
            highlight: function (e) {
                var elem = jQuery(e);

                elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                elem.closest('.help-block').remove();
            },
            success: function (e) {
                var elem = jQuery(e);

                elem.closest('.form-group').removeClass('has-error');
                elem.closest('.help-block').remove();
            },
            rules: {
                'new-user-first-name': {
                    required: true,
                    minlength: 3
                },
                'new-user-last-name': {
                    required: true,
                    minlength: 3
                },
                'new-user-email': {
                    required: true,
                    email: true
                },
                'new-user-password': {
                    required: true,
                    minlength: 5
                },
                'val-confirm-password': {
                    required: true,
                    equalTo: '#val-password'
                },
                'val-select2': {
                    required: true
                },
                'val-select2-multiple': {
                    required: true,
                    minlength: 2
                },
                'val-suggestions': {
                    required: true,
                    minlength: 5
                },
                'val-skill': {
                    required: true
                },
                'val-currency': {
                    required: true,
                    currency: ['$', true]
                },
                'val-website': {
                    required: true,
                    url: true
                },
                'val-phoneus': {
                    required: true,
                    phoneUS: true
                },
                'val-digits': {
                    required: true,
                    digits: true
                },
                'val-number': {
                    required: true,
                    number: true
                },
                'val-range': {
                    required: true,
                    range: [1, 5]
                },
                'val-terms': {
                    required: true
                }
            },
            messages: {
                'val-username': {
                    required: 'Please enter a username',
                    minlength: 'Your username must consist of at least 3 characters'
                },
                'val-email': 'Please enter a valid email address',
                'val-password': {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long'
                },
                'val-confirm-password': {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long',
                    equalTo: 'Please enter the same password as above'
                },
                'val-select2': 'Please select a value!',
                'val-select2-multiple': 'Please select at least 2 values!',
                'val-suggestions': 'What can we do to become better?',
                'val-skill': 'Please select a skill!',
                'val-currency': 'Please enter a price!',
                'val-website': 'Please enter your website!',
                'val-phoneus': 'Please enter a US phone!',
                'val-digits': 'Please enter only digits!',
                'val-number': 'Please enter a number!',
                'val-range': 'Please enter a number between 1 and 5!',
                'val-terms': 'You must agree to the service terms!'
            },
            submitHandler: function () {
                $scope.createNewUer();
            }
        });

    });