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

    var queryBudget = database.ref('budgets/'+pId);

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

            var budgetId = "\"removeBudget(\'"+idBudget+"\')\"";

            //console.log(budgetId);

        }


    });

}