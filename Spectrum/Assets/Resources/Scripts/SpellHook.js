#pragma strict
var clock:float;
var modelObject:GameObject;
var x:float;
var y:float;
var character:CharacterModel;
var hasHit:boolean;
var boxObject:GameObject;


function init(x:float, y:float, m:GameObject, c:CharacterModel){
	clock = 0;
	modelObject = m;	
	character = c;				
	modelObject.collider.isTrigger = true;			
	// no need to mess with box colliders
	this.x = x;
	this.y = y;
	this.name = "Hook";											// Name the object.
	this.renderer.material.mainTexture = Resources.Load("Textures/hook", Texture2D);	// Set the texture.  Must be in Resources folder.
	
	this.transform.rotation = character.transform.rotation;
	
	this.transform.position = Vector3(x, y, 0);	
	//this.transform.localScale = Vector3(2, 2, 2);
	
	this.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	this.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
}

function Update(){
	if (clock > 1.5 && !hasHit)destroyMe(); // destroy if it hasn't hit anything after 1.5 seconds
	clock+=Time.deltaTime;
	if (hasHit) return;
 	//this.transform.position += this.transform.up; // use this for badass machine gun
 	this.transform.position += this.transform.up/5;
}

function OnTriggerEnter(col:Collider){
	//print(col.gameObject.name);
	if (col.gameObject.name.Contains("Monster")){ // If it runs into a monster, pull that monster back
		var monster:Monster = col.gameObject.GetComponent(MonsterModel).monster;
		var monsterDistance:float = Vector2.Distance(Vector2(monster.model.transform.position.x, monster.model.transform.position.y),
			Vector2(character.transform.position.x, character.transform.position.y));
		var speed:int = 20;
		monster.getHooked(speed);
		monster.hooking = true;
		this.pull(speed, monster);
		
		//col.gameObject.GetComponent(MonsterModel).monster.hurt();
		// Hurt doesn't curently work because it ALSO has a knockback, need to override that
	}
}
function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		//Gizmos.DrawWireCube (transform.position, modelObject.GetComponent(MeshCollider).size);
	
}

public function pull(speed : float, m :Monster){
		hasHit = true;
		var t : float = 0;
		while(distanceToHero() > .5){
			//if (duration - t < .5) this.renderer.active = false;
			t += Time.deltaTime;
			moveTowardHero(speed);
			yield;
		}
		m.hooking = false;
		destroyMe();
}

public function distanceToHero(){
		return Vector3.Magnitude(this.transform.position - character.transform.position);
	}

public function moveTowardHero(m : float){
		var toHero : Vector3 = character.transform.position - this.transform.position;
		this.transform.position += toHero.normalized * Time.deltaTime*1* m;
}

function destroyMe(){
	character.coolSpellHook = false;
	Destroy(this.gameObject);
}