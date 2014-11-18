

public class GameTutorial1 extends GameManager {


function levelInit(){
  roomCreate(-10,-10,0,"Plain3End.txt");
  roomCreate(-10, 10,1,"Plain3Adj.txt");
  roomCreate( 10, 10,0,"Plain3Tri.txt");
  roomCreate( 30, 10,3,"Plain2End.txt");
  roomCreate( 10, 30,0,"Plain4Opp.txt");
  addDevice(19.5,28.5,"barrier", 3, 0);
  addCake(35,19.5);
  charSpawner = addDevice(-0.5,-6.5,"aSpawn",0,0);
<<<<<<< HEAD
  bossSpawner = addDevice(18,45,"aSpawn",1,0);
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  bossSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
=======
 	bossSpawner = addDevice(19.5,45,"aSpawn",1,0);
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  bossSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  	//addMonster(18,45,character,-1);
  addCake(34,19);
    addCake(-.5,-4);
    addCake(-.5,-1);
	addCake(-.5,2);
	addCake(-.5, 5);
	addCake(-.5,8);
    addCake(-.5,11);
    addCake(-.5,14);

>>>>>>> FETCH_HEAD

}


function addBoss(x : float, y :float, c : Character){
	var monsterObject = new GameObject();					// Create a new empty game object that will hold a character.
	var monsterScript;
	monsterScript = monsterObject.AddComponent("TutorialMonster1");		// Add the monster.js script to the object.
	
	monsterScript.transform.parent = monsterFolder.transform;
	monsterScript.transform.position = Vector3(x,y,0);		// Position the character at x,y.								
	
	monsterScript.init(c);
<<<<<<< HEAD
=======
	//monsterScript.activateDistance = 2;
>>>>>>> FETCH_HEAD
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