var characterFolder : GameObject;	// This will be an empty game object used for organizing heroes in the hierarchy pane.
var monsterFolder : GameObject;		// This will be an empty game object used for organizing monsters in the hierarchy pane.
var tileFolder : GameObject;		// This will be an empty game object used for organizing tiles in the hierarchy pane.
var character : Character;			// This is the hero character.
var monsters : Array;				// This array holds monsters.
var tiles : Array;					// This array holds tiles.


var colorFolder : GameObject;
var camera:GameObject;

var paused : boolean;
var clock: float;
var monsterCounter : int;
var clockFrequency : int;

var losewinTimer:float;
var loseScreen:boolean;
var winScreen:boolean;

var musicSound : AudioSource;

var explosionFire : ParticleSystem;
var explosionIce : ParticleSystem;
var explosionGreen : ParticleSystem;


// Called once when the script is created.
function Start () {
	explosionFire.gameObject.SetActive(false); // make it inactive in beginning
	explosionIce.gameObject.SetActive(false); // make it inactive in beginning
	explosionGreen.gameObject.SetActive(false); // make it inactive in beginning
	characterFolder = new GameObject();  
	characterFolder.name = "Character";
	monsterFolder = new GameObject();
	monsterFolder.name = "Monsters";
	monsters = new Array();
	tileFolder = new GameObject();
	tileFolder.name = "Tiles";
	tiles = new Array();

	colorFolder = new GameObject();
	colorFolder.name = "Color Circles";
	
	addCharacter(0,0);
	addCircle(0); // blue circle
	addCircle(1); // red circle
	addCircle(2); // yellow circle	

	addWeapon(character);
	
	protolevelInit();
	
	paused = false;
	clock = 0.0;
	monsterCounter = 0;
	clockFrequency = 15;
	musicSound = gameObject.AddComponent("AudioSource") as AudioSource;
	musicSound.clip = Resources.Load("Sounds/music");
	musicSound.volume = .6;
	musicSound.loop = true;
	musicSound.Play();
	winScreen = false;
	loseScreen = false;
}

// Called every frame.
function Update () {
	if (winScreen || loseScreen){
		losewinTimer += Time.deltaTime;
		if (losewinTimer >= 2) {
			winScreen = false;
			loseScreen = false;
			Application.LoadLevel("End");

		}
		return;
	}
	if (Input.GetKeyUp(KeyCode.Escape)){
		if(!paused){
			Time.timeScale = 0;
			paused = !paused;
		}
		else{
			Time.timeScale = 1;
			paused = !paused;
		}
	}
	clock = clock + Time.deltaTime;
	spawnMonster();
}


// Adds: These functions add certain elements.
function addCharacter(x : float , y : float) {
	var characterObject = new GameObject();									// Create a new empty game object that will hold a character.
	var characterScript = characterObject.AddComponent("Character");		// Add the character.js script to the object.
																			// We can now refer to the object via this script.
	characterScript.transform.parent = characterFolder.transform;			// Set the character's parent object to be the character folder.
	characterScript.transform.position = Vector3(x,y,0);					// Position the character at x,y.								
	
	characterScript.init(this);												// Initialize the character script.
	
	character = characterScript;											// Add the character to the characters array for future access.
	characterScript.name = "CharacterScript";								// Give the character object a name in the Hierarchy pane.				
}


function addCircle(color:int){
	//var colorObject = new GameObject();					// Create a new empty game object that will hold a color.
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the gem texture.
	var colorScript = modelObject.AddComponent("ColorCircle");		// Add the color.js script to the object.
												
	modelObject.collider.enabled = false;
	modelObject.AddComponent(BoxCollider);
	modelObject.GetComponent(BoxCollider).isTrigger = true;
	modelObject.GetComponent(BoxCollider).size = Vector3(.5,.5,.5);
	/*modelObject.AddComponent(Rigidbody);
	modelObject.GetComponent(Rigidbody).isKinematic = true;
	modelObject.GetComponent(Rigidbody).useGravity = false;
	modelObject.GetComponent(Rigidbody).inertiaTensor = Vector3(1, 1, 1);
*/
																																													// We can now refer to the object via this script.
	colorScript.transform.parent = colorFolder.transform;	// Set the color's parent object to be the color folder.							
	colorScript.init(color, character.model);							// Initialize the color script.
	
}

function spawnMonster() {
	if (clock%clockFrequency <.1 && clock/clockFrequency > monsterCounter){
		var rX : float;
		var rY : float;
		var rType: int;
		rX = Random.Range(-10.0,10.0);
		rY = Random.Range(-10.0,10.0);
		rType = Random.Range(1,7);
		addMonster(rX,rY,character,rType);
		monsterCounter++;
		/*
		if (clockFrequency > 1){
			clockFrequency -= 1;
		}
		*/
		//print("spawned monster " + rType + ", " + clockFrequency);
	}
}


function addMonster(x : float, y :float, c : Character, type: int){
	var monsterObject = new GameObject();					// Create a new empty game object that will hold a character.
	var monsterScript;
	switch(type){
		case 1:
			monsterScript = monsterObject.AddComponent("Monster1");
			break;
		case 2:
			monsterScript = monsterObject.AddComponent("Monster2");		// Add the monster2.js script to the object.
			break;
		case 3:
			monsterScript = monsterObject.AddComponent("Monster3");
			break;
		case 4:
			monsterScript = monsterObject.AddComponent("Monster4");
			break;
		case 5:
			monsterScript = monsterObject.AddComponent("Monster5");
			break;
		case 6:
			monsterScript = monsterObject.AddComponent("Monster6");		// Add the monster2.js script to the object.
			break;
		default:
			monsterScript = monsterObject.AddComponent("Monster");		// Add the monster.js script to the object.
	}
	
	monsterScript.transform.parent = monsterFolder.transform;
	monsterScript.transform.position = Vector3(x,y,0);		// Position the character at x,y.								
	
	monsterScript.init(c);
	monsters.Add(monsterScript);
	monsterScript.name = "Monster"+ monsters.length;
}

function addWeapon(c : Character){
	var weaponObject = new GameObject();
	var weaponScript = weaponObject.AddComponent("Weapon");
	
	weaponScript.transform.position = character.transform.position;
	
	weaponScript.init(c);
}

function addTile(x : float, y :float, t : String){
	var tileObject = new GameObject();						// Create a new empty game object that will hold a character.
	var tileScript = tileObject.AddComponent("Tile");		// Add the character.js script to the object.
	
	tileScript.transform.parent = tileFolder.transform;
	tileScript.transform.position = Vector3(x,y,1);			// Position the character at x,y.								
	
	tileScript.init(t);
	tiles.Add(tileScript);
	tileScript.name = "Tile" + tiles.length;
}

// ProtolevelInit
// Initiates the prototype level.
function protolevelInit(){
  for( i = -10; i <=10; i++) {
    for( j = -10; j <=10; j++){
      if( i == -10 || i == 10 || j == -10 || j == 10){
      	addTile(i,j,"Wall");
      }
      else{
      	addTile(i,j,"Floor");
      }
    }
  }
}


function lose(){
	loseScreen = true;
	losewinTimer = 0;

}

function win(){
	winScreen = true;
	losewinTimer = 0;

}

function OnGUI() {
	GUI.backgroundColor = Color.white;
	GUI.skin.label.fontSize = 14;
	if (loseScreen){
		 Application.LoadLevel("End");
	}
	else if (winScreen){
		GUI.backgroundColor = Color.black;
		GUI.color = Color.white;
		GUI.skin.box.fontSize = 26;
		GUI.Box(Rect(0,0,Screen.width,Screen.height), "\n\n\n\n\n\n You win!");
	} else if(paused){
		GUI.backgroundColor = Color.black;
		GUI.color = Color.white;
		GUI.skin.box.fontSize = 26;
		GUI.Box(Rect(0,0,Screen.width,Screen.height), "\n\n\n\n\n\n Paused!\nHealth: "+character.health+"\nScore:"+character.killedMonsters);
	}
	else {
	}
	
	var width1 = Screen.width/50;
	var height1 = width1;
	var boxSize = Screen.width/10;
	
	// Controls the jumping image of the TraitMap
	var textJump : Texture2D;
	textJump = Resources.Load("Textures/TraitMap_Jump", Texture2D);
	if (character.model.blue == true){
		GUI.color.a = 1;
		GUI.DrawTexture(Rect(width1,height1,boxSize,boxSize), textJump, ScaleMode.ScaleToFit, true, 0);
	} else {
		GUI.color.a = 0.5;
		GUI.DrawTexture(Rect(width1,height1,boxSize,boxSize), textJump, ScaleMode.ScaleToFit, true, 0);
	}
	
	// -------> This is the TraitMap
	
	// Controls the rolling image of the TraitMap
	var textRoll : Texture2D;
	textRoll = Resources.Load("Textures/TraitMap_Roll", Texture2D);
	if (character.model.blue == true){
		GUI.color.a = 0.5;
		GUI.DrawTexture(Rect(width1,height1*3+boxSize/2,boxSize,boxSize), textRoll, ScaleMode.ScaleToFit, true, 0);
	} else {
		GUI.color.a = 1;
		GUI.DrawTexture(Rect(width1,height1*3+boxSize/2,boxSize,boxSize), textRoll, ScaleMode.ScaleToFit, true, 0);
	}	
	
	// Controls the swinging image of the TraitMap
	var textSwing : Texture2D;
	textSwing = Resources.Load("Textures/TraitMap_Swing", Texture2D);
	if (character.model.yellow == true){
		GUI.color.a = 1;
		GUI.DrawTexture(Rect(width1*3 + boxSize/2,height1,boxSize,boxSize), textSwing, ScaleMode.ScaleToFit, true, 0);
	} else {
		GUI.color.a = 0.5;
		GUI.DrawTexture(Rect(width1*3 + boxSize/2,height1,boxSize,boxSize), textSwing, ScaleMode.ScaleToFit, true, 0);
	}
	
	// Controls the throwing image of the TraitMap
	var textThrow : Texture2D;
	textThrow = Resources.Load("Textures/TraitMap_Throw", Texture2D);
	if (character.model.yellow == true){
		GUI.color.a = 0.5;
		GUI.DrawTexture(Rect(width1*3 + boxSize/2,height1*3+boxSize/2,boxSize,boxSize), textThrow, ScaleMode.ScaleToFit, true, 0);
	} else {
		GUI.color.a = 1;
		GUI.DrawTexture(Rect(width1*3 + boxSize/2,height1*3+boxSize/2,boxSize,boxSize), textThrow, ScaleMode.ScaleToFit, true, 0);
	}	
	
	// Controls the swinging image of the TraitMap
	var textBig : Texture2D;
	textBig = Resources.Load("Textures/TraitMap_Big", Texture2D);
	if (character.model.red == true){
		GUI.color.a = 1;
		GUI.DrawTexture(Rect(2*(width1*3 + boxSize/2),height1,boxSize,boxSize), textBig, ScaleMode.ScaleToFit, true, 0);
	} else {
		GUI.color.a = 0.5;
		GUI.DrawTexture(Rect(2*(width1*3 + boxSize/2),height1,boxSize,boxSize), textBig, ScaleMode.ScaleToFit, true, 0);
		GUI.color.a = 1;

	}
	
	// Controls the throwing image of the TraitMap
	var textSmall : Texture2D;
	textSmall = Resources.Load("Textures/TraitMap_Small", Texture2D);
	if (character.model.red == true){
		GUI.color.a = 0.5;
		GUI.DrawTexture(Rect(2*(width1*3 + boxSize/2),height1*3+boxSize/2,boxSize,boxSize), textSmall, ScaleMode.ScaleToFit, true, 0);
	} else {
		GUI.color.a = 1;
		GUI.DrawTexture(Rect(2*(width1*3 + boxSize/2),height1*3+boxSize/2,boxSize,boxSize), textSmall, ScaleMode.ScaleToFit, true, 0);
	}	
	
	// --------> This is the lifehearts
	var textHealth : Texture2D;
	
	if (character.health >= 3) {
		textHealth = Resources.Load("Textures/heart3", Texture2D);
		GUI.DrawTexture(Rect((Screen.width/7)*5, height1, Screen.width/4, Screen.height/8), textHealth, ScaleMode.StretchToFill, true, 0);
	}else if (character.health == 2) {
		textHealth = Resources.Load("Textures/heart2", Texture2D);
		GUI.DrawTexture(Rect((Screen.width/7)*5, height1, Screen.width/4, Screen.height/8), textHealth, ScaleMode.StretchToFill, true, 0);
	}else if (character.health == 1) {
		textHealth = Resources.Load("Textures/heart1", Texture2D);
		GUI.DrawTexture(Rect((Screen.width/7)*5, height1, Screen.width/4, Screen.height/8), textHealth, ScaleMode.StretchToFill, true, 0);
	}else {
		textHealth = Resources.Load("Textures/heart0", Texture2D);
		GUI.DrawTexture(Rect((Screen.width/7)*5, height1, Screen.width/4, Screen.height/8), textHealth, ScaleMode.StretchToFill, true, 0);
	}				
}
