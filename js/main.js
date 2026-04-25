import {$} from "../library/jquery-4.0.0.slim.module.min.js";

$(document).ready(function() {
    $('#play').on('click', 
    function(){
        let alias = prompt("Enter your alias:");
		if (!alias) return;
    
		sessionStorage.setItem("alias", alias);
		sessionStorage.removeItem('load');
		
		let mode = confirm("Press OK for Mode 1 (Custom) or Cancel for Mode 2 (Progressive)");
		sessionStorage.setItem("gameMode", mode ? "1" : "2");
        window.location.assign("./html/game.html");
    });

    $('#options').on('click', 
    function(){
        window.location.assign("./html/options.html");
    });

    $('#saves').on('click', 
    function(){
        let to_load = localStorage.getItem("save");
        
        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });
	$('#exit').on('click', function() {
        alert("Sortint....");
    });
});
