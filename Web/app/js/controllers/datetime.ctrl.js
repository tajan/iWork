
/**=========================================================
 * Module: general date time picker controller
 =========================================================*/
iWork.controller('DateTimeController', ['$scope', '$attrs', function ($scope, $attrs) {

    switch ($attrs['defaultDate']) {

        case 'now':
            $scope.model = {}
            $scope.model[$attrs['modelName']] = new Date();
            break;

        default:
            $scope.maxDate = null;

    };

    switch ($attrs['maxDate']) {

        case 'now':
            $scope.maxDate = new Date();
            break;

        default:
            $scope.maxDate = null;

    };

    switch ($attrs['minDate']) {

        case 'now':
            $scope.minDate = new Date();
            break;

        default:
            $scope.minDate = null;

    };

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

    //if ($attrs['modelName']) {
    //    $scope.model[$attrs['modelName']] = new Date();
    //};

}]);
