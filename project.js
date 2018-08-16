var database = firebase.database();
var pId = getURLParameter('id');

var id_,name,desc,status,budget,pengeluaran,dateAdded,sisa;

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
  .exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function Load(){
    $('#pCalendarDate').calendar({
        type: 'date'
    });
    $('#pCalendarTime').calendar({
        type: 'time',
        ampm: false,
    });
  fetchProjectData(getURLParameter('id'));
  fetchBudgetData();
  fetchScheduleData();

  //var pReportButton = document.getElementById('projectReportButton');
    $("#projectReportButton").click(function () {
        window.location.href = "/ProjectReport.html?id="+id_;
    });
}

function projectDelete(){ // Remove Project dan semuanya budget dan schedules
    if (confirm("Anda akan menghapus project ini!")) {
        database.ref('projects/'+pId).remove(); //Delete semua Ref projects,budgets,dan schedules
        database.ref('budgets/'+pId).remove();
        database.ref('schedules/'+pId).remove();
        location.href='/project_list.html';
        e.preventDefault();
    } else {

    }
}

function projectDone(){ // konfirmasi lalu write done di status
    if (confirm("Apakah project dinyatakan selesai ?")) {
        database.ref('projects/'+pId+'/status').set("Done");
        var endDate = new Date();
        console.log(endDate);
        console.log(database.ref('projects/'+pId+'/dateEndded').set(endDate.toDateString()));
        console.log("project set done");
    } else {

    }
    location.reload();
}

function projectTableLoading(){
    var projectTable = document.getElementById("projectLoader");
    var currentClass = projectTable.className;

    projectTable.className = "ui inverted dimmer";
}

//function edit

function fetchProjectData(id){
  //var projectInfo = document.getElementById('projectPageContent');
  var projectEditButton = document.getElementById('projectEditButton');
    var projectName = document.getElementById('pName');

  console.log(id);
  //projectInfo.innerHTML = '';

  var query = database.ref('projects/'+id);

    var _pName = document.getElementById("pName");
    var _pId = document.getElementById("pId");
    var _pDesc = document.getElementById("pDesc");
    var _pStartDate = document.getElementById("pStartDate");
    var _pEndDate = document.getElementById("pEndDate");
    var _pBudget = document.getElementById("pBudget");
    var _pExpense = document.getElementById("pExpense");
    var _pSisa = document.getElementById("pSisa");

  sumPengeluaran(pId);
  sumBalance(pId);

  query.once('value').then(function(snapshot) {

    id_ = snapshot.key;
     name = snapshot.val().name;
    desc = snapshot.val().description;
    status = snapshot.val().status;
    //var team = projects[i].team;
      dateAdded = new Date(snapshot.val().dateAdded)
      dateEndded = snapshot.val().dateEndded;
    budget = snapshot.val().budget;
    pengeluaran = sumBudget;
    sisa = budget - pengeluaran;


  console.log(snapshot.val().budget);
  }).then(()=>{
      projectName.innerText = name;

          _pName.innerText = name;
          _pId.innerText = id_;
          _pDesc.innerText = desc;
          _pStartDate.innerText = dateAdded;
          _pEndDate.innerText = dateEndded;
          _pBudget.innerText = budget;
          _pExpense.innerText = pengeluaran;
          _pSisa.innerText = sisa;


  // //projectInfo.innerHTML =   '<div>Project ID   : '+id_+' </div>'+
  //                           '<div>Status   : '+status+' </div>'+
  //                           '<div>Description : '+desc+' </div>'+
  //                           '<div>Date Added : '+dateAdded+' </div>'+
  //                           '<div>End Date : - </div>'+
  //                           '<div>Budget : '+budget+' </div>'+
  //                           '<div id="pExpense">Expense : '+pengeluaran+' </div>'+
  //                           '<div id="pSisa">Sisa : '+sisa+' </div>';

                          }
                        ).finally(()=>{
      projectTableLoading();
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
        .dropdown();

    document.getElementById('projectEditForm').addEventListener('submit', saveEditProject);

    fetchProjectEditData(getURLParameter('id'));

    }

function testDropdown() {
    console.log($('.ui.dropdown').dropdown('get value'));
    $('.ui.dropdown').dropdown('set selected',"Editing");
}

function fetchProjectEditData(id){
    var eProjectName = document.getElementById('projectEditFormName');
    var eProjectDesc = document.getElementById('projectEditFormDesc');
    var eProjectBudget = document.getElementById('projectEditFormBudget');

    console.log(id);

    var query = database.ref('projects/'+id);

    var eName,eDesc,eStatus,eBudget;


    query.once('value').then(function(snapshot) {

        eName = snapshot.val().name;
        eDesc = snapshot.val().description;
        eStatus = snapshot.val().status;
        eBudget = snapshot.val().budget;

        console.log(eDesc)

    }).then(()=>{

        eProjectName.setAttribute('value',eName);
        eProjectDesc.innerText = eDesc;
        $('.ui.dropdown').dropdown('set selected',eStatus);
        eProjectBudget.setAttribute('value',eBudget);

        }
    ).finally(()=>{
        projectTableLoading();
    });
}

function saveEditProject(e) {

    var eProjectName = document.getElementById('projectEditFormName').value;
    var eProjectDesc = document.getElementById('projectEditFormDesc').value;
    var eProjectBudget = document.getElementById('projectEditFormBudget').value;
    var eProjectStatus  =  $('.ui.dropdown').dropdown('get value');

    database.ref('projects/'+pId+'/name').set(eProjectName);
    database.ref('projects/'+pId+'/description').set(eProjectDesc);
    database.ref('projects/'+pId+'/status').set(eProjectStatus);
    database.ref('projects/'+pId+'/budget').set(eProjectBudget);

    console.log(eProjectName);
    console.log(eProjectDesc);
    console.log(eProjectBudget);
    console.log(eProjectStatus);

    loadEditProject();
    console.log("project saved");
    window.history.back();
    e.preventDefault();
}