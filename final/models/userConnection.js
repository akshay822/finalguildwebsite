//var userConnections = [];
// var makeUserConnection = function(id, rsvp){
//   var userConnection = {connectionid: id, rsvp: rsvp};
//   userConnections.push(userConnection);
//   module.exports.userConnections = userConnections;
//
//   return userConnection;
// };

class userConnection{
  constructor(cid, rsvp){
    this._cid = cid;
    this._rsvp = rsvp;
  }
}

function loadTable(sessionuid, allUserConnections, allConnections){
  allUserConnections.forEach(function(element){
    allConnections.forEach(function(x){

      if(x.cid === element.cid){
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");

        td1.innerHTML = x.title;
        td2.innerHTML = x.type;
        td3.innerHTML = element.rsvp;

        var buttonstd4 = document.createElement("ul");

        var updatetd4 = document.createElement("li");

        if(element.rsvp === "Creator"){
          var updateform = document.createElement("form");
          updateform.action = '/savedConnections';
          updateform.method = "post";
          updateform.className = "updateform";

          var inputupdate = document.createElement("input");
          inputupdate.type = "hidden";
          inputupdate.name = "commandid";
          inputupdate.value = x.cid;

          var updatebutton = document.createElement("button");
          updatebutton.type = "submit";
          updatebutton.className = "updatebutton";
          updatebutton.name = "update";
          updatebutton.value = "creator";
          updatebutton.innerHTML = "Update Connection Info";

          updateform.appendChild(inputupdate);
          updateform.appendChild(updatebutton);
          updatetd4.appendChild(updateform);
          buttonstd4.appendChild(updatetd4);
        }
        else{
          var updateform = document.createElement("form");
          updateform.action = '/connection';
          updateform.method = "get";
          updateform.className = "updateform";

          var inputupdate = document.createElement("input");
          inputupdate.type = "hidden";
          inputupdate.name = "id";
          inputupdate.value = x.cid;

          var updatebutton = document.createElement("button");
          updatebutton.type = "submit";
          updatebutton.className = "updatebutton";
          updatebutton.innerHTML = "Update";

          updateform.appendChild(inputupdate);
          updateform.appendChild(updatebutton);
          updatetd4.appendChild(updateform);
          buttonstd4.appendChild(updatetd4);
        }

        var deletetd4 = document.createElement("li");

        var deleteform = document.createElement("form");
        deleteform.action = '/savedConnections';
        deleteform.method = "post";
        deleteform.className = "deleteform";

        var inputdelete = document.createElement("input");
        inputdelete.type = "hidden";
        inputdelete.name = "commandid";
        inputdelete.value = x.cid;

        var deletebutton = document.createElement("button");
        deletebutton.type = "submit";
        deletebutton.className = "deletebutton";
        deletebutton.name = "delete";
        deletebutton.value = "delete";
        deletebutton.innerHTML = "Delete";

        deleteform.appendChild(inputdelete);
        deleteform.appendChild(deletebutton);
        deletetd4.appendChild(deleteform);
        buttonstd4.appendChild(deletetd4);

        td4.appendChild(buttonstd4);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);


        document.getElementById("connectionstable").appendChild(tr);

      }

    });

      //document.getElementById("username").innerHTML = getUserNameByUid(element._uid);



  });


}

//module.exports.userConnections = userConnections;
//module.exports = userConnection;
