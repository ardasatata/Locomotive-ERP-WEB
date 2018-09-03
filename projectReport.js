var database = firebase.database();
var pId = getURLParameter('id');

var _id,name,desc,status,budget,pengeluaran,dateAdded,dateEndded,_sisa;

var pSchedules = [];
var pBudgets = [];

var _pName = document.getElementById("pName");
var _pId = document.getElementById("pId");
var _pDesc = document.getElementById("pDesc");
var _pStartDate = document.getElementById("pStartDate");
var _pEndDate = document.getElementById("pEndDate");
var _pBudget = document.getElementById("pBudget");
var _pExpense = document.getElementById("pExpense");
var _pSisa = document.getElementById("pSisa");

var _budget = 0;

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
        .exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function loadProjectReport(){
    fetchAllData();
}

function loadingDoneAndPrint(){ //matikan loading muter2
    var projectTable = document.getElementById("projectLoader");
    var currentClass = projectTable.className;

    projectTable.className = "ui inverted dimmer";

    window.print(); //print page
}

function fetchAllData() {

    //project Data

    var PENGELUARAN;

    var queryProject = database.ref('projects/'+pId);

    queryProject.once('value').then(function(snapshot) {

        _id = snapshot.val().id;
        name = snapshot.val().name;
        desc = snapshot.val().description;
        status = snapshot.val().status;
        //var team = projects[i].team;
        dateAdded = snapshot.val().dateAdded;
        dateEndded = "-";
        budget = snapshot.val().budget;

        console.log(snapshot.val().budget);
    }).then(()=>{
        _pName.innerText = name;
        _pId.innerText = _id;
        _pDesc.innerText = desc;
        _pStartDate.innerText = dateAdded;
        _pEndDate.innerText = dateEndded;
        _pBudget.innerText = budget;

    });

    //Budget Data

    var queryBudget = database.ref('budgets/'+pId).orderByChild('type');

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
                type:childSnapshot.val().type,
                amount: childSnapshot.val().amount
            }

            //console.log(budget);
            pBudgets.push(budget);
        })
    }).then(()=>{

        var total = 0;

        var bDR=0,bDL=0,bFOH=0,bOther=0;

        for (var i = 0; i < pBudgets.length; i++) {
            switch (pBudgets[i].type) {
                case 'Direct Rent':
                    bDR += parseInt(pBudgets[i].amount);
                    break;
                case 'Direct Labor':
                    bDL += parseInt(pBudgets[i].amount);
                    break;
                case 'FOH':
                    bFOH += parseInt(pBudgets[i].amount);
                    break;
                case 'Other':
                    bOther += parseInt(pBudgets[i].amount);
                    break;
            }
        }

        console.log(bDR+" "+bDL+" "+bFOH+" "+bOther)


        for (var i = 0; i < pBudgets.length; i++) {
            var idBudget = pBudgets[i].id;
            var desc = pBudgets[i].description;
            var type = pBudgets[i].type;
            var amount = parseInt(pBudgets[i].amount);

            total += amount;

            //console.log("loaded"+i+budgets[i].id);

            var budgetId = "\"removeBudget(\'"+idBudget+"\')\"";

            //console.log(budgetId);

            pBudgetBody.innerHTML +=
                '<tr>'+
                '<td>'+(i+1)+'</td>'+
                '<td>'+desc+'</td>'+
                '<td>'+type+'</td>'+
                '<td style="text-align: right">'+amount+'</td>'+
                '</tr>';
        }

        pBudgetBody.innerHTML +=
            '<tr>'+
            '<td></td>'+
            '<td><h4>Direct Rent</h4></td>'+
            '<td></td>'+
            '<td style="text-align: right"><h4>IDR  '+bDR+',00</h4></td>'+
            '</tr>';

        pBudgetBody.innerHTML +=
            '<tr>'+
            '<td></td>'+
            '<td><h4>Direct Labor</h4></td>'+
            '<td></td>'+
            '<td style="text-align: right"><h4>IDR  '+bDL+',00</h4></td>'+
            '</tr>';

        pBudgetBody.innerHTML +=
            '<tr>'+
            '<td></td>'+
            '<td><h4>FOH</h4></td>'+
            '<td></td>'+
            '<td style="text-align: right"><h4>IDR  '+bFOH+',00</h4></td>'+
            '</tr>';

        pBudgetBody.innerHTML +=
            '<tr>'+
            '<td></td>'+
            '<td><h4>Other</h4></td>'+
            '<td></td>'+
            '<td style="text-align: right"><h4>IDR  '+bOther+',00</h4></td>'+
            '</tr>';

        pBudgetBody.innerHTML +=
            '<tr>'+
            '<td></td>'+
            '<td><h4>GRAND TOTAL</h4></td>'+
            '<td></td>'+
            '<td style="text-align: right"><h4>IDR  '+total+',00</h4></td>'+
            '</tr>';

        PENGELUARAN = total;
    });


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

            //console.log("loaded"+i+budgets[i].id);

            var doneSchedule = "\"doneSchedule(\'"+idSchedule+"\')\"";
            var removeSchedule = "\"removeSchedule(\'"+idSchedule+"\')\"";

            //console.log(doneSchedule);

            sTime.innerHTML +=
                '<tr>'+
                '<td>'+(i+1)+'</td>'+
                '<td>'+date+'</td>'+
                '<td>'+time+'</td>'+
                '<td>'+desc+'</td>'+
                '</td>'+
                '</tr>';
        }
    }).finally(()=>{
        _sisa = budget - PENGELUARAN;
        _pExpense.innerText = PENGELUARAN;
        _pSisa.innerText = _sisa;
        loadingDoneAndPrint();
    });

}