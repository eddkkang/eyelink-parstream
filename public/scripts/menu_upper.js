function getList(id){  
  $.ajax({
    url: "/management/restapi/getCodeList",
    dataType: "json",
    type: "get",
    data: {id : id},
    success: function(result) {
      if (result.rtnCode.code == "D003") {                
      } else {        
        result.rtnData.forEach(function(d){          
          deleteMenu(d._source.code, false);
        });        
        deleteMenu(id, true);        
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function deleteMenu(id, status){  
  console.log(id);  
  $.ajax({
    url: "/management/menu/" + id,
    dataType: "json",
    type: "DELETE",
    data: {id : id},
    success: function(result) {
      if(status){
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
        if (result.rtnCode.code == "D003") {
          location.href = "/management/menu_upper";
        }
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });  
}

function drawUpdate(id, name){
  console.log(id, name);
  $('#call').empty();
  var sb = new StringBuffer();
  sb.append('<div class="row"><div class="col-md-12"><div class="portlet light bordered">');
  sb.append('<div class="portlet-title"><div class="caption font-dark"><span class="caption-subject bold uppercase font-blue-sharp">');
  sb.append('Edit Upper Menu</span></div></div><div class="portlet-body form">');
  sb.append('<form onsubmit="return false;" class="form-horizontal form-bordered">');
  sb.append('<div class="form-body"><div class="form-group last"><label class="control-label col-md-2">Code</label>');
  sb.append('<div class="col-md-1 form-inline"><input id="ecode" type="text" name="ecode" value="'+id+'" data-placeholder="ecode" class="form-control"/>');
  sb.append('</div><label class="control-label col-md-2">Name</label><div class="col-md-3 form-inline">');
  sb.append('<input id="ename" type="text" name="ename" value="'+name+'" data-placeholder="ename" class="form-control"/>');
  sb.append('</div><div class="col-md-1 form-inline"><button id="btn_edit" class="btn blue" onclick="clickEdit('+id+')">Edit</button></div>');
  sb.append('</div><div class="form-group"><div id="register_tnc_error_edit" style="text-align:center;"></div>');
  sb.append('</div></div></form></div></div></div></div>');  
  $('#call').append(sb.toString());     
}

function clickEdit(id){  
  var code =$("#ecode").val();
  var name = $("#ename").val();
  console.log(code , name);  
  if (code == "") {
    $("#ecode").focus();
    $("#register_tnc_error_edit").html("Code를 입력하세요.");
    $("#register_tnc_error_edit").show();
    return false;
    }
    if (9999<parseInt($("#ecode").val())||parseInt($("#ecode").val())<999) {
      console.log(parseInt($("#ecode").val()));
      $("#ecode").focus();
      $("#register_tnc_error_edit").html("Code는 4자리 숫자로 입력하세요");
      $("#register_tnc_error_edit").show();
      return false;
    }
    if (parseInt($("#ecode").val())%1000 != 0) {
      console.log(parseInt($("#ecode").val()));
      $("#ecode").focus();
      $("#register_tnc_error_edit").html("Upper Menu Code는 천의 배수로 입력하세요");
      $("#register_tnc_error_edit").show();
      return false;
    }
    if ($("#ename").val() == "") {
      $("#ename").focus();
      $("#register_tnc_error_edit").html("Name을 입력하세요.");
      $("#register_tnc_error_edit").show();
      return false;
    }
    if (code == "" || name == "") {
      return false;
    }
  // TODO 메시지 공통 영역으로
  if (confirm("수정 하시겠습니까? ")) {          
    if(id != code){
      updateMenuCheck(id, code, name);
    } else {
      updateMenuName(code, name);
    }
  }
}

function insertMenu(code, name, upcode, status){
  console.log('tests')
   $.ajax({
    url: "/management/menu/" + code,
    dataType: "json",
    type: "POST",
    data: { code : code, name : name, upcode : upcode },
    success: function(result) {
      console.log(result)
      if(status){
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
        if (result.rtnCode.code == "D001") {
          location.href = "/management/menu_upper";
        }
      }
      console.log(result)
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}


function updateMenuName(code, name){
   $.ajax({
    url: "/management/menu_upper/" + code,
    dataType: "json",
    type: "PUT",
    data: { code : code, name : name },
    success: function(result) {      
      console.log(result);
      if (result.rtnCode.code == "D002") {
        location.href = "/management/menu_upper";
      } else {
        alert('수정할 내용이 없습니다.');
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function updateMenuCheck(id, code, name) {
  console.log(id, code, name);
  $.ajax({
    url: "/management/restapi/getIdData",
    dataType: "json",
    type: "get",
    data: {id : code},
    success: function(result) {
      console.log(result)
      if (result.rtnData.length == 0) {             
        getMenuList(id, code, name);
      } else if (result.rtnCode.code == "D005") {
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function getMenuList(id, code, name){  
  $.ajax({
    url: "/management/restapi/getCodeList",
    dataType: "json",
    type: "get",
    data: {id : id},
    success: function(result) {
     console.log(result);
     result.rtnData.forEach(function(d){
      var nCode = code.substr(0,1)+d._source.code.substr(1,3);    
      console.log(nCode, d._source.name, code)
      insertMenu(nCode, d._source.name, code, false);
      deleteMenu(d._source.code, false)
     });
      insertMenu(code, name, "0000", false);
      deleteMenu(id, false);
      location.href = "/management/menu_upper";
    },
    error: function(req, status, err) {      
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}