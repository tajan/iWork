iWork.factory('filteringDataService', ['$rootScope', function ($rootScope) {
    if ($rootScope.$storage['filtering']) {
        params = JSON.parse($rootScope.$storage['filtering']);
    }else{
        params = null;
    }
    return { params: params };
}]);