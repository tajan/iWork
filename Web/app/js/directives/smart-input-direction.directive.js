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
