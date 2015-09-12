
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
            cache: true
        };
        if ($rootScope.imageCache[requestConfig.url]) {
            element[0].src = $rootScope.imageCache[requestConfig.url];
        } else {
        $http(requestConfig)
            .success(function (data) {
                if ($rootScope.imageCache[requestConfig.url]) {
                    //log("http src load from cache" + new Date() + new Date().getMilliseconds());
                    //attrs.$set('src', $rootScope.imageCache[requestConfig.url]);
                    //element.attr('src', $rootScope.imageCache[requestConfig.url]);
                    element[0].src = $rootScope.imageCache[requestConfig.url];
                } else {
                    //log("http src load from respone" + new Date() + new Date().getMilliseconds());
                    var arr = new Uint8Array(data);
                    var raw = '';
                    var i, j, subArray, chunk = 5000;
                    for (i = 0, j = arr.length; i < j; i += chunk) {
                        subArray = arr.subarray(i, i + chunk);
                        raw += String.fromCharCode.apply(null, subArray);
                    }
                    var b64 = btoa(raw);
                    $rootScope.imageCache[requestConfig.url] = "data:image/jpeg;base64," + b64;
                    //log($rootScope.imageCache[requestConfig.url])
                    //attrs.$set('src', "data:image/jpeg;base64," + b64);
                    //element.attr('src', $rootScope.imageCache[requestConfig.url]);
                    element[0].src = $rootScope.imageCache[requestConfig.url];
                }
            });
        }
    }
}]);