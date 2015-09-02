iWork.factory('publicSearchDataService', function ($rootScope) {
    return { term: $rootScope.$storage['search'] };
});