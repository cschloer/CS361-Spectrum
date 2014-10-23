#pragma strict
var clock:float;
var modelObject:GameObject;
var x:float;
var y:float;
var character:CharacterModel;
var hasHit:boolean;
var boxObject:GameObject;

var direction:int;


function init(x:float, y:float, m:GameObject, c:CharacterModel){
	clock = 0;
	modelObject = m;	
	character = c;
	if (Random.Range(0, 2) == 0) direction = -1;		
	else direction = 1;
	hasHit = false;
	modelObject.collider.isTrigger = true;			
	// no need to mess with box colliders
	this.x = x;
	this.y = y;
	this.name = "AOE";											// Name the object.
	this.renderer.material.mainTexture = Resources.Load("Textures/aoe", Texture2D);	// Set the texture.  Must be in Resources folder.
	
	this.transform.position = Vector3(x, y, 0);	
	this.transform.localScale = Vector3(.5, .5, 2);
	
	this.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	this.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
}

function Update(){
	if (clock > 10 && !hasHit) destroyMe(0); // destroy if it hasn't hit anything after 1.5 seconds
	if (clock > .25) 	this.transform.Rotate(0, 0,direction*5);
	if (clock > 8) this.renderer.material.color.a = 1-((clock-8)/2);
	clock+=Time.deltaTime;
	
	if (Random.Range(0, 60) == 1) direction*= -1;
 	//this.transform.position += this.transform.up; // use this for badass machine gun
 	this.transform.position += this.transform.up/(12/(clock/6+1));
}

function OnTriggerEnter(col:Collider){
	//print(col.gameObject.name);
	if (col.gameObject.name.Contains("Monster")){ // If it runs into a monster, pull that monster back
		var monster:Monster = col.gameObject.GetComponent(MonsterModel).monster;
		var monsterDistance:float = Vector2.Distance(Vector2(monster.model.transform.position.x, monster.model.transform.position.y),
			Vector2(character.transform.position.x, character.transform.position.y));
			
			
		// When this object is destroyed, any coroutine it called is immediately all destroyed.
		// So the destruction of this gameObject has to be delayed.
		hasHit = true;
		this.renderer.enabled = false;
	//	this.rigidbody.isKinematic = true;
		this.collider.enabled = false;
		monster.pause(2);
		destroyMe(3);
		
		//col.gameObject.GetComponent(MonsterModel).monster.hurt();
		// Hurt doesn't curently work because it ALSO has a knockback, need to override that
	}
}
function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		//Gizmos.DrawWireCube (transform.position, modelObject.GetComponent(MeshCollider).size);
	
}


public function moveTowardHero(m : float){
		var toHero : Vector3 = character.transform.position - this.transform.position;
		this.transform.position += toHero.normalized * Time.deltaTime*1* m;
}

function destroyMe(delay:float){
	yield WaitForSeconds(delay);
	character.coolSpell = false;
	Destroy(this.gameObject);
}