
public class GameTutorial2 extends GameManager {
var displayText : String;

function Start(){
	super.Start();
	musicSound.clip = Resources.Load("Sounds/musicTutorial");
	musicSound.Play();
}


function levelInit(){
  roomCreate(-10,-10,0,"Plain2End.txt");
  roomCreate(-10, 10,1,"Plain2Cross.txt");
  roomCreate(-30, 10,1,"Plain2End.txt");
  roomCreate(-10, 30,2,"Plain2End.txt");
  roomCreate( 10, 10,2,"Hole3Tri.txt");
  roomCreate( 10,-10,0,"Walls1End.txt");
  roomCreate( 10, 30,2,"Plain1End.txt");
  addCake(-16,21);
  addCake(-3.5,6.5);
  addDevice(2,19.5,"barrier", 0, 2);
  addDevice(19.5,29.5,"barrier", 3, 3);


  charSpawner = addDevice(-16.5,18.5,"aSpawn",0,0);
  bossSpawner = addDevice(19.5,40,"aSpawn",1,0);
  addDevice(19.5,35,"mSpawn", 5, 7);						//todo: change the last number for a different kind of monster, first number changes # of monster spawned.
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  bossSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  addMonster(0, 35, character, -1, 1);
  addMonster(23, -4, character, -1, 2);
  displayText = "Monsters drop colors. Press F to pick them up!";
  currentLevel = 2;
}


function addBoss(x : float, y :float, c : Character){
	var monsterObject = new GameObject();					// Create a new empty game object that will hold a character.
	var monsterScript;
	monsterScript = monsterObject.AddComponent("Monster9");		// Add the monster.js script to the object.
	
	monsterScript.transform.parent = monsterFolder.transform;
	monsterScript.transform.position = Vector3(x,y,0);		// Position the character at x,y.								
	
	monsterScript.init(c);
	monsterScript.activateDistance = 3;
	boss = monsterScript;
	monsterScript.name = "Boss";
	monsterScript.manager = this;
	return monsterScript;
}

function Update () {
	if (winScreen || loseScreen){
		losewinTimer += Time.deltaTime;
		if (losewinTimer >= 2) {
			if(loseScreen){
			  winScreen = false;
			  loseScreen = false;
			  Application.LoadLevel("End");
			}
			else{
			  winScreen = false;
			  loseScreen = false;
			  Application.LoadLevel("LevelTutorial3");
			}
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
	if(character.model.yellow) displayText = "Cool blades! Use Space to roll.";
	if(character.model.blue) displayText = "Use Space to Jump now! Kill the boss!";
	clock = clock + Time.deltaTime;
	if(boss == null && clock > 1){
		win();
	}
	var cams : Array = Camera.allCameras;
	//print(cams.length);
	for(var cam : Camera in cams){
		cam.transform.position.x = character.model.transform.position.x;
		cam.transform.position.y = character.model.transform.position.y;
		if (cam != Camera.main) cam.transform.position.z = -20;
		}
}
function OnGUI() {
	super.OnGUI();
	GUI.Box (Rect((Screen.width/3)*1, (Screen.height/8)*7, (Screen.width/3)*2, Screen.height/8), displayText); 
        
}

}