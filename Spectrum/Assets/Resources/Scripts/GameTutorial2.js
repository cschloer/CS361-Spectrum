
public class GameTutorial2 extends GameManager {


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
  bossSpawner = addDevice(19.5,45,"aSpawn",1,0);
  addDevice(19.5,41,"mSpawn", 3, 1);						//todo: change the last number for a different kind of monster, first number changes # of monster spawned.
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  bossSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
   addMonster(0, 35, character, -1, 1);
  addMonster(23, -4, character, -1, 2);
}


function addBoss(x : float, y :float, c : Character){
	var monsterObject = new GameObject();					// Create a new empty game object that will hold a character.
	var monsterScript;
	monsterScript = monsterObject.AddComponent("Monster2");		// Add the monster.js script to the object.
	
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