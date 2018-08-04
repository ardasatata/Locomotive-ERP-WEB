var database = firebase.database();
var projectId = getURLParameter('id');

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
  .exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function createBudget(){
  var query = database.ref('budgets/'+projectId);
  console.log("Budget Created "+projectId);
}

function addBudget(amount){
  var query = firebase.database().ref("budgets/"+projectId);

  var desc = "pengeluaran"; //TBA diganti desc from input form

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
}

function removeBudget(idBudget){ //remove budget component jangan lupa pake ""
  var query = firebase.database().ref("budgets/"+projectId+"/"+idBudget);
  query.remove();
  console.log("budget removed");
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

function sumPengeluaran(){
  var query = firebase.database().ref("budgets/"+projectId);

  var sum = 0;

  query.once('value').then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      console.log(key+" "+childData.amount);

      sum += childData.amount;
    })
  }).then(()=>{
    console.log(sum);
  });
}
