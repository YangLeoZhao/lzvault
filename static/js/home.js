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
        var datetime = new Date();
        var hour = datetime.getHours()
        $("#hour").text(hour%12==0?'12':hour%12);
        $("#minute").text((datetime.getMinutes()<10?'0':'') + datetime.getMinutes());
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

function show_all_activities() {
    var cnt_down_timer = $(".cnt_down_timer").text()
    var cur_mode = $(".cur_mode").text()
    var params = {
        'cnt_down_timer': cnt_down_timer,
        'cur_mode'      : cur_mode
    }

    $.ajax ({
        type: 'POST',
        url: '/api/possible_mode',
        data: params,
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
        cnt_down_timer.text(data+':00')
    });
}








