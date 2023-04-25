var disabledRun = true;



var jsonData = JSON.stringify({"TypeMessage":"SetOption",
				"tactic":"dfs","with_logger":1,
				"visited_type":"equality","max_level":4,
				"console_mode":1,"print_env":1,"print_act":0});




function DisableRun(disabledRun){
    $("#run" ).prop( "disabled", disabledRun);
}

 DisableRun(disabledRun);

$(document).ready(function() {
    $("#RunOK").click(function() {
        $("#VisualizationConteiner").toggle();
    });
});



$(document).ready(function() {
     $("#OpenProject").click(function() {
        $('#OpenProjectModal').modal('show');
    });
                  
});

$(document).ready(function() {
    $("#TypeProject").click(function() {
        disabledRun = false;
        DisableRun(disabledRun);
    });
});

$(document).ready(function() {
    $("#ReachabilityMode").click(function() {
      $('#myModal').modal('show');
    });
});


$(document).ready(function() {
    $("#TypeInsertionModel").click(function() {
        $("#InsertionModelConteiner").toggle();
    });
});


$(document).ready(function() {
    $("#visualizationMode").click(function() {
        $("#VisualizationConteiner").toggle();
    });
});




