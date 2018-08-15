var database = firebase.database();
var pId = getURLParameter('id');

var _id,name,desc,status,budget,pengeluaran,dateAdded,dateEndded,sisa;

var pSchedules = [];
var pBudgets = [];

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
        .exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function fetchAllData() {

    //project Data

    var queryProject = database.ref('projects/'+pId);

    sumPengeluaran(pId);
    sumBalance(pId);

    queryProject.once('value').then(function(snapshot) {

        _id = snapshot.val().id;
        name = snapshot.val().name;
        desc = snapshot.val().description;
        status = snapshot.val().status;
        //var team = projects[i].team;
        dateAdded = new Date(snapshot.val().dateAdded);
        dateEndded = "TBA";
        budget = snapshot.val().budget;
        pengeluaran = sumBudget;
        sisa = budget - pengeluaran;

        console.log(snapshot.val().budget);
    });

    //Budget Data

    var queryBudget = database.ref('budgets/'+pId);

    var pBudgetBody = document.getElementById('pBudgetBody');
    //console.log(id);
    pBudgetBody.innerHTML = '';

    queryBudget.once('value').then(function(snapshot) {
        snapshot.forEach(function (childSnapshot) {
            // console.log(childSnapshot.val().amount);
            // console.log(childSnapshot.val().desc);

            var budget = {
                id: childSnapshot.key,
                description: childSnapshot.val().desc,
                amount: childSnapshot.val().amount
            }

            //console.log(budget);
            pBudgets.push(budget);
        })
    }).then(()=>{

        var total = 0;

        for (var i = 0; i < pBudgets.length; i++) {
            var idBudget = pBudgets[i].id;
            var desc = pBudgets[i].description;
            var amount = pBudgets[i].amount;

            total += amount;

            //console.log("loaded"+i+budgets[i].id);

            //console.log(budgetId);

            pBudgetBody.innerHTML +=
                '<tr>'+
                '<td>'+(i+1)+'</td>'+
                '<td>'+desc+'</td>'+
                '<td style="text-align: right">'+amount+'</td>'+
                '</tr>';
        }

        pBudgetBody.innerHTML +=
            '<tr>'+
            '<td></td>'+
            '<td><h4>TOTAL</h4></td>'+
            '<td style="text-align: right"><h4>IDR  '+total+',00</h4></td>'+
            '</tr>';
    }
    );

    console.log('test Schedule');

    var querySchedules = database.ref('schedules/'+pId);

    var sTime = document.getElementById('pDateBody');

    sTime.innerHTML = '';

    var schedules = [];

    querySchedules.once('value').then(function(snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var schedule = {
                id: childSnapshot.key,
                date: childSnapshot.val().date,
                time: childSnapshot.val().time,
                desc: childSnapshot.val().desc,
                status: childSnapshot.val().status
            }

            //console.log(budget);
            pSchedules.push(schedule);
        })
    }).then(()=>{

        for (var i = 0; i < pSchedules.length; i++) {

            var idSchedule = pSchedules[i].id;
            var date = pSchedules[i].date;
            var time = pSchedules[i].time;
            var desc = pSchedules[i].desc;
            var status = pSchedules[i].status;

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
                '</td>'+
                '</tr>';
        }
    });

}