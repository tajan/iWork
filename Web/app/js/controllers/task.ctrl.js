
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
                log(response.data);
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
        dataFactory.task.getMyBoard().success(function (response) {
            $scope.tasks = response.data;
            angular.forEach($scope.tasks, function (task) {
                task.realEndDate = now;
            });
        });
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
            });
            // optionally disables mouse selection
            //.disableSelection()


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