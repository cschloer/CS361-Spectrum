#pragma strict
var clock:float;
var modelObject:GameObject;
var x:float;
var y:float;
var colliderSize:float;
var knockBackRange:float;
var duration:float;


function init(x:float, y:float, m:GameObject, sizeIncrease:float, d:float){
	clock = 0;
	print("here");	
	colliderSize = 1.5*sizeIncrease;
	duration = d;
//	if (isBig) colliderSize = 3;
	knockBackRange = Mathf.Sqrt(colliderSize*colliderSize);
	modelObject = m;										
	modelObject.collider.enabled = false;
	modelObject.AddComponent(BoxCollider);
	modelObject.GetComponent(BoxCollider).isTrigger = true;
	modelObject.GetComponent(BoxCollider).size = Vector3(colliderSize,colliderSize,2);

	
	this.x = x;
	this.y = y;
	this.name = "Landing";											// Name the object.
	this.renderer.material.mainTexture = Resources.Load("Textures/empty", Texture2D);	// Set the texture.  Must be in Resources folder.
	
	//this.renderer.material.mainTexture = Resources.Load("Textures/landing", Texture2D);	// Uncomment this line to add a texture showing the approximate size of the landing
	this.transform.position = Vector3(x, y, -1);	
	//this.transform.localScale = Vector3(2, 2, 2);
	//if (isBig) this.transform.localScale = Vector3(4, 4, 4);	 
	
	this.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	this.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
}

function Update(){
	if (clock > duration) Destroy(this.gameObject);
	clock+=Time.deltaTime;
 
}

function OnTriggerEnter(col:Collider){
	//print(col.gameObject.name);
	if (col.gameObject.name.Contains("Monster")){ // If it runs into a monster, knock that monster back
		var monster:Monster = col.gameObject.GetComponent(MonsterModel).monster;
		var monsterDistance:float = Vector2.Distance(Vector2(monster.model.transform.position.x, monster.model.transform.position.y),
			Vector2(this.transform.position.x, this.transform.position.y));
		var colliderDistance = Vector3(2, 2, 0);
		var speed :int = 5;
		col.gameObject.GetComponent(MonsterModel).monster.flee(speed, (knockBackRange-monsterDistance)/speed); // knockback function, based on how far away
		//col.gameObject.GetComponent(MonsterModel).monster.hurt();
		// Hurt doesn't curently work because it ALSO has a knockback, need to override that
	}
}
function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		Gizmos.DrawWireCube (transform.position, modelObject.GetComponent(BoxCollider).size);
	
}