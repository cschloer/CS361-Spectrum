var model : CharacterModel;
var weapon : Weapon;
var hurtRecovery : float;
var hurting : boolean;
var health : int;
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


function init(m) {
	manager = m;
	health = 3; //For testing purposes
	hurtRecovery = .5;
	enabled = false;
	modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the gem texture.
	model = modelObject.AddComponent("CharacterModel");						// Add a gemModel script to control visuals of the gem.
	//gemType = 1;
	modelObject.collider.enabled = false;
	modelObject.AddComponent(BoxCollider);
	modelObject.GetComponent(BoxCollider).name = "Box1";
	modelObject.GetComponent(BoxCollider).isTrigger = false;
	modelObject.GetComponent(BoxCollider).size = Vector3(.375,.375,5);
	modelObject.AddComponent(Rigidbody);
	//modelObject.GetComponent(Rigidbody).collisionDetectionMode = CollisionDetectionMode.Continuous; 
	//modelObject.GetComponent(Rigidbody).interpolation = RigidbodyInterpolation.Interpolate;
	modelObject.GetComponent(Rigidbody).isKinematic = false;
	modelObject.GetComponent(Rigidbody).useGravity = false;
	modelObject.GetComponent(Rigidbody).inertiaTensor = Vector3(.5, .5, 1);
	modelObject.GetComponent(Rigidbody).freezeRotation = true;
	modelObject.AddComponent(Animation);

	manager.addWeapon(this); // add weapon
		
	model.character = this;			
	model.transform.parent = transform;									// Set the model's parent to the gem (this object).
	model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
	model.name = "Character Model";											// Name the object.
	model.renderer.material.mainTexture = Resources.Load("Textures/CharTemp", Texture2D);	// Set the texture.  Must be in Resources folder.
	model.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	model.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency
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
		weaponScript.toThrowingStar();
		weaponScript.model.active = false;
		weaponScript.active = false;
		//weaponScript.gameObject.renderer.active = false;
		throwingStars.Add(weaponScript);
	
	}
	curStar = 0;
	isThrowingStar = false;
	starCool = 1;
	
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
	starTimer+=Time.deltaTime;
	
}

public function hurt(){
		oofSound.Play();
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
	while(health > 0){
		yield WaitForSeconds(.5);
	}
	var t : float = 0;
	while (t < 2){
		t += Time.deltaTime;
		model.renderer.material.color.a = 1-(t/2);
		weapon.model.renderer.material.color.a = 1-(t/2);
		yield;
	}
	//Application.LoadLevel("Spectrum");
	//todo: respawn
	manager.lose();
}

function deactivateStars(){ // functions to set all of the shurekins as inactive
	for (var i=0; i < numThrowingStars; i++){
		throwingStars[i].active = false;
		throwingStars[i].model.active = false;
	
	}
	weapon.active = true;
	weapon.model.active = true;
	weapon.resetPosition();
	isThrowingStar = false;
}

function activateStars(){
	weapon.active = false;
	weapon.model.active = false;
	for (var i=0; i < numThrowingStars; i++){
		throwingStars[i].active = true;
		throwingStars[i].model.active = true;
		throwingStars[i].resetPosition();
		throwingStars[i].starActive();
	
	}
	isThrowingStar = true;

}

