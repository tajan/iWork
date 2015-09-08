'use strict';

iWork.config(['$config', '$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider', function ($config, $stateProvider, $locationProvider, $urlRouterProvider, helper) {

    $urlRouterProvider.otherwise(function ($injector, $location) {
        $injector.invoke(['$config', '$state', function ($config, $state) {
            $state.go($config.DEFAULT_STATE);
        }]);
    });


    var getViewUrl = function (url) {
        return '/iview/' + url;
    };

    $stateProvider
        .state('app.index', {
            url: '/index',
            templateUrl: getViewUrl('index.html'),
            resolve: helper.resolveFor('jquery-ui', 'jquery-ui-widgets', 'uiSortable'),
            title: 'Default Page'
        })
        .state('page', {
            url: '/page',
            templateUrl: getViewUrl('page.html'),
            resolve: helper.resolveFor('modernizr', 'icons'),
            controller: ["$rootScope", function ($rootScope) {
                $rootScope.app.layout.isBoxed = false;
            }]
        });

    $stateProvider
        .state('app.help', {
            url: '/help',
            templateUrl: getViewUrl('help/index.html'),
            title: 'Login',
            access: 'public'
        })
        .state('page.login', {
            url: '/login',
            templateUrl: getViewUrl('account/login.html'),
            title: 'Login',
            access: 'public'
        })
        .state('page.register', {
            url: '/register',
            templateUrl: getViewUrl('account/register.html'),
            title: 'Register',
            access: 'public'
        })
        .state('page.recover', {
            url: '/recover',
            title: "Recover",
            templateUrl: getViewUrl('account/recover.html'),
            access: 'public'
        })
        .state('app.userprofile', {
            url: '/UserProfile',
            title: "User Profile",
            templateUrl: getViewUrl('account/userprofile.html')
        })
        .state('app.userprofileview', {
            url: '/UserProfileView/:id',
            title: "User Profile",
            templateUrl: getViewUrl('account/userprofile.html')
        })
        .state('app.profileupdate', {
            url: '/UserProfile/update',
            title: "Update Profile",
            templateUrl: getViewUrl('account/profileupdate.html'),
            resolve: helper.resolveFor('angularFileUpload', 'filestyle')
        });


    $stateProvider
        .state('app.project', {
            url: '/project',
            templateUrl: getViewUrl('project/index.html'),
            title: 'Projects'
        })
        .state('app.projectadd', {
            url: '/project/add',
            templateUrl: getViewUrl('project/add.html'),
            title: 'Add Project',
            resolve: helper.resolveFor('ui.select', 'angularFileUpload', 'filestyle')
        })
        .state('app.projectview', {
            url: '/project/view/:id',
            templateUrl: getViewUrl('project/view.html'),
            title: 'View Project',
            resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins')
        })
        .state('app.projectupdate', {
            url: '/project/update/:id',
            templateUrl: getViewUrl('project/update.html'),
            title: 'Update Project',
            resolve: helper.resolveFor('ui.select', 'angularFileUpload', 'filestyle')
        });

    $stateProvider
        .state('app.sprintadd', {
            url: '/sprint/add/:projectId',
            templateUrl: getViewUrl('sprint/add.html'),
            resolve: helper.resolveFor('ui.select'),
            title: 'Add Sprints'
        })
        .state('app.sprintupdate', {
            url: '/sprint/update/:id',
            templateUrl: getViewUrl('sprint/update.html'),
            title: 'Update Sprint',
            resolve: helper.resolveFor('ui.select')
        });

    $stateProvider
        .state('app.userstoryadd', {
            url: '/userstory/add/:projectId',
            templateUrl: getViewUrl('userstory/add.html'),
            resolve: helper.resolveFor('ui.select','angularFileUpload', 'filestyle'),
            title: 'Add User Story'
        })
        .state('app.userstoryview', {
            url: '/userstory/view/:id',
            templateUrl: getViewUrl('userstory/view.html'),
            title: 'View User Story'
        })
        .state('app.userstoryupdate', {
            url: '/userstory/update/:id',
            templateUrl: getViewUrl('userstory/update.html'),
            resolve: helper.resolveFor('ui.select', 'angularFileUpload', 'filestyle'),
            title: 'Update User Story'
        });

    $stateProvider
        .state('app.task', {
            url: '/task',
            templateUrl: getViewUrl('task/index.html'),
            title: 'Tasks',
            resolve: helper.resolveFor('ngGrid')
        })
        .state('app.taskadd', {
            url: '/task/add/:projectId/:userStoryId',
            templateUrl: getViewUrl('task/add.html'),
            resolve: helper.resolveFor('ui.select', 'angularFileUpload', 'filestyle'),
            title: 'Add Tasks'
        })
        .state('app.taskview', {
            url: '/task/view/:id',
            templateUrl: getViewUrl('task/view.html'),
            title: 'View Tasks'
        })
        .state('app.taskarchive', {
            url: '/task/archive',
            templateUrl: getViewUrl('task/archive.html'),
            title: 'Archive Tasks'
        })
        .state('app.taskupdate', {
            url: '/task/update/:id',
            templateUrl: getViewUrl('task/update.html'),
            resolve: helper.resolveFor('ui.select', 'angularFileUpload', 'filestyle'),
            title: 'Update Tasks'
        })
        .state('app.taskaddsupport', {
            url: '/task/addsupport/:projectId/:userStoryId',
            templateUrl: getViewUrl('task/addsupport.html'),
            resolve: helper.resolveFor('ui.select', 'angularFileUpload', 'filestyle'),
            title: 'Add Support Task'
        });

    $stateProvider
        .state('app.activity', {
            url: '/activity',
            templateUrl: getViewUrl('activity/index.html'),
            title: 'Activities'
        });

}]);
