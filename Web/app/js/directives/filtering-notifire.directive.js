iWork.directive('filteringNotifier', function (filteringDataService) {
    return {
        restrict: "EA",
        link: function ($scope, element, attrs) {
            if (filteringDataService.params.filtering) {
                element.show();
            } else {
                element.hide();
            }
        }
    }
});