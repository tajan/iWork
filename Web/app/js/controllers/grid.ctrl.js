

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