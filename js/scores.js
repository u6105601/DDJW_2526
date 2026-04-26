import {$} from "../library/jquery-4.0.0.slim.module.min.js";

$(document).ready(function() {
    
    let rankingGuardat = localStorage.getItem("ranking");
    let cosTaula = $('#taulaRanking');

    if (!rankingGuardat || rankingGuardat === "[]") {
        cosTaula.html('<tr><td colspan="4">Encara no hi ha cap partida registrada.</td></tr>');
    } else {
        let llistaRanking = JSON.parse(rankingGuardat);
        let filesHTML = '';

        llistaRanking.forEach(function(partida, index) {
            let textMode = (partida.mode === "1") ? "Personalitzat" : "Progressiu";
            
            filesHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${partida.alias}</td>
                    <td>${textMode}</td>
                    <td>${partida.score}</td>
                </tr>
            `;
        });

        cosTaula.html(filesHTML);
    }

    $('#tornarMenu').on('click', function() {
        window.location.assign("../index.html");
    });
});