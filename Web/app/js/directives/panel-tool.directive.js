
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
