﻿
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
        $rootScope.$broadcast('boardScopeFiltering');
    };

    $scope.$watch('model', function(newVal, oldVal) {
        if (newVal === oldVal) return; 
        $scope.boardScopeFilter();
    }, true);
}]);
