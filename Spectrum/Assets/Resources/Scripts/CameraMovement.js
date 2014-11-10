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

var squareRadius:float;

function Start () {

	Manager = this.gameObject.transform.parent.GetComponent(GameManager);
	character = Manager.character.model;
//	character.camera = this.gameObject;
	speed = 2;
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
	

	

	
}


function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		Gizmos.DrawWireCube (this.gameObject.transform.position, Vector3(xMax-xMin, yMax-yMin, 0));
	
}

function doMovement(){
	if(!character.frozen){
	var charX:float = character.transform.position.x;
	var charY:float = character.transform.position.y;
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
	if (charY > yMax){ // going over top bound
		curY += charY - yMax;
		yMin += charY - yMax;
		yMax += charY - yMax;
	}
	if (charY < yMin){ // going over bottom bound
		curY -= yMin - charY;
		yMax -= yMin - charY;
		yMin -= yMin - charY;
	}
	this.transform.position.x = curX;
	this.transform.position.y = curY;
	}
}


