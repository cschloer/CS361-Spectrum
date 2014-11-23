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

/* Variables created by Conrad*/
var monsterTypes:Array;
var monsterTimers:Array;
var monsterScripts:Array;
var numMonsters:int;
var respawnTime:float;
var character:Character;
var spawnDistance:float;
var conradInit:boolean;

/*                         */


function init(own : Device, man: GameManager, count: int, typev: int) {
	conradInit = false;
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
	this.gameObject.collider.enabled = false;
	this.gameObject.AddComponent(BoxCollider);
	this.gameObject.GetComponent(BoxCollider).isTrigger = true;
}


function init(own : Device, man: GameManager, types: Array, respawnTime:float, spawnDistance:float) {
	conradInit = true;
	this.respawnTime = respawnTime;
	this.spawnDistance = spawnDistance;
	monsterTypes = types;
	numMonsters = types.length;
	monsterTimers = new Array();
	monsterScripts = new Array();
	for (var i=0; i< numMonsters; i++){
		monsterTimers.Add(0);
		monsterScripts.Add(null);
	}
	character = man.character;
	
	owner = own;									// Set up a pointer to the device object containing this model.
	manager = man;									// Set up a pointer to the game manager
	broken = false;
	spawns = new Array();
	counter = 4;								// number of maximum monsters alive at one time from this spawner.
	typeVal = 5;
	
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
	this.gameObject.collider.enabled = false;
	//this.gameObject.AddComponent(BoxCollider);
	//this.gameObject.GetComponent(BoxCollider).isTrigger = true;
	for (var j=0; j< numMonsters; j++){
			if (monsterScripts[j] == null) {
				var mons = manager.addMonster(transform.position.x+(-1*(numMonsters/2)+j),transform.position.y+2,manager.character,monsterTypes[j]);
				monsterScripts[j] = mons;
			}
		}
}

function Update(){
	if (!conradInit) {
	

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
	else { // conrad update function
	
		if (distanceToCharacter() < spawnDistance){ // don't respawn if character is nearby
			for (var h=0; h<numMonsters; h++) monsterTimers[h] = 0;
		}
		
		for (var j=0; j< numMonsters; j++){
			if (monsterScripts[j] == null) {
				var temp:float = monsterTimers[j];
				temp += Time.deltaTime;
				monsterTimers[j] = temp;
				if(temp >= respawnTime){
					var mons = manager.addMonster(transform.position.x+(-1*(numMonsters/2)+j),transform.position.y+2,manager.character,monsterTypes[j]);
					monsterScripts[j] = mons;
					monsterTimers[j] = 0;
					return;
				}
			}
		}
		
	}
}

function breakage(){
	if (broken) return;
	breakSound.volume = 1;

	if(!broken) manager.playSound(breakSound, transform.position);

	renderer.material.mainTexture = Resources.Load("Textures/cracked_02", Texture2D);
	broken = true;
	owner.box.isTrigger = true;
	
	
}

public function distanceToCharacter(){
		return Vector3.Magnitude(this.transform.position - character.model.transform.position);
	}

function OnDrawGizmos() {
		if (conradInit) return;
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		Gizmos.DrawWireCube (transform.position, this.gameObject.GetComponent(BoxCollider).size);
	
}
