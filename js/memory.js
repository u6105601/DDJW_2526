function generateSVG(shape, color) {
    let svgContent = '';
    const size = 100;
    
    if (shape === 'back') {
        svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="10" ry="10" fill="#2c3e50" stroke="#f39c12" stroke-width="5"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#f39c12" stroke-width="3" stroke-dasharray="5,5"/>
            <text x="50" y="55" font-size="20" text-anchor="middle" fill="#f39c12" font-family="Arial, sans-serif" font-weight="bold">M</text>
        </svg>`;
    } 
    else {
        let shapeCode = '';
        if (shape === 'circle') {
            shapeCode = `<circle cx="50" cy="50" r="35" fill="${color}" stroke="black" stroke-width="2"/>`;
        } else if (shape === 'square') {
            shapeCode = `<rect x="20" y="20" width="60" height="60" rx="5" fill="${color}" stroke="black" stroke-width="2"/>`;
        } else if (shape === 'triangle') {
            shapeCode = `<polygon points="50,15 85,80 15,80" fill="${color}" stroke="black" stroke-width="2"/>`;
        }

        svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="10" ry="10" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="2"/>
            ${shapeCode}
        </svg>`;
    }

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgContent);
}

const resources = [
    generateSVG('circle', '#3498db'),
    generateSVG('circle', '#e67e22'),
    generateSVG('square', '#3498db'),
    generateSVG('square', '#e67e22'),
    generateSVG('triangle', '#3498db'),
    generateSVG('triangle', '#e67e22')
];

const back = generateSVG('back');

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    lastCard: null,
    score: 200,
    pairs: 2,
	currentSelection: [],
	groupSize: 2,
    isProcessing: false,
	
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
	save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            score: this.score,
            pairs: this.pairs,
            groupSize: this.groupSize
        });
        localStorage.setItem("save", to_save);
        window.location.assign("../");
    },
	
    select: function(){
        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
			this.groupSize = toLoad.groupSize || 2;
			sessionStorage.removeItem("load");
        }
        else{ // Nova partida
			let mode = sessionStorage.getItem("gameMode") || "1";
            let optionsKey = (mode === "2" && sessionStorage.getItem("progressiveOptions")) 
                             ? "progressiveOptions" 
                             : "options";
							 
			let options = JSON.parse(sessionStorage.getItem(optionsKey) || '{"groupSize":2, "cards":2}')
            this.groupSize = parseInt(options.groupSize) || 2;
            this.pairs = parseInt(options.pairs) || 2;
			
			if (sessionStorage.getItem("puntsAcumulats")) {
                this.score = parseInt(sessionStorage.getItem("puntsAcumulats"));
                sessionStorage.removeItem("puntsAcumulats");
            } else {
                this.score = 200;
            }
			
            let baseItems = resources.slice(0, this.pairs); 
            this.items = [];
            for(let i = 0; i < this.groupSize; i++){
                this.items = this.items.concat(baseItems);
            }
            shuffe(this.items);
            this.states = new Array(this.items.length).fill(StateCard.ENABLE);
        }
    },
    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] !== StateCard.ENABLE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
            }
        });
    },
    click: function(indx){
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length || this.isProcessing) return;
        this.goFront(indx);
        this.currentSelection.push(indx);
        
        if (this.currentSelection.length === this.groupSize){
            let allMatch = this.currentSelection.every(i => this.items[i] === this.items[this.currentSelection[0]]);
            
            if (allMatch){
                this.currentSelection.forEach(i => this.states[i] = StateCard.DONE);
                this.pairs--;
                this.currentSelection = [];
                
                if (this.pairs <= 0){
                    setTimeout(() => {
                        let mode = sessionStorage.getItem("gameMode") || "1";

						if (mode === "2") {
							alert(`Nivell completat! Puntuació acumulada: ${this.score}`);
							let currentOptions = JSON.parse(sessionStorage.getItem("progressiveOptions") || sessionStorage.getItem("options") || '{"groupSize":2, "pairs":2}');
							
							currentOptions.pairs = parseInt(currentOptions.pairs) + 1;

							if (currentOptions.pairs > 6) {
								currentOptions.pairs = 2;
								currentOptions.groupSize = parseInt(currentOptions.groupSize) + 1;
							}

							sessionStorage.setItem("progressiveOptions", JSON.stringify(currentOptions));
							sessionStorage.setItem("puntsAcumulats", this.score);

							window.location.reload();
						} else {
                            alert(`Victòria! Puntuació final: ${this.score}`);
                            
                            let alias = sessionStorage.getItem("alias") || "Anònim";
                            let novaPuntuacio = { alias: alias, mode: "Personalitzat", score: this.score };

                            let ranking = JSON.parse(localStorage.getItem("ranking") || "[]");
                            ranking.push(novaPuntuacio);
                            ranking.sort((a, b) => b.score - a.score);
                            localStorage.setItem("ranking", JSON.stringify(ranking));

                            window.location.assign("../");
                        }
                    }, 500);
                }
            }
            else {
                this.isProcessing = true;
                setTimeout(() => {
                    this.currentSelection.forEach(i => this.goBack(i));
                    this.score -= 25; 
                    this.currentSelection = [];
                    this.isProcessing = false;
                    if (this.score <= 0){
                        alert("Game Over! T'has quedat sense punts.");

                        let mode = sessionStorage.getItem("gameMode") || "1";
                        if (mode === "2") {
                            let alias = sessionStorage.getItem("alias") || "Anònim";
                            let ranking = JSON.parse(localStorage.getItem("ranking") || "[]");
                            ranking.push({ alias: alias, mode: "Progressiu", score: this.score });
                            ranking.sort((a, b) => b.score - a.score);
                            localStorage.setItem("ranking", JSON.stringify(ranking));
                        }

                        window.location.assign("../");
                    }
                }, 1000);
            }
        }
    }
}
function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}
export var gameItems;
export function selectCards() { 
    game.select(); 
    gameItems = game.items; 
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}
export function saveGame(){ game.save(); }
