#pragma strict
var boss:MonsterBossTentacle;
var modelObject:GameObject;
var x:int;
var y:int;
var rotation:Vector3;
var Manager:GameManager;

var next:MonsterBossTentacleArm;

var timer:float;
var sign:int;
var timerTotal:float;
var rotateAmount:float;

var isStraight:boolean;
var buddy: MonsterBossTentacleArm;


function init(x:int, y:int, number:int, m:GameObject, r:Vector3, tt:float, ra:float, gm:GameManager, b:MonsterBossTentacle) {
	isStraight = true;
	Manager = gm;
	rotation = r;
	timerTotal = tt;
	rotateAmount = ra;
	timer = tt/2;
	sign = 1;
	modelObject = m;
	modelObject.collider.enabled = false;
	modelObject.AddComponent(BoxCollider);
	modelObject.GetComponent(BoxCollider).isTrigger =  false;
	/*modelObject.AddComponent(Rigidbody);
	modelObject.GetComponent(Rigidbody).isKinematic = false;
 	modelObject.GetComponent(Rigidbody).useGravity = false;
 	modelObject.GetComponent(Rigidbody).inertiaTensor = Vector3(1, 1, 1);
 	modelObject.GetComponent(Rigidbody).freezeRotation = true;*/
	modelObject.GetComponent(BoxCollider).size = Vector3(.75,.75,2);
	this.x = x;
	this.y = y;
	this.name = "TentacleArm";											// Name the object.
	this.renderer.material.mainTexture = Resources.Load("Textures/bossTentacleArm", Texture2D);	// Set the texture.  Must be in Resources folder.
	boss = b;
	//this.transform.rotation = character.transform.rotation;

	this.transform.position = Vector3(x, y, boss.transform.position.z + .5);	
	//this.transform.localScale = Vector3(2, 2, 2);
	
	this.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	this.renderer.material.shader = Shader.Find ("Transparent/Diffuse");	
	if (number>0){
		addTentacleArm(number-1);
	}
}

function addTentacleArm(length){
		var modelObject2 = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the tentacle texture.
		var tentacleScript:MonsterBossTentacleArm = modelObject2.AddComponent("MonsterBossTentacleArm");		// Add the tentacle.js script to the object.
																// We can now refer to the object via this script.
		tentacleScript.transform.eulerAngles = rotation;
		tentacleScript.init(this.transform.position.x, this.transform.position.y, length, modelObject2, rotation, timerTotal, rotateAmount, Manager, boss);	
		next = tentacleScript;
		tentacleScript.transform.parent = this.transform;	// Set the tentacle's parent object to be the tentacle folder.
		tentacleScript.transform.position += tentacleScript.transform.up/2;								
		return tentacleScript;	
	
	}

function Update () {
	this.renderer.material.color.r = boss.model.renderer.material.color.r;
	this.renderer.material.color.g = boss.model.renderer.material.color.g;
	if (!isStraight){
		if (timer > timerTotal){
			 sign *=-1;
			timer =0 ;
		}
		 this.transform.Rotate(0,0, sign*rotateAmount);
		 timer+=Time.deltaTime;	
	}
	//else {
	//	if (this.transform.eulerAngles != rotation) this.transform.eulerAngles = Vector3(0,0, (this.transform.eulerAngles.z-rotation.z)/5); 
	
	//}

}


function straighten(){
	isStraight = true;
	modelObject.GetComponent(BoxCollider).isTrigger = false;
	this.transform.localEulerAngles = Vector3(0,0,0);
	if (next!=null) next.straighten();
	if (buddy!= null) buddyShot();
	

}

function unstraighten(){
	isStraight = false;
	modelObject.GetComponent(BoxCollider).isTrigger = false;
	timer = timerTotal/2;
	if (next!=null) next.unstraighten();
}

function destroyMe(deathTime:float, explode:boolean) : IEnumerator{
	if(next!=null) next.destroyMe(deathTime, explode);
	if (explode) {
		modelObject.GetComponent(BoxCollider).isTrigger = true;
		this.renderer.enabled = false;
		var explosionParticle:ParticleSystem = Instantiate(Manager.explosionIce);
		explosionParticle.transform.parent = transform;
		explosionParticle.transform.localPosition = Vector3(0,0,0);
		explosionParticle.gameObject.SetActive(true);
		yield WaitForSeconds(2);
	}
	else {
		var clock:float = 0;
		while (clock < deathTime){
			this.renderer.material.color.a = deathTime-((clock));
			clock+=Time.deltaTime;
			yield;
		}
	}
	Destroy(this.gameObject);
}



function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		Gizmos.DrawWireCube (transform.position, modelObject.GetComponent(BoxCollider).size);
	
}

function buddyShot(){
	var shooting:boolean = true;
	var shootTimer:float = 0;
	var shootLimit:float = 1;
	while (isStraight){
		if (shooting) {
			//print(shooting);
			if (buddy == null) return;
			//playSound(shotSound);
			var vectorToBuddy : Vector3 = transform.position - buddy.transform.position;
			var anglesToBuddy : float = Mathf.Atan2(vectorToBuddy.y, vectorToBuddy.x) * Mathf.Rad2Deg - 90;
			if (anglesToBuddy < 0) anglesToBuddy += 360;
			attack(Vector3.Magnitude(transform.position - buddy.transform.position), 15, 0, .3, 1, Color.yellow, false, false, "", "ball", anglesToBuddy-(360/boss.numTentacles), true);
			yield WaitForSeconds(.05);
			shootTimer += .05;
		}
		
		shootTimer += Time.deltaTime;
		if (shootTimer > shootLimit) {
			yield WaitForSeconds(2);
			shootTimer = 0;
		}
	}
}

function attack(range : float, speed : float, home : float, width :float, depth : float, color : Color, destructible : boolean, fade : boolean, keyword : String, bulletTexture : String, offsetAngle : float, damages : boolean){
		var attackObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	
		var attack : MonsterAttack = attackObject.AddComponent("MonsterAttack") as MonsterAttack;						
		
		
		attack.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
		attack.transform.position = this.transform.position;
		attack.transform.rotation = this.transform.rotation;
		attack.transform.eulerAngles.z = offsetAngle;
		attack.name = "Monster Attack";											// Name the object.
		attack.renderer.material.mainTexture = Resources.Load("Textures/" + bulletTexture, Texture2D);	// Set the texture.  Must be in Resources folder.
		attack.renderer.material.color = color;												// Set the color (easy way to tint things).
		attack.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
		attack.transform.localScale = Vector3(width,depth,1); 
		attack.init(range, speed, fade, home, !damages);
		attack.hero = boss.hero;
		attack.transform.parent = boss.bulletFolder.transform;
		attackObject.collider.enabled = false;
		attackObject.AddComponent(BoxCollider);
		attackObject.GetComponent(BoxCollider).name = "attack d:" + destructible + " " + keyword;
		attackObject.GetComponent(BoxCollider).isTrigger = true;
		attackObject.GetComponent(BoxCollider).size = Vector3(.5,.5,10);
		attackObject.AddComponent(Rigidbody);
		attackObject.GetComponent(Rigidbody).isKinematic = false;
		attackObject.GetComponent(Rigidbody).useGravity = false;
		attackObject.GetComponent(Rigidbody).inertiaTensor = Vector3(100, 100, 100);
		attackObject.GetComponent(Rigidbody).freezeRotation = true;
		return attack;
	}
