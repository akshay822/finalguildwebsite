// id = 0;
// var makeConnection = function(type, title, charname, description, where, when){
//   id++;
//   var connectionModel = {id: id, type: type, title: title, charname: charname, description: description, where: where, when: when};
//   return connectionModel;
// };
//
// module.exports.makeConnection = makeConnection;


function displayConnection(connection, sessionuid){
  console.log(connection);
  console.log(sessionuid);

  var idnumber = parseInt(window.location.href.split("=")[1]);
  if(isNaN(idnumber)){
    //console.log("its not a number");
    window.location.pathname="connections";
  }
  else{
      //console.log("populate connection");
      document.getElementById("connectiontitle").innerHTML = connection.title;
      document.getElementById("connectionhost").innerHTML = connection.charname;
      document.getElementById("connectionwhere").innerHTML = connection.where;
      document.getElementById("connectiondate").innerHTML = connection.when;
      document.getElementById("connectiontime").innerHTML = connection.time;
      document.getElementById("innerconnectiondetails").innerHTML = connection.description;

      var goingbuttons = document.getElementById("goingbuttons");

      var goingparagragh = document.createElement("p");
      goingparagragh.innerHTML = "Going?";

      goingbuttons.appendChild(goingparagragh);

      var addform = document.createElement("form");
      addform.action = "/savedConnections";
      addform.method = "post";

      var inputadd = document.createElement("input");
      inputadd.type = "hidden";
      inputadd.name = "commandid";
      inputadd.value = idnumber;

      var inputaddsession = document.createElement("input");
      inputaddsession.type = "hidden";
      inputaddsession.name = "sessionuid";
      inputaddsession.value = sessionuid;

      var inputmaybe = document.createElement("input");
      inputmaybe.type = "hidden";
      inputmaybe.name = "commandid";
      inputmaybe.value = idnumber;

      var inputmaybesession = document.createElement("input");
      inputmaybesession.type = "hidden";
      inputmaybesession.name = "sessionuid";
      inputmaybesession.value = sessionuid;

      var inputno = document.createElement("input");
      inputno.type = "hidden";
      inputno.name = "commandid";
      inputno.value = idnumber;

      var inputnosession = document.createElement("input");
      inputnosession.type = "hidden";
      inputnosession.name = "sessionuid";
      inputnosession.value = sessionuid;

      var addbutton = document.createElement("button");
      addbutton.innerHTML = "Yes";
      addbutton.type = "submit";
      addbutton.name = "command";
      addbutton.value = "add";
      addbutton.id = "addbutton";

      var maybeform = document.createElement("form");
      maybeform.action = "/savedConnections";
      maybeform.method = "post";

      var maybebutton = document.createElement("button");
      maybebutton.innerHTML = "Maybe";
      maybebutton.type = "submit";
      maybebutton.name = "command";
      maybebutton.value = "maybe";
      maybebutton.id = "maybebutton";

      var noform = document.createElement("form");
      noform.action = "/savedConnections";
      noform.method = "post";

      var nobutton = document.createElement("button");
      nobutton.innerHTML = "Not Going";
      nobutton.type = "submit";
      nobutton.name = "command";
      nobutton.value = "no";
      nobutton.id = "nobutton";

      addform.appendChild(inputadd);
      maybeform.appendChild(inputmaybe);
      noform.appendChild(inputno);

      addform.appendChild(inputaddsession);
      maybeform.appendChild(inputmaybesession);
      noform.appendChild(inputnosession);

      addform.appendChild(addbutton);
      maybeform.appendChild(maybebutton);
      noform.appendChild(nobutton);

      goingbuttons.appendChild(addform);
      goingbuttons.appendChild(maybeform);
      goingbuttons.appendChild(noform);

    }

  //document.getElementById("connectiontitle").appendChild(document.create)
}

function loadList(allconnections, conntypes){
  console.log(allconnections);
  console.log(conntypes);
  conntypes.forEach(function(element){
    var h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode(element));
    document.getElementById("dynamic-list").appendChild(h2);

    var ul = document.createElement("ul");

    allconnections.forEach(function(connection){
      if(connection.type === element){
        var li = document.createElement("li");

        var a = document.createElement("a");
        a.textContent = connection.title;
        a.setAttribute('href', "/connection?id=" + connection.cid)

        li.appendChild(a);
        ul.appendChild(li);
      }

    document.getElementById("dynamic-list").appendChild(ul);
    });
  });

}
