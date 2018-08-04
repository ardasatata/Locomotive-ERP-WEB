var database = firebase.database();

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
  .exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function Load(){
  fetchProjectData(getURLParameter('id'));
}

//function edit

function fetchProjectData(id){
  var projectInfo = document.getElementById('projectInfo');
  console.log(id);
  projectInfo.innerHTML = '';

  var query = database.ref('projects/'+id);

  var id_,desc,status,budget;

  query.once('value').then(function(snapshot) {

    id_ = snapshot.val().id;
    desc = snapshot.val().description;
    status = snapshot.val().status;
    //var team = projects[i].team;
    budget = snapshot.val().budget;

  console.log(snapshot.val().budget);
  }).then(()=>{
  projectInfo.innerHTML = '<div class="well">'+
                            '<h6>Project ID: ' + id + '</h6>'+
                            '<p><span class="label label-info">' + status + '</span></p>'+
                            '<h3>Project Name : ' + desc + '</h3>'+
                            '<p>' +
                            '<span class="glyphicon glyphicon-user"></span> Team : ' + '</p>'+
                            '<span class="glyphicon glyphicon-usd"></span> Budget : ' + budget + '</p>'+
                            '<a href="#" class="btn btn-success" onclick="setStatusDone(\''+id+'\')">Done</a> '+
                            '<a href="#" class="btn btn-danger" onclick="deleteProject(\''+id+'\')">Delete</a> '+
                            '<a href="/project.html?id='+id+'" class="btn btn-danger" >Edit</a>'+
                            '</div>';
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
