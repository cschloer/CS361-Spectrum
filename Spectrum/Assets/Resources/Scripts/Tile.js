// CAGE
// CSCI 361 Prototype

// tile

var modelObject : GameObject; 
var box : BoxCollider;			// For walls and cliffs
var type : String;
var manager : GameManager;
function init(t: String, or: int, tiles: Array) {
	type = t;
	modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);		// Create a quad object for holding the unit texture.
	modelObject.collider.enabled = false;								// Turn off MeshCollider
	modelObject.SetActive(false);										// Turn off the object so its script doesn't do anything until we're ready.
	if(type == "Wall"){
		var wmodel = modelObject.AddComponent("TileWallModel");					// Add a script to control direction of the unit.
		box = modelObject.AddComponent("BoxCollider");						// Add boxcollider.
		box.center = wmodel.transform.position;								// Center the boxcollider on the unit.
		box.size = Vector3(1.3,1.3,20);
		wmodel.transform.position.z += -0.1;
		box.isTrigger = false;

		wmodel.init(this, tiles);													// Initialize the tileModel.
	} else if(type == "Hole") {
		var hmodel = modelObject.AddComponent("TileHoleModel");					// Add a script to control direction of the unit.
		box = modelObject.AddComponent("BoxCollider");						// Add boxcollider.
		box.center = hmodel.transform.position;								// Center the boxcollider on the unit.
		box.size = Vector3(.4,.4,4);
		box.isTrigger = true;
		hmodel.init(this);													// Initialize the tileModel.
	} else if(type == "Cliff") {
		var cmodel = modelObject.AddComponent("TileHoleModel");					// Add a script to control direction of the unit.
		box = modelObject.AddComponent("BoxCollider");						// Add boxcollider.
		box.center = cmodel.transform.position;								// Center the boxcollider on the unit.
		box.size = Vector3(1,1,4);
		cmodel.init(this, or);													// Initialize the tileModel.
	} else {
		var model = modelObject.AddComponent("TileFloorModel");					// Add a script to control direction of the unit.
		box = modelObject.AddComponent("BoxCollider");						// Add boxcollider.
		box.center = model.transform.position;								// Center the boxcollider on the unit.
		box.size = Vector3(1,1,1);
		box.isTrigger = true;
		model.init(this);													// Initialize the tileModel.
	}
	modelObject.SetActive(true);										// Turn on the object (the Update function will start being called).
}

function Update(){
	var distance : Vector3 = modelObject.transform.position - manager.character.model.transform.position;
	if (distance.magnitude > 20) {
		modelObject.transform.renderer.material.color.a = 0; 
		return;
	}
	var flashLight = 1.2- (distance.magnitude/1.5) / (8) - (Vector3.Angle(distance, manager.character.model.lookDirection)/130);
	var aoeLight = 1-(distance.magnitude/1.2 / (4));
	if (flashLight > aoeLight) modelObject.transform.renderer.material.color.a = flashLight;
	else modelObject.transform.renderer.material.color.a = aoeLight;
	if (modelObject.transform.renderer.material.color.a < .05)  modelObject.transform.renderer.material.color.a = .05;
}

