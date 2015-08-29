/**=========================================================
 * Module: sortable.js
 * Sortable controller
 =========================================================*/
iWork.controller('SortableController', ['$scope', function ($scope) {

    // Single List
    $scope.data = ['New', 'Todo', 'In Progress', 'Done', 'Archived'];
    $scope.model.workflows = $scope.data;
    $scope.add = function () {
        $scope.data.push('New Step ' + ($scope.data.length + 1));
    };

    $scope.remove = function (item) {
        var index = $scope.data.length - 1;
        while (index != -1) {
            if ($scope.data[index] == item) {
                $scope.data.splice(index, 1);
            };
            index -= 1;
        };
    };

    $scope.sortableCallback = function (sourceModel, destModel, start, end) {
        //console.log(start + ' -> ' + end);
        //console.log(sourceModel);
        //console.log(destModel);
    };

    $scope.sortableOptions = {
        placeholder: '<div class="box-placeholder p0 m0"><div></div></div>',
        forcePlaceholderSize: true
    };

}]);