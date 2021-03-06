﻿var iWork = angular.module('iWork', ['angle', 'ui.select', 'cfp.hotkeys', 'highcharts-ng', 'angular.filter', 'frapontillo.bootstrap-switch']);
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


iWork.run(['$rootScope', 'hotkeys', '$window', '$state', '$timeout', 'Notify', function ($rootScope, hotkeys, $window, $state, $timeout, Notify) {
    $rootScope.imageCache = {};
    hotkeys.bindTo($rootScope).add({
        combo: 'ctrl+f',
        description: 'Open search',
        callback: function (event) {
            event.preventDefault();
            $timeout(function () {
                $('[search-open]').trigger('click');
            }, 100);
        }
    }).add({
        combo: 'f',
        description: 'Go to fullscreen mode',
        callback: function (event) {
            $timeout(function () {
                $('[toggle-fullscreen]').trigger('click');
            }, 100);
        }
    }).add({
        combo: 'ctrl+right',
        description: 'Back page',
        callback: function (event) {
            event.preventDefault();
            $window.history.forward()
        }
    }).add({
        combo: 'ctrl+left',
        description: 'Next Page',
        callback: function (event) {
            event.preventDefault();
            $window.history.back()
        }
    }).add({
        combo: 'n',
        description: 'Next Page',
        callback: function (event) {
            event.preventDefault();
            $timeout(function () {
                $('[ui-sref*=add]').first().trigger('click');
            }, 100);
        }
    }).add({
        combo: 'alt+n',
        description: 'Next Page',
        callback: function (event) {
            event.preventDefault();
            $timeout(function () {
                $($('[ui-sref*=add]')[1]).trigger('click');
            }, 100);
        }
    }).add({
        combo: 'r',
        description: 'Next Page',
        callback: function (event) {
            $state.reload();
        }
    }).add({
        combo: 'ctrl+o',
        description: 'Next Page',
        callback: function (event) {
            event.preventDefault();
            $timeout(function () {
                $('[toggle-state=offsidebar-open]').trigger('click');
            }, 100);
        }
    }).add({
        combo: 'c',
        description: 'Collapse All',
        callback: function (event) {
            event.preventDefault();
            $timeout(function () {
                $('[panel-collapse]').each(function () {
                    if ($(this).find(".fa-plus.ng-hide").length > 0) {
                        $(this).trigger("click")
                    }
                })
            }, 100);

        }
    }).add({
        combo: 'e',
        description: 'Expand All',
        callback: function (event) {
            event.preventDefault();
            $timeout(function () {
                $('[panel-collapse]').each(function () {
                    if ($(this).find(".fa-minus.ng-hide").length > 0) {
                        $(this).trigger("click")
                    }
                })
            }, 100);

        }
    }).add({
        combo: 'ctrl+shift+f',
        description: 'Expand All',
        callback: function (event) {
            event.preventDefault();
            $timeout(function () {
                if ($('[ng-controller=ClientFiltering]').find("label.active").is(":last-child")) {
                    $('[ng-controller=ClientFiltering]').find("label:nth-child(2)").trigger('click')
                } else {
                    $('[ng-controller=ClientFiltering]').find("label.active").next().trigger('click')
                }
            }, 100);

        }
    }).add({
        combo: 'ctrl+alt+]',
        description: 'Expand All',
        callback: function (event) {
            if ($('HTML').css('-webkit-transform') == 'none') {
                $('HTML').css({
                    '-webkit-transform': 'rotate(180deg)',
                    '-moz-transform': 'rotate(180deg)',

                });
            } else {
                $('HTML').css({
                    '-webkit-transform': 'rotate(0deg)',
                    '-moz-transform': 'rotate(0deg)'
                });
                $('HTML').css('-webkit-transform','none')
            }
        }
    }).add({
        combo: ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "چ", "گ", "ک", "م", "ن", "ت", "ا", "ل", "ب", "ی", "س", "ش", "و", "ئ", "د", "ذ", "ر", "ز", "ط", "ظ"],
        description: 'Expand All',
        callback: function (event) {
            Notify.alert(
                  "Keyboard is persian! hotkeys dosent work on this layout",
                  { status: 'warning', pos: 'bottom-right' }
              );
        }
    });







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
