
iWork.controller('boardFilterController', ['$rootScope', '$scope', '$state', 'boardFilterService', function ($rootScope, $scope, $state, boardFilterService) {
    $scope.model = {};
    $scope.model.boardScopeValue;

    $scope.init = function (model) {
       $scope.model = model;
    };

    $scope.boardScopeFilter = function () {

        var boardScope = $scope.model.boardScopeValue;
        $scope.$storage['boardScope'] = boardScope;
        boardFilterService.boardScope = boardScope;
        // Loop happens here
        //$state.reload();
    };

    // watch for model in iWork\Web\iView\index.html
    $scope.$watch('model', function () {
        $scope.boardScopeFilter();
    }, true);
}]);
