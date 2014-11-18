public class GameTutorial3 extends GameManager {

var bluechange : boolean = true;
var displayText : String;
function levelInit(){
  roomCreate(-10, 30,2,"Plain2End.txt");
  roomCreate(-10, 10,0,"Plain2Opp.txt");
  roomCreate(-10,-10,0,"Hole3Opp.txt");
  roomCreate(-10,-30,0,"Plain1End.txt");
  charSpawner = addDevice(-0.5,33,"aSpawn",0,0);
  bossSpawner = addDevice(0,-23,"aSpawn",1,0);
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  bossSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  displayText = "Now you're ready for a real fight!";
  currentLevel = 3;
}


function addBoss(x : float, y :float, c : Character){
	var monsterObject = new GameObject();					// Create a new empty game object that will hold a character.
	var monsterScript;
	monsterScript = monsterObject.AddComponent("MonsterBoss");		// Add the monster.js script to the object.
	
	monsterScript.transform.parent = monsterFolder.transform;
	monsterScript.transform.position = Vector3(x,y,0);		// Position the character at x,y.								
	
	monsterScript.init(c);
	monsterScript.activateDistance = 6;
	boss = monsterScript;
	monsterScript.name = "Boss";
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
			  Application.LoadLevel("LevelComplete");
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
	
	if(clock < .5 && bluechange && !character.model.blue){
		character.model.changeBlue();
		bluechange=false;
	}
	
	if(boss == null && clock > 1){
		win();
	}
}
function OnGUI() {
	super.OnGUI();
	GUI.Button (Rect((Screen.width/3)*1, (Screen.height/8)*7, (Screen.width/3)*2, Screen.height/8), displayText); 
        
}

}