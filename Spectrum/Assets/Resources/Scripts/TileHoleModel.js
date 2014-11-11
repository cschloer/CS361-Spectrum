// CAGE
// CSCI 361 Prototype

// tileHoleModel
// Hole Model, beware falling.

var owner : Tile;
var character : CharacterModel;

function init(own : Tile) {
	owner = own;									// Set up a pointer to the marble object containing this model.
	
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,0);		// Center the model on the parent.
	name = "Tile Hole Model";						// Name the object.
	
	

	renderer.material.mainTexture = Resources.Load("Textures/Hole", Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	//renderer.sortingLayerID = 2;														// Set the Unit to the tile layer.
	//renderer.sortingOrder = 2;
	
}

function OnTriggerEnter(col:Collider){
	if(col.gameObject.name.Contains("Character")){
		character = col.gameObject.GetComponent(CharacterModel);
		character.shakeCamera(.5,.1);
		character.stopMovement();
		character.fallDeath(transform.position);
	}
}

function OnTriggerStay(col:Collider){
	if(col.gameObject.name.Contains("Character")){
		character.stopMovement();
		character.fallDeath(transform.position);
	}
}