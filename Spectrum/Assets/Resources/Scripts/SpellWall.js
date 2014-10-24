#pragma strict
var clock:float;
var modelObject:GameObject;
var x:float;
var y:float;
var character:CharacterModel;
var hasHit:boolean;
var boxObject:GameObject;
var direction:int;
var destroying:boolean;

function init(x:float, y:float, m:GameObject, c:CharacterModel, distance:int){
	destroying = false;
	clock = 0;
	modelObject = m;	
	character = c;
	modelObject.collider.enabled = false;	
	modelObject.AddComponent(BoxCollider);// Add boxcollider.
	modelObject.GetComponent(BoxCollider).center = this.transform.position;								// Center the boxcollider on the unit.
	modelObject.GetComponent(BoxCollider).size = Vector3(0.5,0.5,1);
	
	// no need to mess with box colliders
	this.name = "Wall";											// Name the object.
	this.renderer.material.mainTexture = Resources.Load("Textures/spellWall", Texture2D);	// Set the texture.  Must be in Resources folder.
	
	this.transform.position = Vector3(x, y, 0);
	this.transform.position += this.transform.up*distance/3;	
	/*if (distance%2 == 0){
			this.transform.Rotate(0, 0, 30);		
		}
	else {
		
			this.transform.Rotate(0, 0, -30);	
	}
		*/			
	this.transform.localScale = Vector3(.5, .5, 2);
	
	this.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	this.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
}

function Update(){
	if (destroying) return;
	if (clock > 6) destroyMe(true); // destroy if it hasn't hit anything after 1.5 seconds
	clock+=Time.deltaTime;
	
	
}

function OnTriggerEnter(col:Collider){
	//print(col.gameObject.name);
	if (col.gameObject.name.Contains("Monster")){ // If it runs into a monster, pull that monster back
		var monster:Monster = col.gameObject.GetComponent(MonsterModel).monster;
		if (!monster.hurting) monster.hurt();
	}
}
function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		Gizmos.DrawWireCube (transform.position, modelObject.GetComponent(BoxCollider).size);
	
}

function expand(duration:float){
	var timer:float = 0;
	while (timer < duration){
		this.transform.localScale += Vector3(.01,.01, 0);
		//this.GetComponent(BoxCollider).size = Vector3(this.transform.localScale.x,this.transform.localScale.y,1);
		timer += Time.deltaTime;
		yield;
	}

}


function destroyMe(explode:boolean){
	destroying = true;
	character.coolSpell = false;
	if (explode) {
		modelObject.GetComponent(BoxCollider).isTrigger = true;
		this.renderer.enabled = false;
		var explosionParticle:ParticleSystem = Instantiate(character.Manager.explosionIce);
		explosionParticle.transform.parent = transform;
		explosionParticle.transform.localPosition = Vector3(0,0,0);
		explosionParticle.gameObject.SetActive(true);
		yield WaitForSeconds(2);
	}
	Destroy(this.gameObject);
}