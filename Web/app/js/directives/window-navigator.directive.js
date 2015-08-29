

iWork.directive('windowNavigator', function factory($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.navBack = function () {
                $window.history.back();
            };
            scope.navForward = function () {
                $window.history.forward();
            };
        }
    };
});