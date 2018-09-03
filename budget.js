var database = firebase.database();
var projectId = getURLParameter('id');
var budgetsRef = firebase.database().ref("budgets/"+projectId);

var sumBudget,sumSisa;

document.getElementById('projectAddExpense').addEventListener('submit', saveExpense);

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
  .exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function fetchBudgetData(){  // ambil semua data budget
    var budgetExpense = document.getElementById('pExpense');

    var pBudgetBody = document.getElementById('pBudgetBody');
    //console.log(id);
    pBudgetBody.innerHTML = '';

    var query = database.ref('budgets/'+projectId);

    var bDesc,bAmount;

    var budgets = [];

    query.once('value').then(function(snapshot) {
      snapshot.forEach(function (childSnapshot){
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

        var total = 0;

        for (var i = 0; i < budgets.length; i++) {
            var idBudget = budgets[i].id;
            var desc = budgets[i].description;
            var amount = parseInt(budgets[i].amount);

            total += amount;

            //console.log("loaded"+i+budgets[i].id);

            var budgetId = "\"removeBudget(\'"+idBudget+"\')\"";

            //console.log(budgetId);

            pBudgetBody.innerHTML +=
                '<tr>'+
                '<td>'+(i+1)+'</td>'+
                '<td>'+desc+'</td>'+
                '<td>'+'Other'+'</td>'+
                '<td style="text-align: right">'+amount+'</td>'+
                '<td class="selectable negative" style="text-align: center">'+
                '<i class="icon close" onclick='+budgetId+'></i>'+
                '</td>'+
                '</tr>';
        }

        pBudgetBody.innerHTML +=
            '<tr>'+
            '<td></td>'+
            '<td></td>'+
            '<td><h4>TOTAL</h4></td>'+
            '<td style="text-align: right"><h4>IDR  '+total+',00</h4></td>'+
            '<td>'+
            '</td>'+
            '</tr>';
    });

}

function createBudget(){ //create budget apabila masih null
  var query = database.ref('budgets/'+projectId);
  console.log("Budget Created "+projectId);
}

function saveExpense(e){ //save pengeluaran
    var pExpense = parseInt(document.getElementById("pInputExpense").value);
    var pExpenseDesc = document.getElementById("pInputExpenseDesc").value;

    addExpense(pExpense,pExpenseDesc);

    $('#pInputExpense').val("");
    $('#pInputExpenseDesc').val("");
    //console.log(pExpense+" "+pExpenseDesc);

    e.preventDefault();
}

function addExpense(amount,desc){
  var query = firebase.database().ref("budgets/"+projectId);

  //var desc = "pengeluaran"; //TBA diganti desc from input form

  var budget = {
    desc: desc,
    amount: amount
  }

  if (query==null) {
    createBudget();
  }
  else{
    //query.
    query.push(budget);
    console.log("budget added "+amount+" "+query.key);
  }
  fetchBudgetData();
}

function removeBudget(idBudget){ //remove budget component jangan lupa pake ""
  var query = firebase.database().ref("budgets/"+projectId+"/"+idBudget);

    query.remove();
  //console.log("budget removed");
  fetchBudgetData();
}

function showBudget(){
  var projectBudget = document.getElementById('projectBudget');
  //projectBudget.innerHTML = '';

  var query = firebase.database().ref("budgets/"+projectId);

  query.once('value').then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      console.log(key+" "+childData.amount);
    })
  })
}

function sumPengeluaran(idProject){

    var query = firebase.database().ref("budgets/"+idProject);

    sumBudget = 0;
    var sum = 0;

    query.once('value').then(function(snapshot){

        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            //console.log(key+" "+childData.amount);

            sum += parseInt(childData.amount);
        })
    }).then(()=>{
        sumBudget = sum;
        console.log(sumBudget);
    }).finally(()=>{
        return sumBudget;
    });
}

function sumBalance(idProject){

    var query = firebase.database().ref("projects/"+idProject+"/budget");

    sumSisa = 0;

    var budget;

    query.once('value').then(function(snapshot){
        budget = snapshot.val();
    }).then(()=>{
        sumSisa = budget - sumBudget;
        console.log(sumSisa+" sumsisa");
    }).finally(()=>{
        return sumSisa;
    });
}


