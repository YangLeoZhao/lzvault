var temperature = $("#temperature")
temperature.text("Feeling...")
var loc = $("#location")
loc.text("Triangulating... ")
var date = $("#date")
date.text("Guessing..")
$(".cnt_down_timer").text("0:00")
$("#mode").text("S")

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionHandler);
    } else {
        loc.text("Geolocation is not supported by this browser.");
    }
}

function positionHandler(position) {
    var params = {
        'latitude': position.coords.latitude,
        'longitude': position.coords.longitude
    }

        $.ajax({
            type: 'POST',
            url: '/api/display_position',
            data: params,
            dataType: 'json',
            async: true
        }).success(function(data){
            loc.text(data)
        });

    $.ajax({
        type: 'POST',
        url: '/api/display_temperature',
        data: params,
        dataType: 'json',
        async: true
    }).success(function(data){
        temperature.text(data)
    });
}

$(document).ready(function() {
    setInterval(function(){
        main_clock()
        count_down_timer(document.getElementsByClassName("cnt_down_timer")[0])
    },1000);
    getLocation()

    var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    var weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    "Saturday"];

    var datetime = new Date();
    var dd = datetime.getDate();
    if (dd === 1) {
        dd = dd.toString() + 'st'
    } else if (dd === 2) {
        dd = dd.toString() + 'nd'
    } else if (dd === 3) {
        dd = dd.toString() + 'rd'
    } else {
        dd = dd.toString() + 'th'
    }

    date.text(weekdayNames[datetime.getDay()] + "  " + monthNames[datetime.getMonth()] + " " + dd);
    get_cur_activity()
});

$('#mode').click(function(e) {
  var toggle = this;
  var cur = document.getElementById("mode").getAttribute("value");

  e.preventDefault();
  $(toggle).toggleClass('toggle-on');
  document.getElementById("mode").setAttribute("value", (Number(cur) + 1)%2);
  if (cur == 1){
    show_all_activities()
  }
  else {
    hide_all_activities(e.target.textContent)
  }
});

function get_cur_activity() {
    $.get('/api/cur_mode', function(data){
        cur_mode = data[0]
        cur_timer = data[1]
        if (cur_timer == 0) {
            $("#mode").text('-')
            document.getElementsByClassName("cnt_down_timer")[0].textContent = '0:00'
            document.getElementsByClassName("cnt_down_timer")[0].setAttribute('value',0)
        }
        else {
            document.getElementsByClassName("cnt_down_timer")[0].textContent = cur_timer
            document.getElementsByClassName("cnt_down_timer")[0].setAttribute('value',cur_timer)
            $("#mode").text(cur_mode)

        }
    });
}

function show_all_activities() {
    $.ajax ({
        type: 'GET',
        url: '/api/possible_mode',
        dataType: 'json',
        async: false
    }).success(function(data){
        var choices = ['select_study','select_play', 'select_break']
        var table = document.createElement('table');
        var tr = document.createElement('tr')
        for (i=0; i<data.length; i++) {
            var td = document.createElement('td');
            var text = document.createTextNode(data[i]);

            td.classList.add('activity_table_col')
            td.appendChild(text);
            tr.appendChild(td);
        }
        table.appendChild(tr);
        activity_options = document.getElementById("mode");
        $("#mode").text("")
        activity_options.appendChild(table);
    });
}

function hide_all_activities(activity) {
    activity_options = document.getElementById("mode");
    activity_options.innerHTML = activity
    var cnt_down_timer = $(".cnt_down_timer")

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
        document.getElementsByClassName("cnt_down_timer")[0].textContent = data+':00'
        document.getElementsByClassName("cnt_down_timer")[0].setAttribute("value",data*60)
    });
}

function main_clock(){
    var datetime = new Date();
    var hour = datetime.getHours()
    $("#hour").text(hour%12==0?'12':hour%12);
    $("#minute").text((datetime.getMinutes()<10?'0':'') + datetime.getMinutes());
}

function count_down_timer(display){
    timer = display.getAttribute("value")
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;
    if (timer > 1){
        timer = timer - 1
    }
    else if (timer == 1){
        task_finished()
        timer = timer - 1
    }
    display.setAttribute('value', timer)
}

function task_finished(){
    //In the future, i want to have a mobile notification,
    //possibly recommend the next task to be accomplished
    //and show upcoming deadlines
    cur_mode = $("#mode").text()
    $.ajax({
        type: 'POST',
        url: '/api/task_finished',
        data: {'mode': cur_mode},
        dataType: 'json',
        async: true
    }).success(function(){
        console.log('successfully registered finished task')
    });
}







