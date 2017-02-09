var app = angular.module('myapp', ['ui.calendar', 'angularMoment']);

app.controller('CalenderController', function ($scope, uiCalendarConfig, $http) {

$scope.SelectedEvent = null;
var isFirstTime = true;

$scope.events = [];
$scope.eventSources = [$scope.events];

//get the events data from server 
$http.get('/Home/GetEventsData', {
    cache: true,
    params: {}
}).then(function (data) {
    //get and push events data to calendar here
    $scope.events.slice(0, $scope.events.length);
    angular.forEach(data.data, function (value) {
        $scope.events.push({
            title: value.Title,
            description: value.Description,
            start: new Date(parseInt(value.StartAt.substr(6))),
            end: new Date(parseInt(value.EndAt.substr(6))),
            allDay: value.IsFullDay,
            stick: true
        });
    });
});

$scope.uiConfig = {
    calendar: {
        height: 545,
        editable: true,
        defaultView: 'agendaDay',
        slotLabelFormat: ' ',
        allDaySlot: false,
        minTime: '07:00:00',
        maxTime: '18:00:00',
        firstDay:1,
        header: {
            left: '',
            center: 'title',
            right: 'today prev,next'
        },
        dayClick : function (date, jsEvent, view) {
            var selectedTime = moment(date).format('YYYY-MM-DD HH:mm');
            document.getElementById('showModal').click();
            document.getElementById('time').innerHTML = selectedTime;
            //$scope.selectedDate = $filter('date')(selectedTime, 'yyyy-MM-dd');
        },
        eventClick: function (event, jsEvent, view) {
            $scope.SelectedEvent = event;
        },
        eventAfterAllRender: function () {
            if ($scope.events.length > 0 && isFirstTime) {
                uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.events[0].start);
                isFirstTime = false;
            }
        }
    }
};
});