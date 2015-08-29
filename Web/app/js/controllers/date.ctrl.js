

/**=========================================================
 * Module: general date picker controller
 =========================================================*/
iWork.controller('DateController', ['$scope', '$attrs', function ($scope, $attrs) {

    $scope.open = function ($event) {
        $scope.opened = !$scope.opened;
        $event.preventDefault();
        $event.stopPropagation();
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

}]);