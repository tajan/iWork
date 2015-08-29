iWork.directive('ganttColumnAdd', ['$filter', function ($filter) {
    return {
        restrict: 'AE',
        terminal: true,
        link: function () {
            gantt.config.columns.push({ width: 45, name: "add" });
        }
    }
}]);