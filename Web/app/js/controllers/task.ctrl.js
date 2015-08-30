
iWork.controller('TaskController', ['$scope', 'dataFactory', '$state', '$timeout', '$rootScope', function ($scope, dataFactory, $state, $timeout, $rootScope) {

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

    $scope.initSupportModel = function () {
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

    $scope.$on('update-task-board', function (event, args) {
        $scope.reInitBoard();
    });

    $scope.reInitBoard = function () {
        $scope.initBoard();
    };

    $scope.updateTaskByStatus = function () {
        $scope.tasksByStatus = {
            1: $.grep($scope.tasks, function (v) {
                return v.status === 1;
            }),
            2: $.grep($scope.tasks, function (v) {
                return v.status === 2;
            }),
            3: $.grep($scope.tasks, function (v) {
                return v.status === 3;
            }),
            4: $.grep($scope.tasks, function (v) {
                return v.status === 4;
            })
        }
    };

    $scope.initBoard = function () {
        dataFactory.task.getMyBoard().success(function (response) {
            $scope.tasks = response.data;
            $scope.updateTaskByStatus();
            angular.forEach($scope.tasks, function (task) {
                task.realEndDate = now;
            });
            initElement();
        });
        var initElement = function () {
            // Component is optional
            if (!$.fn.sortable) return;
            var Selector = '[portlet]';
            $scope.sortableOptions = {
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
                receive: function (event, ui) {
                    var targetTask = null;
                    var taskId = parseInt(ui.item.attr('id').replace('panel', ''));
                    var self = event.target;
                    var portletId = self.id;
                    var status = parseInt(portletId.replace('portlet', ''));
                    var panelIds = $(self).sortable('toArray');
                    var taskIds = [taskId];
                    angular.forEach(panelIds, function (panelId) {
                        taskIds.push(parseInt(panelId.replace('panel', '')));
                    });
                    $.each($scope.tasks, function (index, task) {
                        if (task.taskId == taskId) {
                            targetTask = task;
                        }
                    });
                    if (status == 1 && targetTask.activityCount > 0) {
                        $scope.updateTaskByStatus();
                    } else {
                        dataFactory.task.updateStatuses({ status: status, taskIds: taskIds }).success(function () {
                            targetTask.status = status;
                        });
                    }
                }
            };
        };
    };

    $scope.updatePortletOrder = function (taskIds, status) {
        var taskIds = [taskIds];
        dataFactory.task.updateStatuses({ status: status, taskIds: taskIds }).success(function () {
            $scope.reInitBoard();
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