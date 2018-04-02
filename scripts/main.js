"use strict";

/* global Chart */
var chartsScreen = document.querySelector('.data-container');
var loadingScreen = document.querySelector('.loading-screen');

function showCharts() {
  var loginScreen = document.querySelector('.login-container');

  loginScreen.classList.add('hidden');
  chartsScreen.classList.remove('hidden');
}

function onKeyPress(event) {
  var ENTER_KEY = 13;
  if (event.charCode === ENTER_KEY) {
    getIssuesData();
  }
}

//new code
//var url_string = window.location.href;
//var url = new URL(url_string);
//var inputProject = url.searchParams.get("projectSlug");
var inputProject = location.search.split('projectSlug=')[1];
//var inputProject = document.querySelector(".js-input-slug");
var searchBtn = document.querySelector(".js-btn-search");

function getPriorityData(dataIssues) {
  var prioritiesCount = {
    low: 0,
    normal: 0,
    high: 0
  };

  for (var key in dataIssues.issues_per_priority) {
    var prioritiesData = dataIssues.issues_per_priority[key];
    if (prioritiesData.name === "Low") {
      prioritiesCount.low = prioritiesData.count;
    } else if (prioritiesData.name === "Normal") {
      prioritiesCount.normal = prioritiesData.count;
    } else if (prioritiesData.name === "High") {
      prioritiesCount.high = prioritiesData.count;
    }

  }

  return prioritiesCount;
}

function printPrioritiesChart(prioritiesCount) {

  var ctxPriority = document.getElementById("js-priorityChart");

  Chart.defaults.global.maintainAspectRatio = false;
  var priorityChart = new Chart(ctxPriority, {
    type: 'pie',
    data:{
      labels: [ "High Priority", "Normal Priority", "Low Priority"],
      datasets: [{
        label: '# of Priority',
        data: [prioritiesCount.high, prioritiesCount.normal, prioritiesCount.low],
        backgroundColor: [

          '#BD513F',
          '#3C715A',
          '#52BD8F'
        ],
        borderColor:[
          "white"
        ],
            borderWidth: 3
        }]
    },
  });
}

function getSeverityData(dataIssues){
  var severityCount = {
    wishlist:0,
    minor:0,
    normal:0,
    important:0,
    critical:0
  };
  for (var key in dataIssues.issues_per_severity) {
    var severityData = dataIssues.issues_per_severity[key];
    if (severityData.name === "Wishlist") {
      severityCount.wishlist = severityData.count;
    } else if (severityData.name === "Minor") {
      severityCount.minor = severityData.count;
    } else if (severityData.name === "Normal") {
      severityCount.normal = severityData.count;
    } else if (severityData.name === "Important") {
      severityCount.important = severityData.count;
    } else if (severityData.name === "Critical") {
      severityCount.critical = severityData.count;
    }
  }

  return severityCount;
}

function printSeveritiesChart(severityCount) {

  var ctxSeverity = document.getElementById("js-severityChart");

  Chart.defaults.global.maintainAspectRatio = false;
  var severityChart = new Chart(ctxSeverity, {
    type: 'pie',
    data:{
      labels: [ "Critical", "Important", "Normal", "Minor", "Wishlist"],
      datasets: [{
        label: '# of Severity',
        data: [
          severityCount.critical,
          severityCount.important,
          severityCount.normal,
          severityCount.minor,
          severityCount.wishlist
        ],
        backgroundColor: [

          '#5A231F',
          '#A75F5A',
          '#31704B',
          '#5AA77A',
          '#9CF3C0'
        ],
        borderColor:[
          "white"
        ],
        borderWidth: 3
      }]
    },
  });
}


function getOpenClosedData(dataIssues) {
  var closedIssues = 0;
  var openIssues = {
    readyForTest: 0,
    new: 0,
    inProgress: 0,
    needsInfo: 0,
    totalOpen: 0
  };

  closedIssues = dataIssues.closed_issues;
  openIssues.totalOpen = dataIssues.opened_issues;
  for (var key in dataIssues.issues_per_status) {
    var statusData = dataIssues.issues_per_status[key];
    if (statusData.name === "Ready for test") {
      openIssues.readyForTest = statusData.count;
    } else if (statusData.name === "New") {
      openIssues.new = statusData.count;
    } else if (statusData.name === "In progress") {
      openIssues.inProgress = statusData.count;
    } else if (statusData.name === "Needs Info") {
      openIssues.needsInfo = statusData.count;
    }
  }

  return [openIssues, closedIssues];
}


function printOpenClosedChart(openClosedCount) {
  var readyForTest = openClosedCount[0].readyForTest;
  var newIssue = openClosedCount[0].new;
  var inProgress = openClosedCount[0].inProgress;
  var needsInfo = openClosedCount[0].needsInfo;
  var closedIssues = openClosedCount[1];
  var totalOpen = openClosedCount[0].totalOpen;

  var readyForTestPercent = ((readyForTest * 100)/totalOpen).toFixed(2);
  var newIssuePercent = ((newIssue * 100)/totalOpen).toFixed(2);
  var inProgressPercent = ((inProgress * 100)/totalOpen).toFixed(2);
  var needsInfoPercent = ((needsInfo * 100)/totalOpen).toFixed(2);





  var dataPack1 = [closedIssues, totalOpen];
  //var dataPack2 = [totalOpen];
  var openClosedLabels = ["Open", "Closed"];

  // Chart.defaults.global.elements.rectangle.backgroundColor = '#FF0000';

  var ctxOpenClosed = document.getElementById('js-openClosedChart');
  var openClosedChart = new Chart(ctxOpenClosed, {
    type: 'horizontalBar',
    data: {
      labels: ["Closed", "Open"],
      datasets: [{
        label: 'Number of issues',
        data: [closedIssues, totalOpen],
        backgroundColor: [
          '#5F3869',
          '#9DE3BE'
        ],
      }]
    },
    options: {
      legend: {
        display: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    }
  });
  var printTable = document.querySelector("#js-openIssuesPerStatus");
  printTable.innerHTML = '<table class="status-table"><tr><th>Open status</th><th> % </th></tr><tr><td>New</td><td>' + newIssuePercent + ' %</td></tr><tr><td>In Progress</td><td> ' + inProgressPercent + ' %</td></tr><tr><td>Needs info</td><td> ' + needsInfoPercent + ' %</td></tr></table>';
}


function getNotAssignedData(dataIssues) {  var notAssignedIssues = 0;
  notAssignedIssues = dataIssues.issues_per_assigned_to["0"].count;
  return notAssignedIssues;
}

function getTimelineData(dataTimeline) {
  var lastTimelineItems = [];
  for (var i = 0; lastTimelineItems.length < 5 && i < dataTimeline.length; i++) {
    if(dataTimeline[i].event_type === "issues.issue.change" || dataTimeline[i].event_type === "issues.issue.create"){
      var timeLineItems = {
        type: dataTimeline[i].event_type,
        subject: dataTimeline[i].data.issue.subject,
        photo: dataTimeline[i].data.user.photo,
        userName: dataTimeline[i].data.user.name,
        created: dataTimeline[i].created
      };
      if (timeLineItems.photo === null) {
        timeLineItems.photo = "img/user.png";
      }
      if (timeLineItems.type === "issues.issue.change") {
        timeLineItems.type = "changed";
      }else {
        timeLineItems.type = "created";
      }
      lastTimelineItems.push(timeLineItems);
    }
  }
  return lastTimelineItems;
}

function printTimeline(lastTimelineItems) {
  var timelineContainer = document.querySelector('.timeline');
  timelineContainer.innerHTML="";
  for (var i = 0; i < lastTimelineItems.length; i++) {
    var time = new Date(lastTimelineItems[i].created).toLocaleString();
    timelineContainer.innerHTML +=
    "<div class='timeline-item'> <div class='flex-photo-text'><div class='timeline-user-photo  padding-photo'><img src='" + lastTimelineItems[i].photo + "'></div><div class='timeline-text'> <span>"+ lastTimelineItems[i].userName + "</span> " + lastTimelineItems[i].type + " the issue <span>" + lastTimelineItems[i].subject + "<span> </div></div><div class='timeline-date'>" + time + " </div></div>";
  }
}

function getUserWithMostIssues(dataIssues) {
  var topUser = {
    name:"" ,
    count: 0
  };
  for (var key in dataIssues.issues_per_assigned_to){
    if (dataIssues.issues_per_assigned_to[key].count > topUser.count && dataIssues.issues_per_assigned_to[key].name !== "No asignado") {
      topUser.count = dataIssues.issues_per_assigned_to[key].count;
      topUser.name = dataIssues.issues_per_assigned_to[key].name;
    }
  }
  return topUser;
}

function printUserAndUnassigned(userWithMostIssues, notAssignedCount) {
  var topUserUnassigned = document.querySelector('.topUserUnassigned-container');
  topUserUnassigned.innerHTML= "<div class='top-user  flex-photo-text'><div class='top-user-photo padding-photo'><img src='img/cookie_jar.png'></div><div class='top-user-text'>Over time, <span>"+ userWithMostIssues.name +"</span> has been assigned <span>"+ userWithMostIssues.count + "</span> issues. Congratulations! someone give " + userWithMostIssues.name + " a cookie! </div></div> <div class='unassigned  flex-photo-text'><div class='unassigned-text'>Sponsor an issue in need, there are <span>" + notAssignedCount + " unassigned issues</span></div><div class='unassigned-photo'><img src='img/box.png'></div></div>";
}


// Main function
function getIssuesData() {
  showCharts();
  //Access API to get ID of the project by slug
  var requestProjectId = new XMLHttpRequest();
  var slugName = location.search.split('projectSlug=')[1];
// var slugName = inputProject.value;
  slugName = slugName.toLowerCase();
  var urlApiProject = "http://localhost:8000/api/v1/projects/by_slug?slug=";
  urlApiProject = urlApiProject + slugName;

  requestProjectId.open('GET', urlApiProject, true);

  // Function to get issues stats
  requestProjectId.onload = function() {
    if (requestProjectId.status >= 200 && requestProjectId.status < 400) {
      // Access API to get the issues stats
      var dataProject = JSON.parse(requestProjectId.responseText);
      var projectId = dataProject.id;
      var urlApiIssues = "http://localhost:8000/api/v1/projects/" + projectId + "/issues_stats";


      setInterval(function (){

      var requestProjectIssues = new XMLHttpRequest();
      requestProjectIssues.open('GET', urlApiIssues, true);
      requestProjectIssues.onload = function() {
        loadingScreen.classList.add('hidden');
        if (requestProjectIssues.status >= 200 && requestProjectIssues.status < 400) {
          var dataIssues = JSON.parse(requestProjectIssues.responseText);

          var prioritiesCount = getPriorityData(dataIssues);
          printPrioritiesChart(prioritiesCount);
          var severityCount= getSeverityData(dataIssues);
          printSeveritiesChart(severityCount);
          var openClosedCount = getOpenClosedData(dataIssues);
          printOpenClosedChart(openClosedCount);
          var notAssignedCount = getNotAssignedData(dataIssues);
          var userWithMostIssues = getUserWithMostIssues(dataIssues);
          printUserAndUnassigned(userWithMostIssues, notAssignedCount);
        } else {
          chartsScreen.innerHTML = "There has been an error";
        }
      };
      requestProjectIssues.onerror = function() {
        chartsScreen.innerHTML = "There has been an error";
      };
      requestProjectIssues.send(); }, 10000);

setInterval(function (){
  var urlApiTimeline = "http://localhost:8000/api/v1/timeline/project/" + projectId;
  var requestProjectTimeline = new XMLHttpRequest();
  requestProjectTimeline.open('GET', urlApiTimeline, true);
  requestProjectTimeline.onload = function() {
    if (requestProjectTimeline.status >= 200 && requestProjectTimeline.status < 400) {
      var dataTimeline = JSON.parse(requestProjectTimeline.responseText);
      var issuesTimeLine = getTimelineData(dataTimeline);
      printTimeline(issuesTimeLine);
    }
    else {
      chartsScreen.innerHTML = "There has been an error";
    }
  };
  requestProjectTimeline.onerror = function() {
  };
  requestProjectTimeline.send();}, 10000);

    } else {
      chartsScreen.innerHTML = "There has been an error";
    }
  };

  requestProjectId.onerror = function() {
    chartsScreen.innerHTML = "There has been an error";
  };
  requestProjectId.send();
}

searchBtn.addEventListener('click', getIssuesData);
inputProject.addEventListener("keypress", onKeyPress);
