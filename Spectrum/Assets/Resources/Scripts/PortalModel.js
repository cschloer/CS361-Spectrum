var owner : Device;
var manager;
var broken : boolean;
var breakSound : AudioSource;
var counter : int;
var editorpause : boolean;
var levelNum : int;
// Use this for initialization
function init(own : Device, n : int) {
	owner = own;
	levelNum = n;
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,-0.1);		// Center the model on the parent.
	name = "Portal Model";					// Name the object.
	
	renderer.material.mainTexture = Resources.Load("Textures/portal", Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
}

// Update is called once per frame
function Update () {
	transform.eulerAngles.z += .1+ 8*Mathf.Abs(3*Mathf.Sin(Time.time));
}

function OnTriggerEnter(col:Collider){
	print(col.gameObject.name);
	if (col.gameObject.name.Contains("Character")){
		Application.LoadLevel("Level" + levelNum);
	}
}
