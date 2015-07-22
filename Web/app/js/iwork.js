

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

/**=========================================================
 * Initializes the single File Uploader plugin
 =========================================================*/
iWork.directive('singleFileUploader', function () {
    return {
        scope: true,
        restrict: "A",
        controller: function ($config, $http, $scope, $element, $attrs, FileUploader, authFactory) {

            $scope.deleteFile = function (idx) {

                var apiUrl = $config.API_URL + '/file/remove';
                var file = $scope.model.filesList[idx];

                $http.post(apiUrl, file).
                    success(function (response, status, headers, config) {
                        $scope.model.filesList.splice(idx, 1);
                    }).
                    error(function (response, status, headers, config) {
                        $scope.message = response;
                    });
            };

            var authData = authFactory.getAuthenticationData();

            var uploader = $scope.uploader = new FileUploader({
                url: $config.API_URL + '/file/upload',
                headers: { 'Authorization': 'Bearer ' + authData.token },
                autoUpload: true,
                withCredentials: true
            });

            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                $element.find('[single-file-id]').val(response[0].fileId).trigger('change');
            };

        }
    }


    return {
        scope: true,
        restrict: "A",
        controller: function ($scope, $element, $attrs, FileUploader) {
            var uploader = $scope.uploader = new FileUploader({
                url: '/api/file/upload',
                autoUpload: true
            });
            uploader.onProgressItem = function (fileItem, progress) {
                $scope.progress = progress;
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                $element.find('[single-file-id]').val(response[0].fileId).trigger('change');
            };
        }
    }
});

/**=========================================================
 * Initializes the multiple File Uploader plugin
 =========================================================*/
iWork.directive('multipleFileUploader', function () {
    return {
        scope: true,
        restrict: "A",
        controller: function ($config, $http, $scope, $element, $attrs, FileUploader, authFactory) {

            $scope.deleteFile = function (idx) {

                var apiUrl = $config.API_URL + '/file/remove';
                var file = $scope.model.filesList[idx];

                $http.post(apiUrl, file).
                    success(function (response, status, headers, config) {
                        $scope.model.filesList.splice(idx, 1);
                    }).
                    error(function (response, status, headers, config) {
                        $scope.message = response;
                    });
            };

            var authData = authFactory.getAuthenticationData();

            var uploader = $scope.uploader = new FileUploader({
                url: $config.API_URL + '/file/upload',
                headers: { 'Authorization': 'Bearer ' + authData.token },
                autoUpload: true,
                withCredentials: true
            });

            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                $element.find('[multiple-file-id]')[0].value += response[0].fileId + ',';
                $element.find('[multiple-file-id]').trigger('change');
            };

        }
    }
});


/**=========================================================
 * Module: filestyle.js
 * Initializes the fielstyle plugin
 =========================================================*/
iWork.directive('filestyle', function () {
    return {
        restrict: 'A',
        controller: ["$scope", "$element", function ($scope, $element) {
            var options = $element.data();

            // old usage support
            options.classInput = $element.data('classinput') || options.classInput;

            $element.filestyle(options);
        }]
    };
});


/**=========================================================
 * Initializes the panel tool plugin
 =========================================================*/
iWork.directive('paneltool', ["$compile", "$timeout", function ($compile, $timeout) {
    var templates = {
        /* jshint multistr: true */
        collapse: "<a isCollapsed='true' href='#' panel-collapse='' tooltip='Collapse Panel' ng-click='{{panelId}} = !{{panelId}}'> \
                <em ng-show='{{panelId}}' class='fa fa-plus'></em> \
                <em ng-show='!{{panelId}}' class='fa fa-minus'></em> \
              </a>",
        dismiss: "<a href='#' panel-dismiss='' tooltip='Close Panel'>\
               <em class='fa fa-times'></em>\
             </a>",
        refresh: "<a href='#' panel-refresh='' data-spinner='{{spinner}}' tooltip='Refresh Panel'>\
               <em class='fa fa-refresh'></em>\
             </a>"
    };

    function getTemplate(elem, attrs) {
        var temp = '';
        attrs = attrs || {};
        if (attrs.toolCollapse)
            temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')));
        if (attrs.toolDismiss)
            temp += templates.dismiss;
        if (attrs.toolRefresh)
            temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
        return temp;
    }

    return {
        restrict: 'E',
        scope: false,
        link: function (scope, element, attrs) {

            var tools = scope.panelTools || attrs;

            $timeout(function () {
                element.html(getTemplate(element, tools)).show();
                $compile(element.contents())(scope);

                element.addClass('pull-right');
            });

        }
    };
}])


/**=========================================================
 * Collapse panels * [panel-collapse]
 =========================================================*/
.directive('panelCollapse', ['$timeout', function ($timeout) {
    'use strict';

    var storageKeyName = 'panelState',
        storage;

    return {
        restrict: 'A',
        scope: false,
        controller: ["$scope", "$element", function ($scope, $element) {

            // Prepare the panel to be collapsible
            var $elem = $($element),
                parent = $elem.closest('.panel'), // find the first parent panel
                panelId = parent.attr('id');

            storage = $scope.$storage;

            // Load the saved state if exists
            var currentState = loadPanelState(panelId);

            if (typeof currentState !== 'undefined') {
                $timeout(function () {
                    $scope[panelId] = currentState;
                },
                  10);
            }
            else {
                $timeout(function () {
                    $scope[panelId] = $elem.attr('isCollapsed');
                },
                10);
            }

            // bind events to switch icons
            $element.bind('click', function () {

                savePanelState(panelId, !$scope[panelId]);

            });
        }]
    };

    function savePanelState(id, state) {
        if (!id) return false;
        var data = angular.fromJson(storage[storageKeyName]);
        if (!data) { data = {}; }
        data[id] = state;
        storage[storageKeyName] = angular.toJson(data);
    }

    function loadPanelState(id) {
        if (!id) return false;
        var data = angular.fromJson(storage[storageKeyName]);
        if (data) {
            return data[id];
        }
    }

}])

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
iWork.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

iWork.directive('scoreRadioButtonGroup', function () {

    var defaultScoreOptions = [
        { id: 0, name: "0" },
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 5, name: "5" },
        { id: 8, name: "8" },
        { id: 10, name: "10" },
        { id: 15, name: "15" },
        { id: 20, name: "20" },
        { id: 30, name: "30" }];

    return {
        restrict: 'E',
        replace: true,
        scope: {
            ngModel: '=',
            customizedScoreOptions: '=scoreOptions'
        },
        require: '^ngModel',
        link: function (scope, element, attr) {
            
            scope.scoreOptions = scope.customizedScoreOptions || defaultScoreOptions;

            scope.$watch('ngModel', function (newVal) {
                if (newVal) {
                    scope.ngModel = newVal;
                }
                else {
                    scope.ngModel = scope.scoreOptions[0].id;
                };
            });

            scope.activate = function (option, $event) {
                scope.ngModel = option.id;
                // stop the click event to avoid that Bootstrap toggles the "active" class
                if ($event.stopPropagation) { $event.stopPropagation(); }
                if ($event.preventDefault) { $event.preventDefault(); }
                $event.cancelBubble = true;
                $event.returnValue = false;
            };

            scope.isActive = function (option) {
                return option.id == scope.ngModel;
            };

        },
        template: "<span><button type='button' class='btn btn-default' ng-class='{active: isActive(option)}'" +
            "ng-repeat='option in scoreOptions' ng-click='activate(option, $event)'>{{option.name}} " +
            "</button></span>"
    };
});

/**=========================================================
 * Initializes the style Picker plugin
 =========================================================*/
iWork.directive('stylePicker', function () {

    var defaultStyles = [
        'danger',
        'primary',
        'info',
        'success',
        'warning',
        'green',
        'pink',
        'inverse',
        'purple',
        'yellow',
    ];

    return {
        scope: {
            ngModel: '=',
            customizedStyles: '=styles'
        },
        require: '^ngModel',
        restrict: 'E',
        template: '<ul class="list-inline external-event-color-selector">' +
                '<li class="p0" ng-repeat="style in styles">' +
                '<div ng-click="pick(style)" ng-class="{selected: (style===ngModel)}" class="circle circle-{{style}} circle-xl""></div>' +
                '</li></ul>',
        link: function (scope, element, attr) {

            scope.styles = scope.customizedStyles || defaultStyles;

            scope.$watch('ngModel', function (newVal) {
                if (newVal) {
                    scope.ngModel = newVal;
                }
                else {
                    scope.ngModel = scope.styles[0];
                };
            });

            scope.pick = function (style) {
                scope.ngModel = style;
            };
        }
    };

});

/**=========================================================
 * Module: fullscreen.js
 * Toggle the fullscreen mode on/off
 =========================================================*/

iWork.directive('toggleFullscreen', function () {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.on('click', function (e) {
                e.preventDefault();

                if (screenfull.enabled) {

                    screenfull.toggle();

                    // Switch icon indicator
                    if (screenfull.isFullscreen)
                        $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
                    else
                        $(this).children('em').removeClass('fa-compress').addClass('fa-expand');

                } else {
                    $.error('Fullscreen not enabled');
                }

            });
        }
    };

});


iWork.directive('windowNavigator', function factory($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.navBack = function () {
                $window.history.back();
            };
            scope.navForward = function () {
                $window.history.forward();
            };
        }
    };
});

// jQuery needed, uses Bootstrap classes, adjust the path of templateUrl
iWork.directive('fileDownloadList', function () {
    return {
        restrict: 'E',
        template: '<button href="" style="margin: 0px 3px 3px 0px;" class="btn btn-default btn-xs" ng-click="downloadFile(file)">{{file.name}}</button>',
        scope: true,
        link: function (scope, element, attr) {

        },
        controller: ['$scope', '$attrs', '$http', '$config', '$window', function ($scope, $attrs, $http, $config, $window) {

            // Based on an implementation here: web.student.tuwien.ac.at/~e0427417/jsdownload.html
            $scope.downloadFile = function (file) {

                var httpPath = $config.API_URL + '/file/getbyguid/' + file.guid;

                // Use an arraybuffer
                $http.get(httpPath, { responseType: 'arraybuffer' })
                .success(function (data, status, headers) {

                    var octetStreamMime = 'application/octet-stream';
                    var success = false;

                    // Get the headers
                    headers = headers();

                    // Get the filename from the x-filename header or default to "download.bin"
                    var filename = file.name; //headers['x-filename'] || 'download.bin';

                    // Determine the content type from the header or default to "application/octet-stream"
                    var contentType = headers['content-type'] || octetStreamMime;

                    try {
                        // Try using msSaveBlob if supported
                        //console.log("Trying saveBlob method ...");

                        var blob = new Blob([data], { type: contentType });
                        if (navigator.msSaveBlob)
                            navigator.msSaveBlob(blob, filename);
                        else {
                            // Try using other saveBlob implementations, if available
                            var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                            if (saveBlob === undefined) throw "Not supported";
                            saveBlob(blob, filename);
                        }
                        //console.log("saveBlob succeeded");
                        success = true;
                    } catch (ex) {
                        //console.log("saveBlob method failed with the following exception:");
                        //console.log(ex);
                    }

                    if (!success) {
                        // Get the blob url creator
                        var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                        if (urlCreator) {
                            // Try to use a download link
                            var link = document.createElement('a');
                            if ('download' in link) {
                                // Try to simulate a click
                                try {
                                    // Prepare a blob URL
                                    //console.log("Trying download link method with simulated click ...");
                                    var blob = new Blob([data], { type: contentType });
                                    var url = urlCreator.createObjectURL(blob);
                                    link.setAttribute('href', url);

                                    // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                                    link.setAttribute("download", filename);

                                    // Simulate clicking the download link
                                    var event = document.createEvent('MouseEvents');
                                    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                    link.dispatchEvent(event);

                                    //console.log("Download link method with simulated click succeeded");
                                    success = true;

                                } catch (ex) {
                                    //console.log("Download link method with simulated click failed with the following exception:");
                                    //console.log(ex);
                                }
                            }

                            if (!success) {
                                // Fallback to window.location method
                                try {
                                    // Prepare a blob URL
                                    // Use application/octet-stream when using window.location to force download
                                    //console.log("Trying download link method with window.location ...");
                                    var blob = new Blob([data], { type: octetStreamMime });
                                    var url = urlCreator.createObjectURL(blob);
                                    window.location = url;
                                    //console.log("Download link method with window.location succeeded");
                                    success = true;
                                } catch (ex) {
                                    //console.log("Download link method with window.location failed with the following exception:");
                                    //console.log(ex);
                                }
                            }

                        }
                    }

                    if (!success) {
                        // Fallback to window.open method
                        //console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                        window.open(httpPath, '_blank', '');
                    }
                })
                .error(function (data, status) {
                    //console.log("Request failed with status: " + status);

                    // Optionally write the error out to scope
                    $scope.errorDetails = "Request failed with status: " + status;
                });
            };

        }]
    }
});

iWork.directive('httpSrc', ['$rootScope', '$http', function ($rootScope, $http) {

    var directive = {
        link: link,
        restrict: 'A',
    };
    return directive;


    function link(scope, element, attrs) {

        var fileUrl = '/app/img/user.png';

        if (attrs.httpSrc) {
            fileUrl = '/api/file/getbyguid/' + attrs.httpSrc;
        };

        var requestConfig = {
            method: 'Get',
            url: fileUrl,
            responseType: 'arraybuffer',
            cache: 'true'
        };

        $http(requestConfig)
            .success(function (data) {
                var arr = new Uint8Array(data);

                var raw = '';
                var i, j, subArray, chunk = 5000;
                for (i = 0, j = arr.length; i < j; i += chunk) {
                    subArray = arr.subarray(i, i + chunk);
                    raw += String.fromCharCode.apply(null, subArray);
                }

                var b64 = btoa(raw);

                attrs.$set('src', "data:image/jpeg;base64," + b64);
            });
    }

}]);

iWork.filter('truncate', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

iWork.directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
        }
    };

}]);