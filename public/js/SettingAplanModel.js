class SettingAplanModel{
	constructor(tactic,with_logger,visited_type,max_level,
			console_mode,print_env,print_act,asm_prepr,message_interpretation, ignore_act){
		this.tactic = tactic;
		this.with_logger =with_logger;
		this.visited_type =visited_type;
		this.max_level = max_level;
		this.console_mode = console_mode;
		this.print_env = print_env;
		this.print_act=print_act;
		this.asm_prepr=asm_prepr;
		this.message_interpretation=message_interpretation;
		this.ignore_act = ignore_act;
	}
	
	get Tactic(){return this.tactic; }
	
	get WithLogger(){return this.with_logger; }
	
	get VisitedType(){return this.visited_type;}
	
	get MaxLevel(){ return this.max_level;}
	
	get ConsoleMode(){return this.console_mode;}
	
	get PrintEnv(){return this.print_env;}
	
	get PrintAct(){return this.print_act;}
	
	get AsmPrepr(){return this.asm_prepr;}
	
	get MessageInterpretation(){ return this.message_interpretation;}
	
	get IgnoreAct(){return this.ignore_act;}
	
	
	setTactic(tactic){
		if(typeof tactic=="undefined")
			this.tactic = "dfs";
		else
			this.tactic = tactic; 
	}
	
	setWithLogger(wl){this.with_logger = wl; }
	
	setVisitedType(vt){
		this.visited_type="equality";	 
	}
	
	setMaxLevel(ml){ 
		if(typeof ml == "undefined")
			this.max_level ="0";
		else
			this.max_level=ml; 
	}
	
	setConsoleMode(cm){this.console_mode=cm; }
	
	setPrintEnv(pe){this.print_env = pe;}
	
	setPrintAct(pa){this.print_act = pa;}
	
	setAsmPrepr(ap){
		if(typeof ap== "undefined" || ap=="0")
			this.asm_prepr ="0";
		else
			this.asm_prepr ="1";
	}
	
	setMessageInterpretation(mi){
		if(typeof mi == "undefined" || mi=="none")
			this.message_interpretation = "none";
		else
			this.message_interpretation = "fifo"; 
	}
	
	
	setIgnoreAct(ia){
		if(typeof ia == "undefined" || ia == "0")
			this.ignore_act = "0";
		else 
			this.ignore_act = "1";
	}
    	
    settingInLine(goal, safety){      
  	return "\n"+"-----Set option-----"+"\n"+"tactic:"+this.tactic + "\n" + "with_logger:"+this.with_logger + "\n"+
  		"visited_type:"+this.visited_type + "\n" + "max_level:"+this.max_level + "\n" + "console_mode:" + this.console_mode +"\n"+
  		"print_env:"+this.print_env +"\n"+ "print_act:"+this.print_act + "\n"+ "asm_preprocessor:"+this.asm_prepr + "\n" +
  		"message_interpretation:" + this.message_interpretation + "\n" + "ignore_act:" + this.ignore_act + "\n" +
  		"Condition: "+"\n" + "  goal condition:" + goal + "\n" + "  safety condition:" + safety; 
  } 
  
  
  LoadSetingOnForm(){
	if(typeof this.max_level != "undefined"){
		$("#max_level_content").toggle();
		$("#use_max")[0].checked = true;
		$("#max_level").val(this.max_level);
	}
	if(this.asm_prepr=="1")
		$("#asm")[0].checked = true;
		
	if(this.message_interpretation=="fifo")
		$("#msg_inter")[0].checked = true;
	if(this.ignore_act=="1")
		$("#ignore_act")[0].checked = true;
  }
  
  	
  get SettingJson(){
 	 return {
 	     	  "TypeMessage":"SetOption",
 	 	  "values":[
        		{"name":"tactic","value":this.tactic},
        		{"name":"with_logger","value":this.with_logger},
        		{"name":"visited_type","value":this.visited_type},
        		{"name":"max_level","value":this.max_level},
        		{"name":"console_mode","value":this.console_mode},
        		{"name":"print_env","value":this.print_env},
        		{"name":"print_act","value":this.print_act}, 
        		{"name":"asm_preprocessor","value":this.asm_prepr},
        		{"name":"message_interpretation","value":this.message_interpretation},
        		{"name":"ignore_act", "value":this.ignore_act}
        	   ]
        	  };	
      } 
}
