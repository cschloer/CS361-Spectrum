

public class GameLevel3 extends GameManager {


function Start(){
	super.Start();
	musicSound.clip = Resources.Load("Sounds/rhysGameMusic");
	musicSound.Play();
}

function levelInit(){
  roomCreate(-10,-10,0,"Plain5Tri.txt");
  roomCreate(-30, -10,0,"Plain2Adj.txt"); // Monster Left
  roomCreate(-30, 10,0,"Plain2Opp.txt");  // Monster Left
  roomCreate(-30, 30,0,"Plain4Opp.txt");  // Monter Left
  roomCreate( 10,-10,3,"Hole2Adj.txt");   // Hole Right
  roomCreate( 10, 10,0,"Hole5Tri.txt");   // Hole Right
  roomCreate( 30, 10,3,"Plain2End.txt");  // Hole Right
  roomCreate( 10, 30,2,"Hole3Opp.txt");   // Hole Right
  roomCreate(-10, 10,0,"Lava1Opp.txt");	  // Lava Middle
  roomCreate(-10, 30,0,"Lava2Opp.txt");	  // Lava Middle
  roomCreate(-10, 50,0,"Comb1Cross.txt"); // Joining
  roomCreate( 10, 50,2,"Plain2Adj.txt");  // Joining
  roomCreate(-30, 50,1,"Plain2Adj.txt");  // Joining
  roomCreate(-10, 70,0,"Comb1Opp.txt");   // Boss Prep
  roomCreate(-10, 90,2,"Plain1End.txt");   // Boss
  //addCake(-14.5,62); 	// Left
  addCake(-14.5,57);	// Left
  addCake(-24.5,45.5);	// Left
  //addCake(-23.5,25.5);// Left
  //addCake(14.5,-0.5);	// Right
  addCake(12,14.5);		// Right
  //addCake(36,19.5);	// Right
  addCake(19.5,54);		// Right
  addCake(-6,15);		// Middle
  //addCake(1.5,22.5);	// Middle
  //addCake(-0.5,35);	// Middle
  addCake(-0.5,48.5);	// Middle
  addCake(-4,72); 		// Final
  addCake(-0.5,86); 	// Final
  addDevice(-0.5,88,"barrier", 3, 7);
  addDevice(-11,59.5,"barrier", 0, 2);
  addDevice(10,59.5,"barrier", 0, 2);
  addDevice(-0.5,50.5,"barrier", 3, 2);
  addDevice(-18.5,-1.5,"mSpawn", 3, 1);	// Left 1
  addDevice( 22.5,-1.5,"mSpawn", 3, 1);	// Right 1
  addDevice(-20.5,17,"mSpawn", 4, 7);	// Left 2
  addDevice(-6,23.5,"mSpawn", 4, 3);	// Middle 1
  addDevice(-26.5,37.5,"mSpawn", 4, 3);	// Left 3
  addDevice(-25.5,57.5,"mSpawn", 4, 8);	// Left 4
  addDevice(-22.5,60.5,"mSpawn", 4, 1);	// Left 5
  addDevice(18.5,62,"mSpawn", 3, 3);
  addDevice(1.5,76.5,"mSpawn", 5, 5);
  charSpawner = addDevice(-0.5,-5,"aSpawn",0,0);
  bossSpawner = addDevice(0, 100,"aSpawn",1,0);
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  bossSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  currentLevel=6;
  levelNumber = 3;
}


function addBoss(x : float, y :float, c : Character){
	//todo: Rewire for new boss.
	addBossSMASH(x,y,c);
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