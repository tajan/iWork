iWork.directive('searchNotifier', function (publicSearchDataService) {
    return {
        restrict: "EA",
        link: function ($scope, element, attrs) {
            if (publicSearchDataService.term && publicSearchDataService.term.length > 0) {
                element.show();
            } else {
                element.hide();
            }
        }
    }
});