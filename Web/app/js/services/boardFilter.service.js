iWork.factory('boardFilterService', function ($rootScope) {
     return { boardScope: $rootScope.$storage['boardScope'] };
});