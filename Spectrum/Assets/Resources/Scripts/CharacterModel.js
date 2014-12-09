// Character Code
// CAGE
// Final Build



// *******************************************
// 					 Globals
// *******************************************

// Movement
var temp : Vector3;
var moveN:boolean;
var moveW:boolean;
var moveS:boolean;
var moveE:boolean;
var rotateL:boolean;
var rotateR:boolean;
var moveSpeed:float;
var turnSpeed:int;
var heading : Vector3;
var lookDirection : Vector3;

// Colors
var blue:boolean;
var red:boolean;
var yellow:boolean;
var currentColor : Color;
var colorStore : Color;

// Character Data
var Manager:GameManager;
var character : Character;
var modelObject;
var shadow : GameObject;
var shadowOffset : float;
var heroScale : float; //tracks size of hero in float form
var cakesCollected : int;
var frozen : boolean;
var isPushed : boolean = false;

// Mechanics
var rolling:boolean;
var jumping:boolean;
var vincible:boolean;
var rjTimer:float;
var rollTime : float; 
var rollSpeedMultiplier : float;
var rollCooldown : float;
var jumpCooldown : float;
var jumpTime : float;
var jumpSpeedMultiplier : float;
var boostRaRo:boolean; // a range boost that happens after a roll
var boostRaRoTimer:float;
var comboSmall1:boolean; // booleans associated with combo meele attack
var comboSmall2:boolean;
var comboSmall3 : boolean;
var comboSmallTimer:float; // Timer used for each of the combos
var boostRoll:boolean; // increase roll
var isChargingBoom:boolean; // boomerang charging
var chargingBoomTimer:float;
var hasBoomBoosted:boolean; // boomerang boosted from a roll already during this charge
var rollThrowTimer : float = 0; // Timer for when rolling and shootin'
var lastAngle: int = 90; //Just for the rolling thingy
var abilityPrimed : boolean = false;
var monsterHere:boolean; // boolean for jumping on monsters heads, says whether a monster is currently being collided with

// Effects
var rollSound : AudioSource;
var jumpSound : AudioSource;
var landSound : AudioSource;
var cakeSound : AudioSource;
var primeSound : AudioSource;
var coolSpellHook:boolean; // cooldown for spell
var coolSpellMine:boolean;
var coolSpellAOE:boolean;
var coolSpellWall:boolean;
var cameraShake:boolean;


// *******************************************
// 				 Initialization
// *******************************************

function Start () {
	slowed = false;
	monsterHere = false;
	hasBoomBoosted = false;
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
	frozen = false;
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
	primeSound = gameObject.AddComponent("AudioSource") as AudioSource;
	primeSound.clip = Resources.Load("Sounds/metalShing");
	
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
	
	comboSmall1 = false;
	comboSmall2 = false;
	comboSmall3 = false;
	comboSmallTimer = 0;
	boostRoll = false;
	
	isChargingBoom = false;
	chargingBoomTimer = 0;
	

}

// *******************************************
// 					 Updates
// *******************************************

//This determines movement direction. ANY MODIFICATION OF HEADING MUST HAPPEN HERE. ANY READING OF HEADING MUST HAPPEN IN UPDATE.
function FixedUpdate(){
		heading = Vector3.zero;
		
		/*
		if (moveN) heading += this.transform.left; // uncomment these 4 lines to move in direction of rotation
		if (moveE) heading += this.transform.right;
		if (moveS) heading += this.transform.down;
		if (moveW) heading += this.transform.left;
		*/
		if (moveN) heading += Vector3(0, 1, 0);
		if (moveE) heading += Vector3(1, 0, 0);
		if (moveS) heading += Vector3(0, -1, 0);
		if (moveW) heading += Vector3(-1, 0, 0);
		heading.Normalize();
	}
	
	
function resetDeath(){
	slowed = false;
	monsterHere = false;
	hasBoomBoosted = false;
	cameraShake = false;
	isHook = false;
	moveSpeed = 5;
	turnSpeed = 1;
	rolling = false;
	vincible = true;
	frozen = false;
	
	boostRaRo = false; // boost when a rolling ranged character rolls
	boostRaRoTimer = 0;
	
	comboSmall1 = false;
	comboSmall2 = false;
	comboSmall3 = false;
	comboSmallTimer = 0;
	boostRoll = false;
	
	isChargingBoom = false;
	chargingBoomTimer = 0;


}

// Update is called once per frame
function Update () {
	
	if(Manager.paused){
		return;
	}
	

	comboSmallTimer += Time.deltaTime;
	if (comboSmallTimer > .75) comboSmallClear(); // clear the comboSmallTimer and values if the timer has gone off
	updateColor();
	character.anim.SetBool("Walking", false);
	transform.position.z = 0;
	rjTimer += Time.deltaTime;
	if (rolling){
		if (rjTimer >= rollTime) { // Amount of time for rolling
			comboSmall3 = false;

			boostRoll = false;
			rolling = false;
			if(!yellow) {
				if(boostRaRo) boostRaRoTimer=0;
				else boostRR(); // boost the ranged attack after a roll if ranged
			}
			//this.renderer.material.color = colorStore;	
			Manager.theCamera.GetComponent(CameraMovement).rolling = false;
			//moveSpeed = 2;
			Manager.theCamera.GetComponent(CameraMovement).speed = 2;
			rjTimer = 0;
		}
		if(character.weapon.clubSound.isPlaying){
			 character.weapon.clubCharging = true;
		}
		

		this.transform.position += 2*(heading * Time.deltaTime * moveSpeed*rollSpeedMultiplier);
	 } else {
	 //if not rolling
	 /* // uncomment to add rotation with a keyboard 
		if (rotateR) this.transform.Rotate(Vector3(0,0,Time.deltaTime*160*(turnSpeed)));
		if (rotateL) this.transform.Rotate(Vector3(0,0,-Time.deltaTime*160*(turnSpeed)));
		*/
		
		/* The following was moved to StartUpdate
		heading = Vector3.zero;
		
		
		if (moveN) heading += this.transform.left; // uncomment these 4 lines to move in direction of rotation
		if (moveE) heading += this.transform.right;
		if (moveS) heading += this.transform.down;
		if (moveW) heading += this.transform.left;
		
		if (moveN) heading += Vector3(0, 1, 0);
		if (moveE) heading += Vector3(1, 0, 0);
		if (moveS) heading += Vector3(0, -1, 0);
		if (moveW) heading += Vector3(-1, 0, 0);
		heading.Normalize();
		
		*/
		if(jumping){
			//this.transform.Translate(heading * Time.deltaTime * moveSpeed*jumpSpeedMultiplier);
			this.transform.position += heading*Time.deltaTime*moveSpeed*jumpSpeedMultiplier;
		}else{
			//this.transform.Translate(heading*Time.deltaTime*moveSpeed);
			this.transform.position += heading*Time.deltaTime*moveSpeed;
		}
		if(yellow&&!blue&&red) character.weapon.swinging = false;
	}
	
	if (jumping){
		shadowOffset = rjTimer * (jumpTime - rjTimer); //Sets shadow offset quadratically over the course of the jump
					
		if (rjTimer >= jumpTime) { // Amount of time for jumping
			character.modelObject.layer = 3;
			
			jumping = false;
			comboSmall3 = false;

			//this.renderer.material.color = colorStore;	
			Manager.theCamera.GetComponent(CameraMovement).jumping = false;
			//modelObject.GetComponent(BoxCollider).isTrigger = false;
			modelObject.GetComponent(BoxCollider).center.z = modelObject.GetComponent(BoxCollider).center.z + 5;
			vincible = true;															// Makes player vincible again.
			character.modelObject.layer = 3;																// Set to character layer.
			rjTimer = 0;
			landSound.Play();
			landing();
			/*-----------------------------------------------------------------
			
			This function shoots a star in the given direction. YAYYYY
			------------------------------------------------------------------
			*/
			
			//Small jumping throw ability
			var currentAngle : int;
			currentAngle = 0;
			if (!yellow && !red && !character.weapon.swinging && !character.weaponrecovering && abilityPrimed){
					while (!red && character.starsAvailable != 0) { // throw stars!!
	 					character.starsAvailable--;
	 					//character.throwingStars[character.curStar].canThrow = true;
	 					character.throwingStars[character.curStar].tossStar(character.weapon.throwDistance*3, character.weapon.throwTime, 1000, character.weapon.throwRecovery, currentAngle);
	 					//character.throwingStars[character.curStar].canThrow = true;
	 					character.curStar = (character.curStar+1)%character.numThrowingStars;
	 					if (character.starsAvailable > 0) { // make the next star avaiable
	 						//if (!character.throwingStars[character.curStar].canThrow) 
	 						character.throwingStars[character.curStar].starActive();
	 					}
	 					currentAngle = (currentAngle + 90) % 360;
	 					
	 				}
	 			
			}
			//big jumping swinging ability
			if (yellow && red && !character.weapon.swinging && !character.weaponrecovering && abilityPrimed){
					character.weapon.jumpClubSwing();
	 			
			}
			abilityPrimed = false;
			
			/*-----------------------------------------------------------------
			
			
			------------------------------------------------------------------
			*/
			
		}
	
	// Shoots out stars as you roll		
	} else if (rolling && !red && !blue && !yellow) {
		rollThrowTimer = rollThrowTimer + Time.deltaTime;
		if (rollThrowTimer > .05 ) {
			if (!red && character.starsAvailable != 0){
			character.starsAvailable--; 
	 		//character.throwingStars[character.curStar].canThrow = true;
	 		character.throwingStars[character.curStar].tossStar(character.weapon.throwDistance*3, character.weapon.throwTime, 1000, character.weapon.throwRecovery, lastAngle);
	 	 //	character.throwingStars[character.curStar].canThrow = true;
	 		character.curStar = (character.curStar+1)%character.numThrowingStars;
	 		if (character.starsAvailable > 0) { // make the next star avaiable
	 			if (!character.throwingStars[character.curStar].canThrow) character.throwingStars[character.curStar].starActive();
	 			}
	 			lastAngle = (lastAngle + 180);
	 			if (lastAngle >=360) {
	 				lastAngle = lastAngle - 360;
	 			}
	 		rollThrowTimer = 0;
	 		}
	 } 
		
	}
/*	if (Input.GetKeyUp("w")){
		 moveN = false;
		 Manager.theCamera.GetComponent(CameraMovement).moveN = false;
	}*/
	if (Input.GetKey("w")) {
		moveN = true;
		Manager.theCamera.GetComponent(CameraMovement).moveN = true;
	}	
	else moveN = false;
	/*if (Input.GetKeyUp("a")){
		moveW = false;
		Manager.theCamera.GetComponent(CameraMovement).moveW = false;	
	}*/
	if (Input.GetKey("a")){
		 moveW = true;
		 Manager.theCamera.GetComponent(CameraMovement).moveW = true;
		}
	else moveW = false;
	
	/*if (Input.GetKeyUp("s")){
		moveS = false;
		Manager.theCamera.GetComponent(CameraMovement).moveS = false;
	}*/
	if (Input.GetKey("s")) {
		moveS = true;
		Manager.theCamera.GetComponent(CameraMovement).moveS = true;
	}
	else moveS = false;	
	/*if (Input.GetKeyUp("d")) {
		moveE = false;
		Manager.theCamera.GetComponent(CameraMovement).moveE = false;
	}*/
	if (Input.GetKey("d")) {
		moveE = true;
		Manager.theCamera.GetComponent(CameraMovement).moveE = true;
	}
	else moveE = false;
	if (moveE || moveN || moveS || moveW) character.anim.SetBool("Walking", true);
	/*rotateL = false;
	rotateR = false;
	if (Input.GetAxis("Mouse X")>0){
    		rotateL = true;
			Manager.theCamera.GetComponent(CameraMovement).rotateL = true;
	}
	if (Input.GetAxis("Mouse X")<0){
    		rotateR = true;
			Manager.theCamera.GetComponent(CameraMovement).rotateR = true;
	}*/
	
	if (Input.GetKey("f")){
	
	//	castSpell();
	}
	if (Input.GetKeyDown("space")) {
		if (!jumping && !rolling && !character.weapon.clubSwinging) { 
			if (!blue && rjTimer >= rollCooldown){ // roll because not blue
				// todo: roll animation
				rollSound.Play();
				//colorStore = this.renderer.material.color;
				//this.renderer.material.color = Color(.5,.5,.5);
				rolling = true;
				character.anim.SetTrigger("Roll");
				rjTimer = 0;
				if (red) rollKnock();
				if (red && !yellow && !hasBoomBoosted) { // big
					hasBoomBoosted = true;
					chargingBoomTimer += 1;
					rollBoomBonus(1);																									
				}																						
				if (comboSmall2) { 
					comboSmall3 = true;
					character.weapon.pauseSwing(-70, character.weapon.swingTime/2, character.weapon.swingRecovery, rollTime);
					character.weaponDual.pauseSwing(70,  character.weapon.swingTime/2, character.weapon.swingRecovery, rollTime);
					boostRoll = true;
					comboSmallClear();	
				}
			}
			else if (blue && rjTimer >= jumpCooldown){ // jump because blue
				if (comboSmall2){
					comboSmall3 = true;

					character.weapon.spin(.5, .7, 110);
					character.weaponDual.spin(.5, .7, 110);
				
				}
				// todo: jump animation
				jumpSound.Play();
				
				
				//colorStore = this.renderer.material.color;
				//this.renderer.material.color = Color(2,2,2);
				jumping = true;
				character.anim.SetTrigger("Jump");
				Manager.theCamera.GetComponent(CameraMovement).speed = jumpSpeedMultiplier * moveSpeed;
				Manager.theCamera.GetComponent(CameraMovement).jumping = true;
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
				//character.weapon.spriteRenderer.color = Color.black;
			}
			character.weapon.vibrateIntense(.05*chargingBoomTimer);
				
		}
	}
	else{
		if (isChargingBoom) {
			character.weapon.vibrating = false;
			character.weapon.tossBoomerang(character.weapon.throwDistance/1.5*(chargingBoomTimer+1), character.weapon.throwTime, 1000, character.weapon.throwRecovery, this.transform.up, true, chargingBoomTimer);
			chargingBoomTimer = 0;
			isChargingBoom = false;
			hasBoomBoosted = false;
		}
	
	
	}
	if(Input.GetMouseButtonDown(0) && !character.weapon.swinging && !character.weapon.recovering && yellow){
 			/*if(jumping){
 				if(!red){
 					character.weapon.spin(.5, .7, 110);
 				} else{
 					character.weapon.spin(1, 1, 110);
 				}
 			} else{
*/
 		

 				if (!red){ // if small, we can do a cool combo
 					comboSM();

 				} else {
 					//swing(110, .5, 1);
 					if(jumping){
 				 		abilityPrimed = true; //Arm landing ability
 				 		character.weapon.jumpClubReady();
 					}else{ //If on ground, swing club!
 						character.weapon.clubSwing(character.weapon.swingArc*.45, character.weapon.swingTime, character.weapon.swingRecovery*3);
 					}
 				}
 			}
 		
 	else if((Input.GetMouseButtonDown(0) || Input.GetKeyDown("up")) && !character.weapon.swinging && !character.weaponrecovering && !yellow){
 			
 			if (!red && character.starsAvailable != 0 && !jumping) { // throw stars!!
 				character.starsAvailable--;
 				character.throwingStars[character.curStar].tossStar(character.weapon.throwDistance*3, character.weapon.throwTime, 1000, character.weapon.throwRecovery, 0);
 				character.curStar = (character.curStar+1)%character.numThrowingStars;
 			}
 			if(jumping){
 				 abilityPrimed = true; //Arm landing ability
 				 primeSound.Play();
 				}
 			if (character.starsAvailable > 0) { // make the next star avaiable
 				if (!character.throwingStars[character.curStar].canThrow) character.throwingStars[character.curStar].starActive();
 			}
 		}
			
	
	//if(!cameraShake) Manager.theCamera.GetComponent(CameraMovement).gameObject.transform.position = Vector3(this.transform.position.x, this.transform.position.y, -10)+3*this.transform.up;
	//if(!cameraShake) Manager.theCamera.GetComponent(CameraMovement).gameObject.transform.position = Vector3(this.transform.position.x, this.transform.position.y, -10);
	//Manager.theCamera.GetComponent(CameraMovement).gameObject.transform.rotation = this.transform.rotation;
	//OnDrawGizmos();
	
	//Camera.mainCamera.transform.localPosition = Vector3(0, 0, -10);
	
    
	
	Manager.theCamera.GetComponent(CameraMovement).doMovement();
	
	var mouseWorldSpace = Manager.theCamera.GetComponent(CameraMovement).mouseWorldSpace;
    this.transform.LookAt(mouseWorldSpace, Vector3.forward);
    this.transform.eulerAngles =  Vector3(0,0,-this.transform.eulerAngles.z);
    mouseWorldSpace.z = 0;
    temp = mouseWorldSpace;
	lookDirection = mouseWorldSpace - transform.position;
	lookDirection.z = 0;
	lookDirection.Normalize();
	
	
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
	
	
// *******************************************
// 				Change Functions
// *******************************************

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
		if (!yellow){ // throwing star!
			character.activateStars();
		}
		else { // meele
			character.activateDual(); // activate dual weilding!
		
		}
	}
	else {
		red = true;
		toBig();

		if (!yellow){	
			character.activateBoomerang(); // boomerang weapon!
		}
		else {
			character.activateHammer();
		}
	}
	//print("Red: " + red);

}
function changeYellow(){
	if (yellow) {
		yellow = false;
		if (red){
			character.activateBoomerang();
		}
		else {
			character.activateStars(); // star!
		}
	}
	else {
		yellow = true;
		if (red) character.activateHammer(); // stick weapon!	
		else character.activateDual(); // stick weapon!
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


function stopMovement(){
	rotateR = false;
	Manager.theCamera.GetComponent(CameraMovement).rotateR = false;
	rotateL = false;
	Manager.theCamera.GetComponent(CameraMovement).rotateL = false;
	
	moveE = false;
	Manager.theCamera.GetComponent(CameraMovement).moveE = false;
	moveW = false;
	Manager.theCamera.GetComponent(CameraMovement).moveW = false;	
	moveS = false;
	Manager.theCamera.GetComponent(CameraMovement).moveS = false;
	moveN = false;
	Manager.theCamera.GetComponent(CameraMovement).moveN = false;
	
	//todo: stop moving animation
}

// *******************************************
// 					Collisions
// *******************************************

function handleCollisions(col:Collider){
	//
	
	//print(col.isTrigger);
	if(rolling){
		 heading = Vector3.zero;
		 rjTimer = 0;
		 rolling = false;
	}
	
	var headingMod : Vector3 = 2*(heading * Time.deltaTime * moveSpeed*rollSpeedMultiplier);
	var xDist : float = transform.position.x - col.gameObject.transform.position.x;
	var yDist : float = transform.position.y - col.gameObject.transform.position.y;
	var xBuffer : float = (gameObject.GetComponent(BoxCollider).size.x + col.gameObject.GetComponent(BoxCollider).size.x)/2;
	var yBuffer : float = (gameObject.GetComponent(BoxCollider).size.y + col.gameObject.GetComponent(BoxCollider).size.y)/2;
	if((Mathf.Abs(yDist) > Mathf.Abs(xDist)) && ((heading.y > 0 && yDist < 0) || (heading.y < 0 && yDist > 0))) heading.y =0;
	if((Mathf.Abs(xDist) > Mathf.Abs(yDist)+.2) && ((heading.x > 0 && xDist < 0) || (heading.x < 0 && xDist > 0))) heading.x = 0;
	
	/*
	var buffer : float = .2;
	var boxSize : Vector3 = gameObject.GetComponent(BoxCollider).size;
	var xRect : Rect = new Rect(transform.position.x + headingMod.x, transform.position.y, boxSize.x, boxSize.y);
	var yRect : Rect = new Rect(transform.position.x, transform.position.y + headingMod.y, boxSize.x, boxSize.y);
	var posRect : Rect = new Rect(transform.position.x, transform.position.y, boxSize.x, boxSize.y);
	var colRect : Rect = new Rect(col.gameObject.transform.position.x + buffer, col.gameObject.transform.position.y + buffer, col.size.x - 2*buffer ,col.size.y - 2*buffer);
	if(xRect.Overlaps(colRect)) heading.x = 0;
	else if(yRect.Overlaps(colRect)) heading.y = 0;
	else if(totalRect.Overlaps(colRect)) heading = Vector3.zero;
	*/
	
	heading.Normalize();
} 

function OnTriggerEnter(col:Collider){
	//print(col.gameObject.name);
	/*
	if(col.gameObject.name.Contains("Tile Wall")){
		handleCollisions(col);
	}
	*/
	
	if(col.gameObject.name.Contains("attack") && !character.hurting && vincible){
		if (col.gameObject.GetComponent("MonsterAttack").slow){
			slowMe(col.gameObject.GetComponent("MonsterAttack").slowDuration, col.gameObject.GetComponent("MonsterAttack").slowAmount);
		 } 
		 else if (!col.gameObject.GetComponent("MonsterAttack").safe) character.hurt();
	}
	
	if (col.gameObject.name.Contains("TentacleArm") && !character.hurting && vincible){
		electrocute();
	
	}
	
	if (col.gameObject.name.Contains("Mine") && !character.hurting && vincible){
		if (col.gameObject.GetComponent("SpellMine").destroying)
			character.hurt();
	
	}
	if (col.gameObject.name.Contains("Explode") && !character.hurting && vincible){
		if (col.gameObject.GetComponent("Explosion").destroying)
		character.hurt();
	
	}
	
	if(col.gameObject.name.Contains("Cake")){
		Manager.charSpawner.modelObject.GetComponent("SpawnPointModel").relocate(col.gameObject.transform.position);
		Destroy(col.gameObject);
		cakesCollected++;
		cakeSound.Play();
	}

}
/*
function OnTriggerStay(col:Collider){
	if(col.gameObject.name.Contains("Tile Wall")){
		handleCollisions(col);

	}
}
*/
function OnCollisionStay(col:Collision){
	if(col.gameObject.name.Contains("Monster")){
		monsterHere = true;
	}
	
	
	
	
	if(col.gameObject.name.Contains("Tile Wall")){
		//col.gameObject.GetComponent(BoxCollider).isTrigger = true;
		handleCollisions(col.collider);
		modelObject.GetComponent(Rigidbody).velocity = Vector3.zero;

		
	}

}
function OnCollisionEnter(col:Collision){
	if(col.gameObject.name.Contains("Tile Wall")){
		//col.gameObject.GetComponent(BoxCollider).isTrigger = true;
		handleCollisions(col.collider);
	}	
	modelObject.GetComponent(Rigidbody).velocity = Vector3.zero;

}

function OnCollisionExit(col:Collision){
	if(col.gameObject.name.Contains("Monster")){
		monsterHere = false;
	}	
	modelObject.GetComponent(Rigidbody).velocity = Vector3.zero;

}


function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.green;
		Gizmos.DrawWireCube (transform.position, Vector3(.1, .1, .1));
	//	Gizmos.DrawWireCube (Vector3(temp.x, temp.y, temp.z), Vector3(.1, .1, .1));

		/*
		Gizmos.color = Color.green;
 		Gizmos.DrawWireCube(Vector3(totalRect.left, totalRect.top, 1), Vector3(totalRect.width, totalRect.height, 1));
 		Gizmos.DrawWireCube(Vector3(colRect.left, colRect.top, 1), Vector3(colRect.width, colRect.height, 1));
 		*/
	
}


// *******************************************
// 			  Mechanics Functions
// *******************************************

function rollKnock(){ // knock back for roll
	var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the landing texture.
	var landingScript = modelObject2.AddComponent("Landing");		// Add the landing.js script to the object.
		
																																								// We can now refer to the object via this script.
			
	landingScript.init(this.transform.position.x, this.transform.position.y, modelObject2, 1, rollTime);
	landingScript.gameObject.transform.parent = this.gameObject.transform;	// Set the landing's parent object to be the landing folder.							


}

function landing(){
	if (red){
		var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the landing texture.
		var landingScript = modelObject2.AddComponent("Landing");		// Add the landing.js script to the object.
		
																																								// We can now refer to the object via this script.
			
		landingScript.init(this.transform.position.x, this.transform.position.y, modelObject2, 2, .2);
		landingScript.gameObject.transform.parent = this.transform.parent.transform;	// Set the landing's parent object to be the landing folder.							
	}			
	else {
		if (monsterHere){
			// Jump on head code
			
			/*if (comboSmall2){
				comboSmall3 = true;

				character.weapon.spin(.5, .7, 110);
				character.weaponDual.spin(.5, .7, 110);
			
			}
			// todo: jump animation
			jumpSound.Play();
			
			
			//colorStore = this.renderer.material.color;
			//this.renderer.material.color = Color(2,2,2);
			jumping = true;
			Manager.theCamera.GetComponent(CameraMovement).speed = jumpSpeedMultiplier * moveSpeed;
			Manager.theCamera.GetComponent(CameraMovement).jumping = true;
			rjTimer = 0;

			modelObject.GetComponent(BoxCollider).center.z = modelObject.GetComponent(BoxCollider).center.z - 5;
			vincible = false;													// Player invincible without passing through walls.
			character.modelObject.layer = 6;	// Allows player to jump through cliffs.
			*/
				
		
		
		}
	
	}
	
	
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
	var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the hook texture.
	var hookScript = modelObject2.AddComponent("SpellHook");		// Add the hook.js script to the object.
	
																																							// We can now refer to the object via this script.
	hookScript.transform.parent = this.transform.parent;	// Set the hook's parent object to be the hook folder.							
	hookScript.init(this.transform.position.x, this.transform.position.y, modelObject2, this);	
}

function spellMine(){	// mine spell, currently when ranged
	if (coolSpellMine) return;
	coolSpellMine = true;
	var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the mine texture.
	var mineScript = modelObject2.AddComponent("SpellMine");		// Add the mine.js script to the object.
																																							// We can now refer to the object via this script.
	mineScript.transform.parent = this.transform.parent;	// Set the mine's parent object to be the mine folder.							
	mineScript.init(this.transform.position.x, this.transform.position.y, modelObject2, this, 10);	

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
	
		var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the wall texture.
		var wallScript = modelObject2.AddComponent("SpellWall");		// Add the wall.js script to the object.
		wallScript.transform.rotation = curRotate;
																																						// We can now refer to the object via this script.
		wallScript.transform.parent = this.transform.parent;	// Set the wall's parent object to be the wall folder.	
		walls.Add(wallScript);	
		wallScript.init(curPosition.x, curPosition.y, modelObject2, this, i);	
		yield WaitForSeconds(.01);
	}
	for (var j=0; j<walls.length; j++){
		walls[j].expand(2);
	
	}
	shakeCamera(2);

}

function toBig(){
	//modelObject.GetComponent(BoxCollider).size = Vector3(.55,.55,5);
	modelObject.GetComponent(BoxCollider).size = Vector3(.15,.15,5); //These are so small but they work. I don't understand. -Evan
	var counter:float = 0;
	while (counter < 1){
		heroScale+=Time.deltaTime*1.5;
		counter+= Time.deltaTime*1.5;
		shadow.transform.localScale = Vector3.one * heroScale;
		yield;
	}
	heroScale-=(1-counter);
}


function toSmall(){
	//modelObject.GetComponent(BoxCollider).size = Vector3(.375,.375,5);
	modelObject.GetComponent(BoxCollider).size = Vector3(.475,.475,5);
	var counter:float = 0;
	while (counter < 1){
		heroScale-=Time.deltaTime*1.5;
		counter+= Time.deltaTime*1.5;
		shadow.transform.localScale = Vector3.one * heroScale;
		yield;
	}
	heroScale+=(1-counter);
}

function fallDeath(aim: Vector3){

	var counter:float = 0;
	while (counter < 1){
		transform.position = Vector3.MoveTowards(transform.position,aim,(heroScale+1)*Time.deltaTime*5);
		frozen = true;
		//heroScale-=Time.deltaTime*.5;
		counter+= Time.deltaTime;
		//shadow.transform.localScale = Vector3.one * heroScale;
		yield;
	}
	//todo: respawn
	character.dead = true;
	Manager.death();
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
		Manager.theCamera.GetComponent(CameraMovement).doMovement();
		Manager.theCamera.GetComponent(CameraMovement).transform.Translate(Random.Range(-intensity, intensity),Random.Range(-intensity, intensity),0);
		timer+=Time.deltaTime;
		yield;
	}
	Manager.theCamera.GetComponent(CameraMovement).doMovement();
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

function comboSM(){ // combo for small
	comboSmallTimer = 0;
	comboSmall3 = false;

 	if (!comboSmall1 && !comboSmall2){
 		comboSmall1 = true;
 		character.weapon.dualSwing(3*character.weapon.swingArc/4, character.weapon.swingTime, character.weapon.swingRecovery/2);
 		
 	}
 	else if (!comboSmall2) {
 		comboSmall2 = true;
 		character.lunge();
 		character.weaponDual.dualSwing(-3*character.weapon.swingArc/4, character.weapon.swingTime, character.weapon.swingRecovery/2);	
 	}
 	else { // combo ended
 		if (comboSmall1) {
 			character.weapon.dualSwing(3*character.weapon.swingArc/4, character.weapon.swingTime, character.weapon.swingRecovery/2);
 			comboSmall1 = false;	
 		}
 		else {
 			character.weaponDual.dualSwing(-3*character.weapon.swingArc/4, character.weapon.swingTime, character.weapon.swingRecovery/2);	
 			comboSmall1 = true;
 			character.lunge();
 		}
 		
 	}
 
}

function comboSmallClear(){ // sets all of the comboSmall's to false, combo stops
	comboSmall1 = false;
	comboSmall2 = false;
	comboSmallTimer = 0;


}

function rollBoomBonus(duration:float){  // a timer that sets the boomerang boosting timer back to 0 if you don't start charging
	var timer:float = 0;
	while (timer < duration){
		if (isChargingBoom) return;
		timer += Time.deltaTime;
		yield;
	}
	chargingBoomTimer -= 1;
	hasBoomBoosted = false;

}

function landingStar(){
	yield;
		if (!yellow && !red && !character.weapon.swinging && !character.weaponrecovering){
				
					if (!red && character.starsAvailable != 0) { // throw stars!!
						
	 					character.starsAvailable--;
	 					//character.throwingStars[character.curStar].canThrow = true;
	 					character.throwingStars[character.curStar].tossStar(character.weapon.throwDistance*3, character.weapon.throwTime, 1000, character.weapon.throwRecovery,0);
	 					character.throwingStars[character.curStar].canThrow = true;
	 					character.curStar = (character.curStar+1)%character.numThrowingStars;
	 					if (character.starsAvailable > 0) { // make the next star avaiable
	 						if (!character.throwingStars[character.curStar].canThrow) character.throwingStars[character.curStar].starActive();
	 					}
	 				}
	 			
	}
}


function electrocute(){ // electrocute player
	character.hurt();
	var temp:Color = this.renderer.material.color;
	var timer:float = 0;
	while (timer < .5){
		if (this.renderer.material.color == Color.white) this.renderer.material.color = Color.black;
		else if (this.renderer.material.color == Color.black) this.renderer.material.color = Color.white;
		else {
			temp = this.renderer.material.color;
			this.renderer.material.color = Color.white;
		}
		yield;
		timer+=Time.deltaTime;
		yield;
		timer+=Time.deltaTime;
		yield;
		timer+=Time.deltaTime;
	
	}
	this.renderer.material.color = Color.white;
	yield WaitForSeconds(.1);
	this.renderer.material.color = temp;

}

function slowMe(duration:float, amount:float){ // slow that stacks
	if (moveSpeed <.5) return;
	moveSpeed /= amount;
	yield WaitForSeconds(duration);
	moveSpeed *= amount;
	

}
