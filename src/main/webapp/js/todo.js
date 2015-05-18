var currName;
var MessageList = [];
var count = 0;
var totalCount = 0;
function run(){
   var array = restore() || [];
   createAll(array);
   
        }
function theMessage(message, nick, id) {
    return {
        description: message,
        nameId: nick,
        id: id
    };
}
var appState = {
	mainUrl : 'http://localhost:999/chat',
	token : 'TE11EN'
}
function uniqueId() {
    var date = Date.now();
    var random = Math.random() * Math.random();
    return Math.floor(date * random).toString();
}
function updateMessage() {
    get(appState.mainUrl + "?token=" + appState.token,
        function (answer) {
            chatText = document.getElementById('block2');
            var str = "";
            for (var i = 0; i < answer.messages.length; i++) {
                str += answer.messages[i].user + " : " + answer.messages[i].message + "\n";
            }
            chatText.value = str;
        });
};
function isEmail(){
      var Text =    document.getElementById('todoText');
      var  Rectangle  = document.getElementById('block2');
      var div = document.createElement('div');
      var postData = new Object();
	postData.message = Text.value;
	postData.user = currName;
	postData.id = uniqueId();
      div.innerHTML =  currName +': '+ Text.value;
      div.setAttribute("onclick", 'select(this)');
      div.id = postData.id;
      div.description = Text.value;
      div.nameId = currName;
      MessageList.push(theMessage(Text.value,currName, div.id));
      store(MessageList);
      Rectangle.appendChild(div);
      Text.value = '';
	post(appState.mainUrl, JSON.stringify(postData),
        function () {
            updateMessage();
        });
}  
function select(elem) {
    if (elem.style.color == 'black') {
        elem.style.background = 'LightSlateGray';
        elem.style.color = 'red';
    }
     else {
        elem.style.background = 'Cornsilk';
        elem.style.color = 'black';
    }
}
function Delete() {
      var children = document.getElementById('block2').childNodes;
      var count = 0;
    for (var i = 0; i < children.length; i++) {
        if (children[i].style.color == 'red' && children[i].nameId==currName ) {
            var deleteDiv = children[i];
            remove(deleteDiv);
        }
    }
    deleteF(appState.mainUrl,
    function () {
        updateMessage();
    });
    
}
function edit(){
	var Text = document.getElementById('Name');
       	Text.value = '';   
}
function remove(elem) {
    var parentElement = elem.parentNode;
    parentElement.removeChild(elem);
}
function save(){
	var Text = document.getElementById('Name');
       	currName = Text.value;
	
}
function store(listToSave) {
      if (typeof (Storage) == "undefined") {
        return;
    }
    localStorage.setItem("aNN", JSON.stringify(listToSave));
}
function restore() {
    if (typeof (Storage) == "undefined") {
        return;
    }

    var item = localStorage.getItem("aNN");
    return item && JSON.parse(item);
}
function createAll(arr) {
    var parentElem = document.getElementById('block2');
    for (var i = 0; i < arr.length; i++) {
        var div = document.createElement('div');
        div.setAttribute("onclick", 'select(this)');
        div.id = arr[i].id;
        div.nameId = arr[i].nameId;
        div.description = arr[i].description;
        div.innerHTML = div.nameId + ': ' + div.description;
        parentElem.appendChild(div);
        MessageList.push(arr[i]);
        document.getElementById('Name').value = arr[arr.length - 1].nameId;
    }
}
function online() {
    stat = document.getElementById('status');
    if (stat.innerHTML == "Online")
    stat.innerHTML = "Offline";
    else if (stat.innerHTML == "Offline")
    stat.innerHTML = "Online";
};
function get(url, continueWith) {
	ajax('GET', url, null, continueWith);
}

function post(url, data, continueWith) {
	ajax('POST', url, data, continueWith);	
}

function deleteF(url,continueWith) {
	ajax('DELETE', url, null, continueWith);	
}
function ajax(method, url, data, continueWith) {
	stat = document.getElementById('status');
    var xmlhttp = getXmlHttp();
    xmlhttp.open(method, url, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                if (xmlhttp.responseText != "")
                    continueWith(JSON.parse(xmlhttp.responseText));
                else
                    continueWith();
                stat.innerHTML = "Online";
                stat.style.background = "#7FFF00";
            }
            if (xmlhttp.status == 0) {
                stat.innerHTML = "Offline";
                stat.style.background = "red";
            }
        }
    };
    xmlhttp.ontimeout = function () {
        stat.innerHTML = "Offline";
        stat.style.background = "red";
    }
    xmlhttp.send(data);
}

function getXmlHttp() {
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}




