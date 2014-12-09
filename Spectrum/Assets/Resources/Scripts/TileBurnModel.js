// CAGE
// CSCI 361 Prototype

// tileHoleModel
// Burn Model, move quick.

var owner : Tile;
var character : CharacterModel;
var durationCount : float;

function init(own : Tile) {
	owner = own;									// Set up a pointer to the marble object containing this model.
	durationCount = 0;
	
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,0);		// Center the model on the parent.
	name = "Tile Burn Model";						// Name the object.
	
	

	renderer.material.mainTexture = Resources.Load("Textures/gem3", Texture2D);		// Set the texture.  Must be in Resources folder.
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	transform.localScale += Vector3(0.3,0.3,0);

	
}

function Update(){
	
}


function OnTriggerEnter(col:Collider){
	if(col.gameObject.name.Contains("Character") || col.gameObject.name.Contains("Monster"))
		startTimer();
}

function OnTriggerStay(col:Collider){
	if(checkTime()){
		if(col.gameObject.name.Contains("Character")){
			if(!col.gameObject.GetComponent(CharacterModel).rolling){
				col.gameObject.GetComponent(CharacterModel).character.hurt();
				startTimer();
			}
			else{
				startTimer();
			}
		}
		/*else if(col.gameObject.name.Contains("Monster")){
			col.gameObject.GetComponent(MonsterModel).hurt();
			startTimer();
		}*/
	}
	else{
		addTime();
	}
}

function startTimer(){
	durationCount = 0;
}

function addTime(){
	durationCount = durationCount + Time.deltaTime;
}

function checkTime(){
	if(durationCount > 0.8*Time.timeScale) return true;
	else return false;
}