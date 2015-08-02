iWork.controller('publicSearchController', ['$rootScope', '$scope', '$state', 'publicSearchDataService', function ($rootScope, $scope, $state, publicSearchDataService) {
    $scope.term = publicSearchDataService.term;
    $scope.search = function () {
        publicSearchDataService.term = $scope.term;
        $state.reload();
    };
}]);

iWork.controller('ProjectController', ['$scope', 'dataFactory', '$state', function ($scope, dataFactory, $state) {

    var projectId = $state.params["id"];

    $scope.model = {};
    $scope.members = [];
    $scope.projects = [];
    $scope.sprints = [];
    $scope.userStories = [];

    $scope.initProjectsView = function () {

        //Project data
        dataFactory.project.getAll().success(function (response) {
            $scope.projects = response.data;
        });

    };

    $scope.initProjectView = function () {

        if (projectId) {

            //Project data
            dataFactory.project.getById(projectId).success(function (response) {
                $scope.model = response.data;
            });

            //Sprint data
            dataFactory.sprint.getByProject(projectId).success(function (response) {
                $scope.sprints = response.data;
            });

            //User Story data
            dataFactory.userStory.getByProject(projectId).success(function (response) {
                $scope.userStories = response.data;
            });

        };
    };

    $scope.initModel = function () {

        //Members data
        dataFactory.user.getAllMinimal().success(function (response) {
            $scope.members = response.data;
        });

        if (projectId) {

            //Project data
            dataFactory.project.getById(projectId).success(function (response) {
                $scope.model = response.data;
            });

        };

    };

    $scope.submitform = function (actionName, $event) {
        dataFactory.project.postAction(actionName, $scope.model);
    };

}]);

iWork.controller('UserStoryController', ['$scope', 'dataFactory', '$state', function ($scope, dataFactory, $state) {

    $scope.projects = [];
    $scope.tasks = [];
    $scope.model = {
        userStoryId: $state.params["id"],
        projectId: $state.params["projectId"],
        status: 1
    };

    $scope.initModel = function () {

        dataFactory.project.getAllMinimal().success(function (response) {
            $scope.projects = response.data;
        });

        if ($scope.model.userStoryId) {
            dataFactory.userStory.getById($scope.model.userStoryId).success(function (response) {
                $scope.model = response.data;
            });
        };

    };

    $scope.initView = function () {

        if ($scope.model.userStoryId) {

            dataFactory.userStory.getById($scope.model.userStoryId).success(function (response) {
                $scope.model = response.data;
            });

            dataFactory.task.getByUserStory($scope.model.userStoryId).success(function (response) {
                $scope.tasks = response.data;
            });

        };
    };

    $scope.submitform = function (actionName, $event) {
        dataFactory.userStory.postAction(actionName, $scope.model);
    };

}]);

iWork.controller('SprintController', ['$scope', 'dataFactory', '$state', function ($scope, dataFactory, $state) {

    $scope.projects = [];
    $scope.model = {
        sprintId: $state.params["id"],
        projectId: $state.params["projectId"]
    };

    $scope.initModel = function () {

        dataFactory.project.getAllMinimal().success(function (response) {
            $scope.projects = response.data;
        });

        if ($scope.model.sprintId) {
            dataFactory.sprint.getById($scope.model.sprintId).success(function (response) {
                $scope.model = response.data;
            });
        };

    };

    $scope.submitform = function (actionName, $event) {
        dataFactory.sprint.postAction(actionName, $scope.model);
    };

}]);

iWork.controller('TaskController', ['$scope', 'dataFactory', '$state', '$timeout', function ($scope, dataFactory, $state, $timeout) {

    var now = moment().format('YYYY-MM-DD');

    $scope.members = [];
    $scope.projects = [];
    $scope.userStories = [];
    $scope.tasks = [];
    $scope.taskStatuses = dataFactory.taskStatus.getAll();
    $scope.taskTypes = dataFactory.taskTypes.getAll();
    $scope.taskSupportTypes = dataFactory.taskTypes.getSupport();
    
    $scope.model = {
        taskId: $state.params['id'],
        projectId: $state.params['projectId'],
        userStoryId: $state.params['userStoryId'],
        status: 1,
        priority: 2,
        dueDate: moment().format('YYYY-MM-DD'),
        estimatedDuration: 5,
        type: 1
    };

    $scope.onProjectChange = function (item) {

        $scope.model.userStoryId = undefined;
        $scope.model.members = [];

        dataFactory.userStory.getAllMinimal($scope.model.projectId).success(function (response) {
            $scope.userStories = response.data;
        });

        dataFactory.user.getByProject($scope.model.projectId).success(function (response) {
            $scope.members = response.data;
        });

    };

    $scope.initSupportModel= function () {

        $scope.initModel();
        $scope.model.type = 2;

    };

    $scope.initTaskView = function () {

        if ($scope.model.taskId) {

            dataFactory.task.getById($scope.model.taskId).success(function (response) {
                $scope.model = response.data;
            });
        };

    };

    $scope.initModel = function () {

        dataFactory.project.getAllMinimal().success(function (response) {
            $scope.projects = response.data;
        });

        if ($scope.model.taskId) {

            //edit task
            dataFactory.task.getById($scope.model.taskId).success(function (response) {
                $scope.model = response.data;

                //new task
                dataFactory.user.getByProject($scope.model.projectId).success(function (response) {
                    $scope.members = response.data;
                });

                dataFactory.userStory.getAllMinimal($scope.model.projectId).success(function (response) {
                    $scope.userStories = response.data;
                });

            });

        }
        else {

            if ($scope.model.projectId) {

                //new task
                dataFactory.user.getByProject($scope.model.projectId).success(function (response) {
                    $scope.members = response.data;
                });

                dataFactory.userStory.getAllMinimal($scope.model.projectId).success(function (response) {
                    $scope.userStories = response.data;
                });

            };

        };

    };

    $scope.initBoard = function () {

        dataFactory.task.getMyBoard().success(function (response) {

            $scope.tasks = response.data;

            angular.forEach($scope.tasks, function (task) {
                task.realEndDate = now;
            });

            initElement();
        });

        var initElement = function () {
            // Component is optional
            if (!$.fn.sortable) return;
            var Selector = '[portlet]';
            $(Selector).sortable({
                connectWith: Selector,
                items: 'div.panel',
                handle: '.portlet-handler',
                opacity: 0.7,
                placeholder: 'portlet box-placeholder',
                cancel: '.portlet-cancel',
                forcePlaceholderSize: true,
                iframeFix: false,
                tolerance: 'pointer',
                helper: 'original',
                revert: 200,
                forceHelperSize: true,
                start: saveListSize,
                update: savePortletOrder,
                create: loadPortletOrder
            })
            // optionally disables mouse selection
            //.disableSelection()
            ;

            function savePortletOrder(event, ui) {

                var self = event.target;
                var portletId = self.id;
                var status = parseInt(portletId.replace('portlet', ''));
                var panelIds = $(self).sortable('toArray');
                var taskIds = [];
                angular.forEach(panelIds, function (panelId) {
                    taskIds.push(parseInt(panelId.replace('panel', '')));
                });
                dataFactory.task.updateStatuses({ status: status, taskIds: taskIds });
                //save portlet size to avoid jumps
                //saveListSize.apply(self);
            };

            function loadPortletOrder(event) {

                var self = event.target;
                //var data = angular.fromJson($scope.$storage[storageKeyName]);

                //if (data) {

                //    var porletId = self.id,
                //        panels = data[porletId];

                //    if (panels) {
                //        var portlet = $('#' + porletId);

                //        $.each(panels, function (index, value) {
                //            $('#' + value).appendTo(portlet);
                //        });
                //    }

                //}

                // save portlet size to avoid jumps
                saveListSize.apply(self);
            };

            // Keeps a consistent size in all portlet lists
            function saveListSize() {
                //var $this = $(this);
                //$this.css('min-height', $this.height());
            };

            function resetListSize() {
                //  $(this).css('min-height', "");
            };

        };

    };

    $scope.upodatePortletOrder = function (taskIds, status) {
        var taskIds = [taskIds];
        dataFactory.task.updateStatuses({ status: status, taskIds: taskIds }).success(function () {
            $scope.initBoard();
        });
    };

    $scope.initView = function () {

        dataFactory.task.getAll().success(function (response) {
            $scope.tasks = response.data;
        });

    };

    $scope.initViewForArchive = function () {
        
        dataFactory.task.getForArchive().success(function (response) {
            $scope.tasks = response.data;

            angular.forEach($scope.tasks, function (task) {
                task.realEndDate = now;
            });

        });

    };

    $scope.archive = function (taskId, realEndDate) {

        dataFactory.task.archive(taskId, realEndDate).success(function () {
            //$scope.initViewForArchive();
            $scope.initBoard();
        });

    };

    $scope.submitform = function (actionName, $event) {
        dataFactory.task.postAction(actionName, $scope.model);
    };

}]);

iWork.controller('ActivityController', ['$scope', 'dataFactory', '$state', function ($scope, dataFactory, $state) {

    $scope.showActivityPanel = false;
    $scope.showArchivePanel = false;

    $scope.taskId = $state.params["id"];
    $scope.activities = [];

    $scope.activity = {
        duration: 15,
        activityDateTime: moment().format('YYYY-MM-DD')
    };

    $scope.initView = function () {

        if ($scope.taskId) {

            dataFactory.activity.getByTask($scope.taskId).success(function (response) {
                $scope.activities = response.data;
            });
        };
    };

    $scope.addActivity = function () {

        if ($scope.taskId) {

            $scope.activity.taskId = $scope.taskId;

            dataFactory.activity.addActivity($scope.activity).
                success(function (response, status, headers, config) {
                    $scope.activities.splice(0, 0, response.data);
                    $scope.activity.description = undefined;
                    $scope.activity.activityId = 0;
                });
        };

    };

    $scope.addActivityInMyBoard = function (taskId) {

        if (taskId) {
            $scope.activity.taskId = taskId;
            dataFactory.activity.addActivity($scope.activity).
                success(function (response, status, headers, config) {
                    $scope.showActivityPanel = false;
                });
        };

    };

}]);

iWork.controller('UserController', ['$rootScope', '$scope', 'dataFactory', '$state', 'authFactory', '$config', function ($rootScope, $scope, dataFactory, $state, authFactory, $config) {

    $scope.user = {};
    $scope.model = {};
    $scope.userId = $state.params['id'];

    /*=========================================================
    * Login user
    =========================================================*/
    $scope.login = function () {

        if ($scope.loginForm.$valid) {

            $scope.model.username = $scope.model.email;

            dataFactory.user.login($scope.model).then(function (response) {

                //setting authentication token in local storage to send for each request using request interception
                authFactory.setAuthenticationData(response.data);

                //setting logged in user in root scope
                dataFactory.user.getCurrent().success(function (response) {

                    authFactory.setUser(response.data);

                    //redirecting to default page (after login)
                    $state.transitionTo($config.DEFAULT_STATE);

                });



            }, function (response) {

                $scope.message = 'Invalid username or password!';

            });
        }
    };

    /*=========================================================
    * Logoff user
    =========================================================*/
    $scope.logout = function () {

        // clear browser data and global scope
        authFactory.clearAuthenticationData();

        // send post request to server side log off 
        dataFactory.user.logout().success(function (response) {
            // redirecting to login page 
            $state.transitionTo($config.LOGIN_STATE);
        });

    };

    /*=========================================================
    * Register User
    =========================================================*/
    $scope.register = function () {

        if ($scope.registerForm.$valid) {

            dataFactory.user.register($scope.model).then(function (response) {

                //setting authentication token in local storage to send for each request using request interception
                authFactory.setAuthenticationData(response.data);

                //setting registered user in root scope
                dataFactory.user.getCurrent().success(function (response) {

                    authFactory.setUser(response.data);

                    //redirecting to default page (after login)
                    $state.transitionTo($config.DEFAULT_STATE);

                });

            }, function (response) {
                $scope.message = response.message;
            });

        }
    };

    /**=========================================================
    * Update User Profile 
    =========================================================*/
    $scope.submitform = function (actionName, $event) {
        dataFactory.user.postAction(actionName, $scope.model);
    };

    $scope.initModel = function () {
        $scope.model = $rootScope.app.user;
    };

    $scope.initView = function () {
        if ($scope.userId) {
            $scope.user = dataFactory.user.getById($scope.userId);
        };
    };

}]);
