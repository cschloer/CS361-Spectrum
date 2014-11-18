

public class GameTutorial1 extends GameManager {


function levelInit(){
  roomCreate(-10,-10,0,"Plain3End.txt");
  roomCreate(-10, 10,1,"Plain3Adj.txt");
  roomCreate( 10, 10,0,"Plain3Tri.txt");
  roomCreate( 30, 10,3,"Plain2End.txt");
  roomCreate( 10, 30,0,"Plain4Opp.txt");
  charSpawner = addDevice(-0.5,-6.5,"aSpawn",0,0);
  bossSpawner = addDevice(19.5,45,"aSpawn",1,0);
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  bossSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
}


function addBoss(x : float, y :float, c : Character){
	var monsterObject = new GameObject();					// Create a new empty game object that will hold a character.
	var monsterScript;
	monsterScript = monsterObject.AddComponent("Monster1");		// Add the monster.js script to the object.
	
	monsterScript.transform.parent = monsterFolder.transform;
	monsterScript.transform.position = Vector3(x,y,0);		// Position the character at x,y.								
	
	monsterScript.init(c);
	monsterScript.activateDistance = 2;
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
	if(boss == null && clock > 1){
		win();
	}
}

}