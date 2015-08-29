/**=========================================================
 * Module: general Repeater controller
 =========================================================*/
iWork.controller('RepeaterController', ['$config', '$http', '$scope', '$attrs', function ($config, $http, $scope, $attrs) {

    var apiUrl = $config.API_URL + '/' + $attrs.controllerName + '/' + $attrs.actionName;

    var vm = this;
    vm.items = [];

    $http.get(apiUrl).
                    success(function (response, status, headers, config) {
                        vm.items = response;
                    }).
                error(function (response, status, headers, config) {
                    $scope.message = 'No action was defined for this action!';
                });

}]);

