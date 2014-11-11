// CAGE
// CSCI 361 Prototype

// Spawn Point Model
// Spawns character and boss.

var owner : Device;
var manager : GameManager;
var type : int;

function init(own : Device, man : GameManager, type : int) {
	this.type = type;
	manager = man;
	owner = own;
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,0.6);		// Center the model on the parent.
	name = "Spawn Point Model";					// Name the object.
	
	renderer.material.mainTexture = Resources.Load("Textures/levelEditor_charSpawn", Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	renderer.enabled = false;
}

function relocate(cent: Vector3){
	owner.transform.position = cent;
	transform.localPosition = Vector3(0,0,-0.1);		// Center the model on the parent.
}

function spawn(){
	if( type > 0 ){
		manager.addBoss(transform.position.x,transform.position.y, manager.character);
	} else{
		manager.addCharacter(transform.position.x, transform.position.y);
	}
}