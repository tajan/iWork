iWork.controller('publicSearchController', ['$rootScope', '$scope', '$state', 'publicSearchDataService', function ($rootScope, $scope, $state, publicSearchDataService) {
    $scope.term = publicSearchDataService.term;
    $scope.search = function () {
        $scope.$storage['search'] = $scope.term;
        publicSearchDataService.term = $scope.term;
        $state.reload();
    };
}]);
