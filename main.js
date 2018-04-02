'use strict';

var buttonLogin = document.getElementById("buttonLogin_js");
var loginErrorText = document.querySelector(".login-error");
var request = new XMLHttpRequest();

buttonLogin.addEventListener("click", login);

function getUserAccountInfo() {
  var username = document.getElementById("username_js").value;
  var password = document.getElementById("password_js").value;
  var payload = {
    username: username ,
    password: password ,
    type:"normal"
  };

  return payload;
}

function login() {
  request.open('POST', 'http://localhost:8000/api/v1/auth', true); // use true to make the request async
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("Accept", "application/json");
  request.onload = function() {
    var data = JSON.parse(request.responseText);

    if (request.status >= 200 && request.status < 400) {
      var value = data.auth_token;
      console.log("Funciona!");
      var userData = data;
      sessionStorage.setItem("token", JSON.stringify(value));
      sessionStorage.setItem("user", JSON.stringify(userData));
      window.location.href = "dashboard.html" ;
    } else{
      if (data._error_type === "taiga.base.exceptions.WrongArguments") {
        loginErrorText.innerHTML = "Username or password does not matches user." ;
        loginErrorText.style.backgroundColor = '#ef0707';
        loginErrorText.style.color = '#ffffff';
        loginErrorText.style.fontSize = '1.2em';
      } else {
        console.log("The server returned an error");
      }
    }
  };

  request.onerror = function() {
    console.log("Error when connecting to the server");
  };

  var userInfo = getUserAccountInfo();
  request.send(JSON.stringify(userInfo));

}
