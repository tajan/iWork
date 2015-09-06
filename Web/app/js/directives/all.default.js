
iWork.directive('classyloader', ["$timeout", "Utils", function ($timeout, Utils) {
    'use strict';

    var $scroller = $(window),
        inViewFlagClass = 'js-is-in-view'; // a classname to detect when a chart has been triggered after scroll

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // run after interpolation  
            $timeout(function () {

                var $element = $(element),
                    options = $element.data();

                // At lease we need a data-percentage attribute
                if (options) {
                    if (options.triggerInView) {

                        $scroller.scroll(function () {
                            checkLoaderInVIew($element, options);
                        });
                        // if the element starts already in view
                        checkLoaderInVIew($element, options);
                    }
                    else
                        startLoader($element, options);
                }

            }, 0);

            function checkLoaderInVIew(element, options) {
                var offset = -20;
                if (!element.hasClass(inViewFlagClass) &&
                    Utils.isInView(element, { topoffset: offset })) {
                    startLoader(element, options);
                }
            }

            function startLoader(element, options) {
                element.ClassyLoader(options).addClass(inViewFlagClass);
            }
        }
    };
}]);

iWork.directive('sparkline', ['$timeout', '$window', function ($timeout, $window) {

    'use strict';

    return {
        restrict: 'EA',
        controller: ["$scope", "$element", function ($scope, $element) {
            var runSL = function () {
                initSparLine($element);
            };

            $timeout(runSL);
        }]
    };

    function initSparLine($element) {
        var options = $element.data();
        options.type = options.type || 'bar'; // default chart is bar
        options.disableHiddenCheck = true;

        $element.sparkline('html', options);

        if (options.resize) {
            $(window).resize(function () {
                $element.sparkline('html', options);
            });
        }
    }

}]);
