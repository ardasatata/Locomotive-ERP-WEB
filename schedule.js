var database = firebase.database();
var pId = getURLParameter('id');
var budgetsRef = firebase.database().ref("budgets/"+projectId);

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
        .exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function fetchScheduleData(){

    var budgetExpense = document.getElementById('pExpense');

    //console.log(projectId);
    //var pExpense = sumPengeluaran(projectId);
    //console.log(pExpense);
    //budgetExpense.innerHTML = pExpense;

    var pBudgetBody = document.getElementById('pBudgetBody');
    //console.log(id);
    pBudgetBody.innerHTML = '';

    var query = database.ref('budgets/'+projectId);

    var bDesc,bAmount;

    var budgets = [];

    query.once('value').then(function(snapshot) {
        snapshot.forEach(function (childSnapshot) {
            // console.log(childSnapshot.val().amount);
            // console.log(childSnapshot.val().desc);

            var budget = {
                id: childSnapshot.key,
                description: childSnapshot.val().desc,
                amount: childSnapshot.val().amount
            }

            //console.log(budget);
            budgets.push(budget);
        })
    }).then(()=>{

        for (var i = 0; i < budgets.length; i++) {
            var idBudget = budgets[i].id;
            var desc = budgets[i].description;
            var amount = budgets[i].amount;

            //console.log("loaded"+i+budgets[i].id);

            var budgetId = "\"removeBudget(\'"+idBudget+"\')\"";

            //console.log(budgetId);

            pBudgetBody.innerHTML +=
                '<tr>'+
                '<td>'+(i+1)+'</td>'+
                '<td>'+desc+'</td>'+
                '<td style="text-align: right">'+amount+'</td>'+
                '<td class="selectable negative" style="text-align: center">'+
                '<i class="icon close" onclick='+budgetId+'></i>'+
                '</td>'+
                '</tr>';
        }
    });

}