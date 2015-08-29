
/**=========================================================
 * Initializes the style Picker plugin
 =========================================================*/
iWork.directive('stylePicker', function () {

    var defaultStyles = [
        'danger',
        'primary',
        'info',
        'success',
        'warning',
        'green',
        'pink',
        'inverse',
        'purple',
        'yellow',
    ];

    return {
        scope: {
            ngModel: '=',
            customizedStyles: '=styles'
        },
        require: '^ngModel',
        restrict: 'E',
        template: '<ul class="list-inline external-event-color-selector">' +
                '<li class="p0" ng-repeat="style in styles">' +
                '<div ng-click="pick(style)" ng-class="{selected: (style===ngModel)}" class="circle circle-{{style}} circle-xl""></div>' +
                '</li></ul>',
        link: function (scope, element, attr) {

            scope.styles = scope.customizedStyles || defaultStyles;

            scope.$watch('ngModel', function (newVal) {
                if (newVal) {
                    scope.ngModel = newVal;
                }
                else {
                    scope.ngModel = scope.styles[0];
                };
            });

            scope.pick = function (style) {
                scope.ngModel = style;
            };
        }
    };

});