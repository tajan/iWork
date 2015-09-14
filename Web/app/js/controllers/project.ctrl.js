iWork.controller('ProjectController', ['$scope', '$rootScope', 'dataFactory', '$state', 'colors', 'clientFilteringDataService', '$filter',
    function ($scope, $rootScope, dataFactory, $state, colors, clientFilteringDataService, $filter) {

        var projectId = $state.params["id"];

        $scope.model = {};
        $scope.members = [];
        $scope.projects = [];
        $scope.sprints = [];
        $scope.tasks = [];
        $scope.activity = [];
        $scope.userStories = [];
        $scope.ganttTask = { data: [] };
        $scope.filterQuery = clientFilteringDataService.params;

        $rootScope.$on("clientFiltering", function (a, model) {
            $scope.filterQuery = model;
        });

        $scope.initProjectsView = function () {
            //Project data
            dataFactory.project.getAll().success(function (response) {
                $scope.projects = response.data;
            });
        };

        $scope.initProjectView = function () {
            gantt.config.add_column = false;
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

                dataFactory.task.getByProject(projectId).success(function (response) {
                    $scope.tasks = response.data;
                    angular.forEach($scope.tasks, function (task, index) {
                        var startDate = moment(task.startDate).format('DD-MM-YYYY');
                        var endDate = moment(task.realEndDate || task.dueDate);
                        var duration = parseInt(moment.duration(endDate.diff(startDate)).asDays() + 1);
                        var ganttTask = { id: task.taskId, text: task.title, start_date: startDate, duration: duration, progress: task.progress / 100, status: task.status };
                        $scope.ganttTask.data.push(ganttTask);
                        dataFactory.activity.getByTask(task.taskId).success(function (response) {
                            $.each(response.data, function (index, item) {
                                item.taskType = task.type;
                            });
                            $scope.activity = $scope.activity.concat(response.data);
                            if ($scope.tasks.length - 1 == index) {
                                $scope.initChart();
                            }
                        });
                    });
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

        // Chart ------------------------------------------

        $scope.initChart = function () {
            $scope.chartData = [];
            $scope.chartCategories = [];
            var data = $filter('groupBy')($scope.activity, 'user.displayName');
            var general = {
                name: 'general',
                data: []
            };
            var support = {
                name: 'support',
                data: []
            };
            $.each(data, function (index, activity) {
                var activityTaskTypeGroup = $filter('groupBy')(activity, 'taskType');
                $scope.chartCategories.push(index);
                if (activityTaskTypeGroup['1']) {
                    var generalActivitySum = $filter('sumFilter')(activityTaskTypeGroup['1'], 'duration');
                    general.data.push(generalActivitySum);
                }
                if (activityTaskTypeGroup['2']) {
                    var supportActivitySum = $filter('sumFilter')(activityTaskTypeGroup['2'], 'duration');
                    support.data.push(supportActivitySum);
                }
            });
            $scope.chartData.push(general);
            $scope.chartData.push(support);
            $scope.chartConfig = {
                options: {
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: 'column'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            return this.x + '<br/><b>' + this.series.name + '</b> : ' + moment.duration(this.y, "minutes").format();
                        }
                    },
                },
                colorAxis: {
                    minColor: '#FFFFFF',
                    maxColor: Highcharts.getOptions().colors[0]
                },
                xAxis: {
                    categories: $scope.chartCategories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Duration'
                    }
                },
                series: $scope.chartData,
                title: {
                    text: "Users Activity Chart"
                }
            }
        }
    }]);