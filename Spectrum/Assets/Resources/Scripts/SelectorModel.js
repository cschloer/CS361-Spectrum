// CSCI 361 Prototype

// selectormodel
// Selector Display for editor

var owner : Selector;

function init(own : Selector) {
	owner = own;									// Set up a pointer to the marble object containing this model.
	
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,0);		// Center the model on the parent.
	name = "Selector Model";						// Name the object.
	renderer.material.mainTexture = Resources.Load("Textures/Selector", Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 

	
}