//App.controller('WorkingHourController', ['$scope', '$http', '$attrs', '$element', 'httpApiService', '$state', 'PublicSearchDataService', function ($scope, $http, $attrs, $element, httpApiService, $state, PublicSearchDataService) {
//    'use strict';

//    var baseApiUrl = httpApiService.getApiUrl('/' + $attrs['controllerName'] + '/');

//    $scope.initCalendar = function () {

//        if (!$.fn.fullCalendar) return;

//        var apiUrl = baseApiUrl + $attrs['actionName'];
//        var items = [];

//        function initCalendarElement(calElement) {

//            var searchParams = {
//                fromDate: '',
//                toDate: ''
//            };

//            $http.get(apiUrl, { params: searchParams }).success(function (result, status, headers, config) {

//                angular.forEach(result.data, function (item) {

//                    var backgroundColor = '';
//                    switch (item['DailyMood']) {
//                        case 1:
//                            backgroundColor = '#00a65a';
//                            break;
//                        case 2:
//                            backgroundColor = '#0073b7';
//                            break;
//                        case 3:
//                            backgroundColor = '#f39c12';
//                            break;
//                        case 4:
//                            backgroundColor = '#f56954';
//                            break;
//                        default:
//                            backgroundColor = '#0073b7';
//                            break;
//                    };

//                    items.push({
//                        id: item['Id'],
//                        start: item['EnteranceDate'],
//                        end: item['ExitDate'],
//                        title: item['Title'] + ': ' + item['Description'],
//                        backgroundColor: backgroundColor,
//                        borderColor: backgroundColor
//                    });
//                });

//                calElement.fullCalendar({
//                    isRTL: $scope.app.layout.isRTL,
//                    header: {
//                        left: 'prev,next today',
//                        center: 'title',
//                        right: 'month,agendaWeek,agendaDay'
//                    },
//                    buttonIcons: { // note the space at the beginning
//                        prev: ' fa fa-caret-left',
//                        next: ' fa fa-caret-right'
//                    },
//                    buttonText: {
//                        today: 'today',
//                        month: 'month',
//                        week: 'week',
//                        day: 'day'
//                    },
//                    editable: true,
//                    events: items,
//                    eventClick: $scope.eventClick
//                });


//            }).error(function (data, status, headers, config) {
//                alert(JSON.stringify(data));
//            });

//        };


//        $scope.eventClick = function (event) {
//            $state.transitionTo('app.workinghoursedit', { id: event.id });
//        }

//        // When dom ready, init calendar and events
//        $(function () {
//            var calendarElementId = '#' + $attrs['calendarElement'];
//            var calendar = $(calendarElementId);
//            initCalendarElement(calendar);
//        });


//    };

//    $scope.initGrid = function () {

//        var x2js = new X2JS();
//        var columnsInnerHTML = '';
//        var columnDefs = [];
//        var columns = $element.children('columns');

//        if (columns.length > 0) {
//            columnsInnerHTML = columns[0].outerHTML;
//            var jsonObj = x2js.xml_str2json(columnsInnerHTML);
//            angular.forEach(jsonObj.columns.column, function (item) {
//                columnDefs.push({
//                    field: item['_field'],
//                    displayName: item['_display-name']
//                });
//            });

//        };

//        //setting webapi url
//        var ngGridResourcePath = httpApiService.getApiUrl('/' + $attrs.controllerName + '/' + $attrs.actionName);

//        $scope.items = [];
//        $scope.totalServerItems = 0;

//        // filter
//        $scope.filterOptions = {
//            PublicSearchDataService: PublicSearchDataService,
//            filterText: '',
//            useExternalFilter: true
//        };

//        // paging
//        $scope.pagingOptions = {
//            pageSizes: $attrs.pageSizes.split(','),     // page size options
//            pageSize: $attrs.pageSize,       // default page size
//            currentPage: parseInt($attrs.currentPage)  // initial page
//        };

//        // sort
//        $scope.sortOptions = {
//            fields: [],
//            directions: [],
//        };

//        if ($attrs.sortFields) {
//            $scope.sortOptions.fields = $attrs.sortFields.split(',');
//            $scope.sortOptions.directions = $attrs.sortDirections.split(',');
//        };


//        $scope.gridOptions = {
//            data: 'items',
//            enablePaging: true,
//            showFooter: true,
//            rowHeight: $attrs.rowHeight,
//            headerRowHeight: $attrs.headerRowHeight,
//            totalServerItems: 'totalServerItems',
//            pagingOptions: $scope.pagingOptions,
//            filterOptions: $scope.filterOptions,
//            sortInfo: $scope.sortOptions,
//            enableColumnResize: true,
//            //enablePinning: true,
//            keepLastSelected: true,
//            multiSelect: false,
//            //showColumnMenu: true,
//            //showFilter: true,
//            //showGroupPanel: true,
//            showFooter: true,
//            useExternalSorting: true,
//            beforeSelectionChange: function (rowItem, event) {
//                if ($attrs.clickState) {
//                    var id = rowItem.entity.Id;
//                    $state.transitionTo($attrs.clickState, { id: id });
//                }
//            }
//            //plugins: [new ngGridFlexibleHeightPlugin()]

//        };

//        if (columnDefs.length > 0) {
//            $scope.gridOptions.columnDefs = columnDefs;
//        };

//        $scope.refresh = function () {
//            setTimeout(function () {

//                var p = {
//                    searchTerm: $scope.filterOptions.PublicSearchDataService.term,
//                    pageNumber: $scope.pagingOptions.currentPage,
//                    pageSize: $scope.pagingOptions.pageSize,
//                    sortFields: $scope.sortOptions.fields,
//                    sortDirections: $scope.sortOptions.directions
//                };

//                $http.post(ngGridResourcePath, p).success(function (result, status, headers, config) {

//                    $scope.items = result.data;
//                    $scope.totalServerItems = result.itemsCount;

//                }).error(function (data, status, headers, config) {
//                    alert(JSON.stringify(data));
//                });

//            }, 100);
//        };

//        // watches
//        $scope.$watch('pagingOptions', function (newVal, oldVal) {
//            if (newVal.pageSize !== oldVal.pageSize || newVal.currentPage !== oldVal.currentPage) {
//                $scope.refresh();
//            }
//        }, true);

//        $scope.$watch('filterOptions', function (newVal, oldVal) {
//            if (newVal !== oldVal) {
//                $scope.refresh();
//            }
//        }, true);

//        $scope.$watch('sortOptions', function (newVal, oldVal) {
//            if (newVal !== oldVal) {
//                $scope.refresh();
//            }
//        }, true);

//        //removing custom attributes
//        $element.removeAttr('page-size')
//                .removeAttr('page-sizes')
//                .removeAttr('current-page')
//                .removeAttr('controller-name')
//                .removeAttr('action-name')
//                .removeAttr('row-height')
//                .removeAttr('header-row-height')
//                .removeAttr('sort-fields')
//                .removeAttr('sort-directions');

//    };

//}]);

