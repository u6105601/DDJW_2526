import {$} from "../library/jquery-4.0.0.slim.module.min.js";

$(document).ready(function() {
   $('#play').on('click', function(){
    let alias = prompt("Introdueix el teu àlies:");
    if (!alias) alias = "Anònim";
    sessionStorage.setItem("alias", alias);

    let modeNormal = confirm("Prem OK per al Mode 1 (Personalitzat) o Cancel·la per al Mode 2 (Progressiu)");
    
    if (modeNormal) {
        sessionStorage.setItem("gameMode", "1");
    } else {
        sessionStorage.setItem("gameMode", "2");
    }

    window.location.assign("./html/game.html");
	});

    $('#options').on('click', 
    function(){
        window.location.assign("./html/options.html");
    });

	$('#saves').on('click', function(){
        window.location.assign("./html/scores.html");
    });
	
	$('#exit').on('click', function() {
        alert("Sortint....");
    });
});
