'use strict';
var card = document.querySelector(".card");
userCall();
projectsCall();
setInterval(projectsCall, 10000);

function showAvatarImage(data) {
  var avatar = document.querySelector(".avatar");
  if (data.photo === null) {
    avatar.innerHTML = '<img class="avatar-photo" src="img/nonAvatar.svg">';
  } else {
    avatar.innerHTML = '<img class="avatar-photo" src="'+ data.photo +'">';
  }
}

function userCall() {
  var userRequest = new XMLHttpRequest();

  userRequest.open ('GET', 'http://localhost:8000/api/v1/users/me', true);
  userRequest.setRequestHeader("Content-Type", "application/json");
  userRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
  userRequest.onload = function () {
    var greeting = document.querySelector(".greeting");
    if (userRequest.status >= 200 && userRequest.status < 400) {
      var data = JSON.parse(userRequest.responseText);
      greeting.innerHTML = "Hello, " + data.full_name;
      showAvatarImage(data);

    } else {
      console.log("La respuesta del servidor ha devuelto un error");
    }
  };
  userRequest.onerror = function() {
    console.log("Error al tratar de conectarse con el servidor");
  };

  userRequest.send();
}
function projectsCall() {
  var projectsRequest = new XMLHttpRequest();
  var user = JSON.parse(sessionStorage.getItem('user'));
  projectsRequest.open ('GET', 'http://localhost:8000/api/v1/projects?member=' + user.id + '&order_by= -total_activity', true);
  projectsRequest.setRequestHeader("Content-Type", "application/json");
  projectsRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
  projectsRequest.onload = function () {
    if (projectsRequest.status >= 200 && projectsRequest.status < 400) {
      var dataProject = JSON.parse(projectsRequest.responseText);
      for (var i = 0; i < dataProject.length; i++) {
        printProject(dataProject[i]);
      }
    } else {
      console.log("La respuesta del servidor ha devuelto un error");
    }
  };

  projectsRequest.onerror = function() {
    console.log("Error al tratar de conectarse con el servidor");
  };

  projectsRequest.send();
}

function printProject(project) {
  var divId = "d" + project.id + "_user";
  if (document.getElementById(divId) === null) {
    generateCardHtml(divId, project.slug, project.name);
  }
  basicInfoUpdate(project, divId);
  modulesCall(project, divId, project.slug);
  callProgressProject(project, divId);

}

function generateProjectInfo(projectSlug, projectName) {
  return "<div class='project-info truncate'>"+
    "<div class='img-project flex'>"+
      "<div class='project-img'>"+
        "</div>"+
        "<a href='http://localhost:9001/project/" + projectSlug + "'>" +
        "<h5 class='project-title truncate-title' title='" + projectName + "'></h5></a>"+
        "</div>"+
        "<small class='description-project truncate-description'></small>"+
        "<div class='like-watch flex'>"+
          "<div class='like-div flex'>"+
            "<img class='logolike' src='img/heart.png' alt='logo likes'>"+
            "<small >   Likes:  </small>"+
            "<small class='like'></small>"+
            "</div>"+
            "<div class='watch-div'>"+
              "<img class='logowatch' src='img/eye.png' alt='logo watching'>"+
              "<small>  Views: </small>"+
              "<small class='watch'></small>"+
              "</div>"+
              "</div>"+
              "</div>";
}

function generateProjectTimeline(projectSlug) {
  return "<div class='timeline-project flex'>"+
  "<div class='modules-div'>" +
    "<small>Modules: </small>" +
    "<small class='modules'></small>"+
    "<div>" +
    "<div class='modules-div'>" +
    "<small>Team: </small>" +
    "<a href='http://localhost:9001/project/" + projectSlug + "/team'><small class='team'></small></a>"+
  "</div>"+
  "</div>"+
  "</div>"+
  "</div>";
}

function genearteProjectProgres(projectSlug) {
  return "<div class='progress-project'>"+
        "<div class='stories-issues flex'>"+
          "<a href='http://localhost:9001/project/" + projectSlug + "/backlog'><div class='progress-stories flex'>"+
          "<p class='number-stories'></p>"+
          "<div class='progress flex'>"+
            "<p class= 'margin-paragraph'>IN PROGRESS</p>"+
            "<p class= 'margin-paragraph'>user stories</p>"+
          "</div>"+
          "</div></a>"+
          "<a href=' http://localhost:9001/project/" + projectSlug + "/issues'><div class='number-progress flex'>"+
          "<p class='number-issues'></p>"+
          "<div class='issues flex'>"+
            "<p class= 'margin-paragraph'>NEW</p>"+
            "<p class= 'margin-paragraph'>issues</p>"+
          "</div>"+
          "</div></a>"+
        "</div>"+

        "<div class='line-progress flex'>"+
        "<div class='sprint-div'>" +
          "<p>Sprint:  </p>"+
          "<p class= 'sprints'></p>" +
          "</div>"+
          "<div class='points-div'>" +
          "<p class= 'closed-points'></p>"+
          "<p class = 'p-user-stories'>user stories closed</p>"+
          "</div>"+
        "</div>"+

        "<div class='bar'>"+
          "<progress class='progress-bar' value='0' max='100'></progress>"+
          "<span class ='percentage-bar'></span>"+
        "</div>"+
        "<div>" +
	"<center><a href='view-project.html?projectSlug=" + projectSlug + "'>View project level Dashboard</a></center>"+
      "</div>";
}

function generateCardHtml(divId, projectSlug, projectName){

  card.innerHTML += "<div id='" + divId + "' class= 'projects_user'>"+
    generateProjectInfo(projectSlug, projectName) +
    generateProjectTimeline(projectSlug) +
    genearteProjectProgres(projectSlug) +
    "</div>";
}

function basicInfoUpdate(project, divId) {
  var projectTitle = document.querySelector("#" + divId + " .project-title");
  var imgProject = document.querySelector("#" + divId + " .project-img");
  var descriptionProject = document.querySelector("#" + divId + " .description-project");
  var teamProject = document.querySelector("#" + divId + " .team");
  var likesProject = document.querySelector("#" + divId + " .like");
  var watchProject = document.querySelector("#" + divId + " .watch");

  if (projectTitle.innerHTML !== project.name) {
    projectTitle.innerHTML = project.name;
  }
  if (project.logo_small_url === null) {
    imgProject.innerHTML = '<img class="img-nullProject" src="img/photo-null-project.svg">';

  } else {
    imgProject.innerHTML= '<img src="'+ project.logo_small_url +'"  title="">';
  }

  if (descriptionProject.innerHTML !== project.description) {
    descriptionProject.innerHTML = project.description;
  }
  if (teamProject.innerHTML !== project.members.length) {
    teamProject.innerHTML = project.members.length;
  }
  if (likesProject.innerHTML !== project.total_fans) {
    likesProject.innerHTML = project.total_fans;
  }
  if (watchProject.innerHTML !== project.total_watchers) {
    watchProject.innerHTML = project.total_watchers;
  }
}

function modulesCall(project, divId, projectSlug) {
  var modulesProject = document.querySelector("#" + divId + " .modules");
  var modules = [
    {
      property: "is_backlog_activated",
      label: '<img class="img-modules" src="img/backlog.svg">',
      link: "http://localhost:9001/project/" + projectSlug + "/backlog",
      description:"Backlog"
    },
    {
      property: "is_epics_activated",
      label: '<img class="img-modules" src="img/epics.svg">',
      link: "http://localhost:9001/project/" + projectSlug + "/epics",
      description:"Epics"
    },
    {
      property: "is_issues_activated",
      label: '<img class="img-modules" src="img/issues.svg">',
      link: "http://localhost:9001/project/" + projectSlug + "/issues",
      description:"Issues"
    },
    {
      property: "is_kanban_activated",
      label: '<img class="img-modules" src="img/kanban.svg">',
      link: "http://localhost:9001/project/" + projectSlug + "/kanban",
      description:"Kanban"
    },
    {
      property: "is_wiki_activated",
      label: '<img class="img-modules" src="img/wiki.svg">',
      link: "http://localhost:9001/project/" + projectSlug + "/wiki",
      description:"Wiki"
    },
    {
      property: "is_contact_activated",
      label: '<img class="img-modules" src="img/meetUp.svg">',
      link: "#",
      description:"meetUp"
    },
  ];
  modulesProject.innerHTML = "";
  for (var i = 0; i < modules.length; i++) {
    var module = modules[i];

    if (project[module.property] === true) {
      generateModuleSection(modulesProject, module, i);
    } else {
      console.log("no found");
    }
    if (modulesProject.innerHTML !== project[module.property]) {
      modulesProject.innerHTML === project[module.property];
    }
  }
}

function generateModuleSection(modulesProject, module, uniqueId) {
  modulesProject.innerHTML +=
  '<div class="tooltip tooltip'+ uniqueId +'">'
  + '<a href="' + module.link + '">' + module.label + '</a>'
  + '<span class="tooltip-text">' + module.description + '</span>'
  + '</div>';
}

function callProgressProject(project, divId) {
  var idProject = project.id;
  var userStoriesRequest = new XMLHttpRequest();
  userStoriesRequest.open ('GET', 'http://localhost:8000/api/v1/userstories?project='+ idProject, true);
  userStoriesRequest.setRequestHeader("Content-Type", "application/json");
  userStoriesRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
  userStoriesRequest.setRequestHeader("x-disable-pagination", true);
  userStoriesRequest.onload = function () {
    if (userStoriesRequest.status >= 200 && userStoriesRequest.status < 400) {
      var userStoriesProject = document.querySelector("#" + divId + " .number-stories");
      var data = JSON.parse(userStoriesRequest.responseText);
      if (userStoriesProject.innerHTML !== data.length) {
        userStoriesProject.innerHTML = data.length;
      }
    } else {
      console.log("The server response returned an error");
    }
  };
  userStoriesRequest.onerror = function() {
    console.log("Error when trying to connect to the server.");
  };
  userStoriesRequest.send();
  var issuesRequest = new XMLHttpRequest();
  issuesRequest.open ('GET', 'http://localhost:8000/api/v1/projects/' + idProject +'/issues_stats' , true);
  issuesRequest.setRequestHeader("Content-Type", "application/json");
  issuesRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
  issuesRequest.setRequestHeader("x-disable-pagination", true);
  issuesRequest.onload = function () {
    if (issuesRequest.status >= 200 && issuesRequest.status < 400) {
      var issuesProject = document.querySelector("#" + divId + " .number-issues");
      var data = JSON.parse(issuesRequest.responseText);
      if (issuesProject.innerHTML !== data.total_issues) {
        issuesProject.innerHTML = data.total_issues;
      }
    } else {
      console.log("The server response returned an error.");
    }
  };
  issuesRequest.onerror = function() {
    console.log("Error when trying to connect to the server.");
  };
  issuesRequest.send();

  var pointRequest = new XMLHttpRequest();
  pointRequest.open ('GET', 'http://localhost:8000/api/v1/projects/'+ idProject +'/stats',true);
  console.log(idProject);
  pointRequest.setRequestHeader("Content-Type", "application/json");
  pointRequest.setRequestHeader("x-disable-pagination", true);
  pointRequest.onload = function () {
    if (pointRequest.status >= 200 && pointRequest.status < 400) {
      var closedPoints = document.querySelector("#" + divId + " .closed-points");
      var percentageBar = document.querySelector("#" + divId + " .percentage-bar");
      var progressBar = document.querySelector("#" + divId + " .progress-bar");
      var sprintProject = document.querySelector("#" + divId + " .sprints");
      var data = JSON.parse(pointRequest.responseText);
      if (closedPoints.innerHTML !== data.closed_points + "/" + data.defined_points ) {
        closedPoints.innerHTML = data.closed_points + "/" + data.defined_points;
      }
      if (sprintProject.innerHTML !== data.total_milestones) {
        sprintProject.innerHTML = data.total_milestones;
      }
      var number = calculatePointPercentage(data);
      if (percentageBar.innerHTML !== number + "%") {
        percentageBar.innerHTML = number + "%";
      }
      progressBar.value = number;
      if (progressBar.innerHTML !== number) {
        progressBar.innerHTML = number;
      }
    } else {
      console.log("The server response returned an error.");
    }
  };
  pointRequest.onerror = function() {
    console.log("Error when trying to connect to the server.");
  };
  pointRequest.send();
}

function calculatePointPercentage(data) {
  var number;
  if (data.defined_points === 0) {
    number = 0;
  } else {
    number = Math.ceil(data.closed_points * 100/data.defined_points);
  }
  return number;
}
