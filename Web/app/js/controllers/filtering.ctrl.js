
iWork.controller('FilteringController', ['$rootScope', '$scope', 'dataFactory', '$state', '$timeout', '$rootScope', 'Notify', 'filteringDataService',
    function ($rootScope, $scope, dataFactory, $state, $timeout, $rootScope, Notify, filteringDataService) {
        var now = moment().format('YYYY-MM-DD');
        $scope.members = [];
        $scope.projects = [];
        $scope.userStories = [];
        $scope.tasks = [];
        $scope.taskStatuses = dataFactory.taskStatus.getAll();
        $scope.taskTypes = dataFactory.taskTypes.getAll();
        $scope.taskSupportTypes = dataFactory.taskTypes.getSupport();
        $scope.defaultModel = {
            filtering: false,
            taskId: null,
            projectId: null,
            userStoryId: null,
            status: 1,
            priority: 2,
            dueDate: moment().format('YYYY-MM-DD'),
            estimatedDuration: 5,
            type: 1,
            fromDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
            toDate: moment().format('YYYY-MM-DD')
        };
        $scope.model = $scope.defaultModel;
        // Check Cache filtering
        if ($scope.$storage['filtering']) {
            $scope.model = JSON.parse($scope.$storage['filtering']);
        } else {
            $scope.$storage['filtering'] = angular.toJson($scope.model);
        };
        //////////////////////////////////////////////////////////////////////////////
        $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            if ($state.$current.title != toState.title) {
                $scope.changeState(toState.title)
            }
        });
        $scope.changeState = function (newState) {
            if (newState == 'Tasks') {
                $scope.url = '/iview/filtering/_task.html';
            } else if (newState == 'Default Page') {
                $scope.url = '/iview/filtering/_board.html';
            } else if (newState == 'Activities') {
                $scope.url = '/iview/filtering/_activity.html';
            } else {
                $scope.url = '/iview/filtering/_default.html';
            }
        };
        $scope.changeState($state.$current.title, false);
        $scope.filter = function () {
            $scope.model.filtering = true;
            filteringDataService.params = $scope.model;
            $scope.$storage['filtering'] = angular.toJson($scope.model);
            $state.reload();
        };
        $scope.reset = function () {
            $scope.model.filtering = false;
            filteringDataService.params = $scope.defaultModel;
            $scope.$storage['filtering'] = angular.toJson($scope.defaultModel);
            $state.reload();
        };
        //////////////////////////////////////////////////////////////////////////////

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
            if ($scope.model && $scope.model.taskId) {
                dataFactory.task.getById($scope.model.taskId).success(function (response) {
                    $scope.model = response.data;
                });
            };
        };

        $scope.initModel = function () {
            dataFactory.project.getAllMinimal().success(function (response) {
                $scope.projects = response.data;
            });
            if ($scope.model && $scope.model.taskId) {
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
                if ($scope.model && $scope.model.projectId) {
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

    }]);
