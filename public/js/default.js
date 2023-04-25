(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
    else // Plain browser env
    mod(CodeMirror);
  })(function(CodeMirror) {
  "use strict";
  
  CodeMirror.defineMode('z80', function(_config, parserConfig) {
    var ez80 = parserConfig.ez80; 
    var keywords1, keywords2;
    if (ez80) {
      keywords1 = /^(exx?|(ld|cp)([di]r?)?|[lp]ea|pop|push|ad[cd]|cpl|daa|dec|inc|neg|sbc|sub|and|bit|[cs]cf|x?or|res|set|r[lr]c?a?|r[lr]d|s[lr]a|srl|djnz|nop|[de]i|halt|im|in([di]mr?|ir?|irx|2r?)|ot(dmr?|[id]rx|imr?)|out(0?|[di]r?|[di]2r?)|tst(io)?|slp)(\.([sl]?i)?[sl])?\b/i;
      keywords2 = /^(((call|j[pr]|rst|ret[in]?)(\.([sl]?i)?[sl])?)|(rs|st)mix)\b/i;
    } else {
      keywords1 = /^(exx?|(ld|cp|in)([di]r?)?|pop|push|ad[cd]|cpl|daa|dec|inc|neg|sbc|sub|and|bit|[cs]cf|x?or|res|set|r[lr]c?a?|r[lr]d|s[lr]a|srl|djnz|nop|rst|[de]i|halt|im|ot[di]r|out[di]?)\b/i;
      keywords2 = /^(call|j[pr]|ret[in]?|b_?(call|jump))\b/i;
    }
  
    var variables1 = /^(af?|bc?|c|de?|e|hl?|l|i[xy]?|r|sp)\b/i;
    var variables2 = /^(n?[zc]|p[oe]?|m)\b/i;
    var errors = /^([hl][xy]|i[xy][hl]|slia|sll)\b/i;
    var numbers = /^([\da-f]+h|[0-7]+o|[01]+b|\d+d?)\b/i;
  
    return {
      startState: function() {
        return {
          context: 0
        };
      },
      token: function(stream, state) {
        if (!stream.column())
          state.context = 0;
  
        if (stream.eatSpace())
          return null;
  
        var w;
  
        if (stream.eatWhile(/\w/)) {
          if (ez80 && stream.eat('.')) {
            stream.eatWhile(/\w/);
          }
          w = stream.current();
  
          if (stream.indentation()) {
            if ((state.context == 1 || state.context == 4) && variables1.test(w)) {
              state.context = 4;
              return 'var2';
            }
  
            if (state.context == 2 && variables2.test(w)) {
              state.context = 4;
              return 'var3';
            }
  
            if (keywords1.test(w)) {
              state.context = 1;
              return 'keyword';
            } else if (keywords2.test(w)) {
              state.context = 2;
              return 'keyword';
            } else if (state.context == 4 && numbers.test(w)) {
              return 'number';
            }
  
            if (errors.test(w))
              return 'error';
          } else if (stream.match(numbers)) {
            return 'number';
          } else {
            return null;
          }
        } else if (stream.eat(';')) {
          stream.skipToEnd();
          return 'comment';
        } else if (stream.eat('"')) {
          while (w = stream.next()) {
            if (w == '"')
              break;
  
            if (w == '\\')
              stream.next();
          }
          return 'string';
        } else if (stream.eat('\'')) {
          if (stream.match(/\\?.'/))
            return 'number';
        } else if (stream.eat('.') || stream.sol() && stream.eat('#')) {
          state.context = 5;
  
          if (stream.eatWhile(/\w/))
            return 'def';
        } else if (stream.eat('$')) {
          if (stream.eatWhile(/[\da-f]/i))
            return 'number';
        } else if (stream.eat('%')) {
          if (stream.eatWhile(/[01]/))
            return 'number';
        } else {
          stream.next();
        }
        return null;
      }
    };
  });
  
  var trace_result;
   
  CodeMirror.defineMIME("text/x-z80", "z80");
  CodeMirror.defineMIME("text/x-ez80", { name: "z80", ez80: true });
  
  });

let editorCode1=null, editorCode2=null, editorCode3=null, editorCode4=null, editorCode5=null;

function IntitialCodeMirror(name){
    var editor = CodeMirror.fromTextArea(document.getElementById(name), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    autoRefresh:true,
    mode: "text/x-z80", 
    indentUnit: 4,

  });
    return editor
}


editorCode1=IntitialCodeMirror("code1");
editorCode2=IntitialCodeMirror("code2");
editorCode3=IntitialCodeMirror("code3");


    $("#OkOpenProject").click(function() {
       model=true;
       getUrlFolder("Model");
       readFile(document.getElementById('file'));
    });
    
$("#max_level_content").toggle();

$("#traversalButton").toggle();

$("#goal_content").toggle();
$("#safety_content").toggle();
$("#download").toggle();

$("#use_max").change(function(){
	 $("#max_level_content").toggle();
});
$("#use_goal").change(function(){
	 $("#goal_content").toggle();
});
$("#use_safety").change(function(){
	 $("#safety_content").toggle();
});

function parseNameFile(fileName){
  let type = fileName.split('.');
  
  return type[type.length-1];
}
//var inputAplanModel = JSON.stringify({"TypeMessage":"InputAplanModel","act":"","behp":"","env_descript":""});

var inputAplanModel = ({"TypeMessage": "InputAplanModel","act": "","behp": "","env_descript": "","evt_descript":"","conditions": [{"name":"goal1","type": "goal","vars": "Nil","termination": "1","maxtraces": "1","formula": ""},{"name":"safety1","type": "safety","vars": "Nil","termination": "1","maxtraces": "1","formula": ""}]});

var aplanModel = new AplanModel();
var settingAplanModel = new SettingAplanModel();

function readFile(object) { 
   if(!f_open){
           $("#InsertionModelConteiner").toggle();
           f_open=true;
   }
    var result="";
    var act, behp, env; 
	for (let i = 0; i < object.files.length; i++){
        	let type ="";
        	var file = object.files[i];
        	type=parseNameFile(object.files[i].name);
        	let reader = new FileReader();
        	reader.onload = function() { 
        	//document.getElementById('out').innerHTML = reader.result 
        	result+=reader.result;
        	if(type=='act'){
			 inputAplanModel.act= reader.result;
			 aplanModel.setAction(reader.result);
		}
		else if(type=="behp"){
			inputAplanModel.behp = reader.result;
			aplanModel.setBehevior(reader.result);
			
		}
		else if(type=="env_descript"){
			inputAplanModel.env_descript= reader.result;
			aplanModel.setEnvDescript(reader.result);
		}
		else if(type=="dump"){
			dump = true;
			assembler = reader.result;
			editorCode1.setValue(reader.result);
			//result = clearNulSTR(reader.result);
		}
		else {
			inputAplanModel.evt_descript = reader.result;
			aplanModel.setEvtDescript(reader.result);
		}
		
     	//editorCode1.setValue(result);
     	if(!dump)
     		editorCode2.setValue(result);
     	//appendTo(editorCode3,"-----Upload file."+type+". Successful operation.");
    } 
    reader.readAsText(file);  
  }

}
var dump;
var assembler;
function clearNulSTR(str){
 
 return str.replace(/\n+/g,'\n');
}

function returnIndexNodeForRemove(json, name){
	for(let i=0;i<json.conditions.length;i++)
		if(name == json.conditions[i].type)
			inputAplanModel.conditions.splice(i,1);
}



var open_folder = false;

$(document).ready(function() {
	$("#openFolder").click(function() {
		model=true;
		open_folder = true; 	
    	});
});


	
var massLine = new Array();

function parseTraceAssembler(json){
	var assmJSON = JSON.parse(json);
	for(let i=0;i<assmJSON.trace.length;i++){
		//var actions = JSON.parse(assmJSON.trace[i]);
		if(typeof assmJSON.trace[i].lines!="undefined")
			massLine.push(assmJSON.trace[i].lines);
				
		
	}
		
}


var t=0;
$(document).keyup(function(e){
	if(e.altKey && e.keyCode ===86){
		assemblerСodeHighlighting(t);
		t+=1;
	}
});


function assemblerСodeHighlighting(t){
	if(t!=massLine.length-1){
			editorCode4.markText(
				{line: Number(massLine[t])-2}, 
				{line: Number(massLine[t])-1}, 
				{className:"styled-background-WRN"}); 
				
			editorCode4.setCursor(Number(massLine[t]));	
		}
		else{
			editorCode4.markText(
				{line:Number(massLine[t])-2}, 
				{line:Number(massLine[t])-1}, 
				{className:"styled-background-ERR"}); 
			
			editorCode4.setCursor(Number(massLine[t])-5);
		}	
}



function TraversalCodeAssembler(id){
	if(id=="forward"){
		assemblerСodeHighlighting(t);
		t+=1;
	}
	else{   
	        for(let i=0;i<=massLine.length;i++){
		assemblerСodeHighlighting(i);
		}
	}
}


function setParam(callback){
	var tactic, with_logger, visited_type, max_level, console_mode, print_env, print_act, goal_filter="", safety_filter="", message_interpretation, asm_prepr, ignore_act;
	
	tactic = $("input[name=tactic]:checked").val();
	with_logger = "1";
	visited_type = $("input[name=equality]:checked").val();
	max_level = $("#max_level").val();
	console_mode ="1";
        print_env = $("input[name=print_env]:checked").val();
        print_act = $("input[name=print_env]:checked").val();
        asm_prepr = $("input[name=asm_prepr]:checked").val();   
        message_interpretation=$("input[name=msg_interp]:checked").val();
        ignore_act = $("input[name=ignore_act]:checked").val();
              
        settingAplanModel.setTactic(tactic);
        settingAplanModel.setWithLogger("1");
        settingAplanModel.setVisitedType(visited_type);
        settingAplanModel.setMaxLevel(max_level);
        settingAplanModel.setConsoleMode("1");
        settingAplanModel.setPrintEnv(print_env);
        settingAplanModel.setPrintAct(print_act);
        settingAplanModel.setAsmPrepr(asm_prepr);
        settingAplanModel.setMessageInterpretation(message_interpretation);
        settingAplanModel.setIgnoreAct(ignore_act);
        

	
	goal_filter =$("#goal_filter").val();
	
	safety_filter = $("#safety_filter").val();
	
	
        if(goal_filter && !safety_filter)
       	 aplanModel.setGoalCondition(goal_filter);
        else if(!goal_filter && safety_filter)
      		aplanModel.setSafetyCondition(safety_filter);
      	else if(goal_filter && safety_filter){
      		 aplanModel.setGoalCondition(goal_filter);
      		 aplanModel.setSafetyCondition(safety_filter);
      	}
    	  
        appendTo(editorCode3, settingAplanModel.settingInLine(goal_filter,safety_filter));
        
        callback();
    
}

async function set_options(callback){
     
      if(!open_folder)
      	 setParam(function (){
      	 	SendMessage(JSON.stringify(settingAplanModel.SettingJson));
      	 });
      else
      	SendMessage(JSON.stringify(settingAplanModel.SettingJson));
	  setTimeout(() => {
        	callback();
        	}, 5000
        );
        
        
}

function SeveToFolder(data){
   //alert("SaveTraces");
   var zip = new JSZip();
   var folderVerdict = zip.folder("Verdict");
    for (let i=0; i<data.length; i++) {
        var obj = JSON.parse(data[i]);

        if(obj.name=="verdict")
        	folderVerdict.file("file"+(i+1) + ".json",obj.trace);
        else{
           var clear_json = clear(obj); 
           folderVerdict.file("file"+(i+1) + ".json",JSON.stringify(clear_json, null, 2));
        }
        
        
  
             
    }
   var blob=  zip.generateAsync({
        type: "base64"
    }).then(function(content) {
        window.location.href = "data:application/zip;base64," + content;
    }); 
 	
}


function clear(json){
	if(json.name!="verdict"){
	        var data = JSON.parse(json.trace);
	        data.Environment = data.Environment.replace(/\n/g, '');
	        for(let i=0;i<data.trace.length;i++)
	        	if(typeof data.trace[i].Environment!="undefined"){
	        		data.trace[i].Environment=data.trace[i].Environment.replace(/\n/g, '');
	        	}
	      
	      return data;		
	}
	return json;
}

editorCode3.replaceRange("Console log:", CodeMirror.Pos(editorCode3.lastLine()));


	        	        		
$(document).ready(function() {
	$("#OkOpenVerdict").click(function() {
		OpenVerdictTrace(document.getElementById('file_verdict'));
		
		generate_table("graphContainer");
	});
});



$(document).ready(function() {
	$("#CloseVerdict").click(function() {  	
    	exitAVM("http://localhost:8088", "exit", "exit",
    	function(){
    			sock.close(1000);
    			sock_server_2.close(1000);
    			location.reload();
    		});
	
	});
});
$(document).ready(function() {
	$("#alebraicMatchin").click(function() {  	
    		$('#algebrbMatch').modal('show');
	});
});


$(document).ready(function() {
	$("#exploit").click(function() {
    		$('#ExploitVerdict').modal('show');
    		editorCode5=IntitialCodeMirror("code5");
    		editorCode5.setSize(200,220);
    		editorCode5.setValue("cdx == 0xffffffff");
	});
});


function SelectVulnerabilities(name){  
	 var vulnerabilities = $("input[name="+name+"]:checked").val();
	
	return vulnerabilities;
}


$(document).ready(function() {
	$("#OkAlgebraicMaching").click(function() {  	
	if(dump){       
	                var vulnerabilities=SelectVulnerabilities("vulnerabilities");
        		var assem = JSON.stringify({"TypeMessage":"asembler", "Vulnerabilities":vulnerabilities});
      			sock_server_2.send(assem);		
      		}
	});
});

function ShowListVerdict(Traces, typeViz){
        Traces.sort().reverse();
        document.getElementById('TraceList').innerHTML='';
        for(let i=0;i<Traces.length;i++){
             var trace = JSON.parse(Traces[i]);
             $('#TraceList').append('<li style="list-style-type:none;margin-top:5px;font-family:Arial,cursive;'+
             'font-weight:bold;"><button id="'+i+'" name="'+typeViz+'" style="border:none;'+
             'background-color: #FAFAFA;"onClick="getIdTrace(this.id,this.name)">'+trace.name+'</button></li>');     	
	}
	

	var traceStart = JSON.parse(Traces[1]);
	document.getElementById('graphContainer').innerHTML='';
	
	document.getElementById('listNonAplicableActionName').innerHTML='';
        document.getElementById('listNonAplicableAction').innerHTML='';
        
       
	document.getElementById('nameTrace').innerHTML=traceStart.name;
        
      //  clearDiv();
        
        if(!dump)
        	$("#assemblerContent").toggle();
	
	if(typeViz!="Blockchain" && typeViz!="Visual"){
	        $("#assemblerContent").toggle();
	        assmbler_toggle+=1;
		main(document.getElementById('graphContainer'),traceStart.trace);
	}			
}

function RunBlockchainVisualizer(result){
	// sock.send(result.trace);
	 
      
}
var assmbler_toggle=1;
var model;

function getUrlFolder(type){
 if(type=="blockchain")
 	f_blockchain=true;

 var folderMessage=JSON.stringify({"TypeMessage":"getHome"});
 sock.send(folderMessage);

}
var result;
function RunBlockchainVizualization(nameFolder,callback){
	var blockchainVisualizerRun=JSON.stringify(
		{
		"TypeMessage":"BlockchainVisualizerRun",
		"traceData":result,
		"nameFolder":nameFolder
		}
	);
	 
	 sock_server_2.send(blockchainVisualizerRun);
	 setTimeout(() => {callback();},5000);

	f_blockchain=false;
}

var f_blockchain=false;


function clearDiv(){

      
	document.getElementById('graphContainer').innerHTML='';
	
	document.getElementById('assemblerContent').innerHTML='';
	document.getElementById('listNonAplicableAction').innerHTML='';
	document.getElementById('listNonAplicableActionName').innerHTML="";
	document.getElementById('nameTrace').innerHTML='';
	
}

function getIdTrace(id, type){

        result = JSON.parse(Traces[id]);
    
       // document.getElementById('graphContainer').innerHTML='';
        
	if(result.name!="verdict" && type=="Visual"){
	       if(assmbler_toggle>1)
	       	   $("#assemblerContent").toggle();
	       	   
	       document.getElementById('graphContainer').innerHTML='';
	       
	       massLine=[];
               parseTraceAssembler(result.trace);	
        }
        else if(result.name!="verdict"  && type=="MSC"){
    
       	document.getElementById('graphContainer').innerHTML='';
       	document.getElementById('listNonAplicableActionName').innerHTML='';
       	document.getElementById('listNonAplicableAction').innerHTML='';
       	
       	
		document.getElementById('nameTrace').innerHTML=result.name;
		main(document.getElementById('graphContainer'),result.trace); 
	
	}
        else if(type =="Blockchain" && result.name!="verdict"){
		counter=0;
		 
		 
		document.getElementById('graphContainer').innerHTML='';
		document.getElementById('listNonAplicableActionName').innerHTML='';
		document.getElementById('listNonAplicableAction').innerHTML='';
		
		document.getElementById('nameTrace').innerHTML=result.name;	
	        getUrlFolder("blockchain");
	}
        else if(result.name=="verdict" && type!="Visual"){
                document.getElementById('assemblerContent').innerHTML='';
                
		var temp = JSON.parse(result.trace);
		
		document.getElementById('graphContainer').innerHTML='';
		generate_table("graphContainer","Number of application for each action",temp);
		
		if(temp.List_of_non_applicable_actions.length>0)
	  		printListNonAplicableAction(temp.List_of_non_applicable_actions);
        }        
}

function printListNonAplicableAction(listAction){
  	document.getElementById('listNonAplicableActionName').innerHTML="List of non applicable actions"
	for(let i=0;i<listAction.length;i++){
             $('#listNonAplicableAction').append('<li style="list-style-type:none;margin-top:5px;font-family:Arial,cursive;">'+listAction[i].name+'</li>');     	
	}
}

function generate_table(nameDiv,nameTable,temp){
  

  document.getElementById('nameTrace').innerHTML="verdict: "+nameTable;
  var body = document.getElementById(nameDiv);
  var tbl = document.createElement("table");
  var thead = document.createElement("thead");
 
  var tr = document.createElement("tr");
  
  var thAction = document.createElement("th");
  var thValue = document.createElement("th");
 
  var thTextAction = document.createTextNode("Action");
  var thTextValue = document.createTextNode("Value");
 
  thAction.appendChild(thTextAction);
  thValue.appendChild(thTextValue);
 
  tr.appendChild(thAction);
  tr.appendChild(thValue);
 
  thead.appendChild(tr);
 
  var tblBody = document.createElement("tbody");
  var infoAction = Array();
  for (var i = 0; i <temp.Number_of_application_for_each_action.length; i++) {

    var row = document.createElement("tr");
    
    var name_action = temp.Number_of_application_for_each_action[i].name;
    var value_action = temp.Number_of_application_for_each_action[i].value;
    
    infoAction.push(name_action);
    infoAction.push(value_action);
    
    for (var j=0;j<infoAction.length;j++) {

      var cell = document.createElement("td");
      var cellText = document.createTextNode(infoAction[j]);
      cell.appendChild(cellText);
      row.appendChild(cell);
      
      if(j==infoAction.length-1)
      	infoAction=[];
      	
    }
    
    tblBody.appendChild(row);
  }
  
  tbl.appendChild(tblBody);
  tbl.appendChild(thead);
  body.appendChild(tbl);
  
  thead.setAttribute("class","thead-dark");
  tbl.setAttribute("class", "table");
  tbl.setAttribute("border", "1");
  tbl.setAttribute("style", "margin:10px");
  //tbl.setAttribute("style", "display:inline-block");
}


async function OpenVerdictTrace(object){
		var file = object.files[0];
		  for (let i = 0; i<object.files.length; i++){
        	   var file = object.files[i];
        	   var nameFile = file.name.replace('.json', '');
        	   var data, name;
        	   let reader = new FileReader();
        	    reader.onload = async function() { 
        		result=reader.result;
        		var traseJson = {"name":"","trace":""};
        		
        		var temp = JSON.parse(result);
        		if(typeVisualizer=="MSC"){
        			traseJson.trace = temp.trace;
        			traseJson.name = temp.name;
        		}
        	        else {
        	               traseJson.trace = reader.result;
        	               traseJson.name  = "Trace_"+String(i+1);
        	        }	

			Traces.push(JSON.stringify(traseJson));
			if(i==object.files.length-1){
			        $('#verdictModal').modal('show');
			        $('#verdictModal').focus();
    		   		ShowListVerdict(Traces, typeVisualizer);
    		   	}
    		  	 	
    		     } 
    		   reader.readAsText(file); 

  		   }
		 
}
function getTraceName(url,name){
	OpenVerdictTrace(document.getElementById('file_verdict'));
}

function OpenVerdictVisualizer(typeVisualizer, data){
	if(typeVisualizer=="MSC"){
	      $('#verdictModal').modal('show');

	      $('#verdictModal').trigger('focus');	      	       
	       document.getElementById('graphContainer').innerHTML='';  
	     //  main(document.getElementById('graphContainer'),data);
	}	
	else if(typeVisualizer="blockchain"){
		var blockchainVisualizerRun = JSON.stringify({"TypeMessage":"BlockchainVisualizerRun","traceData":data});
		sock_server_2.send(blockchainVisualizerRun);
	}
}


function appendTo(editor,text) {
        if(text.indexOf("WRN")<=0)
    		editor.replaceRange("\n"+text, CodeMirror.Pos(editor.lastLine()));   	
}
  
function Highlighting(editor, number, inf, n1, n2){
	var typeStyle="styled-background-INF"; 
	if(inf=="WRN")
		typeStyle="styled-background-WRN";
	else if(inf=="ERR")
		typeStyle="styled-background-ERR";

	
editor.markText({line: number-2}, {line: number-1}, {className:typeStyle}); 	
} 




var setting;
$(document).ready(function() {
    $("#RunOK").click(function() {   
        set_options(function(){
        	SendMessage(JSON.stringify(aplanModel.InputAplanJSON));
        });
        
    });
});

var countTracesResult=0;
$(document).ready(function() {
     $("#OkSaveTrace").click(function() {
        setTimeout(() => {
        	SeveToFolder(Traces);
        	}, 5000
        );
    });                  
});

function ShowAllTrace(count){
	for(let i=0;i<count;i++)
		getTrace(String(i));
}

var typeVisualizer;

$(document).ready(function() {
    $("#downloadTrace").click(function() {
        if(Traces.length ==0)
       	document.getElementById('errMessage').innerHTML='Error. No verdict. Run the model.';
        else	
        	setTimeout(() => {
        		SeveToFolder(Traces);
        		}, 3000
        	);
    });
});

document.documentElement.addEventListener('keydown', function (e) {
    if ( ( e.keycode || e.which ) == 32) {
        e.preventDefault();
    }
}, false);


$(document).ready(function() {
    $("#MSC").click(function() {
         typeVisualizer = "MSC";
         document.getElementById('typeVizual').innerHTML=typeVisualizer;
         document.getElementById('typeVizualVerdict').innerHTML=typeVisualizer;
        if(Traces.length>0){
        	$('#verdictModal').modal('show');
        	
        	ShowListVerdict(Traces, typeVisualizer);
        }
        else
        	$('#addVerdict').modal('show');  
    });
});

$(document).ready(function() {
    $("#BlockchainVisualizer").click(function() {
    
        typeVisualizer="Blockchain";
        document.getElementById('typeVizual').innerHTML=typeVisualizer;
        document.getElementById('typeVizualVerdict').innerHTML=typeVisualizer;
        
        if(Traces.length>0){
        	$('#verdictModal').modal('show');
        	ShowListVerdict(Traces, typeVisualizer);
        }
        else
        	$('#addVerdict').modal('show'); 

    });
});

var count=1
editorCode4=IntitialCodeMirror("code4");
$(document).ready(function() {
    $("#visualCode").click(function() {   

    typeVisualizer="Visual";
    document.getElementById('typeVizual').innerHTML=typeVisualizer;
    document.getElementById('typeVizualVerdict').innerHTML=typeVisualizer;
        
    //document.getElementById('graphContainer').innerHTML='';
       
      //$("#graphContainer").toggle();
       if(count==1)
       	$("#traversalButton").toggle();
       	
       count+=1
        
        if(Traces.length>0){
        	$('#verdictModal').modal('show');
        	 document.getElementById('graphContainer').innerHTML='';
        	
                editorCode4.setSize(750,550);
                editorCode4.setValue(assembler);
    		
    		setTimeout(function() {  editorCode4.refresh();},35);
        	
        	ShowListVerdict(Traces, typeVisualizer);
        }
        else
        	$('#addVerdict').modal('show'); 
    });
});


$(document).ready(function() {
    $("#cloceVerdict").click(function() {
    	//$("#traversalButton").toggle();
     //	$("#graphContainer").toggle();
    
        });
});

function getTrace(number){
        var getTrace = JSON.stringify({"TypeMessage":"getTrace", "trace":number});
	  
	SendMessage(getTrace);
}

async function SendMessage(option){
     	sock.send(option);	 	  
}

var Traces = new Array();
var counter;
var graph_blockchain, parent_blockchain

var obj_blockchain;

function blockchainVizualization(i){
	  var option;
 	  for(let j=0;j<obj_blockchain.objects[i].objects.length;j++){
	                         if(obj_blockchain.objects[i].objects[j].type=="block"){
	                         	var x = obj_blockchain.objects[i].objects[j].bottom_left.x;
	                		var y = obj_blockchain.objects[i].objects[j].bottom_left.y;
	                		var text = obj_blockchain.objects[i].objects[j].text;
	                		var fraud = obj_blockchain.objects[i].objects[j].fraud;
	                		
	                		if(fraud=="0")
	                			option='fillColor=none;strokeColor=black';
	                		else if(fraud=="1")
	                			option='fillColor=none;strokeColor=red';
	                			

	                		var act = shwoAction(graph_blockchain, parent_blockchain,text,x,y,option);
	                         	
	                         }
	                         else if(obj_blockchain.objects[i].objects[j].type=="line"){
	                         	var point_start_x= obj_blockchain.objects[i].objects[j].start.x;
	                         	var point_start_y= obj_blockchain.objects[i].objects[j].start.y;
	                         	
	                         	var point_end_x= obj_blockchain.objects[i].objects[j].end.x;
	                         	var point_end_y= obj_blockchain.objects[i].objects[j].end.y;
	                         	
	                         	var poin_start = graph_blockchain.insertVertex(parent_blockchain, null,"",
	                         	point_start_x,point_start_y, 1, 1);
	                         	var point_end = graph_blockchain.insertVertex(parent_blockchain, null,"",
	                         	point_end_x,point_end_y, 1, 1);
	                         	
	                         	var edge = graph_blockchain.insertEdge(parent_blockchain, null,"",poin_start,point_end);
	                         	
	                         }
	                }		
}


$('#verdictModal').keyup(function(e){
	if(e.keyCode ===32){
		counter+=1;
		blockchainVizualization(counter);
	}
});

function PrintMessageToConsole(msg){
	var obj = JSON.parse(msg);
	if(f_close && obj.params.indexOf("Saving verdict")>1){
	        sock.close(1000);
    		sock_server_2.close(1000);
    		close();	
	}		
	if(obj.objects!=null){
	   document.getElementById('graphContainer').innerHTML='';  
	   [graph_blockchain, parent_blockchain]=blockchainGraphSeting(document.getElementById('graphContainer'));
	   obj_blockchain=obj;
	   blockchainVizualization(counter);
	}
	if(f_blockchain == true && typeof obj.home!="undefined"){
	      RunBlockchainVizualization(obj.home, 
	      	function(){
			var blockchainVis_run = JSON.stringify({"TypeMessage":"BlockchainVisualize"});
	        	sock.send(blockchainVis_run);
	        	
	      });
	      /*
		var blockchainVis_run = JSON.stringify({"TypeMessage":"BlockchainVisualize"});
	        sock.send(blockchainVis_run);
	       */
	}
	if(model==true && typeof obj.home!="undefined"){
		clearFolder(obj.home);
		model=false;
	}
	if(typeof obj.traces != 'undefined'){
		appendTo(editorCode3,"------Count of traces:"+(obj.traces-1)+"-----");
		
		if(dump){
			 
			 document.getElementById("forward").disabled = false;
			 document.getElementById("vulnerabilitieLine").disabled = false;
		}
		
		countTracesResult = obj.traces;
		$('#CountTraceList').append(''+obj.traces+'');
		ShowAllTrace(countTracesResult);
		
		$("#download").toggle();
	}
	else if(typeof obj.filename !='undefined'){
			var traseJson = JSON.stringify({"name":getNameTrace(obj.filename),"trace":obj.filedata});
		        Traces.push(traseJson);
		
		
	}
	else if(typeof obj.response != 'undefined' &&  obj.response==='OK' ){
		appendTo(editorCode3,"Successful operation.","INF");
	}
	else if(typeof obj.home!="undefined"){
		appendTo(editorCode3,"Copy to:"+obj.home,"INF");
		Highlighting(editorCode3, editorCode3.lastLine()+1,"INF",1,2);
	}
	else if(typeof obj.response != 'undefined' &&  obj.response==='ERR'){
		appendTo(editorCode3,"ERR: "+obj.description);
		Highlighting(editorCode3, editorCode3.lastLine()+1, obj.response,1,2);
	}	
	else{  
	        appendTo(editorCode3,obj.params);
		Highlighting(editorCode3, editorCode3.lastLine()+1,obj.name,1,2);
	}
	editorCode3.setCursor(editorCode3.lastLine());		
}

function getNameTrace(url){
	var mas = url.split('/');
	return mas[mas.length-1].replace('.json', '');
}

function cross_download (url, fileName) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "blob";
    var __fileName = fileName;
    req.onload = function (event) {
        var blob = req.response;
        var contentType = req.getResponseHeader("content-type");
        if (window.navigator.msSaveOrOpenBlob) {
   
            window.navigator.msSaveOrOpenBlob(new Blob([blob], {type: contentType}), fileName);
        } else {
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.download = __fileName;
            link.href = window.URL.createObjectURL(blob);
            link.click();
            document.body.removeChild(link); 
        }
    };
    req.send();
}


function send_option(option){
 $.ajax({
        type: "POST",
        url: "Home",
        contentType: "application/json",
        dataType:'json',
	data:option,
       /* data:{"apiname":apiname,"apiendpoint":apiendpoint,"apiversion":apiversion,"source":source},*/
        success: function(status){
            console.log("Entered",status);
        },
        error:function(error){
            console.log("error",error);
        }
    });
}

$(document).ready(function() {
    $("#openFolder").click(function() {
        getUrlFolder("Model");
    	SendMessageToServer();
    });
});

var f_close=false;
$(document).ready(function() {
    $("#StopSimulation").click(function() {
    if(Traces.length>0){
    	appendTo(editorCode3,"CLOSE");
    	Highlighting(editorCode3, editorCode3.lastLine()+1,"WRN", 1,2);  
    }
    else{ 
    	appendTo(editorCode3,"CLOSING..");
    	Highlighting(editorCode3, editorCode3.lastLine()+1,"WRN", 1,2);  
    }	
    	exitAVM("http://localhost:8088", "exit", "exit",function(){
    		f_close=true;
    	});
	
   
    });
});

function exitAVM(url, val1, val2, callback){
    var r = new XMLHttpRequest();
    r.open("POST", url + "/setParameters?nm=" + val1 + "&vl=" + val2, true); 
    r.onreadystatechange = function () {  
        if (r.status == 200 || r.data.response == "OK")
            console.log("Ok");
      else if(r.status != 200 || r.data.response != "OK")
        alert("Error");
    };
    r.send();
    callback();
}


function SendMessageToServer(){
	var messga_openProject = JSON.stringify({"TypeMessage":"OpenProject"});
	sock_server_2.send(messga_openProject);
}

function openOption(evt, Name) {
  var i, tabcontent, tablinks;
  
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(Name).style.display = "block";
  evt.currentTarget.className += " active";
}


//var sock = new WebSocket('ws://193.0.61.175:8089');
//var sock_server_2 = new WebSocket('ws://193.0.61.175:5005');


var sock = new WebSocket('ws://127.0.0.1:8089');
var sock_server_2 = new WebSocket('ws://localhost:5005');


sock.onopen = function () {
	console.log("AVM.JAVA Socket open");
    	console.log('Connected!');
    	//sock.send('Ping'); 
};

sock_server_2.onopen = function () {
	console.log("Node.js Socket open");
};

sock.onerror = function (error) {
    	console.log('WebSocket Error ' + error);
};

sock.onmessage = function(event){
        var temp = JSON.parse(event.data);
        if(typeof event.data!="undefined")
 		PrintMessageToConsole(event.data);    
}



sock.onclose = function(event) {
 close();
}

sock_server_2.onclose = function(event) {
    close();
}

function close(){
  if (event.wasClean){
  	appendTo(editorCode3, "[close]");
  	Highlighting(editorCode3, editorCode3.lastLine()+1,"WRN", 1,2); 
  	//location.reload();
  }
   else {
        appendTo(editorCode3, "[close]");
        Highlighting(editorCode3, editorCode3.lastLine()+1,"WRN",1,2); 
        //location.reload();
   }
}

function clearFolder(url){
	var clear = JSON.stringify({"TypeMessage":"ClearFolder","url":url});
	sock_server_2.send(clear);
}


var f_open = false;
var dump_templ=false;
sock_server_2.onmessage = function(event){
     var jsonListProject = JSON.parse(event.data);
     	if(jsonListProject.TypeMessage=="ListProject")
        	ShowListProject(jsonListProject);
          else if(jsonListProject.TypeMessage=="InputAplanModel"){
                if(!f_open && !dump_templ){
           		$("#InsertionModelConteiner").toggle();
           		f_open=true;
           	}
           	
        	editorCode2.setValue(jsonListProject.env_descript +"\n"+
        	jsonListProject.act+"\n"+jsonListProject.behp+"\n"+jsonListProject.evt_descript);
        	
        	
        	var val = JSON.parse(jsonListProject.req);
    
        	settingAplanModel.setTactic(val.values[0].value);
        	settingAplanModel.setWithLogger(val.values[1].value);
       	settingAplanModel.setVisitedType(val.values[2].value);
       	settingAplanModel.setMaxLevel(val.values[3].value);
        	settingAplanModel.setConsoleMode(val.values[4].value);
        	settingAplanModel.setPrintEnv(val.values[5].value);
        	settingAplanModel.setPrintAct(val.values[6].value);
        	settingAplanModel.setAsmPrepr(val.values[7].value);
        	settingAplanModel.setMessageInterpretation(val.values[8].value);
        	settingAplanModel.setIgnoreAct(val.values[9].value);
        	
        	
        	if(dump)
        		SendMessage(JSON.stringify(settingAplanModel.SettingJson));
      			
      			
        	aplanModel.setAction(jsonListProject.act);
        	aplanModel.setBehevior(jsonListProject.behp);
        	aplanModel.setEnvDescript(jsonListProject.env_descript);
        	aplanModel.setEvtDescript(jsonListProject.evt_descript);
        	
        	/*
        	if(dump)
        		SendMessage(JSON.stringify(aplanModel.EmptyAplanModel));
        	
        	*/	
        	appendTo(editorCode3, settingAplanModel.settingInLine("nil","nil"));
        	
        	if(!dump || dump =="undefinde")
        		$('#myModal').modal('show');
        		
       
        	 settingAplanModel.LoadSetingOnForm();
        	
        	/*
        		jsonListProject.req = null;
			delete jsonListProject.req;
			jsonListProject.conditions = null;
			delete jsonListProject.conditions;
        		inputAplanModel=jsonListProject;
               */
        }
        else if(jsonListProject.TypeMessage == "AssmblerDump"){
                dump = true;
                dump_templ=true;
        	$("#InsertionModelConteiner").toggle();
        	editorCode1.setValue(jsonListProject.data);
        	assembler = jsonListProject.data;
        }
        else if(jsonListProject.TypeMessage == "RunAssemblerModel")
        	SendMessage(JSON.stringify(aplanModel.EmptyAplanModel));
        
        	
}

function ShowListProject(jsonListProject){
        document.getElementById('ListProjects').innerHTML = '';
        for(let i=0;i<jsonListProject.Projects.length;i++){
        	$('#ListProjects').append('<li><button id="'+jsonListProject.Projects[i]+'" style="border:none;'+
        	'background-color: white;"onClick="getNameProject(this.id)">'+jsonListProject.Projects[i]+'</button></li>');	     	
	}
	$('#ListProjectModal').modal('show');	
}

function getNameProject(str){
	SelectProject(str);
}


function SelectProject(str){
	//var electProject = $("input[name=Projects]:checked").val();
	var electProject = str;
	var project = JSON.stringify({"TypeMessage":"SelectedProject","NameProject":electProject});
	sock_server_2.send(project);
	
	
	$('#ListProjectModal').modal('toggle');	

}

$(document).ready(function() {
    $("#OpenProjectFolder").click(function() {
    	document.getElementById('ListProjects').innerHTML = '';
    });
});

$(document).ready(function() {
    $("#CancelProjectFolder").click(function() {
    	document.getElementById('ListProjects').innerHTML = '';
    });
});

var envTraceX=[];

mxGraph.prototype.getAllConnectionConstraints = function(terminal, source){
	if (terminal != null && terminal.shape != null){
		if (terminal.shape.stencil != null){
			if (terminal.shape.stencil.constraints != null){
				return terminal.shape.stencil.constraints;
				}
			}
			else if (terminal.shape.constraints != null)
				{
					return terminal.shape.constraints;
				}
		}
	
	return null;
};
	
		// Defines the default constraints for all shapes
				mxShape.prototype.constraints = [new mxConnectionConstraint(new mxPoint(0.25, 0), true),
							 new mxConnectionConstraint(new mxPoint(0.5, 0), true),
							 new mxConnectionConstraint(new mxPoint(0.75, 0), true),
		        	              		 new mxConnectionConstraint(new mxPoint(0, 0.25), true),
		        	              		 new mxConnectionConstraint(new mxPoint(0, 0.5), true),
		        	              		 new mxConnectionConstraint(new mxPoint(0, 0.75), true),
		        	            		 new mxConnectionConstraint(new mxPoint(1, 0.25), true),
		        	            		 new mxConnectionConstraint(new mxPoint(1, 0.5), true),
		        	            		 new mxConnectionConstraint(new mxPoint(1, 0.75), true),
		        	            		 new mxConnectionConstraint(new mxPoint(0.25, 1), true),
		        	            		 new mxConnectionConstraint(new mxPoint(0.5, 1), true),
		        	            		 new mxConnectionConstraint(new mxPoint(0.75, 1), true)];
		
		mxPolyline.prototype.constraints = null;
		
function createInstance(graph, obj){
	return graph;
}

function showEdge(graph,parent,mas){
	var edge = graph.insertEdge(parent, null,"",mas[0],mas[1]);	             
}

function shwoAction(graph, parent,text,x, y, option){
	var act = graph.insertVertex(parent, null,
		        text,x,y, 50, 50,option);
		        
        return act;
}

function blockchainGraphSeting(container){
	if (!mxClient.isBrowserSupported()){
		mxUtils.error('Browser is not supported!', 200, false);
	}
	else{	
		mxEvent.disableContextMenu(container);
		var graph = new mxGraph(container);
		graph.setConnectable(true);
		graph.connectionHandler.createEdgeState = function(me){
			var edge = graph.createEdge(null, null, null, null, null);
			return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
		};
		graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';
		new mxRubberband(graph);
		var parent = graph.getDefaultParent();
		graph.getModel().beginUpdate();
		try{
			var edge_style = graph.getStylesheet().getDefaultEdgeStyle();
                  	edge_style[mxConstants.STYLE_ENDARROW] = 1;
			
							
		}
		finally{
			graph.getModel().endUpdate();
		}
	}
	
	return [graph, parent];
};


function main(container, json){
	if (!mxClient.isBrowserSupported()){
		mxUtils.error('Browser is not supported!', 200, false);
	}
	else{
			
		mxEvent.disableContextMenu(container);
		
				var graph = new mxGraph(container);

				// Enables tooltips, new connections and panning
				graph.setPanning(true);
				graph.setTooltips(true);
				graph.setConnectable(true);
				
				// Automatically handle parallel edges
 				var layout = new mxParallelEdgeLayout(graph);
 				var layoutMgr = new mxLayoutManager(graph);
 				
 				layoutMgr.getLayout = function(cell)
				{
					if (cell.getChildCount() > 0)
					{
						return layout;
					}
				};
				
				var rubberband = new mxRubberband(graph);
				var keyHandler = new mxKeyHandler(graph);

				var style = graph.getStylesheet().getDefaultEdgeStyle();
				style[mxConstants.STYLE_ROUNDED] = true;
				style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
		
				graph.alternateEdgeStyle = 'elbow=vertical';

				// Installs a custom tooltip for cells
				graph.getTooltipForCell = function(cell)
				{ 
				      showInfomationEnvironment(cell.getId());
				
				}
				
				graph.popupMenuHandler.factoryMethod = function(menu, cell, evt)
				{
					return createPopupMenu(graph, menu, cell, evt);
				};
				

				var parent = graph.getDefaultParent();
				graph.getModel().beginUpdate();

		try{
			var edge_style = graph.getStylesheet().getDefaultEdgeStyle();
                  	edge_style[mxConstants.STYLE_ENDARROW] = 1;
			
			var step_x=0;
			var step_y=70;
			var obj = JSON.parse(json);
			var Instances = new Array();
			var MSG = new Array();
			var Inst = new Array();
			var last_x=20;
			var count_instances = 0;
			count_instances = obj.Instances.length;
			if(obj.Instances.length==0){
				var instJson = JSON.stringify({"name": "Environment", "x":100, "y":20});
				Inst.push(instJson);
				Instances[0]=(instJson);
			}
			
			for(let i=0;i< obj.Instances.length;i++){
				last_x = step_x;	

				var instJson = JSON.stringify({"name": obj.Instances[i].agentType, "x":20+step_x, "y":20});
				Inst.push(instJson);
				Instances[i]=(instJson);
				
				step_x=step_x + 250;
 			}
 			//shape=hexagon;
 			    var max_length=41;
 			    var length_action = 260;
 			    var h_env=20;
 			    var y_last_inst=0;
 			    var last_y=0;
 			    var c=0;
 			  			    
 			    for(let j=0;j<=obj.trace.length;j++){
 			    	if( typeof obj.trace[j].Environment!='undefined'){
 			         h_env=20;
 			 	 y_last_inst = findMaxY(Instances);

 			         last_y =  y_last_inst + step_y;
 			         
 			         var x_len = (envFormat(obj.trace[j].Environment).length * length_action)/max_length;
 			         if(obj.trace[j].Environment.length<=50){
	                               var env = graph.insertVertex(parent, null,
	                         	envFormat(obj.trace[j].Environment),20,last_y,last_x+80,20);
	                         	
	                         	var id = Number(env.getId());
	                         	
	                         	var info_env = {"id":id,"data":envFormat(obj.trace[j].Environment)};
	                               envInformation.push(JSON.stringify(info_env));
	                         }
	                         else if(obj.trace[j].Environment.length>50) {

	                         	 var [str,count_line_env]=insertStr(envFormat(obj.trace[j].Environment),50);
	                         	 str = str.substring(1,50)+"..."; 
	                         	 var env = graph.insertVertex(parent, null,str,20,last_y,last_x+80,20);
	                         	 
	                         	 var id = Number(env.getId());
	                                var info_env = {"id":id,"data":envFormat(obj.trace[j].Environment)};
	                                envInformation.push(JSON.stringify(info_env)); 
 			    	   }
 			    	   
 			    	   overwriteY(Instances,"env",last_y);	
 			    	}
 			    	else
		              		for(let h=0;h<obj.trace[j].msc.length;h++){
		              		  if(obj.trace[j].msc[h].type=='act'){
		              			var findInstantion=findObject(Instances, obj.trace[j].msc[h].agentName);
		              			var i = JSON.parse(findInstantion);
		              			
		                               var y = i.y + h_env + step_y;
		              			var act = graph.insertVertex(parent, null,
		              			obj.trace[j].msc[h].value, i.x, 
		              			y, 80, 20, 'strokeColor=black');
		              			
		              			overwriteY(Instances, i.name, y);	
		              			
		              		}
		              		else
		              		 for(let h=0;h<obj.trace[j].msc.length;h++){
		              		  if(obj.trace[j].msc[h].type!='act'){
		              		 	var temp=0;
		              			for(let k=0;k<obj.trace[j].msc[h].agents.length;k++){
		              			        var y;
		              				var findInstantion=findObject(Instances, obj.trace[j].msc[h].agents[k].agentName);
		              				var i =JSON.parse(findInstantion);  
                                                      
		              			        if(k==0){
		              			           	y =  i.y + h_env+step_y;
		              			           	temp = y;
								var msg = graph.insertVertex(parent,null,"",
		              					i.x+40,y,2,2, 'fillColor=none;strokeColor=black');
		              				}
		              				else if(k==1){
		              				  	var y =  temp;
								var msg = graph.insertVertex(parent,null,"",
		              					i.x+40,y,2,2, 'fillColor=none;strokeColor=black');	
		              				}
		              				c+=1;
		              				MSG.push(msg);
		                                       if(c==2){
		                                       	edge = graph.insertEdge(parent, null,
		                                       	obj.trace[j].msc[h].params[0].value, MSG[1], MSG[0],
		                              		'edgeStyle=orthogonalEdgeStyle;'+
		                          			'orthogonalLoop=1;jettySize=auto;startArrow=classic;startFill=1;'+
		                           			'targetPerimeterSpacing=8;sourcePerimeterSpacing=8;'+
		                           			'strokeColor=#aaaaaa;strokeWidth=1;curved=0;');
		                                               MSG=[];
		                                       	c=0;
		                                       }	              				
		              				overwriteY(Instances, i.name,y);
	
		              			}
		              		}

		            }
		        }
		     }
		}
		   		              						
		finally{
		
		 var step_x_end=0;
 	         var Y = findMaxY(Instances);
 	         var x0 =20;
 	         if(count_instances==0)
 	         	x0=100;
 	        
 		 for(let i_end=0;i_end<Inst.length;i_end++){
 		 	var t = JSON.parse(Inst[i_end])
 		 	var inst = graph.insertVertex(parent, null,t.name, 
				x0+step_x_end, 20, 80, 20, 'fillColor=none;strokeColor=black');
 		 	var end = graph.insertVertex(parent, null, '-', x0+step_x_end, Y+350, 80, 10, 'defaultVertex;fillColor=black');
			step_x_end=step_x_end + 250;
	              
		var edge = graph.insertEdge(parent, null, '', 
		     inst, end, 'fillColor=#c3d9ff;strokeColor=#c3d9ff');
 	
 		 }
		graph.getModel().endUpdate();
		}
	}
};

var envInformation= new Array();

function showInfomationEnvironment(id_find){
 for(let i=0;i<envInformation.length;i++){
      var t = JSON.parse(envInformation[i]);
      if(t.id==id_find){
	 alert(t.data);       
      	}
 
 }
}



function parseEnvForChart(str, path){
  var str_result = envFormat(str);
  var mas_str = str_result .split('&&','||');
  
  for(let i=0;i<mas_str.length;i++)
  	if(mas_str[i].indexOf(path)>0){
  		var val = mas_str[i] .split('==');
  		envTraceX.push(val[1]);
  	}	
}

function insertStr(str,x){
var str, count=0;
        for(i=0;i<str.length;i++)
        	if(i%x==0 && i!=0){
        		count+=1;
        		str=str.replaceAt(i, '\n');
        	}
      
        	
	return [str,count];
}

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function envFormat(str){
 return str.replace(/\r?\n/g, '');
}

function findObject(mas,str){
var inst;
	for(let i=0;i<mas.length;i++){
		var obj = JSON.parse(mas[i]);
		if(obj.name==str)
			inst = mas[i];
		
	}
	
 return inst		
}

function overwriteY(mas, name, y){
        if(name=='env')
        	for(let i=0;i<mas.length;i++){
			var obj = JSON.parse(mas[i]);
        		mas.splice(i,1,  JSON.stringify({"name":obj.name,"x":obj.x,"y":y}));
        	}
        else
		for(let i=0;i<mas.length;i++){
			var obj = JSON.parse(mas[i]);
			if(obj.name==name){
				obj.y=y;
				mas.splice(i,1,  JSON.stringify({"name":obj.name,"x":obj.x,"y":obj.y}));
			}
		}
	
	
}
    
function remove(arr, ...args){
  var set = new Set(args); 
  return arr.filter((v, k) => !set.has(k));
}

function findMaxY(mas){
  var y =0;
  for(let i=0;i<mas.length; i++){
  	var obj = JSON.parse(mas[i]);
  	if(y<obj.y)
  		y= obj.y 
  }
  
  return y;
}     



var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');

$fileInput.on('dragenter focus click', function() {
  $droparea.addClass('is-active');
});

$fileInput.on('dragleave blur drop', function() {
  $droparea.removeClass('is-active');
});

$fileInput.on('change', function() {
  var filesCount = $(this)[0].files.length;
  var $textContainer = $(this).prev();

  if (filesCount === 1) {
    var fileName = $(this).val().split('\\').pop();
    $textContainer.text(fileName);
  } else {

    $textContainer.text(filesCount + ' files selected');
  }
});



(function($) {
	function setChecked(target) {
		var checked = $(target).find("input[type='checkbox']:checked").length;
		if (checked) {
			$(target).find('select option:first').html('Selected: ' + checked);
		} else {
			$(target).find('select option:first').html('Select from list');
		}
	}
 
	$.fn.checkselect = function() {
		this.wrapInner('<div class="checkselect-popup"></div>');
		this.prepend(
			'<div class="checkselect-control">' +
				'<select class="form-control"><option></option></select>' +
				'<div class="checkselect-over"></div>' +
			'</div>'
		);	
 
		this.each(function(){
			setChecked(this);
		});		
		this.find('input[type="checkbox"]').click(function(){
			setChecked($(this).parents('.checkselect'));
		});
 
		this.parent().find('.checkselect-control').on('click', function(){
			$popup = $(this).next();
			$('.checkselect-popup').not($popup).css('display', 'none');
			if ($popup.is(':hidden')) {
				$popup.css('display', 'block');
				$(this).find('select').focus();
			} else {
				$popup.css('display', 'none');
			}
		});
 
		$('html, body').on('click', function(e){
			if ($(e.target).closest('.checkselect').length == 0){
				$('.checkselect-popup').css('display', 'none');
			}
		});
	};
})(jQuery);	
 
$('.checkselect').checkselect();



  /*

            T H E M E functionality  

  var input = document.getElementById("select");
  function selectTheme() {
    var theme = input.options[input.selectedIndex].textContent;
    editor.setOption("theme", theme);
    location.hash = "#" + theme;
  }
  var choice = (location.hash && location.hash.slice(1)) ||
               (document.location.search &&
                decodeURIComponent(document.location.search.slice(1)));
  if (choice) {
    input.value = choice;
    editor.setOption("theme", choice);
  }
  CodeMirror.on(window, "hashchange", function() {
    var theme = location.hash.slice(1);
    if (theme) { input.value = theme; selectTheme(); }
  });*/





  
