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
	type = 1;
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
	GUI.Label(Rect(300, 0, 300, 30), "Life's a great balancing act.");

	GUI.Label(Rect(270, 20, 200, 30), "Move speed: " + character.model.moveSpeed);
	character.model.moveSpeed = GUI.HorizontalSlider (Rect (460, 25, 100, 30), character.model.moveSpeed, 2.0, 10.0);
	GUI.Label(Rect(270, 40, 200, 30), "Turn speed: " + character.model.turnSpeed);
	character.model.turnSpeed = GUI.HorizontalSlider (Rect (460, 45, 100, 30), character.model.turnSpeed, 0.0, 5.0);
	if(character.model.yellow){
		GUI.Label(Rect(270, 60, 200, 30), "Swing time: " + character.weapon.swingTime);
		character.weapon.swingTime = GUI.HorizontalSlider (Rect (460, 65, 100, 30), character.weapon.swingTime, 0.1, .6);
		GUI.Label(Rect(270, 80, 200, 30), "Swing recovery: " + character.weapon.swingRecovery);
		character.weapon.swingRecovery = GUI.HorizontalSlider (Rect (460, 85, 100, 30), character.weapon.swingRecovery, 0.0, .6);
		GUI.Label(Rect(270, 100, 200, 30), "Swing arc: " + character.weapon.swingArc);
		character.weapon.swingArc = GUI.HorizontalSlider (Rect (460, 105, 100, 30), character.weapon.swingArc, 1, 270);
		
	}else{
		GUI.Label(Rect(270, 60, 200, 30), "Throw time: " + character.weapon.throwTime);
		character.weapon.throwTime = GUI.HorizontalSlider (Rect (460, 65, 100, 30), character.weapon.throwTime, 0.1, 1.5);
		GUI.Label(Rect(270, 80, 200, 30), "Throw recovery: " + character.weapon.throwRecovery);
		character.weapon.throwRecovery = GUI.HorizontalSlider (Rect (460, 85, 100, 30), character.weapon.throwRecovery, 0.0, 1.5);
		GUI.Label(Rect(270, 100, 200, 30), "Throw distance: " + character.weapon.throwDistance);
		character.weapon.throwDistance = GUI.HorizontalSlider (Rect (460, 105, 100, 30), character.weapon.throwDistance, 1.0, 8.0);
	}
	
	if(character.model.blue){
		GUI.Label(Rect(270, 120, 200, 30), "Jump time: " + character.model.jumpTime);
		character.model.jumpTime = GUI.HorizontalSlider (Rect (460, 125, 100, 30), character.model.jumpTime, 0.1, 3.0);
		GUI.Label(Rect(270, 140, 200, 30), "Jump speed: x" + character.model.jumpSpeedMultiplier);
		character.model.jumpSpeedMultiplier = GUI.HorizontalSlider (Rect (460, 145, 100, 30), character.model.jumpSpeedMultiplier, 0.5, 3.0);
		GUI.Label(Rect(270, 160, 200, 30), "Jump recovery: " + character.model.jumpCooldown);
		character.model.jumpCooldown = GUI.HorizontalSlider (Rect (460, 165, 100, 30), character.model.jumpCooldown, 0, 2.0);
	} else{
		GUI.Label(Rect(270, 120, 200, 30), "Roll time: " + character.model.rollTime);
		character.model.rollTime = GUI.HorizontalSlider (Rect (460, 125, 100, 30), character.model.rollTime, 0.1, 2.0);
		GUI.Label(Rect(270, 140, 200, 30), "Roll speed: x" + character.model.rollSpeedMultiplier);
		character.model.rollSpeedMultiplier = GUI.HorizontalSlider (Rect (460, 145, 100, 30), character.model.rollSpeedMultiplier, 0.5, 6.0);
		GUI.Label(Rect(270, 160, 200, 30), "Roll recovery: " + character.model.rollCooldown);
		character.model.rollCooldown = GUI.HorizontalSlider (Rect (460, 165, 100, 30), character.model.rollCooldown, 0, 2.0);
	}
	
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
		GUI.Label(Rect(0,0,Screen.width,Screen.height),"Health: " + character.health + "\nKilled Monsters: "+character.killedMonsters);
	}
}
