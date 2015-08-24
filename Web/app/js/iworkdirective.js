
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


iWork.directive('smartInputDirection', function () {
    return {
        restrict: "EA",
        link: function ($scope, element, attrs) {
            element.keyup(function () {
                var thiVal = $(this).val().charAt(0)
                , p = /^[\u0600-\u06FF\s]+$/;
                if (p.test(thiVal)) {
                    element.css({
                        direction: 'rtl'
                    });
                } else {
                    element.css({
                        direction: 'ltr'
                    });
                }
            });
        }
    }
})
