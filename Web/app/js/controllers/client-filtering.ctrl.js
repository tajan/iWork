iWork.controller('ClientFiltering', ['$scope', '$rootScope', 'clientFilteringDataService', function ($scope, $rootScope, clientFilteringDataService) {
    $scope.model = {};
    $scope.init = function (model) {
        $scope.model = model;
    };
    $scope.filter = function () {
        var filterModel = jQuery.extend({}, $scope.model);
        // Remove null from filtering
        $.each(filterModel, function (key, value) {
            if (value == 'null') {
                delete filterModel[key];
            }
        });
        clientFilteringDataService.params = filterModel;
        $rootScope.$broadcast('clientFiltering', filterModel);
    };
    $scope.$watch('model', function () {
        $scope.filter();
    }, true);
}]);