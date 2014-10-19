#pragma strict
var clock:float;
var modelObject:GameObject;
var x:float;
var y:float;
var character:CharacterModel;
var hasHit:boolean;
var boxObject:GameObject;


function init(x:float, y:float, m:GameObject, c){
	clock = 0;
	modelObject = m;	
	character = c;				
	modelObject.collider.isTrigger = true;			
	// no need to fuck with mesh colliders
	this.x = x;
	this.y = y;
	this.name = "Hook";											// Name the object.
	this.renderer.material.mainTexture = Resources.Load("Textures/hook", Texture2D);	// Set the texture.  Must be in Resources folder.
	
	this.transform.rotation = character.transform.rotation;
	//this.renderer.material.mainTexture = Resources.Load("Textures/landing", Texture2D);	// Uncomment this line to add a texture showing the approximate size of the landing
	this.transform.position = Vector3(x, y, -1);	
	//this.transform.localScale = Vector3(2, 2, 2);
	
	this.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	this.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
}

function Update(){
	if (clock > 1.5 && !hasHit)destroyMe(); // destroy if it hasn't hit anything after 1.5 seconds
	clock+=Time.deltaTime;
	if (hasHit) return;
 	//this.transform.position += this.transform.up; // use this for badass machine gun
 	this.transform.position += this.transform.up/7;
}

function OnTriggerEnter(col:Collider){
	//print(col.gameObject.name);
	if (col.gameObject.name.Contains("Monster")){ // If it runs into a monster, pull that monster back
		var monster:Monster = col.gameObject.GetComponent(MonsterModel).monster;
		var monsterDistance:float = Vector2.Distance(Vector2(monster.model.transform.position.x, monster.model.transform.position.y),
			Vector2(character.transform.position.x, character.transform.position.y));
		monster.charge(monsterDistance*2, .95/2);
		this.pull(monsterDistance*2,.95/2);
		
		//col.gameObject.GetComponent(MonsterModel).monster.hurt();
		// Hurt doesn't curently work because it ALSO has a knockback, need to override that
	}
}
function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		//Gizmos.DrawWireCube (transform.position, modelObject.GetComponent(MeshCollider).size);
	
}

public function pull(speed : float, duration : float){
		hasHit = true;
		var t : float = 0;
		while(t < duration){
			t += Time.deltaTime;
			moveTowardHero(speed);
			yield;
		}
		destroyMe();
}

public function moveTowardHero(m : float){
		var toHero : Vector3 = character.transform.position - this.transform.position;
		this.transform.position += toHero.normalized * Time.deltaTime*1* m;
}

function destroyMe(){
	character.isHook = false;
	Destroy(this.gameObject);
}