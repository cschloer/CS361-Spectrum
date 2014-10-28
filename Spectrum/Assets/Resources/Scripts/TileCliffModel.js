// CSCI 361 Prototype

// tileFloorModel
// Blank uninteractive floor tile

var owner : Tile;

function init(own : Tile, o: int) {
	owner = own;									// Set up a pointer to the marble object containing this model.
	
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,0);		// Center the model on the parent.
	name = "Tile Cliff Model";						// Name the object.
	
	this.layer = 7;									// Set to cliff layer.
	var floorName : String;
	if(o < 4){
		floorName = "Textures/Cliff_b";
		transform.localEulerAngles.z = 90*o;
	} else{
		floorName = "Textures/Cliff_a";
		transform.localEulerAngles.z = 90*(o - 4);
	}
	renderer.material.mainTexture = Resources.Load(floorName, Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	//renderer.sortingLayerID = 2;														// Set the Unit to the tile layer.
	//renderer.sortingOrder = 2;
	
}