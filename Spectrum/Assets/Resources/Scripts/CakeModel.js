
var owner : Device;
var manager;
var broken : boolean;
var breakSound : AudioSource;
var counter : int;
var editorpause : boolean;
// Use this for initialization
function init(own : Device) {
	owner = own;
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,-0.1);		// Center the model on the parent.
	name = "Cake Model";					// Name the object.
	
	renderer.material.mainTexture = Resources.Load("Textures/cakeslice", Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
}

// Update is called once per frame
function Update () {
}

