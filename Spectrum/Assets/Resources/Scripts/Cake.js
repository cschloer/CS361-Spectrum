#pragma strict

var model: CakeModel;

// Use this for initialization
function init() {
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the gem texture.
	model = modelObject.AddComponent("CakeModel");						// Add a gemModel script to control visuals of the gem.
	
	model.transform.parent = transform;									// Set the model's parent to the gem (this object).
	model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
	model.name = "Cake Model";											// Name the object.
	
	model.renderer.material.mainTexture = Resources.Load("Textures/cakeslice", Texture2D);	// Set the texture.  Must be in Resources folder.
	model.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	model.renderer.material.shader = Shader.Find ("Transparent/Diffuse");	
 } 
