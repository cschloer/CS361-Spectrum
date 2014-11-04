// CAGE
// CSCI 361 Prototype

// selector

var modelObject : GameObject; 
function init() {
	modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);		// Create a quad object for holding the unit texture.
	modelObject.collider.enabled = false;								// Turn off MeshCollider
	modelObject.SetActive(false);										// Turn off the object so its script doesn't do anything until we're ready.
	var model = modelObject.AddComponent("SelectorModel");					// Add a script to control direction of the unit.
	model.init(this);													// Initialize the tileModel.
	modelObject.SetActive(true);										// Turn on the object (the Update function will start being called).
}