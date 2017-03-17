
"use strict";



// Login Controller Content Controller
App.controller('ReportController',
    function ($scope, $state, $localStorage, $window, UserService, FormService, ReportService, $timeout, $uibModal, uuid) {


        // ReportService.getAssignments().then(res => {
        //     if (res && res.result) {
        //         $scope.assignments = res.data;
        //     } else {
        //         $scope.assignments = [];
        //     }
        // })



        $scope.fetchReports = () => {
            return ReportService.getReportListForUser().then(res => {
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

        $scope.downloadDocument = (report) => {
            ReportService.getReportDocument(report.id);
        }

    });


App.controller('ReportEditController',
    function ($scope, $state, $stateParams, Upload, $localStorage, $window, UserService, FormService, ReportService, $timeout, $uibModal, uuid, FileUploader, $q) {
        try {
            if ($stateParams
                && $stateParams.formId
                && $stateParams.reportId
            ) {

                $scope.formId = atob($stateParams.formId);
                if ($stateParams.reportId !== 'new') {
                    $scope.reportId = atob($stateParams.reportId);
                }
            }
        }
        catch (e) {
            // $state.go('layout.dashboard');
        } finally {
            if (!$scope.formId) {
                $state.go('layout.dashboard');
                return;
            }
        }

        // $scope.selectFile = (item) => {
        //     console.log(item);
        //     $scope.uploader;
        // }

        $scope.selectFile = function (file, errFiles, item) {
            $scope.f = file;

            console.log(file, errFiles, item);

            $scope.errFile = errFiles && errFiles[0];
            if (file) {

                item.file = file;
                item.value = file.name;
                item.saved = false;


            }
        }
        $scope.uploadFile = (item) => {
            return $scope.runUploadFile(item).then(res => {
                return $timeout(() => {
                    console.log(res);
                    item.isSaving = false;
                    if (res.result) {
                        item.value = res.data;
                        item.saved = true;
                    } else {
                        item.err = res.err;
                        item.saved = false;

                    }
                    return res;
                })
            })
        }
        $scope.runUploadFile = (item) => {
            item.isSaving = true;
            return new Promise(resolve => {

                if (item.file) {
                    item.file.upload = Upload.upload({
                        url: '/upload',
                        data: { file: item.file }
                    });

                    item.file.upload.then(
                        function (response) {
                            $timeout(function () {
                                item.file.result = response.data;
                            });
                            resolve(response.data);
                        },
                        function (response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                            console.log(response);
                            resolve({ result: false, err: 'upload failed' });
                        },
                        function (evt) {
                            console.log(evt);
                            item.percentage = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));

                        });
                } else {
                    resolve({ result: false, err: 'file not exist' });
                }
            })



            //$scope.test(item);
        }

        $scope.test = (i) => {
            if (i.percentage < 100) {
                i.percentage += 10;
                $timeout(() => {
                    $scope.test(i);
                }, 1000);
            } else {
                i.isSaving = false;
                i.saved = true;
            }
        }

        $scope.uploader = new FileUploader();


        //load template
        FormService.getFormTemplate($scope.formId).then(res => {
            //transform database structure into frontend structure
            if (res && res.result) {


                $scope.model = $scope.generateTemplateModel(res.data.components);

                $scope.form = {
                    title: res.data.title,
                    id: res.data.id,
                    subtitle: res.data.subtitle
                }

                if ($scope.reportId) {
                    $scope.loadAnsers();
                }
            }
        })

        $scope.transformBaseModel = (item, copyValue) => {
            return {
                id: item.id,
                description: item.description,
                type: item.type,
                placeholder: item.placeholder,
                options: item.options,
                unit: item.unit,
                default: item.default,
                multiple: item.multiple,
                elementId: uuid.v4(),
                value: copyValue ? item.value : item.default
            };
        }

        $scope.generateTemplateModel = (items) => {
            let data = [];
            let group = null;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];

                if (!item.multiple) {
                    //check if group is not null
                    if (group) {
                        //push it into data
                        data.push({
                            type: 'group',
                            groups: [group]
                        });
                        group = null;
                    }

                    data.push($scope.transformBaseModel(item))
                } else {
                    //is multiple, add into group(if null, create new group);
                    if (!group)
                        group = [];
                    group.push($scope.transformBaseModel(item));
                }




            }

            //check if group is not null
            if (group) {
                //push it into data
                data.push({
                    type: 'group',
                    groups: [group]
                });
                group = null;
            }

            console.log(data);
            return data;
        }

        $scope.duplicateGroup = (item, copyValue) => {
            let group = item.groups[0];
            let newGroup = [];
            for (let i = 0; i < group.length; i++) {
                newGroup.push($scope.transformBaseModel(group[i], copyValue));
            }



            item.groups.push(newGroup);
        }

        $scope.deleteGroup = (item, $index) => {
            item.groups.splice($index, 1);
        }
        //load value if reportId is not null

        $scope.saveReport = () => {



            let itemData = $scope.gatherAnswerData();

            //check if no upload file not saved
            let toUpload = [];
            for (let key in itemData) {
                if (Array.isArray(itemData[key])) {
                    for (let i = 0; i < itemData[key].length; i++) {

                        let item = itemData[key][i];
                        if (item.type == 'file' && item.saved == false && item.file) {
                            toUpload.push(item);
                        }
                    }
                } else {
                    let item = itemData[key];
                    if (item.type == 'file' && item.saved == false && item.file) {
                        toUpload.push(item);
                    }
                }
            }
            console.log(toUpload.length);

            if (toUpload.length) {
                var promises = [];
                for (let i = 0; i < toUpload.length; i++) {
                    promises.push($scope.uploadFile(toUpload[i]));
                }
                $q.all(promises).then(res => {
                    console.log(res);
                    $scope.saveReportWithoutCheckUpload(itemData);
                })
            } else {
                $scope.saveReportWithoutCheckUpload(itemData);
            }

        }

        $scope.saveReportWithoutCheckUpload = () => {
            let itemData = $scope.gatherAnswerData();
            let data = {};
            for (let key in itemData) {
                data[key] = [];
                if (Array.isArray(itemData[key])) {
                    for (let i = 0; i < itemData[key].length; i++) {
                        data[key].push(itemData[key][i].value);
                    }
                } else {
                    data[key] = itemData[key].value;
                }
            }

            ReportService.updateReportDetails($scope.reportId, $scope.formId, data).then(res => {

                if (res && res.result) {
                    if ($scope.reportId) {
                        ReportService.updateReportStatus($scope.reportId, 'draft');
                    }

                    FormService.updateAssignmentStatus($scope.assignmentId, 'started');

                    jQuery.notify(
                        {
                            icon: "fa fa-check",
                            message: "Report saved!",
                            url: ''
                        },
                        {
                            element: 'body',
                            type: "success",
                            allow_dismiss: true,
                            newest_on_top: true,
                            showProgressbar: false,
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            offset: 20,
                            spacing: 10,
                            z_index: 1033,
                            delay: 5000,
                            timer: 1000,
                            animate: {
                                enter: 'animated fadeIn',
                                exit: 'animated fadeOutDown'
                            }
                        });


                }


            })
        }

        /**
         * get information from $scope.model
         */
        $scope.gatherAnswerData = () => {
            console.log($scope.model);
            let answers = {};
            for (let i = 0; i < $scope.model.length; i++) {
                let item = $scope.model[i];
                if (item.type !== 'group') {
                    answers[item.id] = item;
                } else {
                    //get the group data
                    for (let j = 0; j < item.groups.length; j++) {
                        let group = item.groups[j];
                        for (let k = 0; k < group.length; k++) {
                            let next = group[k];
                            if (!answers[next.id])
                                answers[next.id] = [];
                            answers[next.id].push(next);
                        }
                    }
                }
            }

            return answers;
        }

        $scope.loadAnsers = () => {
            ReportService.getReportDetailByReportId($scope.reportId).then(res => {
                if (res && res.result) {

                    if (res.data.length && res.data[0].status == 'submit') {
                        if ($state.current.name === 'layout.report') {
                            $state.go('layout.report-view', $stateParams);
                        }
                    }

                    //build map
                    let answers = {};
                    for (let i = 0; i < res.data.length; i++) {
                        let item = res.data[i];
                        answers[item.componentId] = item.value;
                    }


                    //put value back to current form
                    for (let i = 0; i < $scope.model.length; i++) {
                        let item = $scope.model[i];
                        if (item.type !== 'group') {
                            item.value = answers[item.id]

                            //for file
                            if (item.type == 'file' && item.value) {
                                item.saved = true;
                            }

                            if (!item.value) {
                                item.value = item.default;
                            }
                        } else {
                            //according to answers, group may need to be duplicated!


                            for (let i = 0; i < item.groups[0].length; i++) {
                                let answer = JSON.parse(answers[item.groups[0][i].id]);

                                //duplicate the group until it has enough length
                                while (item.groups.length < answer.length) {
                                    $scope.duplicateGroup(item);
                                }

                                //set the value back
                                for (let j = 0; j < item.groups.length; j++) {
                                    item.groups[j][i].value = answer[j];
                                }
                            }

                        }
                    }
                }
            });
        }

    });

App.controller('ReportTemplateController',
    function ($scope, $state, $stateParams, $localStorage, $window, UserService, FormService, ReportService, $timeout, $uibModal, uuid) {
        FormService.getForms().then(res => {
            if (res && res.result) {
                $scope.templates = res.data;
            } else {
                $scope.templates = [];
            }
        })

        $scope.createNewReport = (template) => {
            $state.go('layout.report', { formId: btoa(template.id), reportId: 'new' });
        }

    });