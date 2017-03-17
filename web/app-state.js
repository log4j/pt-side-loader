"use strict;"



// Router configuration
App.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('layout', {
                abstract: true,
                templateUrl: 'layout/layout.html',
                data: {
                    permissions: {
                        only: ['WEBSITE'],
                        redirectTo: 'login'
                    }
                }
            })
            .state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'pages/account/login.html',
                data: {
                    permissions: {
                        except: ['WEBSITE'],
                        redirectTo: 'layout.dashboard'
                    }
                }
            })
            .state('register', {
                url: '/register',
                templateUrl: 'pages/account/register.html'
            })
            .state('layout.angularjs', {
                url: '/angularjs',
                templateUrl: 'assets/views/ready_angularjs.html'
            })
            .state('layout.dashboard', {
                url: '/dashboard',
                templateUrl: 'pages/dashboard/dashboard.html',
                controller: 'DashboardController',
                resolve: {
                    // deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    //     return $ocLazyLoad.load({
                    //         insertBefore: '#css-bootstrap',
                    //         serie: true,
                    //         files: [
                    //             // 'assets/js/plugins/slick/slick.min.css',
                    //             // 'assets/js/plugins/slick/slick-theme.min.css',
                    //             // 'assets/js/plugins/slick/slick.min.js',
                    //             // 'assets/js/plugins/chartjs/Chart.min.js'
                    //         ]
                    //     });
                    // }]
                }
            })
            .state('layout.template', {
                url: '/template',
                templateUrl: 'pages/report/report-templates.html'
            })
            .state('layout.report-list', {
                url: '/report',
                templateUrl: 'pages/report/report-list.html',

                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                'assets/js/plugins/datatables/jquery.dataTables.min.js'
                            ]
                        })
                    }]
                }
            })
            .state('layout.user', {
                url: '/user',
                templateUrl: 'pages/user/user-list.html',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/select2/select2.min.css',
                                'assets/js/plugins/select2/select2-bootstrap.min.css',
                                'assets/js/plugins/select2/select2.full.min.js',
                                'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                'assets/js/plugins/jquery-validation/additional-methods.min.js'
                            ]
                        })
                    }]
                }
            })
            .state('layout.report', {
                url: '/report/edit/:formId/:reportId',
                controller: 'ReportEditController',
                templateUrl: 'pages/report/report-edit.html',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker3.min.css',
                                'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
                                'assets/js/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
                                // 'assets/js/plugins/select2/select2.min.css',
                                // 'assets/js/plugins/select2/select2-bootstrap.min.css',
                                // 'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.css',
                                // 'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.min.css',
                                // 'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.skinHTML5.min.css',
                                // 'assets/js/plugins/dropzonejs/dropzone.min.css',
                                // 'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.css',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js',
                                'assets/js/plugins/bootstrap-datetimepicker/moment.min.js',
                                'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js',
                                // 'assets/js/plugins/bootstrap-colorpicker/bootstrap-colorpicker.min.js',
                                // 'assets/js/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                // 'assets/js/plugins/select2/select2.full.min.js',
                                'assets/js/plugins/masked-inputs/jquery.maskedinput.min.js',
                                // 'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.js',
                                // 'assets/js/plugins/ion-rangeslider/js/ion.rangeSlider.min.js',
                                // 'assets/js/plugins/dropzonejs/dropzone.min.js',
                                // 'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('layout.report-view', {
                url: '/report/view/:formId/:reportId',
                controller: 'ReportEditController',
                templateUrl: 'pages/report/report-view.html',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker3.min.css',
                                'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
                                'assets/js/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
                                // 'assets/js/plugins/select2/select2.min.css',
                                // 'assets/js/plugins/select2/select2-bootstrap.min.css',
                                // 'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.css',
                                // 'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.min.css',
                                // 'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.skinHTML5.min.css',
                                // 'assets/js/plugins/dropzonejs/dropzone.min.css',
                                // 'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.css',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js',
                                'assets/js/plugins/bootstrap-datetimepicker/moment.min.js',
                                'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js',
                                // 'assets/js/plugins/bootstrap-colorpicker/bootstrap-colorpicker.min.js',
                                // 'assets/js/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                // 'assets/js/plugins/select2/select2.full.min.js',
                                'assets/js/plugins/masked-inputs/jquery.maskedinput.min.js',
                                // 'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.js',
                                // 'assets/js/plugins/ion-rangeslider/js/ion.rangeSlider.min.js',
                                // 'assets/js/plugins/dropzonejs/dropzone.min.js',
                                // 'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js'
                            ]
                        });
                    }]
                }
            })

            .state('layout.review-list', {
                url: '/review',
                templateUrl: 'pages/review/review-list.html',

                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                'assets/js/plugins/datatables/jquery.dataTables.min.js'
                            ]
                        })
                    }]
                }
            })
            .state('dashboard', {
                url: '/dashboard2',
                templateUrl: 'assets/views/ready_dashboard.html',
                controller: 'DashboardCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/slick/slick.min.css',
                                'assets/js/plugins/slick/slick-theme.min.css',
                                'assets/js/plugins/slick/slick.min.js',
                                'assets/js/plugins/chartjs/Chart.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('uiActivity', {
                url: '/ui/activity',
                templateUrl: 'assets/views/ui_activity.html',
                controller: 'UiActivityCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sweetalert2/sweetalert2.min.css',
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/sweetalert2/es6-promise.auto.min.js',
                                'assets/js/plugins/sweetalert2/sweetalert2.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('uiTabs', {
                url: '/ui/tabs',
                templateUrl: 'assets/views/ui_tabs.html'
            })
            .state('uiModalsTooltips', {
                url: '/ui/modals-tooltips',
                templateUrl: 'assets/views/ui_modals_tooltips.html'
            })
            .state('uiColorThemes', {
                url: '/ui/color-themes',
                templateUrl: 'assets/views/ui_color_themes.html'
            })
            .state('uiBlocksDraggable', {
                url: '/ui/blocks-draggable',
                templateUrl: 'assets/views/ui_blocks_draggable.html',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/jquery-ui/jquery-ui.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('uiChatFull', {
                url: '/ui/chat/full',
                templateUrl: 'assets/views/ui_chat_full.html',
                controller: 'UiChatCtrl'
            })
            .state('uiChatFixed', {
                url: '/ui/chat/fixed',
                templateUrl: 'assets/views/ui_chat_fixed.html',
                controller: 'UiChatCtrl'
            })
            .state('uiChatPopup', {
                url: '/ui/chat/popup',
                templateUrl: 'assets/views/ui_chat_popup.html',
                controller: 'UiChatCtrl'
            })
            .state('tablesTools', {
                url: '/tables/tools',
                templateUrl: 'assets/views/tables_tools.html'
            })
            .state('tablesDatatables', {
                url: '/tables/datatables',
                templateUrl: 'assets/views/tables_datatables.html',
                controller: 'TablesDatatablesCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                'assets/js/plugins/datatables/jquery.dataTables.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('formsPickersMore', {
                url: '/forms/pickers-more',
                templateUrl: 'assets/views/forms_pickers_more.html',
                controller: 'FormsPickersMoreCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker3.min.css',
                                'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
                                'assets/js/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
                                'assets/js/plugins/select2/select2.min.css',
                                'assets/js/plugins/select2/select2-bootstrap.min.css',
                                'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.css',
                                'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.min.css',
                                'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.skinHTML5.min.css',
                                'assets/js/plugins/dropzonejs/dropzone.min.css',
                                'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.css',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js',
                                'assets/js/plugins/bootstrap-datetimepicker/moment.min.js',
                                'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js',
                                'assets/js/plugins/bootstrap-colorpicker/bootstrap-colorpicker.min.js',
                                'assets/js/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                'assets/js/plugins/select2/select2.full.min.js',
                                'assets/js/plugins/masked-inputs/jquery.maskedinput.min.js',
                                'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.js',
                                'assets/js/plugins/ion-rangeslider/js/ion.rangeSlider.min.js',
                                'assets/js/plugins/dropzonejs/dropzone.min.js',
                                'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('formsEditors', {
                url: '/forms/editors',
                templateUrl: 'assets/views/forms_editors.html',
                controller: 'FormsEditorsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/summernote/summernote.min.css',
                                'assets/js/plugins/summernote/summernote.min.js',
                                'assets/js/plugins/ckeditor/ckeditor.js',
                                'assets/js/plugins/simplemde/simplemde.min.css',
                                'assets/js/plugins/simplemde/simplemde.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('formsValidation', {
                url: '/forms/validation',
                templateUrl: 'assets/views/forms_validation.html',
                controller: 'FormsValidationCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/select2/select2.min.css',
                                'assets/js/plugins/select2/select2-bootstrap.min.css',
                                'assets/js/plugins/select2/select2.full.min.js',
                                'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                'assets/js/plugins/jquery-validation/additional-methods.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('formsWizard', {
                url: '/forms/wizard',
                templateUrl: 'assets/views/forms_wizard.html',
                controller: 'FormsWizardCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                'assets/js/plugins/jquery-validation/jquery.validate.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compCharts', {
                url: '/components/charts',
                templateUrl: 'assets/views/comp_charts.html',
                controller: 'CompChartsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sparkline/jquery.sparkline.min.js',
                                'assets/js/plugins/easy-pie-chart/jquery.easypiechart.min.js',
                                'assets/js/plugins/chartjs/Chart.min.js',
                                'assets/js/plugins/flot/jquery.flot.min.js',
                                'assets/js/plugins/flot/jquery.flot.pie.min.js',
                                'assets/js/plugins/flot/jquery.flot.stack.min.js',
                                'assets/js/plugins/flot/jquery.flot.resize.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compCalendar', {
                url: '/components/calendar',
                templateUrl: 'assets/views/comp_calendar.html',
                controller: 'CompCalendarCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/fullcalendar/fullcalendar.min.css',
                                'assets/js/plugins/jquery-ui/jquery-ui.min.js',
                                'assets/js/plugins/fullcalendar/moment.min.js',
                                'assets/js/plugins/fullcalendar/fullcalendar.min.js',
                                'assets/js/plugins/fullcalendar/gcal.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compSliders', {
                url: '/components/sliders',
                templateUrl: 'assets/views/comp_sliders.html',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/slick/slick.min.css',
                                'assets/js/plugins/slick/slick-theme.min.css',
                                'assets/js/plugins/slick/slick.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compScrolling', {
                url: '/components/scrolling',
                templateUrl: 'assets/views/comp_scrolling.html'
            })
            .state('compSyntaxHighlighting', {
                url: '/components/syntax-highlighting',
                templateUrl: 'assets/views/comp_syntax_highlighting.html',
                controller: 'CompSyntaxHighlightingCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/highlightjs/github-gist.min.css',
                                'assets/js/plugins/highlightjs/highlight.pack.js'
                            ]
                        });
                    }]
                }
            })
            .state('compRating', {
                url: '/components/rating',
                templateUrl: 'assets/views/comp_rating.html',
                controller: 'CompRatingCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/jquery-raty/jquery.raty.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compTreeview', {
                url: '/components/treeview',
                templateUrl: 'assets/views/comp_treeview.html',
                controller: 'CompTreeviewCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/bootstrap-treeview/bootstrap-treeview.min.css',
                                'assets/js/plugins/bootstrap-treeview/bootstrap-treeview.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compMapsGoogle', {
                url: '/components/maps/google',
                templateUrl: 'assets/views/comp_maps.html',
                controller: 'CompMapsGoogleCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                /*
                                 * Google Maps API Key (you will have to obtain a Google Maps API key to use Google Maps)
                                 * For more info please have a look at https://developers.google.com/maps/documentation/javascript/get-api-key#key
                                 */
                                { type: 'js', path: '//maps.googleapis.com/maps/api/js?key=' },
                                'assets/js/plugins/gmapsjs/gmaps.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compMapsGoogleFull', {
                url: '/components/maps/google-full',
                templateUrl: 'assets/views/comp_maps_full.html',
                controller: 'CompMapsGoogleFullCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                /*
                                 * Google Maps API Key (you will have to obtain a Google Maps API key to use Google Maps)
                                 * For more info please have a look at https://developers.google.com/maps/documentation/javascript/get-api-key#key
                                 */
                                { type: 'js', path: '//maps.googleapis.com/maps/api/js?key=' },
                                'assets/js/plugins/gmapsjs/gmaps.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compMapsVector', {
                url: '/components/maps/vector',
                templateUrl: 'assets/views/comp_maps_vector.html',
                controller: 'CompMapsVectorCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/jquery-jvectormap/jquery-jvectormap.min.css',
                                'assets/js/plugins/jquery-jvectormap/jquery-jvectormap.min.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-au-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-cn-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-de-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-europe-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-fr-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-in-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-us-aea-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-world-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-za-mill-en.js'
                            ]
                        });
                    }]
                }
            })
            .state('compGallerySimple', {
                url: '/components/gallery/simple',
                templateUrl: 'assets/views/comp_gallery_simple.html',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/magnific-popup/magnific-popup.min.css',
                                'assets/js/plugins/magnific-popup/magnific-popup.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compGalleryAdvanced', {
                url: '/components/gallery/advanced',
                templateUrl: 'assets/views/comp_gallery_advanced.html',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/magnific-popup/magnific-popup.min.css',
                                'assets/js/plugins/magnific-popup/magnific-popup.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('blocks', {
                url: '/blocks',
                templateUrl: 'assets/views/api_blocks.html'
            })
            .state('layout2', {
                url: '/layout',
                templateUrl: 'assets/views/api_layout.html'
            })
            .state('create', {
                url: '/create',
                templateUrl: 'assets/views/ready_create.html'
            });
    }
]);
