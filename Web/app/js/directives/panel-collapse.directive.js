
/**=========================================================
 * Collapse panels * [panel-collapse]
 =========================================================*/
iWork.directive('panelCollapse', ['$timeout', function ($timeout) {
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
                $scope[panelId] = currentState;
            }
            else {
                $scope[panelId] = $elem.attr('isCollapsed');
            }
            if ($scope[panelId] == false) {
                parent.find('.panel-wrapper').removeClass("hidden");
            }

            // bind events to switch icons
            $element.bind('click', function () {
                parent.find('.panel-wrapper').removeClass("hidden");
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