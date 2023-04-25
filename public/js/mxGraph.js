/*
var json = JSON.stringify({
	"files":[],
	"Instances":[
		{"agentType":"bag2_e2","agentName":"Agent"},
		{"agentType":"bag1_e2","agentName":"Agent"},
		{"agentType":"ag1","agentName":"Agent"},
		{"agentType":"ag2","agentName":"Agent"}],
	"Environment":" \n (rax==0)",
	"trace":[
		{"action":"a","msc":[
			{"type":"msg","arrow":"out","agents":[{"agentType":"Agent","agentName":"ag1"},{"agentType":"Agent","agentName":"ag2"}],"name":"msg","number":1,"params":[{"value":"0"}]},
			{"type":"msg","arrow":"out","agents":[{"agentType":"Agent","agentName":"ag2"},{"agentType":"Agent","agentName":"ag1"}],"name":"msg","number":2,"params":[{"value":"0"}]}]},
		{"Environment":" \n rax==0"},
		{"action":"bag2","msc":[
			{"type":"msg","arrow":"in","agents":[{"agentType":"Agent","agentName":"ag2"},{"agentType":"Agent","agentName":"ag1"}],"name":"msg","number":1,"params":[{"value":"0"}]},
			{"type":"act","agentType":"Agent","agentName":"bag2_e2","value":"text"}]},
		{"Environment":" \n rax==0&& \n rbx==1"},
		{"action":"bag1","msc":[
			{"type":"msg","arrow":"in","agents":[{"agentType":"Agent","agentName":"ag1"},{"agentType":"Agent","agentName":"ag2"}],"name":"msg","number":2,"params":[{"value":"0"}]},
			{"type":"act","agentType":"Agent","agentName":"bag1_e2","value":"text"}]},
		{"Environment":" \n rbx==1&& \n rax==0&& \n rbx==1"},
		{"action":"cag1","msc":[
			{"type":"msg","arrow":"out","agents":[{"agentType":"Agent","agentName":"ag1"},{"agentType":"Agent","agentName":"ag2"}],"name":"msg","number":3,"params":[{"value":"lvr0__26_32_0_0"}]}]},
		{"Environment":" \n rbx==1&& \n lvr0__26_32_0_0==1&& \n rax==0"},
		{"action":"cag2","msc":[
			{"type":"msg","arrow":"out","agents":[{"agentType":"Agent","agentName":"ag2"},{"agentType":"Agent","agentName":"ag1"}],"name":"msg","number":4,"params":[{"value":"lvr0__32_26_0_0"}]}]},
		{"Environment":" \n rbx==1&& \n lvr0__32_26_0_0==1&& \n lvr0__26_32_0_0==1&& \n rax==0"},
		{"action":"dag2","msc":[
			{"type":"msg","arrow":"in","agents":[{"agentType":"Agent","agentName":"ag2"},{"agentType":"Agent","agentName":"ag1"}],"name":"msg","number":3,"params":[{"value":"lvr0__26_32_0_0"}]}]},
		{"Environment":" \n lvr0__32_26_0_0==1&& \n rcx==2&& \n rbx==1&& \n rax==0"},
		{"action":"dag1","msc":[
			{"type":"msg","arrow":"in","agents":[{"agentType":"Agent","agentName":"ag1"},{"agentType":"Agent","agentName":"ag2"}],"name":"msg","number":4,"params":[{"value":"lvr0__32_26_0_0"}]}]},
		{"Environment":" \n rcx==2&& \n rcx==2&& \n rbx==1&& \n rax==0"},
		{"action":"notkag1","msc":[
			{"type":"msg","arrow":"in","agents":[{"agentName":"found"},{"agentType":"Agent","agentName":"ag1"}],"name":"msg","number":5,"params":[]}]},
		{"Environment":" \n rcx==2&& \n rcx==2&& \n rbx==1&& \n rax==0"},
		{"action":"notkag2","msc":[
			{"type":"msg","arrow":"in","agents":[{"agentName":"found"},{"agentType":"Agent","agentName":"ag2"}],"name":"msg","number":6,"params":[]}]}
	]
});


*/



//main(document.getElementById('graphContainer'), json);

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



function main(container, json){
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
				
		// Specifies the default edge style
		graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';
				
		// Enables rubberband selection
		new mxRubberband(graph);
		var parent = graph.getDefaultParent();
		graph.getModel().beginUpdate();
	
		
		try{
			var edge_style = graph.getStylesheet().getDefaultEdgeStyle();
                  	edge_style[mxConstants.STYLE_ENDARROW] = 1;
			
			var step_x=0;
			var step_y=50;
			var obj = JSON.parse(json);
			
			var Instances = new Array();
			var MSG = new Array();
			
			
			for(let i=0;i< obj.Instances.length;i++){
				var inst = graph.insertVertex(parent, null,obj.Instances[i].agentType, 20+step_x, 20, 80, 30, 'fillColor=none;strokeColor=black');
				var instJson = JSON.stringify({"name": inst.getValue(), "x":20+step_x, "y":20});
				
				var end = graph.insertVertex(parent, null, '-', 20+step_x, 600, 80, 10, 'defaultVertex;fillColor=black');
				var edge = graph.insertEdge(parent, null, '', 
				inst, end, 'fillColor=none;strokeColor=black');			
				
				Instances[i]=(instJson);
				
				step_x=step_x + 250;
 			}
 			    var c=0;
 			    for(let j=0;j<=obj.trace.length;j+=2){
		              	for(let h=0;h<obj.trace[j].msc.length;h++){
		              		if(obj.trace[j].msc[h].type!='act'){
		              			for(let k=0;k<obj.trace[j].msc[h].agents.length;k++){
		              				var findInstantion=findObject(Instances, obj.trace[j].msc[h].agents[k].agentName);
	
		              				var i =JSON.parse(findInstantion);     				
		              				var msg = graph.insertVertex(parent,null,"",
		              				i.x+40,i.y+step_y+15,1,1, 'fillColor=none;strokeColor=black');
		              				
		              				c+=1;
		              				
		              				MSG.push(msg);
		                                       if(c==2){
		                                       	edge = graph.insertEdge(parent, null,
		                                       	obj.trace[j].msc[h].params[0].value, MSG[0], MSG[1],
		                              		'edgeStyle=orthogonalEdgeStyle;'+
		                          			'orthogonalLoop=1;jettySize=auto;startArrow=classic;startFill=1;'+
		                           			'targetPerimeterSpacing=8;sourcePerimeterSpacing=8;'+
		                           			'strokeColor=#aaaaaa;strokeWidth=1;curved=0;');
		                                               MSG=[];
		                                       	c=0;
		                                       }	              				
		              				overwriteY(Instances, i.name, i.y+step_y+15);
	
		              			}
		        		}
		              		else if(obj.trace[j].msc[h].type=='act'){
		              			var findInstantion=findObject(Instances, obj.trace[j].msc[h].agentName);
		              			
		              			var i = JSON.parse(findInstantion);
		              			
		              			var act = graph.insertVertex(parent, null,
		              			obj.trace[j].msc[h].value, i.x, i.y+step_y, 80, 30, 'strokeColor=black');

		              			overwriteY(Instances, i.name, i.y+step_y);
		              			
		              			
		              		}
		              	}
		            }
		              							
		}
		finally{
			graph.getModel().endUpdate();
			}
	}
};


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
