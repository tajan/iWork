iWork.controller('myBoardController', ['$config', '$scope', '$http', '$attrs', '$state', '$stateParams', '$timeout', '$window', function ($config, $scope, $http, $attrs, $state, $stateParams, $timeout, $window) {
    'use strict';


    // Component is optional
    if (!$.fn.sortable) return;

    angular.element(document).ready(function () {

        var Selector = '[portlet]';

        $timeout(function () {

            $(Selector).sortable({
                connectWith: Selector,
                items: 'div.panel',
                handle: '.portlet-handler',
                opacity: 0.7,
                placeholder: 'portlet box-placeholder',
                cancel: '.portlet-cancel',
                forcePlaceholderSize: true,
                iframeFix: false,
                tolerance: 'pointer',
                helper: 'original',
                revert: 200,
                forceHelperSize: true,
                start: saveListSize,
                update: savePortletOrder,
                create: loadPortletOrder
            })
            // optionally disables mouse selection
            //.disableSelection()
            ;
        }, 0);

    });

    function initBoard() {

        var apiStatusUrl = $config.API_URL + '/task/GetAllStatuses';
        var apiTaskUrl = $config.API_URL + '/task/getall';

        $scope.taskStatuses = [];
        $scope.tasks = [];

        $http.get(apiStatusUrl).success(function (result, status, headers, config) {
            $scope.taskStatuses = result;
        }).error(function (data, status, headers, config) {
            //alert(JSON.stringify(data));
        });

        $http.get(apiTaskUrl).success(function (result, status, headers, config) {
            $scope.tasks = result;
        }).error(function (data, status, headers, config) {
            //alert(JSON.stringify(data));
        });

    };

    function savePortletOrder(event, ui) {

        var apiUpdateUrl = $config.API_URL + '/task/UpdateStatuses';

        var self = event.target;
        var portletId = self.id;
        var taskStatusId = parseInt(portletId.replace('portlet', ''));
        var panelIds = $(self).sortable('toArray');
        var taskIds = [];

        angular.forEach(panelIds, function (panelId) {
            taskIds.push(parseInt(panelId.replace('panel', '')));
        });

        var model = {
            taskStatusId: taskStatusId,
            taskIds: taskIds
        };

        $http.post(apiUpdateUrl, model).success(function (result, status, headers, config) {
            
        }).error(function (data, status, headers, config) {
            //alert(JSON.stringify(data));
        });

        //save portlet size to avoid jumps
        saveListSize.apply(self);
    }

    function loadPortletOrder(event) {

        var self = event.target;
        //var data = angular.fromJson($scope.$storage[storageKeyName]);

        //if (data) {

        //    var porletId = self.id,
        //        panels = data[porletId];

        //    if (panels) {
        //        var portlet = $('#' + porletId);

        //        $.each(panels, function (index, value) {
        //            $('#' + value).appendTo(portlet);
        //        });
        //    }

        //}

        // save portlet size to avoid jumps
        saveListSize.apply(self);
    }

    // Keeps a consistent size in all portlet lists
    function saveListSize() {
        var $this = $(this);
        $this.css('min-height', $this.height());
    }

    function resetListSize() {
      $(this).css('min-height', "");
    }


    initBoard()
    resetListSize()

}]);

/**=========================================================
 * Module: general form controller, add, update, remove
 =========================================================*/
iWork.controller('FormController', ['$config', '$scope', '$http', '$attrs', '$state', '$stateParams', function ($config, $scope, $http, $attrs, $state, $stateParams) {

    $scope.model = {};

    //submit section
    $scope.submitform = function (actionName, $event) {

        var apiUrl = $config.API_URL + '/' + $attrs.controllerName + '/' + actionName;

        switch (actionName) {

            case 'cancel':
                ////cancel button will redirect to parent page
                //if ($state.current.parentUI) {
                //    $state.transitionTo($state.current.parentUI);
                //    return false;
                //}
                //else {
                //    $scope.message = 'There is no parent state!';
                //};

            default:
                $http.post(apiUrl, $scope.model).
                    success(function (response, status, headers, config) {

                        $scope.message = response.message;
                        $state.transitionTo($state.current.parentUI);
                        //if (response.hasError == 'False') {
                        //    if ($state.current.parentUI) {
                        //        $state.transitionTo($state.current.parentUI);
                        //    };
                        //};

                    }).
                error(function (response, status, headers, config) {
                    $scope.message = 'No action was defined for this action!';
                });
        };

    };

    $scope.init = function () {

        var key = $state.params["id"];
        if (key) {

            var apiUrl = $config.API_URL + '/' + $attrs.controllerName + '/getbyid/' + key;

            $http.get(apiUrl).
                success(function (response, status, headers, config) {
                    $scope.model = response.data;
                }).
            error(function (response, status, headers, config) {
                $scope.message = response;
            });
        }
        else {
            $scope.model = {};
        };
    };



}]);


/**=========================================================
 * Module: sortable.js
 * Sortable controller
 =========================================================*/
iWork.controller('SortableController', ['$scope', function ($scope) {
    
    // Single List
    $scope.data = [ 'New', 'Todo','In Progress', 'Done', 'Archived' ];
    $scope.model.workflows = $scope.data;
    $scope.add = function () {
        $scope.data.push('New Step ' + ($scope.data.length + 1));
    };

    $scope.remove = function (item) {
        var index = $scope.data.length - 1;
        while (index != -1) {
            if ($scope.data[index] == item) {
                $scope.data.splice(index, 1);
            };
            index -= 1;
        };
    };

    $scope.sortableCallback = function (sourceModel, destModel, start, end) {
        //console.log(start + ' -> ' + end);
        //console.log(sourceModel);
        //console.log(destModel);
    };

    $scope.sortableOptions = {
        placeholder: '<div class="box-placeholder p0 m0"><div></div></div>',
        forcePlaceholderSize: true
    };

}]);

/**=========================================================
 * Module: general grid controller
 =========================================================*/
iWork.controller('GridController', ['$config', '$scope', '$http', '$attrs', '$element', '$timeout', 'PublicSearchDataService', '$state', function ($config, $scope, $http, $attrs, $element, $timeout, PublicSearchDataService, $state) {
    
    var columnDefs = [];
    var columns = $element.children('columns');

    if (columns.length > 0) {

        angular.forEach(columns[0].children, function (item) {

            var column = $(item);

            var columnDef = {
                field: column.attr('field'),
                displayName: column.attr('display-name')
            };

            if (column.attr('format')) {

                switch (column.attr('format')) {
                    case 'date':
                        columnDef.cellFilter = 'date:\'yyyy/MM/dd\'';
                        break;

                    case 'content':
                        columnDef.cellTemplate = column[0].innerHTML;
                        break;

                };

            }

            columnDefs.push(columnDef);

        });
        
       
    };

    //setting webapi url
    var ngGridResourcePath = $config.API_URL + '/' + $attrs.controllerName + '/' + $attrs.actionName;

    $scope.items = [];
    $scope.totalServerItems = 0;

    // filter
    $scope.filterOptions = {
        PublicSearchDataService: PublicSearchDataService,
        filterText: '',
        useExternalFilter: true
    };

    // paging
    $scope.pagingOptions = {
        pageSizes: $attrs.pageSizes.split(','),     // page size options
        pageSize: $attrs.pageSize,       // default page size
        currentPage: parseInt($attrs.currentPage)  // initial page
    };

    // sort
    $scope.sortOptions = {
        fields: [],
        directions: [],
    };

    if ($attrs.sortFields) {
        $scope.sortOptions.fields = $attrs.sortFields.split(',');
        $scope.sortOptions.directions = $attrs.sortDirections.split(',');
    };


    $scope.gridOptions = {
        data: 'items',
        enablePaging: true,
        showFooter: true,
        rowHeight: $attrs.rowHeight,
        headerRowHeight: $attrs.headerRowHeight,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        sortInfo: $scope.sortOptions,
        enableColumnResize: true,
        //enablePinning: true,
        keepLastSelected: true,
        multiSelect: false,
        //showColumnMenu: true,
        //showFilter: true,
        //showGroupPanel: true,
        showFooter: true,
        useExternalSorting: true,
        beforeSelectionChange: function (rowItem, event) {
            if ($attrs.clickState) {
                var id = rowItem.entity.Id;
                $state.transitionTo($attrs.clickState, { id: id });
            }
        }
        //plugins: [new ngGridFlexibleHeightPlugin()]

    };

    if (columnDefs.length > 0) {
        $scope.gridOptions.columnDefs = columnDefs;
    };

    $scope.refresh = function () {
        setTimeout(function () {

            var params = {
                searchTerm: $scope.filterOptions.PublicSearchDataService.term,
                pageNumber: $scope.pagingOptions.currentPage,
                pageSize: $scope.pagingOptions.pageSize,
                sortFields: $scope.sortOptions.fields,
                sortDirections: $scope.sortOptions.directions
            };

            $http.post(ngGridResourcePath, params).success(function (result, status, headers, config) {
                
                $scope.items = result.data;
                $scope.totalServerItems = result.itemsCount;

            }).error(function (data, status, headers, config) {
                //alert(JSON.stringify(data));
            });

        }, 100);
    };

    // watches
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal.pageSize !== oldVal.pageSize || newVal.currentPage !== oldVal.currentPage) {
            $scope.refresh();
        }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.refresh();
        }
    }, true);

    $scope.$watch('sortOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.refresh();
        }
    }, true);

    //removing custom attributes
    $element.removeAttr('page-size')
            .removeAttr('page-sizes')
            .removeAttr('current-page')
            .removeAttr('controller-name')
            .removeAttr('action-name')
            .removeAttr('row-height')
            .removeAttr('header-row-height')
            .removeAttr('sort-fields')
            .removeAttr('sort-directions');

}]);
iWork.factory('PublicSearchDataService', function () {
    return { term: '' };
});
iWork.controller('PublicSearchController', ['$scope', '$http', '$attrs', '$element', '$timeout', 'PublicSearchDataService', function ($scope, $http, $attrs, $element, $timeout, PublicSearchDataService) {

    $scope.PublicSearchDataService = PublicSearchDataService;

    $scope.submitForm = function () {
        $scope.PublicSearchDataService.term = $scope.term;
    };

}]);





/**=========================================================
 * Module: general date picker controller
 =========================================================*/
iWork.controller('DateController', ['$scope', '$attrs', function ($scope, $attrs) {

    $scope.open = function ($event) {
        $scope.opened = !$scope.opened;
        $event.preventDefault();
        $event.stopPropagation();
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

}]);

/**=========================================================
 * Module: general date time picker controller
 =========================================================*/
iWork.controller('DateTimeController', ['$scope', '$attrs', function ($scope, $attrs) {

    switch ($attrs['defaultDate']) {

        case 'now':
            $scope.model = {}
            $scope.model[$attrs['modelName']] = new Date();
            break;

        default:
            $scope.maxDate = null;

    };

    switch ($attrs['maxDate']) {

        case 'now':
            $scope.maxDate = new Date();
            break;

        default:
            $scope.maxDate = null;

    };

    switch ($attrs['minDate']) {

        case 'now':
            $scope.minDate = new Date();
            break;

        default:
            $scope.minDate = null;

    };

    $scope.open = function ($event) {
        $scope.opened = !$scope.opened;
        $event.preventDefault();
        $event.stopPropagation();
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

    //if ($attrs['modelName']) {
    //    $scope.model[$attrs['modelName']] = new Date();
    //};

}]);


/**=========================================================
 * Module: general calendar controller
 =========================================================*/
iWork.controller('CalendarController', ['$scope', '$http', '$attrs', '$element', '$timeout', '$state', function ($scope, $http, $attrs, $element, $timeout, $state) {

    if (!$.fn.fullCalendar) return;

    var baseApiUrl = httpApiService.getApiUrl('/' + $attrs['controllerName'] + '/');

    var apiUrl = baseApiUrl + $attrs['actionName'];
    var items = [];

    function initCalendarElement(calElement) {

        var searchParams = {
            fromDate: '',
            toDate: ''
        };

        $http.get(apiUrl, { params: searchParams }).success(function (result, status, headers, config) {

            angular.forEach(result.data, function (item) {

                var backgroundColor = '';
                switch (item['DailyMood']) {
                    case 1:
                        backgroundColor = '#00a65a';
                        break;
                    case 2:
                        backgroundColor = '#0073b7';
                        break;
                    case 3:
                        backgroundColor = '#f39c12';
                        break;
                    case 4:
                        backgroundColor = '#f56954';
                        break;
                    default:
                        backgroundColor = '#0073b7';
                        break;
                };

                items.push({
                    id: item['Id'],
                    start: item['EnteranceDate'],
                    end: item['ExitDate'],
                    title: item['Title'] + ': ' + item['Description'],
                    backgroundColor: backgroundColor,
                    borderColor: backgroundColor
                });

            });

            calElement.fullCalendar({
                isRTL: $scope.app.layout.isRTL,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                buttonIcons: { // note the space at the beginning
                    prev: ' fa fa-caret-left',
                    next: ' fa fa-caret-right'
                },
                buttonText: {
                    today: 'today',
                    month: 'month',
                    week: 'week',
                    day: 'day'
                },
                editable: true,
                events: items,
                eventClick: $scope.eventClick
            });


        }).error(function (data, status, headers, config) {
            //alert(JSON.stringify(data));
        });

    };


    $scope.eventClick = function (event) {
        $state.transitionTo('app.workinghoursedit', { id: event.id });
    }

    // When dom ready, init calendar and events
    $(function () {
        var calendarElementId = '#' + $attrs['calendarElement'];
        var calendar = $(calendarElementId);
        initCalendarElement(calendar);
    });

}]);

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

/**=========================================================
 * Module: general Multiple Selection controller
 =========================================================*/
iWork.controller('MultipleSelectionController', ['$config', '$scope', '$http', '$attrs', function ($config, $scope, $http, $attrs) {

    $scope.items = [];

    //setting webapi url
    var apiUrl = $config.API_URL + '/' + $attrs.controllerName + '/' + $attrs.actionName;
    $http.get(apiUrl).success(function (result, status, headers, config) {
        $scope.items = result;
    }).error(function (data, status, headers, config) {
        //alert(JSON.stringify(data));
    });

    //$scope.model = {};
    //$scope.selectedItems = [1, 2];

}]);

/**=========================================================
 * Module: general Multiple Selection controller
 =========================================================*/
iWork.controller('SingleSelectionController', ['$config', '$scope', '$http', '$attrs', function ($config, $scope, $http, $attrs) {

    $scope.items = [];

    //setting webapi url
    var apiUrl = $config.API_URL + '/' + $attrs.controllerName + '/' + $attrs.actionName;

    $http.get(apiUrl).success(function (result, status, headers, config) {
        $scope.items = result.data;
    });

}]);


/**=========================================================
 * Module: general Multiple Selection controller
 =========================================================*/
iWork.controller('SingleSelectionController1', ['$config', '$scope', '$http', '$attrs', function ($config, $scope, $http, $attrs) {

    $scope.items = [];

    //setting webapi url
    var apiUrl = $config.API_URL + '/' + $attrs.controllerName + '/' + $attrs.actionName;

    $http.get(apiUrl).success(function (result, status, headers, config) {
        $scope.items = result;
    });

    $scope.xxx = function (aaa) {
        //log($scope.$parent.item = )
    };

}]);


iWork.controller('test', ['$config', '$scope', '$http', '$attrs', function ($config, $scope, $http, $attrs) {

    $scope.primaryItem = {};
    $scope.item = {};

}]);


