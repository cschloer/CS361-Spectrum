#pragma strict

var target;
var Manager:LevelManager;

var started:boolean;

var character:CharacterModel;
var moveN:boolean;
var moveW:boolean;
var moveS:boolean;
var moveE:boolean;

//var rotateL:boolean;
//var rotateR:boolean;
var speed:int;
//var rolling:boolean;
//var jumping:boolean;

function Start () {
	this.transform.position = Vector3(0,0,-10);
	Manager = this.gameObject.transform.parent.GetComponent(LevelManager);
	//character = Manager.character.model;
	//character.camera = this.gameObject;
	speed = 8;
	//rolling = false;
	//jumping = false;
}

function Update(){

	if (Input.GetKeyDown("w")){
		 moveN = true;
	}
	if (Input.GetKeyDown("a")){
		 moveW = true;
	}
	if (Input.GetKeyDown("s")){
		 moveS = true;
	}
	if (Input.GetKeyDown("d")){
		 moveE = true;
	}
	if (Input.GetKeyUp("w")){
		 moveN = false;
	}
	if (Input.GetKeyUp("a")){
		 moveW = false;
	}
	if (Input.GetKeyUp("s")){
		 moveS = false;
	}
	if (Input.GetKeyUp("d")){
		 moveE = false;
	}
	doMovement();
}

function moveStop(){
		moveN = false;
		moveS = false;
		moveE = false;
		moveW = false;
}

function doMovement(){
	//if (rotateR) this.gameObject.transform.Rotate(Vector3(0,0,Time.deltaTime*160*(speed)));
	//if (rotateL) this.gameObject.transform.Rotate(Vector3(0,0,-Time.deltaTime*160*(speed)));
	if (moveN) this.gameObject.transform.Translate(Vector3.up * Time.deltaTime*speed);
	if (moveE) this.gameObject.transform.Translate(Vector3.right * Time.deltaTime*speed);
	if (moveS) this.gameObject.transform.Translate(Vector3.down * Time.deltaTime*speed);
	if (moveW) this.gameObject.transform.Translate(Vector3.left * Time.deltaTime*speed);
}
