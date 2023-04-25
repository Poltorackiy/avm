class AplanModel{
	constructor(setting,act,beh, env, evt, goal, safety){
		this.setting=setting;
		this.action=act;
		this.behevior=beh;
		this.env_descript=env;
		this.evt_descript=evt;
		this.goal_formula=goal;
		this.safety_formula = safety;
	}
	
	get Setting(){ return this.setting; }
	
	get Action() {return this.action; }
	
	get Behevior() {return this.behevior; }
	
	get EnvDescript() {return this.env_descript; }
	
	get EvtDescript() {return this.evt_descript; }
	
	get SafetyCondition(){ return this.safety_formula; }
	
	get GoalCondition(){return this.goal_formula;}
	
	setAction(act){this.action = act; }
	
	setBehevior(beh){this.behevior = beh; }
	
	setEnvDescript(env){this.env_descript = env; }
	
	setEvtDescript(evt){this.evt_descript = evt; }
	
	setSafetyCondition(safety){this.safety_formula=safety;}
	
	setGoalCondition(goal){this.goal_formula=goal;}
	

	get InputAplanJSON(){  
	       var data={
		 	 "TypeMessage": "InputAplanModel",
			 "act": this.action,
			 "behp": this.behevior,
			 "env_descript": this.env_descript,
			 "evt_descript":this.evt_descript,
			 "conditions": [
				{"name":"goal1","type": "goal","vars": "Nil","termination": "1",
				 "maxtraces": "1","formula":this.goal_formula},
				{"name":"safety1","type": "safety","vars": "Nil","termination": "1",
				 "maxtraces": "1","formula": this.safety_formula}
			 ]
		 	}
		 	
		if(typeof this.safety_formula=="undefined" && typeof this.goal_formula!="undefined"){
			for(let i=0;i<data.conditions.length;i++)
			if("safety" == data.conditions[i].type)
				data.conditions.splice(i,1);
		}
		else if(typeof this.safety_formula!="undefined" && typeof this.goal_formula=="undefined"){
			for(let i=0;i<data.conditions.length;i++)
			if("goal" == data.conditions[i].type)
				data.conditions.splice(i,1);
		
		}
		else if(typeof this.safety_formula=="undefined" && typeof this.goal_formula=="undefined"){
			data.conditions = null;
			delete data.conditions;
		
		}
		
		return data;	
	}
	
	get EmptyAplanModel(){
		var data={"TypeMessage": "InputAplanModel"} 
			

		return data;
	}	
}


