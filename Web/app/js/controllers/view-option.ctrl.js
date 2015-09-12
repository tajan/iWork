
iWork.controller('ViewOptionsController', ['$rootScope', '$scope', '$rootScope', 'viewOptionService',
    function ($rootScope, $scope,  $rootScope, viewOptionService) {
        $scope.model = {};
        $scope.update = function () {
            viewOptionService.params = $scope.model;
        }

        $scope.setDefault = function (arg) {
            $scope.model = arg;
            $scope.update();
        };

        $scope.$watch('model', function () {
            $scope.update();
        },true)

    }]);
