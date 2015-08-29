
iWork.directive('scoreRadioButtonGroup', function () {

    var defaultScoreOptions = [
        { id: 0, name: "0" },
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 5, name: "5" },
        { id: 8, name: "8" },
        { id: 10, name: "10" },
        { id: 15, name: "15" },
        { id: 20, name: "20" },
        { id: 30, name: "30" }];

    return {
        restrict: 'E',
        replace: true,
        scope: {
            ngModel: '=',
            customizedScoreOptions: '=scoreOptions'
        },
        require: '^ngModel',
        link: function (scope, element, attr) {

            scope.scoreOptions = scope.customizedScoreOptions || defaultScoreOptions;

            scope.$watch('ngModel', function (newVal) {
                if (newVal) {
                    scope.ngModel = newVal;
                }
                else {
                    scope.ngModel = scope.scoreOptions[0].id;
                };
            });

            scope.activate = function (option, $event) {
                scope.ngModel = option.id;
                // stop the click event to avoid that Bootstrap toggles the "active" class
                if ($event.stopPropagation) { $event.stopPropagation(); }
                if ($event.preventDefault) { $event.preventDefault(); }
                $event.cancelBubble = true;
                $event.returnValue = false;
            };

            scope.isActive = function (option) {
                return option.id == scope.ngModel;
            };

        },
        template: "<span><button type='button' class='btn btn-default' ng-class='{active: isActive(option)}'" +
            "ng-repeat='option in scoreOptions' ng-click='activate(option, $event)'>{{option.name}} " +
            "</button></span>"
    };
});
