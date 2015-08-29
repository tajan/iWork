iWork.directive('ganttTemplate', ['$filter', function ($filter) {
    gantt.aFilter = $filter;

    return {
        restrict: 'AE',
        terminal: true,

        link: function ($scope, $element, $attrs, $controller) {
            var template = Function('sd', 'ed', 'task', 'return "' + templateHelper($element) + '"');
            gantt.templates[$attrs.ganttTemplate] = template;
        }
    };
}]);