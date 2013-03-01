var titleImage;
var ingameImage;
var levelOverImage;
var nextImage;
var nextRollImage;
var playImage;
var playRollImage;

var stage;
var levels;
var timerText;
var pointsAdded = 0;
var gameTotalPoints = 0;

var deviceType;
var totalImages = 0;
var gameStatus = 2;

var startBtn;
var NUMBER_OF_TILES = 20;
var TILES_PER_ROW = 5;
var CARDS_TO_PLAY = 0;
		
var tiles = new Array();
var pickedTiles = new Array();
var deck = new Array();
		
var cardWidth = 100;
var cardHeight = 100;
var screenWidth = 0;
var screenHeight = 0;
		
var card1 = 1;
var card2 = 1;
var t1;
var t2;
var solved = 0;

function init(){
	var str = navigator.userAgent.toLowerCase();
	var canvas = document.getElementById("myCanvas");
	stage = new Stage(canvas);
	stage.mouseEventsEnabled = true;
	stage.enableMouseOver();
	canvas.addEventListener("mouseup", mouseUp, false);
	gamec = document.getElementById("credits");
	
	if(screen.width < 350){
		deviceType = "mobile";
		screenWidth = 320;
		screenHeight = 480;
		cardWidth = 50;
		cardHeight = 50;
		canvas.width = 320;
	}else{
		deviceType = "desktop";
		screenWidth = 640;
		screenHeight = 480;
	}
	
	var gamebg = new Image();
	gamebg.onload = showPic;
	if(deviceType == "desktop"){
		gamebg.src = "graphics/ingameBg.png";	
	}else{
		gamebg.src = "graphics/ingameBg_mobile.png";
	}
	
	var maintitle = new Image();
	maintitle.onload = handleImageLoad;
	if(deviceType == "desktop"){
		maintitle.src = "graphics/title.png";
	}else{
		maintitle.src = "graphics/title_mobile.png";
	}
	
	var levelOver = new Image();
	levelOver.onload = function(e){
		var img = e.target;
		levelOverImage = new Bitmap(img);
		totalImages++;
		allLoaded();
	}
	if(deviceType == "desktop"){
		levelOver.src = "graphics/levelOver.png";
	}else{
		levelOver.src = "graphics/levelOver_mobile.png";
	}
	
	var next = new Image();
	next.onload = function(e){
		var img = e.target;
		nextImage = new Bitmap(img);
		totalImages++;
		allLoaded();
	}
	next.src = "graphics/nextBtn.png";
	
	var nextRoll = new Image();
	nextRoll.onload = function(e){
		var img = e.target;
		nextRollImage = new Bitmap(img);
		totalImages++;
		allLoaded();
	}
	nextRoll.src = "graphics/nextBtn_roll.png";
	
	var play = new Image();
	play.onload = function(e){
		var img = e.target;
		playImage = new Bitmap(img);
		totalImages++;
		allLoaded();
	}
	play.src = "graphics/playBtn.png";
	
	var playRoll = new Image();
	playRoll.onload = function(e){
		var img = e.target;
		playRollImage = new Bitmap(img);
		totalImages++;
		allLoaded();
	}
	playRoll.src = "graphics/playBtn_roll.png";

	levels = 1;
	Ticker.setFPS(20);
	Ticker.addListener(stage);
}

function allLoaded(){
	if(totalImages >= 7){
		stage.addChild(titleImage);
		titleImage.x = 0;
		titleImage.y = 0;
		loadPlayButtons();
		var parent = document.getElementById("gameArea");
		var child = document.getElementById("loader");
       	parent.removeChild(child);
		stage.update();
	}
}

function handleImageLoad(e){
	var img = e.target;
	titleImage = new Bitmap(img);
	totalImages++;
	allLoaded();
}

function loadPlayButtons(){
	stage.addChild(playImage);
	playImage.x = screenWidth/2 - 81;
	playImage.y = screenHeight - 100;
	playImage.onClick = playClick;
	playImage.onMouseOver = playMouseOver;
	
	stage.addChild(playRollImage);
	playRollImage.x = screenWidth/2 - 81;
	playRollImage.y = screenHeight - 105;
	playRollImage.visible = false;
	playRollImage.onClick = playClick;
	playRollImage.onMouseOut = playMouseOut;
	stage.update();
}
		
function Card(x, y, i, ondeck){
	this.xpos = x;
	this.ypos = y;
	this.cardNumber = i;
	this.deck = ondeck;
	this.clicked = false;
			
	this.img = new Image();
	this.img.setAtX = this.xpos;
	this.img.setAtY = this.ypos;
	this.img.onload = function(e){
		var im = e.target;
		var bit = new Bitmap(im);
		stage.addChild(bit);
		bit.x = e.target.setAtX;
		bit.y = e.target.setAtY;
		if(deviceType == "mobile"){
			bit.scaleX = 0.6;
			bit.scaleY = 0.6;
		}
		e.target.bitm = bit;
		stage.update();
	}
	this.img.src = "graphics/card.png";
	this.originalCard = originalCard;
			
	this.flip = new Image();
	this.flip.setAtX = this.xpos;
	this.flip.setAtY = this.ypos;
	this.flip.onload = function(e){
		var im = e.target;
		var bit = new Bitmap(im);
		stage.addChild(bit);
		bit.x = e.target.setAtX;
		bit.y = e.target.setAtY;
		if(deviceType == "mobile"){
			bit.scaleX = 0.6;
			bit.scaleY = 0.6;
		}
		bit.alpha = 0;
		e.target.bitm = bit;
		stage.update();
	}
	this.flip.src = "graphics/card"+ondeck+".png";
	this.flipCard = flipCard;
}
		
function originalCard(){
	Tween.get(this.img.bitm,{loop:false})
		.to({alpha:1},400,Ease.get(-1)) // tween x over 0.5s with ease in
	Tween.get(this.flip.bitm,{loop:false})
		.to({alpha:0},400,Ease.get(1)) // tween x/y/alpha properties over 1s (1000ms) with ease out
	stage.update();
}
		
function flipCard(){
	Tween.get(this.flip.bitm,{loop:false})
		.to({alpha:1},400,Ease.get(-1)) // tween x over 0.5s with ease in
	Tween.get(this.img.bitm,{loop:false})
		.to({alpha:0},400,Ease.get(1))
	stage.update();
}
		
function mouseUp(e){
	if(card1==0 || card2==0){
		var mx;
		var my;
		if(e.layerX >= 0 || e.layerY >= 0){
			mx = e.layerX;
			my = e.layerY;
		}else if(e.offsetX >= 0 || e.offsetY >= 0){
			mx = e.offsetX;
			my = e.offsetY;
		}
		var i = 0;
		if(gameStatus == 1){
			for(i = 0; i<deck.length; i++){
				var card = deck[i];
				if((mx > card.xpos && mx < card.xpos + cardWidth) && (my > card.ypos && my < card.ypos + cardHeight)){
					if(card.clicked == false){
						card.clicked = true;
						card.flipCard();
						if(card1 == 0){
							card1 = card;
						}else if(card2 == 0){
							card2 = card;
							t1 = setTimeout("execute()", 100);
						}
					}
				}
			}
		}
	}else{
		var mx;
		var my;
		if(e.layerX >= 0 || e.layerY >= 0){
			mx = e.layerX;
			my = e.layerY;
		}else if(e.offsetX >= 0 || e.offsetY >= 0){
			mx = e.offsetX;
			my = e.offsetY;
		}
		if(gameStatus == 2){
			if(nextImage.isVisible()){
				if((mx > nextImage.x && mx < nextImage.x + 162) && (my > nextImage.y && my < nextImage.y + 65)){
					startBtnClick();
				}
			}
			if(playImage.isVisible()){
				if((mx > playImage.x && mx < playImage.x + 162) && (my > playImage.y && my < playImage.y + 65)){
					playClick();
				}
			}
		}
	}
}
		
function execute(){
	clearTimeout(t1);
	if(card1.deck == card2.deck){
		card1.clicked = true;
		card2.clicked = true;
		solved+=2;
		pointsAdded = 10;
		if(solved >= CARDS_TO_PLAY){
			gameStatus = 2;
			t2 = setTimeout("executeOnWin()", 600);
		}else{
			card1 = 0;
			card2 = 0;
		}
	}else{
		pointsAdded = -2;
		t2 = setTimeout("executeOnLose()", 600);
	}
}

function executeOnLose(){
	clearTimeout(t2);
	card1.originalCard();
	card2.originalCard();
	card1.clicked = false;
	card2.clicked = false;
	card1 = 0;
	card2 = 0;
}

function executeOnWin(){
	clearTimeout(t2);
	removeAllClips();
	levels++;
}
		
function setVariables(){
	var i;
	switch(levels){
		case 1: CARDS_TO_PLAY = 4; break;
		case 2: CARDS_TO_PLAY = 6; break;
		case 3: CARDS_TO_PLAY = 10; break;
		case 4: CARDS_TO_PLAY = 14; break;
		case 5: CARDS_TO_PLAY = 16; break;
		case 6: CARDS_TO_PLAY = 20; break;
		default: CARDS_TO_PLAY = 20; break;
	}
	var levelAr = [[0,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0,0,0], 
					[0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0],
					[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
					[0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0],
					[0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	tiles = [];
	deck = [];
	card1 = 0;
	card2 = 0;
	gameStatus = 1;
	for(i=0; i<CARDS_TO_PLAY; i++){
		tiles.push(Math.floor(i/2));
	}
	var swap,tmp;
	for(i=CARDS_TO_PLAY-1; i>0; i--){
		swap = Math.floor(Math.random()*i);
		tmp = tiles[i];
		tiles[i] = tiles[swap];
		tiles[swap] = tmp;
	}
	var j = 0;
	for(i=0; i<NUMBER_OF_TILES; i++){
		if(deviceType == "desktop"){
			var x = 25 + (cardWidth+15)*(i%5);
			var y = 25 + (cardHeight+15)*(Math.floor(i/5));
		}else{
			var x = 35 + (cardWidth+15)*(i%4);
			var y = 40 + (cardHeight+15)*(Math.floor(i/4));
		}
		if(levelAr[levels-1][i] == 1){
			var card = new Card(x,y,j,tiles[j]);
			deck.push(card);
			j++;
		}
	}
}
		
function showPic(e){
	var img = e.target;
	ingameImage = new Bitmap(img);
	totalImages++;
	allLoaded();
}

function startBtnClick(){
	setVariables();
	if(levels == 1){
		stage.removeChild(titleImage);
		titleImage = null;
		stage.addChild(ingameImage);
		ingameImage.x = 0;
		ingameImage.y = 0;
	}
	if(levelOverImage){
		stage.removeChild(levelOverImage);
		stage.removeChild(nextImage);
		stage.removeChild(nextRollImage);
	}
	stage.update();
}

function showNextRoll(){
	nextRollImage.visible = true;
	nextImage.visible = false;  
	stage.update();
}

function showBackRoll(){
	nextRollImage.visible = false;
	nextImage.visible = true;  
	stage.update();
}

function playMouseOver(){
	playImage.visible = false;
	playRollImage.visible = true;
	stage.update();
}

function playMouseOut(){
	playImage.visible = true;
	playRollImage.visible = false;
	stage.update();
}

function playClick(){
	stage.removeChild(playImage);
	stage.removeChild(playRollImage);
	playImage = null;
	playRollImage = null;
	stage.update();
	startBtnClick();
}

function removeAllClips(){
	solved = 0;
	for(i=0; i<CARDS_TO_PLAY; i++){
		var card = deck[i];
		var test = stage.removeChild(card.img.bitm);
		var test1 = stage.removeChild(card.flip.bitm);
	}
	deck = [];
	stage.addChild(levelOverImage);
	stage.addChild(nextImage);
	stage.addChild(nextRollImage);
	if(deviceType == "mobile"){
		levelOverImage.x = screenWidth/2 - (280/2);//165;
		levelOverImage.y = screenHeight/2 - (234/2);//90;
	}else{
		levelOverImage.x = screenWidth/2 - (326/2);//165;
		levelOverImage.y = screenHeight/2 - (258/2);//90;
	}
	nextImage.x = screenWidth/2 - 81;//246;
	nextImage.y = screenHeight - 100;//391;
	nextImage.visible = true;
	nextRollImage.x = screenWidth/2 - 81;//246;
	nextRollImage.y = screenHeight - 105;//386;
	nextRollImage.visible = false; 
	nextImage.onMouseOver = showNextRoll;
	nextRollImage.onMouseOut = showBackRoll;
	nextRollImage.onClick = startBtnClick;
	stage.update();
}

function setTimers(){
	var score = new Text("Score:", "20px Arial", "#FFF");
	stage.addChild(score);
	score.x = 560;
	score.y = 190;
	
	timerText = new Text("00", "50px Arial", "#FFF");
	stage.addChild(timerText);
	timerText.x = 560;
	timerText.y = 240;
}

function cursor_clear() {
	document.body.style.cursor = 'pointer';
}