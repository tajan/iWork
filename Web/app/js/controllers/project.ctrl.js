iWork.controller('ProjectController', ['$scope', 'dataFactory', '$state', 'colors', function ($scope, dataFactory, $state, colors) {

    var projectId = $state.params["id"];

    $scope.model = {};
    $scope.members = [];
    $scope.projects = [];
    $scope.sprints = [];
    $scope.tasks = [];
    $scope.userStories = [];
    $scope.ganttTask = { data: [] };

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
                angular.forEach($scope.tasks, function (task) {

                    var startDate = moment(task.startDate).format('DD-MM-YYYY');
                    var endDate = moment(task.realEndDate || task.dueDate);
                    var duration = parseInt(moment.duration(endDate.diff(startDate)).asDays() + 1);

                    var ganttTask = { id: task.taskId, text: task.title, start_date: startDate, duration: duration, progress: task.progress / 100, status: task.status };
                    $scope.ganttTask.data.push(ganttTask);
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

}]);