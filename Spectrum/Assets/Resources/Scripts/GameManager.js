// Spectrum
// Prototype Stage
// Fall 2014

// Imports:
import System.IO;

// Globals
var characterFolder : GameObject;	// This will be an empty game object used for organizing heroes in the hierarchy pane.
var monsterFolder : GameObject;		// This will be an empty game object used for organizing monsters in the hierarchy pane.
var tileFolder : GameObject;		// This will be an empty game object used for organizing tiles in the hierarchy pane.
var colorFolder : GameObject;		// This will be an empty game object used for organizing colors in the hierarchy pane.
var deviceFolder : GameObject;		// This will be an empty game object used for organizing devices in the hierarchy pane.
var character : Character;			// This is the hero character.
var devices : Array;				// This array holds devices.
var monsters : Array;				// This array holds monsters.
var tiles : Array;					// This array holds tiles.
var camera:GameObject;				// Camera GameObject for look control
var paused : boolean;				// Boolean for pause menu
var clock: float;					// Clock monitor variable.
var monsterCounter : int;			// Counter for monster spawning.
var clockFrequency : int;			// Timer for monster spawning.
var losewinTimer:float;				// Timer for gameover.
var loseScreen:boolean;				// Boolean for gamewin.
var winScreen:boolean;				// Boolean for gamelose.
var musicSound : AudioSource;		// Game music.
var explosionFire : ParticleSystem;
var explosionIce : ParticleSystem;
var explosionGreen : ParticleSystem;


// Start
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
	deviceFolder = new GameObject();
	deviceFolder.name = "Devices";
	devices = new Array();
	tileFolder = new GameObject();
	tileFolder.name = "Tiles";
	tiles = new Array();
	
	Physics.IgnoreLayerCollision(6,7);			// For cliffs and jumping.

	colorFolder = new GameObject();
	colorFolder.name = "Color Circles";
	

	addCharacter(0,-5);

	//addCircle(0); // blue circle
	//addCircle(1); // red circle
	//addCircle(2); // yellow circle	
	
	addWeapon(character);
	
	addCake(1,0);
	addCake(2,0);
	addCake(3,0);
	addCake(4,0);
	
	addCake(-16,21);
	addCake(25,21);
	addCake(-16,42);
	addCake(8,49);
	
	addCircle(0); 
	addCircle(1);
	addCircle(2);
	
	protolevelInit();
	
	paused = false;
	clock = 0.0;
	monsterCounter = 0;
	clockFrequency = 5;
	musicSound = gameObject.AddComponent("AudioSource") as AudioSource;
	musicSound.clip = Resources.Load("Sounds/music");
	musicSound.volume = .6;
	musicSound.loop = true;
	musicSound.Play();
	winScreen = false;
	loseScreen = false;
	addMonster(40, 20, character, 7);
}

// Update
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
	//spawnMonster();
}


// *******************************************
// 				  Add Functions
// *******************************************

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

function addCake(x : float , y : float) {
	var cakeObject = new GameObject();					
	var cakeScript = cakeObject.AddComponent("Cake");		
	cakeScript.transform.position = Vector3(x,y,0);		
	cakeScript.init();
	//cakeObject.collider.enabled = false;
	cakeObject.AddComponent(BoxCollider);
	cakeObject.GetComponent(BoxCollider).name = "cakes";
	cakeObject.GetComponent(BoxCollider).isTrigger = true;
	cakeObject.GetComponent(BoxCollider).size = Vector3(1,1,10);
											
	
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
	//type = 1;
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
			monsterScript = monsterObject.AddComponent("MonsterBoss");		// Add the monster.js script to the object.
	}
	
	monsterScript.transform.parent = monsterFolder.transform;
	monsterScript.transform.position = Vector3(x,y,0);		// Position the character at x,y.								
	
	monsterScript.init(c);
	monsters.Add(monsterScript);
	monsterScript.name = "Monster"+ monsters.length;
	return monsterObject;
}

function addWeapon(c : Character){
	var weaponObject = new GameObject();
	var weaponScript = weaponObject.AddComponent("Weapon");
	
	weaponScript.transform.position = character.transform.position;
	
	weaponScript.init(c);
}

function addDevice(x : float, y :float, t : String, n : int){
	var deviceObject = new GameObject();						// Create a new empty game object that will hold a character.
	var deviceScript = deviceObject.AddComponent("Device");		// Add the character.js script to the object.
	
	deviceScript.transform.parent = deviceFolder.transform;
	deviceScript.transform.position = Vector3(x,y,1);			// Position the character at x,y.								
	
	deviceScript.init(t, this, n);
	devices.Add(deviceScript);
	deviceScript.name = "Device" + tiles.length;
}

function addTile(x : float, y :float, t : String){
	var tileObject = new GameObject();						// Create a new empty game object that will hold a character.
	var tileScript = tileObject.AddComponent("Tile");		// Add the character.js script to the object.
	
	tileScript.transform.parent = tileFolder.transform;
	tileScript.transform.position = Vector3(x,y,1);			// Position the character at x,y.								
	
	tileScript.init(t, 0);
	tiles.Add(tileScript);
	tileScript.name = "Tile" + tiles.length;
}

// *******************************************
// 				Level Initiation
// *******************************************

// ProtolevelInit
// Initiates the prototype level.
function protolevelInit(){
  roomCreate(-10,-10,0,"Plain1End.txt");
  roomCreate(-10, 10,0,"Plain2Cross.txt");
  roomCreate(-30, 10,0,"Hole2Tri.txt");
  roomCreate(-30,-10,0,"Hole2End.txt");
  roomCreate(-30, 30,2,"Walls1End.txt");
  roomCreate( 10, 10,1,"Hole3Tri.txt");
  roomCreate( 10,-10,0,"Plain2End.txt");
  roomCreate( 30, 10,3,"Plain1End.txt");
  roomCreate(-10, 30,2,"Plain1End.txt");
  addDevice(-4,40,"mSpawn", 3);
  addDevice( 4,40,"mSpawn", 3);
  addDevice(-14,38,"mSpawn", 4);
  addDevice(20,5,"mSpawn", 4);
  addDevice(30,20.5,"barrier",0);
}
// Room Creation
// Initiates room off of a txt file.
function roomCreate (xS: float, yS: float, rot: int, fileName: String) {
	var stream = new StreamReader("Assets/Resources/Levels/"+fileName);
	var c : char;
	var xLength = parseInt(stream.ReadLine());
	var yLength = parseInt(stream.ReadLine());
	switch( rot ){
		case 1:
			for( i = xS+19; i >= xS; i-- ) {
    			for( j = yS+20; j > yS; j-- ){
    				c = stream.Read();
    				if(c == System.Environment.NewLine)
    					c = stream.Read();
    				popTile(c, i, j);
				}
  			}
  			break;
		case 2:
			for( i = yS+1; i <= yS+20; i++ ) {
    			for( j = xS+19; j >= xS; j-- ){
    				c = stream.Read();
    				if(c == System.Environment.NewLine)
    					c = stream.Read();
    				popTile(c, j, i);
				}
  			}
  			break;
  		case 3:
			for( i = xS; i < xS+20; i++ ) {
    			for( j = yS+1; j <= yS+20; j++ ){
    				c = stream.Read();
    				if(c == System.Environment.NewLine)
    					c = stream.Read();
    				popTile(c, i, j);
				}
  			}
  			break;
  		default:
			for( i = yS+20; i > yS; i-- ) {
    			for( j = xS; j < xS+20; j++ ){
    				c = stream.Read();
    				if(c == System.Environment.NewLine)
    					c = stream.Read();
    				popTile(c, j, i);
				}
  			}
  			break;
	}
}
// pop tile
// Creates a tile based on character read input
function popTile(c: char, xpos: float, ypos: float){
   	if(c == 'W'){
    	addTile(xpos,ypos,"Wall");
    }
    else if(c == 'H'){
    	addTile(xpos,ypos,"Hole");
    }
    else if (c == "T"){
    	addTile(xpos,ypos,"Floor");
    }
}

// *******************************************
// 			   Win and Lose Screens
// *******************************************

function lose(){
	loseScreen = true;
	losewinTimer = 0;
}

function win(){
	winScreen = true;
	losewinTimer = 0;
}

// *******************************************
// 					  GUI
// *******************************************

function OnGUI() {	

	//Balancing sliders
	/*
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
	*/
	
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
		GUI.color.a = 0.3;
		GUI.DrawTexture(Rect(width1,height1,boxSize,boxSize), textJump, ScaleMode.ScaleToFit, true, 0);
	}
			

	// -------> This is the TraitMap
	GUI.color.a = 1;
	// Controls the rolling image of the TraitMap
	var textRoll : Texture2D;
	textRoll = Resources.Load("Textures/TraitMap_Roll", Texture2D);
	if (character.model.blue == true){
		GUI.color.a = 0.3;
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
		GUI.color.a = 0.3;
		GUI.DrawTexture(Rect(width1*3 + boxSize/2,height1,boxSize,boxSize), textSwing, ScaleMode.ScaleToFit, true, 0);
	}
	
	// Controls the throwing image of the TraitMap
	var textThrow : Texture2D;
	textThrow = Resources.Load("Textures/TraitMap_Throw", Texture2D);
	if (character.model.yellow == true){
		GUI.color.a = 0.3;
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
		GUI.color.a = 0.3;
		GUI.DrawTexture(Rect(2*(width1*3 + boxSize/2),height1,boxSize,boxSize), textBig, ScaleMode.ScaleToFit, true, 0);
		GUI.color.a = 1;

	}
	
	// Controls the throwing image of the TraitMap
	var textSmall : Texture2D;
	textSmall = Resources.Load("Textures/TraitMap_Small", Texture2D);
	if (character.model.red == true){
		GUI.color.a = 0.3;
		GUI.DrawTexture(Rect(2*(width1*3 + boxSize/2),height1*3+boxSize/2,boxSize,boxSize), textSmall, ScaleMode.ScaleToFit, true, 0);
	} else {
		GUI.color.a = 1;
		GUI.DrawTexture(Rect(2*(width1*3 + boxSize/2),height1*3+boxSize/2,boxSize,boxSize), textSmall, ScaleMode.ScaleToFit, true, 0);
	}	
	
	// --------> This is the lifehearts
	var textHealth : Texture2D;
	GUI.color.a = 1;
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
	
	// ----------> Cake
	var textCake : Texture2D;
	GUI.color.a = 1;
	var currentCakes = character.model.cakesCollected;
	
	textCake = Resources.Load("Textures/cake" + currentCakes, Texture2D);
	GUI.DrawTexture(Rect(width1, (Screen.height/4)*3, Screen.height/3, Screen.height/4), textCake, ScaleMode.StretchToFill, true, 0);


																	
}
