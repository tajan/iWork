
iWork.directive('ganttColumn', ['$filter', function ($filter) {
    gantt.aFilter = $filter;

    return {
        restrict: 'AE',
        terminal: true,

        link: function ($scope, $element, $attrs, $controller) {
            var label = $attrs.label || " ";
            var width = $attrs.width || "*";
            var align = $attrs.align || "left";

            var template = Function('task', 'return "' + templateHelper($element) + '"');
            var config = { template: template, label: label, width: width, align: align };

            if (!gantt.config.columnsSet)
                gantt.config.columnsSet = gantt.config.columns = [];

            if (!gantt.config.columns.length)
                config.tree = true;
            gantt.config.columns.push(config);

        }
    };
}]);