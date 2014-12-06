#pragma strict

var target;
var Manager:GameManager;

var started:boolean;

var character:CharacterModel;
var moveN:boolean;
var moveW:boolean;
var moveS:boolean;
var moveE:boolean;

var rotateL:boolean;
var rotateR:boolean;
var speed:int;
var rolling:boolean;
var jumping:boolean;

var xMax:float;
var xMin:float;
var yMax:float;
var yMin:float;

var curX:float;
var curY:float;

var freeze : boolean;

var squareRadius:float;
var mouseWorldSpace:Vector3;

function Start () {
	

	//Manager = this.gameObject.transform.parent.GetComponent(GameManager);
	character = Manager.character.model;
	
//	character.camera = this.gameObject;
	speed = 2;
	freeze = false;
	rolling = false;
	jumping = false;
	this.transform.position = Vector3(0,0,-10);
	
	squareRadius = 1; // side length of square divided by 2
	
	this.xMax = character.transform.position.x+squareRadius;
	this.xMin = character.transform.position.x-squareRadius;
	this.yMax = character.transform.position.y+squareRadius;
	this.yMin = character.transform.position.y-squareRadius;
	curX = character.transform.position.x;
	curY = character.transform.position.y;
	this.transform.position.x = character.transform.position.x;
	this.transform.position.y = character.transform.position.y;
	
}

function Update(){
	if(freeze)
		recenter();
		

	
}

function recenter(){
	character = Manager.character.model;
	this.transform.position.x = character.transform.position.x;
	this.transform.position.y = character.transform.position.y;

}


function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		Gizmos.DrawWireCube (Vector3(this.gameObject.transform.position.x, this.gameObject.transform.position.y, 0), Vector3(xMax-xMin, yMax-yMin));
		Gizmos.color = Color.green;
	
		Gizmos.DrawWireCube (Vector3(mouseWorldSpace.x, mouseWorldSpace.y, 0), Vector3(.1, .1, .1));
}

function doMovement(){
	
	if(!character.frozen){
	var charX:float = character.transform.position.x;
	var charY:float = character.transform.position.y;
	
	
	
	//this.gameObject.transform.position.x = charX;
	//this.gameObject.transform.position.y = charY;
//	return;
	if (charX > xMax){ // going over right bound
		curX += charX - xMax;
		xMin += charX - xMax;
		xMax += charX - xMax;
	}
	if (charX < xMin){ // going over left bound
		curX -= xMin - charX;
		xMax -= xMin - charX;
		xMin -= xMin - charX;
	}
	if (charY > yMax){ // going over top bo	und
		curY += charY - yMax;
		yMin += charY - yMax;
		yMax += charY - yMax;
	}
	if (charY < yMin){ // going over bottom bound
		curY -= yMin - charY;
		yMax -= yMin - charY;
		yMin -= yMin - charY;
	}
	var mouseScreenPosition = Input.mousePosition;
	mouseScreenPosition.z = character.transform.position.z;
    mouseWorldSpace = Camera.mainCamera.ScreenToWorldPoint(mouseScreenPosition);
  //  mouseWorldSpace.z = 0;
	mouseWorldSpace.x -= (charX-(xMax+xMin)/2);
	mouseWorldSpace.y -= (charY-(yMax+yMin)/2);
	
	this.gameObject.transform.position.x = curX;
	this.gameObject.transform.position.y = curY;
	} else{
		freeze = true;
	}
}


