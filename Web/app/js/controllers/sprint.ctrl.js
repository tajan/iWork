

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