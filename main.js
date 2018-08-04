document.getElementById('projectInputForm').addEventListener('submit', saveProject);

var database = firebase.database();

function fetchProjects () {

  var projectsList = document.getElementById('projectsList');

  var projects = [];

  var query = firebase.database().ref("projects").orderByKey();

  query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
      //console.log(childData);

      var project = {
        id: childData['id'],
        description: childData['description'],
        status: childData['status'],
        budget: childData['budget']
      }

      //console.log(project);
      projects.push(project);
      //console.log(projects);
      });
    }).then(()=>{

        for (var i = 0; i < projects.length; i++) {
          var id = projects[i].id;
          var desc = projects[i].description;
          var status = projects[i].status;
          //var team = projects[i].team;
          var budget = projects[i].budget;


          console.log("loaded"+i);

          projectsList.innerHTML +=   '<div class="well">'+
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
    });

  projectsList.innerHTML = '';

  //console.log(projects[0].id);

}

function saveProject(e) {
  var projectId = chance.guid();
  var projectDesc = document.getElementById('projectDescInput').value;
  var projectStatus = document.getElementById('projectStatusInput').value;
  //var projectTeam = document.getElementById('projectTeamInput').value;
  var projectBudget = document.getElementById('projectBudgetInput').value;
  var project = {
    id: projectId,
    description: projectDesc,
    status: projectStatus,
    budget: projectBudget
  }

  var query = firebase.database().ref('projects/' + projectId).set(project);

  console.log(query);

  document.getElementById('projectInputForm').reset();

  fetchProjects();

  e.preventDefault();
}

function deleteProject (projectId) {

  var query = firebase.database().ref("projects/"+projectId);

  if (query!=null) {
    query.remove();
    console.log("Project removed");
  }else{
    console.log("project not found");
  }

  fetchProjects();
}

function setStatusDone (projectId) {

  //cuma ganti status aja
  //tba nanti setelah done dikasi tanggal selesai dan project dijadikan
  //archived sehingga bisa diprint reportnya!!

  var query = firebase.database().ref("projects/"+projectId);

  if (query!=null) {
    query.remove();
    console.log("Project removed");
  }else{
    console.log("project not found");
  }

  fetchProjects();

}
