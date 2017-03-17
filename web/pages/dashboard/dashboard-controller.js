
"use strict";



// Login Controller Content Controller
App.controller('DashboardController',
    function ($scope, $state, $localStorage, $window, UserService, FormService, $timeout, $uibModal) {


        $scope.templates = [];

        FormService.getForms().then(res => {
            if (res && res.result) {
                $scope.templates = res.data;
            }
        })

        $scope.onUnauthorized = () => {
        }

        $scope.refreshStatsBlock = () => {
            $scope.helpers.uiBlocks('#block-stats', 'state_loading');
            $scope.fetchStatsData().then(res => {
                $scope.helpers.uiBlocks('#block-stats', 'state_normal');
            });
        }

        $scope.fetchStatsData = () => {

            return UserService.getStats().then(res => {
                $scope.stats = {};
                if (res && res.result) {
                    for (let i = 0; i < res.data.length; i++) {
                        $scope.stats[res.data[i].type] = res.data[i].number;
                    }
                }
                console.log($scope.stats);
                return res;
            });
        }

        $scope.refreshStatsBlock();


        $scope.toggleForm = function (form, $event) {

            if ($($event.toElement).is('button'))
                return;

            form.open = !form.open;

            if (form.open) {
                $scope.loadAssignments(form);
            } else {
                form.assignments = null;
            }
            // if (!form.assignments) {

            // }
        }

        $scope.assignForm = function (form) {
            form.open = true;

            if (!form.assignments) {
                $scope.loadAssignments(form);
            }


            // let modalInstance = $uibModal.open({
            //     animation: 'popin',
            //     templateUrl: 'pages/dashboard/assign-modal.html',
            //     size: '',
            //     windowClass: 'modal-dialog-popin',
            //     controller: function ($scope) {
            //         $scope.name = 'bottom';
            //     }
            // })

            form.assign = {
                type: 'new',
                email: '',
                firstName: '',
                lastName: ''
            }
        }

        $scope.submitAssignment = function (form) {

            form.assign.isSaving = true;
            let assign = form.assign;
            let finshAssign = (userId, formId) => {
                FormService.postAssignment(userId, formId).then(res => {
                    form.assign = null;

                    $scope.loadAssignments(form);
                })
            }

            if (assign.type === 'new') {
                //try to create account 
                UserService.createAccountByAdmin(assign).then(res => {
                    if (res.result) {
                        //account created!!
                        //userId: res.data.user
                        finshAssign(res.data.user, form.id);
                    } else if (res.err === 'Credentials Already Exist') {
                        //look up the user id
                        UserService.findUserByEmail(assign.email).then(userRes => {
                            if (userRes && userRes.result) {
                                finshAssign(userRes.data, form.id);
                            }
                        })
                    }
                    else {
                        //show error

                        form.assign.isSaving = true;
                    }
                })
            }
            else {
                //user id in assign.user
                finshAssign(assign.user, form.id);
            }
        }

        $scope.printAssign = function (form) {
        }

        $scope.assignFormCancel = function (form) {
            form.assign = null;
        }

        $scope.loadAssignments = function (form) {
            FormService.getAssignmentsByForm(form.id).then(res => {
                if (res && res.data) {
                    form.assignments = res.data;
                } else {
                    form.assignments = [];
                }
            })
        }

    }
);