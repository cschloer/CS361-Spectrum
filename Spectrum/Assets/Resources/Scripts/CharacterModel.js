var moveN:boolean;
var moveW:boolean;
var moveS:boolean;
var moveE:boolean;

var Manager:GameManager;

var rotateL:boolean;
var rotateR:boolean;

var moveSpeed:int;
var turnSpeed:int;

var blue:boolean;
var red:boolean;
var yellow:boolean;
var currentColor : Color;

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
var rollSpeedMultiplier : float;
var rollCooldown : float;
var jumpCooldown : float;
var jumpTime : float;
var jumpSpeedMultiplier : float;
var rollSound : AudioSource;
var jumpSound : AudioSource;
var landSound : AudioSource;
var cakeSound : AudioSource;

var shadow : GameObject;
var shadowOffset : float;

var coolSpellHook:boolean; // cooldown for spell
var coolSpellMine:boolean;
var coolSpellAOE:boolean;
var coolSpellWall:boolean;

var cameraShake:boolean;

var heroScale : float; //tracks size of hero in float form

var cakesCollected : int;

var boostRaRo:boolean; // a range boost that happens after a roll
var boostRaRoTimer:float;

var boostMeRo1:boolean; // booleans associated with combo meele attack
var boostMeRo2:boolean;
var boostMeRoTimer:float; // Timer used for each of the combos
var boostRoll:boolean; // increase roll

var isChargingBoom:boolean; // boomerang charging
var chargingBoomTimer:float;

// Use this for initialization
function Start () {
	cameraShake = false;
	cakesCollected = 0;
	isHook = false;
	moveSpeed = 5;
	turnSpeed = 1;
	blue = false;
	red = false;
	yellow = false;
	rolling = false;
	vincible = true;
	colorStore = Color(1,1,1);
	curentColor = Color(1, 1, 1);
	heading = Vector3.zero;
	rollTime = .25;
	rollSpeedMultiplier = 1.5;
	rollCooldown = .5;
	jumpCooldown = 1;
	jumpTime = .75;
	jumpSpeedMultiplier = .75;
	rollVector = Vector3.zero;
	heroScale = .75;
	rollSound = gameObject.AddComponent("AudioSource") as AudioSource;
	rollSound.clip = Resources.Load("Sounds/tumble");
	rollSound.volume = .5;
	jumpSound = gameObject.AddComponent("AudioSource") as AudioSource;
	jumpSound.clip = Resources.Load("Sounds/boing");
	landSound = gameObject.AddComponent("AudioSource") as AudioSource;
	landSound.clip = Resources.Load("Sounds/thump");
	cakeSound = gameObject.AddComponent("AudioSource") as AudioSource;
	cakeSound.clip = Resources.Load("Sounds/cake");
	character.modelObject.layer = 3;											// Character layer.
	
	shadow = GameObject.CreatePrimitive(PrimitiveType.Quad);
	//shadow.transform.parent=transform;
	//shadow.transform.localPosition = Vector3(0, 0, 0);						// Center the model on the parent.
	shadow.transform.parent = this.transform.parent;
	shadow.name = "Character Shadow";											// Name the object.
	shadow.renderer.material.mainTexture = Resources.Load("Textures/CharTemp", Texture2D);	// Set the texture.  Must be in Resources folder.
	shadow.renderer.material.color = Color.black;												// Set the color (easy way to tint things).
	shadow.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	shadow.collider.enabled = false;
	shadow.transform.localScale = Vector3.one;
	shadowOffset = 0;
	
	boostRaRo = false; // boost when a rolling ranged character rolls
	boostRaRoTimer = 0;
	
	boostMeRo1 = false;
	boostMeRo2 = false;
	boostMeRoTimer = 0;
	boostRoll = false;
	
	isChargingBoom = false;
	chargingBoomTimer = 0;
}

// Update is called once per frame
function Update () {
	boostMeRoTimer += Time.deltaTime;
	if (boostMeRoTimer > .75) boostMeRoClear(); // clear the boostMeRoTimer and values if the timer has gone off
	updateColor();
	transform.position.z = 0;
	rjTimer += Time.deltaTime;
	if (rolling){
		if (rjTimer >= rollTime) { // Amount of time for rolling
			boostRoll = false;
			rolling = false;
			if(!yellow) {
				if(boostRaRo) boostRaRoTimer=0;
				else boostRR(); // boost the ranged attack after a roll if ranged
			}
			//this.renderer.material.color = colorStore;	
			Manager.gameObject.GetComponentInChildren(CameraMovement).rolling = false;
			//moveSpeed = 2;
			Manager.gameObject.GetComponentInChildren(CameraMovement).speed = 2;
			rjTimer = 0;
		}
	 }
	if (jumping){
		shadowOffset = rjTimer * (jumpTime - rjTimer); //Sets shadow offset quadratically over the course of the jump
							
		if (rjTimer >= jumpTime) { // Amount of time for jumping
			jumping = false;
			//this.renderer.material.color = colorStore;	
			Manager.gameObject.GetComponentInChildren(CameraMovement).jumping = false;
			//modelObject.GetComponent(BoxCollider).isTrigger = false;
			modelObject.GetComponent(BoxCollider).center.z = modelObject.GetComponent(BoxCollider).center.z + 5;
			vincible = true;															// Makes player vincible again.
			character.modelObject.layer = 3;																// Set to character layer.
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
				//colorStore = this.renderer.material.color;
				//this.renderer.material.color = Color(.5,.5,.5);
				rolling = true;
				rjTimer = 0;													
				if (boostMeRo2) { 
					boostRoll = true;
					boostMeRoClear();	
				}
			}
			else if (blue && rjTimer >= jumpCooldown){ // jump because not blue
				// todo: jump animation
				jumpSound.Play();
				//colorStore = this.renderer.material.color;
				//this.renderer.material.color = Color(2,2,2);
				jumping = true;
				Manager.gameObject.GetComponentInChildren(CameraMovement).speed = jumpSpeedMultiplier * moveSpeed;
				Manager.gameObject.GetComponentInChildren(CameraMovement).jumping = true;
				rjTimer = 0;
				modelObject.GetComponent(BoxCollider).center.z = modelObject.GetComponent(BoxCollider).center.z - 5;
				vincible = false;													// Player invincible without passing through walls.
				character.modelObject.layer = 6;	// Allows player to jump through cliffs.
			}
		
		}
	}
	
	
	//Mouse input for boomerang charge
	if (Input.GetMouseButton(0) && !character.weapon.swinging && !character.weapon.recovering && !yellow && red){ // holding down
		if (!character.weapon.swinging && !character.weapon.recovering && !yellow && red && !isChargingBoom){
			isChargingBoom = true;
			character.weapon.vibrating = true;

		}
		else if (isChargingBoom){
			if (chargingBoomTimer <= 2) {
				chargingBoomTimer+=Time.deltaTime; 
				character.weapon.spriteRenderer.color = Color.white;
			}
			character.weapon.vibrateIntense(.05*chargingBoomTimer);
				
		}
	}
	else{
		if (isChargingBoom) {
			character.weapon.vibrating = false;
			character.weapon.toss(character.weapon.throwDistance/1.5*(chargingBoomTimer+1), character.weapon.throwTime, 1000, character.weapon.throwRecovery);
			chargingBoomTimer = 0;
			isChargingBoom = false;
		}
	
	
	}
	if(Input.GetMouseButtonDown(0) && !character.weapon.swinging && !character.weapon.recovering && yellow){
 			if(jumping){
 				if(!red){
 					character.weapon.spin(.5, .7, 110);
 				} else{
 					character.weapon.spin(1, 1, 110);
 				}
 			} else{

 		

 				if (!blue){ // if rolling, we can do a cool combo
 					boostMR();

 				}
 				else if(!red){
 					//swing(110, .3, .5);
 					character.weapon.swing(character.weapon.swingArc, character.weapon.swingTime, character.weapon.swingRecovery);
 				} else {
 					//swing(110, .5, 1);
 					character.weapon.swing(character.weapon.swingArc, character.weapon.swingTime, character.weapon.swingRecovery);
 				}
 			}
 		}
 	else if((Input.GetMouseButtonDown(0) || Input.GetKeyDown("up")) && !character.weapon.swinging && !character.weaponrecovering && !yellow){
 			//toss(4, .8, 1000, 1);
 			if (red) {
 				
 			}
 			else {
 				if (boostRaRo) character.weapon.toss(character.weapon.throwDistance*1.5, character.weapon.throwTime, 1000, character.weapon.throwRecovery);
 				else character.weapon.toss(character.weapon.throwDistance, character.weapon.throwTime, 1000, character.weapon.throwRecovery);
 			}
 		}
			
	if (!rolling){
		/* // uncomment to add rotation with a keyboard 
		if (rotateR) this.transform.Rotate(Vector3(0,0,Time.deltaTime*160*(turnSpeed)));
		if (rotateL) this.transform.Rotate(Vector3(0,0,-Time.deltaTime*160*(turnSpeed)));
		*/
		
		
		heading = Vector3.zero;
		/*if (moveN) heading += this.transform.left; // uncomment these to move in direction of rotation
		if (moveE) heading += this.transform.right;
		if (moveS) heading += this.transform.down;
		if (moveW) heading += this.transform.left;
		*/
		if (moveN) heading += Vector3(0, 1, 0);
		if (moveE) heading += Vector3(1, 0, 0);
		if (moveS) heading += Vector3(0, -1, 0);
		if (moveW) heading += Vector3(-1, 0, 0);
		heading.Normalize();
		if(jumping){
			//this.transform.Translate(heading * Time.deltaTime * moveSpeed*jumpSpeedMultiplier);
			this.transform.position += heading*Time.deltaTime*moveSpeed*jumpSpeedMultiplier;
		}else{
			//this.transform.Translate(heading*Time.deltaTime*moveSpeed);
			this.transform.position += heading*Time.deltaTime*moveSpeed;
		}
	
	}else{
		
		this.transform.position += 2*(heading * Time.deltaTime * moveSpeed*rollSpeedMultiplier);
	}
	//if(!cameraShake) Manager.gameObject.GetComponentInChildren(CameraMovement).gameObject.transform.position = Vector3(this.transform.position.x, this.transform.position.y, -10)+3*this.transform.up;
	//if(!cameraShake) Manager.gameObject.GetComponentInChildren(CameraMovement).gameObject.transform.position = Vector3(this.transform.position.x, this.transform.position.y, -10);
	//Manager.gameObject.GetComponentInChildren(CameraMovement).gameObject.transform.rotation = this.transform.rotation;
	//OnDrawGizmos();
	

	 var mouseScreenPosition = Input.mousePosition;   
     mouseScreenPosition.z = this.transform.position.z;
     var mouseWorldSpace = Camera.mainCamera.ScreenToWorldPoint(mouseScreenPosition);
     this.transform.LookAt(mouseWorldSpace, Camera.mainCamera.transform.forward);
     this.transform.eulerAngles =  Vector3(0,0,-this.transform.eulerAngles.z);
	
	Manager.gameObject.GetComponentInChildren(CameraMovement).doMovement();
	updateShadow(); //Position shadow and rescale hero for jumping
}

//Resize hero and position shadow for jumping
function updateShadow(){
	if(jumping) shadow.renderer.material.color.a = .6;
	else shadow.renderer.material.color.a = 0;
	shadow.transform.position = transform.position + Vector3.down * shadowOffset * 4; //Offsets shadow based on time in air (quadratically)
	shadow.transform.rotation = transform.rotation; //Rotates shadow to match hero
	shadow.transform.position.z = 0;
	transform.localScale = Vector3.one * heroScale * (1 + shadowOffset); //Scales hero quadratically as she jumps
	
	
}
function updateColor(){
	var multiplier : float = 1;
	currentColor = colorChoice();
	if (rolling) multiplier = .8;
	if(character.hurting) multiplier = .5;
	transform.renderer.material.color.r = (1+currentColor.r)/2;
	transform.renderer.material.color.g = (1+currentColor.g)/2;
	transform.renderer.material.color.b = (1+currentColor.b)/2;
}
	


function OnCollisionExit(collisionInfo : Collision){
	modelObject.GetComponent(Rigidbody).velocity = Vector3.zero;
}

function changeBlue(){
	if (blue){
		blue = false;
	}
	else{
		blue = true;
	}
	//print("Blue: " + blue);

}
function changeRed(){
	this.renderer.material.color = colorChoice();
	if (red){
		red = false; 
		toSmall();
		if (!yellow) character.weapon.toThrowingStar();
	}
	else {
		red = true;
		toBig();
		if (!yellow) character.weapon.toBoomerang(); // boomerang weapon!	
	}
	//print("Red: " + red);

}
function changeYellow(){
	if (yellow) {
		yellow = false;
		if (red)  character.weapon.toBoomerang(); // boomerang weapon!
		else character.weapon.toThrowingStar(); // stick weapon!
	}
	else {
	  yellow = true;
	  if (red) character.weapon.toStick(); // stick weapon!	
	  else character.weapon.toStick(); // stick weapon!
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
	//print(col.gameObject.name);
	if(col.gameObject.name.Contains("attack") && !character.hurting && vincible){
		character.hurt();
	}
	
	if(col.gameObject.name.Contains("Cake")){
		Destroy(col.gameObject);
		cakesCollected++;
		cakeSound.Play();
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
	else if (!yellow && blue) spellWall();
}

function spellHook(){ // hook spell, currently when meele
	if (coolSpellHook) return;
	coolSpellHook = true;
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the hook texture.
	var hookScript = modelObject.AddComponent("SpellHook");		// Add the hook.js script to the object.
	
																																							// We can now refer to the object via this script.
	hookScript.transform.parent = this.transform.parent;	// Set the hook's parent object to be the hook folder.							
	hookScript.init(this.transform.position.x, this.transform.position.y, modelObject, this);	
}

function spellMine(){	// mine spell, currently when ranged
	if (coolSpellMine) return;
	coolSpellMine = true;
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the mine texture.
	var mineScript = modelObject.AddComponent("SpellMine");		// Add the mine.js script to the object.
																																							// We can now refer to the object via this script.
	mineScript.transform.parent = this.transform.parent;	// Set the mine's parent object to be the mine folder.							
	mineScript.init(this.transform.position.x, this.transform.position.y, modelObject, this);	

}

function spellAOE(){
	if (coolSpellAOE) return;
	coolSpellAOE = true;
	for (var i=0; i < 8; i ++){
		var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the aoe texture.
		var aoeScript = modelObject.AddComponent("SpellAOE");		// Add the aoe.js script to the object.
		aoeScript.transform.rotation = this.transform.rotation;
		aoeScript.transform.Rotate(0, 0, i*45);																																						// We can now refer to the object via this script.
		aoeScript.transform.parent = this.transform.parent;	// Set the aoe's parent object to be the aoe folder.							
		aoeScript.init(this.transform.position.x, this.transform.position.y, modelObject, this);	
		
	}
	
	yield WaitForSeconds(5); 
	coolSpellAOE = false;

}

function spellWall(){
	if (coolSpellWall) return;
	coolSpellWall = true;
	var walls : Array;
	walls = new Array();
	var curRotate = this.transform.rotation;
	var curPosition = this.transform.position;
	for (var i=2; i < 50; i++){
	
		var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the wall texture.
		var wallScript = modelObject.AddComponent("SpellWall");		// Add the wall.js script to the object.
		wallScript.transform.rotation = curRotate;
																																						// We can now refer to the object via this script.
		wallScript.transform.parent = this.transform.parent;	// Set the wall's parent object to be the wall folder.	
		walls.Add(wallScript);	
		wallScript.init(curPosition.x, curPosition.y, modelObject, this, i);	
		yield WaitForSeconds(.01);
	}
	for (var j=0; j<walls.length; j++){
		walls[j].expand(2);
	
	}
	shakeCamera(2);

}

function toBig(){
	modelObject.GetComponent(BoxCollider).size = Vector3(.75,.75,5);
	var counter:float = 0;
	while (counter < 1){
		heroScale+=Time.deltaTime*3;
		counter+= Time.deltaTime*3;
		shadow.transform.localScale = Vector3.one * heroScale;
		yield;
	}
	heroScale-=(1-counter);
}


function toSmall(){
	modelObject.GetComponent(BoxCollider).size = Vector3(.375,.375,5);
	var counter:float = 0;
	while (counter < 1){
		heroScale-=Time.deltaTime*2;
		counter+= Time.deltaTime*2;
		shadow.transform.localScale = Vector3.one * heroScale;
		yield;
	}
	heroScale+=(1-counter);
}

function fallDeath(aim: Vector3){

	var counter:float = 0;
	while (counter < 2){
		transform.position = Vector3.MoveTowards(transform.position,aim,(heroScale+1)*Time.deltaTime);
		heroScale-=Time.deltaTime*2;
		counter+= Time.deltaTime*2;
		shadow.transform.localScale = Vector3.one * heroScale;
		yield;
	}
	//todo: respawn
	Manager.lose();
}

//Shakes the camera for the given duration with default intensity (.2)
function shakeCamera(duration:float){
	shakeCamera(duration, .2);
}
//Shakes the camera for the given intensity and duration.
function shakeCamera(duration:float, intensity:float){
	var timer:float = 0;
	cameraShake = true;
	while (timer < duration){
		Manager.gameObject.GetComponentInChildren(CameraMovement).doMovement();
		Manager.gameObject.GetComponentInChildren(CameraMovement).transform.Translate(Random.Range(-intensity, intensity),Random.Range(-intensity, intensity),0);
		timer+=Time.deltaTime;
		yield;
	}
	Manager.gameObject.GetComponentInChildren(CameraMovement).doMovement();
	cameraShake = false;
}

function boostRR(){
	if (character.weapon.swinging) return;
	boostRaRo = true;
	character.weapon.model.renderer.material.color = Color(.5,.5,.5); // light up the weapon
	yield WaitForSeconds(.5);
	if (!character.weapon.swinging) {
		character.weapon.model.renderer.material.color = Color(.8,.6,.6);
		}
	boostRaRo = false;
}

function boostMR(){
	boostMeRoTimer = 0;
 	if (!boostMeRo1){
 		boostMeRo1 = true;
 	
 		character.weapon.comboSwing(character.weapon.swingArc, character.weapon.swingTime*2, character.weapon.swingRecovery);
 			
 	}
 	else if (!boostMeRo2) boostMeRo2 = true;
 	else { // combo ended
 		boostMeRoClear();
 		boostMR();
 		
 	}
 
}

function boostMeRoClear(){ // sets all of the boostMeRo's to false, combo stops
	boostMeRo1 = false;
	boostMeRo2 = false;
	boostMeRoTimer = 0;


}


