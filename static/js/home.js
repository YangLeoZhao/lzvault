var lzvault = angular.module('lzvault', [])

lzvault.controller('mainCtrl', function($scope, $interval){
    //Initalizing scope variables
    $scope.cur_temp = "Feeling...";
    $scope.cur_location = "Triangulating... ";
    $scope.cnt_down_timer = "0:00";
    $scope.cnt_down_timer_val = 0;
    $scope.cur_mode = "";
    $scope.cur_time = "0:00";
    $scope.cur_date = new Date();
    $scope.tickInterval = 1000;
    $scope.show_all_activities = lzvault.showAllActivities;
    $scope.hide_all_activities = lzvault.hideAllActivities;
    $scope.show_all_activities_toggle = false;

    lzvault.onLoadFunction($scope);
    lzvault.mainClock($scope);

    $interval(function(){
        lzvault.mainClock($scope)
    }, $scope.tickInterval*5);

    lzvault.getLocation($scope)
    lzvault.getCurActivity($scope)

    $interval(function(){
      lzvault.countDownClock($scope)
    }, $scope.tickInterval)
});

lzvault.onLoadFunction = function(scope){
    var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    var weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    "Saturday"];

    var dd = scope.cur_date.getDate();
    if (dd === 1) {
        dd = dd.toString() + 'st'
    } else if (dd === 2) {
        dd = dd.toString() + 'nd'
    } else if (dd === 3) {
        dd = dd.toString() + 'rd'
    } else {
        dd = dd.toString() + 'th'
    }
    scope.date = weekdayNames[scope.cur_date.getDay()] + "  " + monthNames[scope.cur_date.getMonth()] + " " + dd
}

lzvault.mainClock = function(scope) {
    cur_date = new Date();
    hour = cur_date.getHours();
    min = cur_date.getMinutes();
    hour  = hour%12==0?'12':hour%12;
    min = min<10?'0'+min:min;
    scope.cur_time = hour + ':' + min;
}

lzvault.getLocation = function (scope){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(lzvault.positionHandler);
    } else {
        scope.cur_location = "Geolocation is not supported by this browser.";
    }
}

lzvault.positionHandler = function (position) {
    var params = {
        'latitude': position.coords.latitude,
        'longitude': position.coords.longitude
    }
    var scope = angular.element($("#content")).scope();
    $.ajax({
        type: 'POST',
        url: '/api/display_position',
        data: params,
        dataType: 'json',
        async: true
    }).success(function(data){
        scope.cur_location = data;
        scope.$apply();
    });

    $.ajax({
        type: 'POST',
        url: '/api/display_temperature',
        data: params,
        dataType: 'json',
        async: true
    }).success(function(data){
        scope.cur_temp = data;
        scope.$apply();
    });
}

lzvault.getCurActivity = function (scope){
    $.get('/api/cur_mode', function(data){
        //cur_mode, cur_timer = data
        if (data[1] <= 0){
            lzvault.taskFinished(data[0])
            scope.cur_mode = "-";
            scope.cnt_down_timer = "0:00";
            scope.cnt_down_timer_val = 0;
        }
        else {
            scope.cur_mode = data[0];
            scope.cnt_down_timer_val = data[1]
        }

    });
}

lzvault.countDownClock = function (scope){
    timer = scope.cnt_down_timer_val;
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    seconds = seconds < 10 ? "0" + seconds : seconds;
    scope.cnt_down_timer = minutes + ":" + seconds;

    if (timer > 1){
        timer = timer - 1
    }
    else if (timer == 1){
        lzvault.taskFinished(scope.cur_mode)
        timer = timer - 1
    }
    scope.cnt_down_timer_val = timer;
}

lzvault.showAllActivities = function() {
    $.ajax ({
        type: 'GET',
        url: '/api/possible_mode',
        dataType: 'json',
        async: true
    }).success(function(data){
        var scope = angular.element($("#content")).scope();
        scope.activities = data;
        scope.show_all_activities_toggle = true;
    });
}

lzvault.hideAllActivities = function($event, activity) {
    var scope = angular.element($("#content")).scope();
    var params = {
        'mode':activity
    }

    $.ajax({
        type: 'POST',
        url: '/api/select_mode',
        data: params,
        dataType: 'json',
        async: true
    }).success(function(data){
        scope.cur_mode = activity;
        scope.cnt_down_timer_val = data*60;
        scope.cnt_down_timer = data+':00';
        scope.show_all_activities_toggle = false;
    });
}

lzvault.taskFinished = function(task){
    //In the future, i want to have a mobile notification,
    //possibly recommend the next task to be accomplished
    //and show upcoming deadlines
    $.ajax({
        type: 'POST',
        url: '/api/task_finished',
        data: {'mode': task},
        dataType: 'json',
        async: true
    }).success(function(){
        console.log('successfully registered finished task')
    });
}

