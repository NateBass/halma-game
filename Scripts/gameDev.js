// This script is based around 3 things: The line, the square, and the piece.
var canvas, stage;
var update = true;
var kBoardWidth = 6;
var kBoardHeight= 6;
var kNumPieces = 9;
var kPieceWidth = 75;
var kPieceHeight= 75;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);
var w = 75;
var h = 75;
var squaresOccupied = [];
var squaresOccupied.length = kNumPieces;

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
	drawBoard();}
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
		line.graphics.setStrokeStyle(1).beginStroke("rgba(1,1,1,1)").moveTo(lines[i].x,kPixelHeight).lineTo(lines[i].x,0).endStroke();
		halmaBoard.addChild(line);
		// Horizontal Lines
		line.graphics.setStrokeStyle(1).beginStroke("rgba(1,1,1,1)").moveTo(kPixelWidth,lines[i].y).lineTo(0,lines[i].y).endStroke();
		halmaBoard.addChild(line);
		w = w + kPieceWidth;
		h = h + kPieceWidth;
	}

	// Set up sound
	createjs.Sound.registerSound("assets/hit.mp3","hit");
	createjs.Sound.addEventListener("loadComplete",pieceDrop);

	// Create Game Pieces
	var pieces = [];
	pieces.length = kNumPieces;
	var o;
	var piece;

	for (var i = pieces.length - 1; i >= 0; i--) {
		piece = new createjs.Shape();
		piece.graphics.beginRadialGradientFill(["rgba(255,255,255,1)", "rgba(0,0,0,1)"],[0,1],0,0,0,0,0,60).drawCircle(-38,337,30);
		halmaBoard.addChild(piece);
		piece.x = squaresOccupied[i].column*kPieceWidth;
		piece.y = squaresOccupied[i].row*kPieceHeight;

		// Piece functionality
		piece.on("mousedown",piecePickUp);
		piece.on("pressmove",pieceMove);
		piece.on("pressup",pieceDrop);
		function piecePickUp(event){
			squareDepart = {row:Math.ceil(kPieceWidth/event.stageX), column:Math.ceil(kPieceHeight/event.stageY)};
			o = event.target;
		  	o.parent.addChild(o);
			o.offset = {x:o.x-event.stageX, y:o.y-event.stageY};
		}
		function pieceMove(event) {
			var o = event.target;
			o.x = event.stageX + o.offset.x;
			o.y = event.stageY + o.offset.y;
			update = true;
		}
		function pieceDrop(event) {
			// squareArrive = {row:Math.ceil(kPieceWidth/event.stageX), column:Math.ceil(kPieceHeight/event.stageY), x:Math.ceil(kPieceWidth/event.stageX)*kPieceWidth, Math.ceil(kPieceHeight/event.stageY)*kPieceHeight};
			// // Validate
			// if(squareValidate(squareArrive,squareDepart)){
			// 	event.currentTarget.x = squareArrive.x;
			// 	event.currentTarget.y = squareArrive.y;
				createjs.Sound.play("hit");
			// }else {event.currentTarget.x = squareDepart.x;event.currentTarget.y = squareDepart.y;}
		}
		createjs.Ticker.addEventListener("tick", tick);
	}
}

// function squareValidate(squareArrive, squareDepart) {

// 		Math.abs(squareArrive.row-squareDepart.row);
// 		Math.abs(squareArrive.row-squareDepart.column);
// 		Math.abs(squareArrive.column-squareDepart.row);
// 		Math.abs(squareArrive.column-squareDepart.column);

// 	switch(move){
// 		case 'horizonatal' : Math.abs(squareArrive.row-squareDepart.row);
// 		case 'vertical' : Math.abs(squareArrive.row-squareDepart.column);
// 		case 'diagonalPos' : Math.abs(squareArrive.column-squareDepart.row);
// 		case 'diagonalNeg' : Math.abs(squareArrive.column-squareDepart.column);
// 	}


// 	for (var i = squaresOccupied.length - 1; i >= 0; i--) {
// 		if (Math.abs(rowArrive ) && !(squaresOccupied[i].column == columnArrive;)){
// 			squaresOccupied.push({row:this.row,colum:this.column})
// 			return true;
// 		}else {return flase;}
// 	}
// }
function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update(event);
	}}

function resumeGame(event) {return false;}

function init(){
	canvas = document.getElementById("gameCanvas");
	stage = new createjs.Stage(canvas);

	// Track mouse outside stage
	stage.mouseMoveOutside = true;
	// Check for touch-screen compatability
	createjs.Touch.enable(stage);

    if (!resumeGame()) {newGame();}}

// Concatenate row and column as strings to establish a "square number" unique identifier.
