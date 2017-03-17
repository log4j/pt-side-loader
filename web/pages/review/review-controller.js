"use strict";



// Login Controller Content Controller
App.controller('ReviewController',
    function ($scope, $state, $localStorage, $window, UserService, FormService, ReportService, $timeout, $uibModal, uuid) {




        $scope.fetchReports = () => {
            return ReportService.getReportListForReview().then(res => {
                if (res && res.result) {
                    $scope.reports = res.data;
                } else {
                    $scope.reports = [];
                }
                return res;
            })
        }
        $scope.fetchReports();
        // jQuery('.js-dataTable-full').dataTable({
        //     columnDefs: [{ orderable: false, targets: [4] }],
        //     pageLength: 10,
        //     lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]]
        // });

        $scope.refreshBlock = () => {
            $scope.helpers.uiBlocks('#block_1', 'state_loading');
            $scope.fetchReports().then(res => {
                $scope.helpers.uiBlocks('#block_1', 'state_normal');
            });
        }

        $scope.toggleReportListBlock = () => {
            $scope.helpers.uiBlocks('#block_1', 'content_toggle');
        }



        $scope.toggleAssignment = function (assignment, $event) {

            if ($($event.toElement).is('button'))
                return;

            assignment.open = !assignment.open;
            if (!assignment.reports) {
                $scope.loadReports(assignment);
            }
        }

        $scope.createNewDraft = function (assignment) {
            //TODO

            $state.go('layout.report', { assignmentId: btoa(assignment.id), formId: btoa(assignment.formId), reportId: 'new' });
        }

        $scope.editReport = function (report) {
            $state.go('layout.report', { formId: btoa(report.formId), reportId: btoa(report.id) });
        }

        $scope.viewReport = function (report) {
            $state.go('layout.report-view', { formId: btoa(report.formId), reportId: btoa(report.id) });
        }

        $scope.submitReport = function (report) {
            ReportService.updateReportStatus(report.id, 'submit').then(res => {
                // $scope.loadReports(assignment);
                $scope.refreshBlock();
            });

            // FormService.updateAssignmentStatus(assignment.id, 'finished');

        }

        $scope.loadReports = function (assignment) {
            ReportService.getReportsByAssignmentId(assignment.id).then(res => {
                if (res && res.data) {
                    assignment.reports = res.data;
                } else {
                    assignment.reports = [];
                }
            })
        }

    });
