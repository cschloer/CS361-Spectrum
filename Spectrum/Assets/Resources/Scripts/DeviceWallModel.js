// CSCI 361 Prototype

// deviceWallModel
// Blocks an entrance

var owner : Device;
var manager : GameManager;
var broken : boolean;
var breakSound : AudioSource;
var counter : int;
function init(own : Device, man: GameManager) {
	owner = own;									// Set up a pointer to the device object containing this model.
	manager = man;									// Set up a pointer to the game manager
	broken = false;
	
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,-0.1);		// Center the model on the parent.
	transform.localScale = Vector3(2,1,1);
	transform.localEulerAngles.z = 90;
	name = "Device Barrier Model";					// Name the object.
	
	renderer.material.mainTexture = Resources.Load("Textures/Barrier", Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	breakSound = gameObject.AddComponent("AudioSource") as AudioSource;
	breakSound.clip = Resources.Load("Sounds/rattle");
}

function Update(){
	if(Vector3.Magnitude(transform.position - manager.character.model.transform.position) < 5 && !broken){
	}
	if(manager.character.model.cakesCollected > 7){
		print("breakage");
		breakage();
	}
}

function breakage(){
	Destroy(owner.gameObject);
}