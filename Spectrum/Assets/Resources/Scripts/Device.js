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
	if(type == "mSpawn"){
		var wmodel = modelObject.AddComponent("DeviceSpawnModel");			// Add a script to control direction of the unit.
		box = modelObject.AddComponent("BoxCollider");						// Add boxcollider.
		box.center = wmodel.transform.position;								// Center the boxcollider on the unit.
		box.size = Vector3(1.3,1.3,5);
		wmodel.name = "Monster Spawner";
		wmodel.init(this, manager, num);													// Initialize the device.
	} else if(type == "cake"){
		var cmodel = modelObject.AddComponent("CakeModel");			// Add a script to control direction of the unit.
		cmodel.name = "Cake";
		cmodel.init(this);
	} else {
		var model = modelObject.AddComponent("DeviceWallModel");			// Add a script to control direction of the unit.
		box = modelObject.AddComponent("BoxCollider");						// Add boxcollider.
		box.center = model.transform.position;								// Center the boxcollider on the unit.
		box.size = Vector3(2.5,.5,15);
		model.init(this, manager, num);													// Initialize the tileModel.
	}
	modelObject.SetActive(true);										// Turn on the object (the Update function will start being called).
}