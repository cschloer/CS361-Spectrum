﻿#pragma strict
// CSCI 361 Prototype

// deviceSpawnModel
// Spawns Monsters

var owner : Device;
var manager : GameManager;
var spawns : Array;
var broken : boolean;
var breakSound : AudioSource;
var counter : int;

function Start(){
}

function init(own : Device, man: GameManager, count: int) {
	owner = own;									// Set up a pointer to the device object containing this model.
	manager = man;									// Set up a pointer to the game manager
	broken = false;
	spawns = new Array();
	counter = count;
	
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,-0.1);		// Center the model on the parent.
	transform.localScale = Vector3(2,2,1);
	name = "Device Spawner Model";					// Name the object.
	
	renderer.material.mainTexture = Resources.Load("Textures/spawner", Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	breakSound = gameObject.AddComponent("AudioSource") as AudioSource;
	breakSound.clip = Resources.Load("Sounds/rattles");
}

function Update(){
	if (spawns.length < counter && Random.value < 0.002 && !broken){
		var rType = Random.Range(1,7);
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
	if(!broken) breakSound.Play();
	renderer.material.mainTexture = Resources.Load("Textures/cracked", Texture2D);
	broken = true;
	owner.box.isTrigger = true;
	
	
}