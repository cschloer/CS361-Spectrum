// CAGE
// CSCI 361 Prototype

// devices
// todo: buttons, doors, monster spawn

var modelObject : GameObject; 
var box : BoxCollider;			// For colliding.
var type : String;
var data : int;
var frozen : boolean;
function init(t: String, manager: GameManager, numA : int, numB : int) {	// NumA and NumB are used for different purposes by different devices.
	type = t;
	data = numA;
	frozen = false;
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
		wmodel.init(this, manager, numA);													// Initialize the device.
	} else if(type == "cake"){
		var cmodel = modelObject.AddComponent("CakeModel");			// Add a script to control direction of the unit.
		cmodel.name = "Cake";
		modelObject.AddComponent(BoxCollider);
		modelObject.GetComponent(BoxCollider).name = "cakes";
		modelObject.GetComponent(BoxCollider).isTrigger = true;
		modelObject.GetComponent(BoxCollider).size = Vector3(1,1,10);
		cmodel.init(this);
	}else if(type == "aSpawn"){
		var amodel = modelObject.AddComponent("SpawnPointModel");			// Add a script to control direction of the unit.
		amodel.name = "Spawn Point";
		amodel.init(this, manager, numA);
	} else {
		model = modelObject.AddComponent("DeviceWallModel");			// Add a script to control direction of the unit.
		box = modelObject.AddComponent("BoxCollider");						// Add boxcollider.
		box.center = model.transform.position;								// Center the boxcollider on the unit.
		box.size = Vector3(2.5,1,15);
		model.init(this, manager, numA);													// Initialize the tileModel.
		model.name = "Color Wall";
	}
	modelObject.SetActive(true);										// Turn on the object (the Update function will start being called).
}