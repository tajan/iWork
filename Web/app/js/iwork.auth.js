'use strict';

iWork.run(['$config', '$rootScope', 'authFactory', '$state', 'dataFactory', function ($config, $rootScope, authFactory, $state, dataFactory) {

    // Setting user data in global scope
    // ----------------------------------- 
    var app = $rootScope.app;
    app.user = {};

    //chcek authentication token
    var authenticationToken = authFactory.getAuthenticationData();

    if (authenticationToken) {

        //if user is authenticated, set current user model in root scope
        dataFactory.user.getCurrent().success(function (response) {
            app.user = response.data;
        });

    };

    //register listener to watch route changes
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

        if (!authFactory.hasAccess(toState)) {

            // no logged user, we should be going to #login
            $state.transitionTo($config.LOGIN_STATE);
            event.preventDefault();

        };
    });

}]);


iWork.factory('authFactory', ['$config', '$rootScope', function ($config, $rootScope) {

    var authFactory = {};
    var strongKeyName = 'authorizationData';

    authFactory.setAuthenticationData = function (authData) {

        $rootScope.$storage.setItem(strongKeyName, JSON.stringify({
            token: authData.access_token,
            userName: authData.userName,
            email: authData.email,
            userId: authData.userId,
            refreshToken: "",
            useRefreshTokens: false
        } || {}));

    };

    authFactory.getAuthenticationData = function () {
        return JSON.parse($rootScope.$storage.getItem(strongKeyName));
    };

    authFactory.clearAuthenticationData = function () {
        $rootScope.$storage.removeItem(strongKeyName);
        $rootScope.app.user = {};
    };

    authFactory.setUser = function (user) {
        $rootScope.app.user = user;
    };

    authFactory.hasAccess = function (toState) {

        if (toState.access && toState.access == 'public') {
            return true;
        };

        if (authFactory.getAuthenticationData()) {
            return true;
        };

        return false;

    }

    return authFactory;

}]);

/**=========================================================
 * Authentication interception
 =========================================================*/
iWork.factory('authInterceptor', ['$q', 'authFactory', '$rootScope', '$config', function ($q, authFactory, $rootScope, $config) {

    return {
        request: function (config) {
            config.headers = config.headers || {};
            var authData = authFactory.getAuthenticationData();
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }
            return config || $q.when(config);
        },
        requestError: function (request) {
            return $q.reject(request);
        },
        response: function (response) {
            return response || $q.when(response);
        },
        responseError: function (response) {
            if (response && response.status === 401) {
                $rootScope.$state.transitionTo($config.LOGIN_STATE);
            }

            if (response && response.status === 404) {
            }

            if (response && response.status >= 500) {

            }

            return $q.reject(response);

        }
    };
}]);

iWork.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}]);

