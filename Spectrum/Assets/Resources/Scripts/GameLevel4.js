﻿

public class GameLevel4 extends GameManager {


function Start(){
	explosionWorm2.gameObject.SetActive(false);
	super.Start();
	musicSound.clip = Resources.Load("Sounds/rhysGameMusic");
	musicSound.Play();
}

function levelInit(){
  roomCreate(-10,30,2,"Plain3Adj.txt");
  roomCreate(-10,10,1,"Walls1Cross.txt");
  roomCreate(-30,30,3,"Comb2Cross.txt");
  roomCreate(-30,10,0,"Hole3Adj.txt");
  roomCreate(-50,30,1,"Plain2End.txt");
  roomCreate(-30,50,2,"Comb1End.txt");
  roomCreate(10,10,3,"Comb2End.txt");
  roomCreate(-10,-10,0,"Small1Cross.txt");
  roomCreate(-10,-30,0,"Plain1Tri.txt");
  roomCreate( 10,-10,2,"Lava1Adj.txt");
  roomCreate( 10,-30,3,"Lava1Adj.txt");
  roomCreate(-30,-10,1,"Lava2Adj.txt");
  roomCreate(-30,-30,2,"Comb1Opp.txt");
  roomCreate(-10,-50,3,"Plain2Tri.txt");
  roomCreate(-30,-50,0,"Small1Tri.txt");
  roomCreate( 10,-50,3,"Boss4End.txt");
  
  addCake(-25,62);
  addCake(27.5,18.5);
  addCake(12,-6);
  addCake(-0.5,-19.5);
  addCake(-27.5,-0.5);
  addCake(3,-41);
  addCake(-1.5,22);
  
  addDevice(9.5,-40.5,"barrier", 0, 7);
  
  addDevice(-25.5,39.5,"mSpawn", 2, 4);	// Room -3,0
  addDevice(-35.5,39.5,"mSpawn", 6, 7);	// Room -3,0
  addDevice(-20.5,63.5,"mSpawn", 5, 8);	// Room -1,1
  addDevice(-18,21,"mSpawn", 4, 5);		// Room -1,-1
  addDevice(-5,26,"mSpawn", 5, 3);		// Room 0,-1
  addDevice(4,26,"mSpawn", 3, 1);		// Room 0,-1
  addDevice(-2,14,"mSpawn", 3, 2);		// Room 0,-1
  addDevice(-27,-18,"mSpawn", 3, 9);	// Room -1,-3
  addDevice(-19,-22,"mSpawn", 3, 8);	// Room -1,-3
  addDevice(-16,-5.5,"mSpawn", 3, 3);	// Room -1,-2
  addDevice(-5,-17,"mSpawn", 2, 2);		// Room 0,-3
  addDevice(5,-17,"mSpawn", 3, 6);		// Room 0,-3
  addDevice(-0,-24,"mSpawn", 3, 1);		// Room 0,-3


  charSpawner = addDevice(-0.5,46.5,"aSpawn",0,0);
  bossSpawner = addDevice(19, -41,"aSpawn",1,0);
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  bossSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  currentLevel=7;
  levelNumber = 4;
}


function addBoss(x : float, y :float, c : Character){
	var monsterObject = new GameObject();					// Create a new empty game object that will hold a character.
	var monsterScript;
	monsterScript = monsterObject.AddComponent("MonsterWorm");		// Add the monster.js script to the object.
	
	monsterScript.transform.parent = monsterFolder.transform;
	monsterScript.transform.position = Vector3(x,y,0);		// Position the character at x,y.								
	
	monsterScript.init(c);
	boss = monsterScript;
	monsterScript.name = "Boss";
	monsterScript.manager = this;

	return monsterScript;
}

function OnGUI(){
	super.OnGUI();
}

function Update(){
	super.Update();
	var cams : Array = Camera.allCameras;
	//print(cams.length);
	for(var cam : Camera in cams){
		cam.transform.position.x = character.model.transform.position.x;
		cam.transform.position.y = character.model.transform.position.y;
		if (cam != Camera.main) cam.transform.position.z = -20;
		}
}


}