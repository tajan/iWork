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
