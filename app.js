const express = require('express');
const app = express();

const expressLayouts = require('express-ejs-layouts');
const http = require('http');
const server = http.createServer(app);
const webSocket = require('ws');
let os = require('os');
const wss = new webSocket.Server({ server });

const path = require('path');
const routes = require('./routes/index');


const savefile = require('fs');

const axios = require('axios');

wss.on('connection', (ws) => {
	var urlFolder;
        var id = wss.getUniqueID();
	console.log("Conecting User"+" "+id);
	ws.on('message', (message) => {
	        console.log(message);
	       // RunBlockchainVisualizer();
		ReceiveMessage(ws, message, id);
		
	});
	
	ws.on('close', function() {
	        deleteFolder("temp_trace_blockchain_"+id);
    		console.log("Close");
  	});
  	


}); 

 wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

app.use(expressLayouts);
app.use('/public', express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('/', routes);



app.use(express.urlencoded({extended:false}));

function ReceiveMessage(ws, message, id){
        var obj;
	obj = JSON.parse(message);
	if(obj.TypeMessage=="OpenProject"){
		console.log("Open project folder");
		Show(ws, "Examples_Projects");
	}
	else if(obj.TypeMessage=="SelectedProject"){
		ReadFile("Examples_Projects/"+obj.NameProject, ws);
				
	}
	else if(obj.TypeMessage=="ClearFolder"){
		urlFolder = obj.url;
		clearFolder(obj.url, function(){
			console.log("clear folder");
			ws.send(JSON.stringify({"TypeMessage":"deleteFolder","Responce":"OK"}));	
		});
		
	}
	else if(obj.TypeMessage=="BlockchainVisualizerRun"){
	        var temp = JSON.parse(obj.traceData.trace);
	         console.log(obj.nameFolder);
		 saveToServerTrace(obj.traceData.trace, obj.nameFolder,"trace.json1","");	
	}
	else if(obj.TypeMessage=="asembler"){
		var path = obj.Vulnerabilities;
	        console.log(urlFolder);
		clearFolder(urlFolder, function (){
			
			createUserFolder(urlFolder+'/vbase', true);
		});
		
	        setTimeout(()=> {
			copyToFolder('./Vulnerabilities/'+path, urlFolder+'/vbase', function(){
			console.log("Copy success!");
			copyToFolder('./AssemblerResult',urlFolder, function(){
			console.log("Copy success!");
			
			ws.send(JSON.stringify({"TypeMessage":"RunAssemblerModel"}));
			
		});
			
		});},2000);
	
	}
}




function copyToFolder(sourceDir, destinationDir, callback){
	
	const fs = require('fs-extra');
	//var sourceDir = './Vulnerabilities/'+path;
	//var destinationDir = '/home/poltorackiy/avm.model/localhost/vbase';
	
	fs.copy(sourceDir, destinationDir, function (err) {
         if (err)
             console.error(err);
         else 
             console.log("Success: Copy: "+path);
	});
	callback(); 		 	 
}


function clearFolder(url, callback){
console.log(url);
const fs = require('fs');
const path = require('path');

const directory = url;

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
   deleteFolder(url+"/"+file);
   
  }
});
callback();
}

function createUserFolder(urlFolder,f){ 
 var fs = require('fs');
 var dir='';
 if(f)
 	dir = urlFolder;
 else
 	dir = './'+urlFolder;
 
 if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
 }
}

function deleteFolder(nameFolder){

const rimraf = require('rimraf');
rimraf(nameFolder, function () { console.log('done'); });

}

function saveToServerTrace(trace,path,name,type){
  var fs = require('fs');
  fs.writeFile(path+"/"+name+type,trace, function (err) {
    if (err) 
       return console.log(err);
             
   console.log("The file was saved!");
  });
}

RunBlockchainVisualizer = (path,name)=>{
    
      // var responseText = trace.replace('/\r|\n/g', '');  
       var child = require('child_process').spawn(
      	'java', ['-jar', 'BlockchainVisualizer-1.0.0.jar', './'+path+'/'+name+'.json'],{maxBuffer: 1024*1024}
	);

	child.stdout.on('data', function(data) {
    		console.log(data.toString());
	});

	child.stderr.on("data", function (data) {
    		console.log(data.toString());
	});
       
      
      /*
	const exec = require('child_process').exec;
	const childPorcess = exec('java -Xmx10024m -jar BlockchainVisualizer-1.0.0.jar '+"'"+responseText+"'", 
	{maxBuffer: 1024*1100},
	function(err, stdout, stderr) {
         	console.log(err);
	})
    	*/
}


function ReadFile(url,ws){
    
     var obj = {"TypeMessage":"ListProject", "Projects":""};
     
     var fs = require('fs');
     var path = require('path');
     
     var req, env, act, behp, evt="", dump;
     var getFiles = function (dir, files_){
     	files_ = files_ || [];
     	var files = fs.readdirSync(dir);
     	for (var i in files){
        	let name  = files[i];
        	var type = name.split('.');
		try {   
		        var data = fs.readFileSync(url+"/"+name, 'utf8');
		        if(name.indexOf("act")>0)
   				act = data;
   			else if(name.indexOf("behp")>0)
   				behp = data;
   			else if(name.indexOf("env_descript")>0)
   				env = data;
   			else if(name.indexOf("evt_descript")>0)
   				evt = data;
   			else if(name.indexOf("req")>0)
   				req = data;
   			else if(name.indexOf("dump")>0){
   				dump = data;
   			}
		} 
		catch(e) {
			console.log('Error:', e.stack);
		}          
    	}        
        return [act, behp, env, evt, req, dump];	
    };
    
   var [act_send, behp_send, env_send, evt_send, req_send, dump] = getFiles(url);
   
   if(typeof dump=="undefined"){
   	//var sendInputModel = JSON.stringify({"TypeMessage":"InputAplanModel", "act":act_send, "behp":behp_send,"env_descript":env_send});
   	var sendInputModel =JSON.stringify({"TypeMessage":"InputAplanModel","act":act_send,"behp":behp_send,"env_descript":env_send,
   "evt_descript":evt_send,"req":req_send,"conditions": [{"name":"goal1","type": "goal","vars": "Nil","termination": "1","maxtraces": "1","formula": ""},{"name":"safety1","type": "safety","vars": "Nil","termination": "1","maxtraces": "1","formula": ""}]});
    
   SendToClinet(sendInputModel, ws);
   }
   else{
   	 var dumpModel =JSON.stringify({"TypeMessage":"AssmblerDump","data":dump });
   	  SendToClinet(dumpModel, ws);
   	  dump=null;
   	  ReadFile('./AssemblerResult', ws);
	}
}


function SendToClinet(msg, ws){    

	ws.send(msg);
}

function Show(ws, url)
{   
     console.log("Show traces");
     var fs = require('fs');
     var path = require('path');
     
     var getFiles = function (dir, files_){
    
     files_ = files_ || [];
     var files = fs.readdirSync(dir);
     for (var i in files){
        //var name = dir + '/' + files[i];
        var name  = files[i];
        //if (fs.statSync(name).isDirectory()){
         //   getFiles(name, files_);
       // } else {
			
            files_.push(name);		
        //}
    }
	var obj;
	     files_.forEach(function (item, index, array) {
	     obj = {"TypeMessage":"ListProject", "Projects":array};
	});	 
     

	 var projectList = JSON.stringify(obj);
	 console.log(projectList);
	 ws.send(projectList);


};

getFiles(url);

}


server.listen(process.env.PORT ||5005, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

