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
  var projectEditButton = document.getElementById('projectEditButton');
  console.log(id);
  projectInfo.innerHTML = '';

  var query = database.ref('projects/'+id);

  var id_,desc,status,budget,pengeluaran,dateAdded;

  query.once('value').then(function(snapshot) {

    id_ = snapshot.val().id;
    desc = snapshot.val().description;
    status = snapshot.val().status;
    //var team = projects[i].team;
      dateAdded = new Date(snapshot.val().dateAdded);
    budget = snapshot.val().budget;
    pengeluaran = sumPengeluaran(id_);



  console.log(snapshot.val().budget);
  }).then(()=>{

  projectInfo.innerHTML =   '<div>Project ID   : '+id_+' </div>'+
                            '<div>Description : '+desc+' </div>'+
                            '<div>Date Added : '+dateAdded+' </div>'+
                            '<div>End Date : - </div>'+
                            '<div>Budget : '+budget+' </div>'+
                            '<div id="pExpense">Expense : '+pengeluaran+' </div>'+
                            '<div id="pSisa">Sisa : - </div>';

                          }
                        ).finally(()=>{
        $("#projectEditButton").click(function () {
            window.location.href = "/projectEdit.html?id="+id_;
        });
      console.log(projectEditButton);

  });
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

function loadEditProject() {

    $('.ui.dropdown')
        .dropdown()
    ;

    document.getElementById('projectEditForm').addEventListener('submit', saveEditProject);

    var pName = document.getElementById('projectEditFormName');
    var pDesc = document.getElementById('projectEditFormDesc');
    var pStatus = document.getElementById('projectEditFormStatus');

    pName.value = "hehe";
    pDesc.value = "desc hehe ddd";
    pStatus.value = "Done";
}

function fetchProjectEditData(id){
    var projectInfo = document.getElementById('projectPageContent');
    var projectEditButton = document.getElementById('projectEditButton');
    console.log(id);
    projectInfo.innerHTML = '';

    var query = database.ref('projects/'+id);

    var id_,desc,status,budget,pengeluaran,dateAdded;

    query.once('value').then(function(snapshot) {

        id_ = snapshot.val().id;
        desc = snapshot.val().description;
        status = snapshot.val().status;
        //var team = projects[i].team;
        dateAdded = new Date(snapshot.val().dateAdded);
        budget = snapshot.val().budget;
        pengeluaran = sumPengeluaran(id_);



        console.log(snapshot.val().budget);
    }).then(()=>{

            projectInfo.innerHTML =   '<div>Project ID   : '+id_+' </div>'+
                '<div>Description : '+desc+' </div>'+
                '<div>Date Added : '+dateAdded+' </div>'+
                '<div>End Date : - </div>'+
                '<div>Budget : '+budget+' </div>'+
                '<div id="pExpense">Expense : '+pengeluaran+' </div>'+
                '<div id="pSisa">Sisa : - </div>';

        }
    ).finally(()=>{
        $("#projectEditButton").click(function () {
            window.location.href = "/projectEdit.html?id="+id_;
        });
        console.log(projectEditButton);

    });
}

function saveEditProject(e) {
    console.log("save edit project")
    e.preventDefault();
}