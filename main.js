document.getElementById('projectAddForm').addEventListener('submit', saveProject);

var database = firebase.database();

function projectTableLoading(){
    var projectTable = document.getElementById("projectLoader");
    var currentClass = projectTable.className;

    projectTable.className = "ui inverted dimmer";
}

function fetchProjects () {

  var projectsList = document.getElementById('tBody_projectList');

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
        name: childData['name'],
        status: childData['status'],
        budget: childData['budget']
      }

      //console.log(project);

        if (project.status!="Done") {
            projects.push(project);
        }

      //console.log(projects);
      });
    }).then(()=>{
        var no = 1;
        for (var i = projects.length -1; i >= 0 ; i--) {
          var id = projects[i].id;
          var name = projects[i].name;
          var status = projects[i].status;
          //var team = projects[i].team;
          var budget = projects[i].budget;


          console.log("loaded"+i);

          projectsList.innerHTML += '<tr>' +
                      '<td>'+ (no) + '</td>' +
                      '<td class="selectable"> <a href="project.html?id='+id+'">'+ name + '</a></td>' +
                      '<td style="text-align: right">'+ budget +'</td>' +
                      '<td class="positive">'+status+'</td>' +
                  '</tr>';
          no++;
        }

        projectTableLoading();
    });

  projectsList.innerHTML = '';

  //console.log(projects[0].id);

}

function fetchProjectsArchive () {

    var projectsList = document.getElementById('tBody_projectList');

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
                name: childData['name'],
                status: childData['status'],
                budget: childData['budget']
            }

            //console.log(project);

            if (project.status=="Done") {
                projects.push(project);
            }

            //console.log(projects);
        });
    }).then(()=>{
        var no = 1;
        for (var i = projects.length -1; i >= 0 ; i--) {
            var id = projects[i].id;
            var name = projects[i].name;
            var status = projects[i].status;
            //var team = projects[i].team;
            var budget = projects[i].budget;


            console.log("loaded"+i);

            projectsList.innerHTML += '<tr>' +
                '<td>'+ (no) + '</td>' +
                '<td class="selectable"> <a href="project.html?id='+id+'">'+ name + '</a></td>' +
                '<td style="text-align: right">'+ budget +'</td>' +
                '<td class="positive">'+status+'</td>' +
                '</tr>';
            no++;
        }

        projectTableLoading();
    });

    projectsList.innerHTML = '';

    //console.log(projects[0].id);

}

function saveProject(e) { //add project
    var projectDateAdded = new Date();
  var projectId = chance.guid();
  var projectName = document.getElementById('projectNameInput').value;
  var projectDesc = document.getElementById('projectDescInput').value;
  var projectStatus = "Belum Take";
  //var projectTeam = document.getElementById('projectTeamInput').value;
  var projectBudget = document.getElementById('projectBudgetInput').value;
  var project = {
      id: projectId,
      dateAdded:projectDateAdded.toDateString(),
      name: projectName,
      description: projectDesc,
      status: projectStatus,
      budget: projectBudget
  }

  var query = firebase.database().ref('projects/' + projectId).set(project);

  console.log(query);

  document.getElementById('projectInputForm').reset();

  fetchProjects();

  window.location.replace("/project_list.html");

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
