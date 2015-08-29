var iWork = angular.module('iWork', ['angle']);
var log = function (i) {
    console.log(i)
}
/**=========================================================
 * Application constants and configurations
 =========================================================*/
iWork.constant("$config", {
    API_URL: '/api',
    DEFAULT_STATE: 'app.index',
    LOGIN_STATE: 'page.login',
    RECOVER_STATE: 'page.recover',
    PROFILE_STATE: 'app.userprofile'
});


iWork.run(['$rootScope', function ($rootScope) {

    // Scope Globals
    // ----------------------------------- 
    var app = $rootScope.app;
    $rootScope.app = {
        name: 'iWork',
        description: 'iWork - Manage your daily works!',
        year: ((new Date()).getFullYear()),
        layout: {
            isFixed: true,
            isCollapsed: true,
            isBoxed: false,
            isRTL: false,
            horizontal: false,
            isFloat: false,
            asideHover: false,
            theme: null
        },
        useFullLayout: false,
        hiddenFooter: false,
        viewAnimation: 'ng-fadeInUp',
        userBlockVisible: true
    };
}]);

function templateHelper($element) {
    var template = $element[0].innerHTML;
    return template.replace(/[\r\n]/g, "").replace(/"/g, "\\\"").replace(/\{\{task\.([^\}]+)\}\}/g, function (match, prop) {
        if (prop.indexOf("|") != -1) {
            var parts = prop.split("|");
            return "\"+gantt.aFilter('" + (parts[1]).trim() + "')(task." + (parts[0]).trim() + ")+\"";
        }
        return '"+task.' + prop + '+"';
    });
}
