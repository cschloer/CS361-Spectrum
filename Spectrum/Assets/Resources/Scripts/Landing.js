#pragma strict
var clock:float;
var x:float;
var y:float;

function init(x:float, y:float){
	this.x = x;
	this.y = y;
	this.name = "Landing";											// Name the object.
	this.renderer.material.mainTexture = Resources.Load("Textures/landing", Texture2D);	// Set the texture.  Must be in Resources folder.
	this.transform.position = Vector3(1, 1, 5);	
	
	this.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	this.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
}