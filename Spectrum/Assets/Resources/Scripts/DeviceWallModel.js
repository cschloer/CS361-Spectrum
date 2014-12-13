// CSCI 361 Prototype

// deviceWallModel
// Blocks an entrance

var owner : Device;
var manager;
var broken : boolean;
var breakSound : AudioSource;
var counter : int;
var editorpause : boolean;
var cakeNumber : int;
var cakes : Array;
var cakeScale : float = .4;
var cakeOffset : float = 1.5;
var cakeSpacing : float = .8;
function init(own : Device, man, opt: int, cakeNum: int) {
	owner = own;									// Set up a pointer to the device object containing this model.
	manager = man;									// Set up a pointer to the game manager
	broken = false;
	cakeNumber = cakeNum;							// Number of cakes to surpass before this door opens.
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,-0.1);		// Center the model on the parent.
	transform.localScale = Vector3(2,1,1);
	transform.localEulerAngles.z = 90;
	if(opt > 2){
		transform.localEulerAngles.z = 0;
	}
	else if(opt > 0){
		editorpause = true;
	}
	
	name = "Device Barrier Model";					// Name the object.
	
	renderer.material.mainTexture = Resources.Load("Textures/Barrier", Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	breakSound = gameObject.AddComponent("AudioSource") as AudioSource;
	breakSound.clip = Resources.Load("Sounds/rattle");
}

function Update(){
	if(editorpause){
	}
	else{
		if(manager.character.model.cakesCollected > cakeNumber){
			breakage();
		}
	}
	if(cakes == null) addCakes();
	if(Vector3.Magnitude(transform.position - manager.character.model.transform.position) < 3 && manager.showCakes){
		showCake();
	} else {
		hideCake();
	}
}
function addCakes(){
		//return;
		cakes = new Array();
		yield; //WaitForSeconds(.02);
		for (var i=0; i<cakeNumber + 1; i++){
			var cakeObject = GameObject.CreatePrimitive(PrimitiveType.Quad);
			
			cakeObject.gameObject.transform.position = transform.position;
			//heartObject.gameObject.transform.rotation = model.transform.rotation;
			
												// Name the object.
			cakeObject.renderer.material.mainTexture = Resources.Load("Textures/Cakesl", Texture2D);	// Set the texture.  Must be in Resources folder.
			cakeObject.renderer.material.shader = Shader.Find ("Transparent/Diffuse");	
			cakeObject.gameObject.collider.enabled = false;
			cakeObject.gameObject.transform.parent = this.transform;
			//heartObject.transform.localPosition = Vector3(((0-health/2)+i+.5)*.5, 0,-1);						// Center the model on the parent.
			if(Mathf.Round(transform.eulerAngles.z) == 90 || Mathf.Round(transform.eulerAngles.z) == 270){
				cakeObject.transform.localScale = Vector3(cakeScale*2, cakeScale, 1);
				//print("Case 1, " + transform.eulerAngles.z);
			}else{
				cakeObject.transform.localScale = Vector3(cakeScale, cakeScale*2, 1);
				//print("Case 2" + transform.eulerAngles.z);
			}
			cakeObject.gameObject.name = "cakeObject";	
			cakes.Add(cakeObject);
		}
	
}
	function showCake(){
		//print("Collected: " + manager.character.model.cakesCollected + ", needed: " + cakeNumber + ", displaying: " + cakes.length);
		if((cakeNumber+1) - manager.character.model.cakesCollected < cakes.length && cakes.length > 0){
			 removeCake();
		}
		updateCake();
		//print("Angles : " + transform.eulerAngles + ", Local: " + transform.localEulerAngles);
	}
	function hideCake(){
		for (var i = 0; i < cakes.length; i ++){
			var cake : GameObject  = cakes[i];
			if(cake != null){
				cake.transform.renderer.material.color.a = 0;
			}
		}
	}
	function updateCake(){
		for (var i = 0; i < cakes.length; i ++){
			var cake : GameObject  = cakes[i];
			if(cake != null){
				cake.transform.position.y = transform.position.y + cakeOffset;
				cake.transform.position.x = transform.position.x + cakeSpacing*(i - (0.0+cakes.length-1)/2);
				cake.transform.renderer.material.color.a=1.0;
				//else heart.transform.renderer.material.color.a = model.transform.renderer.material.color.a * heartOpacity;
			}
		}
	}
	
	function removeCake(){
		//print(cakes.length);
		//return;
		if (cakes.length < 1) return;
		Destroy(cakes[cakes.length - 1]);
		cakes.Remove(cakes.length);
		//curHeart--;
	}
	
function breakage(){
	Destroy(owner.gameObject);
}