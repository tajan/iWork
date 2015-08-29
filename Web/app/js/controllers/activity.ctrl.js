
iWork.controller('ActivityController', ['$scope', 'dataFactory', '$state', '$rootScope', function ($scope, dataFactory, $state, $rootScope) {

    $scope.showActivityPanel = false;
    $scope.showArchivePanel = false;
    $scope.showDetailPanel = false;
    $scope.showFilePanel = false;

    $scope.taskId = $state.params["id"];
    $scope.activities = [];

    $scope.activity = {
        duration: 15,
        activityDateTime: moment().format('YYYY-MM-DD')
    };

    $scope.initView = function (taskId) {

        if (taskId) {
            $scope.taskId = taskId;
        };

        if ($scope.taskId) {

            dataFactory.activity.getByTask($scope.taskId).success(function (response) {
                $scope.activities = response.data;
            });
        };
    };

    $scope.initSearch = function () {

        var fromDate = moment().subtract(7, 'day').format('YYYY-MM-DD');
        var toDate = moment().format('YYYY-MM-DD');

        $scope.model = {
            fromDate: fromDate,
            toDate: toDate
        };

    };

    $scope.search = function () {

        $scope.searchResult = {
            totalMinutes: 0,
            totalCount: 0
        };

        dataFactory.activity.search($scope.model).success(function (response) {
            $scope.activities = response.data;

            angular.forEach($scope.activities, function (activity) {
                $scope.searchResult.totalCount += 1;
                $scope.searchResult.totalMinutes += activity.duration;
            });
        });
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
                    //$state.reload();
                    $rootScope.$broadcast('update-task-board');
                });
        };
    };

    // Update Activity 
    //=====================================================================
    $scope.editeState = {};

    $scope.cancelOtherEdite = function () {
        $.each($scope.editeState, function (key, item) {
            $scope.editeState[key] = false;
        });
    };

    $scope.goToEditeMode = function (activityItem) {
        $scope.cancelOtherEdite();
        $scope.updateActivityModel = activityItem;
        $scope.editeState['editeMode' + activityItem.activityId] = true;
    };

    $scope.backToViewMode = function (activityItem) {
        $scope.editeState['editeMode' + activityItem.activityId] = false;
    };

    $scope.updateActivity = function () {
        dataFactory.activity.updateActivity($scope.updateActivityModel).
            success(function (response, status, headers, config) {
                $scope.backToViewMode($scope.updateActivityModel);
            });
    };
    // End
    //=====================================================================
}]);