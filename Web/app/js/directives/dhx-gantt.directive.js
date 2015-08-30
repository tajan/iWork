
iWork.directive('dhxGantt', function () {
    return {
        restrict: 'A',
        scope: false,
        transclude: true,
        template: '<div ng-transclude></div>',

        link: function ($scope, $element, $attrs, $controller) {
            //watch data collection, reload on changes
            $scope.$watch($attrs.data, function (collection) {
                gantt.clearAll();
                gantt.parse(collection, "json");
            }, true);

            //size of gantt
            $scope.$watch(function () {
                return $element[0].offsetWidth + "." + $element[0].offsetHeight;
            }, function () {
                gantt.setSizes();
            });

            //init gantt
            gantt.init($element[0]);
        }
    };
});

