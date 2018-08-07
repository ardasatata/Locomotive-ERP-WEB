var database = firebase.database();
var projectId = getURLParameter('id');

document.getElementById('projectAddExpense').addEventListener('submit', saveProject);

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
  .exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function fetchBudgetData(){
    var budgetExpense = document.getElementById('pExpense');
    console.log(projectId);
    var pExpense = sumPengeluaran(projectId);
    console.log(pExpense);
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

          console.log(budget);
          budgets.push(budget);
      })
    }).then(()=>{

        for (var i = 0; i < budgets.length; i++) {
            var idBudget = budgets[i].id;
            var desc = budgets[i].description;
            var amount = budgets[i].amount;

            console.log("loaded"+i+budgets[i]);

            pBudgetBody.innerHTML +=
                '<tr>'+
                '<td>'+(i+1)+'</td>'+
                '<td>'+desc+'</td>'+
                '<td>'+amount+'</td>'+
                '<td class="selectable negative">'+
                '<a onclick="removeBudget("'+'+idBudget+'+'")">Delete</a>'+
                '</td>'+
                '</tr>';
        }
    });

}

function createBudget(){
  var query = database.ref('budgets/'+projectId);
  console.log("Budget Created "+projectId);
}

function saveExpense(e){

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

  console.log(query);
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

  let sum = 0;

  query.once('value').then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      console.log(key+" "+childData.amount);

      sum += childData.amount;
    })
  }).then(()=>{
    console.log(sum);
    return sum;
  });
}

