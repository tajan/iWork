
iWork.controller('ActivityController', function ($scope, dataFactory, $state, $rootScope, viewOptionService, $filter) {
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


    $scope.dateOrder = function (item) {
        return moment(item[0].activityDateTime).unix();
    };
    // View Options
    //=====================================================================
    $scope.viewOption = viewOptionService.params;

    // Activity Search
    //=====================================================================
    $scope.search = function () {
        $scope.searchResult = {
            totalMinutes: 0,
            totalCount: 0,
            totalHour: 0
        };
        dataFactory.activity.search($scope.model).success(function (response) {
            $scope.activities = response.data;
            angular.forEach($scope.activities, function (activity) {
                $scope.searchResult.totalCount += 1;
                $scope.searchResult.totalMinutes += activity.duration;
            });
            $scope.initChart();
        });
    };
    // End
    //=====================================================================
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
    $scope.updateActivityModel = {};
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

    $scope.initChart = function () {
        $scope.$watch('viewOption', function () {
            $scope.bootstrapChart();
        }, true);
        $scope.bootstrapChart = function () {
            if ($scope.viewOption.group == 'project') {
                var groupKey = 'projectId';
            } else if ($scope.viewOption.group == 'user') {
                var groupKey = 'userId';
            } else if ($scope.viewOption.group == 'daily') {
                var groupKey = 'activityDateTime';
            }
            var preData = $filter('groupBy')($scope.activities, groupKey);
            var data = $filter('toArray')(preData);
            var dataLabelsEnabled = true;
            $scope.chartData = [];
            $.each(data, function (index, arr) {
                if ($scope.viewOption.group == 'project') {
                    var titleKey = arr[0]['projectTitle'];
                    chartTitleText = "By Projects";
                } else if ($scope.viewOption.group == 'user') {
                    var titleKey = arr[0]['user']['displayName'];
                    chartTitleText = "By User";
                } else if ($scope.viewOption.group == 'daily') {
                    var titleKey = new moment(arr[0]['activityDateTime']).format("YYYY/MM/DD");
                    chartTitleText = "Daily";
                    dataLabelsEnabled = false;
                }
                var o = {
                    name: titleKey,
                    value: $filter('sumFilter')(arr, 'duration'),
                    dataLabels: "dataLabels"
                }
                $scope.chartData.push(o);
            });
            $scope.chartConfig = {
                options: {
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.key + '</b> : ' + moment.duration(this.point.value, "minutes").format();
                        }
                    },
                    credits: {
                        enabled: false
                    }
                },
                colorAxis: {
                    minColor: '#FFFFFF',
                    maxColor: Highcharts.getOptions().colors[0]
                },
                series: [{
                    type: "treemap",
                    layoutAlgorithm: 'squarified',
                    data: $scope.chartData,
                    dataLabels: {
                        enabled: dataLabelsEnabled
                    }
                }],

                title: {
                    text: chartTitleText
                }
            }
        }
    }
});