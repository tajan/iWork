

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