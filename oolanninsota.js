var width = 800, 
height = 600,
c = document.getElementById("c"),	//canvas
ctx = c.getContext("2d")			//grafiikat
c.width = width
c.height = height
//pelin muuttujat
var areaWidth = 80,		//koko alue
areaHeight = 48,
cellWidth = 10,		// yksi ruutu		
cellHeight = 10,
mouseX = 0,				
mouseY = 0,
plusY = 120,			
plusX = cellWidth/2,
mousexInMap = 0,
mouseyInMap = 0,
reinforcementsFin = 100,
reinforcementsEng = 100,
gameOver = false,
maxDistance = 100,
numbers = [],
AI = true,
Islands = [],
Map = [],
turn = 0,
selectedIsland = 0,
reinforcementsFin = 0,
reinforcementsEng = 0,
gameOver = 0,
mouseX = 0,
mouseY = 0,
debug = false,
S = "",
maxDistance = 100;


//=====FUNKTIOT ja luokat
var loadimage = function(src){
	var i = new Image()
	i.src = src
	return i
}
var random = function(a, b){
	//r&&om luku v‰lilt‰ [a,b]
	return a + Math.floor(Math.random()*(b + 1))
}
var drawLine = function(x1, y1, x2, y2){
	ctx.strokeStyle = "white"
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
}

function selectButton(x, y, img1, img2){
	this.x = x
	this.y = y
	this.img1 = loadimage(img1)	//ei pohjassa
	this.img2 = loadimage(img2)	//pohjassa
	this.on = 1
	
	this.draw = function(){
		//piirt‰‰ buttonin
		if (this.on == 1){
			ctx.drawImage(this.img1, this.x, this.y)
		}
	}
	this.pressed = function(e){
		//palauttaa jos nappia painetaan
	}
}
//kuvien lataus
bg = loadimage("kuvat/bg.png")
otsikko = loadimage("kuvat/otsikko.png") 
finFlag = loadimage("kuvat/fin.png")		
finBg = loadimage("kuvat/fin_iso.png")
finFlag2 = loadimage("kuvat/finflag.png")
engFlag = loadimage("kuvat/eng.png")
engBg = loadimage("kuvat/eng_iso.png")
engFlag2 = loadimage("kuvat/engflag.png")
red = loadimage("kuvat/red.png")
red2 = loadimage("kuvat/red2.png")
rose = loadimage("kuvat/ruusu.png")
cellImage = loadimage("kuvat/cell.png")


//=======LUOKAT ja pelin funktiot
function Cell(island, x, y){
	this.island = island
	this.x = x
	this.y = y
	this.cellWidth = 32
	this.cellHeight = 32
	
	this.isEmpty = function(){
		return (this.island == 0)
	}
}
var cellEmpty = function(x, y){
	if (x < 0 | x >= areaWidth | y < 0 | y >= areaHeight)
		return false
	else
		return Map[y][x].isEmpty()
}
var cellIsland = function(x, y){
	if (x < 0 | x >= areaWidth | y < 0 | y >= areaHeight)
		return false
	else
		return Map[y][x].island
}
function Island(x, y, country, troops){
	this.x = x
	this.y = y
	this.country = country
	this.troops = troops
}
var changeTurns = function(firstTime){
	if (firstTime != true){
		if (turn == 1)
			turn = 0
		else
			turn = 1	
	}
	var selectedIsland = 0
	var newRFFin = reinforcementsFin
	var newRFEng = reinforcementsEng
	var n = 0
	while ((newRFFin > 0 | newRFEng > 0) && n < 500){
		n++
		for (var i = 0; i < Islands.length; i++){
			var id = i
			var count = 0
			if (Islands[id].country == 0 && newRFFin > 0 && Islands[id].troops < 9){
				if (Islands[id].troops < 9){
					count = random(0, 9 - Islands[id].troops)
					if (count < 0 | count > 8 - Islands[id].troops)
						count = 0
					if (Islands[id].troops == 0 && count == 0)
						count = 1
				}else{
					count = 0
				}
				Islands[id].troops += count
				newRFFin -= count
			}else if (Islands[id].country == 1 && newRFEng > 0 && Islands[id].troops < 9){
				if (Islands[id].troops < 9){
					count = random(0, 9 - Islands[id].troops)
					if (count < 0 | count > 8 - Islands[id].troops)
						count = 0
					if (Islands[id].troops == 0 && count == 0)
						count = 1
				}else{
					count = 0
				}
				Islands[id].troops += count
				newRFEng -= count
			}
		}
	}
	var emptyIslands = true
	while (emptyIslands){
		emptyIslands = false
		for (var i = 0; i < Islands.length; i++){
			var troops =Islands[i].troops
			if (troops <= 0){
				emptyIslands = true
				for (var j = 0; j < Islands.length; j++){
					if (Islands[i].country == Islands[j].country
					&& Islands[j].troops > 1){
						Islands[j].troops -= 1
						Islands[i].troops += 1
						j = Islands.length
					}
				}
			}
		}
	}
}
var generateField = function(){
	//tyhjennet‰‰n kartta
	Map = []
	Islands = []
	for (var y = 0; y < areaHeight; y++){
		Map.push([])
		for (var x = 0; x < areaWidth; x++){
			Map[y].push(new Cell(0, x, y))
		}
	}
	//Saaret
	Islands.push(0)
	var islandCount = 0,
	maxIslands = 40,
	x = 22,
	y = 10,
	keepGoing = true
	var islandNumber = 0
	while(keepGoing){
		x = random(2, areaWidth - 3)
		y = random(2, areaHeight - 3)
		var cell = Map[y][x]
		if (cellEmpty(x, y) && cellEmpty(x, y - 1) && cellEmpty(x - 1, y)
						&& cellEmpty(x + 1, y) && cellEmpty(x - 1, y + 1) &&
						cellEmpty(x + 1, y - 1) && cellEmpty(x, y + 1) &&
						cellEmpty(x + 1, y + 1)){
			//luodaan uusi saari
			islandCount++
			var country = random(0, 1)
			var newIsland = new Island(x, y, country, 0)
			Islands.push(newIsland)
			
			islandNumber = islandCount
			var newCell = new Cell(islandCount, x, y)
			Map[y][x] = newCell
			var islandSize = random(25, 75)
			var cellsAdded = 0
			var tried = 0
			var previousDirection = 0
			var direction = 0
			var oldx = 0
			var oldy = 0
			while (cellsAdded < islandSize){
				tried += 1
				direction = random(0, 3) // 0:oikea 1:alas 2:vasemmalle 3:ylˆs
				if (direction == previousDirection)
					direction = random(0, 3)
				if (direction == previousDirection)
					direction = random(0, 3)
					
				previousDirection = direction
				oldx = x
				oldy = y
				if (direction == 0){
					x++
				}else if (direction == 1){
					y++
				}else if (direction == 2){
					x--
				}else if (direction == 3){
					y--
				}
				newx = x
				newy = y
				if ((cellEmpty(newx, newy)) && (
				(cellIsland(newx, newy - 1) == 0 | cellIsland(newx, newy - 1) == islandNumber) 
				&&
				(cellIsland(newx + 1, newy - 1) == 0 | cellIsland(newx + 1, newy - 1) == islandNumber)
				&&
				(cellIsland(newx + 1, newy) == 0 | cellIsland(newx + 1, newy) == islandNumber)
				&& 
				(cellIsland(newx + 1, newy + 1) == 0 | cellIsland(newx + 1, newy + 1) == islandNumber)
				&&
				(cellIsland(newx, newy + 1) == 0 | cellIsland(newx, newy + 1) == islandNumber)
				&& 
				(cellIsland(newx - 1, newy + 1) == 0 | cellIsland(newx - 1, newy + 1) == islandNumber)
				&&
				(cellIsland(newx - 1, newy - 1) == 0 | cellIsland(newx - 1, newy) == islandNumber)
				&&
				(cellIsland(newx - 1, newy - 1) == 0 | cellIsland(newx - 1, newy - 1) == islandNumber)
				)){
					//uusi ruutu saareen
					cellsAdded += 1
					var newCell = new Cell(islandNumber, newx, newy)
					Map[newy][newx] = newCell;
				}else{
						x = oldx
						y = oldy
				}
				if (tried > 65)
					break
			}
		}
		// onko tyhji‰ 3x3 alueita j‰jell‰
		var emptyPlaces = 0
		for (var y = 0; y < areaHeight; y++){
			for (var x = 0; x < areaWidth; x++){
				cell = Map[y][x]
				if (cellEmpty(x, y) && cellEmpty(x, y - 1) && cellEmpty(x - 1, y)
				&& cellEmpty(x + 1, y) && cellEmpty(x - 1, y + 1) &&
				cellEmpty(x + 1, y - 1) && cellEmpty(x, y + 1) &&
				cellEmpty(x + 1, y + 1))
					emptyPlaces += 1
			}
		}
		if (islandCount > maxIslands)
			break
		if (emptyPlaces < 3)
			break
	}
	changeTurns(true);
}
var getRealX = function(cell){
	return cellWidth * cell.x - cellWidth/2 + plusX;
}
var getRealY = function(cell){
	return cellHeight * cell.y - cellHeight/2 + plusY;
}
var getDistanceToSelected = function(cell){
	if (selectedIsland > 0){
		var realX = getRealX(cell);
		var realY = getRealY(cell);
		var distance = -1;
		for (var y = 0; y < areaHeight; y++){
			for (var x = 0; x < areaWidth; x++){
				var currentCell = Map[y][x];
				if (currentCell.island == selectedIsland){
					var currentCellRealX = getRealX(currentCell);
					var currentCellRealY = getRealY(currentCell);
					var distanceX = Math.abs(currentCellRealX - realX);
					var distanceY = Math.abs(currentCellRealY - realY);
					var currentDistance = Math.floor(Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)) + 0.5);
					if (distance == -1 | currentDistance < distance)
						distance = currentDistance;
				}
			}
		}
		return distance;
	}else{
		return -1;
	}
}
var drawCells = function(){
	for (var y = 0; y < areaHeight; y++){
		for (var x = 0; x < areaWidth; x++){	
			var cell = Map[y][x];
			var realX = getRealX(cell)
			var realY = getRealY(cell)
			if (cell.island > 0 && cell.island < Islands.length){
				ctx.drawImage(cellImage, realX, realY)
				if (Islands[cell.island].country == 0){
					if (turn == 1)
						ctx.drawImage(red, realX, realY);
					}
				else if (Islands[cell.island].country == 1){
					if (turn == 0)
						ctx.drawImage(red, realX, realY);
				}
			}
			//ctx.fillText(getDistanceToSelected(cell), realX, realY)
			if (selectedIsland > 0 && Islands[selectedIsland].country == turn){
				var distance = getDistanceToSelected(cell);
				var distanceInCells = Math.round(distance/cellWidth);
				var maxDistanceInCells = Math.round(maxDistance/cellWidth);
				if (distanceInCells <= maxDistanceInCells){
					ctx.drawImage(red2, realX, realY);
				}
			}
		}
	}
}
var attack = function(start, target){
	var startIsland = Islands[start];
	selectedIsland = start;
	var targetIsland = Islands[target];
	var x;
	var y;
	var reachable = false;
	for (y = 0; y < areaHeight; y++){
		for (x = 0; x < areaWidth; x++){
			var cell = Map[y][x];
			var distance = getDistanceToSelected(cell);
			var distanceInCells = Math.round(distance/cellWidth);
			var maxDistanceInCells = Math.round(maxDistance/cellWidth);
			if (distanceInCells <= maxDistanceInCells && cell.island == target)
				reachable = true;
		}
	}
	
	if (reachable){
		var startNumber = 0;
		var targetNumber = 0;
		var i;
		for(i = 0; i < startIsland.troops; i++){
			startNumber += random(1, 6);
		}
		for(i = 0; i < targetIsland.troops; i++){
			targetNumber += random(1, 6);
		}		
		if (startNumber > targetNumber){
			//voitto
			var newStartTroops = 1;
			var newTargetTroops = startIsland.troops - newStartTroops;
			startIsland.troops = newStartTroops;
			targetIsland.troops = newTargetTroops;
			targetIsland.country = turn;
			if (turn == 0){
				reinforcementsFin++;
				if (reinforcementsEng > 0)
					reinforcementsEng--;
			}else{
				reinforcementsEng++;
				if (reinforcementsFin > 0)
					reinforcementsFin--;
			}
			selectedIsland = 0;
		}else{
			//tappio
			var newStartTroops = 1;
			var newTargetTroops = targetIsland.troops;
			startIsland.troops = newStartTroops;
			targetIsland.troops = newTargetTroops;
			selectedIsland = 0;	
		}
		return true;
	}else{
		return false;
	}
}
var ai = function(){
	if (AI){
		var i;
		var changesMade = true;
		while (changesMade == true){
			changesMade = false;
			for (i = 1; i < Islands.length; i++){
				if (Islands[i].country == turn && Islands[i].troops > 1){
					//tarkistetaan l‰hell‰ olevat saaret
					var x = 0
					var y = 0
					for (y = 0; y < areaHeight; y++){
						for (x = 0; x < areaWidth; x++){
							var cell = Map[y][x];
							if (cell.island > 0){
								selectedIsland = i;
								var distance = getDistanceToSelected(cell);
								var distanceInCells = Math.round(distance/cellWidth);
								var maxDistanceInCells = Math.round(maxDistance/cellWidth);
								var lisa = random(-1, 1);
								/*if (turn == 0)
									lisa = 1;
								else
									lisa = 0;*/
								if (distanceInCells <= maxDistanceInCells &&
								Islands[i].troops > Islands[cell.island].troops + lisa
								&& Islands[cell.island].country != turn){
									var attackSuccesful = attack(i, cell.island);
									if (attackSuccesful){
										changesMade = true;
										return;
									}
								}
							}
						}
					}
				}
			}
		}
		if (changesMade == false){
			changeTurns(false);
		}
	}
}
var start = function(){
	
}
var paint = function(){
	ctx.drawImage(bg, 0, 0);
	ctx.drawImage(otsikko, 250, 0);
	ctx.drawImage(finFlag, 50, 10);
	ctx.drawImage(engFlag, 100, 10);
	ctx.fillStyle = "white"; 
	ctx.fillText ("" + reinforcementsFin, 50, 45);
	ctx.fillText ("" + reinforcementsEng, 100, 45);
	ctx.fillText ("Enter: end turn", 600, 20);
	if (AI)
		ctx.fillText ("Space bar: two players", 600, 35);
	else
		ctx.fillText ("Space bar: single player", 600, 35);
	ctx.fillstyle = "white"
	if (turn == 0){
		drawLine(50, 10, 85, 10);
		drawLine(50, 10, 50, 31);
		drawLine(85, 10, 85, 31);
		drawLine(50, 31, 85, 31);
	}else{
		drawLine(50 + 50, 10, 85 + 50, 10);
		drawLine(50 + 50, 10, 50 + 50, 31);
		drawLine(85 + 50, 10, 85 + 50, 31);
		drawLine(50 + 50, 31, 85 + 50, 31);		
	}
	drawCells()
	
	reinforcementsFin = 0;
	reinforcementsEng = 0;
	var i;
	for (i = 1; i < Islands.length; i++){
		//g.drawImage(Islands[i).flag, Islands[i).x * cellWidth - cellWidth/2 + plusX, 
		//Islands[i).y * cellHeight - cellHeight/2 + plusY, this);
		var troops = Islands[i].troops;
		var numberX = Islands[i].x * cellWidth + plusX;
		var numberY = Islands[i].y * cellHeight + plusY;
		if (Islands[i].country == 0){
			ctx.drawImage(finFlag2, numberX, numberY - 20 - cellWidth/2);
			reinforcementsFin++;
		}else if (Islands[i].country == 1){
			ctx.drawImage(engFlag2, numberX, numberY - 20 - cellWidth/2);
			reinforcementsEng++;
		}
		ctx.fillStyle = 'orange'
		ctx.beginPath()
		ctx.rect(numberX - cellWidth/2, numberY - cellWidth/2, 10, 10)
		ctx.closePath()
		ctx.fill()
		ctx.fillStyle = "black"
		ctx.fillText(Islands[i].troops, numberX - cellWidth/2 + 2, numberY + cellHeight/2 - 2); 	
		//g.drawString ("" + i, numberX + 10, numberY + 10);
		//if (selectedIsland == i)
			//g.drawOval (numberX - 100,numberY - 100,200,200);	
	}
	ctx.drawImage(rose, 698, 0);
	//Lopetus
	if (reinforcementsFin == 0 | reinforcementsEng == Islands.length){
		gameOver = true;
		ctx.drawImage(engBg, 0, 0);
	}else if (reinforcementsEng == 0 | reinforcementsFin == Islands.length){
		gameOver = true;
		ctx.drawImage(finBg, 0, 0);
	}
	if (gameOver){
		if (reinforcementsFin == 0)
			ctx.drawImage(engBg, 0, 0);
		else if (reinforcementsEng == 0)
			ctx.drawImage(finBg, 0, 0);
		else{
			start()
		}
	}
		
	if (turn == 1 && gameOver == false && AI)
		ai();
}
var startGame = function(){
	turn = 0
	selectedIsland = 0
	reinforcementsFin = 100 + 20 * turn
	reinforcementsEng = 120 - 20 * turn
	gameOver = false
	mouseX = 0
	mouseY = 0
	generateField()
}

//=====
//kontrollit
document.onkeyup = function(e){
	if (e.keyCode == 13){
		if (turn == 0 | AI == false)
			changeTurns(false);
	}
	else if(e.keyCode == 32){
		if (AI)
			AI = false;
		else
			AI = true;
	}
	if(gameOver == true){
		startGame();
	}	
}
document.onmouseup = function(e){
	mouseX = e.clientX - c.offsetLeft
	mouseY = e.clientY - c.offsetTop
	mousexInMap = Math.round((mouseX - plusX)/cellWidth);
	mouseyInMap = Math.round((mouseY - plusY)/cellHeight);
	if (mousexInMap > 0 && mousexInMap < areaWidth
	&& mouseyInMap > 0 && mouseyInMap < areaHeight){
		var cell = Map[mouseyInMap][mousexInMap];
		if (cell.island > 0){
			var island = Islands[cell.island];
			if (island.country == turn && island.troops > 1)
				selectedIsland = cell.island;
			if (island.country != turn && selectedIsland > 0){
				attack(selectedIsland, cell.island);
			}
		}
	}
}
//=====
var clear = function(){		//ruudun tyhjennys
  ctx.fillStyle = '#d0e7f9'
  ctx.beginPath()
  ctx.rect(-1, -1, width + 2 , height + 2)
  ctx.closePath()
  ctx.fill()
}

startGame()
//LOOPPI
var gLoop

var GameLoop = function(){
  clear()
  paint()
  if (debug){
	  ctx.fillStyle = "white";
	  ctx.fillText(mouseX + ", " + mouseY, 10,200)
	  ctx.fillText(mousexInMap + ", " + mouseyInMap, 10,220)
	  ctx.fillText(selectedIsland, 10,240)
	  ctx.fillText(getDistanceToSelected(Map[0][0]), 10,260)
	  ctx.fillText(getRealX(Map[0][0]) + ", " + getRealY(Map[0][0]), 10,280)
	  
  }
  
  gLoop = setTimeout(GameLoop, 1000 / 50)
}
GameLoop();