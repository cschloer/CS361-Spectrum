// CAGE
// CSCI 361 Prototype

// tileFloorModel
// Blank uninteractive floor tile

var owner : Tile;

function init(own : Tile) {
	owner = own;									// Set up a pointer to the marble object containing this model.
	
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,0);		// Center the model on the parent.
	name = "Tile Floor Model";						// Name the object.
	
	
	var rand = Random.value;
	var floorName : String;
	if(rand < .05)
		floorName = "Textures/Floor_a";
	else if(rand <.1)
		floorName = "Textures/Floor_b";
	else if(rand <.15)
		floorName = "Textures/Floor_c";
	else if(rand <.95)
		floorName = "Textures/Floor_d";
	else
		floorName = "Textures/Floor_e";
	renderer.material.mainTexture = Resources.Load(floorName, Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	//renderer.sortingLayerID = 2;														// Set the Unit to the tile layer.
	//renderer.sortingOrder = 2;
	
}