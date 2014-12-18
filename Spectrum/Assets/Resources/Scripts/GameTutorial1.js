

public class GameTutorial1 extends GameManager {

var displayText : String;

function Start(){
	super.Start();
	musicSound.clip = Resources.Load("Sounds/musicTutorial");
	musicSound.Play();
}

	
function levelInit(){
  roomCreate(-10,-10,0,"Plain3End.txt");
  roomCreate(-10, 10,1,"Plain3Adj.txt");
  roomCreate( 10, 10,3,"Plain3Tri.txt");
  roomCreate( 30, 10,3,"Plain2End.txt");
  roomCreate( 10, 30,0,"Plain4OppEnd.txt");
  addDevice(19.5,28.5,"barrier", 3, 7);
  charSpawner = addDevice(-0.5,-6.5,"aSpawn",0,0);
  bossSpawner = addDevice(18,45,"aSpawn",1,0);
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  bossSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  addCake(34,19);
    addCake(-.5,-4);
    addCake(-.5,-1);
	addCake(-.5,2);
	addCake(-.5, 5);
	addCake(-.5,8);
    addCake(-.5,11);
    addCake(19,25);

    displayText = "Use WASD keys to move! Collect cake!";
    currentLevel = 1;

}


function addBoss(x : float, y :float, c : Character){
	var monsterObject = new GameObject();					// Create a new empty game object that will hold a character.
	var monsterScript;
	monsterScript = monsterObject.AddComponent("TutorialMonster1");		// Add the monster.js script to the object.
	
	monsterScript.transform.parent = monsterFolder.transform;
	monsterScript.transform.position = Vector3(x,y,0);		// Position the character at x,y.								
	
	monsterScript.init(c);
	
	boss = monsterScript;
	monsterScript.name = "Boss";
	monsterScript.manager = this;
	return monsterScript;
}

function Update () {
	if (character.model.cakesCollected == 8) {
		displayText = "Click to fire at the boss monster!";
	}
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
			  Application.LoadLevel("LevelTutorial2");
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
	if(Input.GetKeyDown("p") && debug){
		win();
	}
}

function OnGUI() {
	super.OnGUI();
	GUI.skin.box.fontSize = 14;
	GUI.Box (Rect((Screen.width/3)*1, (Screen.height/8)*7, (Screen.width/3)*2, Screen.height/8), displayText); 
        
}

}