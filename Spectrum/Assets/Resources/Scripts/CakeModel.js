
var owner : Device;
var manager;
var broken : boolean;
var breakSound : AudioSource;
var counter : int;
var editorpause : boolean;
function init(own : Device, man, opt: int) {
	owner = own;									// Set up a pointer to the device object containing this model.
	manager = man;									// Set up a pointer to the game manager
	broken = false;
	if(opt > 0)
		editorpause = true;
	
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.parent = transform;									// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
	name = "Cake Model";											// Name the object.
	
	renderer.material.mainTexture = Resources.Load("Textures/cakeslice", Texture2D);	// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");	
}

// Update is called once per frame
function Update () {
}

