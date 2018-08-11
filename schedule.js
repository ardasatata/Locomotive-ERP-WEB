var database = firebase.database();
var pId = getURLParameter('id');
var scheduleRef = firebase.database().ref("schedules/"+pId);

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
        .exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

document.getElementById('projectScheduleForm').addEventListener('submit', saveSchedule);

function saveSchedule(e) {
    var pScheduleDate,pScheduleTime,pScheduleDesc;

    pScheduleDate = $('#pCalendarDate').calendar('get date');
    pScheduleTime  = $('#pCalendarTime').calendar('get date');
    pScheduleDesc = document.getElementById('pScheduleDesc').value;

    pScheduleDate.toString().substring(4,15);

    console.log(pScheduleDate.toString().substring(4,15));
    console.log(pScheduleTime.toString().substring(16,21));
    console.log(pScheduleDesc);

    addSchedule(pScheduleDate.toString().substring(4,15),pScheduleTime.toString().substring(16,21),pScheduleDesc);

    $('#pCalendarDate').calendar('clear');
    $('#pCalendarTime').calendar('clear');
    $('#pScheduleDesc').val("");

    console.log("test Save Schedule");
    fetchScheduleData();
    e.preventDefault();
}

function addSchedule(date,time,desc) {
    var schedule = {
        date : date,
        time: time,
        desc: desc,
        status: false
    }

    scheduleRef.push(schedule);
}

function removeSchedule(idSchedule){ //remove budget component jangan lupa pake ""
    scheduleRef.child(idSchedule).remove();
    fetchScheduleData();
    //console.log("budget removed");
    //fetchBudgetData();
}

function doneSchedule(idSchedule){

    var sStatus = scheduleRef.child(idSchedule).child('status');

    sStatus.once('value').then(function (snapshot) {
            console.log(snapshot.val());
        if (!snapshot.val()){
            console.log(scheduleRef.child(idSchedule).child('status').set(true));
        }else{
            console.log(scheduleRef.child(idSchedule).child('status').set(false));
        }
    });

    fetchScheduleData();
    console.log("test done");
    //fetchBudgetData();
}

function fetchScheduleData(){

    var sTime = document.getElementById('pDateBody');

    sTime.innerHTML = '';


    var schedules = [];

    scheduleRef.once('value').then(function(snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var schedule = {
                id: childSnapshot.key,
                date: childSnapshot.val().date,
                time: childSnapshot.val().time,
                desc: childSnapshot.val().desc,
                status: childSnapshot.val().status
            }

            //console.log(budget);
            schedules.push(schedule);
        })
    }).then(()=>{

        for (var i = 0; i < schedules.length; i++) {
            var idSchedule = schedules[i].id;
            var date = schedules[i].date;
            var time = schedules[i].time;
            var desc = schedules[i].desc;
            var status = schedules[i].status;

            var tdClass = "";

            if (status){
                tdClass = "positive";
            }

            //console.log("loaded"+i+budgets[i].id);

            var doneSchedule = "\"doneSchedule(\'"+idSchedule+"\')\"";
            var removeSchedule = "\"removeSchedule(\'"+idSchedule+"\')\"";

            //console.log(doneSchedule);

            sTime.innerHTML +=
                '<tr class= "'+tdClass+'">'+
                '<td>'+(i+1)+'</td>'+
                '<td>'+date+'</td>'+
                '<td>'+time+'</td>'+
                '<td>'+desc+'</td>'+
                '<td class="selectable positive" style="text-align: center">'+
                '<i class="icon check circle" onclick='+doneSchedule+'></i>'+
                '</td>'+
                '<td class="selectable negative" style="text-align: center">'+
                '<i class="icon close" onclick='+removeSchedule+'></i>'+
                '</td>'+
                '</tr>';
        }
    });

}