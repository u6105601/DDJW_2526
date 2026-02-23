addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', 
    function(){
        let alies = prompt("Identificat amb un alies")
		console.log(alies);
    });

    document.getElementById('options').addEventListener('click', 
    function(){
        alert("Opcions:");
    });

    document.getElementById('saves').addEventListener('click', 
    function(){
        alert("Partides anteriors:");
    });

    document.getElementById('exit').addEventListener('click', 
    function(){
		alert("Sortint....");
        console.warn("Carregant sortida");
    });
});