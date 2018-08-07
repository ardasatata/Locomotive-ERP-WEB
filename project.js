var database = firebase.database();

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
  .exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function Load(){
  fetchProjectData(getURLParameter('id'));
  fetchBudgetData();
}

//function edit

function fetchProjectData(id){
  var projectInfo = document.getElementById('projectPageContent');
  console.log(id);
  projectInfo.innerHTML = '';

  var query = database.ref('projects/'+id);

  var id_,desc,status,budget,pengeluaran;

  query.once('value').then(function(snapshot) {

    id_ = snapshot.val().id;
    desc = snapshot.val().description;
    status = snapshot.val().status;
    //var team = projects[i].team;
    budget = snapshot.val().budget;
    pengeluaran = sumPengeluaran(id_);

  console.log(snapshot.val().budget);
  }).then(()=>{
  projectInfo.innerHTML ='<div>Project ID : '+id_+' </div>'+
                            '<div>Description : '+desc+' </div>'+
                            '<div>Start Date : date_placeholder </div>'+
                            '<div>End Date : - </div>'+
                            '<div>Budget : '+budget+' </div>'+
                            '<div id="pExpense">Expense : '+pengeluaran+' </div>'+
                            '<div id="pSisa">Sisa : - </div>'
                          }
                        );
}


function testMethod(id){ //test update

  var query = database.ref('projects/'+id+"/budget");

  query.set(10000);

  query.once('value').then(function(snapshot){
    console.log(snapshot.val());
  });
}

function testDate(){

  var timestamp = new Date().getTime();// timestamp

  console.log(new Date(timestamp));

}
