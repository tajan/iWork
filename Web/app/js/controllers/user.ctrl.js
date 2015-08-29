iWork.controller('UserController', ['$rootScope', '$scope', 'dataFactory', '$state', 'authFactory', '$config', function ($rootScope, $scope, dataFactory, $state, authFactory, $config) {

    $scope.user = {};
    $scope.model = {};
    $scope.userId = $state.params['id'];

    /*=========================================================
    * Login user
    =========================================================*/
    $scope.login = function () {

        if ($scope.loginForm.$valid) {

            $scope.model.username = $scope.model.email;

            dataFactory.user.login($scope.model).then(function (response) {

                //setting authentication token in local storage to send for each request using request interception
                authFactory.setAuthenticationData(response.data);

                //setting logged in user in root scope
                dataFactory.user.getCurrent().success(function (response) {

                    authFactory.setUser(response.data);

                    //redirecting to default page (after login)
                    $state.transitionTo($config.DEFAULT_STATE);

                });



            }, function (response) {

                $scope.message = 'Invalid username or password!';

            });
        }
    };

    /*=========================================================
    * Logoff user
    =========================================================*/
    $scope.logout = function () {

        // clear browser data and global scope
        authFactory.clearAuthenticationData();

        // send post request to server side log off 
        dataFactory.user.logout().success(function (response) {
            // redirecting to login page 
            $state.transitionTo($config.LOGIN_STATE);
        });

    };

    /*=========================================================
    * Register User
    =========================================================*/
    $scope.register = function () {

        if ($scope.registerForm.$valid) {

            dataFactory.user.register($scope.model).then(function (response) {

                //setting authentication token in local storage to send for each request using request interception
                authFactory.setAuthenticationData(response.data);

                //setting registered user in root scope
                dataFactory.user.getCurrent().success(function (response) {

                    authFactory.setUser(response.data);

                    //redirecting to default page (after login)
                    $state.transitionTo($config.DEFAULT_STATE);

                });

            }, function (response) {
                $scope.message = response.message;
            });

        }
    };

    /**=========================================================
    * Update User Profile 
    =========================================================*/
    $scope.submitform = function (actionName, $event) {
        dataFactory.user.postAction(actionName, $scope.model);
    };

    $scope.initModel = function () {
        $scope.model = $rootScope.app.user;
    };

    $scope.initView = function () {
        if ($scope.userId) {
            $scope.user = dataFactory.user.getById($scope.userId);
        };
    };

}]);
