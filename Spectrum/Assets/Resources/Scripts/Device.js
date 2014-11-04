// CAGE
// CSCI 361 Prototype

// devices
// todo: buttons, doors, monster spawn

var modelObject : GameObject; 
var box : BoxCollider;			// For colliding.
var type : String;
var data : int;
function init(t: String, manager: GameManager, num : int) {
	type = t;
	data = num;
	modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);		// Create a quad object for holding the unit texture.
	modelObject.collider.enabled = false;								// Turn off MeshCollider
	modelObject.SetActive(false);										// Turn off the object so its script doesn't do anything until we're ready.
	var model;
	if(type == "mSpawn"){
		var wmodel = modelObject.AddComponent("DeviceSpawnModel");			// Add a script to control direction of the unit.
		box = modelObject.AddComponent("BoxCollider");						// Add boxcollider.
		box.center = wmodel.transform.position;								// Center the boxcollider on the unit.
		box.size = Vector3(1.3,1.3,5);
		wmodel.name = "Monster Spawner";
		wmodel.init(this, manager, num);													// Initialize the device.
	} else if (type == "cake"){
		modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the gem texture.
		modelObject.name = "Cake Object";
		model = modelObject.AddComponent(CakeModel);						// Add a gemModel script to control visuals of the gem.
		model.transform.parent = transform;									// Set the model's parent to the gem (this object).
		model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
		model.name = "Cake Model";											// Name the object.
		model.init(this, manager, num);
	} else{
		model = modelObject.AddComponent("DeviceWallModel");			// Add a script to control direction of the unit.
		box = modelObject.AddComponent("BoxCollider");						// Add boxcollider.
		box.center = model.transform.position;								// Center the boxcollider on the unit.
		box.size = Vector3(2.5,.5,15);
		model.init(this, manager, num);													// Initialize the tileModel.
	}
	modelObject.SetActive(true);										// Turn on the object (the Update function will start being called).
}