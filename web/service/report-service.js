(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('ReportService', ReportService);

    /* @ngInject */
    function ReportService($q, $http, $$http, API_CONFIG) {

        var service = this;


        service.getAssignments = () => {
            return $$http.get('form/assignment/report');
        }

        service.getReportListForUser = () => {
            return $$http.get('report');
        }

        service.getReportListForReview = () => {
            return $$http.get('report?status=submit');
        }



        service.getReportsByAssignmentId = (assignmentId) => {
            return $$http.get('report?id=' + assignmentId);
        }

        service.getReportDetailByReportId = (reportId) => {
            return $$http.get('report/' + reportId);
        }

        service.updateReportDetails = (reportId, formId, answers) => {
            //turn answsers into rawData
            let body = {
                form: formId,
                components: []
            };
            for (let key in answers) {
                if (answers[key]) {
                    if (Array.isArray(answers[key])) {
                        body.components.push({
                            componentId: key,
                            value: JSON.stringify(answers[key])
                        })
                    } else {
                        body.components.push({
                            componentId: key,
                            value: answers[key]
                        })
                    }
                }
            }


            if (reportId) {
                return $$http.put('form/report/' + reportId, body);
            } else {
                return $$http.post('form/report', body);
            }
        }

        service.updateReportStatus = (report, status) => {
            return $$http.post('report/' + report + '/status', {
                status: status
            });
        }

        service.getReportDocument = (report) => {
            return $$http.postToDownload('document/' + report);
        }

        return service;

    }
})();