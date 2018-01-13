(function($) {
  var indb;
  var initiateRequest = indexedDB.open("listofwords", 1);
  initiateRequest.onupgradeneeded = function(e) {
    console.log("Upgrading DB...");
    var thisDB = e.target.result;
    if (!thisDB.objectStoreNames.contains("storeofwordlist")) {
      thisDB.createObjectStore("storeofwordlist", {
        keyPath: "key",
        autoIncrement: true
      });
    }
  }
  initiateRequest.onsuccess = function Add(e) {
    console.log("Open Success!");
    indb = e.target.result;
    document.getElementById('btnAdd').addEventListener('click', function() {
      var textin = document.getElementById('textField').value;
      var subject = document.getElementById('subj').value;
      var msg = document.getElementById('msg').value;
      var date = new Date();
      var n = date.toLocaleString();
      if (textin == "") {
        alert("Text missing! Please enter text.");
        return false;
      } else if (msg == "") {
        alert("Missing details found! Please fill in missing details!");
        return false;
      } else if (subject == "") {
        alert("Missing details found! Please fill in missing details!");
        return false;
      }
      if (!textin.trim() && subject.trim && msg.trim) {
        //empty
      } else {
        addWord(textin, subject, msg, n);
      }
    });
    renderList();
  }
  initiateRequest.onerror = function(e) {
    console.log("Open Error!");
    console.dir(e);
  }
  var callback = function(a, b) {

  }

  function addWord(t, s, m, n) {

    console.log('adding ' + t + ',' + s + ',' + m + ',' + n);
    var transaction = indb.transaction(["storeofwordlist"], "readwrite");
    var store = transaction.objectStore("storeofwordlist");
    var request = store.add({
      textin: t,
      subject: s,
      msg: m,
      date: n
    });
    request.onerror = function(e) {
      console.log("Error", e.target.error.name);
      //Error handler
    }
    request.onsuccess = function(e) {
      console.log("added " + t, s, m, n);
      document.getElementById('textField').value = '';
      document.getElementById('subj').value = '';
      document.getElementById('msg').value = '';
      document.getElementById('time').value = '';
      renderList();
    }
  }

  function putWord(id) {

    textin = document.getElementById('textField').value;
    var subject = document.getElementById('subj').value;
    var msg = document.getElementById('msg').value;
    var date = new Date();
    var n = date.toLocaleString();
    if (textin == "") {
      alert("Text missing! Please enter text.");
      return false;
    } else if (msg == "") {
      alert("Missing details found! Please fill in missing details!");
      return false;
    } else if (subject == "") {
      alert("Missing details found! Please fill in missing details!");
      return false;
    }
    var transaction = indb.transaction(["storeofwordlist"], "readwrite");
    var store = transaction.objectStore("storeofwordlist");
    var request = store.put({
      key: id,
      textin: textin,
      subject: subject,
      msg: msg,
      date: n
    });
    request.onerror = function(e) {
      console.log("Error", e.target.error.name);
      //Error handler
    }
    request.onsuccess = function(e) {
      document.getElementById('textField').value = '';
      document.getElementById('subj').value = '';
      document.getElementById('msg').value = '';
      document.getElementById('time').value = '';
      renderList();
    }
  }

  function editWord(id) {
    $('#detail').hide();
    var transaction = indb.transaction(["storeofwordlist"], "readwrite");
    var store = transaction.objectStore("storeofwordlist");
    var request = store.get(id);
    request.onerror = function(e) {
      console.log("Error", e.target.error.name);
      //Error handler
    }
    request.onsuccess = function(e) {
      //console.log("added " + t,s,m,n);
      document.getElementById('btnAdd').disabled = true;
      document.getElementById('textField').value = request.result.textin;
      document.getElementById('subj').value = request.result.subject;
      document.getElementById('msg').value = request.result.msg;

      var $SaveBtn = $('<button id="save-btn" class="save_btn" style="color:black; background-color: darkgray; border-radius: 8px;border: 2px solid #008CBA;"> Save Note</button>');

			if (!document.getElementById('form').contains(document.getElementById('save-btn'))) {
        $('#form').append($SaveBtn);
      }
			else
			{

      }

      document.getElementById('save-btn').addEventListener('click', function() {
        document.getElementById('form').style.display = "show";
        putWord(request.result.key);
				document.getElementById('btnAdd').disabled = false;
				$('#save-btn').hide();
      }, false);
      $('#form').show();
    }
  }
  var loadTextByKey = function(key) {
    // console.log(key);
    var transaction = indb.transaction(['storeofwordlist'], 'readonly');
    var store = transaction.objectStore('storeofwordlist');
    var request = store.get(key);
    request.onerror = function(event) {
      // Handle errors!
    };
    request.onsuccess = function(event) {
      // Do something with the request.result!
			$('#form').hide();
      $('#updatedetail').html('<br>' + '*#*#*#* Notes Properties *#*#*#* ' + '<br>' + 'Name: ' + request.result.textin + '<br>' + ' Subject: ' + request.result.subject + '<br>' + 'Message: ' + request.result.msg + '<br>' + 'Message Length: ' + request.result.msg.length + '<br>' + 'Date: ' + request.result.date + '<br>');
      var $AddBtn = $('<button id="del" style="color:black; background-color: darkgray; border-radius: 8px;border: 2px solid #008CBA;">Add New Note</button>');
      $AddBtn.click(function(){
        //	console.log('Delete' + key);
        document.getElementById('btnAdd').disabled = false;
			  $('#save-btn').hide();
				$('#form').show();

      });
	    $('#updatedetail').append($AddBtn);
			 $($AddBtn).click(function(){
			$('#updatedetail').hide();
			 })
    };
  }

  var a;
  var b;

  function renderList() {
    var transaction = indb.transaction('storeofwordlist', 'readonly');
    var store = transaction.objectStore('storeofwordlist');
    var countRequest = store.count();
    countRequest.onsuccess = function() {
      $('#count').html('<button type="button" class="btn btn-success" style="background-color:green;margin:auto;display:block;font-size: 20px;">No. of Notes: <span class="badge" style="font-size: 20px">  ' + countRequest.result + '</span></button><br>');
    };
    a = [];
    b = [];
    $('#tnode').empty();
    var request = store.openCursor();
    request.onsuccess = function(evt) {
      var cursor = evt.target.result;
      if (cursor) {
        a.push(cursor.key);
        b.push(cursor.value);
        cursor.continue();
      }
    };
    transaction.oncomplete = function(e) {
      for (var i = 0; i < a.length; i++) {
        $('tbody#tnode').append('<tr><td><a href="#" class="display_btn" data-key="' + a[i] + '">' + b[i].subject + '</td><td>' + b[i].msg.length + '</a></td><td>' + b[i].date + '</td><td><button id="del" class="delete_btn" data-key="' + a[i] + '" style="color:black; background-color: darkgray; border-radius: 8px;border: 2px solid #008CBA;">Delete</button></td><td><button id="edit" class="edit_btn" data-key="' + a[i] + '" style="color:black; background-color: darkgray; border-radius: 8px;border: 2px solid #008CBA;">Edit</button></td></tr>');
      }
    };
  }

  function deleteWord(key) {
    alert("Note is being deleted!");
    var transaction = indb.transaction(['storeofwordlist'], 'readwrite');
    var store = transaction.objectStore('storeofwordlist');
    var request = store.delete(key);
    request.onsuccess = function(evt) {
      renderList();
      $('#detail').empty();
      $('#save-btn').hide();
      document.getElementById('btnAdd').disabled = false;
      document.getElementById('form').style.display = "";
    };
  }
  $(document).on('click', 'a.display_btn', function() {
    document.getElementById('form').style.display = "";
    loadTextByKey(parseInt($(this).attr('data-key')));
  });
  $(document).on('click', 'button.delete_btn', function() {
    document.getElementById('form').style.display = "";
    deleteWord(parseInt($(this).attr('data-key')));
  });
  $(document).on('click', 'button.edit_btn', function() {
    document.getElementById('form').style.display = "";
    editWord(parseInt($(this).attr('data-key')));
  });
})(jQuery);
