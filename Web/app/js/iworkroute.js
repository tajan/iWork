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
            resolve: helper.resolveFor('jquery-ui', 'jquery-ui-widgets'),
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
            title: 'Projects',
            resolve: helper.resolveFor('ngGrid')
        })
        .state('app.projectadd', {
            url: '/project/add',
            templateUrl: getViewUrl('project/add.html'),
            title: 'Add Project',
            resolve: helper.resolveFor('ui.select', 'angularFileUpload', 'filestyle','htmlSortable')
        })
        .state('app.projectview', {
            url: '/project/view/:id',
            templateUrl: getViewUrl('project/view.html'),
            title: 'View Project'
        })
        .state('app.projectupdate', {
            url: '/project/update/:id',
            templateUrl: getViewUrl('project/update.html'),
            title: 'Update Project',
            resolve: helper.resolveFor('ui.select', 'angularFileUpload', 'filestyle', 'htmlSortable')
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
            resolve: helper.resolveFor('ui.select', 'angularFileUpload', 'filestyle', 'htmlSortable'),
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
            resolve: helper.resolveFor('ui.select', 'angularFileUpload', 'filestyle', 'htmlSortable'),
            title: 'Update Tasks'
        });

    $stateProvider
        .state('app.activity', {
            url: '/activity/:taskId',
            templateUrl: getViewUrl('activity/index.html'),
            title: 'Activities'
        });
}]);
