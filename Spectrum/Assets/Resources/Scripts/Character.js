var model : CharacterModel;
var weapon : Weapon;
var weaponDual : Weapon; // dual wield weapon for small meele
var hurtRecovery : float;
var hurting : boolean;
var health : int;
var dead : boolean;
var modelObject : GameObject;
var oofSound : AudioSource;
var killedMonsters : int;
var manager:GameManager;
var throwingStars:Array;
var numThrowingStars:int; 
var curStar:int; // current star to throw
var starsAvailable:int;
var isThrowingStar:boolean;
var starTimer:float;
var starCool:int; // cooldown on stars
var anim : Animator;
var sprend : SpriteRenderer;

function init(m) {
	manager = m;
	health = 3; //For testing purposes
	hurtRecovery = .5;
	enabled = false;
	dead = false;
	modelObject = GameObject(); //.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the gem texture.
	model = modelObject.AddComponent("CharacterModel");						// Add a gemModel script to control visuals of the gem.
	//gemType = 1;
	//modelObject.collider.enabled = false;
	modelObject.AddComponent(BoxCollider);
	modelObject.GetComponent(BoxCollider).name = "Box1";
	modelObject.GetComponent(BoxCollider).isTrigger = false;
	modelObject.GetComponent(BoxCollider).size = Vector3(.375,.375,5);
	modelObject.AddComponent(Rigidbody);
	//modelObject.GetComponent(Rigidbody).collisionDetectionMode = CollisionDetectionMode.Continuous; 
	//modelObject.GetComponent(Rigidbody).interpolation = RigidbodyInterpolation.Interpolate;
	//modelObject.GetComponent(Rigidbody).collisionDetectionMode = CollisionDetectionMode.Continuous;
	modelObject.GetComponent(Rigidbody).isKinematic = false;
	modelObject.GetComponent(Rigidbody).useGravity = false;
	//modelObject.GetComponent(Rigidbody).inertiaTensor = Vector3(.5, .5, 1);
	modelObject.GetComponent(Rigidbody).freezeRotation = true;

	manager.addWeapon(this); // add weapon
		
	model.character = this;			
	model.transform.parent = transform;									// Set the model's parent to the gem (this object).
	model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
	model.name = "Character Model";											// Name the object.
	anim = modelObject.AddComponent("Animator");
	sprend = modelObject.AddComponent("SpriteRenderer");
	anim.runtimeAnimatorController = Resources.Load("Animations/Huey");
	//model.renderer.material.mainTexture = Resources.Load("Textures/CharTemp", Texture2D);	// Set the texture.  Must be in Resources folder.
	//model.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	//model.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency
	model.Manager = m;
	model.modelObject = modelObject;
	enabled = true;
	checkHealth();
	oofSound = gameObject.AddComponent("AudioSource") as AudioSource;
	oofSound.clip = Resources.Load("Sounds/oof");
	killedMonsters = 0;
	
	throwingStars = new Array();
	numThrowingStars = 4;
	starsAvailable = numThrowingStars;
	starTimer = 0;
	
	for (var i=0; i < numThrowingStars; i++){
		var weaponObject = new GameObject();
		var weaponScript = weaponObject.AddComponent("Weapon");
	
		weaponScript.transform.position = this.transform.position;
		weaponScript.init(this);
		weaponScript.name = 'ThrowingStar ' + (i+1);
		weaponScript.model.name = 'ThrowingStar ' + (i+1) + ' WeaponObject';
		weaponScript.toThrowingStar();
		weaponScript.model.active = false;
		weaponScript.active = false;
		//weaponScript.gameObject.renderer.active = false;
		throwingStars.Add(weaponScript);
	
	}
	curStar = 0;
	isThrowingStar = false;
	starCool = 1;
	
	var weaponObject2 = new GameObject();
	var weaponScript2 = weaponObject2.AddComponent("Weapon");
	
	weaponScript2.transform.position = this.transform.position;
	weaponScript2.init(this);
	weaponScript2.name = 'Dual Sword';
	weaponScript2.model.name = 'DualSword' + ' WeaponObject' ;
	weaponScript2.baseRotation.z = 55;
	weaponScript2.isDual = true;
	//weaponScript.model.active = false;
	//weaponScript.active = false;	
	weaponDual = weaponScript2;
	
	activateStars(); // function to start out with stars
	
	
	
}


function Update(){


	if (starTimer > starCool && starsAvailable < numThrowingStars){
		starsAvailable++;
		starTimer = 0;
		for (var j:int = 0; j<numThrowingStars; j++){ 
			if (!throwingStars[(curStar+j)%numThrowingStars].canThrow){
				throwingStars[(curStar+j)%numThrowingStars].starActive();		
				break;
			}
		}
	}
	if (starsAvailable < numThrowingStars) starTimer+=Time.deltaTime;
	
}

public function hurt(){
		oofSound.Play();
		//manager.playSound(offSound, transform.position);
		health--;
		hurting = true;
		var before = model.renderer.material.color;
		model.renderer.material.color = Color(.5,.5,.5);
		model.shakeCamera(.5, .1);
		var t : float = hurtRecovery;
		while (t > 0){
			t -= Time.deltaTime;
			yield;
		}
		checkHealth();
		hurting = false;
		model.renderer.material.color = before;
		

	}

function setWeapon(w : Weapon){
	weapon = w;
}

function lunge(){ // lunge forward , used to attack
	var timer:float = 0;
	while (timer < .1){
		model.transform.position += model.transform.up/7;
		//if(!model.cameraShake) manager.gameObject.GetComponentInChildren(CameraMovement).gameObject.transform.position =
		 //Vector3(model.transform.position.x, model.transform.position.y, -10)+3*model.transform.up;
		// if(!model.cameraShake) manager.gameObject.GetComponentInChildren(CameraMovement).gameObject.transform.position =
		// Vector3(model.transform.position.x, model.transform.position.y, -10);
		timer+= Time.deltaTime;
		yield;
	}

}
function checkHealth(){
	if (health > 0 ) return;
	var t : float = 0;
	while (t < 2){
		t += Time.deltaTime;
		model.renderer.material.color.a = 1-(t/2);
		weapon.model.renderer.material.color.a = 1-(t/2);
		yield;
	}
	dead = true;
	manager.death();	//respawn
}

function deactivateStars(){ // functions to set all of the shurekins as inactive
	for (var i=0; i < numThrowingStars; i++){
		throwingStars[i].active = false;
		throwingStars[i].model.active = false;
	
	}
	weapon.active = true;
	weapon.model.active = true;
	weapon.resetPosition();
	swinging = false;
	weapon.model.transform.position = weapon.owner.model.transform.position;
	weapon.model.transform.parent = weapon.owner.model.transform;
	weapon.model.transform.localEulerAngles = weapon.baseRotation;
 	weapon.model.transform.localPosition = weapon.basePosition;
 	weapon.model.transform.localScale = Vector3.one;
 	weapon.canThrow = true;

}

function activateBoomerang(){
	deactivateAll();
	weapon.cube.transform.localPosition = Vector3(-.1, 0.4, 0);
	weapon.active = true;
	weapon.isBoomerang = true;
	weapon.model.active = true;
	weapon.model.transform.position = weapon.owner.model.transform.position;
	weapon.model.transform.parent = weapon.owner.model.transform;
	weapon.model.transform.localEulerAngles = weapon.baseRotation;
 	weapon.model.transform.localPosition = weapon.basePosition;
 	weapon.model.transform.localScale = Vector3.one;
 	weapon.canThrow = true;
 	weapon.resetPosition();
	weapon.toBoomerang(); // boomerang weapon!

}

function activateStars(){
	deactivateAll();
	for (var i=0; i < numThrowingStars; i++){
		throwingStars[i].active = true;
		throwingStars[i].model.active = true;
		throwingStars[i].resetPosition();
		throwingStars[i].starActive();
	
	}
	isThrowingStar = true;

}

function deactivateAll(){
	weapon.cube.transform.localPosition = Vector3(0.1, 0.7, 0);
	weapon.active = false;
	weapon.isBoomerang = false;
	weapon.model.active = false;
	for (var i=0; i < numThrowingStars; i++){
		throwingStars[i].active = false;
		throwingStars[i].model.active = false;
		throwingStars[i].cube.transform.localPosition = Vector3(0.1, 0.7, 0);
	}
	weapon.isMeele = false;
	isThrowingStar = false;
	weaponDual.active = false;
	weaponDual.model.active = false;

}

function activateDual(){
	deactivateAll();
	weapon.active = true;
	weapon.model.active = true;
	weapon.model.transform.position = weapon.owner.model.transform.position;
	weapon.model.transform.parent = weapon.owner.model.transform;
	weapon.model.transform.localEulerAngles = weapon.baseRotation;
 	weapon.model.transform.localPosition = weapon.basePosition;
 	weapon.model.transform.localScale = Vector3.one;
 	weapon.canThrow = true;
 	weapon.resetPosition();
	weapon.isMeele = true;
	weapon.toStick();
	weaponDual.active = true;
	weaponDual.model.active = true;
	weaponDual.model.transform.position = weaponDual.owner.model.transform.position;
	weaponDual.model.transform.parent = weaponDual.owner.model.transform;
	weaponDual.model.transform.localEulerAngles = weaponDual.baseRotation;
 	weaponDual.model.transform.localPosition = weaponDual.basePosition;
 	weaponDual.model.transform.localScale = Vector3.one;
 	weaponDual.canThrow = true;
 	weaponDual.resetPosition();
	weaponDual.toStick2();
	weaponDual.isMeele = true;

}

function activateHammer(){
	deactivateAll();
	weapon.active = true;
	weapon.model.active = true;
	weapon.model.transform.position = weapon.owner.model.transform.position;
	weapon.model.transform.parent = weapon.owner.model.transform;
	weapon.model.transform.localEulerAngles = weapon.baseRotation;
 	weapon.model.transform.localPosition = weapon.basePosition;
 	weapon.model.transform.localScale = Vector3.one;
 	weapon.canThrow = true;
 	weapon.resetPosition();
	weapon.toHammer();

}

