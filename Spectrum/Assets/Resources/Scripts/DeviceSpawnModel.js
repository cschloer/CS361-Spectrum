#pragma strict
// CSCI 361 Prototype

// deviceSpawnModel
// Spawns Monsters

var owner : Device;
var manager : GameManager;
var spawns : Array;
var typeVal : int;
var broken : boolean;
var breakSound : AudioSource;
var counter : int;

function Start(){
}

function init(own : Device, man: GameManager, count: int, typev: int) {
	owner = own;									// Set up a pointer to the device object containing this model.
	manager = man;									// Set up a pointer to the game manager
	broken = false;
	spawns = new Array();
	counter = count;								// number of maximum monsters alive at one time from this spawner.
	typeVal = typev;
	
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,0);		// Center the model on the parent.
	transform.localScale = Vector3(2,2,1);
	name = "Device Spawner Model";					// Name the object.
	
	renderer.material.mainTexture = Resources.Load("Textures/spawner_02", Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	breakSound = gameObject.AddComponent("AudioSource") as AudioSource;
	breakSound.volume = 0;
	breakSound.clip = Resources.Load("Sounds/rattles");
}

function Update(){
	if (spawns.length < counter && Random.value < 0.002 && !broken && !owner.frozen){
		var rType : int;
		if(typeVal != 0){			// Number of monster you'd like the spanwer to spawn
			rType = typeVal;
		} else{
			rType = Random.Range(1,7);
		}
		var mon = manager.addMonster(transform.position.x,transform.position.y+2,manager.character,rType);
		//mon.activateDistance = 8;
		spawns.Add(mon);
	}
	for(var i : int = 0; i < spawns.length; i++){
		if( spawns[i] == null ){
			spawns.Remove(i);
		}
	}
}

function breakage(){
	breakSound.volume = 1;
	if(!broken) manager.playSound(breakSound, transform.position);
	renderer.material.mainTexture = Resources.Load("Textures/cracked_02", Texture2D);
	broken = true;
	owner.box.isTrigger = true;
	
	
}