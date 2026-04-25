const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

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
        localStorage.save = to_save;
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
        }
        else{ // Nova partida
			let options = JSON.parse(sessionStorage.getItem("options") || '{"groupSize":2, "cards":2}')
            this.groupSize = parseInt(options.groupSize);
            this.pairs = parseInt(options.cards);

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
                        alert(`Victory! Score: ${this.score}`);
                        window.location.assign("../");
                    }, 500);
                }
            }
            else {
                this.isProcessing = true;
                setTimeout(() => {
                    this.currentSelection.forEach(i => this.goBack(i));
                    this.score -= 25; // Penalització
                    this.currentSelection = [];
                    this.isProcessing = false;
                    if (this.score <= 0){
                        alert("Game Over");
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
export var gameItems = game.items;
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
