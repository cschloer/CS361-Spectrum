﻿var moveN:boolean;
var moveW:boolean;
var moveS:boolean;
var moveE:boolean;

var Manager:GameManager;

var rotateL:boolean;
var rotateR:boolean;
var speed:int;

var blue:boolean;
var red:boolean;
var yellow:boolean;

var rolling:boolean;
var jumping:boolean;
var vincible:boolean;	// New: makes the player vincible/invincible for certain jumps/rolls.

var rjTimer:float;

var character : Character;
var modelObject;

var walkclip : AnimationClip;

var colorStore : Color;
var heading : Vector3;
var rollTime : float; 
var rollSpeed : float;
var rollCooldown : float;
var jumpCooldown : float;
var jumpTime : float;

var rollSound : AudioSource;
var jumpSound : AudioSource;
var landSound : AudioSource;

var shadow : GameObject;
var shadowOffset : float;

var coolSpell:boolean; // cooldown for spell

// Use this for initialization
function Start () {
	isHook = false;
	speed = 2;
	blue = false;
	red = false;
	yellow = false;
	rolling = false;
	vincible = true;
	colorStore = Color(1,1,1);
	heading = Vector3.zero;
	rollTime = .5;
	rollSpeed = 8;
	rollCooldown = 1.5;
	jumpCooldown = 1;
	jumpTime = 1;
	
	rollSound = gameObject.AddComponent("AudioSource") as AudioSource;
	rollSound.clip = Resources.Load("Sounds/tumble");
	rollSound.volume = .5;
	jumpSound = gameObject.AddComponent("AudioSource") as AudioSource;
	jumpSound.clip = Resources.Load("Sounds/boing");
	landSound = gameObject.AddComponent("AudioSource") as AudioSource;
	landSound.clip = Resources.Load("Sounds/thump");
	
	shadow = GameObject.CreatePrimitive(PrimitiveType.Quad);
	//shadow.transform.parent=transform;
	//shadow.transform.localPosition = Vector3(0, 0, 0);						// Center the model on the parent.
	shadow.transform.parent = this.transform.parent;
	shadow.name = "Character Shadow";											// Name the object.
	shadow.renderer.material.mainTexture = Resources.Load("Textures/CharTemp", Texture2D);	// Set the texture.  Must be in Resources folder.
	shadow.renderer.material.color = Color.black;												// Set the color (easy way to tint things).
	shadow.renderer.material.color.a = .4;
	shadow.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	shadow.collider.enabled = false;
	shadowOffset = .1;
}

// Update is called once per frame
function Update () {
	updateShadow();
	transform.position.z = 0;
	rjTimer += Time.deltaTime;
	if (rolling){
		this.transform.Translate(heading * Time.deltaTime*speed);
		if (rjTimer >= rollTime) { // Amount of time for rolling
			rolling = false;
			this.renderer.material.color = colorStore;	
			Manager.gameObject.GetComponentInChildren(CameraMovement).rolling = false;
			speed = 2;
			Manager.gameObject.GetComponentInChildren(CameraMovement).speed = 2;
			rjTimer = 0;
		}
	 }
	if (jumping){
	
		if(rjTimer <jumpTime/2) shadowOffset += Time.deltaTime;
		else shadowOffset -= Time.deltaTime;
							
		if (rjTimer >= jumpTime) { // Amount of time for jumping
			jumping = false;
			this.renderer.material.color = colorStore;	
			Manager.gameObject.GetComponentInChildren(CameraMovement).jumping = false;
			//modelObject.GetComponent(BoxCollider).isTrigger = false;
			gameObject.GetComponent(BoxCollider).isTrigger = false;
			vincible = true;															// Makes player vincible again.
			rjTimer = 0;
			landSound.Play();
			landing();
		}
	}
	if (Input.GetKeyUp("w")){
		 moveN = false;
		 Manager.gameObject.GetComponentInChildren(CameraMovement).moveN = false;
	}
	if (Input.GetKeyDown("w")) {
		moveN = true;
		Manager.gameObject.GetComponentInChildren(CameraMovement).moveN = true;
	}	
	if (Input.GetKeyUp("a")){
		moveW = false;
		Manager.gameObject.GetComponentInChildren(CameraMovement).moveW = false;	
	}
	if (Input.GetKeyDown("a")){
		 moveW = true;
		 Manager.gameObject.GetComponentInChildren(CameraMovement).moveW = true;
		}
	if (Input.GetKeyUp("s")){
		moveS = false;
		Manager.gameObject.GetComponentInChildren(CameraMovement).moveS = false;
	}
	if (Input.GetKeyDown("s")) {
		moveS = true;
		Manager.gameObject.GetComponentInChildren(CameraMovement).moveS = true;
	}		
	if (Input.GetKeyUp("d")) {
		moveE = false;
		Manager.gameObject.GetComponentInChildren(CameraMovement).moveE = false;
	}
	if (Input.GetKeyDown("d")) {
		moveE = true;
		Manager.gameObject.GetComponentInChildren(CameraMovement).moveE = true;
	}	
	/*rotateL = false;
	rotateR = false;
	if (Input.GetAxis("Mouse X")>0){
    		rotateL = true;
			Manager.gameObject.GetComponentInChildren(CameraMovement).rotateL = true;
	}
	if (Input.GetAxis("Mouse X")<0){
    		rotateR = true;
			Manager.gameObject.GetComponentInChildren(CameraMovement).rotateR = true;
	}*/
	if (Input.GetKeyUp("right")){
		if (!rotateR){
			rotateL = false;
			Manager.gameObject.GetComponentInChildren(CameraMovement).rotateL = false;
		}
	}
	if (Input.GetKeyDown("right")) {
		if (!rotateR){
			rotateL = true;
			Manager.gameObject.GetComponentInChildren(CameraMovement).rotateL = true;
		}
	}		
	if (Input.GetKeyUp("left")) {
		if(!rotateL){
			rotateR = false;
			Manager.gameObject.GetComponentInChildren(CameraMovement).rotateR = false;
		}
	}
	if (Input.GetKeyDown("left")) {
		if(!rotateL){
			rotateR = true;
			Manager.gameObject.GetComponentInChildren(CameraMovement).rotateR = true;
		}
	}
	if (Input.GetKeyDown("f")){
	
		castSpell();
	}
	if (Input.GetKeyDown("space")) {
		if (!jumping && !rolling) { 
			if (!blue && rjTimer >= rollCooldown){ // roll because blue
				// todo: roll animation
				rollSound.Play();
				colorStore = this.renderer.material.color;
				this.renderer.material.color = Color(.5,.5,.5);
				speed = rollSpeed;
				Manager.gameObject.GetComponentInChildren(CameraMovement).speed = rollSpeed;
				rolling = true;
				Manager.gameObject.GetComponentInChildren(CameraMovement).rolling = true;
				rjTimer = 0;
			}
			else if (blue && rjTimer >= jumpCooldown){ // jump because not blue
				// todo: jump animation
				jumpSound.Play();
				colorStore = this.renderer.material.color;
				this.renderer.material.color = Color(2,2,2);
				jumping = true;
				Manager.gameObject.GetComponentInChildren(CameraMovement).jumping = true;
				rjTimer = 0;
				modelObject.GetComponent(BoxCollider).isTrigger = true;
				vincible = false;														// Player invincible without passing through walls.
				
			}
		
		}
	}
			
	if (!rolling){
		
		if (rotateR) this.transform.Rotate(Vector3(0,0,Time.deltaTime*160*(speed)));
		if (rotateL) this.transform.Rotate(Vector3(0,0,-Time.deltaTime*160*(speed)));
		
		heading = Vector3.zero;
		if (moveN) heading += Vector3.up;
		if (moveE) heading += Vector3.right;
		if (moveS) heading += Vector3.down;
		if (moveW) heading += Vector3.left;
		heading.Normalize();
		this.transform.Translate(heading * Time.deltaTime * speed);
	
	}	
	Manager.gameObject.GetComponentInChildren(CameraMovement).gameObject.transform.position = Vector3(this.transform.position.x, this.transform.position.y, -10)+3*this.transform.up;
	Manager.gameObject.GetComponentInChildren(CameraMovement).gameObject.transform.rotation = this.transform.rotation;
	//OnDrawGizmos();
	
	vincible = false;
}


function updateShadow(){
	shadow.transform.position = transform.position + Vector3.down * shadowOffset;
	shadow.transform.rotation = transform.rotation;
	shadow.transform.position.z = 0;
	if (!jumping) shadowOffset = .1;
}
function OnCollisionExit(collisionInfo : Collision){
	modelObject.GetComponent(Rigidbody).velocity = Vector3.zero;
}

function changeBlue(){
	if (blue){
		blue = false;
		this.renderer.material.color = colorChoice();
	}
	else{
		blue = true;
		this.renderer.material.color = colorChoice();
	}
	//print("Blue: " + blue);

}
function changeRed(){
	if (red){
		red = false;
		this.renderer.material.color = colorChoice();
		this.transform.localScale = Vector3(1,1,1); 
		modelObject.GetComponent(BoxCollider).size = Vector3(.25,.5,10);
		shadow.transform.localScale = Vector3(1,1,1);
	}
	else {
		red = true;
		this.renderer.material.color = colorChoice();
		this.transform.localScale = Vector3(2,2,2); 
		shadow.transform.localScale = Vector3(2,2,2);
		modelObject.GetComponent(BoxCollider).size = Vector3(.5,1,10);
	}
	//print("Red: " + red);

}
function changeYellow(){
	if (yellow) {
		yellow = false;
		this.renderer.material.color = colorChoice();
	}
	else {
	  yellow = true;
	  this.renderer.material.color = colorChoice();
	}
//	print("Yellow: " + yellow);
}

function colorChoice(){
  if(red && yellow && blue){
  	return Color(0,0,0);
  } else if( red && yellow){
  	return Color(1,.5,0);
  } else if( red && blue){
  	return Color(1,0,1);
  } else if( yellow && blue){
  	return Color(0,1,0);
  } else if( yellow ){
  	return Color(1,1,0);
  } else if( blue ) {
  	return Color(0,0,1);
  } else if( red ){
  	return Color(1,0,0);
  } else {
  	return Color(1,1,1);
  }
}

/*function OnTriggerEnter(col:Collider){
	if (col.gameObject.name.Contains("Blue")){
		if (blue) blue = false;
		else blue = true;
		print("Blue: " + blue);
	}
	if (col.gameObject.name.Contains("Red")){
		if (red){
			red = false;
			this.transform.localScale = Vector3(1,1,1); 
			modelObject.GetComponent(BoxCollider).size = Vector3(.25,.5,10);
		}
		else {
			red = true;
			this.transform.localScale = Vector3(2,2,2); 
			modelObject.GetComponent(BoxCollider).size = Vector3(.5,1,10);
		}
		print("Red: " + red);
	}
	if (col.gameObject.name.Contains("Yellow")){
		if (yellow) yellow = false;
		else yellow = true;
		print("Yellow: " + yellow);
	}
}
*/

function stopMovement(){
	rotateR = false;
	Manager.gameObject.GetComponentInChildren(CameraMovement).rotateR = false;
	rotateL = false;
	Manager.gameObject.GetComponentInChildren(CameraMovement).rotateL = false;
	
	moveE = false;
	Manager.gameObject.GetComponentInChildren(CameraMovement).moveE = false;
	moveW = false;
	Manager.gameObject.GetComponentInChildren(CameraMovement).moveW = false;	
	moveS = false;
	Manager.gameObject.GetComponentInChildren(CameraMovement).moveS = false;
	moveN = false;
	Manager.gameObject.GetComponentInChildren(CameraMovement).moveN = false;
	
	//todo: stop moving animation
}

function OnTriggerEnter(col:Collider){
	if(col.gameObject.name.Contains("attack") && !character.hurting && vincible){
		character.hurt();
	}
}

function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		Gizmos.DrawWireCube (transform.position, modelObject.GetComponent(BoxCollider).size);
	
}

function landing(){
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the landing texture.
	var landingScript = modelObject.AddComponent("Landing");		// Add the landing.js script to the object.
	
																																							// We can now refer to the object via this script.
	landingScript.transform.parent = this.transform.parent;	// Set the landing's parent object to be the landing folder.							
	landingScript.init(this.transform.position.x, this.transform.position.y, modelObject, this.red);				

}

function castSpell(){
	if (yellow && !blue) spellHook(); // rolling meele
	else if (!yellow && !blue) spellMine(); // rolling ranged
	else if (yellow && blue) spellAOE(); // jumping melee
	else print("Spell not yet implemented");
}

function spellHook(){ // hook spell, currently when meele
	if (coolSpell) return;
	coolSpell = true;
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the hook texture.
	var hookScript = modelObject.AddComponent("SpellHook");		// Add the hook.js script to the object.
	
																																							// We can now refer to the object via this script.
	hookScript.transform.parent = this.transform.parent;	// Set the hook's parent object to be the hook folder.							
	hookScript.init(this.transform.position.x, this.transform.position.y, modelObject, this);	
}

function spellMine(){	// mine spell, currently when ranged
	if (coolSpell) return;
	coolSpell = true;
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the hook texture.
	var hookScript = modelObject.AddComponent("SpellMine");		// Add the hook.js script to the object.
																																							// We can now refer to the object via this script.
	hookScript.transform.parent = this.transform.parent;	// Set the hook's parent object to be the hook folder.							
	hookScript.init(this.transform.position.x, this.transform.position.y, modelObject, this);	

}

function spellAOE(){
	if (coolSpell) return;
	coolSpell = true;
	for (var i=0; i < 16; i ++){
		var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the hook texture.
		var hookScript = modelObject.AddComponent("SpellAOE");		// Add the hook.js script to the object.
		hookScript.transform.rotation = this.transform.rotation;
		hookScript.transform.Rotate(0, 0, i*22.5);																																						// We can now refer to the object via this script.
		hookScript.transform.parent = this.transform.parent;	// Set the hook's parent object to be the hook folder.							
		hookScript.init(this.transform.position.x, this.transform.position.y, modelObject, this);	
		
	}
	
	yield WaitForSeconds(5); 
	coolSpell = false;

}
