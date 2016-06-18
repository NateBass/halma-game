var canvas, stage, halmaBoard;
var update = true;
var kBoardWidth = 6;
var kNumPieces = 9;
var kPieceWidth = 75;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);

var squaresOccupied = [];
var squareDepart = {};
var squareArrive = {};

function newGame() {
	squaresOccupied[0] = {row:1,column:1}
	squaresOccupied[1] = {row:1,column:2}
	squaresOccupied[2] = {row:1,column:3}
	squaresOccupied[3] = {row:2,column:1}
	squaresOccupied[4] = {row:2,column:2}
	squaresOccupied[5] = {row:2,column:3}
	squaresOccupied[6] = {row:3,column:1}
	squaresOccupied[7] = {row:3,column:2}
	squaresOccupied[8] = {row:3,column:3}

    drawBoard();
}
function drawBoard() {
	var halmaBoard = new createjs.Container();
	stage.addChild(halmaBoard);

	//Draw Lines
	var lines = [];
	lines.length = kNumPieces;
	var line = new createjs.Shape();
	var w = 75;
	var h = 75;

	for (var i = kBoardWidth, w=75, h=75; i >= 0; i--) {
		lines[i]={x:w,y:h};
		// Vertical Lines
		line.graphics.setStrokeStyle(1).beginStroke("rgba(1,1,1,1)").moveTo(lines[i].x,kPixelWidth).lineTo(lines[i].x,0).endStroke();
		halmaBoard.addChild(line);
		// Horizontal Lines
		line.graphics.setStrokeStyle(1).beginStroke("rgba(1,1,1,1)").moveTo(kPixelWidth,lines[i].y).lineTo(0,lines[i].y).endStroke();
		halmaBoard.addChild(line);
		w = w + kPieceWidth;
		h = h + kPieceWidth;
	}

	// Create Game Piece
	var piece;
	var o; //piece offset

	for (var i = squaresOccupied.length - 1; i >= 0; i--) {
		piece = new createjs.Shape();
		piece.graphics.beginRadialGradientFill(["rgba(255,255,255,1)", "rgba(0,0,0,1)"],[0,1],0,0,0,0,0,60).drawCircle(0,0,34);
		halmaBoard.addChild(piece);
		piece.x = squaresOccupied[i].column*kPieceWidth-38;
		piece.y = kPixelWidth - squaresOccupied[i].row*kPieceWidth+36;

		// Piece functionality
		piece.on("mousedown",piecePickUp);
		piece.on("pressmove",pieceMove);
		piece.on("pressup",pieceDrop);
	}

	// Set up sound
	createjs.Sound.registerSound("assets/hit.mp3","hit");
	createjs.Sound.addEventListener("loadComplete",pieceDrop);

	createjs.Ticker.addEventListener("tick", tick);
}

function piecePickUp(event){
	//squareDepart = {row:Math.ceil(kPieceWidth/event.stageX), column:Math.ceil(kPieceWidth/event.stageY)};
	o = event.target;
  	o.parent.addChild(o);
	o.offset = {x:o.x-event.stageX, y:o.y-event.stageY};
	squareDepart = {x:o.x,y:o.y};
}
function pieceMove(event) {
	var o = event.target;
	o.x = event.stageX + o.offset.x;
	o.y = event.stageY + o.offset.y;
	update = true;
}
function pieceDrop(event) {
	console.log(event.target);
	event.target.x = squareDepart.x;
	event.target.y = squareDepart.y;
	createjs.Sound.play("hit");
	update = true;
}

function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update(event);
	}
}

function resumeGame() {
	return false;
}

function init(){
	canvas = document.getElementById("gameCanvas");
	stage = new createjs.Stage(canvas);

	// Track mouse outside stage
	stage.mouseMoveOutside = true;
	// Check for touch-screen compatability
	createjs.Touch.enable(stage);

    if (!resumeGame()) {newGame();}
}
