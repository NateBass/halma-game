var canvas, stage, halmaBoard;
var update = true;
var kBoardWidth = 6;
var kNumPieces = 9;
var kPieceWidth = 75;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var playCount;
var playJumpInProgress;
var squaresOccupied = [];
var squareDepart = {};
var squareArrive = {};
var squareSame;

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
	playCount = 0;
	playJumpInProgress = false;
    drawBoard();
}

function squareValidate(squareArrive,squareDepart){
	if(squareEmpty()){
		// Single Move Vertical or Diagonal
		if (Math.abs(squareArrive.row-squareDepart.row) == 1 && Math.abs(squareArrive.column-squareDepart.column) <= 1) {playJumpInProgress = false; return true;}
		// Single Move Horizontal or Diagonal
		if (Math.abs(squareArrive.column-squareDepart.column)== 1 && Math.abs(squareArrive.row-squareDepart.row) <=1) {playJumpInProgress = false; return true;}
		// Jump Move Vertical
		if (Math.abs(squareArrive.row-squareDepart.row) == 2 && Math.abs(squareArrive.column-squareDepart.column) == 0) {return squareBetweenVertical();}
		// Jump Horizontal
		if (Math.abs(squareArrive.column-squareDepart.column) == 2 && Math.abs(squareArrive.row-squareDepart.row) == 0) {return squareBetweenHorizontal();}
		// Jump Diagonal
		if (Math.abs(squareArrive.row-squareDepart.row) == 2 && Math.abs(squareArrive.column-squareDepart.column) == 2) {return squareBetweenDiagonal();}
	}else{return false;}
}
function squareBetweenVertical() {
	var answer = false;
	for (var i = squaresOccupied.length - 1; i >= 0; i--) {
		if (squareArrive.row - 1 == squaresOccupied[i].row && squareArrive.column == squaresOccupied[i].column) {if(squareSame){playJumpInProgress = true}; answer = true;}
		if (squareArrive.row + 1 == squaresOccupied[i].row && squareArrive.column == squaresOccupied[i].column) {if(squareSame){playJumpInProgress = true}; answer = true;}
	}
	return answer;
}

function squareBetweenHorizontal() {
	var answer = false;
	for (var i = squaresOccupied.length - 1; i >= 0; i--) {
		if (squareArrive.column - 1 == squaresOccupied[i].column && squareArrive.row == squaresOccupied[i].row) {if(squareSame){playJumpInProgress = true}; answer = true;}
		if (squareArrive.column + 1 == squaresOccupied[i].column && squareArrive.row == squaresOccupied[i].row) {if(squareSame){playJumpInProgress = true};}
	}
	return answer;
}

function squareBetweenDiagonal() {
	var answer = false;
	for (var i = squaresOccupied.length - 1; i >= 0; i--) {
		if (squareArrive.row - 1 == squaresOccupied[i].row && squareArrive.column - 1 == squaresOccupied[i].column) {if(squareSame){playJumpInProgress = true}; answer = true}
		if (squareArrive.row + 1 == squaresOccupied[i].row && squareArrive.column + 1 == squaresOccupied[i].column) {if(squareSame){playJumpInProgress = true}; answer = true}
		if (squareArrive.row - 1 == squaresOccupied[i].row && squareArrive.column + 1 == squaresOccupied[i].column) {if(squareSame){playJumpInProgress = true}; answer = true}
		if (squareArrive.row + 1 == squaresOccupied[i].row && squareArrive.column - 1 == squaresOccupied[i].column) {if(squareSame){playJumpInProgress = true}; answer = true}
	}
	return answer;
}

function squareEmpty() {
	var answer = true;
	for (var i = squaresOccupied.length - 1; i >= 0; i--) {
		if(squaresOccupied[i].row == squareArrive.row && squaresOccupied[i].column == squareArrive.column) {answer = false;}
	}
	return answer;
}

function drawBoard() {
	var halmaBoard = new createjs.Container();
	stage.addChild(halmaBoard);
	// // Display Background
	// var backgroundImage = new createjs.Bitmap("assets/canvas.jpg");
	// backgroundImage.scaleX = 1;
	// backgroundImage.scaleY = 1;
	// halmaBoard.addChild(backgroundImage);

	//Draw Lines
	var lines = [];
	lines.length = kNumPieces;
	var line = new createjs.Shape();
	var w = 75;
	var h = 75;

	for (var i = kBoardWidth, w=75, h=75; i >= 0; i--) {
		lines[i]={x:w,y:h};
		// Vertical Lines
		line.graphics.setStrokeStyle(3).beginStroke("#000000").moveTo(lines[i].x,kPixelWidth).lineTo(lines[i].x,0).endStroke();
		halmaBoard.addChild(line);
		// Horizontal Lines
		line.graphics.setStrokeStyle(3).beginStroke("#000000").moveTo(kPixelWidth,lines[i].y).lineTo(0,lines[i].y).endStroke();
		halmaBoard.addChild(line);
		w = w + kPieceWidth;
		h = h + kPieceWidth;
	}

	// Create Game Piece
	var piece = [];
	var o; //piece offset

	for (var i = squaresOccupied.length - 1; i >= 0; i--) {
		piece = new createjs.Shape();
		piece.graphics.beginRadialGradientFill(["rgba(255,255,255,1)", "rgba(0,0,0,1)"],[0,1],-40,-40,0,-40,-40,65).drawCircle(0,0,34);
		halmaBoard.addChild(piece);
		piece.x = squaresOccupied[i].column*kPieceWidth-(kPieceWidth/2) ;
		piece.y = squaresOccupied[i].row*kPieceWidth-(kPieceWidth/2);

		// Piece functionality
		piece.on("mousedown",piecePickUp);
		piece.on("pressmove",pieceMove);
		piece.on("pressup",pieceDrop);
	}

	// Set up sound
	createjs.Sound.registerSound("assets/hit.wav","hit");
	createjs.Sound.addEventListener("loadComplete",pieceDrop);
	createjs.Sound.registerSound("assets/ding.mp3","ding");
	createjs.Sound.addEventListener("loadComplete",endGame);

	createjs.Ticker.addEventListener("tick", tick);
}

function piecePickUp(event){
	o = event.target;
  	o.parent.addChild(o);
	o.offset = {x:o.x-event.stageX, y:o.y-event.stageY};
	squareDepart = {x:o.x,y:o.y,row:Math.ceil(event.stageY/kPieceWidth),column:Math.ceil(event.stageX/kPieceWidth)};
	// Is the piece on a jump combo? Checking previous squareArrive with the new squareDepart to find if it is the same square.
	if(squareDepart.column == squareArrive.column && squareDepart.row == squareArrive.row) {squareSame = true;} else {squareSame = false; playJumpInProgress = false}
}
function pieceMove(event) {
	var o = event.target;
	o.x = event.stageX + o.offset.x;
	o.y = event.stageY + o.offset.y;
	update = true;
}
function pieceDrop(event) {
	squareArrive = {x:event.stageX,y:event.stageY,row:Math.ceil(event.stageY/kPieceWidth),column:Math.ceil(event.stageX/kPieceWidth)};
	console.log(squareArrive.row,squareArrive.column);
	// Does the move follows the rules outlined in function squareValidate?.
	if(squareValidate(squareArrive,squareDepart)) {
		event.target.x = squareArrive.column*kPieceWidth-(kPieceWidth/2);
		event.target.y = squareArrive.row*kPieceWidth-(kPieceWidth/2);
		squareUpdate();
		if(!(playJumpInProgress)) {playCount = playCount + 1;}
		document.getElementById('playCount').innerHTML=playCount;
		createjs.Sound.play("hit");
		if(gameOver()){endGame();}
	} else {event.target.x = squareDepart.x; event.target.y = squareDepart.y;}
	update = true;
}
function endGame() {
	var winnerScreen = new createjs.Container();
	stage.addChild(winnerScreen);
	var goldenPiece;

	// var background = new createjs.Shape();
	// background.graphics.beginFill("#000000").rect(0, 0, kPixelWidth, kPixelWidth);
	// background.alpha = .25;
	// winnerScreen.addChild(background);


	for (var i = 0; i < kNumPieces; i++){
		goldenPiece = new createjs.Shape();
		goldenPiece.graphics.beginRadialGradientFill(["#FFFFFF", "#FFD700"],[0,1],-40,-40,0,-40,-40,65).drawCircle(0,0,34);
		goldenPiece.x = squaresOccupied[i].row*kPieceWidth-(kPieceWidth/2);
		goldenPiece.y = squaresOccupied[i].column*kPieceWidth-(kPieceWidth/2);
		winnerScreen.addChild(goldenPiece);
	}


	update = true;
	createjs.Sound.play("ding");
}

function gameOver() {
	var counter = 0;
	for (var i = squaresOccupied.length - 1; i >= 0; i--) {
		if(squaresOccupied[i].row == 6 && squaresOccupied[i].column == 6) {counter = counter + 1}
		if(squaresOccupied[i].row == 6 && squaresOccupied[i].column == 5) {counter = counter + 1}
		if(squaresOccupied[i].row == 6 && squaresOccupied[i].column == 4) {counter = counter + 1}
		if(squaresOccupied[i].row == 5 && squaresOccupied[i].column == 6) {counter = counter + 1}
		if(squaresOccupied[i].row == 5 && squaresOccupied[i].column == 5) {counter = counter + 1}
		if(squaresOccupied[i].row == 5 && squaresOccupied[i].column == 4) {counter = counter + 1}
		if(squaresOccupied[i].row == 4 && squaresOccupied[i].column == 6) {counter = counter + 1}
		if(squaresOccupied[i].row == 4 && squaresOccupied[i].column == 5) {counter = counter + 1}
		if(squaresOccupied[i].row == 4 && squaresOccupied[i].column == 4) {counter = counter + 1}
	}
	if(counter == kNumPieces){return true} else{return false;}
}

function squareUpdate() {
	for (var i = squaresOccupied.length - 1; i >= 0; i--) {
		if(squaresOccupied[i].row == squareDepart.row && squaresOccupied[i].column == squareDepart.column) {squaresOccupied.splice(i,1,{row:squareArrive.row,column:squareArrive.column}); }
	}
}

function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update(event);
	}
}
function resumeGame() {return false;
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
