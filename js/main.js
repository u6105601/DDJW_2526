import {$} from "../library/jquery-4.0.0.slim.module.min.js";
var c1 = $('#play')
var c2 = $('#options')
var c3 = $('#saves')
var c4 = $('#exit')

c1.on('click', 
function(){
    let alies = prompt("Identificat amb un alies")
	console.log(alies);
    window.location.assign("./html/game.html");
});

c2.on('click', 
function(){
    alert("Opcions:");
});

addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', 
    function(){
        sessionStorage.removeItem('load');
        window.location.assign("./html/game.html");
    });

    document.getElementById('options').addEventListener('click', 
    function(){
        window.location.assign("./html/options.html");
    });

    document.getElementById('saves').addEventListener('click', 
    function(){
        let to_load = localStorage.save;
        fetch('../php/load.php', {
            method: "POST",
            body: JSON.stringify({}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => to_load = (!json.error)?JSON.stringify(json.save): localStorage.save)
        .catch (err => {
            console.error(err);
            console.warn("La partida s'intentarà carregar de local");
        });

        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });


c3.on('click', 
function(){
	alert("Partides anteriors:");
});

c4.on('click', 
function(){
	alert("Sortint....");
	console.warn("Carregant sortida");
});
