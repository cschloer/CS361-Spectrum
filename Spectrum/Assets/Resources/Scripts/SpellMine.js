#pragma strict
var clock:float;
var modelObject:GameObject;
var x:float;
var y:float;
var character:CharacterModel;
var hasHit:boolean;
var boxObject:GameObject;
var colliderSize:float;
var explosionParticle:ParticleSystem;
var resetCool:boolean; // so that the cooldown only gets reset the first time around
var cycles:int; // how many blinking cycles it's gone through
var destroying:boolean;
var time:float;
var ice:boolean;
var isBig:boolean;

function init(x:float, y:float, m:GameObject, c:CharacterModel, t:float){
	isBig = false;
	ice = false;
	destroying = false;
	resetCool = true;
	cycles = 0;
	clock = 0;
	modelObject = m;	
	character = c;	
	colliderSize = .5;	
	time = t;		
	modelObject.collider.enabled = false;
	modelObject.AddComponent(BoxCollider);
	modelObject.GetComponent(BoxCollider).isTrigger = true;
	modelObject.GetComponent(BoxCollider).size = Vector3(colliderSize,colliderSize,2);
	this.x = x;
	this.y = y;
	this.name = "Mine";											// Name the object.
	this.renderer.material.mainTexture = Resources.Load("Textures/mine", Texture2D);	// Set the texture.  Must be in Resources folder.
	
	//this.transform.rotation = character.transform.rotation;

	this.transform.position = Vector3(x, y, 0);	
	//this.transform.localScale = Vector3(2, 2, 2);
	
	this.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	this.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 

	if (t==0) this.renderer.enabled = false; // if using this just for the explosion
}


function init(pos:Vector3, m:GameObject, t:float, c:CharacterModel){
	isBig = false;
	ice = true;
	destroying = false;
	resetCool = true;
	character = c;
	cycles = 0;
	clock = 0;
	modelObject = m;		
	colliderSize = .5;	
	time = t;		
	modelObject.collider.enabled = false;
	modelObject.AddComponent(BoxCollider);
	modelObject.GetComponent(BoxCollider).isTrigger = true;
	modelObject.GetComponent(BoxCollider).size = Vector3(colliderSize,colliderSize,2);
	
	this.name = "Mine";											// Name the object.
	this.renderer.material.mainTexture = Resources.Load("Textures/mine", Texture2D);	// Set the texture.  Must be in Resources folder.
	
	//this.transform.rotation = character.transform.rotation;

	this.transform.position = pos;
	//this.transform.localScale = Vector3(2, 2, 2);
	
	this.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	this.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 

	if (t==0) this.renderer.enabled = false; // if using this just for the explosion
}

function Update(){
	if (clock > 1) {
		this.renderer.material.mainTexture = Resources.Load("Textures/mine", Texture2D);
		clock=0;
		}
	else if (clock > .5) { 
		this.renderer.material.mainTexture = Resources.Load("Textures/mineB", Texture2D);
		if (resetCool) { // reset the cooldown only the first time around
			character.coolSpellMine = false;
			resetCool = false;
		}
	}
	cycles+=Time.deltaTime;
	if (cycles >= time) destroyMe(); // destroy after 10 cycles, aka 10 seconds
	
	clock+=Time.deltaTime;
	
}

function OnTriggerEnter(col:Collider){
	//print(col.gameObject.name);
	
}
function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		Gizmos.DrawWireCube (transform.position, modelObject.GetComponent(BoxCollider).size);
	
}





function destroyMe(){
	if (destroying) return;
	this.renderer.enabled = false;
	modelObject.GetComponent(BoxCollider).size = Vector3(colliderSize*2,colliderSize*2,2); // Collider gets bigger in explosion
	destroying = true;
	var explosionParticle:ParticleSystem ;
	if (!ice) explosionParticle = Instantiate(character.Manager.explosionFire);
	else explosionParticle = Instantiate(character.Manager.explosionIce);
	explosionParticle.transform.parent = transform;
	explosionParticle.transform.localPosition = Vector3(0,0,0);
	explosionParticle.gameObject.SetActive(true);
	if (isBig) {
		explosionParticle.transform.localScale = Vector3(2,2,2);
		modelObject.GetComponent(BoxCollider).size = Vector3(colliderSize*2*2,colliderSize*2*2,4); // Collider gets bigger in explosion
	}
	
	yield WaitForSeconds(1);
	if (resetCool && time !=0) { // if the cooldown hasn't been reset yet, this mine was destroyed very early. Remove mine visually and wait before resetting cooldown.
		yield WaitForSeconds(.5-clock);
		character.coolSpellMine = false;
	}
	
	Destroy(this.gameObject);
}