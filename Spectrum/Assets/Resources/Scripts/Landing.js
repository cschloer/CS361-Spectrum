#pragma strict
var clock:float;
var modelObject:GameObject;
var x:float;
var y:float;

function init(x:float, y:float, m){
	modelObject = m;										
	modelObject.collider.enabled = false;
	modelObject.AddComponent(BoxCollider);
	modelObject.GetComponent(BoxCollider).isTrigger = true;
	modelObject.GetComponent(BoxCollider).size = Vector3(2,2,2);
	
	
	this.x = x;
	this.y = y;
	this.name = "Landing";											// Name the object.
	this.renderer.material.mainTexture = Resources.Load("Textures/landing", Texture2D);	// Set the texture.  Must be in Resources folder.
	this.transform.position = Vector3(x, y, -1);	
	this.transform.localScale = Vector3(2, 2, 2);
	
	this.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	this.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
}

function OnTriggerEnter(col:Collider){
	//print(col.gameObject.name);
	if (col.gameObject.name.Contains("Monster")){ // If it runs into a monster, knock that monster back
		print("WE HIT ONE SCOTTY");
		var monster:Monster = col.gameObject.GetComponent(MonsterModel).monster;
		var distance = Vector3.Distance(monster.transform.position, this.transform.position);
		//col.gameObject.GetComponent(MonsterModel).monster.flee(
	}
}
function OnDrawGizmos() {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		Gizmos.DrawWireCube (transform.position, modelObject.GetComponent(BoxCollider).size);
	
}